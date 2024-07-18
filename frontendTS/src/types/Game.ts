import { Move as GameMove, Square } from 'chess.js';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import { UserInfo } from './User';
import { Vendor } from './Api';

export type MoveType = 'n' | 'c' | 'p';

export type GameTypes = 'rapid' | 'blitz' | 'bullet' | 'daily';

export interface GameType {
  toLowerCase(): GameType; 
}

export type GamesCount = {
  [key in GameTypes]: number;
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
  gameId: number;
  wuser: UserInfo;
  buser: UserInfo;
  playerColor: PlayerColor;
  date: `${string}-${string}`;
  gameResult: GameResult;
  gameType: GameType;
  drawType?: string;
  site: Vendor;
  movesCount: number;
  isReviewed: boolean;
  waccuracy?: number;
  baccuracy?: number;
  fen?: string;
  gamesCount: GamesCount
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface EngineLine {
  evaluation: Evaluation;
  /** its in lan format */
  bestMove: Lan;
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
