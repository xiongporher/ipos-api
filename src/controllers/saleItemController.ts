import { Request, Response } from "express";
import { SaleItem } from "../types/saleItemTypes";
import { db } from "../db/db";

export const createSaleItem = async (req: Request, res: Response) => {
  try {
    const { saleId, saleItems }: { saleId: string; saleItems: SaleItem[] } =
      req.body;

    if (!saleId || !saleItems || saleItems.length === 0) {
      return res.status(400).json({
        message: "saleId and saleItems are required",
        data: null,
      });
    }

    const sale = await db.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      return res.status(404).json({ message: `Sale ID not found` });
    }

    for (const item of saleItems) {
      if (!item.productId || !item.qty) {
        return res.status(400).json({
          message: "Each sale item must have productId and qty",
          data: null,
        });
      }
    }

    const createdItems = await db.$transaction(async (transaction) => {
      const items = [];

      for (const item of saleItems) {
        // Check if product exists
        const product = await transaction.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product ID not found`);
        }

        // Update stock
        await transaction.product.update({
          where: { id: item.productId },
          data: { stockQty: { decrement: item.qty } },
        });

        // Create Sale Item
        const saleItem = await transaction.saleItem.create({
          data: {
            saleId,
            productId: item.productId,
            qty: item.qty,
            productPrice: item.productPrice,
            productName: item.productName,
            productImage: item.productImage,
          },
        });

        items.push(saleItem);
      }

      return items;
    });

    return res.status(201).json({
      message: "Sale items created successfully",
      data: createdItems,
      error: null,
    });
  } catch (error) {
    console.log("Transaction error ", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
