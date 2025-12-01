import { login } from "../controllers/authController";
import express from "express";

const authRouter = express.Router();

authRouter.post("/auth/login", login)

export default authRouter;