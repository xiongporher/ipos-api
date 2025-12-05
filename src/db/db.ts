import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({
  adapter,
  transactionOptions: {
    maxWait: 10000, // Default is 2000ms, increase to 10s
    timeout: 20000, // Default is 5000ms, increase to 20s
  },
});

export { db };
