import { ChessInstance, ShortMove } from 'chess.js';
import { ClassName, ClassSymbol, Classification } from './Review';
import { CustomSquareStyles } from 'react-chessboard/dist/chessboard/types';

export interface GameBoardContextType {
  setClassificationInfo: React.Dispatch<React.SetStateAction<Classification[]>>;
  setGame: React.Dispatch<React.SetStateAction<ChessInstance>>;
  setShowClassification: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPieceTheme: React.Dispatch<React.SetStateAction<PieceTheme>>;
  setSelectedBoardTheme: React.Dispatch<React.SetStateAction<BoardTheme>>;
  setAvalibleBoardThemes: React.Dispatch<React.SetStateAction<BoardTheme[]>>;
  setAvaliblePieceThemes: React.Dispatch<React.SetStateAction<string[]>>;
  setRightClickedSquares: React.Dispatch<
    React.SetStateAction<CustomSquareStyles>
  >;
  setMoveSquares: React.Dispatch<React.SetStateAction<CustomSquareStyles>>;
  setOptionSquares: React.Dispatch<React.SetStateAction<CustomSquareStyles>>;
  classificationInfo: Classification[];
  optionSquares: CustomSquareStyles;
  moveSquares: CustomSquareStyles;
  rightClickedSquares: CustomSquareStyles;
  getClassification: (classiSym: ClassSymbol) => ClassName;
  game: ChessInstance;
  makeAMove: (san: string | ShortMove) => any;
  safeGameMutate: (modify: (update: ChessInstance) => ChessInstance) => void;
  avaliblePieceThemes: string[];
  avalibleBoardThemes: BoardTheme[];
  selectedBoardTheme: BoardTheme;
  selectedPieceTheme: PieceTheme;
  showClassification: boolean;
  getClassificationByName: (className: ClassName) => Classification | undefined;
}

export interface BoardTheme {
  colors: { dark: string; light: string };
  name: string;
  url: string;
}

export type PieceTheme = 'pieces_1' | 'pieces_2';
