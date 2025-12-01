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
exports.deleteUserById = exports.updateUserPasswordById = exports.updateUserById = exports.getUserById = exports.getAttendants = exports.getUsers = exports.createUser = void 0;
const db_1 = require("../db/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password, firstName, lastName, phone, dob, gender, image, role, } = req.body;
        if (!email ||
            !username ||
            !password ||
            !firstName ||
            !lastName ||
            !phone ||
            !gender) {
            return res.status(400).json({
                message: "Please all fields are required",
            });
        }
        const [existingUserByEmail, existingUserByPhone, existingUserByUsername] = yield Promise.all([
            db_1.db.user.findUnique({ where: { email } }),
            db_1.db.user.findUnique({ where: { phone } }),
            db_1.db.user.findUnique({ where: { username } }),
        ]);
        if (existingUserByEmail) {
            res.status(409).json({
                message: "Email already exists",
                data: null,
            });
            return;
        }
        if (existingUserByPhone) {
            res.status(409).json({
                message: "Phone number already exists",
                data: null,
            });
            return;
        }
        if (existingUserByUsername) {
            res.status(409).json({
                message: "Username already exists",
                data: null,
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield db_1.db.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                dob,
                gender,
                image: image
                    ? image
                    : "https://d4r1notk17.ufs.sh/f/ajZEQyxNnEuWKbPJ9yPD45GDtfHPjMyeBnsgS2F0Xua8Nmrv",
                role: role || "ATTENDANT",
            },
        });
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        res.status(201).json({
            message: "Created user successfully",
            data: userWithoutPassword,
            error: null,
        });
    }
    catch (error) {
        console.log("Error created user", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknow error",
        });
    }
});
exports.createUser = createUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        const filteredUsers = users.map((user) => {
            const { password, role } = user, others = __rest(user, ["password", "role"]);
            return others;
        });
        res.status(200).json({
            data: filteredUsers,
            error: null,
        });
    }
    catch (error) {
        console.log("Error fetching users", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknow error",
        });
    }
});
exports.getUsers = getUsers;
const getAttendants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.user.findMany({
            orderBy: { createdAt: "desc" },
            where: {
                role: "ATTENDANT",
            },
        });
        const filteredUsers = users.map((user) => {
            const { password, role } = user, others = __rest(user, ["password", "role"]);
            return others;
        });
        res.status(200).json({
            data: filteredUsers,
            error: null,
        });
    }
    catch (error) {
        console.log("Error fetching users", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknow error",
        });
    }
});
exports.getAttendants = getAttendants;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield db_1.db.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        const { password: _ } = user, result = __rest(user, ["password"]);
        res.status(200).json({
            data: result,
            error: null,
        });
    }
    catch (error) {
        console.log("Error fetching user", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getUserById = getUserById;
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, username, firstName, lastName, password, phone, dob, gender, image, } = req.body;
        if (!email &&
            !username &&
            !firstName &&
            !lastName &&
            !password &&
            !phone &&
            !dob &&
            !gender &&
            !image) {
            return res.status(400).json({
                message: "No fields to update",
                data: null,
            });
        }
        const user = yield db_1.db.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        if (email && email !== user.email) {
            const existingEmail = yield db_1.db.user.findUnique({
                where: { email },
            });
            if (existingEmail) {
                return res.status(409).json({
                    message: `Email (${email}) already exists`,
                    data: null,
                });
            }
        }
        if (username && username !== user.username) {
            const existingUsername = yield db_1.db.user.findUnique({
                where: { username },
            });
            if (existingUsername) {
                return res.status(409).json({
                    message: `Username (${username}) already exists`,
                    data: null,
                });
            }
        }
        if (phone && phone !== user.phone) {
            const existingPhone = yield db_1.db.user.findUnique({
                where: { phone },
            });
            if (existingPhone) {
                return res.status(409).json({
                    message: `Phone number (${phone}) already exists`,
                    data: null,
                });
            }
        }
        let hashedPassword = user.password;
        if (password) {
            hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        }
        const updatedUser = yield db_1.db.user.update({
            where: { id },
            data: {
                email,
                username,
                firstName,
                lastName,
                password: hashedPassword,
                phone,
                dob,
                gender,
                image,
            },
        });
        const { password: _ } = updatedUser, others = __rest(updatedUser, ["password"]);
        return res.status(200).json({
            message: "Updated user successfully",
            data: others,
            error: null,
        });
    }
    catch (error) {
        console.log("Error updating user:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateUserById = updateUserById;
const updateUserPasswordById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { password, currentPassword } = req.body;
        if (!password) {
            return res.status(400).json({
                message: "Password is required",
                data: null,
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                data: null,
            });
        }
        const user = yield db_1.db.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        if (currentPassword) {
            const isValidPassword = yield bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    message: "Current password is incorrect",
                    data: null,
                });
            }
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const updatedUser = yield db_1.db.user.update({
            where: { id },
            data: {
                password: hashedPassword,
            },
        });
        const { password: _ } = updatedUser, rest = __rest(updatedUser, ["password"]);
        return res.status(200).json({
            message: "Password updated successfully",
            data: rest,
            error: null,
        });
    }
    catch (error) {
        console.log("Error updating password:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateUserPasswordById = updateUserPasswordById;
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield db_1.db.user.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                data: null,
            });
        }
        yield db_1.db.user.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "User deleted successfully",
            success: true,
            error: null,
        });
    }
    catch (error) {
        console.log("Error deleting user:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteUserById = deleteUserById;
