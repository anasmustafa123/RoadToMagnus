import { Game } from './Game';

export interface GamesContext {
  setEngineDepth: React.Dispatch<React.SetStateAction<number>>;
  chessdcomGames: Game[];
  setChessdcomGames: React.Dispatch<React.SetStateAction<Game[]>>;
  lichessGames: Game[];
  setLichessGames: React.Dispatch<React.SetStateAction<Game[]>>;
  engineDepth: number;
}
