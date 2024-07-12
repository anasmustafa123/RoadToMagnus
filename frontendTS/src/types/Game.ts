export interface PlayerInfo {
  username: string;
  accuracy?: number;
  rating: number;
  avatar?: string;
}

export interface Evaluation {
  type: 'cp' | 'mate';
  value: number;
}

export interface SimpleMove {
  fan: string;
}

export interface Move extends SimpleMove {
  from: string;
  to: string;
  lan?: string;
}

export interface EngineLine {
  evaluation: Evaluation;
  bestMoveLan: string;
}

export type GameResult = 1 | -1 | 0;