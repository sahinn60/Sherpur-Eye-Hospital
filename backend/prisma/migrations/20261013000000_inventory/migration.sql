-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM (
  'MEDICINE', 'SURGICAL', 'OPTICAL', 'DIAGNOSTIC', 'CONSUMABLE', 'EQUIPMENT', 'OTHER'
);

CREATE TYPE "StockHistoryType" AS ENUM (
  'PURCHASE', 'ADJUSTMENT', 'DISPENSED', 'EXPIRED', 'RETURNED', 'DAMAGED'
);

-- CreateTable: Suppliers
CREATE TABLE "inventory_suppliers" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "contactName" TEXT,
    "phone"       TEXT,
    "email"       TEXT,
    "address"     TEXT,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Inventory Items
CREATE TABLE "inventory_items" (
    "id"            TEXT NOT NULL,
    "sku"           TEXT NOT NULL,
    "name"          TEXT NOT NULL,
    "nameBn"        TEXT NOT NULL,
    "category"      "InventoryCategory" NOT NULL DEFAULT 'OTHER',
    "supplierId"    TEXT,
    "unit"          TEXT NOT NULL DEFAULT 'pcs',
    "purchasePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sellingPrice"  DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stockQty"      INTEGER NOT NULL DEFAULT 0,
    "minStock"      INTEGER NOT NULL DEFAULT 5,
    "expiryDate"    DATE,
    "description"   TEXT,
    "isActive"      BOOLEAN NOT NULL DEFAULT true,
    "createdBy"     TEXT,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inventory_items_sku_key"        ON "inventory_items"("sku");
CREATE INDEX "inventory_items_category_idx"          ON "inventory_items"("category");
CREATE INDEX "inventory_items_supplierId_idx"        ON "inventory_items"("supplierId");
CREATE INDEX "inventory_items_expiryDate_idx"        ON "inventory_items"("expiryDate");

-- CreateTable: Stock History
CREATE TABLE "stock_history" (
    "id"        TEXT NOT NULL,
    "itemId"    TEXT NOT NULL,
    "type"      "StockHistoryType" NOT NULL DEFAULT 'PURCHASE',
    "quantity"  INTEGER NOT NULL,
    "qtyBefore" INTEGER NOT NULL,
    "qtyAfter"  INTEGER NOT NULL,
    "unitCost"  DOUBLE PRECISION,
    "note"      TEXT,
    "refId"     TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_history_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "stock_history_itemId_idx"    ON "stock_history"("itemId");
CREATE INDEX "stock_history_createdAt_idx" ON "stock_history"("createdAt");

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_supplierId_fkey"
  FOREIGN KEY ("supplierId") REFERENCES "inventory_suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_itemId_fkey"
  FOREIGN KEY ("itemId") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
