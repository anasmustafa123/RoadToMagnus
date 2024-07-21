import React, { useContext, useEffect, useState } from 'react';
import Games from './pages/Games';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { ReviewGameContextProvider } from './contexts/ReviewGameContext';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import NewReview from './components/NewReview';
import Profile from './pages/Profile';
import { UserContext } from './contexts/UserContext';
import { EngineLine } from './types/Game';
function App() {
  const [engineRes, setEngineRes] = useState<EngineLine[]>([]);
  const { userId, isUser } = useContext(UserContext);

  useEffect(() => {
    if (engineRes) {
      console.log({ engineRes });
    }
  }, [engineRes]);

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
