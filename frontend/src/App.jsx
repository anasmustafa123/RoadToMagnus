import React, { useState } from "react";
function App() {
  const [finalDepth, setFinalDepth] = useState(15);
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
    console.log({ data: e.data });
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
      if(newdata.currentDepth == finalDepth){
        console.log()
      }
      setStockStates(newdata);
      console.log(newdata);

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
      } */
    }
  });

  stockfish.postMessage("uci");
  return (
    <>
      <div id="output"></div>
      <button
        onClick={() => {
          let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
          stockfish.postMessage("position fen " + fen);
          stockfish.postMessage("go depth 15");
        }}
      >
        click me
      </button>
    </>
  );
}

export default App;