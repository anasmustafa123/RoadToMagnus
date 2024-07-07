import { Chess } from "chess.js";
import React, { createContext, useState } from "react";
const GameboardContext = createContext("");
function ChessBoardContextProvider({ children }) {
  const [game, setGame] = useState(new Chess());
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [showClassification, setShowClassification] = useState(true);
  const [selectedPieceTheme, setSelectedPieceTheme] = useState(0);
  const [avaliblePieceThemes, setAvaliblePieceThemes] = useState([
    "pieces_1",
    "pieces_2",
  ]);
  const [classificationInfo, setClassificationInfo] = useState({
    book: { color: "#897e30d6", sym: "!$" },
    brilliant: { color: "#00989dba", sym: "$$" },
    great: { color: "#185fb5d9", sym: "$" },
    best: { color: "#509d0080", sym: "=$$" },
    excellent: { color: "#509d0080", sym: "!!" },
    good: { color: "#00563cb3", sym: "!" },
    forced: { color: "#00563cb3", sym: "==" },
    inaccuracy: { color: "#ff98007a", sym: "?!" },
    mistake: { color: "#dd8400c2", sym: "?" },
    blunder: { color: "#ff000096", sym: "??" },
    missed: { color: "#ff0909", sym: "?$" },
    botezgambit: { color: "#ff0909", sym: "????" },
  });
  const [selectedBoardTheme, setSelectedBoardTheme] = useState(0);
  const [avalibleBoardThemes, setAvalibleBoardThemes] = useState([
    { dark: "#779952", light: "#edeed1" },
  ]);
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    console.log({result})
    if (result) {
      setGame(gameCopy);
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }
  // modify the game state after each update
  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }
  const getClassification = (classiSym) => {
    for (let key in classificationInfo) {
      if (classificationInfo[key].sym == classiSym) {
        return key;
      }
    }
  };

  return (
    <>
      <GameboardContext.Provider
        value={{
          game,
          setGame,
          makeAMove,
          safeGameMutate,
          showClassification,
          setShowClassification,
          selectedPieceTheme,
          setSelectedPieceTheme,
          selectedBoardTheme,
          setSelectedBoardTheme,
          avalibleBoardThemes,
          setAvalibleBoardThemes,
          avaliblePieceThemes,
          setAvaliblePieceThemes,
          rightClickedSquares,
          setRightClickedSquares,
          moveSquares,
          setMoveSquares,
          optionSquares,
          setOptionSquares,
          classificationInfo,
          getClassification,
        }}
      >
        {children}
      </GameboardContext.Provider>
    </>
  );
}

export { GameboardContext, ChessBoardContextProvider };
