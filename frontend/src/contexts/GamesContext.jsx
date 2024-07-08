import React, { createContext, useState } from "react";

const GameContext = createContext("");

function GameContextProvider({ children }) {
  const [allGames, setAllGames] = useState([]);
  const [countChessDCLoaded, setCountChessDCLoaded] = useState(0);
  const [countLichessLoaded, setLichessDCLoaded] = useState(0);

  const updateAllGames = (newGames) => {
    setAllGames([...allGames, ...newGames]);
  };

  return (
    <GameContext.Provider value={{ allGames, updateAllGames }}>
      {children}
    </GameContext.Provider>
  );
}

export { GameContextProvider, GameContext };
