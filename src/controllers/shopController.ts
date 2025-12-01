import { db } from "../db/db";
import { Request, Response } from "express";

export const createShop = async (req: Request, res: Response) => {
  try {
    const { name, slug, location, adminId, attendantIds } = req.body;

    // ກວດສອບ required fields
    if (!name || !slug || !adminId) {
      return res.status(400).json({
        message: "Missing required fields",
        data: null,
      });
    }

    // ກວດສອບທຸກຢ່າງພ້ອມກັນດ້ວຍ Promise.all
    const [existingShop, existingAdmin] = await Promise.all([
      db.shop.findUnique({ where: { slug } }),
      db.user.findUnique({ where: { id: adminId } }),
    ]);

    // ກວດສອບ slug ຊ້ຳ
    if (existingShop) {
      return res.status(409).json({
        message: "Shop with this slug already exists",
        data: null,
      });
    }

    // ກວດສອບວ່າມີ admin ຢູ່ບໍ່
    if (!existingAdmin) {
      return res.status(404).json({
        message: "Admin user not found",
        data: null,
      });
    }

    // ກວດສອບ attendants (ຖ້າມີ)
    if (attendantIds && attendantIds.length > 0) {
      const attendants = await db.user.findMany({
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

    // ສ້າງ Shop
    const newShop = await db.shop.create({
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
  } catch (error) {
    console.log("Something went wrong:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getShops = async (req: Request, res: Response) => {
  try {
    const shops = await db.shop.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      data: shops,
      error: null,
    });
  } catch (error) {
    console.log("Something went wrong ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknow error",
    });
  }
};
export const getShopById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Add validation
    if (!id) {
      return res.status(400).json({
        message: "Shop ID is required",
        data: null
      });
    }

    const existingShop = await db.shop.findUnique({
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
  } catch (error) {
    console.log("Something went wrong:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
export const getShopAttendants = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;

    // Add validation
    if (!shopId) {
      return res.status(400).json({
        message: "Shop ID is required",
        data: null
      });
    }

    const existingShop = await db.shop.findUnique({
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

    const attendants = await db.user.findMany({
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
  } catch (error) {
    console.log("Something went wrong:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
