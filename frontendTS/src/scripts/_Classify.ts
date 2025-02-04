import {
  Chess,
  ChessInstance,
  PieceColor,
  Square,
  Move as chessjsMove,
} from 'chess.js';
import {
  AttackPiece,
  EngineLine,
  Evaluation,
  Game,
  Lan,
  Move,
  PlayerColor,
} from '../types/Game';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import { ClassName } from '../types/Review';
import { UserInfo } from '../types/User';
import { checkIfBook } from '../api/lichessApiAccess';

export class Classify {
  game: ChessInstance;
  sanMoves: string[];
  evaluations: Evaluation[];
  engineResponses: EngineLine[][];
  private classifications: [Number, ClassName][] = [];

  private minwining = (rating: number, plColor: PlayerColor) => {
    const wineval =
      rating <= 600
        ? 300.0
        : rating > 600 && rating <= 1000
          ? 250.0
          : rating > 1000 && rating <= 1400
            ? 200.0
            : rating > 1400 && rating <= 1800
              ? 150.0
              : 100.0;
    return wineval * plColor;
  };

  private minLosing = (rating: number, plColor: PlayerColor) => {
    return -1 * this.minwining(rating, plColor);
  };

  private isWining = (
    bestEvaluation: Evaluation,
    plRating: number,
    plColor: PlayerColor,
  ) => {
    if (bestEvaluation.type === 'cp') {
      return (
        bestEvaluation.value * plColor >=
        this.minwining(plRating, plColor) * plColor
      );
    } else {
      return bestEvaluation.value * plColor > 0;
    }
  };

  private isLosing = (
    bestEvaluation: Evaluation,
    plRating: number,
    plColor: PlayerColor,
  ) => {
    if (bestEvaluation.type === 'cp') {
      return (
        bestEvaluation.value * plColor <=
        this.minLosing(plRating, plColor) * plColor
      );
    } else {
      return bestEvaluation.value * plColor < 0;
    }
  };

  /**
   *
   * @param move
   * @param game
   * @param verbose
   * @returns verbose ? array of moves and result of each move : boolean
   * @returns !verbose ? boolean
   */
  private isSac = (move: Move, game: ChessInstance, verbose = false) => {
    let plColor = move.piece[0];
    if (plColor == 'w') {
      var defenders = this.getAttackers(move.to, 1, game);
      var attackers = this.getAttackers(move.to, -1, game);
    } else {
      var defenders = this.getAttackers(move.to, -1, game);
      var attackers = this.getAttackers(move.to, 1, game);
    }
    let attackersOptions = [];
    let defenderOptions = [];
    defenders.sort(
      (a, b) => this.getPieceValue(a.piece) - this.getPieceValue(b.piece),
    );
    attackers.sort(
      (a, b) => this.getPieceValue(a.piece) - this.getPieceValue(b.piece),
    );
    let result = 0;
    let sacMoves = [];
    const gameCopy = { ...game };
    if (move.type == 'c' && move.captured) {
      result += this.getPieceValue(move.captured);
    }
    sacMoves.push(move.san);
    while (1) {
      // the attackers
      let i = 0;
      let endofattackers = false;

      let msg;
      attackersOptions.push({ result, moves: [...sacMoves] });
      do {
        if (attackers && attackers.length > i) {
          let attackmove = attackers[i];
          var res = gameCopy.move({ from: attackmove.square, to: move.to });

          if (res) {
            if (res.flags == 'c' && res.captured) {
              result -= this.getPieceValue(
                `${res.color == 'b' ? 'w' : 'b'}${res.captured.toUpperCase()}` as Piece,
              );
              sacMoves.push(res.san);
            }
            // pop the first attacker
            attackers.splice(0, 1);
          } else i++;
        } else {
          msg = 'end of attackers';
          endofattackers = true;
          break;
        }
      } while (!res);
      if (endofattackers) {
        break;
      }
      // the defenders
      i = 0;
      let endofdefenders = false;
      msg = '';
      defenderOptions.push(result);
      do {
        if (defenders && defenders.length > i) {
          let defendmove = defenders[i];
          var res = gameCopy.move({ from: defendmove.square, to: move.to });
          if (res) {
            if (res.flags == 'c' && res.captured) {
              result += this.getPieceValue(
                `${res.color == 'b' ? 'w' : 'b'}${res.captured.toUpperCase()}` as Piece,
              );
              sacMoves.push(res.san);
            }
            defenders.splice(0, 1);
          } else i++;
        } else {
          msg = 'end of defenders';
          endofdefenders = true;
          break;
        }
      } while (!res);
      if (endofdefenders) {
        break;
      }
    }
    // sort the attacking pieces by the piece value
    attackersOptions.sort((a, b) => a.result - b.result);
    const returnValue = attackersOptions
      ? {
          result: attackersOptions[0].result <= -2,
          moves: attackersOptions
            .filter((option) => option.result <= -2) // @ts-ignore
            .reduce((prevoption, option) => option.moves, []),
        }
      : { result: false, moves: [] };
    return !verbose ? returnValue.result : returnValue;
  };

  private isGreat = (
    prevEngineResponse: EngineLine[],
    iswining: boolean,
    islosing: boolean,
    waswining: boolean,
    waslosing: boolean,
    plRating: number,
    plColor: PlayerColor,
  ) => {
    if (prevEngineResponse.length > 1) {
      let wasLosing2Line = this.isLosing(
        prevEngineResponse[0].evaluation,
        plRating,
        plColor,
      );
      let wasWining2Line = this.isWining(
        prevEngineResponse[0].evaluation,
        plRating,
        plColor,
      );
      let isDrawing = !iswining && !islosing;
      let wasDrawing = !waswining && !waslosing;

      if (
        (waswining && iswining && !wasWining2Line) ||
        (waslosing &&
          ((iswining && !wasWining2Line) || (isDrawing && wasLosing2Line))) ||
        (wasDrawing &&
          ((isDrawing && wasLosing2Line) || (iswining && !wasWining2Line)))
      ) {
        return true;
      }
    }

    return false;
  };

  private getNormalClassification = (
    cEvaluation: Evaluation,
    prevEvaluation: Evaluation,
    plColor: PlayerColor,
    plRating: number,
    opponentRating: number,
  ): ClassName => {
    console.log({
      anas: { cEvaluation, prevEvaluation, plColor, plRating, opponentRating },
    });
    const cAccuracy = this.getAccuracy(cEvaluation, plRating, opponentRating);

    const prevAccuracy = this.getAccuracy(
      prevEvaluation,
      plRating,
      opponentRating,
    );
    const accuracyDiff = (cAccuracy - prevAccuracy) * plColor;
    return this.getClassifiValue(accuracyDiff);
  };

  private getAttackers = (
    square: Square,
    plColor: PlayerColor,
    game: ChessInstance,
  ): AttackPiece[] => {
    console.log('-------------------------------------------------');
    let y = square[0].charCodeAt(0),
      x = parseInt(square[1]);
    let attackers: AttackPiece[] = [];
    let playerColor: PieceColor = plColor ? 'w' : 'b';
    // check rank
    let filerankinc = [
      { xinc: 0, yinc: 1 },
      { xinc: 1, yinc: 0 },
      { xinc: 0, yinc: -1 },
      { xinc: -1, yinc: 0 },
    ];

    filerankinc.forEach((value) => {
      let newx = x + value.xinc;
      let newy = y + value.yinc;
      for (let i = 1; i < 8; i++) {
        if (
          (newx == x && newy == y) ||
          ((newx > 8 || newx < 0) && newy > 'h'.charCodeAt(0)) ||
          newy < 'a'.charCodeAt(0)
        )
          break;
        let square = `${String.fromCharCode(newy)}${newx}` as Square;
        let possiblePiece = game.get(square);
        if (possiblePiece) {
          var possibleAttacker: AttackPiece = {
            piece:
              `${possiblePiece.color}${possiblePiece.type.toUpperCase()}` as Piece,
            square,
          };
          if (
            possiblePiece &&
            possiblePiece.color == playerColor &&
            (possiblePiece.type == 'r' ||
              possiblePiece.type == 'q' ||
              (possiblePiece.type == 'k' && Math.abs(newx - x) == 1))
          ) {
            attackers.push(possibleAttacker);
            break;
          } else if (possibleAttacker) {
            break;
          }
        }

        newx += value.xinc;
        newy += value.yinc;
      }
    });

    //diagonal work
    let diagonalInc = [
      { xinc: 1, yinc: 1 },
      { xinc: -1, yinc: 1 },
      { xinc: 1, yinc: -1 },
      { xinc: -1, yinc: -1 },
    ];
    diagonalInc.forEach((value) => {
      let newx = x + value.xinc;
      let newy = y + value.yinc;
      for (let i = 1; i < 8; i++) {
        if (
          (newx != x && newy == y) ||
          ((newx > 8 || newx < 0) && newy > 'h'.charCodeAt(0)) ||
          newy < 'a'.charCodeAt(0)
        )
          break;
        let square = `${String.fromCharCode(newy)}${newx}` as Square;
        let possiblePiece = game.get(square);
        if (possiblePiece) {
          var possibleAttacker: AttackPiece = {
            piece:
              `${possiblePiece.color}${possiblePiece.type.toUpperCase()}` as Piece,
            square,
          };

          if (
            possiblePiece &&
            possiblePiece.color == playerColor &&
            (possiblePiece.type == 'b' ||
              possiblePiece.type == 'q' ||
              (possiblePiece.type == 'p' && possiblePiece.color == 'w'
                ? x - newx == 1
                : newx - x) ||
              (possiblePiece.type == 'k' && Math.abs(newx - x) == 1))
          ) {
            attackers.push(possibleAttacker);
            break;
          } else if (possibleAttacker) {
            break;
          }
        }

        newx += value.xinc;
        newy += value.yinc;
      }
    });

    let nightDirec = [
      { xinc: 2, yinc: -1 },
      { xinc: 2, yinc: 1 },
      { xinc: -2, yinc: 1 },
      { xinc: -2, yinc: -1 },
      { xinc: -1, yinc: 2 },
      { xinc: 1, yinc: 2 },
      { xinc: -1, yinc: -2 },
      { xinc: 1, yinc: -2 },
    ];
    nightDirec.forEach((val) => {
      let newx = x + val.xinc,
        newy = y + val.yinc;
      if (newx <= 8 || newy <= 'h'.charCodeAt(0)) {
        /* let possibleAttacker = game.get(`${String.fromCharCode(newy)}${newx}`); */
        let square = `${String.fromCharCode(newy)}${newx}` as Square;
        let possiblePiece = game.get(square);
        if (possiblePiece) {
          var possibleAttacker: AttackPiece = {
            piece:
              `${possiblePiece.color}${possiblePiece.type.toUpperCase()}` as Piece,
            square,
          };
          if (
            possibleAttacker &&
            possiblePiece.type == 'n' &&
            possiblePiece.color == playerColor
          ) {
            attackers.push(possibleAttacker);
          }
        }
      }
    });
    return attackers;
  };

  private getPieceValue = (piece: Piece) => {
    switch (piece[1].toLowerCase()) {
      case 'p':
        return 1;
      case 'n':
        return 3;
      case 'b':
        return 3;
      case 'r':
        return 5;
      case 'q':
        return 8;
      case 'k':
        return 15;
      default:
        return 16;
    }
  };

  private getClassifiValue = (accuracyDiff: number) => {
    const errorPercent = Number((accuracyDiff * 100).toFixed(3));
    return errorPercent >= -2
      ? 'excellent'
      : errorPercent < -2 && errorPercent >= -5
        ? 'good'
        : errorPercent < -5 && errorPercent >= -9
          ? 'inaccuracy'
          : errorPercent < -9 && errorPercent >= -19
            ? 'mistake'
            : 'blunder';
  };

  private getAccuracy = (
    evaluation: Evaluation,
    plRating: number,
    opponnetRating: number,
  ) => {
    if (evaluation.type == 'cp') {
      let normalizedEval =
        1.0 / (1.0 + Math.exp(-0.4 * (evaluation.value / 200)));
      let accuracyExp =
        1.0 / (1.0 + Math.pow(10, (opponnetRating - plRating) / 400));
      return normalizedEval;
      return Number((normalizedEval * accuracyExp * 2).toFixed(3));
    } else return 1;
  };

  getMoveClassification = async (params: {
    engineResponse: EngineLine[];
    plColor: PlayerColor;
    moveNum: number;
    gameInfo: Game;
    initial_Evaluation: Evaluation;
  }) => {
    console.log({
      engineResponse: params.engineResponse,
      plcolor: params.plColor,
      movenum: params.moveNum,
      gameinfo: params.gameInfo,
      initialeval: params.initial_Evaluation,
    });
    if (!params.engineResponse.length) return 'best';
    this.engineResponses.push(params.engineResponse);
    this.evaluations.push(
      params.engineResponse[params.engineResponse.length - 1].evaluation,
    );
    if (params.moveNum == 1) {
      // restart game on chess.js
      this.game.reset();
      //return 'book';
    }
    if (this.sanMoves && params.gameInfo) {
      let plColor: PlayerColor, opponent: UserInfo, player: UserInfo;
      let move: string = this.sanMoves[params.moveNum - 1];
      console.log(this.game.history());
      console.log(this.game.history()[this.game.history().length - 1]);
      console.log(this.sanMoves[params.moveNum - 1]);
      if (this.game.history().length === params.moveNum - 1) {
        const lastMove = this.game.move(move) as chessjsMove;
        if (!lastMove)
          throw new Error(
            `illigal move num: ${params.moveNum} move= ${this.sanMoves[params.moveNum - 1]}`,
          );
        if (params.moveNum % 2) {
          player = params.gameInfo.wuser;
          opponent = params.gameInfo.buser;
          plColor = 1;
        } else {
          player = params.gameInfo.buser;
          opponent = params.gameInfo.wuser;
          plColor = -1;
        }
        const bestEngineLine: EngineLine =
          params.engineResponse[params.engineResponse.length - 1];
        const current_evaluation: Evaluation = bestEngineLine.evaluation;
        const prev_evaluation: Evaluation =
          params.moveNum == 1
            ? params.initial_Evaluation
            : this.evaluations[params.moveNum - 2];

        //let maxClassification = 6;
        let firstMiddleGame = 0;
        //let firsetEndGame = 0;
        let iswining = this.isWining(
          current_evaluation,
          player.rating,
          plColor,
        );
        let waswining = this.isWining(prev_evaluation, player.rating, plColor);
        let waslosing = this.isLosing(prev_evaluation, player.rating, plColor);
        let islosing = this.isLosing(
          current_evaluation,
          player.rating,
          plColor,
        );
        let currentPieceChar = lastMove.piece;
        let isQueen = currentPieceChar
          ? currentPieceChar.toLowerCase() == 'q'
          : false;
        let lastMoveAsMove: Move = {
          from: lastMove.from,
          to: lastMove.to,
          promotion: lastMove.promotion,
          san: lastMove.san,
          captured:
            plColor == 1
              ? (`b${lastMove.captured?.toUpperCase()}` as Piece)
              : (`w${lastMove.captured?.toUpperCase()}` as Piece),
          type: lastMove.flags,
          lan: `${lastMove.from}${lastMove.to}` as Lan,
          piece:
            plColor == 1
              ? (`w${lastMove.piece.toUpperCase()}` as Piece)
              : (`b${lastMove.piece.toUpperCase()}` as Piece),
        };
        let isSacc: any = { result: false };
        if (this.game) {
          isSacc = this.isSac(lastMoveAsMove, new Chess(this.game.fen()));
        }
        console.log({
          engineResponses: this.engineResponses[params.moveNum - 1],
        });
        // is best when its one of top lines returned by the engine
        let isbest =
          params.moveNum === 1
            ? false
            : this.engineResponses[params.moveNum - 2].length > 1
              ? this.engineResponses[params.moveNum - 2].find(
                  (engineLine, index) => {
                    console.log({ engineLine, index });
                    console.log({
                      engineLinebestmove: engineLine.bestMove,
                      lastmovelan: lastMoveAsMove.lan,
                    });
                    console.log({
                      index,
                      supposedindex:
                        this.engineResponses[params.moveNum - 2].length - 1,
                    });
                    if (
                      engineLine.bestMove == lastMoveAsMove.lan &&
                      // if it's the last (best) line then automatically it's the bestmove
                      (index ===
                        this.engineResponses[params.moveNum - 2].length - 1 || // else it has to be the same type as best line
                        (engineLine.evaluation.type ==
                          bestEngineLine.evaluation.type &&
                          (engineLine.evaluation.type == 'mate' ||
                            // For centipawn evaluations, check if it's within 2 centipawns of the top move
                            Math.abs(
                              engineLine.evaluation.value -
                                bestEngineLine.evaluation.value,
                            ) <= 50)))
                    )
                      return true;
                    else return false;
                  },
                )
                ? true
                : false
              : false;

        // u set the first move of middle game after last opening move  (book move)
        if (!firstMiddleGame) {
          //check book sanMoves
          let isBook = this.game
            ? await checkIfBook(this.game.fen())
            : { ok: false };
          if (isBook.ok) {
            return 'book';
          } else {
            firstMiddleGame = params.moveNum;
          }
        }
        let normalClassification = this.getNormalClassification(
          current_evaluation,
          prev_evaluation,
          plColor,
          player.rating,
          opponent.rating,
        );
        if (
          this.isGreat(
            params.engineResponse,
            iswining,
            islosing,
            waswining,
            waslosing,
            player.rating,
            plColor,
          )
        ) {
          return 'great';
        }
        if (isSacc) {
          if (isbest) {
            if ((waswining && iswining) || (!waswining && !islosing))
              return 'brilliant';
            else return 'best';
          }
          if (islosing && isQueen) {
            return 'botezgambit';
          }
          return normalClassification;
        } else if (isbest) {
          return 'best';
        } /* else if (
          normalClassification == 'mistake' ||
          normalClassification == 'blunder' ||
          (normalClassification == 'inaccuracy' && iswining)
        ) {
          return 'missed';
        } */ else return normalClassification;
      }
    }
    return 'unknown';
  };

  getGameClassifications = async ({
    engineResponses,
    gameInfo,
    initial_Evaluation,
  }: {
    engineResponses: EngineLine[][];
    gameInfo: Game;
    initial_Evaluation: Evaluation;
  }): Promise<{ classification_names: ClassName[] }> => {
    return new Promise((res, rej) => {
      engineResponses.forEach((engineResponse, index) => {
        this.getMoveClassification({
          engineResponse,
          plColor: index % 2 ? -1 : 1,
          moveNum: index + 1,
          gameInfo,
          initial_Evaluation,
        }).then((classname) => {
          this.classifications.push([index + 1, classname]);
          if (this.classifications.length == this.sanMoves.length) {
            const classificationnames: ClassName[] = this.classifications
              .sort((a, b) => {
                return Number(a[0]) - Number(b[0]);
              })
              .map((v) => v[1]);
            res({ classification_names: classificationnames });
          }
        });
      });
    });
  };

  _init(params: {
    game?: ChessInstance;
    evaluations?: Evaluation[];
    engineResponses?: EngineLine[][];
  }) {
    this.game = params.game ? params.game : new Chess();
    this.evaluations = params.evaluations ? params.evaluations : [];
    this.engineResponses = params.engineResponses ? params.engineResponses : [];
  }

  constructor(params: {
    fen?: string;
    pgn?: string;
    sanMoves: string[];
    evaluations?: Evaluation[];
  }) {
    this.sanMoves = params.sanMoves;

    if (params.evaluations) this.evaluations = params.evaluations;
    else this.evaluations = [];

    this.engineResponses = [];

    if (params.fen) this.game = new Chess(params.fen);
    else if (params.pgn) {
      this.game = new Chess();
      this.game.load_pgn(params.pgn);
    } else this.game = new Chess();
  }
}
