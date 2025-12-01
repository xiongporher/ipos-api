import express, { Request, Response } from "express";
import cors from "cors";
import customerRouter from "./routes/customerRoutes";
import userRouter from "./routes/userRoutes";
import shopRouter from "./routes/shopRoutes";
import supplierRouter from "./routes/supplierRoutes";
import authRouter from "./routes/authRoutes";
import unitRouter from "./routes/unitRoutes";
import brandRouter from "./routes/brandRoutes";
import categoryRouter from "./routes/categoryRoutes";
import productRouter from "./routes/productRoutes";
require("dotenv").config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Server is running",
  });
});

app.use("/api/v1", customerRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", shopRouter);
app.use("/api/v1", supplierRouter);
app.use("/api/v1", authRouter);
app.use("/api/v1", unitRouter);
app.use("/api/v1", brandRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", productRouter);
