import React, { useState, useContext } from "react";
import ChessBoard from "./ChessBoard";
import EvaluationBar from "./EvaluationBar";
import { GameboardContext } from "../contexts/GameBoardContext";
export default function ChessBoard_Eval() {
  const {
    makeAMove,
    safeGameMutate,
    setMoveSquares,
    setOptionSquares,
    setRightClickedSquares,
  } = useContext(GameboardContext);
  const [moves, setMoves] = useState(["e4", "e5", "Nf3", "Nc6", "Bc4"]);
  const [movesIndex, setMovesIndex] = useState(0);
  const [classifications, setClassifications] = useState([
    "!$",
    "$$",
    "$",
    "?",
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
    <>
      <div style={{ display: "flex" }}>
        <EvaluationBar evaluation={evaluations[movesIndex]}></EvaluationBar>
        <ChessBoard classifications={classifications}></ChessBoard>
      </div>
      <div>
        <button
          onClick={() => {
            const currentIndex = movesIndex;
            if (moves.length > currentIndex) {
              setMovesIndex((old) => old + 1);
              makeAMove(moves[currentIndex]);
            }
          }}
        >
          forward
        </button>
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
          backward
        </button>
      </div>
    </>
  );
}
