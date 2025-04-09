import { Router } from "express";
import { aiChat } from "../controllers/openai_controller.js";

const aiRouter = Router();
  
aiRouter.post("/chat", aiChat);

export default aiRouter;