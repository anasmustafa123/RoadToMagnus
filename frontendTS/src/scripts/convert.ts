import { Chess, ChessInstance } from 'chess.js';
import { Move } from '../types/Game';

const getFenArr = (moves:Move[]) => {
  let game = new Chess();
  let fens:string[] = [];
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

function makeAMove(move:Move, game:ChessInstance): 0 | {game: ChessInstance, fen: string} {
  const gameCopy = { ...game };
  const result = gameCopy.move(move);
  if (result) {
    return { fen: gameCopy.fen(), game: gameCopy };
  }
  return 0;
}

export { getFenArr };
