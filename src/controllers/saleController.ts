import { generateSaleNumber } from "../utils/generateSaleNumber";
import { db } from "../db/db";
import { Request, Response } from "express";
import { SaleRequestBody } from "../types/saleTypes";

export const createSale = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      shopId,
      saleAmount,
      balanceAmount,
      paidAmount,
      saleType,
      paymentMethod,
      transactionCode,
      saleItems,
    }: SaleRequestBody = req.body;

    const saleId = await db.$transaction(
      async (transaction) => {
        // Handle credit validation if there's a balance
        if (balanceAmount > 0) {
          const existingCustomer = await transaction.customer.findUnique({
            where: { id: customerId },
          });

          if (!existingCustomer) {
            throw new Error("Customer not found");
          }

          if (balanceAmount > existingCustomer.maxCreditLimit) {
            throw new Error("Customer not eligible for credit");
          }

          // Update customer credit
          await transaction.customer.update({
            where: { id: customerId },
            data: {
              unpaidCreditAmount:
                existingCustomer.unpaidCreditAmount + balanceAmount,
              maxCreditLimit: { decrement: balanceAmount },
            },
          });
        }

        // Create the Sale
        const sale = await transaction.sale.create({
          data: {
            customerId,
            customerName,
            customerEmail,
            shopId,
            saleNumber: generateSaleNumber(),
            saleAmount,
            balanceAmount,
            paidAmount,
            saleType,
            paymentMethod,
            transactionCode,
          },
        });

        // Create Sale Items and update stock
        if (saleItems && saleItems.length > 0) {
          for (const item of saleItems) {
            await transaction.product.update({
              where: { id: item.productId },
              data: { stockQty: { decrement: item.qty } },
            });

            await transaction.saleItem.create({
              data: {
                saleId: sale.id,
                productId: item.productId,
                qty: item.qty,
                productPrice: item.productPrice,
                productName: item.productName,
                productImage: item.productImage,
              },
            });
          }
        }

        return sale.id;
      },
      {
        maxWait: 10000, // 10 seconds
        timeout: 20000, // 20 seconds
      }
    );

    // Fetch the complete sale with items
    const sale = await db.sale.findUnique({
      where: { id: saleId },
      include: { saleItems: true },
    });

    return res.status(201).json({
      message: "Sale created successfully",
      data: sale,
      error: null,
    });
  } catch (error) {
    console.log("Transaction error:", error);

    // Handle specific errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const statusCode = errorMessage.includes("not found")
      ? 404
      : errorMessage.includes("not eligible")
      ? 400
      : 500;

    return res.status(statusCode).json({
      message: errorMessage,
      error: errorMessage,
      data: null,
    });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await db.sale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        saleItems: true,
      },
    });

    return res.status(200).json({
      data: sales,
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
