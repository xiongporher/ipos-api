import { db } from "../db/db";
import { Request, Response } from "express";

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    if (
      !supplierType ||
      !name ||
      !contactPerson ||
      !phone ||
      !location ||
      !country
    ) {
      return res.status(400).json({
        message: "Please all fields are required",
      });
    }
    const existingSupplierByPhone = await db.supplier.findUnique({
      where: { phone },
    });

    if (existingSupplierByPhone) {
      return res.status(409).json({
        message: "Phone number already exists",
      });
    }
    if (email) {
      const existingSupplierByEmail = await db.supplier.findUnique({
        where: { email },
      });

      if (existingSupplierByEmail) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }
    if (regNumber) {
      const existingSupplierByRegNumber = await db.supplier.findUnique({
        where: { regNumber },
      });

      if (existingSupplierByRegNumber) {
        return res.status(409).json({
          message: "RegNumber already exists",
        });
      }
    }
    const newSupplier = await db.supplier.create({
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
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const getSupplier = async (req: Request, res: Response) => {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(suppliers);
  } catch (error) {
    console.log("Error fetching suppliers", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknow error",
    });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await db.supplier.findUnique({ where: { id } });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json(supplier);
  } catch (error) {
    console.log("Error fetching supplier:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
