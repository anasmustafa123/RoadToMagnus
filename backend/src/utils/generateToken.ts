import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

const generateToken = (res: Response, userEmail: string) => {
  let sec = process.env.JWT_SECRET as Secret;
  const token = jwt.sign({ userEmail }, sec, {
    expiresIn: "10d",
  });
  console.log(`token: ${token}`);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
export default generateToken;
