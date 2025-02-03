export interface LoginUser {
    email: string;
    password: string;
}
export interface RegisterUser extends LoginUser {
    lichess?: string;
    "chess.com"?: string;
}
export declare const classificationnames: string[];
export declare const gametypes: string[];
export declare const gameresult: string[];
export declare const gameresulttype: string[];
export type GetGameById = (gameId: number | `${number}`) => any;
export type Vendor = "chess.com" | "lichess";
