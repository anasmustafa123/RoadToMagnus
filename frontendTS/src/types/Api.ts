import { GameResult, PlayerInfo } from './Game';

export interface Game {
  wuser: PlayerInfo;
  buser: PlayerInfo;
  gameType: string;
  site: Vendor;
  drawType?: string;
  pgn: string;
  gameResult: GameResult;
  isReviewed: boolean;
  movesCount: number;
  date: string
}
export type Vendor = 'chess.com' | 'lichess';