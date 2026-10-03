-- Enums
CREATE TYPE "InvoiceStatus"   AS ENUM ('DRAFT','ISSUED','PARTIALLY_PAID','PAID','CANCELLED');
CREATE TYPE "PaymentMethod"   AS ENUM ('CASH','CARD','BKASH','NAGAD','ROCKET','BANK_TRANSFER','OTHER');
CREATE TYPE "InvoiceItemType" AS ENUM ('CONSULTATION','TEST','PROCEDURE','SURGERY','MEDICINE','OTHER');

-- invoices
CREATE TABLE "invoices" (
  "id"            TEXT        NOT NULL,
  "invoiceNo"     TEXT        NOT NULL,
  "patientId"     TEXT,
  "patientName"   TEXT        NOT NULL,
  "patientPhone"  TEXT        NOT NULL,
  "patientAge"    INTEGER,
  "visitId"       TEXT,
  "appointmentId" TEXT,
  "doctorId"      TEXT,
  "subtotal"      DOUBLE PRECISION NOT NULL DEFAULT 0,
  "discountType"  TEXT        NOT NULL DEFAULT 'FLAT',
  "discountValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "discountAmt"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalAmount"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "paidAmount"    DOUBLE PRECISION NOT NULL DEFAULT 0,
  "dueAmount"     DOUBLE PRECISION NOT NULL DEFAULT 0,
  "status"        "InvoiceStatus"  NOT NULL DEFAULT 'DRAFT',
  "notes"         TEXT,
  "issuedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy"     TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "invoices" ADD CONSTRAINT "invoices_invoiceNo_key" UNIQUE ("invoiceNo");
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_visitId_key"   UNIQUE ("visitId");
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_appointmentId_key" UNIQUE ("appointmentId");

CREATE INDEX "invoices_patientId_idx" ON "invoices"("patientId");
CREATE INDEX "invoices_status_idx"    ON "invoices"("status");
CREATE INDEX "invoices_issuedAt_idx"  ON "invoices"("issuedAt");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='invoices_patientId_fkey') THEN
    ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patientId_fkey"
      FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='invoices_visitId_fkey') THEN
    ALTER TABLE "invoices" ADD CONSTRAINT "invoices_visitId_fkey"
      FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE SET NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='invoices_appointmentId_fkey') THEN
    ALTER TABLE "invoices" ADD CONSTRAINT "invoices_appointmentId_fkey"
      FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='invoices_doctorId_fkey') THEN
    ALTER TABLE "invoices" ADD CONSTRAINT "invoices_doctorId_fkey"
      FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL;
  END IF;
END $$;

-- invoice_items
CREATE TABLE "invoice_items" (
  "id"          TEXT    NOT NULL,
  "invoiceId"   TEXT    NOT NULL,
  "type"        "InvoiceItemType" NOT NULL DEFAULT 'OTHER',
  "description" TEXT    NOT NULL,
  "quantity"    INTEGER NOT NULL DEFAULT 1,
  "unitPrice"   DOUBLE PRECISION NOT NULL,
  "totalPrice"  DOUBLE PRECISION NOT NULL,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey"
  FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE;

-- payments
CREATE TABLE "payments" (
  "id"            TEXT    NOT NULL,
  "invoiceId"     TEXT    NOT NULL,
  "amount"        DOUBLE PRECISION NOT NULL,
  "method"        "PaymentMethod" NOT NULL DEFAULT 'CASH',
  "transactionId" TEXT,
  "note"          TEXT,
  "paidAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "receivedBy"    TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payments_invoiceId_idx" ON "payments"("invoiceId");

ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey"
  FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE;
