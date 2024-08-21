import Stats from "../models/statsModel.js";
import asyncHandler from "express-async-handler";
import { StatsClass } from "../utils/_Stats.js";

const addingGameType = asyncHandler(async (req, res, next) => {
  const { userId, userdata, vendor } = req.body;

  await addStats(req, res, {
    userId,
    vendor,
    type: "gt",
    statusdata: userdata.gametype,
  });
});

const addingGameResult = asyncHandler(async (req, res, next) => {
  const { userId, userdata, vendor } = req.body;

  await addStats(req, res, {
    userId,
    vendor,
    type: "gr_outer",
    statusdata: userdata.gameResult,
  });
});

/**
 * @response 201 { ok: 1, userId: string, data: { action: "create"}, verbose: changedKeys (JSON format) }
 */
const addingClassifications = asyncHandler(async (req, res, next) => {
  const { userId, userdata, vendor } = req.body;

  await addStats(req, res, {
    userId,
    vendor,
    type: "cl",
    statusdata: userdata.classification,
  });
});

const addStats = async (req: any, res: any, userdata: any) => {
  const { userId, statusdata, type, vendor } = userdata;
  const statsclass = new StatsClass();
  let typeName = ((x: "cl" | "gt" | "gr_inner" | "gr_outer") => {
    let names = {
      cl: "classification",
      gt: "gametype",
      gr_outer: "gameResult",
      gr_inner: "gameResult",
    };
    return names[x];
  })(type);

  const vendorname = vendor == "chess.com" ? "chesscom" : "lichess";
  let data = await Stats.findOne({ userId: userId });
  if (!data) {
    const newgameData = statsclass.merge({
      type: type,
      input: statsclass.filter(statusdata, type),
    });
    console.log(newgameData.verbose);
    console.error("data not found");
    data = await Stats.create({
      userId,
      [vendorname]: {
        classification:
          type == "cl"
            ? newgameData.result
            : JSON.stringify(statsclass.specification),
        gametype:
          type == "gt"
            ? newgameData.result
            : JSON.stringify(statsclass.gameType),
        gameResult:
          type == "gr_outer" || type == "gr_inner"
            ? newgameData.result
            : JSON.stringify(statsclass.gameResult),
      },
      [vendorname == "chesscom" ? "lichess" : "chesscom"]: {
        classification: JSON.stringify(statsclass.specification),
        gametype: JSON.stringify(statsclass.gameType),
        gameResult: JSON.stringify(statsclass.gameResult),
      },
    });
    res.status(201).json({
      ok: 1,
      userId,
      data: { action: "create", res: data },
      verbose: newgameData.verbose,
    });
  } else {
    const newgametype = statsclass.merge({
      type: type,
      input: statsclass.filter(statusdata, type),
      // @ts-ignore
      initial: data[vendorname][typeName] // @ts-ignore
        ? JSON.parse(data[vendorname][typeName])
        : undefined, // @ts-ignore
    });
    try {
      const result = await Stats.findOneAndUpdate(
        { userId: userId },
        {
          $set: {
            [vendorname + "." + typeName]: newgametype.result,
          },
        },
        { new: true }
      );
      console.log(result);
      res.status(202).json({
        ok: 1,
        userId,
        data: { action: "update", res: JSON.stringify(result) },
        verbose: JSON.stringify(newgametype.verbose),
      });
    } catch (err) {
      console.error(err);
      res.status(400);
      throw new Error("Failed to update");
    }
  }
};

export { addingClassifications, addingGameType, addingGameResult };
