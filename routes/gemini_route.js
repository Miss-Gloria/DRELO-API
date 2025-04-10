import express from "express";
import { aIChat } from "../controllers/gemini_controller.js";


const geminiRouter = express.Router();
geminiRouter.post("/gemini", aIChat);

export default geminiRouter;