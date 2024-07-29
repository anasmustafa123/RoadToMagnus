import { GameType } from "./Game";

export interface ShortGame {
  pgn: string;
  isReviewd: boolean;
  site: string;
}

export type Vendor = 'chess.com' | 'lichess';

type PlayerDetailsCom = {
  username: string;
  result: string;
  rating: number;
};

export type ChessComGame = {
  black: PlayerDetailsCom;
  white: PlayerDetailsCom;
  pgn: string;
  time_class: GameType;
  end_time: number;
  url?: string;
};
