const constructPgn = ({
  wname,
  wrating,
  bname,
  brating,
  result,
  moves,
  clks,
  evaluations,
  classifi,
}) => {
  let res = "";
  res += wname ? getHeader("White", wname) : "";
  res += wrating ? getHeader("WhiteElo", wrating) : "";
  res += bname ? getHeader("Black", bname) : "";
  res += brating ? getHeader("BlackElo", brating) : "";
  res += result ? getHeader("Result", result) : "";
  res += "\n";
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

const parsePgn = (pgn) => {
  let wname, wrating, bname, brating, result;
  let clks = [],
    evaluations = [],
    classifi = [],
    moves = [];

  const [header, body] = String(pgn).split(/\n\s*\n/);

  header.split("\n").forEach((line) => {
    if (line.startsWith("[White ")) {
      wname = line.slice(8, -2);
    } else if (line.startsWith("[WhiteElo ")) {
      wrating = parseInt(line.slice(11, -2));
    } else if (line.startsWith("[Black ")) {
      bname = line.slice(8, -2);
    } else if (line.startsWith("[BlackElo ")) {
      brating = parseInt(line.slice(11, -2));
    } else if (line.startsWith("[Result ")) {
      const resultStr = line.slice(line.indexOf('"') + 1, -2).split("-")[0];
      result = resultStr.length > 1 ? 0 : !parseInt(resultStr) ? -1 : 1;
    }
  });
  const parts = body.split(/\s+/);
  console.log(parts);

  for (let i = 1; i < parts.length; i++) {
    if (!parts[i]) continue;
    if (parts[i].indexOf(":") != -1) {
      if (parts[i].endsWith("]}")) {
        clks.push(parts[i].slice(0, -2));
      } else {
        clks.push(parts[i]);
      }
      continue;
    }

    if (startsWithAlpha(parts[i])) {
      moves.push(parts[i]);
    } else if (parts[i] == "%eval") {
      if (parts[i].endsWith("]}")) {
        evaluations.push(parts[i].slice(0, -2));
      } else {
        evaluations.push(parts[i + 1]);
      }
    } else if (parts[i] == "%classi") {
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

const getHeader = (title, content) => `[${title} "${content}"]\n`;
function startsWithAlpha(str) {
  const charCode = str.charCodeAt(0);
  return (
    (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)
  );
}
const pgnMerge1 = (moves) => {
  return moves
    .map((move, i) =>
      !(i % 2)
        ? `${i / 2 + 1}. ${move} `
        : `${Math.floor(i / 2) + 1}... ${move} `
    )
    .join("");
};

const pgnMerge2 = (moves, clks) => {
  return moves
    .map((move, i) =>
      !(i % 2)
        ? `${i / 2 + 1}. ${move} {[%clk ${clks[i]}]} `
        : `${Math.floor(i / 2) + 1}... ${move} {[%clk ${clks[i]}]} `
    )
    .join("");
};

const pgnMerge3 = (moves, clks, evaluations, classifi) => {
  return moves
    .map((move, i) =>
      !(i % 2)
        ? `${i / 2 + 1}. ${move} {[%clk ${clks[i]} %eval ${
            evaluations[i]
          } %classif ${classifi[i]}]} `
        : `${Math.floor(i / 2) + 1}... ${move} {[%clk ${clks[i]} %eval ${
            evaluations[i]
          } %classif ${classifi[i]}]} `
    )
    .join("");
};

/**
 *
 * @param {*} pgn
 * @returns
 */
const getMovesNum = (pgn) => {
  const [header, body] = String(pgn).split(/\n\s*\n/);
  return body.split(/\s+/).filter((value) => parseInt(value[0])).length;
};

export { constructPgn, parsePgn, getMovesNum };
