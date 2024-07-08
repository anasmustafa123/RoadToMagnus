import React, { useState } from "react";
import Games from "./pages/Games";
import { ChessBoardContextProvider } from "./contexts/GameBoardContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import "./App.css";
function App() {
  /*  const [finalDepth, setFinalDepth] = useState(15);
  const [stockStates, setStockStates] = useState({
    currentDepth: 0,
    currentEval: 0,
    preferedMoves: [],
  });

  var wasmSupported =
    typeof WebAssembly === "object" &&
    WebAssembly.validate(
      Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
    );

  var stockfish = new Worker(
    wasmSupported
      ? "./src/scripts/stockfish/stockfish.wasm.js"
      : "./src/scripts/stockfish/stockfish.js"
  );

  stockfish.addEventListener("message", function (e) {
    console.log("loading");
    //document.getElementById("output").innerText += e.data + "\n";

    // Handle best move output
    if (e.data.includes("bestmove")) {
      var bestMove = e.data.split(" ")[1];
      console.log("Best move: " + bestMove);

      document.getElementById("output").innerText +=
        "Best move: " + bestMove + "\n";
    }

    // Extract evaluation info
    if (e.data.startsWith("info")) {
      var parts = e.data.split(" ");
      console.log({ parts: parts });
      let preferedMoves = parts.slice(parts.indexOf("pv") + 1);
      let newdata = {
        currentDepth: parts[parts.indexOf("depth") + 1],
        currentEval: parts[parts.indexOf("cp") + 1] / 100,
        preferedMoves: preferedMoves,
      };
      if (newdata.currentDepth == finalDepth) {
        console.log();
      }
      setStockStates(newdata);
      console.log(newdata); */

  /*  var depth = parts[2]; // Assuming 'info depth X ...'
    var scoreIndex = parts.indexOf('score'); */
  /*  if (scoreIndex !== -1) {
        var scoreType = parts[scoreIndex + 1];
        var scoreValue = parseInt(parts[scoreIndex + 2]);

        // Convert score for mate situations
        if (scoreType === 'cp') {
            console.log('Depth: ' + depth + ', Evaluation: ' + scoreValue / 100.0);
            document.getElementById("output").innerText += 'Depth: ' + depth + ', Evaluation: ' + scoreValue / 100.0 + '\n';
        } else if (scoreType === 'mate') {
            console.log('Depth: ' + depth + ', Mate in: ' + scoreValue);
            document.getElementById("output").innerText += 'Depth: ' + depth + ', Mate in: ' + scoreValue + '\n';
        }
      } 
     }
  }); 
*/
  //stockfish.postMessage("uci");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>} />
          <Route path="/register" element={<SignUp></SignUp>} />
          <Route path="/login" element={<Login></Login>} />

          <Route
            path="/games"
            element={
              <ProtectedRoute
                component={
                  <div className="gridContainer">
                    <Sidebar></Sidebar>
                    <Games
                      inlineStyles={{
                        gridColumnStart: "2",
                        marginLeft: "auto",
                        marginRight: "auto",
                        backgroundColor: "var(--bg-color)",
                      }}
                    ></Games>
                  </div>
                }
              />
            }
          />

          <Route path="*" element={<div>not found</div>} />
        </Routes>
      </BrowserRouter>

      {/*  <ChessBoardContextProvider>
        <ChessBoard_Eval></ChessBoard_Eval>
      </ChessBoardContextProvider> */}
      {/* <div id="output"></div>
      <button
        onClick={async () => {
          let games = await fetchChessGamesonMonth("anasmostafa11", 2024, 6);

          let fen = games.games[0].initial_setup;
          console.log(fen);

          stockfish.postMessage("position fen " + fen);
          stockfish.postMessage("go depth 15");
        }}
      >
        click me
      </button>
      <ChessBoard></ChessBoard> */}
    </>
  );
}

export default App;
