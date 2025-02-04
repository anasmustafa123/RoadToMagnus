import Loading_Review_LargeScreen from '../components/Labtop_loading';
import ReviewResult from '../components/ReviewResult';
import { useContext, useEffect, useRef, useState } from 'react';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import styles from '../styles/ReviewGame.module.css';
import { UserContext } from '../contexts/UserContext';
import { useParams, useLocation } from 'react-router-dom';
import { Classify } from '../scripts/_Classify';
import { EngineLine, Game } from '../types/Game';
import { ClassificationScores, ClassName } from '../types/Review';
import { getMoves, parsePgn } from '../scripts/pgn';
import { GameContext } from '../contexts/GamesContext';
import ChessBoard_Eval from '../components/ChessBoard_Eval';
import { ChessBoardContextProvider } from '../contexts/GameBoardContext';
import GameReviewManager from '../scripts/_GameReviewManager';
import StockfishWorker from '../scripts/_StockfishWorker';
import CloudEvalWorker from '../scripts/_CloudEvalWorker';

const ReviewGame = () => {
  const ReviewResult_Ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { gameId } = useParams();
  const { largeScreen } = useContext(UserContext);
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
    sanMoves,
    setsanMoves,
    setClks,
    setEngineResponses,
    gameInfo,
    setMovesClassifications,
  } = useContext(ReviewGameContext);
  const { get_game_byId } = useContext(GameContext);
  const [expand_review_state, setExpand_review_state] = useState(false);
  const [startReviewingMoves, setStartReviewingMoves] =
    useState<boolean>(false);

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

  useEffect(() => {
    console.log('refreshing');
    // when the review status is false endicating that the game is not yet evaluated
    // we need to evaluate the game

    if (!reviewStatus) {
      console.log({ gameId });
      if (!gameId) {
        console.error('gameId is null');
        return;
      }
      const gameData = get_game_byId(gameId);
      console.log({ gameData });
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
        setReviewStatus(true);
        return;
      } else {
        setReviewStatus(false);
      }
      let number_of_workers = 1;
      const game_review_manager = new GameReviewManager(parsedGameData.moves);
      const stockfish_workers: StockfishWorker[] = [];
      const uninitialized_workers = [];
      const initialized_workers: any = [];
        const cloud_worker = new CloudEvalWorker(game_review_manager);
        uninitialized_workers.push(
          cloud_worker.evaluatePosition(() => {
            setCurrentPerc((old) => old + 1);
          }),
        );
      for (let i = 0; i < number_of_workers; i++) {
        const stockfish_worker = new StockfishWorker(
          game_review_manager,
          2,
          18,
        );
        stockfish_workers.push(stockfish_worker);
        uninitialized_workers.push(stockfish_worker._init());
      }
      let uninitalized_results = Promise.all(uninitialized_workers);
      uninitalized_results.then((uninitalized_result) => {
        console.log({ uninitalized_result });
        stockfish_workers.forEach((stockfish_worker) => {
          initialized_workers.push(
            stockfish_worker.evaluatePosition(() => {
              setCurrentPerc((old) => old + 1);
            }),
          );
        });
        let initalized_results = Promise.all(initialized_workers);
        console.log({ initalized_results });
        initalized_results.then(() => {
          console.log('all workers are done');
          const engineResponses: EngineLine[][] =
            game_review_manager.get_engineResponses();
          console.log({ engineResponses });
          setEngineResponses(engineResponses);
          // update classification moves
          console.log({ sanMoves });
          const classification_class = new Classify({
            sanMoves: parsedGameData.moves,
          });
          classification_class
            .getGameClassifications({
              engineResponses,
              gameInfo,
              initial_Evaluation: initalEvaluation,
            })
            .then(({ classification_names }) => {
              console.log({ classification_names });
              setClassificationNames(classification_names);
              const classification_score =
                getClassificationScore(classification_names);
              console.log({ classification_score });
              setMovesClassifications(classification_score);
            });
        });
      });
    }
  }, [location]);

  return reviewStatus ? (
    <>
      {startReviewingMoves && (
        <ChessBoardContextProvider>
          <ChessBoard_Eval
            inlineStyles={{
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'start',
              top: '3rem',
              position: 'sticky',
            }}
          />
        </ChessBoardContextProvider>
      )}
      <ReviewResult
        startReviewingMoves={startReviewingMoves}
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
            {!startReviewingMoves && (
              <button
                onClick={() => {
                  setStartReviewingMoves(true);
                }}
              >
                Review
              </button>
            )}
          </div>
        }
        Ref={ReviewResult_Ref}
      />
    </>
  ) : largeScreen ? (
    <Loading_Review_LargeScreen />
  ) : (
    <Loading_Review_LargeScreen />
  );
};

export default ReviewGame;
