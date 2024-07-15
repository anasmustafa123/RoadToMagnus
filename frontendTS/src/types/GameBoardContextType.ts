import { ChessInstance, ShortMove } from 'chess.js';
import { ClassName, ClassSymbol, ClassificationRes } from './GameReview';
import { CustomSquareStyles } from 'react-chessboard/dist/chessboard/types';

export interface GameBoardContextType {
  setClassificationInfo: React.Dispatch<
    React.SetStateAction<ClassificationRes[]>
  >;
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
  classificationInfo: ClassificationRes[];
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
  getClassificationByName: (
    className: ClassName,
  ) => ClassificationRes | undefined;
}

export interface BoardTheme {
  dark: string;
  light: string;
}

export type PieceTheme = 'pieces_1' | 'pieces_2';
