import {
  addingClassifications,
  addingGameResult,
  addingGameType,
} from "../controller/statsController.js";
import express from "express";
const router = express.Router();

router.post("/addGameType", addingGameType);
router.post("/addClassification", addingClassifications);
router.post("/addGameResult", addingGameResult);

export default router;
