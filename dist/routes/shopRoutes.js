"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopController_1 = require("../controllers/shopController");
const express_1 = __importDefault(require("express"));
const shopRouter = express_1.default.Router();
shopRouter.post("/shops", shopController_1.createShop);
shopRouter.get("/shops", shopController_1.getShops);
shopRouter.get("/shops/:id", shopController_1.getShopById);
shopRouter.get("/shop-attendants/:shopId", shopController_1.getShopAttendants);
exports.default = shopRouter;
