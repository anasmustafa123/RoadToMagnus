import { MenuBarTheme } from "./Ui";

export interface UserContextType {
  setChessDCAvatarLink: React.Dispatch<React.SetStateAction<string>>;
  setUserLicehessname: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setChessDCUsername: React.Dispatch<React.SetStateAction<string>>;
  setIsUser: React.Dispatch<React.SetStateAction<boolean>>;
  setUiTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
  chessDCAvatarLink: string;
  username: string;
  isUser: boolean;
  usernameChessDC: string;
  usernameLichess: string;
  uiTheme: 'light' | 'dark';
  userId: number;
  chessboardwidth: number;
  setChessboardWidth: React.Dispatch<React.SetStateAction<number>>;
  showRigthSidebar: boolean;
  setShowRightSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuBarTheme: MenuBarTheme;
  setMenuBarTheme: React.Dispatch<React.SetStateAction<MenuBarTheme>>;
}
