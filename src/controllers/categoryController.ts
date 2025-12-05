import { db } from "../db/db";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
  try {
    // Get the data
    const { name, slug } = req.body;
    // Check if category already exists
    const existingCategory = await db.category.findUnique({
      where: { slug },
    });
    // Create the Category
    if (existingCategory) {
      return res.status(409).json({
        message: "Category is already existing",
        data: null,
      });
    }

    const newCategory = await db.category.create({
      data: {
        name,
        slug,
      },
    });
    // Return the Create category
    return res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
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

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categorys = await db.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      data: categorys,
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
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Add validation
    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
        data: null,
      });
    }

    const existingCategory = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category does not exist",
        data: null,
      });
    }

    return res.status(200).json({
      data: existingCategory,
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
export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // ກວດສອບວ່າມີຂໍ້ມູນທີ່ຈະອັບເດດບໍ່
    if (!name && !slug) {
      return res.status(400).json({
        message: "No fields to update",
        data: null,
      });
    }

    // ກວດສອບວ່າມີ Category ນີ້ຢູ່ບໍ່
    const existingCategory = await db.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        data: null,
      });
    }

    // ກວດສອບ slug ຊ້ຳ (ຖ້າມີການປ່ຽນ slug)
    if (slug && slug !== existingCategory.slug) {
      const existingCategoryBySlug = await db.category.findUnique({
        where: { slug },
      });

      if (existingCategoryBySlug) {
        return res.status(409).json({
          message: "Slug already exists",
          data: null,
        });
      }
    }

    // ອັບເດດຂໍ້ມູນ
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
      },
    });

    return res.status(200).json({
      message: "Updated category successfully",
      data: updatedCategory,
      error: null,
    });
  } catch (error) {
    console.log("Error updating category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await db.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        data: null,
      });
    }

    await db.category.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
      success: true,
      error: null,
    });
  } catch (error) {
    console.log("Error deleting category:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
