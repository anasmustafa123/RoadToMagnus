import { useContext, useEffect, useState } from 'react';
import Games from './routes/Games';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css';
import Profile from './routes/Profile';
import type { EngineLine } from './types/Game';
import { UserContext } from './contexts/UserContext';
import ReviewGame from './routes/ReviewGame';
import { init_indexedDb, isUser as getUserfromDb } from './api/indexedDb';
import { GameContext } from './contexts/GamesContext';
import Stats from './routes/Stats';
import {
  fetchChessGamesonMonth,
  getAllPlayerGames,
} from './api/chessApiAccess';
import { getMissingData } from './scripts/LoadGames';
function App() {
  const [engineRes] = useState<EngineLine[]>([]);
  const { setIsUser, userId, setUserId, usernameLichess } =
    useContext(UserContext);

  const { setLichessGames } = useContext(GameContext);
  useEffect(() => {
    if (engineRes) {
    }
  }, [engineRes]);

  useEffect(() => {
    /*  getAllPlayerGames({
      username: 'anasmostafa11',
      syear: 2021,
      eyear: 2022,
      smonth: 11,
      emonth: 12,
      afterEachMonthCallback: (games) => {
        console.debug("month")
        console.debug(games)
      },
    }).then((games) => {
      console.dir(games);
    }); */
    getMissingData({
      storekey: String(userId),
      vendor: 'chess.com',
      username: 'anasmostafa11',
      afterGameCallback: () => {},
      afterGamesCallback: () => {},
    });

    init_indexedDb({ storeName: 'users', dbVersion: 2 }).then((res) => {
      if (res.ok) {
        getUserfromDb()
          .then((value: any) => {
            if (value.data) {
              setUserId(value.data.id);
              setIsUser(true);
            }
            //loading game from indexedDb
            `getAllGames().then((res) => {
              if (res.ok)
                setLichessGames(
                  res.value.map((simplegame) => {
                    console.log(simplegame.pgn.pgn);
                    const parsedGame = parsePgn(simplegame.pgn.pgn);
                    return {
                      ...parsedGame,
                      site: 'lichess',
                      playerColor:
                        usernameLichess == parsedGame.wuser.username ? 1 : -1,
                    };
                  }),
                );
            });`;
          })
          .catch((e) => {
            console.error(`catched : ${e}`);
          });
      }
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
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
          <Route path="stats" element={<Stats />} />
          <Route path="review/:gameId" element={<ReviewGame />} />
          <Route path="explorer">explore</Route>
        </Route>
        <Route path="*" element={<div>u lost ur way my friend</div>} />
      </Routes>
    </>
  );
}

export default App;
