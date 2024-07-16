import { ChessInstance } from 'chess.js';
import { EngineLine, Evaluation, Game, Move } from './Game';
import { Classification, ClassName } from './Review';
import React from 'react';

export interface ReviewGameContext {
  reviewStatus: boolean;
  setReviewStatus: React.Dispatch<React.SetStateAction<boolean>>;
  classifications: Classification[];
  setClassifications: React.Dispatch<React.SetStateAction<Classification[]>>;
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  moves: Move[];
  setMoves: React.Dispatch<React.SetStateAction<Move[]>>;
  gameInfo: Game;
  setGameInfo: React.Dispatch<React.SetStateAction<Game>>;
  getClassification: (
    engineResponse: EngineLine[],
    evaluation: Evaluation,
    fen: string,
  ) => ClassName;
}
