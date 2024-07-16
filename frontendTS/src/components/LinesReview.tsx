import React from "react";
import styles from "../styles/LinesReview.module.css";
export default function LinesReview() {
  const moves = ["e4", "e5", "Nf3", "Nc6", "Bc4"];
  const classifications = ["!?", "$$", "$", "!!", "!"];
  const bgColors = ["#fffefe", "#efefef"];
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
  const pieces = [
    "wP",
    "wN",
    "wB",
    "wR",
    "wQ",
    "wK",
    "bP",
    "bN",
    "bB",
    "bR",
    "bQ",
    "bK",
  ];
  const getPiece = (move, color) => {
    return move[0] == "N" ||
      move[0] == "Q" ||
      move[0] == "B" ||
      move[0] == "K" ||
      move[0] == "R"
      ? `${color}${move[0]}`
      : `${color}P`;
  };
  return (
    <div>
      {moves.map((move, i) =>
        !(i % 2) ? (
          <div
            style={{ backgroundColor: `${bgColors[(i / 2 + 1) % 2]}` }}
            key={i}
            className={styles.movesContainer}
          >
            <span className={styles.move_index}>{i / 2 + 1}.</span>
            <span className={styles.move_detail}>
              <img src="/classification/good.png" alt="" />
              <img src="/timeControl/blitz.svg" alt="" />
              <span>
                {move}
              </span>
            </span>
            {moves[i + 1] ? (
              <span className={styles.move_detail}>
                <img src="/classification/good.png" alt="" />
                <img src="/timeControl/blitz.svg" alt="" />
                <span>{moves[i + 1]}</span>
              </span>
            ) : (
              <></>
            )}
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
}
