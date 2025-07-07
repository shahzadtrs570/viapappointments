/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  buyBoxThemeSchema,
  capitalDeploymentSchema,
  complianceInfoSchema,
  continuousManagementSchema,
  financialModelSchema,
  investorEngagementSchema,
  platformListingSchema,
  propertySelectionSchema,
} from "@package/validations"
import { z } from "zod"

import { buyBoxService } from "./service/buy-box.service"
import { adminProcedure, createTRPCRouter } from "../../../../trpc"

/**
 * Buy-Box Creation Router
 * Handles all operations related to creating and managing Buy Boxes
 */
export const buyBoxCreationRouter = createTRPCRouter({
  // Theme Conceptualization
  createTheme: adminProcedure
    .input(buyBoxThemeSchema)
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.createBuyBoxTheme({
        input,
        userId: ctx.session.user.id,
      })
    }),

  updateTheme: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        data: buyBoxThemeSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.updateBuyBoxTheme({
        buyBoxId: input.buyBoxId,
        data: input.data,
        userId: ctx.session.user.id,
      })
    }),

  // Property Aggregation
  addProperties: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        properties: z.array(z.any()), // Accept any property structure
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Map the properties to standardize document format if needed
      const properties = input.properties.map((property) => ({
        ...property,
        documents: Array.isArray(property.documents)
          ? property.documents.map((doc: any) =>
              typeof doc === "string" ? doc : doc.url || doc.id || ""
            )
          : [],
        // Ensure required fields exist with defaults if missing
        sellerDemographics: {
          age: property.sellerDemographics?.age || 65, // Default to 65 if missing or too small
          lifeExpectancy: property.sellerDemographics?.lifeExpectancy || 85,
          ...(property.sellerDemographics || {}),
        },
        dueDiligence: {
          appraisalCompleted:
            property.dueDiligence?.appraisalCompleted || false,
          titleReportReviewed:
            property.dueDiligence?.titleReportReviewed || false,
          legalReportReviewed:
            property.dueDiligence?.legalReportReviewed || false,
          encumbrances: property.dueDiligence?.encumbrances || false,
          appraisalValue: property.dueDiligence?.appraisalValue || 0,
          ...(property.dueDiligence || {}),
        },
      }))

      return buyBoxService.addPropertiesToBuyBox({
        buyBoxId: input.buyBoxId,
        properties,
        userId: ctx.session.user.id,
      })
    }),

  removeProperty: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        propertyId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.removePropertyFromBuyBox({
        buyBoxId: input.buyBoxId,
        propertyId: input.propertyId,
        userId: ctx.session.user.id,
      })
    }),

  // Financial Modeling
  updateFinancialModel: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        data: financialModelSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.updateFinancialModel({
        buyBoxId: input.buyBoxId,
        data: input.data,
        userId: ctx.session.user.id,
      })
    }),

  // Compliance and Legal
  updateComplianceInfo: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        data: complianceInfoSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.updateComplianceInfo({
        buyBoxId: input.buyBoxId,
        data: input.data,
        userId: ctx.session.user.id,
      })
    }),

  // Platform Listing
  updatePlatformListing: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        data: platformListingSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = {
        ...input.data,
        publishDate: input.data.publishDate
          ? new Date(input.data.publishDate)
          : null,
      }
      return buyBoxService.updatePlatformListing({
        buyBoxId: input.buyBoxId,
        data,
        userId: ctx.session.user.id,
      })
    }),

  // Investor Engagement
  updateInvestorEngagement: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        data: investorEngagementSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.updateInvestorEngagement({
        buyBoxId: input.buyBoxId,
        data: input.data,
        userId: ctx.session.user.id,
      })
    }),

  // Capital Deployment
  updateCapitalDeployment: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        data: capitalDeploymentSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.updateCapitalDeployment({
        buyBoxId: input.buyBoxId,
        data: input.data,
        userId: ctx.session.user.id,
      })
    }),

  // Continuous Management
  updateContinuousManagement: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        data: continuousManagementSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.updateContinuousManagement({
        buyBoxId: input.buyBoxId,
        data: input.data,
        userId: ctx.session.user.id,
      })
    }),

  // Submit Buy Box for approval
  submitForApproval: adminProcedure
    .input(
      z.object({
        buyBoxId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return buyBoxService.submitBuyBoxForApproval({
        buyBoxId: input.buyBoxId,
        notes: input.notes,
        userId: ctx.session.user.id,
      })
    }),

  // Get Buy Boxes
  getAllBuyBoxes: adminProcedure
    .input(
      z.object({
        status: z
          .enum(["draft", "pending_review", "approved", "published", "all"])
          .optional()
          .default("all"),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      return buyBoxService.getAllBuyBoxes({
        status: input.status,
        page: input.page,
        limit: input.limit,
        userId: ctx.session.user.id,
      })
    }),

  // Get single Buy Box with all details
  getBuyBoxById: adminProcedure
    .input(z.object({ buyBoxId: z.string() }))
    .query(async ({ input, ctx }) => {
      return buyBoxService.getBuyBoxById({
        buyBoxId: input.buyBoxId,
        userId: ctx.session.user.id,
      })
    }),

  // Get available properties for selection
  getAvailableProperties: adminProcedure
    .input(
      z.object({
        themeType: z.string().optional(),
        location: z
          .object({
            city: z.string().optional(),
            region: z.string().optional(),
            postalCodes: z.array(z.string()).optional(),
          })
          .optional(),
        propertyTypes: z.array(z.string()).optional(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      return buyBoxService.getAvailableProperties({
        filters: {
          themeType: input.themeType,
          location: input.location,
          propertyTypes: input.propertyTypes,
        },
        page: input.page,
        limit: input.limit,
        userId: ctx.session.user.id,
      })
    }),
})
