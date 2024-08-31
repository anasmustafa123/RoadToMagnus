import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Chessboard } from 'react-chessboard';
import '../styles/chessboard.css';
import 'react-toastify/dist/ReactToastify.css';
import { GameboardContext } from '../contexts/GameBoardContext';
import { ShortMove, Square } from 'chess.js';
import type { ClassName } from '../types/Review';
import type { Move } from '../types/Game';
import type { Piece } from 'react-chessboard/dist/chessboard/types';
import { UserContext } from '../contexts/UserContext';
import {
  Arrow,
  CustomSquareStyles,
  PromotionPieceOption,
} from 'react-chessboard/dist/chessboard/types';
import { _pointInLine } from 'chart.js/helpers';
const ChessBoard: React.FC<{
  moves?: Move[];
  classifications?: ClassName[];
  movesIndex?: number;
  inlineStyles?:React.CSSProperties ;
}> = ({
  moves = [],
  classifications = [],
  movesIndex = 0,
  inlineStyles = undefined,
}) => {
  const [customArrows, setCustomArrows] = useState<Arrow[]>([]);
  const [currentClassif, setCurrentClassifi] = useState<ClassName>();
  const [currentMove, setCurrentMove] = useState({ to: '' });
  const {
    game,
    makeAMove,
    showClassification,
    selectedPieceTheme,
    selectedBoardTheme,
    rightClickedSquares,
    setRightClickedSquares,
    moveSquares,
    optionSquares,
    setOptionSquares,
    classificationInfo,
    getClassificationByName,
  } = useContext(GameboardContext);
  const { chessboardwidth } = useContext(UserContext);
  const [moveFrom, setMoveFrom] = useState<Square>();
  const [moveTo, setMoveTo] = useState<Square>();
  const [showPromotionDialog, setShowPromotionDialog] =
    useState<boolean>(false);

  useEffect(() => {
    makeAMove;
    if (movesIndex) {
      const moves = game ? game.history({ verbose: true }) : [];
      if (movesIndex > moves.length) {
        throw new Error(
          `error ${{ movesIndex, movesdotlength: moves.length }}`,
        );
      }
      if (moves.length == movesIndex) {
        let themove = moves[movesIndex - 1];
        let className = classifications[movesIndex - 1];
        setCurrentMove(themove);
        console.log({ themove, className });
        setCurrentClassifi(className);
        setCustomArrows([
          [
            themove.from,
            themove.to,
            classificationInfo.find(
              (classiInfo) => classiInfo.name == className,
            )?.color,
          ],
        ]);
      }
    } else {
      setCustomArrows([]);
      setCurrentMove({ to: '' });
      setCurrentClassifi('unknown');
    }
  }, [movesIndex]);

  // style possible moves
  function getMoveOptions(square: Square) {
    if (game) {
      const moves = game.moves({
        square,
        verbose: true,
      });
    } else {
      setOptionSquares({});
      return false;
    }
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }
    let newSquares: CustomSquareStyles = {};
    moves.map((move) => {
      const targetPiece = game.get(move.to);
      const currentPiece = game.get(square);
      newSquares[move.to] = {
        background:
          targetPiece &&
          currentPiece &&
          targetPiece.color !== currentPiece.color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: Square) {
    // no clicked squares yet
    setRightClickedSquares({});
    // responsible for showing the possible move styling
    if (!moveFrom) {
      // get the possible moves on the square
      const hasMoveOptions = getMoveOptions(square);
      // if it has possible moves
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }
    // responsible for making the move
    // so the current clicked square is the destination
    if (!moveTo) {
      // if u already clicked on a square aka (movefrom)
      // retrive all possible moves from it
      const moves = game.moves({
        square: moveFrom,
        verbose: true,
      });
      // if the square is a possible move of movefrom
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square,
      );
      // if the clicke move is not a possibe move of the movefrom
      if (!foundMove) {
        const hasMoveOptions = getMoveOptions(square);
        // if clicked on another piece
        setMoveFrom(hasMoveOptions ? square : undefined);
        return;
      }
      setMoveTo(square);
      if (
        (foundMove.color === 'w' &&
          foundMove.piece === 'p' &&
          square[1] === '8') ||
        (foundMove.color === 'b' &&
          foundMove.piece === 'p' &&
          square[1] === '1')
      ) {
        setShowPromotionDialog(true);
        return;
      }
      const move: ShortMove = {
        from: moveFrom,
        to: square,
        promotion: 'q',
      };
      makeAMove(move);
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }
      setMoveFrom(undefined);
      setMoveTo(undefined);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece: PromotionPieceOption | undefined) {
    if (piece) {
      let promotionPiece = piece[1].toLowerCase() ?? 'q';
      if (
        moveFrom &&
        moveTo &&
        (promotionPiece == 'b' ||
          promotionPiece == 'n' ||
          promotionPiece == 'r' ||
          promotionPiece == 'q')
      ) {
        const move: ShortMove = {
          from: moveFrom,
          to: moveTo,
          promotion: promotionPiece,
        };
        makeAMove(move);
      }
      setMoveFrom(undefined);
      setMoveTo(undefined);
      setShowPromotionDialog(false);
      setOptionSquares({});
      return true;
    }
    return false;
  }

  function onSquareRightClick(square: Square) {
    const colour = 'rgba(0, 0, 255, 0.4)';
    let squares = rightClickedSquares[square];
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        squares && squares.backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    console.log(game.board());
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    } as ShortMove);
    console.log(move);
    // illegal move
    if (move === null) return false;
    return true;
  }
  const pieces: Piece[] = [
    'wP',
    'wN',
    'wB',
    'wR',
    'wQ',
    'wK',
    'bP',
    'bN',
    'bB',
    'bR',
    'bQ',
    'bK',
  ];

  const customPieces = useMemo(() => {
    let pieceComponents: {
      [key: string]: React.FC<{ square: Square; squareWidth: number }>;
    } = {};
    pieces.forEach((piece: Piece) => {
      pieceComponents[piece] = ({ square, squareWidth }) => {
        return showClassification && currentMove.to == square ? (
          <div
            style={{
              position: 'relative',
              backgroundColor: getClassificationByName(
                currentClassif || 'unknown',
              )?.color,
            }}
          >
            <img
              style={{
                position: 'absolute',
                width: '40%',
                right: '-10px ',
                top: '-10px',
              }}
              src={`/classification/${currentClassif}.png`}
              alt="move classification"
            />
            <div
              style={{
                width: squareWidth,
                height: squareWidth,
                backgroundImage: `url(/${selectedPieceTheme}/${piece}.svg)`,
                backgroundSize: '100%',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: squareWidth,
              height: squareWidth,
              backgroundImage: `url(/${selectedPieceTheme}/${piece}.svg)`,
              backgroundSize: '100%',
            }}
          />
        );
      };
    });
    return pieceComponents;
  }, [currentClassif, currentMove]);

  return (
    <div style={inlineStyles}>
      <Chessboard
        id="StyledBoard"
        animationDuration={200}
        boardWidth={chessboardwidth}
        arePremovesAllowed={false}
        arePiecesDraggable={true}
        onPieceDrop={onDrop}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          backgroundSize: 'cover',
          backgroundImage: `url("${selectedBoardTheme.url}")`,
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        customDarkSquareStyle={{
          backgroundColor: selectedBoardTheme.colors.dark,
        }}
        customLightSquareStyle={{
          backgroundColor: selectedBoardTheme.colors.light,
        }}
        customPieces={customPieces}
        customArrows={customArrows}
      />
      <div style={{ display: 'flex', gap: '1rem' }}></div>
    </div>
  );
};

export default ChessBoard;
