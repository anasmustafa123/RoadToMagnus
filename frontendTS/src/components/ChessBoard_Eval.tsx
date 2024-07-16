import React, { useState, useContext } from 'react';
import ChessBoard from './ChessBoard';
import EvaluationBar from './EvaluationBar';
import { GameboardContext } from '../contexts/GameBoardContext';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import styles from '../styles/ChessBoard_Eval.module.css';
import { ChessInstance } from 'chess.js';
export default function ChessBoard_Eval() {
  const {
    makeAMove,
    safeGameMutate,
    setMoveSquares,
    setOptionSquares,
    setRightClickedSquares,
  } = useContext(GameboardContext);
  const { classifications, evaluations, moves } = useContext(ReviewGameContext);

  const [movesIndex, setMovesIndex] = useState(0);

  return (
    <div className={styles.chessboard_eval}>
      <div style={{ display: 'flex' }}>
        <EvaluationBar evaluation={evaluations[movesIndex]}></EvaluationBar>
        <ChessBoard
          moves={moves}
          movesIndex={movesIndex}
          classifications={classifications}
        ></ChessBoard>
      </div>
      <div
        className={styles.buttonContainer}
        style={{ display: 'flex', gap: '1rem' }}
      >
        <button
          onClick={() => {
            movesIndex ? setMovesIndex((old) => old - 1) : '';
            safeGameMutate((update) => {
              update.undo();
              return update;
            });
            setMoveSquares({});
            setOptionSquares({});
            setRightClickedSquares({});
          }}
        >
          <i className="bx bxs-left-arrow"></i>
        </button>
        <button
          onClick={() => {
            setMovesIndex(0);
            safeGameMutate((update: ChessInstance) => {
              update.reset();
              return update;
            });
            setMoveSquares({});
            setOptionSquares({});
            setRightClickedSquares({});
          }}
        >
          <i className="bx bx-reset"></i>
        </button>
        <button
          onClick={() => {
            const currentIndex = movesIndex;
            if (moves.length > currentIndex) {
              const res = makeAMove
                ? makeAMove(moves[currentIndex].san)
                : undefined;
              if (res) setMovesIndex((old) => old + 1);
            }
          }}
        >
          <i className="bx bxs-right-arrow"></i>
        </button>
      </div>
    </div>
  );
}
