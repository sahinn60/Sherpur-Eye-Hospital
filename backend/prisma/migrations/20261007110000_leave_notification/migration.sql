-- Leave type enum
CREATE TYPE "LeaveType" AS ENUM (
  'CASUAL', 'SICK', 'ANNUAL', 'MATERNITY', 'PATERNITY',
  'UNPAID', 'EMERGENCY', 'OTHER'
);

-- Leave status enum
CREATE TYPE "LeaveStatus" AS ENUM (
  'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
);

-- Notification type enum
CREATE TYPE "NotificationType" AS ENUM (
  'LEAVE_APPLIED', 'LEAVE_APPROVED', 'LEAVE_REJECTED',
  'LEAVE_CANCELLED', 'GENERAL'
);

-- Leave requests table
CREATE TABLE "leave_requests" (
  "id"           TEXT NOT NULL,
  "userId"       TEXT NOT NULL,
  "leaveType"    "LeaveType" NOT NULL DEFAULT 'CASUAL',
  "startDate"    DATE NOT NULL,
  "endDate"      DATE NOT NULL,
  "totalDays"    INTEGER NOT NULL DEFAULT 1,
  "reason"       TEXT NOT NULL,
  "attachment"   TEXT,
  "status"       "LeaveStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedBy"   TEXT,
  "reviewedAt"   TIMESTAMP(3),
  "reviewNote"   TEXT,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "leave_requests_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "leave_requests_reviewedBy_fkey"
    FOREIGN KEY ("reviewedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "leave_requests_userId_idx"  ON "leave_requests"("userId");
CREATE INDEX "leave_requests_status_idx"  ON "leave_requests"("status");
CREATE INDEX "leave_requests_startDate_idx" ON "leave_requests"("startDate");

-- Notifications table
CREATE TABLE "notifications" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "type"      "NotificationType" NOT NULL DEFAULT 'GENERAL',
  "titleBn"   TEXT NOT NULL,
  "bodyBn"    TEXT NOT NULL,
  "isRead"    BOOLEAN NOT NULL DEFAULT false,
  "refId"     TEXT,
  "refType"   TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notifications_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");
