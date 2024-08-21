import {
  getGameById,
  getGamesOfPlayer,
  addGame,
  addGames,
  updateGame,
} from "../controller/gamesController.js";

import express from "express";
const router = express.Router();

router.post("/addgame", addGame);
router.post("/addgames", addGames);
router.post("/gamebyId", getGameById);
router.post("/getgames", getGamesOfPlayer);
router.post("/updateGame", updateGame);

export default router;
