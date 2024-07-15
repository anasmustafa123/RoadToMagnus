import { Move as GameMove, Square } from 'chess.js';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import { UserInfo } from './User';
import { Vendor } from './Api';

export type MoveType = 'n' | 'c' | 'p';

export type GameType = 'rapid' | 'blitz' | 'bullet' | 'daily';

export type san = string;

export interface Move
  extends Pick<GameMove, 'from' | 'to' | 'promotion' | 'captured' | 'san'> {
  lan?: string;
  type: MoveType;
  piece: Piece;
}

export interface Game {
  gameId: number;
  wuser: UserInfo;
  buser: UserInfo;
  date: `${string}-${string}`;

  gameResult: GameResult;
  gameType: GameType;
  drawType?: string;
  site: Vendor;
  movesCount: number;
  isReviewed: boolean;
  waccuracy?: number;
  baccuracy?: number;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface EngineLine {
  evaluation: Evaluation;
  /** its in lan format */
  bestMoves: `${Square}${Square}`[];
}
/**
 * 1: white won, -1: black won, 0: draw
 */
export type GameResult = 1 | -1 | 0;
