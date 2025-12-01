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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShopAttendants = exports.getShopById = exports.getShops = exports.createShop = void 0;
const db_1 = require("../db/db");
const createShop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, location, adminId, attendantIds } = req.body;
        if (!name || !slug || !adminId) {
            return res.status(400).json({
                message: "Missing required fields",
                data: null,
            });
        }
        const [existingShop, existingAdmin] = yield Promise.all([
            db_1.db.shop.findUnique({ where: { slug } }),
            db_1.db.user.findUnique({ where: { id: adminId } }),
        ]);
        if (existingShop) {
            return res.status(409).json({
                message: "Shop with this slug already exists",
                data: null,
            });
        }
        if (!existingAdmin) {
            return res.status(404).json({
                message: "Admin user not found",
                data: null,
            });
        }
        if (attendantIds && attendantIds.length > 0) {
            const attendants = yield db_1.db.user.findMany({
                where: {
                    id: { in: attendantIds },
                },
            });
            if (attendants.length !== attendantIds.length) {
                return res.status(404).json({
                    message: "One or more attendant users not found",
                    data: null,
                });
            }
        }
        const newShop = yield db_1.db.shop.create({
            data: {
                name,
                slug,
                location,
                adminId,
                attendantIds: attendantIds || [],
            },
            include: {
                admin: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(201).json({
            message: "Shop created successfully",
            data: newShop,
            error: null,
        });
    }
    catch (error) {
        console.log("Something went wrong:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createShop = createShop;
const getShops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shops = yield db_1.db.shop.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({
            data: shops,
            error: null,
        });
    }
    catch (error) {
        console.log("Something went wrong ", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknow error",
        });
    }
});
exports.getShops = getShops;
const getShopById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Shop ID is required",
                data: null
            });
        }
        const existingShop = yield db_1.db.shop.findUnique({
            where: {
                id
            }
        });
        if (!existingShop) {
            return res.status(404).json({
                message: "Shop does not exist",
                data: null
            });
        }
        return res.status(200).json({
            data: existingShop,
            error: null
        });
    }
    catch (error) {
        console.log("Something went wrong:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
exports.getShopById = getShopById;
const getShopAttendants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shopId } = req.params;
        if (!shopId) {
            return res.status(400).json({
                message: "Shop ID is required",
                data: null
            });
        }
        const existingShop = yield db_1.db.shop.findUnique({
            where: {
                id: shopId
            }
        });
        if (!existingShop) {
            return res.status(404).json({
                message: "Shop does not exist",
                data: null
            });
        }
        const attendants = yield db_1.db.user.findMany({
            where: {
                id: {
                    in: existingShop.attendantIds
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                phone: true,
            }
        });
        return res.status(200).json({
            data: attendants,
            error: null
        });
    }
    catch (error) {
        console.log("Something went wrong:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
exports.getShopAttendants = getShopAttendants;
