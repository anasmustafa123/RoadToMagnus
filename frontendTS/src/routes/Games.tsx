import React, { CSSProperties, memo, useContext, useState } from 'react';
import Game from '../components/Game';
import styles from '../styles/Games.module.css';
import { GameContext } from '../contexts/GamesContext';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChessEngine } from '../scripts/_Stockfish';
import { EngineLine, Game as GameType, Unique_Game_Array } from '../types/Game';
import { convertPgnsToGames, getMoves, parsePgn } from '../scripts/pgn';
import { Classify } from '../scripts/_Classify';
import { getMissingData } from '../scripts/LoadGames';
import { db, IDB_Game } from '../api/Indexed';
import { UserContext } from '../contexts/UserContext';
const Games: React.FC<{ inlineStyles: CSSProperties }> = memo(
  ({ inlineStyles }) => {
    const { user } = useContext(UserContext);
    const { outletStyles } = useOutletContext<any>();
    const navigate = useNavigate();
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
    const { setLichessGames, chessdcomGames, setChessdcomGames } =
      useContext(GameContext);
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
              afterMoveCallback: callbackfunction(
                newclassify,
                params.gameData,
                params.parsedGameData,
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
    /*   db.users.toArray().then((users) => {
      const newuser = users[0];
      if (newuser) {
        setUser(newuser);
        db.games.toArray().then((games) => {
          setChessdcomGames(
            new Unique_Game_Array(convertPgnsToGames(games.map((v) => v.pgn), newuser.)),
          )
        });
      }
    }); */
    const getGames = () => {
      const lichessLoading = new Promise((resolve, reject) => {
        getMissingData({
          username: 'gg',
          vendor: 'lichess',
          afterGameCallback: (games) => {
            setLichessGames((old) => {
              const newarr = new Unique_Game_Array(...old);
              return newarr.add_games(games);
            });
          },
          afterGamesCallback: () => {},
        }).then(async (res) => {
          if (res.ok) {
            console.log({res})
            if (user) {
              let lastDate = new Date(res.missingGames[0].date).getTime();
              const gamesToAdd = res.missingGames.map((game) => {
                const newDate = new Date(game.date).getTime();
                if (newDate > lastDate) {
                  lastDate = newDate;
                }
                const username = user.username.split('-')[1].trim();
                return {
                  username,
                  vendor: game.site,
                  pgn: game.pgn,
                  key: game.gameId,
                };
              });
              try {
                await Promise.all([
                  db.users.update(user.key, {
                    lichessdate: lastDate,
                  }),
                  db.games.bulkAdd(gamesToAdd),
                ]);
                console.log('Games added successfully');
              } catch (error) {
                console.error('Error adding games:', error);
              }
              resolve(true);
            }
            resolve(true);
          } else reject(false);
        });
      });

      const chessdcomLoading = new Promise((resolve, reject) => {
        getMissingData({
          username: 'anasmostafa11',
          vendor: 'chess.com',
          afterGameCallback: (games) => {
            setChessdcomGames((old) => {
              const newarr = new Unique_Game_Array(...old);
              return newarr.add_games(games);
            });
          },
          afterGamesCallback: () => {},
        }).then(async (res) => {
          console.log({res})
          if (res.ok) {
            if (user) {
              let lastDate = new Date(res.missingGames[0].date).getTime();
              const gamesToAdd = res.missingGames.map((game) => {
                const newDate = new Date(game.date).getTime();
                if (newDate > lastDate) {
                  lastDate = newDate;
                }
                const username =
                  game.site === 'chess.com'
                    ? user.username.split('-')[0].trim()
                    : game.site === 'lichess'
                      ? user.username.split('-')[1].trim()
                      : '';
                return {
                  username,
                  vendor: game.site,
                  pgn: game.pgn,
                  key: game.gameId,
                };
              });
              try {
                await Promise.all([
                  db.users.update(user.key, {
                    chessdate: lastDate,
                  }),
                  db.games.bulkAdd(gamesToAdd),
                ]);
                console.log('Games added successfully');
              } catch (error) {
                console.error('Error adding games:', error);
              }
              resolve(true);
            }
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
          {chessdcomGames
            .sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .slice(0, 20)
            .map((value, i) => (
              <Game
                gamelink={`https://www.chess.com/game/live/${value.gameId}`}
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
          {/* </React.Suspense> */}
        </div>
      </>
    );
  },
);

export default Games;
