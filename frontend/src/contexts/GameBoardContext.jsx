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
  const [selectedBoardTheme, setSelectedBoardTheme] = useState(0);
  const [avalibleBoardThemes, setAvalibleBoardThemes] = useState([
    { dark: "#779952", light: "#edeed1" },
  ]);
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
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
  //
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
        }}
      >
        {children}
      </GameboardContext.Provider>
    </>
  );
}

export { GameboardContext, ChessBoardContextProvider };
