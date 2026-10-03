CREATE TYPE "IncomeCategory"  AS ENUM ('CONSULTATION','TEST','SURGERY','PROCEDURE','MEDICINE','OTHER');
CREATE TYPE "ExpenseCategory" AS ENUM ('SALARY','EQUIPMENT','MEDICINE','ELECTRICITY','MAINTENANCE','RENT','CLEANING','FOOD','OTHER');

CREATE TABLE "income_entries" (
  "id"          TEXT             NOT NULL,
  "category"    "IncomeCategory" NOT NULL DEFAULT 'OTHER',
  "description" TEXT             NOT NULL,
  "amount"      DOUBLE PRECISION NOT NULL,
  "invoiceId"   TEXT,
  "date"        DATE             NOT NULL,
  "note"        TEXT,
  "createdBy"   TEXT,
  "createdAt"   TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "income_entries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "income_entries_date_idx"     ON "income_entries"("date");
CREATE INDEX "income_entries_category_idx" ON "income_entries"("category");

CREATE TABLE "expense_entries" (
  "id"          TEXT              NOT NULL,
  "category"    "ExpenseCategory" NOT NULL DEFAULT 'OTHER',
  "description" TEXT              NOT NULL,
  "amount"      DOUBLE PRECISION  NOT NULL,
  "date"        DATE              NOT NULL,
  "note"        TEXT,
  "attachment"  TEXT,
  "createdBy"   TEXT,
  "createdAt"   TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "expense_entries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "expense_entries_date_idx"     ON "expense_entries"("date");
CREATE INDEX "expense_entries_category_idx" ON "expense_entries"("category");
