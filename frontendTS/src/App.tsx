import { useContext, useEffect, useState } from 'react';
import Games from './routes/Games';
import { RouterProvider, createBrowserRouter, defer } from 'react-router-dom';
import { ReviewGameContextProvider } from './contexts/ReviewGameContext';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css';
import Profile from './routes/Profile';
import type { EngineLine, Game } from './types/Game';
import RouteContainer from './routes/RouteContainer';
import ReviewGame from './routes/ReviewGame';
import { getAvalibleArchieves, getGamesOfMonth } from './api/chessApiAccess';
import { UserContext } from './contexts/UserContext';
function App() {
  const [engineRes, setEngineRes] = useState<EngineLine[]>([]);
  const { usernameChessDC } = useContext(UserContext);
  useEffect(() => {
    if (engineRes) {
      console.log({ engineRes });
    }
  }, [engineRes]);

  const Routes = [
    {
      path: '/profile/:userId',
      element: <ProtectedRoute Component={<Profile />} />,
    },
    { path: '/explore:userid', element: <></> },
    {
      path: '/games',
      element: (
        <ProtectedRoute
          Component={
            <Games
              inlineStyles={{
                gridColumnStart: '2',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: 'var(--bg-color)',
              }}
            ></Games>
          }
        />
      ),
      loader: async () => {
        let archieves = await getAvalibleArchieves('anasmostafa11');
        let lastMonthGames = archieves.archives.length
          ? archieves.archives[archieves.archives.length - 1]
          : null;
        console.log(lastMonthGames);

        if (lastMonthGames == null) return null;
        let res = lastMonthGames.split('/');
        console.log(res.length);
        if (lastMonthGames && res.length > 2)
          console.log(
            usernameChessDC +
              parseInt(res[res.length - 2]) +
              parseInt(res[res.length - 1]),
          );
        console.log(getGamesOfMonth instanceof Promise);

        return lastMonthGames && res.length > 2
          ? defer({
              gameData: getGamesOfMonth(
                usernameChessDC,
                parseInt(res[res.length - 2]),
                5,
              ),
            })
          : null;
      },
    },
    {
      path: '/review/:gameid',
      element: <ProtectedRoute Component={<ReviewGame />} />,
    },
  ];
  const Router = createBrowserRouter([
    { path: '/', element: <ProtectedRoute Component={<Profile />} /> },
    { path: '/login', element: <Login></Login> },
    { path: '/register', element: <SignUp></SignUp> },
    {
      path: '/',
      element: <RouteContainer />,
      children: Routes,
    },
    { path: '*', element: <div>u got lost my friend</div> },
  ]);
  return (
    <>
      <RouterProvider router={Router}></RouterProvider>
    </>
  );
}

export default App;
