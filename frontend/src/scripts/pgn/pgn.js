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
  let hasClocks = true,
    hasEvaluations = true,
    hasClassifications = true;

  const [header, body] = String(pgn).split(/\n\s*\n/);

  header.split("\n").forEach((line) => {
    if (line.startsWith("[White ")) {
      wname = line.slice(8, -2);
    } else if (line.startsWith("[WhiteElo ")) {
      wrating = parseInt(line.slice(10, -2));
    } else if (line.startsWith("[Black ")) {
      bname = line.slice(8, -2);
    } else if (line.startsWith("[BlackElo ")) {
      brating = parseInt(line.slice(10, -2));
    } else if (line.startsWith("[Result ")) {
      const resultStr = line.slice(line.indexOf('"') + 1, -2).split("-")[0];
      result = resultStr.length > 1 ? 0 : !parseInt(resultStr) ? -1 : 1;
    }
  });

  const parts = body.split(/\s+/);
  for (let i = 1; i < parts.length; ) {
    moves.push(parts[i]);
    if (hasClocks && parts[i + 1]?.includes("clk")) {
      if (!parts[i + 2]) throw new Error("Missing clk");
      clks.push(parts[i + 2]);

      if (hasEvaluations && parts[i + 3]?.includes("eval")) {
        if (!parts[i + 4]) throw new Error("Missing evaluations");
        evaluations.push(parts[i + 4]);

        if (hasClassifications && parts[i + 5]?.includes("class")) {
          if (!parts[i + 6]) throw new Error("Missing classifications");
          classifi.push(parts[i + 6].slice(0, -2));
        } else {
          hasClassifications = false;
        }
      } else {
        hasEvaluations = false;
      }
    } else {
      hasClocks = false;
    }
    i += 8;
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
