const notFound = (req, res, next) => {
  const error = new Error(`not found - ${req.originalUrl} -`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.log(err);
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  //check for specific error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
export { notFound, errorHandler };
