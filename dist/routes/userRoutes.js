"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
userRouter.post("/users", userController_1.createUser);
userRouter.get("/users", userController_1.getUsers);
userRouter.get("/attendants", userController_1.getAttendants);
userRouter.get("/users/:id", userController_1.getUserById);
userRouter.put("/users/:id", userController_1.updateUserById);
userRouter.put("/users/update-password/:id", userController_1.updateUserPasswordById);
userRouter.delete("/users/:id", userController_1.deleteUserById);
exports.default = userRouter;
