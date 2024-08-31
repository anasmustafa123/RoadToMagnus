import React, { createContext, ReactNode, useState } from 'react';
import type { GamesContext } from '../types/GamesContext';
import { Game } from '../types/Game';
const initialContext: GamesContext = {
  setEngineDepth: () => {},
  engineDepth: 0,
  chessdcomGames: [],
  setChessdcomGames: () => {},
  lichessGames: [],
  setLichessGames: () => {},
};
const GameContext = createContext<GamesContext>(initialContext);

const GameContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [engineDepth, setEngineDepth] = useState<number>(18);
  const [chessdcomGames, setChessdcomGames] = useState<Game[]>([]);
  const [lichessGames, setLichessGames] = useState<Game[]>([]);

  return (
    <GameContext.Provider
      value={{
        chessdcomGames,
        setChessdcomGames,
        lichessGames,
        setLichessGames,
        engineDepth,
        setEngineDepth,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContextProvider, GameContext };
