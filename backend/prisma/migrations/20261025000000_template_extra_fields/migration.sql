-- Add extra clinical fields to prescription_templates
ALTER TABLE "prescription_templates"
  ADD COLUMN IF NOT EXISTS "chiefComplaint" TEXT,
  ADD COLUMN IF NOT EXISTS "history"        TEXT,
  ADD COLUMN IF NOT EXISTS "followUpNote"   TEXT,
  ADD COLUMN IF NOT EXISTS "followUpDays"   INTEGER;
