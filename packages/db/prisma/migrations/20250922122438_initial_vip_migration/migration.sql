/*
  Warnings:

  - You are about to drop the column `SrenovaRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AdminProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicationReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBox` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxCapitalDeployment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxComplianceInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxContinuousManagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxFinancialModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxInvestment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxInvestorEngagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxListing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxProperty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuyBoxThemeData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompletionStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConveyancerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Eligibility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FamilySupporterProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FundBuyerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyDashboardStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyDocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SellerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SellerProperty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Valuation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ValuerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_buy_box_allocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_due_diligence_legal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_initial_inquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_investor_profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_monitoring_reporting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_onboarding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_platform_training` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_qualification_kyc_aml` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_secondary_market` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `buyer_transaction_execution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdminProfile" DROP CONSTRAINT "AdminProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationReview" DROP CONSTRAINT "ApplicationReview_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationReview" DROP CONSTRAINT "ApplicationReview_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBox" DROP CONSTRAINT "BuyBox_createdById_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxCapitalDeployment" DROP CONSTRAINT "BuyBoxCapitalDeployment_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxComplianceInfo" DROP CONSTRAINT "BuyBoxComplianceInfo_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxContinuousManagement" DROP CONSTRAINT "BuyBoxContinuousManagement_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxFinancialModel" DROP CONSTRAINT "BuyBoxFinancialModel_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxInvestment" DROP CONSTRAINT "BuyBoxInvestment_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxInvestment" DROP CONSTRAINT "BuyBoxInvestment_investorId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxInvestorEngagement" DROP CONSTRAINT "BuyBoxInvestorEngagement_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxListing" DROP CONSTRAINT "BuyBoxListing_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxProperty" DROP CONSTRAINT "BuyBoxProperty_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxProperty" DROP CONSTRAINT "BuyBoxProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "BuyBoxThemeData" DROP CONSTRAINT "BuyBoxThemeData_buyBoxId_fkey";

-- DropForeignKey
ALTER TABLE "CompletionStatus" DROP CONSTRAINT "CompletionStatus_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "CompletionStatus" DROP CONSTRAINT "CompletionStatus_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "ContactAddress" DROP CONSTRAINT "ContactAddress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_sellerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "ConveyancerProfile" DROP CONSTRAINT "ConveyancerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "Eligibility" DROP CONSTRAINT "Eligibility_userId_fkey";

-- DropForeignKey
ALTER TABLE "FamilySupporterProfile" DROP CONSTRAINT "FamilySupporterProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "FundBuyerProfile" DROP CONSTRAINT "FundBuyerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_sellerProfileId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyAddress" DROP CONSTRAINT "PropertyAddress_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyDashboardStatus" DROP CONSTRAINT "PropertyDashboardStatus_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyDashboardStatus" DROP CONSTRAINT "PropertyDashboardStatus_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyDocument" DROP CONSTRAINT "PropertyDocument_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "PropertyDocument" DROP CONSTRAINT "PropertyDocument_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "SellerProfile" DROP CONSTRAINT "SellerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "SellerProperty" DROP CONSTRAINT "SellerProperty_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "SellerProperty" DROP CONSTRAINT "SellerProperty_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Valuation" DROP CONSTRAINT "Valuation_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Valuation" DROP CONSTRAINT "Valuation_valuerId_fkey";

-- DropForeignKey
ALTER TABLE "ValuerProfile" DROP CONSTRAINT "ValuerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_buy_box_allocation" DROP CONSTRAINT "buyer_buy_box_allocation_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_due_diligence_legal" DROP CONSTRAINT "buyer_due_diligence_legal_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_initial_inquiry" DROP CONSTRAINT "buyer_initial_inquiry_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_investor_profile" DROP CONSTRAINT "buyer_investor_profile_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_monitoring_reporting" DROP CONSTRAINT "buyer_monitoring_reporting_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_onboarding" DROP CONSTRAINT "buyer_onboarding_userId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_platform_training" DROP CONSTRAINT "buyer_platform_training_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_qualification_kyc_aml" DROP CONSTRAINT "buyer_qualification_kyc_aml_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_secondary_market" DROP CONSTRAINT "buyer_secondary_market_buyerOnboardingId_fkey";

-- DropForeignKey
ALTER TABLE "buyer_transaction_execution" DROP CONSTRAINT "buyer_transaction_execution_buyerOnboardingId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "SrenovaRole",
ADD COLUMN     "isCompanyUser" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "AdminProfile";

-- DropTable
DROP TABLE "ApplicationReview";

-- DropTable
DROP TABLE "BuyBox";

-- DropTable
DROP TABLE "BuyBoxCapitalDeployment";

-- DropTable
DROP TABLE "BuyBoxComplianceInfo";

-- DropTable
DROP TABLE "BuyBoxContinuousManagement";

-- DropTable
DROP TABLE "BuyBoxFinancialModel";

-- DropTable
DROP TABLE "BuyBoxInvestment";

-- DropTable
DROP TABLE "BuyBoxInvestorEngagement";

-- DropTable
DROP TABLE "BuyBoxListing";

-- DropTable
DROP TABLE "BuyBoxProperty";

-- DropTable
DROP TABLE "BuyBoxThemeData";

-- DropTable
DROP TABLE "CompletionStatus";

-- DropTable
DROP TABLE "ContactAddress";

-- DropTable
DROP TABLE "Contract";

-- DropTable
DROP TABLE "ConveyancerProfile";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "Eligibility";

-- DropTable
DROP TABLE "FamilySupporterProfile";

-- DropTable
DROP TABLE "FundBuyerProfile";

-- DropTable
DROP TABLE "Offer";

-- DropTable
DROP TABLE "Property";

-- DropTable
DROP TABLE "PropertyAddress";

-- DropTable
DROP TABLE "PropertyDashboardStatus";

-- DropTable
DROP TABLE "PropertyDocument";

-- DropTable
DROP TABLE "SellerProfile";

-- DropTable
DROP TABLE "SellerProperty";

-- DropTable
DROP TABLE "Valuation";

-- DropTable
DROP TABLE "ValuerProfile";

-- DropTable
DROP TABLE "buyer_buy_box_allocation";

-- DropTable
DROP TABLE "buyer_due_diligence_legal";

-- DropTable
DROP TABLE "buyer_initial_inquiry";

-- DropTable
DROP TABLE "buyer_investor_profile";

-- DropTable
DROP TABLE "buyer_monitoring_reporting";

-- DropTable
DROP TABLE "buyer_onboarding";

-- DropTable
DROP TABLE "buyer_platform_training";

-- DropTable
DROP TABLE "buyer_qualification_kyc_aml";

-- DropTable
DROP TABLE "buyer_secondary_market";

-- DropTable
DROP TABLE "buyer_transaction_execution";

-- DropEnum
DROP TYPE "AgreementType";

-- DropEnum
DROP TYPE "ApplicationReviewStatus";

-- DropEnum
DROP TYPE "ContractStatus";

-- DropEnum
DROP TYPE "FinancialPriority";

-- DropEnum
DROP TYPE "HealthCondition";

-- DropEnum
DROP TYPE "OccupancyRight";

-- DropEnum
DROP TYPE "OfferStatus";

-- DropEnum
DROP TYPE "OnboardingStatus";

-- DropEnum
DROP TYPE "OnboardingStep";

-- DropEnum
DROP TYPE "PropertyCondition";

-- DropEnum
DROP TYPE "PropertyDocumentType";

-- DropEnum
DROP TYPE "PropertyType";

-- DropEnum
DROP TYPE "Srenova_UserRole";

-- DropEnum
DROP TYPE "ValuationStatus";

-- CreateTable
CREATE TABLE "Dealership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "email" TEXT,
    "businessType" TEXT NOT NULL DEFAULT 'DEALER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "dealershipId" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "vin" TEXT,
    "stockNumber" TEXT,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "trim" TEXT,
    "priceAmount" INTEGER,
    "priceCurrency" TEXT NOT NULL DEFAULT 'USD',
    "msrpAmount" INTEGER,
    "mileage" INTEGER,
    "condition" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "fuelType" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "transmission" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "drivetrain" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "bodyStyle" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "engineSize" DOUBLE PRECISION,
    "engineCylinders" INTEGER,
    "horsepower" INTEGER,
    "mpgCity" INTEGER,
    "mpgHighway" INTEGER,
    "mpgCombined" INTEGER,
    "exteriorColor" TEXT,
    "interiorColor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "scrapedAt" TIMESTAMP(3),
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawData" JSONB,
    "processedData" JSONB,
    "features" JSONB,
    "specifications" JSONB,
    "images" JSONB,
    "title" TEXT,
    "description" TEXT,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dealership_slug_key" ON "Dealership"("slug");

-- CreateIndex
CREATE INDEX "Dealership_slug_idx" ON "Dealership"("slug");

-- CreateIndex
CREATE INDEX "Dealership_businessType_idx" ON "Dealership"("businessType");

-- CreateIndex
CREATE INDEX "Dealership_isActive_idx" ON "Dealership"("isActive");

-- CreateIndex
CREATE INDEX "Dealership_createdAt_idx" ON "Dealership"("createdAt");

-- CreateIndex
CREATE INDEX "Inventory_dealershipId_isActive_status_idx" ON "Inventory"("dealershipId", "isActive", "status");

-- CreateIndex
CREATE INDEX "Inventory_make_model_year_idx" ON "Inventory"("make", "model", "year");

-- CreateIndex
CREATE INDEX "Inventory_priceAmount_condition_idx" ON "Inventory"("priceAmount", "condition");

-- CreateIndex
CREATE INDEX "Inventory_year_mileage_idx" ON "Inventory"("year", "mileage");

-- CreateIndex
CREATE INDEX "Inventory_fuelType_transmission_idx" ON "Inventory"("fuelType", "transmission");

-- CreateIndex
CREATE INDEX "Inventory_bodyStyle_drivetrain_idx" ON "Inventory"("bodyStyle", "drivetrain");

-- CreateIndex
CREATE INDEX "Inventory_condition_fuelType_idx" ON "Inventory"("condition", "fuelType");

-- CreateIndex
CREATE INDEX "Inventory_status_isActive_idx" ON "Inventory"("status", "isActive");

-- CreateIndex
CREATE INDEX "Inventory_createdAt_isActive_idx" ON "Inventory"("createdAt", "isActive");

-- CreateIndex
CREATE INDEX "Inventory_isFeatured_isActive_idx" ON "Inventory"("isFeatured", "isActive");

-- CreateIndex
CREATE INDEX "Inventory_vin_idx" ON "Inventory"("vin");

-- CreateIndex
CREATE INDEX "Inventory_stockNumber_dealershipId_idx" ON "Inventory"("stockNumber", "dealershipId");

-- CreateIndex
CREATE INDEX "Inventory_slug_idx" ON "Inventory"("slug");

-- CreateIndex
CREATE INDEX "Inventory_scrapedAt_idx" ON "Inventory"("scrapedAt");

-- CreateIndex
CREATE INDEX "Inventory_lastUpdated_idx" ON "Inventory"("lastUpdated");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
