/**
 * SURVEY ROUTER
 *
 * LINTING & CODE QUALITY NOTES:
 * -----------------------------
 * 1. Import Order (maintain blank lines between groups):
 *    - External packages (zod, trpc)
 *    - Package imports (@package/*)
 *    - App imports (@/*)
 *    - Relative imports (./*)
 *
 * 2. Type Safety:
 *    - Use explicit type imports: import type { Something } from "..."
 *    - Avoid using 'any' - use specific types or 'unknown' with type guards
 *    - Define clear input/output types for all procedures
 *
 * 3. Common Issues:
 *    - Keep error messages consistent (e.g., "Failed to create [feature]")
 *    - Ensure all procedure inputs have proper validation
 *    - Maintain comprehensive JSDoc comments for API endpoints
 */

import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { surveyService } from "./service/survey.service"

/**
 * tRPC router for survey endpoints
 *
 * Related Prisma schema:
 * model Survey {
 *   id             String   @id @default(cuid())
 *   title          String
 *   description    String?
 *   status         SurveyStatus @default(DRAFT)
 *   surveyJson     Json     // SurveyJS schema definition
 *   createdAt      DateTime @default(now())
 *   updatedAt      DateTime @updatedAt
 *   createdBy      String?  // User ID reference
 *   isArchived     Boolean  @default(false)
 *   redirectUrl    String?  // URL to redirect to after completion
 *   thankYouMessage String?  // Message to show after completion
 *   primaryColor   String?  // Brand color for survey
 *   isPublic       Boolean  @default(false) // Whether survey is publicly accessible
 * }
 *
 * Available routes:
 * - create: Creates a new survey (authenticated)
 *   Input: { title: string, description?: string, surveyJson: object, ... }
 *   Returns: Survey
 *
 * - list: Gets all surveys for the current user
 *   Input: { search?: string, cursor?: string, limit?: number, includePublic?: boolean, ... }
 *   Returns: { surveys: Survey[], nextCursor?: string, totalCount: number }
 *
 * - get: Gets a specific survey by ID
 *   Input: { id: string }
 *   Returns: Survey | null
 *
 * - update: Updates a survey
 *   Input: { id: string, data: { title?: string, description?: string, ... } }
 *   Returns: Survey
 *
 * - delete: Deletes a survey
 *   Input: { id: string }
 *   Returns: { success: boolean, message: string }
 *
 * - archive: Archives a survey (soft delete)
 *   Input: { id: string }
 *   Returns: { success: boolean, message: string }
 *
 * - updateStatus: Updates a survey's status
 *   Input: { id: string, status: "DRAFT" | "PUBLISHED" | "CLOSED" }
 *   Returns: { id: string, status: string }
 *
 * - responses.create: Creates a response to a survey
 *   Input: { surveyId: string, responseJson: object, ... }
 *   Returns: { id: string, surveyId: string, isCompleted: boolean }
 *
 * - responses.list: Gets all responses for a survey
 *   Input: { surveyId: string }
 *   Returns: { responses: SurveyResponse[] }
 *
 * - public.get: Gets a specific public published survey by ID (no authentication)
 *   Input: { id: string }
 *   Returns: Survey | null
 *
 * - public.list: Gets all public published surveys (no authentication)
 *   Input: { search?: string, cursor?: string, limit?: number }
 *   Returns: { surveys: Survey[], nextCursor?: string, totalCount: number }
 *
 * - public.responses.create: Submits a response to a public survey (no authentication)
 *   Input: { surveyId: string, responseJson: object, ... }
 *   Returns: { id: string, surveyId: string, isCompleted: boolean }
 *
 * - admin.getAll: Gets all surveys (admin only)
 *   Input: None
 *   Returns: Survey[]
 */

// Validation schema for creating a survey
const createSurveySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  surveyJson: z.record(z.unknown()),
  isPublic: z.boolean().optional().default(false),
  redirectUrl: z
    .union([
      z.string().url(),
      z.string().max(0), // Allow empty string
      z.null(),
    ])
    .optional(),
  thankYouMessage: z.string().optional(),
  primaryColor: z.string().optional(),
})

// Validation schema for updating a survey
const updateSurveySchema = createSurveySchema.partial().extend({
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
})

// Validation schema for listing surveys
const getSurveysSchema = z.object({
  search: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  includePublic: z.boolean().optional().default(false),
  includeArchived: z.boolean().optional().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
})

// Validation schema for creating a survey response
const createSurveyResponseSchema = z.object({
  surveyId: z.string(),
  responseJson: z.record(z.unknown()),
  leadId: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  isCompleted: z.boolean().optional().default(true),
})

export const surveyRouter = createTRPCRouter({
  // Create a new survey (authenticated user)
  create: protectedProcedure
    .input(createSurveySchema)
    .mutation(({ input, ctx }) => {
      return surveyService.createSurvey({
        input,
        session: ctx.session.user,
      })
    }),

  // Get all surveys for the current user
  list: protectedProcedure.input(getSurveysSchema).query(({ input, ctx }) => {
    return surveyService.getUserSurveys({
      input,
      session: ctx.session.user,
    })
  }),

  // Get a specific survey by ID
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return surveyService.getSurvey({
        input,
        session: ctx.session.user,
      })
    }),

  // Update a survey
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateSurveySchema,
      })
    )
    .mutation(({ input, ctx }) => {
      return surveyService.updateSurvey({
        input,
        session: ctx.session.user,
      })
    }),

  // Delete a survey
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return surveyService.deleteSurvey({
        input,
        session: ctx.session.user,
      })
    }),

  // Archive a survey (soft delete)
  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return surveyService.archiveSurvey({
        input,
        session: ctx.session.user,
      })
    }),

  // Update a survey's status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return surveyService.updateSurveyStatus({
        input,
        session: ctx.session.user,
      })
    }),

  // Survey responses
  responses: createTRPCRouter({
    // Create a response to a survey (authenticated user)
    create: protectedProcedure
      .input(createSurveyResponseSchema)
      .mutation(({ input, ctx }) => {
        return surveyService.createSurveyResponse({
          input,
          session: ctx.session.user,
        })
      }),

    // Get all responses for a survey
    list: protectedProcedure
      .input(z.object({ surveyId: z.string() }))
      .query(({ input, ctx }) => {
        return surveyService.getSurveyResponses({
          input,
          session: ctx.session.user,
        })
      }),
  }),

  // Public endpoints (no authentication required)
  public: createTRPCRouter({
    // Get a specific public survey by ID
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input, ctx }) => {
        return surveyService.getSurvey({
          input,
          session: ctx.session?.user,
        })
      }),

    // Get all public surveys
    list: publicProcedure.input(getSurveysSchema).query(({ input }) => {
      return surveyService.getPublicSurveys({
        input,
      })
    }),

    // Survey responses (public)
    responses: createTRPCRouter({
      // Create a response to a public survey (no authentication)
      create: publicProcedure
        .input(createSurveyResponseSchema)
        .mutation(({ input, ctx }) => {
          return surveyService.createSurveyResponse({
            input,
            session: ctx.session?.user,
          })
        }),
    }),
  }),

  // Admin procedures
  admin: createTRPCRouter({
    // Get all surveys (admin only)
    getAll: protectedProcedure.query(({ ctx }) => {
      return surveyService.getAllSurveys({
        session: ctx.session.user,
      })
    }),
  }),
})
