import {
  RegisterUser as Ruser,
  LoginUser as Luser,
} from "../../../shared/types/dist";
import { Request as ExpressRequest, Express } from "express";
export interface RegisterUser extends Ruser {}
export interface LoginUser extends Luser {}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  chesscom: VendorContent;
  lichess: VendorContent;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type VendorContent = {
  username: string;
  startDate?: number;
  endDate?: number;
};

export interface IGame {
  pgn: string;
  gameId: number;
  playerId: string;
}

export interface ErrorRes {
  message: string;
  name: string;
  kind: string;
  stack: any;
}
export type classification = {
  book: number;
  brilliant: number;
  great: number;
  best: number;
  excellent: number;
  good: number;
  forced: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
  missed: number;
  botezgambit: number;
};
