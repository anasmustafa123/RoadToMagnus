import { getFenArr } from './convert';
import { parsePgn } from './pgn';
import type { EngineLine, Evaluation, Lan } from '../types/Game';
export class ChessEngine {
  readonly workerUrl: URL;
  readonly stockfishWorker: Worker;
  readonly verbose: boolean;
  readonly multipv: number;
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
        //stockfish.terminate();
        reject(new Error(errormsg));
      }, 20000); // Adjust timeout as needed
    });
  }

  /**
   * @returns kickstarts the engine
   */
  _init(restart = false) {
    return new Promise(async (resolve) => {
      if (!restart) {
        this.stockfishWorker.postMessage('uci');
        await this.waitFor('uciok', 'uci setup error');
      }
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
        console.log('evaluateMove');
        if (this.verbose) console.log(e);
        if (e instanceof MessageEvent) {
          messages.unshift(e.data);
          if (e.data.includes('depth 0')) {
            if (this.verbose) console.log(`one ${e}`);
          }
          if (e.data.startsWith('bestmove') || e.data.includes('depth 0')) {
            console.log('bestmove');
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
            resolve(lines);
          }
        }
      };
      this.stockfishWorker.addEventListener('message', listener);
      setTimeout(() => {
        this.stockfishWorker.removeEventListener('message', listener);
        //stockfish.terminate();
        reject(new Error('takes alot of timme'));
      }, 20000); // Adjust timeout as needed
    });
  }

  /**
   * @param param
   * @returns
   */
  async evaluatePosition(param: {
    pgn: string;
    moves?: string[];
    afterMoveCallback: (param: { ok: boolean; lines: EngineLine[] }) => any;
  }) {
    return new Promise(async (resolve) => {
      let moves: string[] = [];
      if (param.pgn) {
        try {
          const res = parsePgn(param.pgn);
          console.log(res);
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
        param.afterMoveCallback({ ok: true, lines }),
      );
      for (let fen of fens) {
        console.log(fen);
        let lines = await this.evaluateMove(fen);
        param.afterMoveCallback({ ok: true, lines });
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
    this.workerUrl = new URL(
      './stockfish/stockfish-worker.js',
      import.meta.url,
    );
    this.stockfishWorker = new Worker(this.workerUrl, { type: 'classic' });
    this.multipv = multipv;
    this.evaluateMove = this.evaluateMove.bind(this);
    this.targetDepth = targetDepth;
    this.verbose = verbose;
    this.waitFor = this.waitFor.bind(this);
    this.evaluatePosition = this.evaluatePosition.bind(this);
  }
}
