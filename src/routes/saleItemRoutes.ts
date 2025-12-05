
import { createSaleItem } from "../controllers/saleItemController";
import express from "express";

const saleItemRouter = express.Router();

saleItemRouter.post("/sales/item", createSaleItem);

export default saleItemRouter;
