import React, { CSSProperties, memo, useContext, useState } from 'react';
import styles from '../styles/Games.module.css';
import { GameContext } from '../contexts/GamesContext';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Game as GameType, Unique_Game_Array } from '../types/Game';
import { getMissingData } from '../scripts/LoadGames';
import { db } from '../api/Indexed';
import { UserContext } from '../contexts/UserContext';
import Game from '../components/Game';
const Games: React.FC<{ inlineStyles: CSSProperties }> = memo(
  ({ inlineStyles }) => {
    const { user } = useContext(UserContext);
    const { outletStyles } = useOutletContext<any>();
    const navigate = useNavigate();
    const [animation, setanimation] = useState('');
    const { setLichessGames, chessdcomGames, setChessdcomGames } =
      useContext(GameContext);
    
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
            console.log({ res });
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
          console.log({ res });
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
            .map((value) => (
              <Game
                gamelink={`https://www.chess.com/game/live/${value.gameId}`}
                onClick={async (gameData) => {
                  navigate(`/review/${gameData.gameId}`);
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
