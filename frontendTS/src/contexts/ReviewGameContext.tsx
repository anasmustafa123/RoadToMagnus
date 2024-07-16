import React, { useState, createContext } from 'react';
import { Chess, Square } from 'chess.js';
import type { ReviewGameContext } from '../types/ReviewGameContext';
import {
  EngineLine,
  Evaluation,
  Move,
  PlayerColor,
  Game as GameType,
} from '../types/Game';
import { Classification, ClassName } from '../types/Review';
import {
  getNormalClassification,
  isLosing,
  isSac,
  isWining,
} from '../scripts/evaluate';
import { UserInfo } from '../types/User';

const initialContext = {
  reviewStatus: false,
  setReviewStatus: () => {},
  classifications: [],
  setClassifications: () => {},
  evaluations: [],
  setEvaluations: () => {},
  moves: [] as unknown as Move[],
  setMoves: () => {},
  setwUser: () => {},
  setbUser: () => {},
  setGameResult: () => {},
  setPlayerColor: () => {},
  getClassification: () => 'unknown' as ClassName,
  gameInfo: {} as GameType,
  setGameInfo: () => {},
};

const ReviewGameContext = createContext<ReviewGameContext>(initialContext);

const ReviewGameContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reviewStatus, setReviewStatus] = useState<boolean>(false);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [gameInfo, setGameInfo] = useState<GameType>({} as GameType);

  /* 
userInfo{bUsername, bAccuracy, bRating, bAvatar}
evaluation: {type, value}
engineLine: {evaluation, bestMove}
*/

  const getClassification = (
    engineResponse: EngineLine[],
    evaluation: Evaluation,
    fen: string,
  ): ClassName => {
    console.log(`lines got from stockfish: ${engineResponse.length} lines`);
    const game = new Chess(fen);
    if (moves && gameInfo) {
      const moveNum = moves.length;
      let plColor: PlayerColor, opponent: UserInfo, player: UserInfo;
      let move: Move = moves[moveNum - 1];

      if (moveNum % 2) {
        player = gameInfo.wuser;
        opponent = gameInfo.buser;
        plColor = 1;
      } else {
        player = gameInfo.buser;
        opponent = gameInfo.wuser;
        plColor = -1;
      }
      let maxClassification = 6;
      let firstMiddleGame = 0;
      let firsetEndGame = 0;
      let iswining = isWining(
        engineResponse[0].evaluation,
        player.rating,
        plColor,
      );

      let waswining = isWining(evaluation, player.rating, plColor);
      let waslosing = isLosing(evaluation, player.rating, plColor);
      let islosing = isLosing(
        engineResponse[0].evaluation,
        player.rating,
        plColor,
      );
      let currentPieceChar = game.get(move.to as Square);
      let isQueen = currentPieceChar
        ? currentPieceChar.type.toLowerCase() == 'q'
        : false;
      let isSacc = isSac(move, game);
      // is best when its one of top lines returned by the engine
      let isbest = engineResponse.find(
        (engineLine) => engineLine.bestMove == move.lan,
      )
        ? true
        : false;

      // u set the first move of middle game after last opening move  (book move)
      if (!firstMiddleGame) {
        //check book moves
        console.log('might be book move');
      }
      let normalClassification = getNormalClassification(
        engineResponse[0].evaluation,
        evaluation,
        plColor,
        player.rating,
        opponent.rating,
      );

      console.log({
        waslosing,
        islosing,
        iswining,
        waswining,
        isQueen,
        isSacc,
        isbest,
        normalClassification,
      });
      if (isSacc) {
        if (((waswining && iswining) || (!waswining && !islosing)) && isbest) {
          return 'brilliant';
        }
        if (islosing && isQueen) {
          return 'botezgambit';
        }
        return normalClassification;
      } else if (isbest) {
        return 'best';
      } else return normalClassification;
    }
    return 'unknown';
  };

  return (
    <ReviewGameContext.Provider
      value={{
        reviewStatus,
        setReviewStatus,
        moves,
        classifications,
        evaluations,
        setClassifications,
        setEvaluations,
        setMoves,
        getClassification,
        gameInfo,
        setGameInfo,
      }}
    >
      {children}
    </ReviewGameContext.Provider>
  );
};

export { ReviewGameContext, ReviewGameContextProvider };
