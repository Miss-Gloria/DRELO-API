import express from "express";
import mongoose from "mongoose";
import aiRouter from "./routes/openai_routes.js";
import userRouter from "./routes/user_route.js";
import { connect } from "mongoose";
import geminiRouter from "./routes/gemini_route.js";
import cors from "cors";
import { GoogleGenAI } from "@google/genai"
import weatherRouter from "./routes/weather_route.js";


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Create an express app
const app = express();

app.use(cors());
//Use global middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Drelo API is running");
});
//use routes
app.use(aiRouter);
app.use(userRouter);
app.use(geminiRouter);
app.use(weatherRouter);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});