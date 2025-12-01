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
exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
const db_1 = require("../db/db");
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerType, firstName, lastName, phone, gender, country, location, maxCreditLimit, maxCreditDays, taxPin, email, dob, NIN, } = req.body;
        if (!firstName ||
            !lastName ||
            !phone ||
            !customerType ||
            !gender ||
            !country ||
            !location) {
            return res.status(400).json({
                message: "Please all fields are required",
            });
        }
        const existingCustomerByPhone = yield db_1.db.customer.findUnique({
            where: { phone },
        });
        if (existingCustomerByPhone) {
            return res.status(409).json({
                message: "Phone number already exists",
            });
        }
        if (email) {
            const existingCustomerByEmail = yield db_1.db.customer.findUnique({
                where: { email },
            });
            if (existingCustomerByEmail) {
                return res.status(409).json({
                    message: "Email already exists",
                });
            }
        }
        if (NIN) {
            const existingCustomerByNIN = yield db_1.db.customer.findUnique({
                where: { NIN },
            });
            if (existingCustomerByNIN) {
                return res.status(409).json({
                    message: "NIN already exists",
                });
            }
        }
        const newCustomer = yield db_1.db.customer.create({
            data: {
                customerType,
                firstName,
                lastName,
                phone,
                gender,
                country,
                location,
                maxCreditLimit,
                maxCreditDays,
                taxPin,
                email,
                dob,
                NIN,
            },
        });
        return res.status(201).json({
            message: "Customer created successfully",
            data: newCustomer
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
exports.createCustomer = createCustomer;
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield db_1.db.customer.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(customers);
    }
    catch (error) {
        console.log("Error fetching customers", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknow error",
        });
    }
});
exports.getCustomers = getCustomers;
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const customer = yield db_1.db.customer.findUnique({ where: { id } });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        return res.status(200).json(customer);
    }
    catch (error) {
        console.log("Error fetching customer:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getCustomerById = getCustomerById;
