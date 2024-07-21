import React, { CSSProperties, useContext, useState } from 'react';
import Game from '../components/Game';
import styles from '../styles/Games.module.css';
import {
  fetchChessGamesonMonth,
  reduceGamesOfMonth as reducechessDC,
} from '../api/chessApiAccess';
import { UserContext } from '../contexts/UserContext';
import { GameContext } from '../contexts/GamesContext';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import { Await, useLoaderData, defer } from 'react-router-dom';
const Games: React.FC<{ inlineStyles: CSSProperties }> = ({ inlineStyles }) => {
  const { usernameChessDC } = useContext(UserContext);
  const [animation, setanimation] = useState('');
  const { setGameInfo } = useContext(ReviewGameContext);
  const { allGames, updateAllGames } = useContext(GameContext);
  const date = new Date();
  const [month, setmonth] = useState(date.getMonth());
  const data = useLoaderData() as { gameData: Game[] };
  return (
    <>
      <div className={styles.gamesContainer} style={inlineStyles}>
        <div className={styles.header}>
          <h2>All Games</h2>
          <i
            onClick={() => {
              setanimation('bx-spin');
              setTimeout(() => {
                setanimation('');
              }, 2000);
              console.log({
                uname: usernameChessDC,
                year: date.getFullYear(),
                month,
              });
              let st = Date.now();
              fetchChessGamesonMonth(usernameChessDC, 2022, month).then(
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
              );
            }}
            className={`${animation} bx bx-repost`}
          ></i>
        </div>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Await
            resolve={data.gameData}
            errorElement={<p>Error loading Games!</p>}
          >
            {(gameData:Game[]) => gameData.map((value, i) => (
              <Game
                onClick={(gameData) => {
                  console.log(gameData);
                  setGameInfo(gameData);
                }}
                id={i}
                gameData={value}
              ></Game>
            ))}
          </Await>
        </React.Suspense>
      </div>
    </>
  );
};

export default Games;
