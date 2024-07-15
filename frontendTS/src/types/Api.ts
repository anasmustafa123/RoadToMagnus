export interface ShortGame {
  pgn: string;
  isReviewd: boolean;
  site: string;
}

export type Vendor = 'chess.com' | 'lichess';