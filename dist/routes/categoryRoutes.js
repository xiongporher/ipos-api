"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoriesController_1 = require("../controllers/categoriesController");
const express_1 = __importDefault(require("express"));
const categoryRouter = express_1.default.Router();
categoryRouter.post("/categories", categoriesController_1.createCategory);
categoryRouter.get("/categories", categoriesController_1.getCategories);
categoryRouter.get("/categories/:id", categoriesController_1.getCategoryById);
categoryRouter.put("/categories/:id", categoriesController_1.updateCategoryById);
categoryRouter.delete("/categories/:id", categoriesController_1.deleteCategoryById);
exports.default = categoryRouter;
