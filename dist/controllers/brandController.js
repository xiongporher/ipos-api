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
exports.deleteBrandById = exports.updateBrandById = exports.getBrandById = exports.getBrands = exports.createBrand = void 0;
const db_1 = require("../db/db");
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug } = req.body;
        const existingBrand = yield db_1.db.brand.findUnique({
            where: { slug },
        });
        if (existingBrand) {
            return res.status(409).json({
                message: "Brand is already existing",
                data: null,
            });
        }
        const newBrand = yield db_1.db.brand.create({
            data: {
                name,
                slug,
            },
        });
        return res.status(201).json({
            message: "Brand created successfully",
            data: newBrand,
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
exports.createBrand = createBrand;
const getBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield db_1.db.brand.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({
            data: brands,
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
exports.getBrands = getBrands;
const getBrandById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Brand ID is required",
                data: null,
            });
        }
        const existingBrand = yield db_1.db.brand.findUnique({
            where: {
                id,
            },
        });
        if (!existingBrand) {
            return res.status(404).json({
                message: "Brand does not exist",
                data: null,
            });
        }
        return res.status(200).json({
            data: existingBrand,
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
exports.getBrandById = getBrandById;
const updateBrandById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;
        if (!name && !slug) {
            return res.status(400).json({
                message: "No fields to update",
                data: null,
            });
        }
        const existingBrand = yield db_1.db.brand.findUnique({
            where: { id },
        });
        if (!existingBrand) {
            return res.status(404).json({
                message: "Brand not found",
                data: null,
            });
        }
        if (slug && slug !== existingBrand.slug) {
            const existingBrandBySlug = yield db_1.db.brand.findUnique({
                where: { slug },
            });
            if (existingBrandBySlug) {
                return res.status(409).json({
                    message: "Slug already exists",
                    data: null,
                });
            }
        }
        const updatedBrand = yield db_1.db.brand.update({
            where: { id },
            data: Object.assign(Object.assign({}, (name && { name })), (slug && { slug })),
        });
        return res.status(200).json({
            message: "Updated brand successfully",
            data: updatedBrand,
            error: null,
        });
    }
    catch (error) {
        console.log("Error updating brand:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateBrandById = updateBrandById;
const deleteBrandById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const brand = yield db_1.db.brand.findUnique({
            where: { id },
        });
        if (!brand) {
            return res.status(404).json({
                message: "Brand not found",
                data: null,
            });
        }
        yield db_1.db.brand.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Brand deleted successfully",
            success: true,
            error: null,
        });
    }
    catch (error) {
        console.log("Error deleting brand:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteBrandById = deleteBrandById;
