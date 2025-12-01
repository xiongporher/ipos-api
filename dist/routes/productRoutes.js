"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productController_1 = require("../controllers/productController");
const express_1 = __importDefault(require("express"));
const productRouter = express_1.default.Router();
productRouter.post("/products", productController_1.createProduct);
productRouter.get("/products", productController_1.getProducts);
productRouter.get("/products/:id", productController_1.getProductById);
productRouter.put("/products/:id", productController_1.updateProductById);
productRouter.delete("/products/:id", productController_1.deleteProductById);
exports.default = productRouter;
