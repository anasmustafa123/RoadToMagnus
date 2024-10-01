import { useContext, useEffect, useState } from 'react';
import Games from './routes/Games';
import { createBrowserRouter, RouterProvider, defer } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import './App.css';
import Profile from './routes/Profile';
import type { EngineLine } from './types/Game';
import ReviewGame from './routes/ReviewGame';
import Stats from './routes/Stats';
import { UserContext } from './contexts/UserContext';
function App() {
  const { checkNotUser, checkUser } = useContext(UserContext);
  const [engineRes] = useState<EngineLine[]>([]);

  useEffect(() => {
    if (engineRes) {
    }
  }, [engineRes]);
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
        {
          path: '',
          element: (
            <>
              {/* <title>review.com</title> */}
              <Profile />
            </>
          ),
        },
        {
          path: 'profile',
          element: (
            <>
              {/* <title>review.com</title> */}
              <Profile />
            </>
          ),
        },
        {
          path: 'games',
          element: (
            <>
              {/* <title>Games - review.com</title> */}
              <Games
                inlineStyles={{
                  /* gridColumnStart: '2', */
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  backgroundColor: 'var(--bg-color)',
                }}
              />
            </>
          ),
        },
        {
          path: 'stats',
          element: (
            <>
              <title>Stats - review.com</title>
              <Stats />
            </>
          ),
        },
        {
          path: 'review/:gameId',
          element: (
            <>
              <title>Review Game - review.com</title>
              <ReviewGame />
            </>
          ),
        },
        {
          path: 'explorer',
          element: (
            <>
              <title>Explorer - review.com</title>
              <ReviewGame />
            </>
          ),
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
