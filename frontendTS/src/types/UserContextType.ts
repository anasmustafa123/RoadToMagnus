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
}
