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
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.0.1",
    "engineVersion": "f09f2815f091dbba658cdcd2264306d88bb5bda6",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../src/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Customer {\n  id             String       @id @default(uuid())\n  customerType   CustomerType\n  firstName      String\n  lastName       String\n  phone          String       @unique\n  gender         Gender\n  country        String\n  location       String\n  maxCreditLimit Float\n  maxCreditDays  Int\n  taxPin         String?\n  dob            DateTime?\n  email          String?      @unique\n  NIN            String?      @unique\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n}\n\nenum CustomerType {\n  RETAIL\n  WHOLESALE\n  DISTRIBUTOR\n  OTHER\n}\n\nenum Gender {\n  MALE\n  FEMALE\n}\n\nmodel User {\n  id        String    @id @default(uuid())\n  email     String    @unique\n  username  String    @unique\n  password  String\n  firstName String\n  lastName  String\n  phone     String    @unique\n  dob       DateTime?\n  gender    Gender\n  image     String?\n  role      Role      @default(ATTENDANT)\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  shops     Shop[]\n}\n\nenum Role {\n  ADMIN\n  ATTENDANT\n}\n\nmodel Shop {\n  id           String   @id @default(uuid())\n  name         String\n  slug         String   @unique\n  location     String\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n  adminId      String\n  admin        User     @relation(fields: [adminId], references: [id])\n  attendantIds String[]\n}\n\nmodel Supplier {\n  id                String       @id @default(uuid())\n  supplierType      SupplierType\n  name              String\n  contactPerson     String\n  phone             String       @unique\n  email             String?      @unique\n  location          String\n  country           String\n  website           String?\n  taxPin            String?\n  regNumber         String?      @unique\n  bankAccountNumber String?\n  bankName          String?\n  paymentTerms      String?\n  logo              String?      @default(\"https://d4r1notk17.ufs.sh/f/ajZEQyxNnEuWxYJZz38vsYUrMw3uVtgTP9zR5nWLHbEQf1jd\")\n  rating            Float?\n  notes             String?\n  products          Product[]\n  createdAt         DateTime     @default(now())\n  updatedAt         DateTime     @updatedAt\n}\n\nenum SupplierType {\n  MANUFACTURER\n  DISTRIBUTOR\n  WHOLESALER\n  RETAILER\n  OTHER\n}\n\nmodel Unit {\n  id           String    @id @default(uuid())\n  name         String\n  abbreviation String\n  slug         String    @unique\n  products     Product[]\n  createdAt    DateTime  @default(now())\n  updatedAt    DateTime  @updatedAt\n}\n\nmodel Brand {\n  id        String    @id @default(uuid())\n  name      String\n  slug      String    @unique\n  products  Product[]\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\nmodel Category {\n  id        String    @id @default(uuid())\n  name      String\n  slug      String    @unique\n  products  Product[]\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\nmodel Product {\n  id          String    @id @default(uuid())\n  name        String\n  description String?\n  slug        String    @unique\n  batchNumber String?\n  barCode     String?   @unique\n  image       String?   @default(\"https://d4r1notk17.ufs.sh/f/ajZEQyxNnEuWxYJZz38vsYUrMw3uVtgTP9zR5nWLHbEQf1jd\")\n  tax         String?\n  alertQty    Int\n  stockQty    Int\n  price       Int\n  buyingPrice Int?\n  sku         String    @unique\n  productCode String    @unique\n  supplierId  String\n  unitId      String\n  brandId     String\n  categoryId  String\n  expiryDate  DateTime? @default(\"2025-12-31T00:00:00.000Z\")\n  unit        Unit      @relation(fields: [unitId], references: [id])\n  brand       Brand     @relation(fields: [brandId], references: [id])\n  category    Category  @relation(fields: [categoryId], references: [id])\n  supplier    Supplier  @relation(fields: [supplierId], references: [id])\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"Customer\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerType\",\"kind\":\"enum\",\"type\":\"CustomerType\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"gender\",\"kind\":\"enum\",\"type\":\"Gender\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"maxCreditLimit\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"maxCreditDays\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"taxPin\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dob\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"NIN\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firstName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"lastName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dob\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"gender\",\"kind\":\"enum\",\"type\":\"Gender\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"shops\",\"kind\":\"object\",\"type\":\"Shop\",\"relationName\":\"ShopToUser\"}],\"dbName\":null},\"Shop\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"adminId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"admin\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ShopToUser\"},{\"name\":\"attendantIds\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null},\"Supplier\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplierType\",\"kind\":\"enum\",\"type\":\"SupplierType\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contactPerson\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"website\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"taxPin\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"regNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bankAccountNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bankName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"paymentTerms\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"logo\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToSupplier\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Unit\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"abbreviation\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"ProductToUnit\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Brand\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"BrandToProduct\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Category\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"products\",\"kind\":\"object\",\"type\":\"Product\",\"relationName\":\"CategoryToProduct\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Product\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"slug\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"batchNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"barCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"image\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tax\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"alertQty\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"stockQty\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"buyingPrice\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"sku\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"supplierId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"unitId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"brandId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"unit\",\"kind\":\"object\",\"type\":\"Unit\",\"relationName\":\"ProductToUnit\"},{\"name\":\"brand\",\"kind\":\"object\",\"type\":\"Brand\",\"relationName\":\"BrandToProduct\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"CategoryToProduct\"},{\"name\":\"supplier\",\"kind\":\"object\",\"type\":\"Supplier\",\"relationName\":\"ProductToSupplier\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
function decodeBase64AsWasm(wasmBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Buffer } = yield Promise.resolve().then(() => __importStar(require('node:buffer')));
        const wasmArray = Buffer.from(wasmBase64, 'base64');
        return new WebAssembly.Module(wasmArray);
    });
}
config.compilerWasm = {
    getRuntime: () => __awaiter(void 0, void 0, void 0, function* () { return yield Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_bg.postgresql.js"))); }),
    getQueryCompilerWasmModule: () => __awaiter(void 0, void 0, void 0, function* () {
        const { wasm } = yield Promise.resolve().then(() => __importStar(require("@prisma/client/runtime/query_compiler_bg.postgresql.wasm-base64.js")));
        return yield decodeBase64AsWasm(wasm);
    })
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
