-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('GENERAL', 'CATARACT', 'PHACO', 'GLAUCOMA', 'RETINA', 'CORNEA', 'PEDIATRIC', 'DIABETIC', 'EXAMINATION', 'OTHER');

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL DEFAULT 'OTHER',
    "nameBn" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "shortDescBn" TEXT NOT NULL,
    "shortDescEn" TEXT NOT NULL,
    "fullDescBn" TEXT NOT NULL,
    "fullDescEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '👁️',
    "image" TEXT,
    "doctorId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
