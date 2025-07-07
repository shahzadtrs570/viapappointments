-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'paused', 'trialing', 'unpaid', 'expired');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('day', 'week', 'month', 'year');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'MAX_RETRIES_REACHED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SurveyTriggerType" AS ENUM ('IMMEDIATE', 'DELAYED', 'MANUAL');

-- CreateEnum
CREATE TYPE "Srenova_UserRole" AS ENUM ('SELLER', 'FAMILY_SUPPORTER', 'FUND_BUYER', 'CONVEYANCER', 'VALUER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'APARTMENT', 'BUNGALOW', 'COTTAGE', 'VILLA', 'OTHER');

-- CreateEnum
CREATE TYPE "HealthCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "FinancialPriority" AS ENUM ('LUMP_SUM', 'MONTHLY_INCOME', 'MIXED', 'UNDECIDED');

-- CreateEnum
CREATE TYPE "PropertyCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_RENOVATION');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('DRAFT', 'PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING_SIGNATURE', 'PARTIALLY_SIGNED', 'SIGNED', 'COMPLETED', 'TERMINATED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "ValuationStatus" AS ENUM ('REQUESTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PropertyDocumentType" AS ENUM ('DEED', 'FLOOR_PLAN', 'ENERGY_CERTIFICATE', 'SURVEY', 'PROPERTY_TAX', 'INSURANCE', 'PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "AgreementType" AS ENUM ('STANDARD', 'CUSTOM');

-- CreateEnum
CREATE TYPE "OccupancyRight" AS ENUM ('FULL', 'PARTIAL', 'NONE');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('INITIAL_INQUIRY', 'QUALIFICATION_KYC_AML', 'DUE_DILIGENCE_LEGAL', 'INVESTOR_PROFILE', 'PLATFORM_TRAINING', 'BUY_BOX_ALLOCATION', 'TRANSACTION_EXECUTION', 'MONITORING_REPORTING', 'SECONDARY_MARKET', 'COMPLETED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "hasOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "preferredLanguage" TEXT DEFAULT 'en',
    "SrenovaRole" "Srenova_UserRole"[] DEFAULT ARRAY['SELLER', 'FUND_BUYER']::"Srenova_UserRole"[],
    "receiveUpdates" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bannedByUserId" TEXT,
    "unbannedByUserId" TEXT,
    "banReason" TEXT NOT NULL,
    "unbanReason" TEXT,
    "unbannedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "customerId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "lookupKey" TEXT,
    "status" "SubscriptionStatus",
    "isCanceledAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "billingInterval" "BillingInterval",
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "waitlistType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT,
    "referralCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "notes" TEXT,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ai_api_calls" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "prompt_string" TEXT NOT NULL,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "responseData" TEXT NOT NULL,
    "response_time" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL,
    "usage_cost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audio_length_mins" DOUBLE PRECISION,
    "ai_response_words" INTEGER,
    "ai_response_chars" INTEGER,
    "prompt_number_words" INTEGER,
    "prompt_number_chars" INTEGER,

    CONSTRAINT "Ai_api_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueTask" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "result" JSONB,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "failedProviders" TEXT[],
    "errorMessage" TEXT,
    "errorPatterns" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "scheduledFor" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "referenceId" TEXT,
    "referenceModel" TEXT,

    CONSTRAINT "QueueTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "metadata" JSONB,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT,
    "tags" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unsubscribeToken" TEXT,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT,
    "leadType" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "assignedTo" TEXT,
    "lastSurveyOfferedAt" TIMESTAMP(3),
    "lastSurveyCompletedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "FeatureTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "SurveyStatus" NOT NULL DEFAULT 'DRAFT',
    "surveyJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "redirectUrl" TEXT,
    "thankYouMessage" TEXT,
    "primaryColor" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "responseJson" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "leadId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyLeadConnection" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "leadTypeFilter" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "triggerType" "SurveyTriggerType" NOT NULL DEFAULT 'IMMEDIATE',
    "delayMinutes" INTEGER,

    CONSTRAINT "SurveyLeadConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streetLine1" TEXT NOT NULL,
    "streetLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAddress" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "streetLine1" TEXT NOT NULL,
    "streetLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "generalHealth" "HealthCondition" NOT NULL,
    "financialPriority" "FinancialPriority" NOT NULL,
    "willStayInProperty" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilySupporterProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "relationshipToSeller" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilySupporterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundBuyerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundBuyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConveyancerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firmName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConveyancerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValuerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firmName" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValuerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "bedroomCount" INTEGER NOT NULL,
    "bathroomCount" INTEGER NOT NULL,
    "totalAreaSqM" DOUBLE PRECISION NOT NULL,
    "condition" "PropertyCondition" NOT NULL,
    "estimatedValue" DOUBLE PRECISION NOT NULL,
    "confirmedValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerProperty" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "ownershipPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellerProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "sellerProfileId" TEXT NOT NULL,
    "initialPaymentAmount" DOUBLE PRECISION NOT NULL,
    "monthlyPaymentAmount" DOUBLE PRECISION NOT NULL,
    "indexationRate" DOUBLE PRECISION NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'DRAFT',
    "agreementType" "AgreementType" NOT NULL,
    "occupancyRight" "OccupancyRight" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coSellerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "sellerProfileId" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "signedBySeller" BOOLEAN NOT NULL DEFAULT false,
    "signedByBuyer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDocument" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "documentType" "PropertyDocumentType" NOT NULL,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valuation" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "valuerId" TEXT NOT NULL,
    "marketValue" DOUBLE PRECISION NOT NULL,
    "occupiedValue" DOUBLE PRECISION NOT NULL,
    "status" "ValuationStatus" NOT NULL DEFAULT 'REQUESTED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Valuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationReview" (
    "id" TEXT NOT NULL,
    "checklist" JSONB NOT NULL,
    "considerations" JSONB NOT NULL,
    "propertyId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "coSellerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionStatus" (
    "id" TEXT NOT NULL,
    "choice" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "propertyId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "coSellerIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletionStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBox" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "themeType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdById" TEXT NOT NULL,
    "submissionNotes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxThemeData" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "location" JSONB NOT NULL DEFAULT '{}',
    "propertyTypes" JSONB NOT NULL DEFAULT '[]',
    "demographicProfile" JSONB NOT NULL DEFAULT '{}',
    "additionalCriteria" TEXT,
    "targetInvestors" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxThemeData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxProperty" (
    "buyBoxId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "sellerDemographics" JSONB NOT NULL,
    "dueDiligence" JSONB NOT NULL,
    "documents" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxProperty_pkey" PRIMARY KEY ("buyBoxId","propertyId")
);

-- CreateTable
CREATE TABLE "BuyBoxFinancialModel" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "totalBouquet" DOUBLE PRECISION NOT NULL,
    "totalMonthlyAnnuity" DOUBLE PRECISION NOT NULL,
    "guaranteedTerms" JSONB NOT NULL,
    "expectedReturns" JSONB NOT NULL,
    "riskAnalysis" JSONB NOT NULL,
    "pricing" JSONB NOT NULL,
    "cashFlowProjections" JSONB DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxFinancialModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxComplianceInfo" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "regulatoryCompliance" JSONB NOT NULL,
    "legalChecks" JSONB NOT NULL,
    "documents" JSONB NOT NULL,
    "internalApproval" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxComplianceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxListing" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "buyBoxName" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "highlightFeatures" JSONB NOT NULL,
    "investmentHighlights" JSONB NOT NULL,
    "riskDisclosures" JSONB NOT NULL,
    "documents" JSONB NOT NULL,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "reviewNotes" TEXT,
    "publishDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxInvestorEngagement" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "accessControls" JSONB NOT NULL,
    "investorCommunication" JSONB NOT NULL,
    "subscriptionManagement" JSONB NOT NULL,
    "qAndASettings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxInvestorEngagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxCapitalDeployment" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "fundsManagement" JSONB NOT NULL,
    "contractExecution" JSONB NOT NULL,
    "propertyTransfers" JSONB NOT NULL,
    "sellerPayments" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxCapitalDeployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxContinuousManagement" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "reportingSchedule" JSONB NOT NULL,
    "performanceTracking" JSONB NOT NULL,
    "investorRelations" JSONB NOT NULL,
    "complianceReporting" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxContinuousManagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyBoxInvestment" (
    "id" TEXT NOT NULL,
    "buyBoxId" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "investmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyBoxInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_onboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OnboardingStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionDate" TIMESTAMP(3),
    "currentStep" "OnboardingStep" NOT NULL DEFAULT 'INITIAL_INQUIRY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_initial_inquiry" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "investmentGoals" TEXT NOT NULL,
    "estimatedInvestmentAmount" DECIMAL(65,30) NOT NULL,
    "preferredContactMethod" TEXT NOT NULL,
    "preferredContactTime" TEXT,
    "questions" TEXT,
    "referralSource" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_initial_inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_qualification_kyc_aml" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "investorType" TEXT NOT NULL,
    "entityType" TEXT,
    "fullLegalName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "taxIdentificationNumber" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "residenceCountry" TEXT NOT NULL,
    "isAccreditedInvestor" BOOLEAN NOT NULL,
    "accreditationDocuments" TEXT[],
    "sourceOfFunds" TEXT NOT NULL,
    "hasPoliticalExposure" BOOLEAN NOT NULL,
    "politicalExposureDetails" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_qualification_kyc_aml_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_due_diligence_legal" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "hasReviewedInvestmentAgreement" BOOLEAN NOT NULL,
    "hasReviewedOperatingAgreement" BOOLEAN NOT NULL,
    "hasReviewedPrivacyPolicy" BOOLEAN NOT NULL,
    "hasReviewedTermsOfService" BOOLEAN NOT NULL,
    "hasReviewedRiskDisclosures" BOOLEAN NOT NULL,
    "legalRepresentativeName" TEXT,
    "legalRepresentativeContact" TEXT,
    "additionalLegalRequirements" TEXT,
    "signedDocuments" TEXT[],
    "electronicSignatureConsent" BOOLEAN NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_due_diligence_legal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_investor_profile" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "investmentStrategy" TEXT NOT NULL,
    "riskTolerance" TEXT NOT NULL,
    "investmentHorizon" TEXT NOT NULL,
    "targetAnnualReturn" DECIMAL(65,30),
    "investmentFrequency" TEXT,
    "preferredPropertyTypes" TEXT[],
    "preferredLocations" TEXT[],
    "minPropertyValue" DECIMAL(65,30),
    "maxPropertyValue" DECIMAL(65,30),
    "preferredDiversification" TEXT,
    "esgPreferences" TEXT[],
    "specialRequirements" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_investor_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_platform_training" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "hasCompletedPlatformOrientation" BOOLEAN NOT NULL,
    "hasCompletedInvestmentWorkshop" BOOLEAN NOT NULL,
    "hasCompletedPortfolioManagementTraining" BOOLEAN NOT NULL,
    "hasSetupAccount" BOOLEAN NOT NULL,
    "hasSetupNotifications" BOOLEAN NOT NULL,
    "hasTestedInvestmentSimulation" BOOLEAN NOT NULL,
    "scheduledPersonalTraining" BOOLEAN NOT NULL,
    "personalTrainingDate" TIMESTAMP(3),
    "trainingFeedback" TEXT,
    "additionalTrainingRequested" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_platform_training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_buy_box_allocation" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "selectedBuyBoxIds" TEXT[],
    "investmentAmountPerBuyBox" JSONB NOT NULL,
    "totalAllocation" DECIMAL(65,30) NOT NULL,
    "allocationStrategy" TEXT NOT NULL,
    "allocationNotes" TEXT,
    "targetAllocationDate" TIMESTAMP(3),
    "reinvestmentPreferences" TEXT,
    "hasDiversificationRequirements" BOOLEAN NOT NULL,
    "diversificationRequirements" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_buy_box_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_transaction_execution" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "bankingInformation" JSONB,
    "cryptoWalletAddress" TEXT,
    "transactionDate" TIMESTAMP(3),
    "hasReviewedTransactionDetails" BOOLEAN NOT NULL,
    "hasConfirmedInvestmentAmount" BOOLEAN NOT NULL,
    "hasSentFunds" BOOLEAN NOT NULL,
    "fundsReceivedDate" TIMESTAMP(3),
    "transactionConfirmationNumber" TEXT,
    "investmentActivationDate" TIMESTAMP(3),
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_transaction_execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_monitoring_reporting" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "preferredReportingFrequency" TEXT NOT NULL,
    "additionalMetricsRequested" TEXT[],
    "notificationPreferences" JSONB NOT NULL,
    "hasSetupDashboardAlerts" BOOLEAN NOT NULL,
    "hasScheduledPeriodicCalls" BOOLEAN NOT NULL,
    "periodicCallFrequency" TEXT,
    "taxReportingPreferences" TEXT,
    "specialReportingRequirements" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_monitoring_reporting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buyer_secondary_market" (
    "id" TEXT NOT NULL,
    "buyerOnboardingId" TEXT NOT NULL,
    "interestedInSecondaryMarket" BOOLEAN NOT NULL,
    "expectedHoldingPeriod" TEXT,
    "secondaryMarketPreferences" TEXT[],
    "hasReviewedLiquidityOptions" BOOLEAN NOT NULL,
    "liquidityRequirements" TEXT,
    "exitStrategyPreferences" TEXT,
    "hasTrustedBeneficiaries" BOOLEAN NOT NULL,
    "beneficiaryInformation" JSONB,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_secondary_market_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriptionId_key" ON "Subscription"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_email_key" ON "WaitlistEntry"("email");

-- CreateIndex
CREATE INDEX "WaitlistEntry_waitlistType_idx" ON "WaitlistEntry"("waitlistType");

-- CreateIndex
CREATE INDEX "WaitlistEntry_createdAt_idx" ON "WaitlistEntry"("createdAt");

-- CreateIndex
CREATE INDEX "WaitlistEntry_status_idx" ON "WaitlistEntry"("status");

-- CreateIndex
CREATE INDEX "QueueTask_status_idx" ON "QueueTask"("status");

-- CreateIndex
CREATE INDEX "QueueTask_type_idx" ON "QueueTask"("type");

-- CreateIndex
CREATE INDEX "QueueTask_createdAt_idx" ON "QueueTask"("createdAt");

-- CreateIndex
CREATE INDEX "QueueTask_priority_idx" ON "QueueTask"("priority");

-- CreateIndex
CREATE INDEX "QueueTask_scheduledFor_idx" ON "QueueTask"("scheduledFor");

-- CreateIndex
CREATE INDEX "QueueTask_referenceId_idx" ON "QueueTask"("referenceId");

-- CreateIndex
CREATE INDEX "QueueTask_referenceModel_idx" ON "QueueTask"("referenceModel");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_unsubscribeToken_key" ON "NewsletterSubscriber"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_subscribedAt_idx" ON "NewsletterSubscriber"("subscribedAt");

-- CreateIndex
CREATE INDEX "NewsletterSubscriber_isActive_idx" ON "NewsletterSubscriber"("isActive");

-- CreateIndex
CREATE INDEX "Lead_leadType_idx" ON "Lead"("leadType");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_assignedTo_idx" ON "Lead"("assignedTo");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "FeatureTemplate_userId_idx" ON "FeatureTemplate"("userId");

-- CreateIndex
CREATE INDEX "FeatureTemplate_createdAt_idx" ON "FeatureTemplate"("createdAt");

-- CreateIndex
CREATE INDEX "Survey_status_idx" ON "Survey"("status");

-- CreateIndex
CREATE INDEX "Survey_createdAt_idx" ON "Survey"("createdAt");

-- CreateIndex
CREATE INDEX "Survey_isArchived_idx" ON "Survey"("isArchived");

-- CreateIndex
CREATE INDEX "SurveyResponse_surveyId_idx" ON "SurveyResponse"("surveyId");

-- CreateIndex
CREATE INDEX "SurveyResponse_leadId_idx" ON "SurveyResponse"("leadId");

-- CreateIndex
CREATE INDEX "SurveyResponse_completedAt_idx" ON "SurveyResponse"("completedAt");

-- CreateIndex
CREATE INDEX "SurveyResponse_isCompleted_idx" ON "SurveyResponse"("isCompleted");

-- CreateIndex
CREATE INDEX "SurveyLeadConnection_surveyId_idx" ON "SurveyLeadConnection"("surveyId");

-- CreateIndex
CREATE INDEX "SurveyLeadConnection_isActive_idx" ON "SurveyLeadConnection"("isActive");

-- CreateIndex
CREATE INDEX "SurveyLeadConnection_priority_idx" ON "SurveyLeadConnection"("priority");

-- CreateIndex
CREATE INDEX "SurveyLeadConnection_leadTypeFilter_idx" ON "SurveyLeadConnection"("leadTypeFilter");

-- CreateIndex
CREATE UNIQUE INDEX "ContactAddress_userId_key" ON "ContactAddress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyAddress_propertyId_key" ON "PropertyAddress"("propertyId");

-- CreateIndex
CREATE INDEX "SellerProfile_userId_idx" ON "SellerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilySupporterProfile_userId_key" ON "FamilySupporterProfile"("userId");

-- CreateIndex
CREATE INDEX "FamilySupporterProfile_userId_idx" ON "FamilySupporterProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FundBuyerProfile_userId_key" ON "FundBuyerProfile"("userId");

-- CreateIndex
CREATE INDEX "FundBuyerProfile_userId_idx" ON "FundBuyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConveyancerProfile_userId_key" ON "ConveyancerProfile"("userId");

-- CreateIndex
CREATE INDEX "ConveyancerProfile_userId_idx" ON "ConveyancerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ValuerProfile_userId_key" ON "ValuerProfile"("userId");

-- CreateIndex
CREATE INDEX "ValuerProfile_userId_idx" ON "ValuerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- CreateIndex
CREATE INDEX "AdminProfile_userId_idx" ON "AdminProfile"("userId");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "SellerProperty_sellerId_idx" ON "SellerProperty"("sellerId");

-- CreateIndex
CREATE INDEX "SellerProperty_propertyId_idx" ON "SellerProperty"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerProperty_sellerId_propertyId_key" ON "SellerProperty"("sellerId", "propertyId");

-- CreateIndex
CREATE INDEX "Offer_propertyId_idx" ON "Offer"("propertyId");

-- CreateIndex
CREATE INDEX "Offer_sellerProfileId_idx" ON "Offer"("sellerProfileId");

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_offerId_key" ON "Contract"("offerId");

-- CreateIndex
CREATE INDEX "Contract_sellerProfileId_idx" ON "Contract"("sellerProfileId");

-- CreateIndex
CREATE INDEX "Contract_status_idx" ON "Contract"("status");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Document_documentType_idx" ON "Document"("documentType");

-- CreateIndex
CREATE INDEX "PropertyDocument_propertyId_idx" ON "PropertyDocument"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyDocument_documentType_idx" ON "PropertyDocument"("documentType");

-- CreateIndex
CREATE INDEX "PropertyDocument_uploadedById_idx" ON "PropertyDocument"("uploadedById");

-- CreateIndex
CREATE INDEX "Valuation_propertyId_idx" ON "Valuation"("propertyId");

-- CreateIndex
CREATE INDEX "Valuation_valuerId_idx" ON "Valuation"("valuerId");

-- CreateIndex
CREATE INDEX "Valuation_status_idx" ON "Valuation"("status");

-- CreateIndex
CREATE INDEX "ApplicationReview_propertyId_idx" ON "ApplicationReview"("propertyId");

-- CreateIndex
CREATE INDEX "ApplicationReview_sellerId_idx" ON "ApplicationReview"("sellerId");

-- CreateIndex
CREATE INDEX "CompletionStatus_propertyId_idx" ON "CompletionStatus"("propertyId");

-- CreateIndex
CREATE INDEX "CompletionStatus_sellerId_idx" ON "CompletionStatus"("sellerId");

-- CreateIndex
CREATE INDEX "BuyBox_createdById_idx" ON "BuyBox"("createdById");

-- CreateIndex
CREATE INDEX "BuyBox_status_idx" ON "BuyBox"("status");

-- CreateIndex
CREATE INDEX "BuyBox_createdAt_idx" ON "BuyBox"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BuyBoxThemeData_buyBoxId_key" ON "BuyBoxThemeData"("buyBoxId");

-- CreateIndex
CREATE INDEX "BuyBoxProperty_buyBoxId_idx" ON "BuyBoxProperty"("buyBoxId");

-- CreateIndex
CREATE INDEX "BuyBoxProperty_propertyId_idx" ON "BuyBoxProperty"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyBoxFinancialModel_buyBoxId_key" ON "BuyBoxFinancialModel"("buyBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyBoxComplianceInfo_buyBoxId_key" ON "BuyBoxComplianceInfo"("buyBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyBoxListing_buyBoxId_key" ON "BuyBoxListing"("buyBoxId");

-- CreateIndex
CREATE INDEX "BuyBoxListing_publishStatus_idx" ON "BuyBoxListing"("publishStatus");

-- CreateIndex
CREATE UNIQUE INDEX "BuyBoxInvestorEngagement_buyBoxId_key" ON "BuyBoxInvestorEngagement"("buyBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyBoxCapitalDeployment_buyBoxId_key" ON "BuyBoxCapitalDeployment"("buyBoxId");

-- CreateIndex
CREATE UNIQUE INDEX "BuyBoxContinuousManagement_buyBoxId_key" ON "BuyBoxContinuousManagement"("buyBoxId");

-- CreateIndex
CREATE INDEX "BuyBoxInvestment_buyBoxId_idx" ON "BuyBoxInvestment"("buyBoxId");

-- CreateIndex
CREATE INDEX "BuyBoxInvestment_investorId_idx" ON "BuyBoxInvestment"("investorId");

-- CreateIndex
CREATE INDEX "BuyBoxInvestment_status_idx" ON "BuyBoxInvestment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_onboarding_userId_key" ON "buyer_onboarding"("userId");

-- CreateIndex
CREATE INDEX "buyer_onboarding_userId_idx" ON "buyer_onboarding"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_initial_inquiry_buyerOnboardingId_key" ON "buyer_initial_inquiry"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_initial_inquiry_buyerOnboardingId_idx" ON "buyer_initial_inquiry"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_qualification_kyc_aml_buyerOnboardingId_key" ON "buyer_qualification_kyc_aml"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_qualification_kyc_aml_buyerOnboardingId_idx" ON "buyer_qualification_kyc_aml"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_due_diligence_legal_buyerOnboardingId_key" ON "buyer_due_diligence_legal"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_due_diligence_legal_buyerOnboardingId_idx" ON "buyer_due_diligence_legal"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_investor_profile_buyerOnboardingId_key" ON "buyer_investor_profile"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_investor_profile_buyerOnboardingId_idx" ON "buyer_investor_profile"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_platform_training_buyerOnboardingId_key" ON "buyer_platform_training"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_platform_training_buyerOnboardingId_idx" ON "buyer_platform_training"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_buy_box_allocation_buyerOnboardingId_key" ON "buyer_buy_box_allocation"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_buy_box_allocation_buyerOnboardingId_idx" ON "buyer_buy_box_allocation"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_transaction_execution_buyerOnboardingId_key" ON "buyer_transaction_execution"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_transaction_execution_buyerOnboardingId_idx" ON "buyer_transaction_execution"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_monitoring_reporting_buyerOnboardingId_key" ON "buyer_monitoring_reporting"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_monitoring_reporting_buyerOnboardingId_idx" ON "buyer_monitoring_reporting"("buyerOnboardingId");

-- CreateIndex
CREATE UNIQUE INDEX "buyer_secondary_market_buyerOnboardingId_key" ON "buyer_secondary_market"("buyerOnboardingId");

-- CreateIndex
CREATE INDEX "buyer_secondary_market_buyerOnboardingId_idx" ON "buyer_secondary_market"("buyerOnboardingId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_bannedByUserId_fkey" FOREIGN KEY ("bannedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_unbannedByUserId_fkey" FOREIGN KEY ("unbannedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeatureTemplate" ADD CONSTRAINT "FeatureTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyLeadConnection" ADD CONSTRAINT "SurveyLeadConnection_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactAddress" ADD CONSTRAINT "ContactAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAddress" ADD CONSTRAINT "PropertyAddress_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerProfile" ADD CONSTRAINT "SellerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilySupporterProfile" ADD CONSTRAINT "FamilySupporterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundBuyerProfile" ADD CONSTRAINT "FundBuyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConveyancerProfile" ADD CONSTRAINT "ConveyancerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValuerProfile" ADD CONSTRAINT "ValuerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerProperty" ADD CONSTRAINT "SellerProperty_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerProperty" ADD CONSTRAINT "SellerProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDocument" ADD CONSTRAINT "PropertyDocument_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDocument" ADD CONSTRAINT "PropertyDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valuation" ADD CONSTRAINT "Valuation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valuation" ADD CONSTRAINT "Valuation_valuerId_fkey" FOREIGN KEY ("valuerId") REFERENCES "ValuerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationReview" ADD CONSTRAINT "ApplicationReview_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationReview" ADD CONSTRAINT "ApplicationReview_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionStatus" ADD CONSTRAINT "CompletionStatus_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionStatus" ADD CONSTRAINT "CompletionStatus_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBox" ADD CONSTRAINT "BuyBox_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxThemeData" ADD CONSTRAINT "BuyBoxThemeData_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxProperty" ADD CONSTRAINT "BuyBoxProperty_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxProperty" ADD CONSTRAINT "BuyBoxProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxFinancialModel" ADD CONSTRAINT "BuyBoxFinancialModel_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxComplianceInfo" ADD CONSTRAINT "BuyBoxComplianceInfo_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxListing" ADD CONSTRAINT "BuyBoxListing_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxInvestorEngagement" ADD CONSTRAINT "BuyBoxInvestorEngagement_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxCapitalDeployment" ADD CONSTRAINT "BuyBoxCapitalDeployment_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxContinuousManagement" ADD CONSTRAINT "BuyBoxContinuousManagement_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxInvestment" ADD CONSTRAINT "BuyBoxInvestment_buyBoxId_fkey" FOREIGN KEY ("buyBoxId") REFERENCES "BuyBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyBoxInvestment" ADD CONSTRAINT "BuyBoxInvestment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_onboarding" ADD CONSTRAINT "buyer_onboarding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_initial_inquiry" ADD CONSTRAINT "buyer_initial_inquiry_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_qualification_kyc_aml" ADD CONSTRAINT "buyer_qualification_kyc_aml_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_due_diligence_legal" ADD CONSTRAINT "buyer_due_diligence_legal_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_investor_profile" ADD CONSTRAINT "buyer_investor_profile_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_platform_training" ADD CONSTRAINT "buyer_platform_training_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_buy_box_allocation" ADD CONSTRAINT "buyer_buy_box_allocation_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_transaction_execution" ADD CONSTRAINT "buyer_transaction_execution_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_monitoring_reporting" ADD CONSTRAINT "buyer_monitoring_reporting_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buyer_secondary_market" ADD CONSTRAINT "buyer_secondary_market_buyerOnboardingId_fkey" FOREIGN KEY ("buyerOnboardingId") REFERENCES "buyer_onboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
