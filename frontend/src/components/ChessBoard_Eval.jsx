import React, { useState, useContext } from "react";
import ChessBoard from "./ChessBoard";
import EvaluationBar from "./EvaluationBar";
import { GameboardContext } from "../contexts/GameBoardContext";
import styles from "../styles/ChessBoard_Eval.module.css";
export default function ChessBoard_Eval() {
  const {
    makeAMove,
    safeGameMutate,
    setMoveSquares,
    setOptionSquares,
    setRightClickedSquares,
  } = useContext(GameboardContext);
  const [moves, setMoves] = useState([
    "e4",
    "e5",
    "Nf3",
    "Nc6",
    "Bb5",
    "a6",
    "Ba4",
    "Nf6",
    "O-O",
    "Be7",
    "Re1",
    "b5",
    "Bb3",
    "d6",
    "c3",
    "O-O",
    "h3",
    "Nb8",
    "d4",
    "Nbd7",
    "c4",
    "c6",
    "cxb5",
    "axb5",
    "Nc3",
    "Bb7",
    "Bg5",
    "h6",
    "Bh4",
    "Re8",
    "a3",
    "Bf8",
    "Rc1",
    "g6",
    "dxe5",
    "dxe5",
    "Qe2",
    "Qe7",
    "Red1",
    "Bg7",
    "Ba2",
    "Rad8",
    "Nd2",
    "Nb6",
    "Nb3",
    "Rxd1+",
    "Rxd1",
    "g5",
    "Bg3",
    "Nc4",
    "a4",
    "Qb4",
    "Qc2",
    "bxa4",
    "Nxa4",
    "Na5",
    "Nc5",
    "Bf8",
    "Rd3",
    "Ba8",
    "Kh2",
    "Kh8",
    "f3",
    "Qb6",
    "Qf2",
    "Kg7",
    "Rc3",
    "Qc7",
    "Nd2",
    "Qe7",
    "b4",
    "Nb7",
    "Nxb7",
    "Bxb7",
    "Qc5",
    "Qg5",
    "Nf1",
    "Nd7",
    "Qe3",
    "Qxe3",
    "Nxe3",
    "Bxb4",
    "Rd3",
    "Nc5",
    "Nf5+",
    "Kg6",
    "Rd6+",
    "f6",
    "Bc4",
    "h5",
    "h4",
    "gxh4",
    "Nxh4+",
    "Kg5",
    "Bf7",
    "Rb8",
    "g3",
    "Rb2+",
    "Kh3",
    "Rf2",
    "Rd8",
    "Kh6",
    "Nf5+",
    "Kg5",
    "Rg8#",
  ]);
  const [movesIndex, setMovesIndex] = useState(0);
  const [classNameifications, setclassNameifications] = useState([
    "?!",
    "!",
    "?$",
    "?!",
    "==",
    "????",
    "?",
    "?!",
    "?!",
    "??",
    "????",
    "????",
    "==",
    "$",
    "?$",
    "$",
    "?!",
    "!!",
    "?$",
    "$",
    "!!",
    "?$",
    "!",
    "?$",
    "==",
    "==",
    "?$",
    "?",
    "????",
    "$",
    "?!",
    "!",
    "?",
    "??",
    "=$$",
    "??",
    "!!",
    "$",
    "$",
    "?!",
    "!",
    "??",
    "!!",
    "==",
    "?$",
    "?",
    "?",
    "?",
    "?",
    "?!",
    "????",
    "????",
    "!",
    "?",
    "$",
    "??",
    "!!",
    "!!",
    "??",
    "!",
    "??",
    "$",
    "!",
    "!",
    "?",
    "?",
    "!!",
    "????",
    "=$$",
    "!!",
    "??",
    "!!",
    "!!",
    "?$",
    "$",
    "?$",
    "!!",
    "????",
    "?",
    "!!",
    "?",
    "$",
    "$",
    "!!",
    "=$$",
    "?",
    "=$$",
    "=$$",
    "$",
    "????",
    "?$",
    "!!",
    "==",
    "==",
    "$",
    "??",
    "??",
    "?!",
    "=$$",
    "????",
    "!!",
    "?$",
    "!",
    "=$$",
    "????",
  ]);
  const [evaluations, setEvaluations] = useState([
    "0.5",
    "1.4",
    "-3.3",
    "5.3",
    "10.7",
    "-1.9",
  ]);
  const [numOfGames, setNumOfGames] = useState(5);
  return (
    <div classNameName={styles.chessboard_eval}>
      <div style={{ display: "flex" }}>
        <EvaluationBar evaluation={evaluations[movesIndex]}></EvaluationBar>
        <ChessBoard
          moves={moves}
          movesIndex={movesIndex}
          classNameifications={classNameifications}
        ></ChessBoard>
      </div>
      <div
        className={styles.buttonContainer}
        style={{ display: "flex", gap: "1rem" }}
      >
        <button
          onClick={() => {
            movesIndex ? setMovesIndex((old) => old - 1) : "";
            safeGameMutate((game) => {
              game.undo();
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
            safeGameMutate((game) => {
              game.reset();
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
              const res = makeAMove(moves[currentIndex]);
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
