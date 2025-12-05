import { PaymentMethod, SaleType } from "@/generated/prisma/enums";
import { SaleItem } from "./saleItemTypes";

export interface SaleRequestBody {
  customerId: string;
  customerName: string;
  customerEmail: string;
  shopId: string;
  saleNumber?: string;
  saleAmount: number;
  balanceAmount: number;
  paidAmount: number;
  saleType: SaleType;
  saleItems: SaleItem[];
  paymentMethod: PaymentMethod;
  transactionCode: string;
}
