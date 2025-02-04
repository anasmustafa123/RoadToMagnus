import type { EngineLine, Evaluation, Lan } from '../types/Game';
import type GameReviewManager from './_GameReviewManager';

class StockfishWorker {
  private workerUrl: URL;
  private stockfishWorker: Worker;
  private verbose: boolean;
  private multipv: number;
  private targetDepth: number;
  readonly game_review_manager: GameReviewManager;

  private waitFor(response: string, errormsg = 'error') {
    return new Promise((resolve, reject) => {
      const listener = <K extends keyof WorkerEventMap>(
        e: WorkerEventMap[K],
      ) => {
        if (this.verbose) console.debug(e);
        if (e instanceof MessageEvent && e.data.includes(response)) {
          this.stockfishWorker.removeEventListener('message', listener);
          resolve(true);
        }
      };
      this.stockfishWorker.addEventListener('message', listener);
      // Add a timeout for error handling (optional)
      setTimeout(() => {
        this.stockfishWorker.removeEventListener('message', listener);
        reject(`delay time exceeded: ${errormsg}`);
      }, 5000);
    });
  }

  _init(restart = false) {
    return new Promise(async (resolve) => {
      this.stockfishWorker.onmessageerror = (e) => console.debug(e);
      if (!restart) {
        this.stockfishWorker.postMessage('uci');
        await this.waitFor('uciok', 'uci setup error');
      } else console.debug('Restarting engine...');
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

  private evaluateMove(fen: string = 'startpos'): Promise<EngineLine[]> {
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
        if (e instanceof MessageEvent) {
          messages.unshift(e.data);
          if (e.data.includes('depth 0')) {
            if (this.verbose) console.warn(`${e}`);
          }
          if (e.data.startsWith('bestmove') || e.data.includes('depth 0')) {
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
                lines.push(
                  {
                    id: parseInt(idString),
                    depth: parseInt(depthString),
                    evaluation: { type: 'mate', value: 0 },
                    bestMove: 'a1a1',
                  },
                  {
                    id: parseInt(idString),
                    depth: parseInt(depthString),
                    evaluation: { type: 'mate', value: 0 },
                    bestMove: 'a1a1',
                  },
                );
                resolve(lines);
                return;
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
            console.debug('cleared time out id');
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

  async evaluatePosition(after_each_move_callback: () => any) {
    console.log('evaluating position');
    while (!this.game_review_manager.done_evaluating()) {
      const { current_fen, move_num, sanmove } =
        this.game_review_manager.get_next_move();
      console.log({ current_fen, move_num, sanmove });
      const engineLines = await this.evaluateMove(current_fen);
      after_each_move_callback();
      this.game_review_manager.add_enginelines(engineLines, move_num);
    }
  }

  /**
   * @param startingpos : fen format
   * @param multipv : number of lines to return
   * @param verbose : testing
   */
  constructor(
    game_review_manager: GameReviewManager,
    multipv = 2,
    targetDepth = 15,
    verbose = false,
  ) {
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
    this.game_review_manager = game_review_manager;
  }
}
export default StockfishWorker;
