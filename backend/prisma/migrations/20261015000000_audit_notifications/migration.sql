-- Extend NotificationType enum with new values
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'APPOINTMENT_NEW';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'APPOINTMENT_CONFIRMED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'APPOINTMENT_CANCELLED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'ATTENDANCE_LATE';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'ATTENDANCE_ABSENT';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'HOSPITAL_NOTICE';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'SYSTEM';

-- Audit log table
CREATE TABLE "audit_logs" (
  "id"         TEXT        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"     TEXT,
  "userName"   TEXT        NOT NULL DEFAULT '',
  "userRole"   TEXT        NOT NULL DEFAULT '',
  "action"     TEXT        NOT NULL,
  "module"     TEXT        NOT NULL,
  "recordId"   TEXT,
  "recordLabel" TEXT,
  "meta"       JSONB,
  "ipAddress"  TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "audit_logs_userId_idx"   ON "audit_logs"("userId");
CREATE INDEX "audit_logs_module_idx"   ON "audit_logs"("module");
CREATE INDEX "audit_logs_action_idx"   ON "audit_logs"("action");
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
