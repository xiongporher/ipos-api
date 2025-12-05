
import { createSale, getSales } from "../controllers/saleController";
import express from "express";

const saleRouter = express.Router();

saleRouter.post("/sales", createSale);
saleRouter.get("/sales", getSales);

export default saleRouter;
