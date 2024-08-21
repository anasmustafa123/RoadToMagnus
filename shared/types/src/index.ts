export interface LoginUser {
  email: string;
  password: string;
}
export interface RegisterUser extends LoginUser {
  lichess?: string;
  "chess.com"?: string;
}
export const classificationnames = [
  "book",
  "brilliant",
  "great",
  "best",
  "excellent",
  "good",
  "forced",
  "inaccuracy",
  "mistake",
  "blunder",
  "missed",
  "botezgambit",
];

export const gametypes = ["rapid", "blitz", "bullet", "daily"];


export const gameresult = [
  "time",
  "check",
  "res",
  "agree",
  "stall",
  "rep",
  "ins",
  "timeinsuf",
  "fifty",
];
export const gameresulttype = ["win", "lost", "draw"];

export type GetGameById = (gameId: number | `${number}`) => any;

/* export type ClassificationCount = {
  [key in ClassificationNames]: number;
}; */

/* export type GameTypesCount = {
  [key in GameTypes]: number;
};

export type GameResultCount = {
  [key in GameResult]: number;
};

export type GameResultCountCont = {
  [key in (typeof gameresulttype)[number]]: GameResultCount;
}; */

/* export type VendorStats = {
  classification: ClassificationCount;
  gametype: GameTypesCount;
  gameResult: GameResultCountCont;
}; */

export type Vendor = "chess.com" | "lichess";
