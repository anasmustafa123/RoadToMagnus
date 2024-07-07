import React from "react";
import Loading from "./Loading";
import styles from "../styles/NewReview.module.css";
export default function NewReview() {
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
  const perc = 20;
  const message = "calculating\t                                                                                                                                                                                                                                                                                                                                                                                                                                            variations...";
  const maxValue = 100;
  const depth = 18;
  return (
    <>
      <div className={styles.newReview}>
        <div className={styles.header}>Game Review</div>
        <div className={styles.line}>
          <div
            style={
              gameResult == 1
                ? { borderColor: "var(--win-color)" }
                : { borderColor: "var(--loss-color)" }
            }
            className={styles.wrating}
          >
            {wrating}
          </div>
          <div className={styles.gameResult}>
            {gameResult == 0
              ? "1/2 - 1/2"
              : gameResult == 1
              ? "1 - 0"
              : "0 : 1"}
          </div>
          <div
            style={
              gameResult == -1
                ? { borderColor: "var(--win-color)" }
                : { borderColor: "var(--loss-color)" }
            }
            className={styles.brating}
          >
            {brating}
          </div>
        </div>
        <div>
          <Loading message={message} maxValue={maxValue} perc={perc} inlineStyling={{ width: "120px", alignSelf: "center", margin: "auto" }}></Loading>
        </div>
        <div style={{ textAlign: "center", fontSize: "1.3rem", color: "var(--comment-color)" }}>{`depth = ${depth}`}</div>
      </div>
    </>
  );
}
