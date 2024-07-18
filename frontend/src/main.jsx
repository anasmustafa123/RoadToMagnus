import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserContextProvider } from "./contexts/UserContext.jsx";
import { GameContextProvider } from "./contexts/GamesContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <GameContextProvider>
        <App />
      </GameContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
