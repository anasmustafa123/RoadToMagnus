import { NextFunction, Request, Response } from "express";
import { ErrorRes } from "../@types";

const notFound = (req: Express.Request, res: Response, next: NextFunction) => {
  const error = new Error(`not found - ${req.originalUrl as string} -`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: ErrorRes,
  req: Express.Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  //check for specific error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }
  res.status(statusCode).json({
    ok: 0,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
export { notFound, errorHandler };
