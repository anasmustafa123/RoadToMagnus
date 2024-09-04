import React, { CSSProperties, memo, useContext, useState } from 'react';
import Game from '../components/Game';
import styles from '../styles/Games.module.css';
import { GameContext } from '../contexts/GamesContext';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChessEngine } from '../scripts/_Stockfish';
import { EngineLine, Game as GameType } from '../types/Game';
import { getMoves, parsePgn } from '../scripts/pgn';
import { Classify } from '../scripts/_Classify';
import { getMissingData } from '../scripts/LoadGames';
import { db } from '../api/Indexed';
const Games: React.FC<{ inlineStyles: CSSProperties }> = memo(
  ({ inlineStyles }) => {
    const { outletStyles } = useOutletContext<any>();
    const navigate = useNavigate();
    const [animation, setanimation] = useState('');
    const [max_displayed_games, setMax_displayed_games] = useState(10);
    const {
      setGameInfo,
      setCurrentPerc,
      setClassificationNames,
      setMaxtPerc,
      setsanMoves,
      setEvaluations,
      setReviewStatus,
      setMoves,
    } = useContext(ReviewGameContext);
    const { lichessGames, setLichessGames, chessdcomGames, setChessdcomGames } =
      useContext(GameContext);
    const date = new Date();
    const [month] = useState(date.getMonth());
    const callbackfunction =
      (
        ClassificationHelper: Classify,
        gameData: GameType,
        parsedGameData: any,
      ) =>
      async (param: {
        ok: boolean;
        sanMove: string;
        moveNum: number;
        lines: EngineLine[];
      }) => {
        if (param.ok) {
          let moveClassification =
            await ClassificationHelper.getMoveClassification({
              engineResponse: param.lines,
              moveNum: param.moveNum,
              plColor: param.moveNum % 2 ? 1 : -1,
              gameInfo: gameData,
            });
          console.debug(param);
          //let moveClassification: ClassName = 'botezgambit';
          console.debug(moveClassification);
          setClassificationNames((old) => [...old, moveClassification]);
          if (param.lines.length == 0) {
            console.debug(`finished reviewing`);
            throw new Error('done for now');
            setReviewStatus(true);
            return;
          }
          if (
            param.moveNum > 0 &&
            parsedGameData.moves[param.moveNum - 1] != param.sanMove
          ) {
            throw new Error('san moves dont match');
          }
          //setCurrentEngineLines(param.lines);
          //setEngineResponses((old) => [...old, param.lines]);

          /* setEvaluations((old) => [
          ...old,
          param.lines[0].evaluation,
        ]); */
          setCurrentPerc((old) => old + 1);
        }
      };
    const continueEvaluatingPosition = async (params: {
      stockfish: any;
      e: any;
      ClassificationHelper: any;
      parsedGameData: any;
      gameData: any;
    }) => {
      console.error(`error`);
      console.dir(params.e);
      console.dir(params.stockfish);
      console.dir(params.ClassificationHelper);
      const newclassify = new Classify({
        sanMoves: params.parsedGameData.moves,
        evaluations: params.parsedGameData.evaluations,
      });
      newclassify._init({
        game: params.ClassificationHelper.game,
        engineResponses: params.ClassificationHelper.engineResponses,
        evaluations: params.ClassificationHelper.evaluations,
      });
      console.dir(newclassify);
      let stockfish2 = new ChessEngine(2, 18);
      console.error('restarting');
      stockfish2._init().then(() => {
        try {
          stockfish2
            .evaluatePositionFromIndex({
              fens: params.e.fens,
              startIndex: params.e.index,
              afterMoveCallback: callbackfunction(
                newclassify,
                params.gameData,
                params.parsedGameData,
              ),
              moves: params.e.moves,
            })
            .catch((e) => {
              console.error(`again restarting`);
              console.debug(`restarting  at index ${e.index}`);
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
    const getGames = () => {
      const lichessLoading = new Promise((resolve, reject) => {
        getMissingData({
          username: 'gg',
          vendor: 'lichess',
          afterGameCallback: (games) => {
            console.log(games);
            setLichessGames((old) => [...old, ...games]);
          },
          afterGamesCallback: () => {},
        }).then((res) => {
          console.log(res);
          if (res.ok) {
            console.log('finished');
            resolve(true);
          } else reject(false);
        });
      });
      const chessdcomLoading = new Promise((resolve, reject) => {
        getMissingData({
          username: 'anasmostafa11',
          vendor: 'chess.com',
          afterGameCallback: (games) => {
            console.log(games);
            setChessdcomGames((old) => [...old, ...games]);
          },
          afterGamesCallback: () => {},
        }).then((res) => {
          console.log(res);
          if (res.ok) {
            console.log('finished');
            resolve(true);
            //setChessdcomGames(res.games);
          } else reject(false);
        });
      });
      return Promise.all([lichessLoading, chessdcomLoading]);
    };
    return (
      <>
        <div
          className={styles.gamesContainer}
          style={{ ...inlineStyles, ...outletStyles }}
        >
          <div className={styles.header}>
            <h2>All Games</h2>
            <i
              onClick={() => {
                setanimation('bx-spin');
                setTimeout(() => {
                  setanimation('');
                }, 2000);
                getGames().then(() => {
                  console.log('done');
                });
              }}
              className={`${animation} bx bx-repost`}
            ></i>
          </div>
          {[...chessdcomGames, ...lichessGames]
            .sort((a, b) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            })
            .slice(0, max_displayed_games)
            .map((value, i) => (
              <Game
                gamelink={
                  value.site == 'chess.com'
                    ? `https://www.chess.com/game/live/${value.gameId}`
                    : `https://lichess.org/${value.gameId}`
                }
                onClick={async (gameData) => {
                  setGameInfo(gameData);
                  setMaxtPerc(gameData.movesCount);
                  setGameInfo(gameData);
                  navigate(`/review/:${gameData.gameId}`);
                  let parsedGameData = parsePgn(gameData.pgn);
                  let moves = getMoves(gameData.pgn);
                  setMoves(moves);
                  setsanMoves(parsedGameData.moves);
                  setClassificationNames(
                    parsedGameData.classifi.map((c) => c.name),
                  );
                  setEvaluations(parsedGameData.evaluations);
                  let ClassificationHelper = new Classify({
                    sanMoves: parsedGameData.moves,
                    evaluations: parsedGameData.evaluations,
                  });

                  let stockfish = new ChessEngine(2, 18);
                  stockfish._init().then(() => {
                    try {
                      stockfish
                        .evaluatePosition({
                          pgn: gameData.pgn,
                          afterMoveCallback: callbackfunction(
                            ClassificationHelper,
                            gameData,
                            parsedGameData,
                          ),
                        })
                        .then((e) => {
                          console.log('finished');
                        })
                        .catch((e) => {
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
                  // navigate(`/review/:${gameData.gameId}`);
                }}
                key={(
                  Math.random() * 1000000 +
                  Math.random() * 5000
                ).toString()}
                gameData={value}
              ></Game>
            ))}
          <button
            onClick={() => {
              setMax_displayed_games((old) => old + 10);
            }}
            className={styles.load_more}
          >
            <i className="bx bxs-chevrons-down"></i>
          </button>
        </div>
      </>
    );
  },
);

export default Games;
