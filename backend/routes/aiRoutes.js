import express from "express";
import {handleAiResponse} from "../controllers/ai.js";
const router=express.Router();
router.post("/extract", handleAiResponse);
export default router;