CREATE TABLE "attendance_settings" (
  "id"                     TEXT NOT NULL DEFAULT 'default',
  "officeStartTime"        TEXT NOT NULL DEFAULT '09:00',
  "officeEndTime"          TEXT NOT NULL DEFAULT '17:00',
  "gracePeriodMinutes"     INTEGER NOT NULL DEFAULT 10,
  "lateThresholdMinutes"   INTEGER NOT NULL DEFAULT 30,
  "earlyCheckoutMinutes"   INTEGER NOT NULL DEFAULT 30,
  "workingDays"            TEXT[] NOT NULL DEFAULT ARRAY['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'],
  "weekends"               TEXT[] NOT NULL DEFAULT ARRAY['Friday'],
  "updatedAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "attendance_settings_pkey" PRIMARY KEY ("id")
);

-- Insert default settings row
INSERT INTO "attendance_settings" ("id") VALUES ('default') ON CONFLICT DO NOTHING;
