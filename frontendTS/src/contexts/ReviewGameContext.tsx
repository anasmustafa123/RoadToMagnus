import React, { useState, createContext, useEffect, useRef } from 'react';
import { Chess, ChessInstance } from 'chess.js';
import type { ReviewGameContext } from '../types/ReviewGameContext';
import type {
  EngineLine,
  Evaluation,
  Move,
  PlayerColor,
  Game as GameType,
  Lan,
} from '../types/Game';
import {
  ClassificationScores,
  ClassName,
  emptyClassificationScores,
} from '../types/Review';
import {
  getClassificationScore,
} from '../scripts/evaluate';

// @ts-ignore
const ReviewGameContext = createContext<ReviewGameContext>();

const ReviewGameContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  let gameRef = useRef<ChessInstance>();
  const [reviewStatus, setReviewStatus] = useState<boolean>(true);
  const [classificationNames, setClassificationNames] = useState<ClassName[]>(
    [],
  );
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [sanMoves, setsanMoves] = useState<string[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [gameInfo, setGameInfo] = useState<GameType>({
    buser: {
      rating: 0,
      username: 'black_joe',
      'chess.com': 'black_joe_chess.com',
      lichess: 'black_joe_lichess',
      avatar: "/black_brain.png"
    },
    wuser: {
      rating: 0,
      username: 'white_joe',
      'chess.com': 'white_joe_chess.com',
      lichess: 'white_joe_lichess',
      avatar: "/white_brain.png"
    },
    gameId: '0000',
    site: 'chess.com',
    movesCount: 10,
    playerColor: 1,
    gameResult: 1,
    isReviewed: false,
    pgn: '',
    gameType: 'rapid',
    date: '2021-10',
  });
  const [currentMoveNum, setCurrentMoveNum] = useState<number>(-1);
  const [currentEngineLines, setCurrentEngineLines] = useState<EngineLine[]>(
    [],
  );
  const [engineResponses, setEngineResponses] = useState<EngineLine[][]>([]);
  const [currentPerc, setCurrentPerc] = useState<number>(0);
  const [maxPerc, setMaxtPerc] = useState<number>(100);
  const [movesClassifications, setMovesClassifications] =
    useState<ClassificationScores>(emptyClassificationScores);
  useEffect(() => {
    if (currentPerc && currentPerc == maxPerc) {
  
      setReviewStatus(true);
    }
  }, [currentPerc]);

  useEffect(() => {
    if (reviewStatus) {
      let score = getClassificationScore(classificationNames);
      setMovesClassifications(score);
    }
  }, [reviewStatus]);

  return (
    <ReviewGameContext.Provider
      value={{
        reviewStatus,
        setReviewStatus,
        sanMoves,
        evaluations,
        classificationNames,
        setClassificationNames,
        setEvaluations,
        setsanMoves,
        gameInfo,
        setGameInfo,
        maxPerc,
        setMaxtPerc,
        currentPerc,
        setCurrentPerc,
        currentMoveNum,
        setCurrentMoveNum,
        currentEngineLines,
        setCurrentEngineLines,
        movesClassifications,
        setMovesClassifications,
        engineResponses,
        setEngineResponses,
        moves,
        setMoves,
      }}
    >
      {children}
    </ReviewGameContext.Provider>
  );
};

export { ReviewGameContext, ReviewGameContextProvider };
