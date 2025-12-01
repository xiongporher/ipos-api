"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customerController_1 = require("../controllers/customerController");
const express_1 = __importDefault(require("express"));
const customerRouter = express_1.default.Router();
customerRouter.post("/customers", customerController_1.createCustomer);
customerRouter.get("/customers", customerController_1.getCustomers);
customerRouter.get("/customers/:id", customerController_1.getCustomerById);
exports.default = customerRouter;
