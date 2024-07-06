import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user.email);
    res.status(201).json({
      ok: 1,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, lichessUsername, chessUsername } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    chessDCusername: chessUsername,
    lichessusername: lichessUsername,
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
