-- AttendanceStatus enum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'LEAVE', 'HOLIDAY');

-- employees table
CREATE TABLE "employees" (
    "id"            TEXT NOT NULL,
    "userId"        TEXT,
    "nameBn"        TEXT NOT NULL,
    "nameEn"        TEXT NOT NULL,
    "designationBn" TEXT NOT NULL,
    "designationEn" TEXT NOT NULL,
    "department"    TEXT NOT NULL DEFAULT 'General',
    "phone"         TEXT,
    "joiningDate"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- attendances table
CREATE TABLE "attendances" (
    "id"         TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date"       DATE NOT NULL,
    "status"     "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "checkIn"    TIMESTAMP(3),
    "checkOut"   TIMESTAMP(3),
    "note"       TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "attendances_employeeId_date_key" ON "attendances"("employeeId", "date");

ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employeeId_fkey"
    FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- patients table
CREATE TABLE "patients" (
    "id"        TEXT NOT NULL,
    "nameBn"    TEXT NOT NULL,
    "nameEn"    TEXT NOT NULL,
    "phone"     TEXT NOT NULL,
    "email"     TEXT,
    "age"       INTEGER,
    "gender"    "Gender" NOT NULL DEFAULT 'OTHER',
    "address"   TEXT,
    "isActive"  BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);
