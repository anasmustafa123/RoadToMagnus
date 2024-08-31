import { useContext, useEffect, useState } from 'react';
import Games from './routes/Games';
import { Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css';
import Profile from './routes/Profile';
import type { EngineLine } from './types/Game';
import ReviewGame from './routes/ReviewGame';
import Stats from './routes/Stats';
import { db } from './api/Indexed';
import { UserContext } from './contexts/UserContext';
function App() {
  const { setIsUser, setChessDCUsername, setUserLicehessname, setUserId } =
    useContext(UserContext);
  const [engineRes] = useState<EngineLine[]>([]);
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
    /* getMissingData({
      storekey: String(userId),
      vendor: 'chess.com',
      username: 'anasmostafa11',
      afterGameCallback: () => {},
      afterGamesCallback: () => {},
    }); */
    async function f() {
      let users = await db.users.toArray();
      let user = users[0];
      if (user) {
        setIsUser(true);
        //setUserId(user.key);
      }
    }
    f();
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
