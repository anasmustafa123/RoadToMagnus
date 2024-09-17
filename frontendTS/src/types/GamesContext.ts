import { Game, Unique_Game_Array } from './Game';

export interface GamesContext {
  setEngineDepth: React.Dispatch<React.SetStateAction<number>>;
  chessdcomGames: Unique_Game_Array;
  setChessdcomGames: React.Dispatch<React.SetStateAction<Unique_Game_Array>>;
  lichessGames: Unique_Game_Array;
  setLichessGames: React.Dispatch<React.SetStateAction<Unique_Game_Array>>;
  engineDepth: number;
  get_game_byId: (id: string) => Game | null;
}
