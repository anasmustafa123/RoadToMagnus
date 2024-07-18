import { LoginUser, RegisterUser } from '../../../shared/types';

export type OldUser = LoginUser;

export interface NewUser extends RegisterUser{};
export interface UserInfo {
  username: string;
  rating: number;
  avatar?: string;
  flagAvatar?: string;
  lichess?: string;
  'chess.com'?: string;
}
