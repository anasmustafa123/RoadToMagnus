import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { createUser, getUser, matchPassword } from "../models/userModel.js";
// @desc  Authorize user/set token
// @route POST /api/users/auth
// @access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser({ req, email });
  if (user && (await matchPassword(user["password"], password))) {
    console.log("password matched");
    generateToken(res, user["email"]);
    res.status(201).json({
      ok: 1,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } else {
    res.status(401);
    throw new Error(`invalid email or password`);
  }
});

// @desc  Register user new user
// @route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  try {
    const user = await getUser({ req, email });
    if (user) throw new Error("user already exists with that email");
    await createUser({
      req,
      name,
      email,
      password,
    });
  } catch (e) {
    res.status(400);
    console.log(e)
    throw new Error("user already exists with that email");
  }
  const user = await getUser({ req, email });
  if (user) {
    console.log("success");
    generateToken(res, user.email);
    console.log({
      ok: 1,
      data: { name: user.name, email: user.email },
    });
    res.status(201).json({
      ok: 1,
      data: { name: user.name, email: user.email },
    });
  } else {
    res.status(400);
    throw new Error("data format wrong");
  }
});

// @desc  Logout user
// @route POST /api/users/logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
  console.log("logging out");
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ ok: 1, message: "User Logout" });
});

export { authUser, registerUser, logoutUser };
