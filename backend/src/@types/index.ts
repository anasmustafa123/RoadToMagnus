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
  chessDCusername?: string;
  lichessusername?: string;
  chessDotComLastUpdated?: string;
  lichessComLastUpdated?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface ErrorRes {
  message: string;
  name: string;
  kind: string;
  stack: any;
}
