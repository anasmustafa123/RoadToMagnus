import express from "express";
const router = express.Router();
import {
  registerUser,
  authUser,
  logoutUser,
} from "../controller/userController.js";

import { protect } from "../middleware/authMiddleware.js";
router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", protect, logoutUser);

/* router.get("/profile", protect, getUserProfile); */

export default router;
