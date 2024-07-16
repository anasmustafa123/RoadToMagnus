import { Game } from './Game';

export interface GamesContext {
  setAllGames: React.Dispatch<React.SetStateAction<Game[]>>;
  setEngineDepth: React.Dispatch<React.SetStateAction<number>>;
  allGames: Game[];
  engineDepth: number;
  updateAllGames: (newGames: Game[]) => void;
}
