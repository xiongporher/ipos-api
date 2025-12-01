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
exports.getSupplierById = exports.getSupplier = exports.createSupplier = void 0;
const db_1 = require("../db/db");
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierType, name, contactPerson, phone, email, location, country, website, taxPin, regNumber, bankAccountNumber, bankName, paymentTerms, logo, rating, notes, } = req.body;
        if (!supplierType ||
            !name ||
            !contactPerson ||
            !phone ||
            !location ||
            !country) {
            return res.status(400).json({
                message: "Please all fields are required",
            });
        }
        const existingSupplierByPhone = yield db_1.db.supplier.findUnique({
            where: { phone },
        });
        if (existingSupplierByPhone) {
            return res.status(409).json({
                message: "Phone number already exists",
            });
        }
        if (email) {
            const existingSupplierByEmail = yield db_1.db.supplier.findUnique({
                where: { email },
            });
            if (existingSupplierByEmail) {
                return res.status(409).json({
                    message: "Email already exists",
                });
            }
        }
        if (regNumber) {
            const existingSupplierByRegNumber = yield db_1.db.supplier.findUnique({
                where: { regNumber },
            });
            if (existingSupplierByRegNumber) {
                return res.status(409).json({
                    message: "RegNumber already exists",
                });
            }
        }
        const newSupplier = yield db_1.db.supplier.create({
            data: {
                supplierType,
                name,
                contactPerson,
                phone,
                email,
                location,
                country,
                website,
                taxPin,
                regNumber,
                bankAccountNumber,
                bankName,
                paymentTerms,
                logo,
                rating,
                notes,
            },
        });
        return res.status(201).json({
            message: "Supplier created successfully",
            data: newSupplier,
        });
    }
    catch (error) {
        console.error("Error details:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createSupplier = createSupplier;
const getSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield db_1.db.supplier.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(suppliers);
    }
    catch (error) {
        console.log("Error fetching suppliers", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknow error",
        });
    }
});
exports.getSupplier = getSupplier;
const getSupplierById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const supplier = yield db_1.db.supplier.findUnique({ where: { id } });
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        return res.status(200).json(supplier);
    }
    catch (error) {
        console.log("Error fetching supplier:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getSupplierById = getSupplierById;
