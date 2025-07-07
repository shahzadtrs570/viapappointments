/*
  Warnings:

  - You are about to drop the column `emailHash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_emailHash_key";

-- AlterTable
ALTER TABLE "CompletionStatus" ALTER COLUMN "details" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "initialPaymentAmount" SET DATA TYPE TEXT,
ALTER COLUMN "monthlyPaymentAmount" SET DATA TYPE TEXT,
ALTER COLUMN "indexationRate" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" SET DATA TYPE TEXT,
ALTER COLUMN "offerData" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PropertyDashboardStatus" ALTER COLUMN "stageProgress" DROP DEFAULT,
ALTER COLUMN "stageProgress" SET DATA TYPE TEXT,
ALTER COLUMN "statusData" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailHash";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
