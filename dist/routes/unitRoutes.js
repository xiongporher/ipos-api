"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unitController_1 = require("../controllers/unitController");
const express_1 = __importDefault(require("express"));
const unitRouter = express_1.default.Router();
unitRouter.post("/units", unitController_1.createUnit);
unitRouter.get("/units", unitController_1.getUnits);
unitRouter.get("/units/:id", unitController_1.getUnitById);
unitRouter.put("/units/:id", unitController_1.updateUnitById);
unitRouter.delete("/units/:id", unitController_1.deleteUnitById);
exports.default = unitRouter;
