import { Move as GameMove, Square } from 'chess.js';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import { UserInfo } from './User';
import { Vendor } from './Api';

export class Unique_Game_Array extends Array<Game> {
  add_game(this: Unique_Game_Array, game: Game) {
    const dupgame = this.find((v) => v.gameId === game.gameId);
    if (!dupgame) this.push(game);
    return this;
  }
  add_games(this: Unique_Game_Array, games: Game[]) {
    games.forEach((game) => {
      this.add_game(game);
    });
    return this;
  }
}

export const GameTypes = ['rapid', 'blitz', 'bullet', 'daily'];

export type MoveType = 'n' | 'c' | 'p' | string;

export type GameType = 'rapid' | 'blitz' | 'bullet' | 'daily';

export type GamesCount = {
  [key in GameType]: number;
};

export type Lan = `${Square}${Square}`;

export interface Move
  extends Pick<GameMove, 'from' | 'to' | 'promotion' | 'san'> {
  lan?: Lan;
  type: MoveType;
  piece: Piece;
  captured?: Piece;
}

export interface Game {
  gameId: string;
  wuser: UserInfo;
  buser: UserInfo;
  playerColor: PlayerColor;
  date: `${string}-${string}`;
  gameResult: GameResult;
  gameType: GameType | null;
  drawType?: string;
  site: Vendor;
  movesCount: number;
  isReviewed: boolean;
  waccuracy?: number;
  baccuracy?: number;
  fen?: string;
  pgn: string;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface EngineLine {
  evaluation: Evaluation;
  /** its in lan format */
  bestMove: Lan;
  id: number;
  depth: number;
}
/**
 * 1: white won, -1: black won, 0: draw
 */
export type GameResult = 1 | -1 | 0;

/**
 * 1 white -1 black
 */
export type PlayerColor = 1 | -1;

export interface AttackPiece {
  piece: Piece;
  square: Square;
}
