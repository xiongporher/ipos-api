"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const shopRoutes_1 = __importDefault(require("./routes/shopRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const unitRoutes_1 = __importDefault(require("./routes/unitRoutes"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 8000;
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        message: "Server is running",
    });
}));
app.use("/api/v1", customerRoutes_1.default);
app.use("/api/v1", userRoutes_1.default);
app.use("/api/v1", shopRoutes_1.default);
app.use("/api/v1", supplierRoutes_1.default);
app.use("/api/v1", authRoutes_1.default);
app.use("/api/v1", unitRoutes_1.default);
app.use("/api/v1", brandRoutes_1.default);
app.use("/api/v1", categoryRoutes_1.default);
app.use("/api/v1", productRoutes_1.default);
