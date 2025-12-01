"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brandController_1 = require("../controllers/brandController");
const express_1 = __importDefault(require("express"));
const brandRouter = express_1.default.Router();
brandRouter.post("/brands", brandController_1.createBrand);
brandRouter.get("/brands", brandController_1.getBrands);
brandRouter.get("/brands/:id", brandController_1.getBrandById);
brandRouter.put("/brands/:id", brandController_1.updateBrandById);
brandRouter.delete("/brands/:id", brandController_1.deleteBrandById);
exports.default = brandRouter;
