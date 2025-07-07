/*
  Warnings:

  - You are about to drop the column `occupancyRight` on the `Offer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_sellerProfileId_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "occupancyRight",
ADD COLUMN     "expirationDate" TIMESTAMP(3),
ADD COLUMN     "isProvisional" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "offerData" JSONB,
ADD COLUMN     "referenceNumber" TEXT,
ADD COLUMN     "responseId" TEXT;

-- CreateTable
CREATE TABLE "PropertyDashboardStatus" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "coSellerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "referenceNumber" TEXT NOT NULL,
    "currentStage" TEXT NOT NULL,
    "stageProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "statusData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyDashboardStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyDashboardStatus_propertyId_idx" ON "PropertyDashboardStatus"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyDashboardStatus_sellerId_idx" ON "PropertyDashboardStatus"("sellerId");

-- CreateIndex
CREATE INDEX "PropertyDashboardStatus_referenceNumber_idx" ON "PropertyDashboardStatus"("referenceNumber");

-- CreateIndex
CREATE INDEX "Offer_referenceNumber_idx" ON "Offer"("referenceNumber");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDashboardStatus" ADD CONSTRAINT "PropertyDashboardStatus_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDashboardStatus" ADD CONSTRAINT "PropertyDashboardStatus_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
