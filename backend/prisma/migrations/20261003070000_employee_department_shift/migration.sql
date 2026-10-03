-- Drop old employees table (no data yet)
DROP TABLE IF EXISTS "attendances";
DROP TABLE IF EXISTS "employees";

-- departments
CREATE TABLE "departments" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- shifts
CREATE TABLE "shifts" (
    "id"          TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "startTime"   TEXT NOT NULL,
    "endTime"     TEXT NOT NULL,
    "description" TEXT,
    "isActive"    BOOLEAN NOT NULL DEFAULT true,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "shifts_name_key" ON "shifts"("name");

-- employees (new full schema)
CREATE TABLE "employees" (
    "id"            TEXT NOT NULL,
    "employeeId"    TEXT NOT NULL,
    "userId"        TEXT,
    "nameBn"        TEXT NOT NULL,
    "nameEn"        TEXT NOT NULL,
    "photo"         TEXT,
    "phone"         TEXT NOT NULL,
    "email"         TEXT,
    "gender"        "Gender" NOT NULL DEFAULT 'OTHER',
    "dateOfBirth"   TIMESTAMP(3),
    "departmentId"  TEXT,
    "designationBn" TEXT NOT NULL,
    "designationEn" TEXT NOT NULL,
    "shiftId"       TEXT,
    "joiningDate"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address"       TEXT,
    "basicSalary"   DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allowances"    DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deductions"    DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive"      BOOLEAN NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "employees_employeeId_key" ON "employees"("employeeId");
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey"
    FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "employees" ADD CONSTRAINT "employees_shiftId_fkey"
    FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- attendances (recreate with new employeeId FK)
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

-- Seed default departments
INSERT INTO "departments" ("id","name","description","createdAt","updatedAt") VALUES
  ('dept-admin',     'Administration',  'Hospital administration',    NOW(), NOW()),
  ('dept-medical',   'Medical',         'Medical staff',              NOW(), NOW()),
  ('dept-nursing',   'Nursing',         'Nursing staff',              NOW(), NOW()),
  ('dept-reception', 'Reception',       'Front desk and reception',   NOW(), NOW()),
  ('dept-accounts',  'Accounts',        'Finance and accounts',       NOW(), NOW()),
  ('dept-it',        'IT',              'Information technology',     NOW(), NOW()),
  ('dept-security',  'Security',        'Security personnel',         NOW(), NOW()),
  ('dept-cleaning',  'Cleaning',        'Cleaning and maintenance',   NOW(), NOW());

-- Seed default shifts
INSERT INTO "shifts" ("id","name","startTime","endTime","description","createdAt","updatedAt") VALUES
  ('shift-morning',  'Morning',  '08:00', '16:00', 'Morning shift',  NOW(), NOW()),
  ('shift-evening',  'Evening',  '16:00', '22:00', 'Evening shift',  NOW(), NOW()),
  ('shift-night',    'Night',    '22:00', '08:00', 'Night shift',    NOW(), NOW()),
  ('shift-general',  'General',  '09:00', '17:00', 'General shift',  NOW(), NOW());
