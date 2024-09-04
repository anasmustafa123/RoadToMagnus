import React, { createContext, ReactNode, useState } from 'react';
import type { GamesContext } from '../types/GamesContext';
import { Game, Unique_Game_Array } from '../types/Game';
const initialContext: GamesContext = {
  setEngineDepth: () => {},
  engineDepth: 0,
  chessdcomGames: new Unique_Game_Array(),
  setChessdcomGames: () => {},
  lichessGames: new Unique_Game_Array(),
  setLichessGames: () => {},
};
const GameContext = createContext<GamesContext>(initialContext);

const GameContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [engineDepth, setEngineDepth] = useState<number>(18);
  const [chessdcomGames, setChessdcomGames] = useState<Unique_Game_Array>(
    new Unique_Game_Array(),
  );
  const [lichessGames, setLichessGames] = useState<Unique_Game_Array>(
    new Unique_Game_Array(),
  );

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
