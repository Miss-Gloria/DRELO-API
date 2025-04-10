import { Router } from "express";
import { confirmNewUserEmail, forgotPassword, getAuthenticatedUser, loginUser, registerUser, resetPassword } from "../controllers/user_controller.js";
import { isAuthuenticated } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/user/register", registerUser)
userRouter.post("/user/login", loginUser);
userRouter.patch("/forgot-password", forgotPassword);
userRouter.patch("/reset-password", resetPassword);
userRouter.post("/activate-email", confirmNewUserEmail)
userRouter.get('/users/me', isAuthuenticated, getAuthenticatedUser)
export default userRouter;