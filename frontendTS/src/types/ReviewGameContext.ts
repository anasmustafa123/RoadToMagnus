import { EngineLine, Evaluation, Game, Move } from './Game';
import { Classification, ClassificationScores, ClassName } from './Review';
import React from 'react';

export interface ReviewGameContext {
  reviewStatus: boolean;
  setReviewStatus: React.Dispatch<React.SetStateAction<boolean>>;
  classificationNames: ClassName[];
  setClassificationNames: React.Dispatch<React.SetStateAction<ClassName[]>>;
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  sanMoves: string[];
  setsanMoves: React.Dispatch<React.SetStateAction<string[]>>;
  gameInfo: Game;
  setGameInfo: React.Dispatch<React.SetStateAction<Game>>;
  getClassification: (engineResponse: EngineLine[]) => Promise<ClassName>;
  maxPerc: number;
  setMaxtPerc: React.Dispatch<React.SetStateAction<number>>;
  currentPerc: number;
  setCurrentPerc: React.Dispatch<React.SetStateAction<number>>;
  currentMoveNum: number;
  setCurrentMoveNum: React.Dispatch<React.SetStateAction<number>>;
  currentEngineLines: EngineLine[];
  setCurrentEngineLines: React.Dispatch<React.SetStateAction<EngineLine[]>>;
  movesClassifications: ClassificationScores;
  setMovesClassifications: React.Dispatch<
    React.SetStateAction<ClassificationScores>
  >;
  engineResponses: EngineLine[][];
  setEngineResponses: React.Dispatch<React.SetStateAction<EngineLine[][]>>;
  moves: Move[];
  setMoves: React.Dispatch<React.SetStateAction<Move[]>>;
}
