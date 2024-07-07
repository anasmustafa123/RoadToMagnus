import React, { createContext, useState } from "react";

const UserContext = createContext("");

// dates of last game loaded to the db for chess.com and lichess
// index.db
const [chessDClastDate ,setChessDClastDate] = useState("");
const [lichesslastDate ,setLichesslastDate] = useState("");

export default function UserContextProvider({ children }) {
  return <UserContext.Provider>{children}</UserContext.Provider>;
}
