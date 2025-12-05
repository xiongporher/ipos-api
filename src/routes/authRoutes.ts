import { changePassword, forgotPassword, login, verifyToken } from "../controllers/authController";
import express from "express";

const authRouter = express.Router();

authRouter.post("/auth/login", login)
authRouter.put("/auth/forgot-password", forgotPassword)
authRouter.get("/auth/verify-token", verifyToken)
authRouter.put("/auth/change-password", changePassword)

export default authRouter;