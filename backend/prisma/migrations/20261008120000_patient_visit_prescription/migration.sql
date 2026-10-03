-- AlterTable patients: add new columns
ALTER TABLE "patients"
  ADD COLUMN IF NOT EXISTS "patientId"        TEXT,
  ADD COLUMN IF NOT EXISTS "emergencyContact" TEXT,
  ADD COLUMN IF NOT EXISTS "medicalHistory"   TEXT,
  ADD COLUMN IF NOT EXISTS "notes"            TEXT,
  ADD COLUMN IF NOT EXISTS "registeredBy"     TEXT;

-- Backfill patientId for existing rows using a subquery approach
UPDATE "patients" p
SET "patientId" = 'PAT-LEGACY-' || LPAD(CAST(sub.rn AS TEXT), 4, '0')
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt") AS rn FROM "patients"
) sub
WHERE p.id = sub.id AND p."patientId" IS NULL;

-- Make patientId NOT NULL
ALTER TABLE "patients" ALTER COLUMN "patientId" SET NOT NULL;

-- Add UNIQUE constraint (drop first if exists to be safe)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'patients_patientId_key'
  ) THEN
    ALTER TABLE "patients" ADD CONSTRAINT "patients_patientId_key" UNIQUE ("patientId");
  END IF;
END $$;

-- Alter address to TEXT (safe if already text)
ALTER TABLE "patients" ALTER COLUMN "address" TYPE TEXT USING "address"::TEXT;

-- Add indexes
CREATE INDEX IF NOT EXISTS "patients_phone_idx" ON "patients"("phone");
CREATE INDEX IF NOT EXISTS "patients_patientId_idx" ON "patients"("patientId");

-- CreateTable visits
CREATE TABLE IF NOT EXISTS "visits" (
  "id"             TEXT NOT NULL,
  "patientId"      TEXT NOT NULL,
  "visitDate"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "chiefComplaint" TEXT,
  "diagnosis"      TEXT,
  "treatment"      TEXT,
  "doctorId"       TEXT,
  "followUpDate"   TIMESTAMP(3),
  "notes"          TEXT,
  "createdBy"      TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "visits_patientId_idx" ON "visits"("patientId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'visits_patientId_fkey') THEN
    ALTER TABLE "visits" ADD CONSTRAINT "visits_patientId_fkey"
      FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'visits_doctorId_fkey') THEN
    ALTER TABLE "visits" ADD CONSTRAINT "visits_doctorId_fkey"
      FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable prescriptions
CREATE TABLE IF NOT EXISTS "prescriptions" (
  "id"           TEXT NOT NULL,
  "patientId"    TEXT NOT NULL,
  "visitId"      TEXT,
  "doctorId"     TEXT,
  "medicines"    JSONB NOT NULL DEFAULT '[]',
  "instructions" TEXT,
  "followUpDate" TIMESTAMP(3),
  "createdBy"    TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "prescriptions_patientId_idx" ON "prescriptions"("patientId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescriptions_patientId_fkey') THEN
    ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey"
      FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescriptions_visitId_fkey') THEN
    ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_visitId_fkey"
      FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescriptions_doctorId_fkey') THEN
    ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey"
      FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
