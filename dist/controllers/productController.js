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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const db_1 = require("../db/db");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, description, batchNumber, barCode, image, tax, alertQty, stockQty, price, buyingPrice, sku, productCode, supplierId, unitId, brandId, categoryId, expiryDate, } = req.body;
        if (!name ||
            !slug ||
            !sku ||
            !productCode ||
            !supplierId ||
            !unitId ||
            !brandId ||
            !categoryId ||
            !expiryDate) {
            return res.status(400).json({
                message: "Missing required fields",
                data: null,
            });
        }
        const [existingUnit, existingBrand, existingCategory, existingSupplier, existingProductBySlug, existingProductBySku, existingProductByCode, existingProductByBarCode,] = yield Promise.all([
            db_1.db.unit.findUnique({ where: { id: unitId } }),
            db_1.db.brand.findUnique({ where: { id: brandId } }),
            db_1.db.category.findUnique({ where: { id: categoryId } }),
            db_1.db.supplier.findUnique({ where: { id: supplierId } }),
            db_1.db.product.findUnique({ where: { slug } }),
            db_1.db.product.findUnique({ where: { sku } }),
            db_1.db.product.findUnique({ where: { productCode } }),
            barCode
                ? db_1.db.product.findUnique({ where: { barCode } })
                : Promise.resolve(null),
        ]);
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
        const newProduct = yield db_1.db.product.create({
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
    }
    catch (error) {
        console.log("Something went wrong:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield db_1.db.product.findMany({
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
    }
    catch (error) {
        console.log("Something went wrong:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Product ID is required",
                data: null,
            });
        }
        const existingProduct = yield db_1.db.product.findUnique({
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
    }
    catch (error) {
        console.log("Something went wrong:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getProductById = getProductById;
const updateProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, slug, description, batchNumber, barCode, image, tax, alertQty, stockQty, price, buyingPrice, sku, productCode, supplierId, unitId, brandId, categoryId, expiryDate, } = req.body;
        if (!name &&
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
            !expiryDate) {
            return res.status(400).json({
                message: "No fields to update",
                data: null,
            });
        }
        const existingProduct = yield db_1.db.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
                data: null,
            });
        }
        if (slug && slug !== existingProduct.slug) {
            const existingProductBySlug = yield db_1.db.product.findUnique({
                where: { slug },
            });
            if (existingProductBySlug) {
                return res.status(409).json({
                    message: "Product with this slug already exists",
                    data: null,
                });
            }
        }
        if (sku && sku !== existingProduct.sku) {
            const existingProductBySku = yield db_1.db.product.findUnique({
                where: { sku },
            });
            if (existingProductBySku) {
                return res.status(409).json({
                    message: "Product with this SKU already exists",
                    data: null,
                });
            }
        }
        if (productCode && productCode !== existingProduct.productCode) {
            const existingProductByCode = yield db_1.db.product.findUnique({
                where: { productCode }
            });
            if (existingProductByCode) {
                return res.status(409).json({
                    message: "Product with this product code already exists",
                    data: null,
                });
            }
        }
        if (barCode && barCode !== existingProduct.barCode) {
            const existingProductByBarCode = yield db_1.db.product.findUnique({
                where: { barCode }
            });
            if (existingProductByBarCode) {
                return res.status(409).json({
                    message: "Product with this barcode already exists",
                    data: null,
                });
            }
        }
        const updatedProduct = yield db_1.db.product.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (slug && { slug })), (description !== undefined && { description })), (batchNumber !== undefined && { batchNumber })), (barCode !== undefined && { barCode })), (image !== undefined && { image: parseInt(image) })), (tax !== undefined && { tax })), (alertQty && { alertQty: parseInt(alertQty) })), (stockQty && { stockQty: parseInt(stockQty) })), (price && { price: parseInt(price) })), (buyingPrice !== undefined && {
                buyingPrice: buyingPrice ? parseInt(buyingPrice) : null,
            })), (sku && { sku })), (productCode && { productCode })), (supplierId && { supplierId })), (unitId && { unitId })), (brandId && { brandId })), (categoryId && { categoryId })), (expiryDate && { expiryDate: new Date(expiryDate) })),
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
    }
    catch (error) {
        console.log("Error updating product:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateProductById = updateProductById;
const deleteProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield db_1.db.product.findUnique({
            where: { id },
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                data: null,
            });
        }
        yield db_1.db.product.delete({
            where: { id },
        });
        return res.status(200).json({
            message: "Product deleted successfully",
            success: true,
            error: null,
        });
    }
    catch (error) {
        console.log("Error deleting product:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteProductById = deleteProductById;
