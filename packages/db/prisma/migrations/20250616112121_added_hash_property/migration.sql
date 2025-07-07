/*
  Warnings:

  - A unique constraint covering the columns `[emailHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "ApplicationReview" ALTER COLUMN "checklist" SET DATA TYPE TEXT,
ALTER COLUMN "considerations" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "bedroomCount" SET DATA TYPE TEXT,
ALTER COLUMN "bathroomCount" SET DATA TYPE TEXT,
ALTER COLUMN "totalAreaSqM" SET DATA TYPE TEXT,
ALTER COLUMN "estimatedValue" SET DATA TYPE TEXT,
ALTER COLUMN "confirmedValue" SET DATA TYPE TEXT,
ALTER COLUMN "features" SET NOT NULL,
ALTER COLUMN "features" DROP DEFAULT,
ALTER COLUMN "features" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "emailHash" TEXT,
ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailHash_key" ON "User"("emailHash");
