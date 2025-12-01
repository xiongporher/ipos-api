import { db } from "../db/db";
import { Request, Response } from "express";
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQty,
      stockQty,
      price,
      buyingPrice,
      sku,
      productCode,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
    } = req.body;

    // ກວດສອບ required fields
    if (
      !name ||
      !slug ||
      !sku ||
      !productCode ||
      !supplierId ||
      !unitId ||
      !brandId ||
      !categoryId ||
      !expiryDate
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        data: null,
      });
    }

    // ກວດສອບທຸກຢ່າງພ້ອມກັນດ້ວຍ Promise.all (ທັງ unique fields ແລະ foreign keys)
    const [
      existingUnit,
      existingBrand,
      existingCategory,
      existingSupplier,
      existingProductBySlug,
      existingProductBySku,
      existingProductByCode,
      existingProductByBarCode,
    ] = await Promise.all([
      db.unit.findUnique({ where: { id: unitId } }),
      db.brand.findUnique({ where: { id: brandId } }),
      db.category.findUnique({ where: { id: categoryId } }),
      db.supplier.findUnique({ where: { id: supplierId } }),
      db.product.findUnique({ where: { slug } }),
      db.product.findUnique({ where: { sku } }),
      db.product.findUnique({ where: { productCode } }),
      barCode
        ? db.product.findUnique({ where: { barCode } })
        : Promise.resolve(null),
    ]);

    // ກວດສອບ Foreign Keys
    if (!existingUnit) {
      return res.status(404).json({
        message: "Unit not found",
        data: null,
      });
    }

    if (!existingBrand) {
      return res.status(404).json({
        message: "Brand not found",
        data: null,
      });
    }

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        data: null,
      });
    }

    if (!existingSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
        data: null,
      });
    }

    // ກວດສອບຜົນລັບສໍາລັບ unique fields
    if (existingProductBySlug) {
      return res.status(409).json({
        message: "Product with this slug already exists",
        data: null,
      });
    }

    if (existingProductBySku) {
      return res.status(409).json({
        message: "Product with this SKU already exists",
        data: null,
      });
    }

    if (existingProductByCode) {
      return res.status(409).json({
        message: "Product with this product code already exists",
        data: null,
      });
    }

    if (existingProductByBarCode) {
      return res.status(409).json({
        message: "Product with this barcode already exists",
        data: null,
      });
    }

    // ສ້າງ Product
    const newProduct = await db.product.create({
      data: {
        name,
        slug,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty: parseInt(alertQty),
        stockQty: parseInt(stockQty),
        price: parseInt(price),
        buyingPrice: buyingPrice ? parseInt(buyingPrice) : null,
        sku,
        productCode,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate: new Date(expiryDate),
      },
      include: {
        unit: true,
        brand: true,
        category: true,
        supplier: true,
      },
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        unit: true,
        brand: true,
        category: true,
        supplier: true,
      },
    });

    return res.status(200).json({
      data: products,
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

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Product ID is required",
        data: null,
      });
    }

    const existingProduct = await db.product.findUnique({
      where: { id },
      include: {
        unit: true,
        brand: true,
        category: true,
        supplier: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product does not exist",
        data: null,
      });
    }

    return res.status(200).json({
      data: existingProduct,
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
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQty,
      stockQty,
      price,
      buyingPrice,
      sku,
      productCode,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
    } = req.body;

    // ກວດສອບວ່າມີຂໍ້ມູນທີ່ຈະອັບເດດບໍ່
    if (
      !name &&
      !slug &&
      !description &&
      !batchNumber &&
      !barCode &&
      !image &&
      !tax &&
      !alertQty &&
      !stockQty &&
      !price &&
      !buyingPrice &&
      !sku &&
      !productCode &&
      !supplierId &&
      !unitId &&
      !brandId &&
      !categoryId &&
      !expiryDate
    ) {
      return res.status(400).json({
        message: "No fields to update",
        data: null,
      });
    }

    // ກວດສອບວ່າມີ Product ນີ້ຢູ່ບໍ່
    const existingProduct = await db.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
        data: null,
      });
    }

    // ກວດສອບ slug ຊ້ຳ (ຖ້າມີການປ່ຽນ slug)
    if (slug && slug !== existingProduct.slug) {
      const existingProductBySlug = await db.product.findUnique({
        where: { slug },
      });

      if (existingProductBySlug) {
        return res.status(409).json({
          message: "Product with this slug already exists",
          data: null,
        });
      }
    }

    // ກວດສອບ sku ຊ້ຳ (ຖ້າມີການປ່ຽນ sku)
    if (sku && sku !== existingProduct.sku) {
      const existingProductBySku = await db.product.findUnique({
        where: { sku },
      });
      
      if (existingProductBySku) {
        return res.status(409).json({
          message: "Product with this SKU already exists",
          data: null,
        });
      }
    }

    // ກວດສອບ productCode ຊ້ຳ (ຖ້າມີການປ່ຽນ productCode)
    if (productCode && productCode !== existingProduct.productCode) {
      const existingProductByCode = await db.product.findUnique({ 
        where: { productCode } 
      });
      
      if (existingProductByCode) {
        return res.status(409).json({
          message: "Product with this product code already exists",
          data: null,
        });
      }
    }

    // ກວດສອບ barCode ຊ້ຳ (ຖ້າມີການປ່ຽນ barCode)
    if (barCode && barCode !== existingProduct.barCode) {
      const existingProductByBarCode = await db.product.findUnique({ 
        where: { barCode } 
      });

      if (existingProductByBarCode) {
        return res.status(409).json({
          message: "Product with this barcode already exists",
          data: null,
        });
      }
    }

    // ອັບເດດຂໍ້ມູນ
    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(batchNumber !== undefined && { batchNumber }),
        ...(barCode !== undefined && { barCode }),
        ...(image !== undefined && { image: parseInt(image) }),
        ...(tax !== undefined && { tax }),
        ...(alertQty && { alertQty: parseInt(alertQty) }),
        ...(stockQty && { stockQty: parseInt(stockQty) }),
        ...(price && { price: parseInt(price) }),
        ...(buyingPrice !== undefined && {
          buyingPrice: buyingPrice ? parseInt(buyingPrice) : null,
        }),
        ...(sku && { sku }),
        ...(productCode && { productCode }),
        ...(supplierId && { supplierId }),
        ...(unitId && { unitId }),
        ...(brandId && { brandId }),
        ...(categoryId && { categoryId }),
        ...(expiryDate && { expiryDate: new Date(expiryDate) }),
      },
      include: {
        unit: true,
        brand: true,
        category: true,
        supplier: true,
      },
    });

    return res.status(200).json({
      message: "Updated product successfully",
      data: updatedProduct,
      error: null,
    });
  } catch (error) {
    console.log("Error updating product:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        data: null,
      });
    }

    await db.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      error: null,
    });
  } catch (error) {
    console.log("Error deleting product:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
