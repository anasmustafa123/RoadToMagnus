import asyncHandler from "express-async-handler";
import Games from "../models/gamesModel.js";
import { IGame } from "../@types";

const getGamesOfPlayer = asyncHandler(async (req, res) => {
  const { playerId } = req.body;
  try {
    const games: IGame[] = await Games.find({ playerId });
    if (games) {
      res.status(200).json({ ok: 1, data: games });
    } else {
      res.status(404).json({ ok: 0 });
    }
  } catch (e) {
    res.status(401).json({ ok: 0 });
  }
});

const getGameById = asyncHandler(async (req, res) => {
  const { gameId } = req.body;
  if (!gameId) {
    throw new Error("gameId are required");
  }
  try {
    const game: IGame | null = await Games.findOne({ gameId });
    if (game) {
      res.status(200).json({ ok: 1, data: { gameId, pgn: game.pgn } });
    } else {
      res.status(404).json({ ok: 0, message: `no game with id: ${gameId}` });
    }
  } catch (e) {
    res
      .status(401)
      .json({ ok: 0, message: `no game with id: ${gameId} - error ${e}` });
  }
});

const updateGame = asyncHandler(async (req, res) => {
  const { gameId, pgn } = req.body;
  if (!gameId || !pgn) {
    throw new Error("gameId, pgn are required");
  }
  try {
    const game: IGame | null = await Games.findOneAndUpdate(
      { gameId },
      { pgn }
    );
    if (game) {
      res
        .status(200)
        .json({ ok: 1, data: { gameId, pgn: game.pgn }, message: "updated" });
    } else {
      res.status(404).json({ ok: 0, message: "game not found" });
    }
  } catch (e: any) {
    res
      .status(401)
      .json({ ok: 0, message: `error fetching game ${e.message}` });
  }
});

/**
 * middleware that create or update game
 */
const addGame = asyncHandler(async (req, res, next) => {
  const { gameId, pgn, playerId } = req.body;
  if (!gameId || !pgn || !playerId) {
    throw new Error("gameId, pgn, playerId are required");
  }
  try {
    const gameExists = await Games.findOne({ gameId });
    gameExists ? updateGame(req, res, next) : addNewGame(req, res, next);
  } catch (e) {}
});

const addNewGame = asyncHandler(async (req, res) => {
  const { gameId, pgn, playerId } = req.body;
  if (!gameId || !pgn || !playerId) {
    throw new Error("gameId, pgn, playerId are required");
  }
  try {
    const game: IGame | null = await Games.create<IGame>({
      gameId,
      pgn,
      playerId,
    });
    if (game) {
      res.status(200).json({ ok: 1, data: game, message: "created" });
    } else {
      throw new Error("game not added");
    }
  } catch (e: any) {
    throw new Error(`error adding game ${e.message}`);
  }
});

const addGames = asyncHandler(async (req, res) => {
  let { games, playerId } = req.body;
  try {
    games = JSON.parse(games);
  } catch (e) {
    throw new Error("games must be a valid JSON string");
  }
  if (!Array.isArray(games))
    throw new Error("games must be an array of IGame after parsing");
  try {
    games = games.map((game: any) => ({ ...game, playerId }));
    const gamesres: any = await Games.insertMany(games);
    if (gamesres) {
      res.status(200).json({ ok: 1, data: gamesres });
    } else {
      res.status(404).json({ ok: 0, message: "game not found" });
    }
  } catch (e: any) {
    res.status(401).json({ ok: 0, message: `error adding game ${e.message}` });
  }
});

export { getGameById, getGamesOfPlayer, addGame, addGames, updateGame };
