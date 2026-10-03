-- CreateEnum
CREATE TYPE "SurgeryStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "surgeries" (
    "id"           TEXT NOT NULL,
    "surgeryNo"    TEXT NOT NULL,
    "patientId"    TEXT NOT NULL,
    "doctorId"     TEXT NOT NULL,
    "surgeryType"  TEXT NOT NULL,
    "otDate"       DATE NOT NULL,
    "otTime"       TEXT NOT NULL,
    "status"       "SurgeryStatus" NOT NULL DEFAULT 'SCHEDULED',
    "preOpNotes"   TEXT,
    "postOpNotes"  TEXT,
    "followUpDate" DATE,
    "anaesthesia"  TEXT,
    "eye"          TEXT,
    "notes"        TEXT,
    "createdBy"    TEXT,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surgeries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "surgeries_surgeryNo_key" ON "surgeries"("surgeryNo");
CREATE INDEX "surgeries_patientId_idx" ON "surgeries"("patientId");
CREATE INDEX "surgeries_doctorId_idx"  ON "surgeries"("doctorId");
CREATE INDEX "surgeries_otDate_idx"    ON "surgeries"("otDate");
CREATE INDEX "surgeries_status_idx"    ON "surgeries"("status");

-- AddForeignKey
ALTER TABLE "surgeries" ADD CONSTRAINT "surgeries_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "surgeries" ADD CONSTRAINT "surgeries_doctorId_fkey"
  FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
