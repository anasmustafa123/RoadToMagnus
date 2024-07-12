import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserContextType } from '../types/UserContextType';

const defaultValue: UserContextType = {
  setChessDCAvatarLink: () => { },
  setUserLicehessname: () => { },
  setUsername: () => { },
  setChessDCUsername: () => { },
  setUserId: () => { },
  setIsUser: () => { },
  setUiTheme: function (value: React.SetStateAction<'light' | 'dark'>): void {
    throw new Error('Function not implemented.');
  },
};
const UserContext = createContext<UserContextType>(defaultValue);

const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<number>(55);
  const [usernameChessDC, setChessDCUsername] = useState<string>('');
  const [usernameLichess, setUserLicehessname] = useState<string>('');
  const [chessDCAvatarLink, setChessDCAvatarLink] = useState<string>('');
  const [isUser, setIsUser] = useState<boolean>(false);
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    let root = document.getElementById('root');
    if (root && uiTheme == 'dark') {
      root.className = uiTheme;
    } else if (root) {
      root.className = 'light';
    }
  }, [uiTheme]);

  return (
    <UserContext.Provider
      value={{
        setChessDCAvatarLink,
        setUserLicehessname,
        chessDCAvatarLink,
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
