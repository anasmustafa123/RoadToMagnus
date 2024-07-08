import React, { useContext } from "react";
import styles from "../styles/Game.module.css";
import { UserContext } from "../contexts/UserContext";
export default function Game({
  pass,
  baccuracy = "-",
  waccuracy = "-",
  wflag = "-",
  bflag = "-",
  data,
}) {
  let largeScreen = true;
  const hoverColor = { rapid: "green", blitz: "gold", bullet: "orange" };
  const {
    wusername,
    busername,
    wrating,
    brating,
    gameType,
    site,
    gameResult,
    isReviewed,
    date,
    movesCount
  } = data;
  const { usernameChessDC, usernameLichess } = useContext(UserContext);
  const playerColor =
    site == "chessdotcom"
      ? usernameChessDC == wusername
        ? 1
        : -1
      : usernameLichess == wusername
      ? 1
      : -1;
  return (
    <>
      <div key={pass} className={styles.game_container}>
        <img
          className={styles.logo}
          src={`/logos/${site}.png`}
          alt="website logo"
          draggable="false"
        />
        <img
          className={styles.tcontrol}
          src={`/timeControl/${gameType}.svg`}
          alt="game time control"
          draggable="false"
        />
        <div className={styles.playersInfo}>
          {largeScreen || playerColor == 1 ? (
            <div style={{ marginBottom: "5px" }} className={styles.playerInfo}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "white",
                  border: "1px solid black",
                  borderRadius: "2px",
                }}
              ></div>
              <div>
                {wusername.length < 12
                  ? wusername
                  : `${wusername.slice(0, 11)}...`}
              </div>
              <div>({wrating})</div>
              {wflag ? <img src={wflag} alt="flag" draggable="false" /> : <></>}
            </div>
          ) : (
            <></>
          )}
          {largeScreen || playerColor == -1 ? (
            <div className={styles.playerInfo}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "black",
                  borderRadius: "2px",
                }}
                className="color"
              ></div>
              <div>
                {busername.length < 12
                  ? busername
                  : `${busername.slice(0, 11)}...`}
              </div>
              <div>({brating})</div>
              {bflag ? <img src={bflag} alt="flag" draggable="false" /> : <></>}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.resultContainer}>
          {largeScreen && (
            <div>
              <div style={{ marginBottom: "5px" }}>
                {gameResult == 1 ? 1 : gameResult == -1 ? 0 : 1 / 2}
              </div>
              <div>{gameResult == -1 ? 1 : gameResult == 1 ? 0 : 1 / 2}</div>
            </div>
          )}

          <div>
            {gameResult == 0 ? (
              <i
                style={{ color: "var(--draw-color)" }}
                class="bx bxs-minus-square"
              ></i>
            ) : gameResult == playerColor ? (
              <i
                style={{ color: "var(--win-color)" }}
                className="bx bxs-check-square"
              ></i>
            ) : (
              <i
                style={{ color: "var(--loss-color)" }}
                className="bx bxs-x-square"
              ></i>
            )}
          </div>
        </div>
        {isReviewed ? (
          <div className={styles.acuracyContainer}>
            {largeScreen || playerColor == 1 ? (
              <div style={{ marginBottom: "5px" }}>{waccuracy}</div>
            ) : (
              <></>
            )}
            {largeScreen || playerColor == -1 ? <div>{baccuracy}</div> : <></>}
          </div>
        ) : (
          <i
            style={{
              "--hover-color": `${hoverColor[gameType]}`,
              margin: "auto",
              color: "var(--text-color)",
            }}
            className={styles.review + " bx bxs-report"}
          ></i>
        )}

        {largeScreen && (
          <>
            <div className={styles.movesCount}>{movesCount}</div>
            <div className={styles.date}>{date}</div>
          </>
        )}
      </div>
    </>
  );
}
