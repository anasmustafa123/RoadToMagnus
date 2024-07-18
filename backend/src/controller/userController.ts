import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import { RegisterUser } from "../@types";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user.email);
    res.status(201).json({
      ok: 1,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        "chess.com": user.chessDCusername,
        lichess: user.lichessusername,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    lichess,
    "chess.com": chessdotcom,
  }: RegisterUser = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  if (!lichess && !chessdotcom) {
    res.status(410);
    throw new Error("Must Join By chess.com or lichess");
  }
  const user = await User.create({
    name: (lichess ? lichess : "") + "-" + (chessdotcom ? chessdotcom : ""),
    email,
    password,
    "chess.com": chessdotcom,
    lichess: lichess,
  });

  if (user) {
    generateToken(res, user.email);
    res.status(201).json({
      ok: 1,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        chessDCusername: user.chessDCusername,
        lichessusername: user.lichessusername,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ ok: 1, message: "User logged out" });
});

export { authUser, registerUser, logoutUser };
