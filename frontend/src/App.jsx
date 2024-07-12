import React, { useContext, useEffect, useState } from "react";
import { fetchChessGamesonMonth } from "./api/chessApiAccess";
import Games from "./pages/Games";
import { ChessBoardContextProvider } from "./contexts/GameBoardContext";
import {
  BrowserRouter,
  Route,
  Routes,
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { getFenArr } from "./scripts/convert";
import { parsePgn } from "./scripts/pgn";
import "./App.css";
import ReviewResult from "./components/ReviewResult";
import NewReview from "./components/NewReview";
import Profile from "./pages/Profile";
import { UserContext } from "./contexts/UserContext";
function App() {
  const { userId, isUser } = useContext(UserContext);
  let pgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2022.06.26"]
[Round "-"]
[White "anasmostafa11"]
[Black "dhirkx"]
[Result "1/2-1/2"]
[CurrentPosition "6k1/6p1/6K1/5r2/8/3b2p1/8/5q2 w - -"]
[Timezone "UTC"]
[ECO "D00"]
[ECOUrl "https://www.chess.com/openings/Queens-Pawn-Opening-Accelerated-London-System-2...e6-3.e3"]
[UTCDate "2022.06.26"]
[UTCTime "12:27:07"]
[WhiteElo "944"]
[BlackElo "906"]
[TimeControl "600"]
[Termination "Game drawn by stalemate"]
[StartTime "12:27:07"]
[EndDate "2022.06.26"]
[EndTime "12:43:46"]
[Link "https://www.chess.com/game/live/49985383341"]

1. d4 {[%clk 0:09:59.9]} 1... d5 {[%clk 0:09:58.9]} 2. Bf4 {[%clk 0:09:59.8]} 2... e6 {[%clk 0:09:57.4]} 3. e3 {[%clk 0:09:59.7]} 3... Nf6 {[%clk 0:09:55.9]} 4. Nf3 {[%clk 0:09:57.8]} 4... Be7 {[%clk 0:09:54.8]} 5. Bd3 {[%clk 0:09:56.2]} 5... O-O {[%clk 0:09:53.4]} 6. Nfd2 {[%clk 0:09:44.2]} 6... Nc6 {[%clk 0:09:50.1]} 7. Qf3 {[%clk 0:09:26.8]} 7... Ne8 {[%clk 0:09:37.9]} 8. Qg3 {[%clk 0:09:22.3]} 8... Bf6 {[%clk 0:09:35.9]} 9. Bh6 {[%clk 0:09:11.9]} 9... Nb4 {[%clk 0:09:32.7]} 10. Na3 {[%clk 0:08:41.3]} 10... Nxd3+ {[%clk 0:09:30.2]} 11. cxd3 {[%clk 0:08:33.5]} 11... Nd6 {[%clk 0:09:27.5]} 12. Nc2 {[%clk 0:07:44.6]} 12... Nf5 {[%clk 0:09:24.1]} 13. Qf3 {[%clk 0:06:54.6]} 13... Nxh6 {[%clk 0:09:16.3]} 14. O-O {[%clk 0:06:51.3]} 14... Nf5 {[%clk 0:09:14.4]} 15. g4 {[%clk 0:06:35.9]} 15... Ne7 {[%clk 0:09:11]} 16. Rae1 {[%clk 0:06:16.9]} 16... Nc6 {[%clk 0:09:06.5]} 17. e4 {[%clk 0:06:06.3]} 17... dxe4 {[%clk 0:09:01.7]} 18. Qxe4 {[%clk 0:05:54.3]} 18... h6 {[%clk 0:08:49.8]} 19. Nb3 {[%clk 0:05:39.8]} 19... a6 {[%clk 0:08:20.9]} 20. Rc1 {[%clk 0:05:26.1]} 20... Bd7 {[%clk 0:08:16]} 21. Rfe1 {[%clk 0:05:22.6]} 21... a5 {[%clk 0:08:05.1]} 22. a4 {[%clk 0:05:07.6]} 22... Nb4 {[%clk 0:07:56.6]} 23. Nxb4 {[%clk 0:05:01.8]} 23... axb4 {[%clk 0:07:55.3]} 24. a5 {[%clk 0:04:51.8]} 24... Ba4 {[%clk 0:07:50.9]} 25. Qxb7 {[%clk 0:04:15.1]} 25... Bxb3 {[%clk 0:07:48]} 26. Rxc7 {[%clk 0:04:13.3]} 26... Rxa5 {[%clk 0:07:34.1]} 27. Rd7 {[%clk 0:03:24.7]} 27... Qc8 {[%clk 0:07:09.4]} 28. Qxc8 {[%clk 0:03:14.4]} 28... Rxc8 {[%clk 0:07:07.7]} 29. Rb7 {[%clk 0:03:07.6]} 29... Bc2 {[%clk 0:06:55.1]} 30. Rc1 {[%clk 0:02:56.6]} 30... Raa8 {[%clk 0:06:43]} 31. Rxb4 {[%clk 0:02:53.5]} 31... Bxd3 {[%clk 0:06:41.4]} 32. Rxc8+ {[%clk 0:02:51.5]} 32... Rxc8 {[%clk 0:06:38.3]} 33. Rb3 {[%clk 0:02:50.5]} 33... Bc2 {[%clk 0:06:34.9]} 34. Re3 {[%clk 0:02:43.3]} 34... Bxd4 {[%clk 0:06:30.9]} 35. Re1 {[%clk 0:02:38.9]} 35... Bf6 {[%clk 0:06:24.5]} 36. Rc1 {[%clk 0:02:36.8]} 36... Bxb2 {[%clk 0:06:15.6]} 37. Re1 {[%clk 0:02:32.3]} 37... Bg6 {[%clk 0:05:51.1]} 38. Re2 {[%clk 0:02:28.4]} 38... Rb8 {[%clk 0:05:41.9]} 39. Kg2 {[%clk 0:02:20.8]} 39... e5 {[%clk 0:05:32.8]} 40. Kg3 {[%clk 0:02:18.4]} 40... Bc1 {[%clk 0:05:26.3]} 41. f3 {[%clk 0:02:14.4]} 41... Rb3 {[%clk 0:05:21.4]} 42. Rxe5 {[%clk 0:02:07.6]} 42... Rb8 {[%clk 0:05:15]} 43. Rc5 {[%clk 0:01:55.9]} 43... Be3 {[%clk 0:05:11]} 44. Re5 {[%clk 0:01:53.2]} 44... Bd4 {[%clk 0:05:08.7]} 45. Rd5 {[%clk 0:01:51.7]} 45... Bc3 {[%clk 0:04:59.7]} 46. Rc5 {[%clk 0:01:49.3]} 46... Bd4 {[%clk 0:04:56.9]} 47. Rd5 {[%clk 0:01:46.2]} 47... Bb2 {[%clk 0:04:52.8]} 48. Rd2 {[%clk 0:01:42.6]} 48... Bc3 {[%clk 0:04:50.7]} 49. Rd7 {[%clk 0:01:33.9]} 49... Be1+ {[%clk 0:04:47.1]} 50. Kg2 {[%clk 0:01:24.3]} 50... Bc3 {[%clk 0:04:34.9]} 51. Rc7 {[%clk 0:01:22.5]} 51... Bf6 {[%clk 0:04:30.7]} 52. Rc6 {[%clk 0:01:19.8]} 52... Ra8 {[%clk 0:04:20.7]} 53. Kg3 {[%clk 0:01:16.4]} 53... Rd8 {[%clk 0:04:16.7]} 54. Rb6 {[%clk 0:01:13.8]} 54... Rc8 {[%clk 0:04:13.3]} 55. Rd6 {[%clk 0:01:11.6]} 55... Be5+ {[%clk 0:04:06.5]} 56. f4 {[%clk 0:01:05.6]} 56... Bxd6 {[%clk 0:04:05.4]} 57. Kh4 {[%clk 0:00:59.3]} 57... Bxf4 {[%clk 0:04:03]} 58. g5 {[%clk 0:00:57.4]} 58... hxg5+ {[%clk 0:04:01.7]} 59. Kg4 {[%clk 0:00:56]} 59... Bxh2 {[%clk 0:03:57.8]} 60. Kh3 {[%clk 0:00:53]} 60... Rf8 {[%clk 0:03:49.3]} 61. Kg4 {[%clk 0:00:52.9]} 61... f6 {[%clk 0:03:48]} 62. Kf3 {[%clk 0:00:51]} 62... f5 {[%clk 0:03:47.2]} 63. Kg2 {[%clk 0:00:49.6]} 63... f4 {[%clk 0:03:46.2]} 64. Kxh2 {[%clk 0:00:48]} 64... f3 {[%clk 0:03:45.5]} 65. Kg1 {[%clk 0:00:46.8]} 65... f2+ {[%clk 0:03:43.5]} 66. Kf1 {[%clk 0:00:46.2]} 66... Bd3+ {[%clk 0:03:41.2]} 67. Kg2 {[%clk 0:00:40.1]} 67... f1=Q+ {[%clk 0:03:39.4]} 68. Kg3 {[%clk 0:00:40]} 68... Rf3+ {[%clk 0:03:36.2]} 69. Kg4 {[%clk 0:00:39.3]} 69... Rf5 {[%clk 0:03:29.4]} 70. Kh5 {[%clk 0:00:37.1]} 70... g4+ {[%clk 0:03:27.2]} 71. Kg6 {[%clk 0:00:33]} 71... g3 {[%clk 0:03:23.5]} 1/2-1/2`;

  const [finalDepth, setFinalDepth] = useState(18);
  const [stockStates, setStockStates] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [movesCount, setMovesCount] = useState(0);
  const [classifications, setClassifications] = useState([]);
  const [fenArr, setFenArr] = useState([]);
  const [diffArr, setDiffArr] = useState([]);
  const [engineRes, setEngineRes] = useState([]);
  useEffect(() => {
    if (engineRes) {
      console.log({ engineRes });
    }
  }, [engineRes]);
  /**
   *
   * @param {String} response
   * @param {String} errormsg
   * @param {boolean} verbose
   * @returns
   */
  async function waitFor(
    stockfish,
    response,
    errormsg = "error",
    verbose = false
  ) {
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        if (verbose) console.log(e);
        if (e.data.includes(response)) {
          stockfish.removeEventListener("message", listener);
          resolve(true);
        }
      };
      stockfish.addEventListener("message", listener);
      // Add a timeout for error handling (optional)
      setTimeout(() => {
        stockfish.removeEventListener("message", listener);
        //stockfish.terminate();
        reject(new Error(errormsg));
      }, 20000); // Adjust timeout as needed
    });
  }

  /**
   *
   * @param {String} fen
   * @param {number} targetDepth
   * @returns
   */
  async function evaluatePosition(stockfish, fen, targetDepth, verbose = true) {
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage(`go depth ${targetDepth}`);

    let messages = [];
    let lines = [];
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        console.log("evaluate");
        if (verbose) console.log(e);
        messages.unshift(e.data);
        if (e.data.includes("depth 0")) {
          if (verbose) console.log(`one ${e}`);
        }
        if (e.data.startsWith("bestmove") || e.data.includes("depth 0")) {
          console.log("bestmove");
          stockfish.removeEventListener("message", listener);
          let searchMessages = messages.filter((msg) =>
            msg.startsWith("info depth")
          );
          for (let searchMessage of searchMessages) {
            // Extract depth, MultiPV line ID and evaluation from search message
            let idString = searchMessage.match(/(?:multipv )(\d+)/)?.[1];
            let depthString = searchMessage.match(/(?:depth )(\d+)/)?.[1];

            let moveUCI = searchMessage.match(/(?: pv )(.+?)(?= |$)/)?.[1];

            let evaluation = {
              type: searchMessage.includes(" cp ") ? "cp" : "mate",
              value: parseInt(
                searchMessage.match(/(?:(?:cp )|(?:mate ))([\d-]+)/)?.[1] || "0"
              ),
            };

            // Invert evaluation if black to play since scores are from black perspective
            // and we want them always from the perspective of white
            if (fen.includes(" b ")) {
              evaluation.value *= -1;
            }

            // If any piece of data from message is missing, discard message
            if (!idString || !depthString || !moveUCI) {
              console.error("missid pram");
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
      stockfish.addEventListener("message", listener);
      setTimeout(() => {
        stockfish.removeEventListener("message", listener);
        //stockfish.terminate();
        reject(new Error("takes alot of timme"));
        resolve({ id: 0, depth: 0, evaluation: 0, moveUCI: 0 });
      }, 20000); // Adjust timeout as needed
    });
  }

  /**
   *  @param {number} maxDepth
   * @param {String} pgn
   * @param {boolean} verbose
   * @returns {Promise<[Lines]>}
   */
  async function reviewGame(maxDepth, pgn, verbose = false) {
    const workerUrl = new URL(
      "./scripts/stockfish/stockfish-worker.js",
      import.meta.url
    );
    console.log(workerUrl);
    const stockfish = new Worker(workerUrl, { type: "classic" });
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
      stockfish.postMessage("uci");
      await waitFor(stockfish, "uciok", "uci setup error", verbose);
      stockfish.postMessage(`ucinewgame`);
      stockfish.postMessage("isready");
      await waitFor(
        stockfish,
        "readyok",
        "stockfish not ready after timeout",
        verbose
      );
      if (verbose) console.log("ready");
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
              ? parseInt(seconds / 60) + "m:" + (parseInt(seconds) % 60) + "s"
              : seconds
          }`
        );
      }
      stockfish.terminate();
      resolve(gameeval);
    });
  }

  const ProtectedRoutes = [
    {
      path: "/",
      element: isUser ? (
        <Navigate to={`/profile/:${userId}`} replace={true}></Navigate>
      ) : (
        <Navigate to="/login" replace={true}></Navigate>
      ),
    },
    {
      path: "/games",
      element: (
        <Games
          inlineStyles={{
            gridColumnStart: "2",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "var(--bg-color)",
          }}
        ></Games>
      ),
    },
    { path: "/profile/:userId", element: <Profile /> },
  ];

  const Router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: ProtectedRoutes,
    },
    { path: "/login", element: <Login></Login> },
    { path: "/register", element: <SignUp></SignUp> },

    {
      path: "/profile:userid",
      element: (
        <ProtectedRoute component={<Profile></Profile>}></ProtectedRoute>
      ),
    },
    { path: "/review:gameid", element: <reviewGame></reviewGame> },
    { path: "/explore:userid", element: <></> },
    { path: "*", element: <div>u got lost my friend</div> },
  ]);
  /*  */
  return (
    <>
      <RouterProvider router={Router}></RouterProvider>
      {/*  <ChessBoardContextProvider>
        <ChessBoard_Eval></ChessBoard_Eval>
      </ChessBoardContextProvider> */}
      {/* <div id="output"></div>
      <button
        onClick={async () => {
          await reviewGame(18, pgn, false);
        }}
      >
        click me
      </button> */}
    </>
  );
}

export default App;
