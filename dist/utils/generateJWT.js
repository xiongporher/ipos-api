"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DEFAULT_SIGN_OPTION = {
    expiresIn: "1h",
};
const generateAccessToken = (payload, options = DEFAULT_SIGN_OPTION) => {
    const secret_key = process.env.JWT_SECRET_KEY;
    if (!secret_key) {
        throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }
    const token = jsonwebtoken_1.default.sign(payload, secret_key, options);
    return token;
};
exports.generateAccessToken = generateAccessToken;
