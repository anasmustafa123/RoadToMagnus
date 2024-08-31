import { Chess, ChessInstance, ShortMove } from 'chess.js';
import React, { ReactNode, createContext, useState } from 'react';
import { ClassSymbol, ClassName, Classification } from '../types/Review';
import {
  BoardTheme,
  GameBoardContextType,
  PieceTheme,
} from '../types/GameBoardContextType';
import { CustomSquareStyles } from 'react-chessboard/dist/chessboard/types';
const initalContextValues: GameBoardContextType = {
  setGame: () => {},
  setShowClassification: () => {},
  setSelectedPieceTheme: () => {},
  setSelectedBoardTheme: () => {},
  setAvalibleBoardThemes: () => {},
  setAvaliblePieceThemes: () => {},
  setRightClickedSquares: () => {},
  setMoveSquares: () => {},
  setOptionSquares: () => {},
  setClassificationInfo: () => {},
  classificationInfo: [],
  optionSquares: {},
  moveSquares: {},
  rightClickedSquares: {},
  getClassification: () => 'good',
  makeAMove: () => {},
  safeGameMutate: () => {},
  avaliblePieceThemes: [],
  avalibleBoardThemes: [],
  selectedBoardTheme: {
    name: 'darkwood',
    url: '/board_themes/darkwood.png',
    colors: { dark: '', light: '' },
  },
  selectedPieceTheme: 'pieces_1',
  showClassification: false,
  game: Chess(),
  getClassificationByName: () => undefined,
};
const GameboardContext =
  createContext<GameBoardContextType>(initalContextValues);
const ChessBoardContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [game, setGame] = useState<ChessInstance>(new Chess());
  const [rightClickedSquares, setRightClickedSquares] =
    useState<CustomSquareStyles>({});
  const [moveSquares, setMoveSquares] = useState<CustomSquareStyles>({});
  const [optionSquares, setOptionSquares] = useState<CustomSquareStyles>({});
  const [showClassification, setShowClassification] = useState<boolean>(true);
  const [selectedPieceTheme, setSelectedPieceTheme] =
    useState<PieceTheme>('pieces_1');
  const [avaliblePieceThemes, setAvaliblePieceThemes] = useState<string[]>([
    'pieces_1',
    'pieces_2',
  ]);
  const [classificationInfo, setClassificationInfo] = useState<
    Classification[]
  >([
    { color: '#897e30d6', sym: '!$', name: 'book' },
    { color: '#00989dba', sym: '$$', name: 'brilliant' },
    { color: '#185fb5d9', sym: '$', name: 'great' },
    { color: '#509d0080', sym: '=$$', name: 'best' },
    { color: '#509d0080', sym: '!!', name: 'excellent' },
    { color: '#00563cb3', sym: '!', name: 'good' },
    { color: '#00563cb3', sym: '==', name: 'forced' },
    { color: '#ff98007a', sym: '?!', name: 'inaccuracy' },
    { color: '#dd8400c2', sym: '?', name: 'mistake' },
    { color: '#ff000096', sym: '??', name: 'blunder' },
    { color: '#ff0909', sym: '?$', name: 'missed' },
    { color: '#ff0909', sym: '????', name: 'botezgambit' },
  ]);

  function getClassificationByName(
    className: ClassName,
  ): Classification | undefined {
    let classification = classificationInfo.find(
      (classiInfo) => classiInfo.name == className,
    );
    return classification;
  }

  const [selectedBoardTheme, setSelectedBoardTheme] = useState<BoardTheme>({
    name: 'darkwood',
    url: '/board_themes/darkwood.png',
    colors: { dark: '', light: '' },
  });

  const [avalibleBoardThemes, setAvalibleBoardThemes] = useState<BoardTheme[]>(
    [],
  );

  function makeAMove(san: string | ShortMove): any {
    console.log('make a move');
    const gameCopy = { ...game };
    const result = gameCopy.move(san);
    console.log({ result });
    if (result) {
      setGame(gameCopy);
    }

    return result; // null if the move was illegal, the move object if the move was legal
  }
  // modify the game state after each update
  function safeGameMutate(modify: (update: ChessInstance) => ChessInstance) {
    setGame((g: ChessInstance) => {
      const update: ChessInstance = { ...g };
      modify(update);
      return update;
    });
  }

  const getClassification = (classiSym: ClassSymbol): ClassName => {
    let index = classificationInfo.findIndex(
      (classinfo) => classinfo.sym == classiSym,
    );
    return classificationInfo[index].name;
  };

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
          classificationInfo,
          getClassification,
          setClassificationInfo,
          getClassificationByName,
        }}
      >
        {children}
      </GameboardContext.Provider>
    </>
  );
};

export { GameboardContext, ChessBoardContextProvider };
