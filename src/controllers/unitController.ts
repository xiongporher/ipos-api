import { db } from "../db/db";
import { Request, Response } from "express";

export const createUnit = async (req: Request, res: Response) => {
  try {
    // Get the data
    const { name, abbreviation, slug } = req.body;
    // Check if shop already exists
    const existingUnit = await db.unit.findUnique({
      where: { slug },
    });
    // Create the Unit
    if (existingUnit) {
      return res.status(409).json({
        message: "Unit is already existing",
        data: null,
      });
    }

    const newUnit = await db.unit.create({
      data: {
        name,
        slug,
        abbreviation,
      },
    });
    // Return the Create Shop
    return res.status(201).json({
      message: "Unit created successfully",
      data: newUnit,
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

export const getUnits = async (req: Request, res: Response) => {
  try {
    const units = await db.unit.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      data: units,
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
export const getUnitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Add validation
    if (!id) {
      return res.status(400).json({
        message: "Unit ID is required",
        data: null,
      });
    }

    const existingUnit = await db.unit.findUnique({
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
  } catch (error) {
    console.log("Something went wrong:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const updateUnitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, abbreviation } = req.body;

    // ກວດສອບວ່າມີຂໍ້ມູນທີ່ຈະອັບເດດບໍ່
    if (!name && !slug && !abbreviation) {
      return res.status(400).json({
        message: "No fields to update",
        data: null,
      });
    }

    // ກວດສອບວ່າມີ unit ນີ້ຢູ່ບໍ່
    const existingUnit = await db.unit.findUnique({
      where: { id },
    });

    if (!existingUnit) {
      return res.status(404).json({
        message: "Unit not found",
        data: null,
      });
    }

    // ກວດສອບ slug ຊ້ຳ (ຖ້າມີການປ່ຽນ slug)
    if (slug && slug !== existingUnit.slug) {
      const existingUnitBySlug = await db.unit.findUnique({
        where: { slug },
      });

      if (existingUnitBySlug) {
        return res.status(409).json({
          message: "Slug already exists",
          data: null,
        });
      }
    }

    // ອັບເດດຂໍ້ມູນ
    const updatedUnit = await db.unit.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(abbreviation && { abbreviation }),
      },
    });

    return res.status(200).json({
      message: "Updated unit successfully",
      data: updatedUnit,
      error: null,
    });
  } catch (error) {
    console.log("Error updating unit:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteUnitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const unit = await db.unit.findUnique({
      where: { id },
    });

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found",
        data: null,
      });
    }

    await db.unit.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Unit deleted successfully",
      success: true,
      error: null,
    });
  } catch (error) {
    console.log("Error deleting unit:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
