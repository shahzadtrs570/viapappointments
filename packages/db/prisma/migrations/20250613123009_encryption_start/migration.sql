/*
  Warnings:

  - Added the required column `userId` to the `ApplicationReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `documentType` on the `PropertyDocument` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `email` to the `SellerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationReviewStatus" AS ENUM ('PENDING', 'PROCESSING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "ApplicationReview" ADD COLUMN     "status" "ApplicationReviewStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "leaseLength" TEXT,
ADD COLUMN     "showDocumentUpload" BOOLEAN,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "yearBuilt" TEXT;

-- AlterTable
ALTER TABLE "PropertyAddress" ADD COLUMN     "addressData" JSONB;

-- AlterTable
ALTER TABLE "PropertyDocument" DROP COLUMN "documentType",
ADD COLUMN     "documentType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Eligibility" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isEligible" BOOLEAN,
    "age" TEXT,
    "ownership" TEXT,
    "propertyType" TEXT,
    "mainResidence" TEXT,
    "financialGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "country" TEXT,
    "propertyOwnership" TEXT,
    "jointOwnership" TEXT,
    "spouseAge" TEXT,
    "childrenHeirs" TEXT,
    "inheritanceImportance" TEXT,
    "confidentUnderstanding" TEXT,
    "discussOptions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Eligibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Eligibility_userId_key" ON "Eligibility"("userId");

-- CreateIndex
CREATE INDEX "Eligibility_userId_idx" ON "Eligibility"("userId");

-- CreateIndex
CREATE INDEX "ApplicationReview_userId_idx" ON "ApplicationReview"("userId");

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "Property"("userId");

-- CreateIndex
CREATE INDEX "PropertyDocument_documentType_idx" ON "PropertyDocument"("documentType");

-- AddForeignKey
ALTER TABLE "Eligibility" ADD CONSTRAINT "Eligibility_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
