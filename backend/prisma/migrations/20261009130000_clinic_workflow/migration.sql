-- Add appointmentId to visits
ALTER TABLE "visits"
  ADD COLUMN IF NOT EXISTS "appointmentId" TEXT;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'visits_appointmentId_key') THEN
    ALTER TABLE "visits" ADD CONSTRAINT "visits_appointmentId_key" UNIQUE ("appointmentId");
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'visits_appointmentId_fkey') THEN
    ALTER TABLE "visits" ADD CONSTRAINT "visits_appointmentId_fkey"
      FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "visits_doctorId_idx" ON "visits"("doctorId");

-- Alter prescriptions: drop medicines JSON, add structured columns
ALTER TABLE "prescriptions"
  ADD COLUMN IF NOT EXISTS "diagnosis"   TEXT,
  ADD COLUMN IF NOT EXISTS "doctorNotes" TEXT;

CREATE INDEX IF NOT EXISTS "prescriptions_doctorId_idx" ON "prescriptions"("doctorId");

-- CreateTable prescription_items
CREATE TABLE IF NOT EXISTS "prescription_items" (
  "id"             TEXT NOT NULL,
  "prescriptionId" TEXT NOT NULL,
  "medicineName"   TEXT NOT NULL,
  "dose"           TEXT,
  "frequency"      TEXT,
  "duration"       TEXT,
  "instructions"   TEXT,
  "sortOrder"      INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "prescription_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "prescription_items_prescriptionId_idx" ON "prescription_items"("prescriptionId");

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prescription_items_prescriptionId_fkey') THEN
    ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescriptionId_fkey"
      FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Migrate existing medicines JSON → prescription_items rows
INSERT INTO "prescription_items" ("id", "prescriptionId", "medicineName", "dose", "frequency", "duration", "sortOrder")
SELECT
  gen_random_uuid()::text,
  p.id,
  COALESCE(m->>'name', 'Unknown'),
  m->>'dose',
  m->>'frequency',
  m->>'duration',
  (ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY ordinality) - 1)::int
FROM "prescriptions" p,
     jsonb_array_elements(COALESCE(p."medicines", '[]'::jsonb)) WITH ORDINALITY AS t(m, ordinality)
WHERE jsonb_array_length(COALESCE(p."medicines", '[]'::jsonb)) > 0;
