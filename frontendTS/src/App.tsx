import React, { useContext, useEffect, useState } from 'react';
import { fetchChessGamesonMonth } from './api/chessApiAccess';
import Games from './pages/Games';
import { ChessBoardContextProvider } from './contexts/GameBoardContext';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { ReviewGameContextProvider } from './contexts/ReviewGameContext';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { getFenArr } from './scripts/convert';
import { parsePgn } from './scripts/pgn';
import './App.css';
import ReviewResult from './components/ReviewResult';
import NewReview from './components/NewReview';
import Profile from './pages/Profile';
import { UserContext } from './contexts/UserContext';
import  Stats  from './components/LineChart';

function App() {
  const [finalDepth, setFinalDepth] = useState(18);
  const [stockStates, setStockStates] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [classifications, setClassifications] = useState([]);
  const [fenArr, setFenArr] = useState([]);
  const [diffArr, setDiffArr] = useState([]);
  const [engineRes, setEngineRes] = useState([]);
  const { userId, isUser } = useContext(UserContext);
  /* useEffect(() => {
    if (engineRes) {
      console.log({ engineRes });
    }
  }, [engineRes]); */
  /**
   *
   * @param {String} response
   * @param {String} errormsg
   * @param {boolean} verbose
   * @returns
   */
  /* async function waitFor(
    stockfish,
    response,
    errormsg = 'error',
    verbose = false,
  ) {
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        if (verbose) console.log(e);
        if (e.data.includes(response)) {
          stockfish.removeEventListener('message', listener);
          resolve(true);
        }
      };
      stockfish.addEventListener('message', listener);
      // Add a timeout for error handling (optional)
      setTimeout(() => {
        stockfish.removeEventListener('message', listener);
        //stockfish.terminate();
        reject(new Error(errormsg));
      }, 20000); // Adjust timeout as needed
    });
  } */

  /**
   *
   * @param {String} fen
   * @param {number} targetDepth
   * @returns
   */
  /*  async function evaluatePosition(stockfish, fen, targetDepth, verbose = true) {
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage(`go depth ${targetDepth}`);

    let messages = [];
    let lines = [];
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        console.log('evaluate');
        if (verbose) console.log(e);
        messages.unshift(e.data);
        if (e.data.includes('depth 0')) {
          if (verbose) console.log(`one ${e}`);
        }
        if (e.data.startsWith('bestmove') || e.data.includes('depth 0')) {
          console.log('bestmove');
          stockfish.removeEventListener('message', listener);
          let searchMessages = messages.filter((msg) =>
            msg.startsWith('info depth'),
          );
          for (let searchMessage of searchMessages) {
            // Extract depth, MultiPV line ID and evaluation from search message
            let idString = searchMessage.match(/(?:multipv )(\d+)/)?.[1];
            let depthString = searchMessage.match(/(?:depth )(\d+)/)?.[1];

            let moveUCI = searchMessage.match(/(?: pv )(.+?)(?= |$)/)?.[1];

            let evaluation = {
              type: searchMessage.includes(' cp ') ? 'cp' : 'mate',
              value: parseInt(
                searchMessage.match(/(?:(?:cp )|(?:mate ))([\d-]+)/)?.[1] ||
                  '0',
              ),
            };

            // Invert evaluation if black to play since scores are from black perspective
            // and we want them always from the perspective of white
            if (fen.includes(' b ')) {
              evaluation.value *= -1;
            }

            // If any piece of data from message is missing, discard message
            if (!idString || !depthString || !moveUCI) {
              console.error('missid pram');
              continue;
            }

            let id = parseInt(idString);
            let depth = parseInt(depthString);

            // Discard if target depth not reached or lineID already present
            if (depth != targetDepth || lines.some((line) => line.id == id))
              continue;

            lines.push({
              id,
              depth,
              evaluation,
              moveUCI,
            });
          }
          resolve(lines);
        }
      };
      stockfish.addEventListener('message', listener);
      setTimeout(() => {
        stockfish.removeEventListener('message', listener);
        //stockfish.terminate();
        reject(new Error('takes alot of timme'));
        resolve({ id: 0, depth: 0, evaluation: 0, moveUCI: 0 });
      }, 20000); // Adjust timeout as needed
    });
  } */

  /**
   *  @param {number} maxDepth
   * @param {String} pgn
   * @param {boolean} verbose
   * @returns {Promise<[Lines]>}
   */
  /* async function reviewGame(maxDepth, pgn, verbose = false) {
    const workerUrl = new URL(
      './scripts/stockfish/stockfish-worker.js',
      import.meta.url,
    );
    console.log(workerUrl);
    const stockfish = new Worker(workerUrl, { type: 'classic' });
    // let stockfish = new Worker("./src/scripts/stockfish/stockfish-worker.js");
    return new Promise(async (resolve, reject) => {
      let st = Date.now();
      let gameeval = [];
      const res = parsePgn(pgn);
      console.log(res);
      const moves = res.moves;
      console.log(moves);
      const fens = getFenArr(moves);
      console.log(fens);
      if (verbose) console.log(fens);
      stockfish.postMessage('uci');
      await waitFor(stockfish, 'uciok', 'uci setup error', verbose);
      stockfish.postMessage(`ucinewgame`);
      stockfish.postMessage('isready');
      await waitFor(
        stockfish,
        'readyok',
        'stockfish not ready after timeout',
        verbose,
      );
      if (verbose) console.log('ready');
      for (let fen of fens) {
        console.log(fen);
        let lines = await evaluatePosition(stockfish, fen, maxDepth, verbose);
        setEngineRes((old) => {
          return [...old, lines];
        });
        gameeval.push(lines);
      }
      let end = Date.now();
      let seconds = (end - st) / 1000;
      if (verbose) {
        console.log(seconds > 60);
        console.log(
          `depth: ${maxDepth}, moves: ${moves.length}, is  ${
            seconds > 60
              ? parseInt(seconds / 60) + 'm:' + (parseInt(seconds) % 60) + 's'
              : seconds
          }`,
        );
      }
      stockfish.terminate();
      resolve(gameeval);
    });
  } */
  const ProtectedRoutes = [
    {
      path: '/',
      element: isUser ? (
        <Navigate to={`/login`} replace={true}></Navigate>
      ) : (
        <Navigate to="/games" replace={true}></Navigate>
      ),
    },
    {
      path: '/games',
      element: (
        <Games
          inlineStyles={{
            gridColumnStart: '2',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'var(--bg-color)',
          }}
        ></Games>
      ),
    },
    { path: '/profile/:userId', element: <Profile /> },
  ];

  const Router = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedRoute />,
      children: ProtectedRoutes,
    },
    { path: '/login', element: <Login></Login> },
    { path: '/register', element: <SignUp></SignUp> },
    {
      path: '/review:gameid',
      element: (
        <ReviewGameContextProvider>
          <NewReview></NewReview>
        </ReviewGameContextProvider>
      ),
    },
    { path: '/explore:userid', element: <></> },
    { path: '*', element: <div>u got lost my friend</div> },
  ]);
  return (
    <>
      <RouterProvider router={Router}></RouterProvider>
    </>
  );
}

export default App;
