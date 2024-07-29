import { useContext, useEffect, useState } from 'react';
import Games from './routes/Games';
import {
  RouterProvider,
  createBrowserRouter,
  defer,
  Routes,
  Route,
} from 'react-router-dom';
import { ChessBoardContextProvider } from './contexts/GameBoardContext';
import { ReviewGameContext } from './contexts/ReviewGameContext';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css';
import Profile from './routes/Profile';
import type { EngineLine, Game, GamesCount, PlayerColor } from './types/Game';
import RouteContainer from './routes/RouteContainer';
import { getAvalibleArchieves, getGamesOfMonth } from './api/chessApiAccess';
import { UserContext } from './contexts/UserContext';
import ReviewGame from './routes/ReviewGame';
import {
  addData,
  deleteData,
  getAllGames,
  init_indexedDb,
} from './api/indexedDb';
import { GameContext } from './contexts/GamesContext';
import { parsePgn } from './scripts/pgn';
import ChessBoard_Eval from './components/ChessBoard_Eval';
function App() {
  const [engineRes, setEngineRes] = useState<EngineLine[]>([]);
  const { usernameChessDC, isUser, setIsUser } = useContext(UserContext);
  const { setAllGames } = useContext(GameContext);
  useEffect(() => {
    /* if (engineRes) {
      console.log({ engineRes });
    } */
  }, [engineRes]);

  useEffect(() => {
    setIsUser(true);
    /* init_indexedDb().then(async () => {
      console.debug('indexedDb initialized');
      let values = await getAllGames();
      let games: Game[] = [];
      console.log(values);
      let gamesCount: GamesCount = {
        rapid: 0,
        blitz: 0,
        bullet: 0,
        daily: 0,
      };
      values.value.forEach((game) => {
        let gameparsed = parsePgn(game.pgn);
        gamesCount[gameparsed.gameType] = gamesCount[gameparsed.gameType] + 1;
        let movesCount = gameparsed.moves.length;
        let playerColor: PlayerColor =
          usernameChessDC == gameparsed.wuser.username ? 1 : -1;
        let res: Game = {
          ...gameparsed,
          playerColor,
          gameId: game.gameId,
          site: 'chess.com',
          movesCount,
          pgn: game.pgn,
          isReviewed: gameparsed.classifi ? true : false,
        };
        games.push(res);
      });
      setAllGames(games);
    }); */
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          {/* <Route
            path="moves"
            element={
              <ChessBoardContextProvider>
                <ChessBoard_Eval
                  inlineStyles={{
                    gridColumn: '2 / 3',
                    margin: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                ></ChessBoard_Eval>
              </ChessBoardContextProvider>
            }
          ></Route> */}
          <Route
            path="games"
            element={
              <Games
                inlineStyles={{
                  gridColumnStart: '2',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  backgroundColor: 'var(--bg-color)',
                }}
              />
            }
          />
          <Route path="review/:gameId" element={<ReviewGame />} />
        </Route>
        <Route path="*" element={<div>u lost ur way my friend</div>} />
      </Routes>
    </>
  );
}

export default App;
