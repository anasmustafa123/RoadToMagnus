import React, { useState, createContext } from "react";
import { Chess } from "chess.js";
const ReviewGameContext = createContext("");

function ReviewGameContextProvider({ children }) {
  const minwining = (rating, plColor) => {
    const wineval =
      rating <= 600
        ? 3.0
        : rating > 600 && rating <= 1000
        ? 2.5
        : rating > 1000 && rating <= 1400
        ? 2
        : rating > 1400 && rating <= 1800
        ? 1.5
        : 1;
    return wineval * plColor;
  };

  const minLosing = (rating, plColor) => {
    return -1 * minwining(rating, plColor);
  };

  const [reviewStatus, setReviewStatus] = useState(0);
  const [classifications, setClassifications] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [moves, setmoves] = useState([]);
  const [wuser, setwUser] = useState([]);
  const [buser, setbUser] = useState([]);
  const [gameResult, setGameResult] = useState([]);
  const [playerColor, setPlayerColor] = useState([]);

  /* 
userInfo{bUsername, bAccuracy, bRating, bAvatar}
evaluation: {type, value}
engineLine: {evaluation, bestmoveLan}
*/

  /**
   * *
   * @param {[engineLine]} EngineRes
   * @param {number} moveNum
   * @param {String} fen
   * @returns
   */
  const getClassification = (engineRespones, moveNum, fen) => {
    console.log(`lines got from stockfish: ${engineRespones.length} lines`);
    let game = new Chess(fen);
    let plColor = moveNum % 2 ? 1 : -1;
    let plRating = plColor == 1 ? wuser.rating : buser.rating;
    let maxClassification = 6;
    let firstMiddleGame = 0;
    let firsetEndGame = 0;
    let isWining =
      engineRespones[0].evaluation.type == "cp"
        ? engineRespones[0].evaluatio.value >= minwining(plRating, plColor)
        : false;
    let isLosing =
      engineRespones[0].evaluation.type == "cp"
        ? engineRespones[0].evaluatio.value <= minLosing(plRating, plColor)
        : false;
    let isQueen = game.get(moves[moveNum - 1].to).toLowerCase() == "q";
    let isSacc = playerColor * exchangeResult(game, moves[moveNum - 1].to) >= 2;
    // is best when its one of top lines returned by the engine
    let isbest = engineRespones.find((engineLine) => {
      return engineLine.bestmoveLan == moves[moveNum - 1].lan;
    })
      ? true
      : false;
    // u set the first move of middle game after last opening move  (book move)
    if (!firstMiddleGame) {
      //check book moves
    }
  };
  // check attackers at b4
  /*  */
  const exchangeResult = (game, square) => {
    let whiteAttackers = game.attackers(square, WHITE);
    let blackAttackers = game.attackers(square, BLACK);
    console.log(whiteAttackers);
    console.log(blackAttackers);
  };

  return (
    <ReviewGameContext.Provider
      value={{
        wuser,
        buser,
        moves,
        classifications,
        evaluations,
        setClassifications,
        setEvaluations,
        setmoves,
        setwUser,
        setbUser,
        setGameResult,
        playerColor,
        setPlayerColor,
        gameResult,
      }}
    >
      {children}
    </ReviewGameContext.Provider>
  );
}

export { ReviewGameContext, ReviewGameContextProvider };
