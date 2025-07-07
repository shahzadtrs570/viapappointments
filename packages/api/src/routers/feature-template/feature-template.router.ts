/**
 * FEATURE TEMPLATE ROUTER
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

import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { featureTemplateService } from "./service/feature-template.service"
import { validateTurnstileToken } from "../../utils/turnstile"

/**
 * tRPC router for feature template endpoints
 *
 * Related Prisma schema:
 * model FeatureTemplate {
 *   id          String    @id @default(cuid())
 *   name        String
 *   description String?
 *   createdAt   DateTime  @default(now())
 *   updatedAt   DateTime  @updatedAt
 *   userId      String?
 *   user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
 * }
 *
 * Available routes:
 * - create: Creates a new feature template (authenticated)
 *   Input: { name: string, description?: string }
 *   Returns: FeatureTemplate
 *
 * - public.create: Creates a new public feature template (no authentication)
 *   Input: { name: string, description?: string }
 *   Returns: FeatureTemplate
 *
 * - list: Gets all feature templates for the current user
 *   Input: { search?: string, cursor?: string, limit?: number, includePublic?: boolean }
 *   Returns: { featureTemplates: FeatureTemplate[], nextCursor?: string, totalCount: number }
 *
 * - public.list: Gets all public feature templates (no authentication)
 *   Input: { search?: string, cursor?: string, limit?: number }
 *   Returns: { featureTemplates: FeatureTemplate[], nextCursor?: string, totalCount: number }
 *
 * - get: Gets a specific feature template by ID
 *   Input: { id: string }
 *   Returns: FeatureTemplate | null
 *
 * - public.get: Gets a specific public feature template by ID (no authentication)
 *   Input: { id: string }
 *   Returns: FeatureTemplate | null
 *
 * - update: Updates a feature template
 *   Input: { id: string, data: { name?: string, description?: string } }
 *   Returns: FeatureTemplate
 *
 * - delete: Deletes a feature template
 *   Input: { id: string }
 *   Returns: { success: boolean, message: string }
 *
 * - admin.getAll: Gets all feature templates (admin only)
 *   Input: None
 *   Returns: FeatureTemplate[]
 */

// Validation schema for creating a feature template
const createFeatureTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  metadata: z
    .object({
      turnstileToken: z.string({
        required_error: "Turnstile verification is required",
      }),
    })
    .optional(),
})

// Validation schema for updating a feature template
const updateFeatureTemplateSchema = createFeatureTemplateSchema.partial()

// Validation schema for listing feature templates
const getFeatureTemplatesSchema = z.object({
  search: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(50),
  includePublic: z.boolean().optional().default(false),
})

export const featureTemplateRouter = createTRPCRouter({
  // Create a new feature template (authenticated user)
  create: protectedProcedure
    .input(createFeatureTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify Turnstile token
      if (!input.metadata?.turnstileToken) {
        console.error("No Turnstile token provided in metadata")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Security token is required. Please try again.",
        })
      }

      const isValid = await validateTurnstileToken(
        input.metadata.turnstileToken
      )

      if (!isValid) {
        console.error("Turnstile validation failed")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid security token. Please try again.",
        })
      }

      try {
        const result = await featureTemplateService.createFeatureTemplate({
          input: {
            name: input.name,
            description: input.description,
          },
          session: ctx.session.user,
        })

        return result
      } catch (error) {
        console.error("Error creating feature template:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create feature template",
          cause: error,
        })
      }
    }),

  // Get all feature templates for the current user
  list: protectedProcedure
    .input(getFeatureTemplatesSchema)
    .query(({ input, ctx }) => {
      return featureTemplateService.getUserFeatureTemplates({
        input,
        session: ctx.session.user,
      })
    }),

  // Get a specific feature template by ID
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return featureTemplateService.getFeatureTemplate({
        input,
        session: ctx.session.user,
      })
    }),

  // Update a feature template
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateFeatureTemplateSchema,
      })
    )
    .mutation(({ input, ctx }) => {
      return featureTemplateService.updateFeatureTemplate({
        input,
        session: ctx.session.user,
      })
    }),

  // Delete a feature template
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return featureTemplateService.deleteFeatureTemplate({
        input,
        session: ctx.session.user,
      })
    }),

  // Public endpoints (no authentication required)
  public: createTRPCRouter({
    // Create a new public feature template
    create: publicProcedure
      .input(createFeatureTemplateSchema)
      .mutation(async ({ input }) => {
        // Verify Turnstile token
        if (!input.metadata?.turnstileToken) {
          console.error("No Turnstile token provided in metadata")
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Security token is required. Please try again.",
          })
        }

        const isValid = await validateTurnstileToken(
          input.metadata.turnstileToken
        )

        if (!isValid) {
          console.error("Turnstile validation failed")
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid security token. Please try again.",
          })
        }

        try {
          const result = await featureTemplateService.createFeatureTemplate({
            input: {
              name: input.name,
              description: input.description,
            },
          })

          return result
        } catch (error) {
          console.error("Error creating feature template:", error)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create feature template",
            cause: error,
          })
        }
      }),

    // Get all public feature templates
    list: publicProcedure
      .input(getFeatureTemplatesSchema)
      .query(({ input }) => {
        return featureTemplateService.getPublicFeatureTemplates({
          input,
        })
      }),

    // Get a specific public feature template by ID
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => {
        return featureTemplateService.getFeatureTemplate({
          input,
        })
      }),
  }),

  // Admin procedures
  admin: createTRPCRouter({
    // Get all feature templates (admin only)
    getAll: protectedProcedure.query(({ ctx }) => {
      return featureTemplateService.getAllFeatureTemplates({
        session: ctx.session.user,
      })
    }),
  }),
})
