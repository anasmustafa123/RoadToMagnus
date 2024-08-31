import mongoose from "mongoose";

const VendorStatsSchema = new mongoose.Schema(
  {
    classification: { type: String, required: true },
    gametype: { type: String, required: true },
    gameResult: { type: String, required: true },
  },
  { _id: false }
);

const StatsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  chesscom: { type: VendorStatsSchema, required: true },
  lichess: { type: VendorStatsSchema, required: true },
});

const Stats = mongoose.model("Stats", StatsSchema);
export default Stats;
