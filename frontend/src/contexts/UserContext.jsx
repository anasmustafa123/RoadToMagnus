import React, { createContext, useState, useEffect } from "react";
const UserContext = createContext("");

function UserContextProvider({ children }) {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(55);
  const [usernameChessDC, setChessDCUsername] = useState("");
  const [usernameLichess, setUserLicehessname] = useState("");
  const [chessDCAvatarLink, setChessDCAvatarLink] = useState("");
  const [isUser, setIsUser] = useState(0);
  const [uiTheme, setUiTheme] = useState("light");

  useEffect(() => {
    let root = document.getElementById("root");
    root.className = uiTheme ? uiTheme : "light";
  }, [uiTheme]);

  return (
    <UserContext.Provider
      value={{
        chessDCAvatarLink,
        setChessDCAvatarLink,
        setUserLicehessname,
        username,
        setUsername,
        setChessDCUsername,
        isUser,
        setIsUser,
        usernameChessDC,
        usernameLichess,
        uiTheme,
        setUiTheme,
        userId,
        setUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export { UserContext, UserContextProvider };
