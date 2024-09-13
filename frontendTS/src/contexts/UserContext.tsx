import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { UserContextType } from '../types/UserContextType';
import { MenuBarTheme } from '../types/Ui';
import { db, IDB_User } from '../api/Indexed';
import { GameContext } from './GamesContext';
import { Unique_Game_Array } from '../types/Game';
import { convertPgnToGame, parsePgn } from '../scripts/pgn';
const defaultValue: UserContextType = {
  setChessDCAvatarLink: () => {},
  setUiTheme: () => {},
  chessDCAvatarLink: '',
  uiTheme: 'light',
  chessboardwidth: 750,
  setChessboardWidth: () => {},
  showRigthSidebar: true,
  setShowRightSidebar: () => {},
  menuBarTheme: 'v',
  setMenuBarTheme: () => {},
  largeScreen: true,
  setLargeScreenWidth: () => {},
  user: undefined,
  setUser: () => {},
  checkUser: () => Promise.resolve(false),
  checkNotUser: () => Promise.resolve(false),
};
false;
const UserContext = createContext<UserContextType>(defaultValue);

const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setChessdcomGames, setLichessGames } = useContext(GameContext);
  const [user, setUser] = useState<IDB_User | undefined>();
  const [chessDCAvatarLink, setChessDCAvatarLink] = useState<string>('');
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

  const checkUser = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (user) {
        console.log({ user });
        resolve(true);
        return;
      }
      db.users
        .toArray()
        .then((users) => {
          console.log(users);
          if (users.length) {
            let dbuser = users[0];
            // load IDB Games
            db.games.toArray().then((games) => {
              console.log(`IDB games: ${games}`);
              games.forEach((game) => {
                if (game.vendor == 'chess.com') {
                  setChessdcomGames((old) => {
                    const newGame = new Unique_Game_Array(...old);
                    newGame.add_game(
                      convertPgnToGame(
                        game.pgn,
                        dbuser.username.split('-')[0].trim(),
                        'chess.com',
                      ),
                    );
                    return newGame;
                  });
                } else if (game.vendor == 'lichess') {
                  setLichessGames((old) => {
                    const newGame = new Unique_Game_Array(...old);
                    newGame.add_game(
                      convertPgnToGame(
                        game.pgn,
                        dbuser.username.split('-')[1].trim(),
                        'lichess',
                      ),
                    );
                    return newGame;
                  });
                }
              });
            });
            setUser(dbuser);
            resolve(true);
          } else {
            // %to_do%
            // @check_mongodb for user data type IDB_User
            // @set_IDB with the data
            // if yes
            // @set_setUser with  the data
            // resolve true
            // if no
            // reject
            reject(false);
          }
        })
        .catch(() => {
          reject(false);
        });
    });
  };
  const checkNotUser = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        const isuser = await checkUser();
        console.log({ isuser });
        if (!isuser) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch (e) {
       resolve(true);
      }
    });
    };

  return (
    <UserContext.Provider
      value={{
        setChessDCAvatarLink,
        chessDCAvatarLink,
        uiTheme,
        setUiTheme,
        chessboardwidth,
        setChessboardWidth,
        showRigthSidebar,
        setShowRightSidebar,
        menuBarTheme,
        setMenuBarTheme,
        largeScreen,
        setLargeScreenWidth,
        user,
        setUser,
        checkUser,
        checkNotUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserContextProvider };
