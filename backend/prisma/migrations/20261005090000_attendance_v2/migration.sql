-- Drop old attendance table and recreate with full schema
DROP TABLE IF EXISTS "attendances";

CREATE TABLE "attendances" (
  "id"                    TEXT NOT NULL,
  "userId"                TEXT NOT NULL,
  "date"                  DATE NOT NULL,
  "status"                "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',

  -- Check-in
  "checkIn"               TIMESTAMP(3),
  "checkInSelfie"         TEXT,
  "checkInLatitude"       DOUBLE PRECISION,
  "checkInLongitude"      DOUBLE PRECISION,

  -- Check-out
  "checkOut"              TIMESTAMP(3),
  "checkOutSelfie"        TEXT,
  "checkOutLatitude"      DOUBLE PRECISION,
  "checkOutLongitude"     DOUBLE PRECISION,

  -- Computed
  "lateMinutes"           INTEGER NOT NULL DEFAULT 0,
  "earlyCheckoutMinutes"  INTEGER NOT NULL DEFAULT 0,
  "workingMinutes"        INTEGER NOT NULL DEFAULT 0,

  "note"                  TEXT,
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "attendances_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "attendances_userId_date_key" UNIQUE ("userId", "date"),
  CONSTRAINT "attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
