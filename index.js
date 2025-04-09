import express from "express";
import mongoose from "mongoose";
import aiRouter from "./routes/openai_routes.js";
import userRouter from "./routes/user_route.js";



//make databse connection 
await mongoose.connect(process.env.MONGO_URI);
console.log('Database connected successfully');


// Create an express app
const app = express();

//Use global middleware
app.use(express.json());

//use routes
app.use(aiRouter);
app.use(userRouter);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});