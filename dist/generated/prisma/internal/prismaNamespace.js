"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.ProductScalarFieldEnum = exports.CategoryScalarFieldEnum = exports.BrandScalarFieldEnum = exports.UnitScalarFieldEnum = exports.SupplierScalarFieldEnum = exports.ShopScalarFieldEnum = exports.UserScalarFieldEnum = exports.CustomerScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.0.1",
    engine: "f09f2815f091dbba658cdcd2264306d88bb5bda6"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Customer: 'Customer',
    User: 'User',
    Shop: 'Shop',
    Supplier: 'Supplier',
    Unit: 'Unit',
    Brand: 'Brand',
    Category: 'Category',
    Product: 'Product'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.CustomerScalarFieldEnum = {
    id: 'id',
    customerType: 'customerType',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    gender: 'gender',
    country: 'country',
    location: 'location',
    maxCreditLimit: 'maxCreditLimit',
    maxCreditDays: 'maxCreditDays',
    taxPin: 'taxPin',
    dob: 'dob',
    email: 'email',
    NIN: 'NIN',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    username: 'username',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    dob: 'dob',
    gender: 'gender',
    image: 'image',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ShopScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    adminId: 'adminId',
    attendantIds: 'attendantIds'
};
exports.SupplierScalarFieldEnum = {
    id: 'id',
    supplierType: 'supplierType',
    name: 'name',
    contactPerson: 'contactPerson',
    phone: 'phone',
    email: 'email',
    location: 'location',
    country: 'country',
    website: 'website',
    taxPin: 'taxPin',
    regNumber: 'regNumber',
    bankAccountNumber: 'bankAccountNumber',
    bankName: 'bankName',
    paymentTerms: 'paymentTerms',
    logo: 'logo',
    rating: 'rating',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.UnitScalarFieldEnum = {
    id: 'id',
    name: 'name',
    abbreviation: 'abbreviation',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BrandScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProductScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    slug: 'slug',
    batchNumber: 'batchNumber',
    barCode: 'barCode',
    image: 'image',
    tax: 'tax',
    alertQty: 'alertQty',
    stockQty: 'stockQty',
    price: 'price',
    buyingPrice: 'buyingPrice',
    sku: 'sku',
    productCode: 'productCode',
    supplierId: 'supplierId',
    unitId: 'unitId',
    brandId: 'brandId',
    categoryId: 'categoryId',
    expiryDate: 'expiryDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
