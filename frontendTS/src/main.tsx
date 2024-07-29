import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { GameContextProvider } from './contexts/GamesContext.tsx';
import { UserContextProvider } from './contexts/UserContext.tsx';
import { ReviewGameContextProvider } from './contexts/ReviewGameContext.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <GameContextProvider>
      <UserContextProvider>
        <React.StrictMode>
          <ReviewGameContextProvider>
            <App />
          </ReviewGameContextProvider>
        </React.StrictMode>
      </UserContextProvider>
    </GameContextProvider>
  </BrowserRouter>,
);
