import React, { createContext, useState, useEffect } from "react";
const UserContext = createContext("");

const UserContextProvider = ({
  children,
}) => {
  const [username, setUsername] = useState<String>("");
  const [userId, setUserId] = useState<number>(55);
  const [usernameChessDC, setChessDCUsername] = useState<String>("");
  const [usernameLichess, setUserLicehessname] = useState<String>("");
  const [chessDCAvatarLink, setChessDCAvatarLink] = useState<String>("");
  const [isUser, setIsUser] = useState<boolean>(false);
  const [uiTheme, setUiTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    let root = document.getElementById("root");
    if (root) root.className = uiTheme ? uiTheme : "light";
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
};
export { UserContext, UserContextProvider };
