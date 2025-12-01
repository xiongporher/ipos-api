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
exports.deleteUnitById = exports.updateUnitById = exports.getUnitById = exports.getUnits = exports.createUnit = void 0;
const db_1 = require("../db/db");
const createUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, abbreviation, slug } = req.body;
        const existingUnit = yield db_1.db.unit.findUnique({
            where: { slug },
        });
        if (existingUnit) {
            return res.status(409).json({
                message: "Unit is already existing",
                data: null,
            });
        }
        const newUnit = yield db_1.db.unit.create({
            data: {
                name,
                slug,
                abbreviation,
            },
        });
        return res.status(201).json({
            message: "Unit created successfully",
            data: newUnit,
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
exports.createUnit = createUnit;
const getUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const units = yield db_1.db.unit.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({
            data: units,
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
exports.getUnits = getUnits;
const getUnitById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Unit ID is required",
                data: null,
            });
        }
        const existingUnit = yield db_1.db.unit.findUnique({
            where: {
                id,
            },
        });
        if (!existingUnit) {
            return res.status(404).json({
                message: "Unit does not exist",
                data: null,
            });
        }
        return res.status(200).json({
            data: existingUnit,
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
exports.getUnitById = getUnitById;
const updateUnitById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, slug, abbreviation } = req.body;
        if (!name && !slug && !abbreviation) {
            return res.status(400).json({
                message: "No fields to update",
                data: null,
            });
        }
        const existingUnit = yield db_1.db.unit.findUnique({
            where: { id },
        });
        if (!existingUnit) {
            return res.status(404).json({
                message: "Unit not found",
                data: null,
            });
        }
        if (slug && slug !== existingUnit.slug) {
            const existingUnitBySlug = yield db_1.db.unit.findUnique({
                where: { slug },
            });
            if (existingUnitBySlug) {
                return res.status(409).json({
                    message: "Slug already exists",
                    data: null,
                });
            }
        }
        const updatedUnit = yield db_1.db.unit.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign({}, (name && { name })), (slug && { slug })), (abbreviation && { abbreviation })),
        });
        return res.status(200).json({
            message: "Updated unit successfully",
            data: updatedUnit,
            error: null,
        });
    }
    catch (error) {
        console.log("Error updating unit:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateUnitById = updateUnitById;
const deleteUnitById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const unit = yield db_1.db.unit.findUnique({
            where: { id },
        });
        if (!unit) {
            return res.status(404).json({
                message: "Unit not found",
                data: null,
            });
        }
        yield db_1.db.unit.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Unit deleted successfully",
            success: true,
            error: null,
        });
    }
    catch (error) {
        console.log("Error deleting unit:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteUnitById = deleteUnitById;
