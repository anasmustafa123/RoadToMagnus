export interface User {
  name?: string;
  id?: string;
  email: string;
  password: string;
  lichess?: string;
  'chess.com'?: string;
}
export interface NewUser extends User {
  name: string;
  confirmPassword: string;
  IsAccepted: boolean;
}