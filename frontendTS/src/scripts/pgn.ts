import { PlayerInfo, GameResult } from '../types/Game';

const constructPgn = (
  wplayer: PlayerInfo,
  bplayer: PlayerInfo,
  result: GameResult,
  moves: [string],
  clks: [string],
  evaluations: [string],
  classifi: [string],
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
  if (moves.length === clks?.length) {
    if (clks.length === evaluations?.length) {
      res += pgnMerge3(moves, clks, evaluations, classifi);
    } else {
      res += pgnMerge2(moves, clks);
    }
  } else {
    res += pgnMerge1(moves);
  }

  return res;
};

const parsePgn = (pgn: string) => {
  let wname, wrating, bname, brating, result;
  let clks = [],
    evaluations = [],
    classifi = [],
    moves = [];

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
    }
  });
  const parts = body.split(/\s+/);
  console.log(parts);

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
        evaluations.push(parts[i].slice(0, -2));
      } else {
        evaluations.push(parts[i + 1]);
      }
    } else if (parts[i] == '%classi') {
      classifi.push(parts[i].slice(0, -2));
    }
  }
  return {
    wname,
    wrating,
    bname,
    brating,
    result,
    moves,
    clks,
    evaluations,
    classifi,
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
const pgnMerge1 = (moves: [string]) => {
  return moves
    .map((move, i) =>
      !(i % 2)
        ? `${i / 2 + 1}. ${move} `
        : `${Math.floor(i / 2) + 1}... ${move} `,
    )
    .join('');
};

const pgnMerge2 = (moves: [string], clks: [string]) => {
  return moves
    .map((move, i) =>
      !(i % 2)
        ? `${i / 2 + 1}. ${move} {[%clk ${clks[i]}]} `
        : `${Math.floor(i / 2) + 1}... ${move} {[%clk ${clks[i]}]} `,
    )
    .join('');
};

const pgnMerge3 = (
  moves: [string],
  clks: [string],
  evaluations: [string],
  classifi: [string],
) => {
  return moves
    .map((move, i) =>
      !(i % 2)
        ? `${i / 2 + 1}. ${move} {[%clk ${clks[i]} %eval ${
            evaluations[i]
          } %classif ${classifi[i]}]} `
        : `${Math.floor(i / 2) + 1}... ${move} {[%clk ${clks[i]} %eval ${
            evaluations[i]
          } %classif ${classifi[i]}]} `,
    )
    .join('');
};

/**
 *
 * @param {*} pgn
 * @returns
 */
const getMovesNum = (pgn: string) => {
  const [header, body] = String(pgn).split(/\n\s*\n/);
  return body.split(/\s+/).filter((value) => parseInt(value[0])).length;
};

export { constructPgn, parsePgn, getMovesNum };
