import mongoose, { Model } from "mongoose";
import { IGame } from "../@types";

const gamesSchema = new mongoose.Schema<IGame>({
  pgn: { type: String },
  gameId: { type: Number },
  playerId: {type: String}
});

const Games: Model<IGame> = mongoose.model("Games", gamesSchema);
export default Games;
