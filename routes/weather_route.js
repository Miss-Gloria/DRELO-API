import express from "express";
import { getWeather } from "../controllers/weather_controller.js";

const weatherRouter = express.Router();
weatherRouter.get("/weather", getWeather);

export default weatherRouter

