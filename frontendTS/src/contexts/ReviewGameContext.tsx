import React, { useState, createContext, useEffect, useRef } from 'react';
import { Chess, ChessInstance, Square } from 'chess.js';
import type { ReviewGameContext } from '../types/ReviewGameContext';
import type {
  EngineLine,
  Evaluation,
  Move,
  PlayerColor,
  Game as GameType,
  Game,
  Lan,
} from '../types/Game';
import {
  Classification,
  ClassificationScores,
  ClassName,
  emptyClassificationScores,
} from '../types/Review';
import {
  getClassificationScore,
  getNormalClassification,
  isGreat,
  isLosing,
  isSac,
  isWining,
} from '../scripts/evaluate';
import { UserInfo } from '../types/User';
import { Piece } from 'react-chessboard/dist/chessboard/types';
import { checkIfBook } from '../api/lichessApiAccess';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
const ReviewGameContext = createContext<ReviewGameContext>();

const ReviewGameContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  let gameRef = useRef<ChessInstance>();
  const [reviewStatus, setReviewStatus] = useState<boolean>(false);
  const [classificationNames, setClassificationNames] = useState<ClassName[]>(
    [],
  );
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [sanMoves, setsanMoves] = useState<string[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [gameInfo, setGameInfo] = useState<GameType>({} as GameType);
  const [currentMoveNum, setCurrentMoveNum] = useState<number>(-1);
  const [currentEngineLines, setCurrentEngineLines] = useState<EngineLine[]>(
    [],
  );
  const [engineResponses, setEngineResponses] = useState<EngineLine[][]>([]);
  const [currentPerc, setCurrentPerc] = useState<number>(0);
  const [maxPerc, setMaxtPerc] = useState<number>(100);
  const [movesClassifications, setMovesClassifications] =
    useState<ClassificationScores>(emptyClassificationScores);
  //const game = new Chess();
  /*   useEffect(() => {
    gameRef.current = new Chess();
  }, []); */

  /* useEffect(() => {
    async function temp() {
      console.log(`currentmovenum: ${currentMoveNum}`);
      if (
        currentMoveNum != undefined &&
        currentMoveNum != -1 &&
        setCurrentMoveNum != undefined
      ) {
        let classi = await getClassification(currentEngineLines);
        setClassificationNames((old) => [...old, classi]);
        if (currentMoveNum == sanMoves.length) {
          setReviewStatus(true);
        }
        console.log(currentEngineLines);
        console.log(evaluations);
        console.log(classi);
      }
    }
    temp();
  }, [currentMoveNum]); */

  useEffect(() => {
    if (reviewStatus) {
      let score = getClassificationScore(classificationNames);
      setMovesClassifications(score);
    }
  }, [reviewStatus]);

  const getClassification = async (
    engineResponse: EngineLine[],
  ): Promise<ClassName> => {
    console.log(`currentMoveNum: ${currentMoveNum}`);

    if (currentMoveNum == 0) {
      gameRef.current ? gameRef.current.reset() : '';
      return 'book';
    }
    const evaluation: Evaluation = evaluations[currentMoveNum - 1];
    if (sanMoves && gameInfo) {
      let plColor: PlayerColor, opponent: UserInfo, player: UserInfo;
      let move: string = sanMoves[currentMoveNum - 1];
      console.log(`before ${gameRef.current?.history()}`);

      const lastMove = gameRef.current?.move(move);
      console.log(`after ${gameRef.current?.history()}`);
      if (!lastMove)
        throw new Error(
          `illigal move num: ${currentMoveNum} move= ${sanMoves[currentMoveNum - 1]}`,
        );
      if (currentMoveNum % 2) {
        player = gameInfo.wuser;
        opponent = gameInfo.buser;
        plColor = 1;
      } else {
        player = gameInfo.buser;
        opponent = gameInfo.wuser;
        plColor = -1;
      }
      console.log('old /n new');
      console.log(evaluation);
      console.log(engineResponse[engineResponse.length - 1].evaluation);
      let maxClassification = 6;
      let firstMiddleGame = 0;
      let firsetEndGame = 0;
      let iswining = isWining(
        engineResponse[engineResponse.length - 1].evaluation,
        player.rating,
        plColor,
      );

      let waswining = isWining(evaluation, player.rating, plColor);
      let waslosing = isLosing(evaluation, player.rating, plColor);
      let islosing = isLosing(
        engineResponse[engineResponse.length - 1].evaluation,
        player.rating,
        plColor,
      );
      let currentPieceChar = lastMove.piece;
      let isQueen = currentPieceChar
        ? currentPieceChar.toLowerCase() == 'q'
        : false;
      if (lastMove.flags == 'cp' || lastMove.flags == 'pc') {
        alert(lastMove.flags);
      }
      let lastMoveAsMove: Move = {
        from: lastMove.from,
        to: lastMove.to,
        promotion: lastMove.promotion,
        san: lastMove.san,
        captured:
          plColor == 1
            ? (`b${lastMove.captured?.toUpperCase()}` as Piece)
            : (`w${lastMove.captured?.toUpperCase()}` as Piece),
        type: lastMove.flags,
        lan: `${lastMove.from}${lastMove.to}` as Lan,
        piece:
          plColor == 1
            ? (`w${lastMove.piece.toUpperCase()}` as Piece)
            : (`b${lastMove.piece.toUpperCase()}` as Piece),
      };
      console.log(lastMoveAsMove);
      let isSacc = { result: false };
      if (gameRef.current) {
        // @ts-ignore
        isSacc = isSac(lastMoveAsMove, new Chess(gameRef.current.fen()));
      }
      // is best when its one of top lines returned by the engine
      let isbest =
        engineResponses[currentMoveNum - 1].length > 1
          ? engineResponses[currentMoveNum - 1].find((engineLine) => {
              console.log(`${engineLine.bestMove} equal ${lastMoveAsMove.lan}`);
              return engineLine.bestMove == lastMoveAsMove.lan;
            })
            ? true
            : false
          : false;

      // u set the first move of middle game after last opening move  (book move)
      if (!firstMiddleGame) {
        //check book sanMoves
        let isBook = gameRef.current
          ? await checkIfBook(gameRef.current.fen())
          : { ok: false };
        if (isBook.ok) {
          console.log(isBook.opening);
          return 'book';
        } else {
          firstMiddleGame = currentMoveNum;
        }
      }
      let normalClassification = getNormalClassification(
        engineResponse[engineResponse.length - 1].evaluation,
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
      if (
        isGreat(
          engineResponses[currentMoveNum - 1],
          iswining,
          islosing,
          waswining,
          waslosing,
          player.rating,
          plColor,
        )
      ) {
        return 'great';
      }
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
      } else if (
        (normalClassification == 'mistake' ||
          normalClassification == 'blunder') &&
        iswining
      ) {
        return 'missed';
      } else return normalClassification;
    }
    return 'unknown';
  };

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
        getClassification,
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
