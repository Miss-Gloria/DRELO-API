import { Router } from "express";
import { confirmNewUserEmail, forgotPassword, loginUser, registerUser, resetPassword } from "../controllers/user_controller.js";

const userRouter = Router();

userRouter.post("/user/register", registerUser)
userRouter.post("/user/login", loginUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/activate-email", confirmNewUserEmail)
export default userRouter;