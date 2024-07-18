import jwt, { Secret } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { IUser } from "../@types";
import { Request } from "express";


const protect = asyncHandler(async (req:Express.Request, res, next) => {
  let token = req.cookies.jwt;
  console.log("the cookies: ");
  console.log(req.cookies);
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as Secret
      ) as jwt.JwtPayload;
      console.log(decoded);
      let user: IUser | null = await User.findOne({ email: decoded.userEmail });
      if (user) {
        req.user = user as IUser; 
        next();   
      } else {
        res.status(401);
        throw new Error("not authorized, user not found");
      }
    } catch (e) {
      res.status(401);
      throw new Error("not authorized, token not valid");
    }
  } else {
    res.status(401);
    throw new Error("not authorized, token not found");
  }
});

export { protect };
