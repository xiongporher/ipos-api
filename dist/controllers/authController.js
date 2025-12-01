"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const db_1 = require("../db/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateJWT_1 = require("../utils/generateJWT");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        if ((!email && !username) || !password) {
            return res.status(400).json({
                message: "Email or username and password are required",
            });
        }
        let existingUser = null;
        if (email) {
            existingUser = yield db_1.db.user.findUnique({
                where: { email },
            });
        }
        if (!existingUser && username) {
            existingUser = yield db_1.db.user.findUnique({
                where: { username },
            });
        }
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid credentials",
                error: null,
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                error: null,
            });
        }
        const { password: _ } = existingUser, userWithoutPassword = __rest(existingUser, ["password"]);
        const accessToken = (0, generateJWT_1.generateAccessToken)({
            userId: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
        });
        res.status(200).json({
            message: "Login successfully",
            data: {
                user: userWithoutPassword,
                accessToken,
            },
            error: null,
        });
    }
    catch (error) {
        console.log("Error logging in user", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.login = login;
