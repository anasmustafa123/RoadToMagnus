import {
  Evaluation,
  Game,
  GameResult,
  GameType,
  Lan,
  Move,
} from '../types/Game';
import { UserInfo } from '../types/User';
import {
  Classification,
  classificationInfo,
  ClassName,
  ClassSymbol,
} from '../types/Review';
import { Chess, PieceType } from 'chess.js';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import { Vendor } from '../types/Api';
const constructPgn = (
  wplayer: UserInfo,
  bplayer: UserInfo,
  result: GameResult,
  moves: Move[],
  clks: string[],
  evaluations: Evaluation[],
  classifi_names: ClassName[],
) => {
  let res = '';
  res += wplayer.username ? getHeader('White', wplayer.username) : '';
  res += wplayer.rating ? getHeader('WhiteElo', `${wplayer.rating}`) : '';
  res += bplayer.username ? getHeader('Black', bplayer.username) : '';
  res += bplayer.rating ? getHeader('BlackElo', `${bplayer.rating}`) : '';
  res += result
    ? getHeader(
        'Result',
        result == 1 ? '1-0' : result == -1 ? '0-1' : '1/2-1/2',
      )
    : '';
  res += '\n';
  const classifi_keys = convert_classiName_to_sym(classifi_names);
  console.log({
    1: moves.length,
    2: clks.length,
    3: evaluations.length,
    4: classifi_keys.length,
  });
  console.log(evaluations);
  if (moves.length === clks.length) {
    if (clks.length === evaluations.length) {
      res += pgnMerge(moves, clks, evaluations, classifi_keys);
    } else {
      res += pgnMerge(moves, clks);
    }
  } else {
    res += pgnMerge(moves);
  }

  return res;
};

const parsePgn = (pgn: string) => {
  let wname: string = '',
    wrating: number = 0,
    bname: string = '',
    brating: number = 0,
    result: GameResult,
    date: `${string}-${string}` = '-',
    gameType: GameType;
  let clks = [],
    evaluations: Evaluation[] = [],
    classifi: Classification[] = [],
    moves = [],
    gameId = '';

  const [header, body] = String(pgn).split(/\n\s*\n/);
  header.split('\n').forEach((line) => {
    if (line.startsWith('[White ')) {
      wname = line.slice(8, -2);
    } else if (line.startsWith('[WhiteElo ')) {
      wrating = parseInt(line.slice(11, -2));
    } else if (line.startsWith('[Black ')) {
      bname = line.slice(8, -2);
    } else if (line.startsWith('[BlackElo ')) {
      brating = parseInt(line.slice(11, -2));
    } else if (line.startsWith('[Result ')) {
      const resultStr = line.slice(line.indexOf('"') + 1, -2).split('-')[0];
      result = resultStr.length > 1 ? 0 : !parseInt(resultStr) ? -1 : 1;
    } else if (line.startsWith('[UTCDate ')) {
      const res = new Date(line.slice(line.indexOf('"') + 1, -2));
      date = `${res.getFullYear()}-${res.getMonth() + 1}`;
    } else if (line.startsWith('[TimeControl')) {
      let res =
        parseInt(line.slice(line.indexOf('"') + 1, -2).split('-')[0]) / 60;
      gameType =
        res > 30
          ? 'daily'
          : res >= 10
            ? 'rapid'
            : res >= 1
              ? 'blitz'
              : 'bullet';
    } else if (line.startsWith('[Link')) {
      // chess.com pgn
      let url = line.slice(line.indexOf('"') + 1, -2);
      let urlarr = url.split('/');
      gameId = urlarr[urlarr.length - 1];
    } else if (line.startsWith('[Site') && !line.includes('chess.com')) {
      let url = line.slice(line.indexOf('"') + 1, -2);
      let urlarr = url.split('/');
      gameId = urlarr[urlarr.length - 1];
    }
  });
  const parts = body.split(/\s+/);

  for (let i = 1; i < parts.length; i++) {
    if (!parts[i]) continue;
    if (parts[i].indexOf(':') != -1) {
      if (parts[i].endsWith(']}')) {
        clks.push(parts[i].slice(0, -2));
      } else {
        clks.push(parts[i]);
      }
      continue;
    }

    if (startsWithAlpha(parts[i])) {
      moves.push(parts[i]);
    } else if (parts[i] == '%eval') {
      if (parts[i].endsWith(']}')) {
        let evalarr = parts[i].slice(0, -2).split('-');
        evaluations.push({
          type: evalarr[0] as 'mate' | 'cp',
          value: parseFloat(evalarr[1]),
        });
      } else {
        let evalarr = parts[i + 1];
        evaluations.push({
          type: evalarr[0] as 'mate' | 'cp',
          value: parseFloat(evalarr[1]),
        });
      }
    } else if (parts[i] == '%classi') {
      let sym = parts[i].slice(0, -2) as ClassSymbol;
      let classification = classificationInfo.find((v) => {
        v.sym == sym;
      });
      if (classification) {
        classifi.push(classification);
      }
    }
  } // @ts-ignore
  if (!wname || !bname || !wrating || !brating || !date || !gameType) {
    throw new Error();
  }
  return {
    wuser: { username: wname, rating: wrating },
    buser: { username: bname, rating: brating }, // @ts-ignore
    gameResult: result,
    moves,
    movesCount: moves.length,
    clks,
    evaluations,
    classifi,
    date,
    gameType,
    gameId,
    isReviewed: classifi.length ? true : false,
    pgn,
  };
};

const getHeader = (title: string, content: string) =>
  `[${title} "${content}"]\n`;

function startsWithAlpha(str: string) {
  const charCode = str.charCodeAt(0);
  return (
    (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)
  );
}
const convert_classiName_to_sym = (classiNames: ClassName[]) => {
  return classiNames.map((classiName) => {
    const classification_sym = classificationInfo.find(
      (v) => v.name == classiName,
    )?.sym;
    return classification_sym ? classification_sym : '????';
  });
};
/**
 *
 * @param {Move[]} moves Move[]
 * @param {string[] | Evaluation[]} sec can be clks:string[] or evaluations:Evaluation[]
 * @param {Evaluation[]} third  is evaluations
 * @param {Classification.sym[]} fourth is string[]
 * @returns
 */
function pgnMerge(
  moves: Move[],
  sec?: string[] | Evaluation[],
  third?: Evaluation[],
  fourth?: string[],
) {
  if (sec && third && fourth) {
    if (typeof sec[0] === 'string') {
      // clks and evaluations and classifi
      return moves
        .map((move, i) =>
          !(i % 2)
            ? `${i / 2 + 1}. ${move.san} {[%clk ${sec[i]} %eval ${
                third[i].value
              } %classif ${fourth[i]}]} `
            : `${Math.floor(i / 2) + 1}... ${move.san} {[%clk ${sec[i]} %eval ${
                third[i].value
              } %classif ${fourth[i]}]} `,
        )
        .join('');
    } else {
      // evaluations and evaluations and classifi
      return moves.map((move, i) =>
        !(i % 2)
          ? `${i / 2 + 1}. ${move.san} {[%eval ${third[i].value} %classif ${fourth[i]}]} `
          : `${Math.floor(i / 2) + 1}... ${move.san} {[%eval ${third[i].value} %classif ${fourth[i]}]} `,
      );
    }
  } else if (sec && third) {
    if (sec.length === third.length) {
      if (typeof sec[0] === 'string') {
        // clks and evaluations
        return moves
          .map((move, i) =>
            !(i % 2)
              ? `${i / 2 + 1}. ${move.san} {[%clk ${sec[i]} %eval ${
                  third[i].value
                }]} `
              : `${Math.floor(i / 2) + 1}... ${move.san} {[%clk ${sec[i]} %eval ${
                  third[i].value
                }]} `,
          )
          .join('');
      } else {
        // evaluations and evaluations
        return moves.map((move, i) =>
          !(i % 2)
            ? `${i / 2 + 1}. ${move.san} {[%eval ${third[i].value}]} `
            : `${Math.floor(i / 2) + 1}... ${move.san} {[%eval ${third[i].value}]} `,
        );
      }
    }
  } else if (sec) {
    // only clks
    return moves
      .map((move, i) =>
        !(i % 2)
          ? `${i / 2 + 1}. ${move.san} {[%clk ${sec[i]}]} `
          : `${Math.floor(i / 2) + 1}... ${move.san} {[%clk ${sec[i]}]} `,
      )
      .join('');
  } else {
    // only moves
    return moves.map((move, i) =>
      !(i % 2)
        ? `${i / 2 + 1}. ${move.san} `
        : `${Math.floor(i / 2) + 1}... ${move.san} `,
    );
  }
}

/**
 *
 * @param {*} pgn
 * @returns
 */
const getMovesNum = (pgn: string) => {
  const [header, body] = String(pgn).split(/\n\s*\n/);
  return body.split(/\s+/).filter((value) => parseInt(value[0])).length;
};

const getMoves = (pgn: string) => {
  const game = new Chess();
  game.load_pgn(pgn);
  let moves = game.history({ verbose: true });
  return moves.map((move): Move => {
    return {
      from: move.from,
      to: move.to,
      san: move.san,
      lan: `${move.from}${move.to}` as Lan,
      type: move.flags as PieceType,
      promotion: move.promotion,
      captured: (move.captured
        ? `${move.color}${move.captured.toUpperCase()}`
        : undefined) as Piece | undefined,
      piece: `${move.color}${move.piece.toUpperCase()}` as Piece,
    };
  });
};

const convertPgnToGame = (
  pgn: string,
  username: string,
  vendor: Vendor,
): Game => {
  const parsedGame = parsePgn(pgn);
  return {
    ...parsedGame,
    playerColor: username == parsedGame.wuser.username ? 1 : -1,
    site: vendor,
    pgn,
  };
};

const convertPgnsToGames = (
  pgns: string[],
  username: string,
  vendor: Vendor,
): Game[] => {
  return pgns.map((pgn) => {
    return convertPgnToGame(pgn, username, vendor);
  });
};

export {
  constructPgn,
  parsePgn,
  getMovesNum,
  getMoves,
  convertPgnsToGames,
  convertPgnToGame,
};
