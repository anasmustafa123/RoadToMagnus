import React from "react";
import styles from "../styles/Game.module.css";
export default function Game() {
  let largeScreen = false;
  const isReviewed = false;
  const gameType = "rapid";
  const site = "chessdotcom";
  const wusername = "anas";
  const busername = "ahmed";
  const wrating = "1080";
  const brating = "1090";
  const wflag = "";
  const bflag = "";
  const playerColor = -1;
  const gameResult = -1;
  const waccuracy = "80.3";
  const baccuracy = "70.4";
  const date = "Jul 4, 2024";
  const movesCount = 100;
  return (
    <>
      <div className={styles.game_container}>
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
              <div>{wusername}</div>
              <div>({wrating})</div>
              <img src={wflag} alt="flag" draggable="false" />
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
              <div>{busername}</div>
              <div>({brating})</div>
              <img src={bflag} alt="flag" draggable="false" />
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
          <i style={{margin: "auto", color: "var(--text-color)"}} className="bx bxs-zoom-in"></i>
        )}

        {largeScreen && (
          <>
            <div className={styles.movesCount}>{movesCount}</div>
            <div className={styles.date}>{date}</div>
          </>
        )}
      </div>
      <div>fads</div>
      <div>fasdd</div>
    </>
  );
}
