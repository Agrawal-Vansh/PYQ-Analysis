import express from "express";
import { ensureAuthenticated } from "../middlewares/authEnsure.js";
import {generatePotentialQuestions, handleAiResponse} from "../controllers/ai.js";
const router=express.Router();
router.post("/extract", handleAiResponse);
router.post("/potentialQuestions",ensureAuthenticated,generatePotentialQuestions);
export default router;