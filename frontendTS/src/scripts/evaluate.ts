import { ChessInstance, PieceColor, Square } from 'chess.js';
import {
  AttackPiece,
  EngineLine,
  Evaluation,
  Move,
  PlayerColor,
} from '../types/Game';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import {
  ClassificationScores,
  ClassName,
  emptyClassificationScores,
} from '../types/Review';

const getAttackers = (
  square: Square,
  plColor: PlayerColor,
  game: ChessInstance,
  verbose = false,
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
          if (verbose) {
            console.log('added');
            console.log(square);
          }
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
          if (verbose) console.log(possibleAttacker);
          if (verbose) {
            console.log('added');
            console.log(`${String.fromCharCode(newy)}${newx}`);
          }
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
          if (verbose) {
            console.log('added');
            console.log(`${String.fromCharCode(newy)}${newx}`);
          }
          attackers.push(possibleAttacker);
        }
      }
    }
  });
  return attackers;
};

const getNormalClassification = (
  cEvaluation: Evaluation,
  prevEvaluation: Evaluation,
  plColor: PlayerColor,
  plRating: number,
  opponentRating: number,
): ClassName => {
  const cAccuracy = getAccuracy(cEvaluation, plRating, opponentRating);
  const prevAccuracy = getAccuracy(prevEvaluation, plRating, opponentRating);
  const accuracyDiff = (cAccuracy - prevAccuracy) * plColor;
  return getClassifiValue(accuracyDiff);
};

const getClassifiValue = (accuracyDiff: number) => {
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

const getAccuracy = (
  evaluation: Evaluation,
  plRating: number,
  opponnetRating: number,
) => {
  if (evaluation.type == 'cp') {
    let normalizedEval =
      1.0 / (1.0 + Math.exp(-0.4 * (evaluation.value / 200)));
    let accuracyExp =
      1.0 / (1.0 + Math.pow(10, (opponnetRating - plRating) / 400));
    return Number((normalizedEval * accuracyExp * 2).toFixed(3));
  } else return 1;
};

const minwining = (rating: number, plColor: PlayerColor) => {
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

const minLosing = (rating: number, plColor: PlayerColor) => {
  return -1 * minwining(rating, plColor);
};

const isWining = (
  bestEvaluation: Evaluation,
  plRating: number,
  plColor: PlayerColor,
) => {
  if (bestEvaluation.type == 'cp') {
    return bestEvaluation.value * plColor >= minwining(plRating, plColor);
  } else {
    return bestEvaluation.value * plColor > 0;
  }
};

const isLosing = (
  bestEvaluation: Evaluation,
  plRating: number,
  plColor: PlayerColor,
) => {
  if (bestEvaluation.type == 'cp') {
    return bestEvaluation.value * plColor <= minLosing(plRating, plColor);
  } else {
    return bestEvaluation.value * plColor < 0;
  }
};

/**
 * Dosn't determines if the move were bad or good
 * just if it's  piece Sacrfice
 */
const isSac = (move: Move, game: ChessInstance, verbose = false) => {
  let plColor = move.piece[0];
  if (plColor == 'w') {
    var defenders = getAttackers(move.to, 1, game);
    var attackers = getAttackers(move.to, -1, game);
  } else {
    var defenders = getAttackers(move.to, -1, game);
    var attackers = getAttackers(move.to, 1, game);
  }
  let attackersOptions = [];
  let defenderOptions = [];
  defenders.sort((a, b) => getPieceValue(a.piece) - getPieceValue(b.piece));
  attackers.sort((a, b) => getPieceValue(a.piece) - getPieceValue(b.piece));
  let result = 0;
  let sacMoves = [];
  const gameCopy = { ...game };
  if (move.type == 'c' && move.captured) {
    result += getPieceValue(move.captured);
  }
  sacMoves.push(move.san);
  while (1) {
    // the attackers
    let i = 0;
    let endofattackers = false;
    let msg = '';

    if (verbose) {
      console.log(`i: ${i}`);
      console.log(`attackers options before ${attackersOptions}`);
    }
    attackersOptions.push({ result, moves: [...sacMoves] });
    if (verbose) console.log(`attackers options now ${attackersOptions}`);
    do {
      if (attackers && attackers.length > i) {
        let attackmove = attackers[i];
        if (verbose)
          console.log(
            `${attackmove.piece}, ${getPieceValue(attackmove.piece)}`,
          );
        var res = gameCopy.move({ from: attackmove.square, to: move.to });

        if (res) {
          if (res.flags == 'c' && res.captured) {
            result -= getPieceValue(
              `${res.color == 'b' ? 'w' : 'b'}${res.captured.toUpperCase()}` as Piece,
            );
            sacMoves.push(res.san);
            let captured = `${
              res.color == 'b' ? 'w' : 'b'
            }${res.captured.toUpperCase()}`;
            if (verbose)
              console.log(
                `attackers;  move: ${attackmove.piece} ,  from ${attackmove.piece} to ${move.to} captured: ${captured} res: ${result}`,
              );
          }
          // pop the first attacer
          attackers.splice(0, 1);
          if (verbose) {
            console.log(`attackers now ${attackers}`);
            console.log(attackmove);
            console.log(res);
          }
        } else i++;
      } else {
        msg = 'end of attackers';
        endofattackers = true;
        break;
      }
    } while (!res);
    if (endofattackers) {
      if (verbose) console.log(msg);
      break;
    }
    // the defenders
    i = 0;
    let endofdefenders = false;
    msg = '';
    if (verbose) console.log(`defenders options before ${defenderOptions}`);
    defenderOptions.push(result);
    if (verbose) console.log(`defenders options now ${defenderOptions}`);
    do {
      if (defenders && defenders.length > i) {
        let defendmove = defenders[i];
        if (verbose)
          console.log(
            `${defendmove.piece}, ${getPieceValue(defendmove.piece)}`,
          );
        var res = gameCopy.move({ from: defendmove.square, to: move.to });
        if (verbose)
          console.log(`defenders;  move: ${defendmove} , res: ${res}`);
        if (verbose) console.log(defendmove);
        if (verbose) console.log(res);
        if (res) {
          if (res.flags == 'c' && res.captured) {
            result += getPieceValue(
              `${res.color == 'b' ? 'w' : 'b'}${res.captured.toUpperCase()}` as Piece,
            );
            sacMoves.push(res.san);
          }
          if (verbose) console.log(`attackers options now`);
          if (verbose) console.log(attackersOptions);
          defenders.splice(0, 1);
        } else i++;
      } else {
        msg = 'end of defenders';
        endofdefenders = true;
        break;
      }
    } while (!res);
    if (endofdefenders) {
      if (verbose) console.log(msg);
      break;
    }
  }
  if (verbose) {
    console.log({ result });
    console.log(attackers);
    console.log(attackersOptions);
    console.log(defenders);
    console.log(defenderOptions);
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

const getPieceValue = (piece: Piece) => {
  // console.log(piece);
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

const getClassificationScore = (classificationNames: ClassName[]) => {
  let temp: ClassificationScores = { ...emptyClassificationScores };
  for (let i = 1; i < classificationNames.length; i++) {
    i % 2
      ? temp[classificationNames[i]][0]++
      : temp[classificationNames[i]][1]++;
  }
  return temp;
};

const isGreat = (
  prevEngineResponse: EngineLine[],
  iswining: boolean,
  islosing: boolean,
  waswining: boolean,
  waslosing: boolean,
  plRating: number,
  plColor: PlayerColor,
) => {
  if (prevEngineResponse.length > 1) {
    let wasLosing2Line = isLosing(
      prevEngineResponse[0].evaluation,
      plRating,
      plColor,
    );
    let wasWining2Line = isWining(
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

export {
  getNormalClassification,
  isSac,
  isWining,
  isLosing,
  getClassificationScore,
  isGreat,
};
