import jwt from "jsonwebtoken";

const generateToken = (res, userEmail, type) => {
  const token = jwt.sign({ userEmail, type }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
export default generateToken;
