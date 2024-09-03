import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { UserContextType } from '../types/UserContextType';
import { MenuBarTheme } from '../types/Ui';

const defaultValue: UserContextType = {
  setChessDCAvatarLink: () => {},
  setUserLicehessname: () => {},
  setUsername: () => {},
  setChessDCUsername: () => {},
  setUserId: () => {},
  setIsUser: () => {},
  setUiTheme: () => {},
  chessDCAvatarLink: '',
  username: '',
  isUser: false,
  usernameChessDC: '',
  usernameLichess: '',
  uiTheme: 'light',
  userId: "",
  chessboardwidth: 750,
  setChessboardWidth: () => {},
  showRigthSidebar: true,
  setShowRightSidebar: () => {},
  menuBarTheme: 'v',
  setMenuBarTheme: () => {},
  largeScreen: true,
  setLargeScreenWidth: () => {},
};
const UserContext = createContext<UserContextType>(defaultValue);

const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>("");
  const [usernameChessDC, setChessDCUsername] = useState<string>('');
  const [usernameLichess, setUserLicehessname] = useState<string>('');
  const [chessDCAvatarLink, setChessDCAvatarLink] = useState<string>('');
  const [isUser, setIsUser] = useState<boolean>(false);
  const [uiTheme, setUiTheme] = useState<'light' | 'dark'>('light');
  const [chessboardwidth, setChessboardWidth] = useState<number>(750);
  const [menuBarTheme, setMenuBarTheme] = useState<MenuBarTheme>('v');
  const [showRigthSidebar, setShowRightSidebar] = useState<boolean>(true);
  const [largeScreen, setLargeScreenWidth] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      //console.log(menuBarTheme);
      if (window.innerWidth > 1350) {
        setChessboardWidth(750);
        if (!largeScreen) setLargeScreenWidth(true);
        //if (menuBarTheme != 'v') setMenuBarTheme('v');
      } else if (window.innerWidth <= 1350 && window.innerWidth > 1100) {
        console.log('vertical');
        //if (menuBarTheme == 'v') setChessboardWidth(650);
        // if (menuBarTheme != 'v') setMenuBarTheme('v');
        if (!largeScreen) setLargeScreenWidth(true);
      } else if (window.innerWidth <= 900) {
        console.log('horizontal');

        if (largeScreen) setLargeScreenWidth(false);
        //  if (menuBarTheme != 'h') setMenuBarTheme('h');
        setChessboardWidth(window.innerWidth - 10);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        chessboardwidth,
        setChessboardWidth,
        showRigthSidebar,
        setShowRightSidebar,
        menuBarTheme,
        setMenuBarTheme,
        largeScreen,
        setLargeScreenWidth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserContextProvider };
