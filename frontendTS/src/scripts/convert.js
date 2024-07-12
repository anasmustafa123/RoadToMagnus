import { Chess } from "chess.js";

const getFenArr = (moves) => {
  let game = new Chess();
  let fens = [];
  moves.forEach((move) => {
    let res = makeAMove(move, game);
    if (res) {
      game = res.game;
      fens.push(res.fen);
    } else {
      throw `${move} is not a valid move ${res}`;
    }
  });
  return fens;
};

function makeAMove(move, game) {
  const gameCopy = { ...game };
  const result = gameCopy.move(move);
  if (result) {
    return { fen: gameCopy.fen(), game: gameCopy };
  }
  return 0;
}

export { getFenArr };
