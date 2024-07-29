import asyncHandler from "express-async-handler";
import Games from "../models/gamesModel";
import { IGame } from "../@types";

const getGamesOfPlayer = asyncHandler(async (req, res) => {
  const { playerId } = req.body;
  const games:IGame[] = await Games.find({playerId});
  if(games){
    
  }
});

const addGame = () => {};

const addGames = () => {};
