/**
 * FEATURE TEMPLATE SERVICE
 *
 * LINTING & CODE QUALITY NOTES:
 * -----------------------------
 * 1. Import Order (maintain blank lines between groups):
 *    - External packages (trpc)
 *    - Package imports (@package/*)
 *    - App imports (@/*)
 *    - Relative imports (./*)
 *
 * 2. Type Safety:
 *    - Use proper error types (TRPCError)
 *    - Maintain consistent argument types across service methods
 *    - Use explicit type imports: import type { Something } from "..."
 *
 * 3. Common Issues:
 *    - Wrap all repository calls in try/catch blocks
 *    - Use specific error codes (NOT_FOUND, FORBIDDEN, etc.)
 *    - Keep business logic separate from data access
 */

import { TRPCError } from "@trpc/server"

import type {
  CreateFeatureTemplateArgs,
  DeleteFeatureTemplateArgs,
  GetAllFeatureTemplatesArgs,
  GetFeatureTemplateArgs,
  GetFeatureTemplatesArgs,
  GetPublicFeatureTemplatesArgs,
  UpdateFeatureTemplateArgs,
} from "./feature-template.input"

import { featureTemplateRepository } from "../repository/feature-template.repository"

/**
 * FeatureTemplate service containing business logic
 *
 * The service layer handles business logic and coordinates between
 * the repository and the router.
 */
class FeatureTemplateService {
  /**
   * Create a new feature template
   * Can be used by both authenticated and public users
   */
  async createFeatureTemplate({ input, session }: CreateFeatureTemplateArgs) {
    try {
      // If session exists, use the user ID, otherwise create as public template
      const userId = session?.id || null
      return await featureTemplateRepository.create(userId, input)
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create feature template",
      })
    }
  }

  /**
   * Get all feature templates for the current user
   * If session is not provided, returns public templates
   */
  async getUserFeatureTemplates({ input, session }: GetFeatureTemplatesArgs) {
    try {
      const { includePublic } = input

      const { featureTemplates, nextCursor, totalCount } =
        await featureTemplateRepository.getPaginated({
          userId: session?.id,
          includePublic: includePublic || !session,
          search: input.search,
          cursor: input.cursor,
          limit: input.limit,
        })

      return {
        featureTemplates,
        nextCursor,
        totalCount,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch feature templates",
      })
    }
  }

  /**
   * Get public feature templates only
   */
  async getPublicFeatureTemplates({ input }: GetPublicFeatureTemplatesArgs) {
    try {
      const { featureTemplates, nextCursor, totalCount } =
        await featureTemplateRepository.getPaginated({
          includePublic: true,
          search: input.search,
          cursor: input.cursor,
          limit: input.limit,
        })

      return {
        featureTemplates,
        nextCursor,
        totalCount,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch public feature templates",
      })
    }
  }

  /**
   * Get a feature template by ID
   * Public templates can be accessed without authentication
   */
  async getFeatureTemplate({ input, session }: GetFeatureTemplateArgs) {
    try {
      const featureTemplate = await featureTemplateRepository.findById(input.id)

      if (!featureTemplate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature template not found",
        })
      }

      // Public templates (null userId) are accessible to everyone
      if (featureTemplate.userId === null) {
        return featureTemplate
      }

      // If the template has a userId but no session, deny access
      // Could also use `(!session || session.role !== "ADMIN")` to check if user is admin if we want to be more specific
      if (!session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this feature template",
        })
      }

      // Check if the feature template belongs to the user
      if (
        featureTemplate.userId !== session.id &&
        session.role !== "ADMIN" &&
        session.role !== "SUPER_ADMIN"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this feature template",
        })
      }

      return featureTemplate
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch feature template",
      })
    }
  }

  /**
   * Update a feature template
   * Public templates can be updated without authentication if specifically built for that
   */
  async updateFeatureTemplate({ input, session }: UpdateFeatureTemplateArgs) {
    try {
      const featureTemplate = await featureTemplateRepository.findById(input.id)

      if (!featureTemplate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature template not found",
        })
      }

      // For user-owned templates, verify permissions
      if (featureTemplate.userId) {
        // If the template has a userId but no session, deny access
        if (!session) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to update this feature template",
          })
        }

        // Check if the feature template belongs to the user
        if (
          featureTemplate.userId !== session.id &&
          session.role !== "ADMIN" &&
          session.role !== "SUPER_ADMIN"
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to update this feature template",
          })
        }
      }

      // At this point, either:
      // 1. It's a public template (no userId)
      // 2. User owns the template
      // 3. User is an admin
      return await featureTemplateRepository.update(input.id, input.data)
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update feature template",
      })
    }
  }

  /**
   * Delete a feature template
   * Similar permission rules as update
   */
  async deleteFeatureTemplate({ input, session }: DeleteFeatureTemplateArgs) {
    try {
      const featureTemplate = await featureTemplateRepository.findById(input.id)

      if (!featureTemplate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature template not found",
        })
      }

      // For user-owned templates, verify permissions
      if (featureTemplate.userId) {
        // If the template has a userId but no session, deny access
        if (!session) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to delete this feature template",
          })
        }

        // Check if the feature template belongs to the user
        if (
          featureTemplate.userId !== session.id &&
          session.role !== "ADMIN" &&
          session.role !== "SUPER_ADMIN"
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to delete this feature template",
          })
        }
      }

      await featureTemplateRepository.delete(input.id)

      return {
        success: true,
        message: "Feature template deleted successfully",
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete feature template",
      })
    }
  }

  /**
   * Get all feature templates (admin only)
   */
  async getAllFeatureTemplates({ session }: GetAllFeatureTemplatesArgs) {
    // Check if user has admin access
    if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to access all feature templates",
      })
    }

    try {
      return await featureTemplateRepository.getAll()
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch all feature templates",
      })
    }
  }
}

export const featureTemplateService = new FeatureTemplateService()
