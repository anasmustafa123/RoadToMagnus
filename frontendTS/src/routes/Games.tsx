import React, { CSSProperties, memo, useContext, useState } from 'react';
import Game from '../components/Game';
import styles from '../styles/Games.module.css';
import { UserContext } from '../contexts/UserContext';
import { GameContext } from '../contexts/GamesContext';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import {
  addData,
  getAllGames as getAllGamesFromINDB,
  getDataByKey,
  updateData,
} from '../api/indexedDb';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChessEngine } from '../scripts/_Stockfish';
import { EngineLine, Game as GameType } from '../types/Game';
import { getMoves, parsePgn } from '../scripts/pgn';
import { Classify } from '../scripts/_Classify';
import { fetchPlayerGames } from '../api/lichessApiAccess';
import { getMissingData } from '../scripts/LoadGames';
const Games: React.FC<{ inlineStyles: CSSProperties }> = memo(
  ({ inlineStyles }) => {
    const { outletStyles } = useOutletContext<any>();
    const navigate = useNavigate();
    const { usernameChessDC, usernameLichess, userId } =
      useContext(UserContext);
    const [animation, setanimation] = useState('');
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
    const { lichessGames, setLichessGames } = useContext(GameContext);
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

                getDataByKey({
                  storename: 'users',
                  data: { key: String(userId) },
                }).then((res) => {
                  getAllGamesFromINDB().then((res) => {
                    if (res.ok)
                      if (res.value.length > 0) {
                        setLichessGames(
                          res.value.map((simplegame) => {
                            const parsedGame = parsePgn(simplegame.pgn.pgn);
                            return {
                              ...parsedGame,
                              site: 'lichess',
                              playerColor:
                                usernameLichess == parsedGame.wuser.username
                                  ? 1
                                  : -1,
                            };
                          }),
                        );
                      } else {
                        console.error('no games found');
                        getMissingData({
                          storekey: String(userId),
                          vendor: 'lichess',
                          afterGameCallback: (games) => {
                            setLichessGames([...lichessGames, ...games]);
                          },
                          afterGamesCallback: (fullgames) => {
                            updateData({
                              storename: 'users',
                              data: {
                                key: String(userId),
                                lichessdate:
                                  fullgames[fullgames.length - 1].date,
                              },
                            });
                            fullgames.forEach((game: GameType) => {
                              addData({
                                storename: 'Games',
                                data: {
                                  key: game.gameId,
                                  pgn: game.pgn,
                                  vendor: 'lichess',
                                  username: usernameLichess,
                                },
                              });
                            });
                          },
                          username: usernameLichess,
                        }).catch((e) => {
                          console.error(`error catched: ${e}`);
                        });
                      }
                  });
                });
                false &&
                  fetchPlayerGames('gg', (games) => {
                    setLichessGames([...lichessGames, ...games]);
                  })
                    .then((fullgames: any) => {
                      updateData({
                        storename: 'users',
                        data: {
                          key: String(userId),
                          lichessdate: fullgames[fullgames.length - 1].date,
                        },
                      });
                      fullgames.forEach((game: GameType) => {
                        addData({
                          storename: 'Games',
                          data: {
                            key: game.gameId,
                            pgn: game.pgn,
                            vendor: 'lichess',
                            username: usernameLichess,
                          },
                        });
                      });
                    })
                    .catch((e) => {
                      console.error(`error catched: ${e}`);
                    });
                /* fetchChessGamesonMonth(usernameChessDC, 2022, month).then(
                (res) => {
                  let end = Date.now();
                  setmonth((old) => old - 1);
                  console.log(`time: ${(end - st) / 1000}sec`);
                  console.log(res);
                  console.log({
                    reduced: reducechessDC(
                      'chess.com',
                      usernameChessDC,
                      res.games,
                    ),
                  });
                  updateAllGames(
                    reducechessDC('chess.com', usernameChessDC, res.games),
                  );
                },
              ); */
              }}
              className={`${animation} bx bx-repost`}
            ></i>
          </div>
          <React.Suspense
            fallback={
              <div className={`${styles.animatedTextCont}`}>
                <div className={styles.animatedTextRight}>
                  Loading Your Games
                </div>
                <div className={styles.animatedTextLeft}>
                  ....Stay Still....
                </div>
              </div>
            }
          >
            {lichessGames.map((value, i) => (
              <Game
                gamelink={`https://lichess.org/${value.gameId}`}
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
                key={i}
                gameData={value}
              ></Game>
            ))}
          </React.Suspense>
        </div>
      </>
    );
  },
);

export default Games;
