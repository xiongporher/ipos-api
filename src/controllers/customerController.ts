import { db } from "../db/db";
import { Request, Response } from "express";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !customerType ||
      !gender ||
      !country ||
      !location
    ) {
      return res.status(400).json({
        message: "Please all fields are required",
      });
    }
    const existingCustomerByPhone = await db.customer.findUnique({
      where: { phone },
    });

    if (existingCustomerByPhone) {
      return res.status(409).json({
        message: "Phone number already exists",
      });
    }
    if (email) {
      const existingCustomerByEmail = await db.customer.findUnique({
        where: { email },
      });

      if (existingCustomerByEmail) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }
    }
    if (NIN) {
      const existingCustomerByNIN = await db.customer.findUnique({
        where: { NIN },
      });

      if (existingCustomerByNIN) {
        return res.status(409).json({
          message: "NIN already exists",
        });
      }
    }
    const newCustomer = await db.customer.create({
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
        dob: new Date("1995-03-15"),
        NIN,
      },
    });

    return res.status(201).json({
      message: "Customer created successfully",
      data: newCustomer
    });
  } catch (error) {
    console.error("Error details:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(customers);
  } catch (error) {
    console.log("Error fetching customers", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknow error",
    });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customer = await db.customer.findUnique({ where: { id } });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.log("Error fetching customer:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
