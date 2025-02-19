import React, { useContext } from 'react';
import styles from '../styles/Game.module.css';
import { UserContext } from '../contexts/UserContext';
import type { Game } from '../types/Game';
const Game: React.FC<{
  key: string;
  gameData: Game;
  gamelink?: string;
  onClick: (gameData: Game) => void;
}> = ({ gameData, onClick, gamelink }) => {
  let largeScreen = true;
  const hoverColor = {
    rapid: 'green',
    blitz: 'gold',
    bullet: 'orange',
    daily: 'yellow',
  };
  const { user } = useContext(UserContext);
  const playerColor =
    gameData.site == 'chess.com'
      ? user?.username.split('-')[0] == gameData.wuser.username
        ? 1
        : -1
      : user?.username.split('-')[1] == gameData.wuser.username
        ? 1
        : -1;
  return (
    <>
      <div className={styles.game_container}>
        <a target="_blank" href={gamelink} className={styles.linkcontainer}></a>
        <img
          className={styles.logo}
          src={`/logos/${gameData.site}.png`}
          alt="website logo"
          draggable="false"
        />
        <img
          className={styles.tcontrol}
          src={`/timeControl/${gameData.gameType}.svg`}
          alt="game time control"
          draggable="false"
        />
        <div className={styles.playersInfo}>
          {largeScreen || playerColor == 1 ? (
            <div style={{ marginBottom: '5px' }} className={styles.playerInfo}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'white',
                  border: '1px solid black',
                  borderRadius: '2px',
                }}
              ></div>
              <div>
                {gameData.wuser.username.length < 12
                  ? gameData.wuser.username
                  : `${gameData.wuser.username.slice(0, 11)}...`}
              </div>
              <div>({gameData.wuser.rating})</div>
              {gameData.wuser.flagAvatar ? (
                <img
                  src={gameData.wuser.flagAvatar}
                  alt="flag"
                  draggable="false"
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
          {largeScreen || playerColor == -1 ? (
            <div className={styles.playerInfo}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: 'black',
                  borderRadius: '2px',
                }}
                className="color"
              ></div>
              <div>
                {gameData.buser.username.length < 12
                  ? gameData.buser.username
                  : `${gameData.buser.username.slice(0, 11)}...`}
              </div>
              <div>({gameData.buser.rating})</div>
              {gameData.buser.flagAvatar ? (
                <img
                  src={gameData.buser.flagAvatar}
                  alt="flag"
                  draggable="false"
                />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.resultContainer}>
          {largeScreen && (
            <div>
              <div style={{ marginBottom: '5px' }}>
                {gameData.gameResult == 1
                  ? 1
                  : gameData.gameResult == -1
                    ? 0
                    : 1 / 2}
              </div>
              <div>
                {gameData.gameResult == -1
                  ? 1
                  : gameData.gameResult == 1
                    ? 0
                    : 1 / 2}
              </div>
            </div>
          )}

          <div>
            {gameData.gameResult == 0 ? (
              <i
                style={{ color: 'var(--draw-color)' }}
                className="bx bxs-minus-square"
              ></i>
            ) : gameData.gameResult == playerColor ? (
              <i
                style={{ color: 'var(--win-color)' }}
                className="bx bxs-check-square"
              ></i>
            ) : (
              <i
                style={{ color: 'var(--loss-color)' }}
                className="bx bxs-x-square"
              ></i>
            )}
          </div>
        </div>
        {gameData.isReviewed ? (
          <div className={styles.acuracyContainer}>
            {largeScreen || playerColor == 1 ? (
              <div style={{ marginBottom: '5px' }}>
                {gameData.waccuracy ? gameData.waccuracy : '-'}
              </div>
            ) : (
              <></>
            )}
            {largeScreen || playerColor == -1 ? (
              <div>{gameData.baccuracy ? gameData.baccuracy : '-'}</div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <i
            onClick={() => {
              onClick(gameData);
            }}
            style={{
              '--hover-color': `${gameData.gameType ? hoverColor[gameData.gameType] : 'red'}`,
              margin: 'auto',
              color: 'var(--text-color)',
            }}
            className={styles.review + ' bx bxs-report'}
          ></i>
        )}

        {largeScreen && (
          <>
            <div className={styles.movesCount}>{gameData.movesCount}</div>
            <div className={styles.date}>{gameData.date}</div>
          </>
        )}
      </div>
    </>
  );
};
export default Game;
