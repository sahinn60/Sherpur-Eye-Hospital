-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "designationBn" TEXT NOT NULL,
    "designationEn" TEXT NOT NULL,
    "qualificationBn" TEXT NOT NULL,
    "qualificationEn" TEXT NOT NULL,
    "specialtyBn" TEXT NOT NULL,
    "specialtyEn" TEXT NOT NULL,
    "experienceBn" TEXT NOT NULL,
    "experienceEn" TEXT NOT NULL,
    "biographyBn" TEXT,
    "biographyEn" TEXT,
    "photo" TEXT,
    "schedule" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_userId_key" ON "doctors"("userId");

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
