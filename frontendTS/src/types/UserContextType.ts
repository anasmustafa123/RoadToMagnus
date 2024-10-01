import { IDB_User } from '../api/Indexed';
import { MenuBarTheme } from './Ui';

export interface UserContextType {
  setChessDCAvatarLink: React.Dispatch<React.SetStateAction<string>>;
  setUiTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  chessDCAvatarLink: string;
  uiTheme: 'light' | 'dark';
  chessboardwidth: number;
  setChessboardWidth: React.Dispatch<React.SetStateAction<number>>;
  showRigthSidebar: boolean;
  setShowRightSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuBarTheme: MenuBarTheme;
  setMenuBarTheme: React.Dispatch<React.SetStateAction<MenuBarTheme>>;
  largeScreen: boolean;
  setLargeScreenWidth: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<IDB_User | undefined>>;
  user: IDB_User | undefined;
  checkUser: () => Promise<boolean>;
  checkNotUser: () => Promise<boolean>;
  layout: string[];
  setLayout: React.Dispatch<React.SetStateAction<string[]>>;
  update_layout: (layout: string[]) => void;
}
