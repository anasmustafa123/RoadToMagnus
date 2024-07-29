import { getFenArr } from './convert';
import { parsePgn } from './pgn';
import type { EngineLine, Evaluation, Lan } from '../types/Game';
import { resolveObjectKey } from 'chart.js/helpers';
export class ChessEngine {
  private workerUrl: URL;
  private stockfishWorker: Worker;
  private verbose: boolean;
  private multipv: number;
  targetDepth: number;

  async waitFor(response: string, errormsg = 'error') {
    return new Promise((resolve, reject) => {
      const listener = <K extends keyof WorkerEventMap>(
        e: WorkerEventMap[K],
      ) => {
        if (this.verbose) console.log(e);
        if (e instanceof MessageEvent && e.data.includes(response)) {
          this.stockfishWorker.removeEventListener('message', listener);
          resolve(true);
        }
      };
      this.stockfishWorker.addEventListener('message', listener);
      // Add a timeout for error handling (optional)
      setTimeout(() => {
        this.stockfishWorker.removeEventListener('message', listener);
      }, 20000); // Adjust timeout as needed
    });
  }

  /**
   *  kickstarts the engine
   */
  _init(restart = false) {
    return new Promise(async (resolve) => {
      this.stockfishWorker.onmessageerror = (e) => console.log(e);
      if (!restart) {
        this.stockfishWorker.postMessage('uci');
        await this.waitFor('uciok', 'uci setup error');
      } else console.log('Restarting engine...');
      this.stockfishWorker.postMessage(`ucinewgame`);
      this.stockfishWorker.postMessage('isready');
      this.stockfishWorker.postMessage(
        `setoption name MultiPV value ${this.multipv}`,
      );
      this.waitFor('readyok', 'this.stockfishWorker not ready after timeout')
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  }

  /**
   * @param fen empty input evaluateMove starting position
   */
  async evaluateMove(fen: string = 'startpos'): Promise<any> {
    !fen || fen == 'startpos'
      ? this.stockfishWorker.postMessage(`position startpos`)
      : this.stockfishWorker.postMessage(`position fen ${fen}`);
    this.stockfishWorker.postMessage(`go depth ${this.targetDepth}`);

    let messages = [];
    let lines: EngineLine[] = [];
    return new Promise((resolve, reject) => {
      const listener = <K extends keyof WorkerEventMap>(
        e: WorkerEventMap[K],
      ) => {
        //console.log('evaluateMove');
        if (this.verbose) console.log(e);
        if (e instanceof MessageEvent) {
          messages.unshift(e.data);
          if (e.data.includes('depth 0')) {
            if (this.verbose) console.log(`one ${e}`);
          }
          if (e.data.startsWith('bestmove') || e.data.includes('depth 0')) {
            console.log('bestmove');
            console.log(e.data);
            this.stockfishWorker.removeEventListener('message', listener);
            let searchMessages = messages.filter((msg) =>
              msg.startsWith('info depth'),
            );
            for (let searchMessage of searchMessages) {
              // Extract depth, MultiPV line ID and evaluation from search message
              let idString = searchMessage.match(/(?:multipv )(\d+)/)?.[1];
              let depthString = searchMessage.match(/(?:depth )(\d+)/)?.[1];

              let bestMove: Lan =
                searchMessage.match(/(?: pv )(.+?)(?= |$)/)?.[1];

              let evaluation: Evaluation = {
                type: searchMessage.includes(' cp ') ? 'cp' : 'mate',
                value: parseInt(
                  searchMessage.match(/(?:(?:cp )|(?:mate ))([\d-]+)/)?.[1] ||
                    '0',
                ),
              };

              // Invert evaluation if black to play since scores are from black perspective
              // and we want them always from the perspective of white
              if (fen && fen.includes(' b ')) {
                evaluation.value *= -1;
              }

              // If any piece of data from message is missing, discard message
              if (!idString || !depthString || !bestMove) {
                console.error('missid pram');
                continue;
              }

              let id = parseInt(idString);
              let depth = parseInt(depthString);

              // Discard if target depth not reached or lineID already present
              if (
                depth != this.targetDepth ||
                lines.some((line) => line.id == id)
              )
                continue;

              lines.push({
                id,
                depth,
                evaluation,
                bestMove,
              });
            }
            clearTimeout(timeoutId); // Clear the timeout if message is received
            resolve(lines);
          }
        }
      };
      this.stockfishWorker.addEventListener('message', listener);
      const timeoutId = setTimeout(async () => {
        this.stockfishWorker.removeEventListener('message', listener);

        reject(new Error('takes alot of time'));
      }, 20000); // Adjust timeout as needed
    });
  }

  /**
   * restart the engine after being stuck for a while
   */
  private async restartEngine(fen: string) {
    return new Promise(async (resolve, reject) => {
      this.stockfishWorker.terminate();
      this.stockfishWorker = new Worker(this.workerUrl, { type: 'classic' });
      try {
        await this._init();
        await this.evaluateMove(fen);
        resolve(true);
      } catch (error) {
        reject('Error restarting the engine:' + error);
      }
    });
  }

  /**
   * @param param
   * @returns
   */
  async evaluatePosition(param: {
    pgn: string;
    moves?: string[];
    afterMoveCallback: (param: {
      ok: boolean;
      moveNum: number;
      sanMove: string;
      lines: EngineLine[];
    }) => any;
  }) {
    return new Promise(async (resolve) => {
      let moves: string[] = [];
      if (param.pgn) {
        try {
          const res = parsePgn(param.pgn);
          //console.log(res);
          moves = res.moves;
        } catch (e) {
          throw new Error("couldn't parse pgn" + e);
        }
      } else if (param.moves) {
        moves = param.moves;
      }
      const fens = getFenArr(moves);
      if (this.verbose) console.log(fens);
      await this.evaluateMove().then((lines) =>
        param.afterMoveCallback({ ok: true, moveNum: 0, sanMove: '', lines }),
      );
      let lines = [];
      for (let index = 0; index < fens.length; index++) {
        let fen = fens[index];
        try {
          lines = await this.evaluateMove(fen);
        } catch (e) {
          console.log('it realy takes  a lot of time');
          try {
            console.log(`current movenum ${index + 1}`);
            await this.restartEngine(fen);
          } catch (e) {
            console.error(e);
            console.error(new Error('takes alot of time'));
          }
        }
        param.afterMoveCallback({
          ok: true,
          sanMove: moves[index],
          moveNum: index + 1,
          lines,
        });
      }
      this.stockfishWorker.terminate();
      resolve(true);
    });
  }

  /**
   * @param startingpos : fen format
   * @param multipv : number of lines to return
   * @param verbose : testing
   */
  constructor(multipv = 2, targetDepth: number = 15, verbose = false) {
    var wasmSupported =
      typeof WebAssembly === 'object' &&
      WebAssembly.validate(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
      );

    this.workerUrl = wasmSupported
      ? new URL('./stockfish/stockfish.js', import.meta.url)
      : new URL('./stockfish/stockfish.wasm.js', import.meta.url);
    this.stockfishWorker = new Worker(this.workerUrl, { type: 'classic' });
    this.multipv = multipv;
    this.evaluateMove = this.evaluateMove.bind(this);
    this.targetDepth = targetDepth;
    this.verbose = verbose;
    this.waitFor = this.waitFor.bind(this);
    this.evaluatePosition = this.evaluatePosition.bind(this);
  }
}
