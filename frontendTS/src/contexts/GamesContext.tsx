import React, { createContext, ReactNode, useState } from 'react';
import type { GamesContext } from '../types/GamesContext';
import { Game } from '../types/Game';
const initialContext: GamesContext = {
  setAllGames: () => {},
  setEngineDepth: () => {},
  allGames: [],
  engineDepth: 0,
  updateAllGames: () => {},
};
const GameContext = createContext<GamesContext>(initialContext);

const GameContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [engineDepth, setEngineDepth] = useState<number>(18);

  const updateAllGames = (newGames: Game[]) => {
    setAllGames([...allGames, ...newGames]);
  };

  return (
    <GameContext.Provider
      value={{
        allGames,
        setAllGames,
        updateAllGames,
        engineDepth,
        setEngineDepth,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContextProvider, GameContext };
