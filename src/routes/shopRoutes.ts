import { createShop, getShopAttendants, getShopById, getShops } from "../controllers/shopController";
import express from "express";

const shopRouter = express.Router();

shopRouter.post("/shops", createShop)
shopRouter.get("/shops", getShops)
shopRouter.get("/shops/:id", getShopById)
shopRouter.get("/shop-attendants/:shopId", getShopAttendants)
export default shopRouter;
