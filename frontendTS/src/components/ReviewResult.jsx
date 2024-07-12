import React, { useState } from "react";
import styles from "../styles/ReviewResult.module.css";
export default function ReviewResult() {
  const moves = ["e4", "e5", "Nf3", "Nc6", "Bc4"];
  const classifications = ["!?", "$$", "$", "!!", "!"];
  const wUsername = "anas";
  const bUsername = "ahmed";
  const wAccuracy = "70.5";
  const bAccuracy = "55";
  const wRating = 1100;
  const bRating = 1200;
  const wAvatar = "";
  const bAvatar = "";
  const gameResult = 1;
  const playerColor = 1;
  const classList = [
    "brilliant",
    "great",
    "best",
    "excellent",
    "good",
    "forced",
    "inaccuracy",
    "mistake",
    "missed",
    "blunder",
    "botezgambit",
  ];
  const [movesClassifications, setMovesClassifications] = useState({
    book: [0, 0],
    brilliant: [0, 0],
    great: [0, 0],
    best: [0, 0],
    excellent: [0, 0],
    good: [0, 0],
    inaccuracy: [0, 0],
    mistake: [0, 0],
    missed: [0, 0],
    forced: [0, 0],
    blunder: [0, 0],
    botezgambit: [0, 0],
  });
  const countClassifications = (classifications) => {
    let temp = {
      book: [0, 0],
      brilliant: [0, 0],
      great: [0, 0],
      best: [0, 0],
      excellent: [0, 0],
      good: [0, 0],
      inaccuracy: [0, 0],
      mistake: [0, 0],
      missed: [0, 0],
      forced: [0, 0],
      blunder: [0, 0],
      botezgambit: [0, 0],
    };
    classifications.forEach((sym, i) => {
      !(i % 2)
        ? temp[getClassification(sym)][0]++
        : temp[getClassification(sym)][1]++;
    });
    console.log(temp);
    setMovesClassifications(temp);
  };
  const getClassification = (classiSym) => {
    for (let key in classificationInfo) {
      if (classificationInfo[key].sym == classiSym) {
        return key;
      }
    }
  };
  const classificationInfo = {
    book: { color: "#72c3a6", sym: "!?" },
    brilliant: { color: "#00989dba", sym: "$$" },
    great: { color: "#185fb5d9", sym: "$" },
    best: { color: "#509d00", sym: "=$$" },
    excellent: { color: "#5caa0b", sym: "!!" },
    good: { color: "#768c51", sym: "!" },
    forced: { color: "#7c9f89", sym: "==" },
    inaccuracy: { color: "#ff9800", sym: "?!" },
    mistake: { color: "#e3786a", sym: "?" },
    blunder: { color: "#ff0909", sym: "??" },
    missed: { color: "#da3f2a", sym: "?$" },
    botezgambit: { color: "#5c5c5c", sym: "????" },
  };
  return (
    <div className={styles.reviewResult}>
      <div className={styles.reviewHeader}>
        <div
          style={{ position: "relative", right: "10%" }}
          className={styles.userInfo}
        >
          <div>{wUsername}</div>
          <div
            style={
              gameResult == 1
                ? { color: "var(--win-color)" }
                : { color: "var(--loss-color)" }
            }
            className={styles.imgContainer}
          >
            <img src={`${wAvatar}/user.svg`} alt="black avatar" />
          </div>
          <div className={styles.wblock}>{wAccuracy}</div>
        </div>
        <div
          style={{ position: "relative", left: "10%" }}
          className={styles.userInfo}
        >
          <div>{bUsername}</div>
          <div
            style={
              gameResult == -1
                ? { color: "var(--win-color)" }
                : { color: "var(--loss-color)" }
            }
            className={styles.imgContainer}
          >
            <img src={`${bAvatar}/user.svg`} alt="black avatar" />
          </div>
          <div className={styles.bblock}>{bAccuracy}</div>
        </div>
      </div>
      <div className={styles.ReviewContainer}>
        {classList.map((value, i) => (
          <div
            style={{
              color: `${
                classificationInfo[value] ? classificationInfo[value].color : ""
              }`,
            }}
            className={styles.line}
            key={i}
          >
            <div className={styles.wClassi}>
              {movesClassifications[value][0]}
            </div>
            <img
              src={`/classification/${value}.png`}
              alt={`${value} chessmove`}
            />
            <div
              style={{
                color: `${
                  classificationInfo[value]
                    ? classificationInfo[value].color
                    : ""
                }`,
              }}
              className={styles.bClassi}
            >
              {movesClassifications[value][1]}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <div
            style={
              gameResult == 1
                ? {
                    borderColor: "var(--win-color)",
                    width: "92px",
                    "font-size": "22px",
                    "font-weight": "700",
                    "text-align": "center",
                  }
                : {
                    borderColor: "var(--loss-color)",
                    width: "92px",
                    "font-size": "22px",
                    "font-weight": "700",
                    "text-align": "center",
                  }
            }
            className={styles.wblock}
          >
            {wRating}
          </div>
          <div className={styles.reviewTitle}>Game Rating</div>
          <div
            style={
              gameResult == -1
                ? {
                    borderColor: "var(--win-color)",
                    width: "92px",
                    "font-size": "22px",
                    "font-weight": "700",
                    "text-align": "center",
                  }
                : {
                    borderColor: "var(--loss-color)",
                    width: "92px",
                    "font-size": "22px",
                    "font-weight": "700",
                    "text-align": "center",
                  }
            }
            className={styles.bblock}
          >
            {bRating}
          </div>
        </div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <img src="/classification/good.png" alt="" />
          <div className={styles.reviewTitle}>Opening</div>
          <img src="/classification/good.png" alt="" />
        </div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <img src="/classification/good.png" alt="" />
          <div className={styles.reviewTitle}>Middle Game</div>
          <img src="/classification/good.png" alt="" />
        </div>
        <div className={`${styles.line} ${styles.reviewStatics}`}>
          <img src="/classification/good.png" alt="" />
          <div className={styles.reviewTitle}>End Game</div>
          <img src="/classification/good.png" alt="" />
        </div>
      </div>
    </div>
  );
}
