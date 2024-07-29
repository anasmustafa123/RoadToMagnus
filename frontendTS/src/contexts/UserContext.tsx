import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement,
} from 'react';
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
  userId: 0,
  chessboardwidth: 750,
  setChessboardWidth: () => {},
  showRigthSidebar: true,
  setShowRightSidebar: () => {},
  menuBarTheme: 'v',
  setMenuBarTheme: () => {},
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
  const [chessboardwidth, setChessboardWidth] = useState<number>(750);
  const [menuBarTheme, setMenuBarTheme] = useState<MenuBarTheme>('v');
  const [showRigthSidebar, setShowRightSidebar] = useState<boolean>(true);
  useEffect(() => {
    const handleResize = () => {
      console.log(menuBarTheme);
      if (window.innerWidth > 1350) setChessboardWidth(750);
      else if (window.innerWidth <= 1350 && window.innerWidth > 1100) {
        if (menuBarTheme == 'v') setChessboardWidth(650);
        setShowRightSidebar(false);
      } else if (window.innerWidth <= 1100 && window.innerWidth > 900)
        if (menuBarTheme == 'v') {
          setMenuBarTheme('mv')
          setChessboardWidth(550);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserContextProvider };
