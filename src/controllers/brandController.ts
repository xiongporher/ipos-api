import { db } from "../db/db";
import { Request, Response } from "express";

export const createBrand = async (req: Request, res: Response) => {
  try {
    // Get the data
    const { name, slug } = req.body;
    // Check if brand already exists
    const existingBrand = await db.brand.findUnique({
      where: { slug },
    });
    // Create the Brand
    if (existingBrand) {
      return res.status(409).json({
        message: "Brand is already existing",
        data: null,
      });
    }

    const newBrand = await db.brand.create({
      data: {
        name,
        slug,
      },
    });
    // Return the Create brand
    return res.status(201).json({
      message: "Brand created successfully",
      data: newBrand,
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

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await db.brand.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      data: brands,
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
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Add validation
    if (!id) {
      return res.status(400).json({
        message: "Brand ID is required",
        data: null,
      });
    }

    const existingBrand = await db.brand.findUnique({
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
  } catch (error) {
    console.log("Something went wrong:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export const updateBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // ກວດສອບວ່າມີຂໍ້ມູນທີ່ຈະອັບເດດບໍ່
    if (!name && !slug ) {
      return res.status(400).json({
        message: "No fields to update",
        data: null,
      });
    }

    // ກວດສອບວ່າມີ brand ນີ້ຢູ່ບໍ່
    const existingBrand = await db.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return res.status(404).json({
        message: "Brand not found",
        data: null,
      });
    }

    // ກວດສອບ slug ຊ້ຳ (ຖ້າມີການປ່ຽນ slug)
    if (slug && slug !== existingBrand.slug) {
      const existingBrandBySlug = await db.brand.findUnique({
        where: { slug },
      });

      if (existingBrandBySlug) {
        return res.status(409).json({
          message: "Slug already exists",
          data: null,
        });
      }
    }

    // ອັບເດດຂໍ້ມູນ
    const updatedBrand = await db.brand.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        
      },
    });

    return res.status(200).json({
      message: "Updated brand successfully",
      data: updatedBrand,
      error: null,
    });
  } catch (error) {
    console.log("Error updating brand:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await db.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found",
        data: null,
      });
    }

    await db.brand.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Brand deleted successfully",
      success: true,
      error: null,
    });
  } catch (error) {
    console.log("Error deleting brand:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
