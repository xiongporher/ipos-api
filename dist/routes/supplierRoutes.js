"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supplierController_1 = require("../controllers/supplierController");
const express_1 = __importDefault(require("express"));
const supplierRouter = express_1.default.Router();
supplierRouter.post("/suppliers", supplierController_1.createSupplier);
supplierRouter.get("/suppliers", supplierController_1.getSupplier);
supplierRouter.get("/suppliers/:id", supplierController_1.getSupplierById);
exports.default = supplierRouter;
