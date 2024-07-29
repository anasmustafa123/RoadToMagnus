var wasmSupported =
  typeof WebAssembly === 'object' &&
  WebAssembly.validate(
    Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00),
  );

const STOCKFISH_PATH = wasmSupported ? './stockfish.wasm.js' : './stockfish.js';
try {
  self.importScripts(STOCKFISH_PATH);
  const stockfish = STOCKFISH();
  // Initialize Stockfish
  // Respond to messages from the main thread
  self.onmessage = function (event) {
    const { command } = event.data;
    stockfish.postMessage(command);
  };

  // Listen for messages from Stockfish
  stockfish.onmessage = function (event) {
    self.postMessage(event);
  };

  // Terminate Stockfish when this worker is terminated
  self.onclose = function () {
    stockfish.terminate();
  };
} catch (e) {
  console.error(`Error importing stockfish: ${e}`);
}
