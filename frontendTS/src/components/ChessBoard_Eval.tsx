import { useState, useContext } from 'react';
import ChessBoard from './ChessBoard';
import EvaluationBar from './EvaluationBar';
import { GameboardContext } from '../contexts/GameBoardContext';
import { ReviewGameContext } from '../contexts/ReviewGameContext';
import styles from '../styles/ChessBoard_Eval.module.css';
import { ChessInstance } from 'chess.js';
export default function ChessBoard_Eval(props: {
  inlineStyles: React.CSSProperties;
}) {
  const {
    makeAMove,
    safeGameMutate,
    setMoveSquares,
    setOptionSquares,
    setRightClickedSquares,
  } = useContext(GameboardContext);
  const { classificationNames, evaluations, moves } =
    useContext(ReviewGameContext);

  const [movesIndex, setMovesIndex] = useState(0);

  return (
    <div
      style={{ ...props.inlineStyles }}
      className={styles.chessboard_eval}
    >
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          margin: 'auto',
          width: 'fit-content',
        }}
      >
        <EvaluationBar evaluation={evaluations[movesIndex-1]}></EvaluationBar>
        <ChessBoard
          inlineStyles={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 'fit-content',
            height: '100%',
            gridColumn: '3 / 8',
          }}
          moves={moves}
          movesIndex={movesIndex}
          classifications={classificationNames}
        ></ChessBoard>
      </div>
      <div
        className={styles.buttonContainer}
        style={{ display: 'flex', gap: '1rem' }}
      >
        <button
          onClick={() => {
            console.log('left');
            movesIndex ? setMovesIndex((old) => old - 1) : '';
            safeGameMutate((update) => {
              update.undo();
              return update;
            });
            //setMoveSquares({});
            //setOptionSquares({});
            //setRightClickedSquares({});
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
            console.log('right');
            const currentIndex = movesIndex;
            if (moves.length > currentIndex) {
              const res = makeAMove(moves[currentIndex].san);
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
