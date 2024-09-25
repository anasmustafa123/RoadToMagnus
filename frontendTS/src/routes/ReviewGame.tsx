import Loading_Review_LargeScreen from '../components/Labtop_loading';
import Loading_Review_SmallScreen from '../components/Phone_loading';
import ReviewResult from '../components/ReviewResult';
import ChessBoard_Eval from '../components/ChessBoard_Eval';
import { useContext, useEffect, useState } from 'react';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import styles from '../styles/ReviewGame.module.css';
import { ChessBoardContextProvider } from '../contexts/GameBoardContext';
import { UserContext } from '../contexts/UserContext';
import { useParams, useLocation } from 'react-router-dom';
import { Classify } from '../scripts/_Classify';
import { EngineLine, Game } from '../types/Game';
import { ClassificationScores, ClassName } from '../types/Review';
import { ChessEngine } from '../scripts/_Stockfish';
import { constructPgn, getMoves, parsePgn } from '../scripts/pgn';
import { GameContext } from '../contexts/GamesContext';
type callbackfunctionType = (param: {
  ok: boolean;
  sanMove: string;
  moveNum: number;
  lines: EngineLine[];
}) => Promise<{ ok: true; res: { classi_name: ClassName } } | null>;
const ReviewGame = () => {
  const location = useLocation();
  const { gameId } = useParams();
  const { largeScreen, update_layout } = useContext(UserContext);
  const {
    reviewStatus,
    setReviewStatus,
    setClassificationNames,
    setEvaluations,
    setCurrentPerc,
    initalEvaluation,
    setGameInfo,
    setMaxtPerc,
    setMoves,
    setsanMoves,
    setClks,
    setEngineResponses,
    setCurrentEngineLines,
    setMovesClassifications,
  } = useContext(ReviewGameContext);
  const { get_game_byId } = useContext(GameContext);
  const [expand_review_state, setExpand_review_state] = useState(false);
  const [showEval_chessmoves] = useState(false);

  function getClassificationScore(classification_names: ClassName[]) {
    const emptyClassification: ClassificationScores = {
      best: [0, 0],
      good: [0, 0],
      inaccuracy: [0, 0],
      mistake: [0, 0],
      blunder: [0, 0],
      excellent: [0, 0],
      book: [0, 0],
      great: [0, 0],
      brilliant: [0, 0],
      forced: [0, 0],
      missed: [0, 0],
      botezgambit: [0, 0],
      unknown: [0, 0],
    };
    let score: ClassificationScores = { ...emptyClassification };
    classification_names.forEach((classification, i) => {
      score[classification][i % 2]++;
    });
    return score;
  }
  function callbackfunction(
    ClassificationHelper: Classify,
    gameData: Game,
  ): callbackfunctionType {
    return async function (param: {
      ok: boolean;
      sanMove: string;
      moveNum: number;
      lines: EngineLine[];
    }): Promise<{ ok: true; res: { classi_name: ClassName } } | null> {
      if (param.ok) {
        let moveClassification =
          await ClassificationHelper.getMoveClassification({
            engineResponse: param.lines,
            moveNum: param.moveNum,
            plColor: param.moveNum % 2 ? 1 : -1,
            gameInfo: gameData,
            initial_Evaluation: initalEvaluation,
          });
        console.debug(param);
        console.debug(moveClassification);
        if (param.lines.length == 0) {
          setReviewStatus(true);
          return null;
        }
        setClassificationNames((old) => [...old, moveClassification]);
        setEvaluations((old) => [
          ...old,
          param.lines[param.lines.length - 1].evaluation,
        ]);
        setCurrentPerc((old) => old + 1);
        setEngineResponses((old) => [...old, param.lines]);
        setCurrentEngineLines(param.lines);

        return { ok: true, res: { classi_name: moveClassification } };
      }
      return null;
    };
  }
  const continueEvaluatingPosition = async (params: {
    stockfish: ChessEngine;
    e: any;
    ClassificationHelper: Classify;
    parsedGameData: any;
    gameData: Game;
  }) => {
    const newclassify = new Classify({
      sanMoves: params.parsedGameData.moves,
      evaluations: params.parsedGameData.evaluations,
    });
    newclassify._init({
      game: params.ClassificationHelper.game,
      engineResponses: params.ClassificationHelper.engineResponses,
      evaluations: params.ClassificationHelper.evaluations,
    });
    let stockfish2 = new ChessEngine(2, 18);
    stockfish2._init().then(() => {
      try {
        stockfish2
          .evaluatePositionFromIndex({
            fens: params.e.fens,
            startIndex: params.e.index,
            get_classification_update_callback: callbackfunction(
              newclassify,
              params.gameData,
            ),
            moves: params.e.moves,
          })
          .catch((e) => {
            continueEvaluatingPosition({
              stockfish: params.stockfish,
              e,
              ClassificationHelper: params.ClassificationHelper,
              parsedGameData: params.parsedGameData,
              gameData: params.gameData,
            });
          });
      } catch (e: any) {
        console.error(` restarting again`);
        console.debug(`restarting  at index ${e.index}`);
        continueEvaluatingPosition({
          stockfish: params.stockfish,
          e,
          ClassificationHelper: params.ClassificationHelper,
          parsedGameData: params.parsedGameData,
          gameData: params.gameData,
        });
      }
    });
  };

  useEffect(() => {
    console.log('refreshing');
    // when the review status is false endicating that the game is not yet evaluated
    // we need to evaluate the game

    if (!reviewStatus) {
      if (!gameId) {
        console.error('gameId is null');
        return;
      }
      const gameData = get_game_byId(gameId);
      if (!gameData) {
        console.error('cant find game with id: ', gameId);
        return;
      }
      console.log('gameinfo', gameData);
      setGameInfo(gameData);
      setMaxtPerc(gameData.movesCount);
      let parsedGameData = parsePgn(gameData.pgn);

      let moves = getMoves(gameData.pgn);
      setMoves(moves);
      setsanMoves(parsedGameData.moves);
      if (parsedGameData.clks && parsedGameData.clks.length > 0) {
        setClks(parsedGameData.clks);
      }
      if (parsedGameData.evaluations && parsedGameData.evaluations.length > 0) {
        setEvaluations(parsedGameData.evaluations);
        if (parsedGameData.classifi && parsedGameData.classifi.length > 0) {
          setClassificationNames(parsedGameData.classifi.map((c) => c.name));
        }
        // to do
        // update classification table good: 5 ....etc...
        setReviewStatus(true);
        return;
      } else {
        setReviewStatus(false);
      }
      let ClassificationHelper = new Classify({
        sanMoves: [...parsedGameData.moves],
        evaluations: [...parsedGameData.evaluations],
      });

      let stockfish = new ChessEngine(2, 18);
      stockfish._init().then(() => {
        try {
          stockfish
            .evaluatePosition({
              pgn: gameData.pgn,
              get_classification_update_callback: callbackfunction(
                ClassificationHelper,
                gameData,
              ),
            })
            .then((res) => {
              console.log('finished');
              console.log(res);
              console.log('before pgn', gameData.pgn);
              const newpgn = constructPgn(
                gameData.wuser,
                gameData.buser,
                gameData.gameResult,
                moves,
                parsedGameData.clks,
                res.evaluations,
                res.classification_names,
              );
              setMovesClassifications(
                getClassificationScore(res.classification_names),
              );
              console.log('after pgn');
              console.log(newpgn);
            })
            .catch((e) => {
              console.error('error');
              console.log({
                ClassificationHelper: ClassificationHelper,
                e,
                parsedGameData,
                stockfish,
                gameData,
              });
              continueEvaluatingPosition({
                ClassificationHelper: ClassificationHelper,
                e,
                parsedGameData,
                stockfish,
                gameData,
              });
            });
        } catch (e: any) {
          console.error(`error: ${e.message}`);
        }
      });
    }
  }, [location]);
  return reviewStatus ? (
    showEval_chessmoves ? (
      <ChessBoardContextProvider>
        <ChessBoard_Eval
          inlineStyles={{
            gridColumn: '2 / 3',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        />
      </ChessBoardContextProvider>
    ) : (
      <>
        <ReviewResult
          expand_review_state={expand_review_state}
          children={
            <div className={styles.showReview}>
              <div
                onClick={() => {
                  const current_review_state = !expand_review_state;
                  setExpand_review_state(current_review_state);
                }}
                className={styles.expand_review}
              >
                <i
                  style={
                    expand_review_state
                      ? { boxShadow: '0px 0px 0px red' }
                      : {
                          boxShadow:
                            '1px -31px 28px 30px rgba(255, 255, 255, 0.9)',
                        }
                  }
                  className={
                    expand_review_state
                      ? 'bx bx-chevrons-up'
                      : 'bx bx-chevrons-down'
                  }
                ></i>
              </div>
              <button
                onClick={() => {
                  update_layout(['layout_2']);
                }}
              >
                Review
              </button>
            </div>
          }
        />
      </>
    )
  ) : largeScreen ? (
    <Loading_Review_LargeScreen />
  ) : (
    <Loading_Review_SmallScreen />
  );
};

export default ReviewGame;
