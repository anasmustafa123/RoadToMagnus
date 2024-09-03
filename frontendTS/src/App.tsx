import { useContext, useEffect, useState } from 'react';
import Games from './routes/Games';
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  defer,
} from 'react-router-dom';
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
import { checkIfBook } from './api/lichessApiAccess';
import { getMissingData } from './scripts/LoadGames';
import { GameContext } from './contexts/GamesContext';
function App() {
  const {
    isUser,
    setIsUser,
    setChessDCUsername,
    setUserLicehessname,
    setUserId,
  } = useContext(UserContext);
  const { lichessGames, setLichessGames, chessdcomGames, setChessdcomGames } =
    useContext(GameContext);
  const [engineRes] = useState<EngineLine[]>([]);
  useEffect(() => {
    if (engineRes) {
    }
  }, [engineRes]);

  /*   useEffect(() => {
    async function f() {
      let users = await db.users.toArray();
      let user = users[0];
      if (user) {
        //setIsUser(true);
        //setUserId(user.key);
      }
    }
    f();
  }, []); */

  const checkUser = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (isUser) resolve(true);
      else {
        db.users
          .toArray()
          .then((users) => {
            let user = users[0];
            if (user) {
              setIsUser(true);
              setUserId(user.key);
              resolve(true);
            } else {
              reject(false);
            }
          })
          .catch(() => {
            reject(false);
          });
      }
    });
  };
  const checkNotUser = () => {
    return new Promise(async (resolve, reject) => {
      const isuser = await checkUser();
      if (!isuser) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  };
  const lichessGamesLoading = () => {
    return new Promise((resolve, reject) => {
      getMissingData({
        username: 'gg',
        vendor: 'lichess',
        afterGameCallback: (games) => {
          console.log(games);
          setLichessGames((old) => [...old, ...games]);
        },
        afterGamesCallback: () => {},
      }).then((res) => {
        console.log(res);
        if (res.ok) {
          console.log('finished');
          resolve(true);
          //setChessdcomGames(res.games);
        } else reject(false);
      });
    });
  };
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
      loader: () => {
        console.log('loader');
        return defer({
          loader_data: checkNotUser(),
        });
      },
    },
    {
      path: '/register',
      element: <SignUp />,
      loader: () => {
        return defer({ loader_data: checkNotUser() });
      },
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        { path: 'profile', element: <Profile /> },
        {
          path: 'games',
          element: (
            <Games
              inlineStyles={{
                gridColumnStart: '2',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: 'var(--bg-color)',
              }}
            />
          ),
        },
        {
          path: 'stats',
          element: <Stats />,
        },
        {
          path: 'review/:gameId',
          element: <ReviewGame />,
        },
        {
          path: 'explorer',
          element: 'explore',
        },
      ],
      loader: () => {
        return defer({ loader_data: checkUser() });
      },
    },
    {
      path: '*',
      element: <div>u lost ur way my friend</div>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
