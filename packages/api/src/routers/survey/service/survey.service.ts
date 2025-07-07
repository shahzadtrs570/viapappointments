/**
 * SURVEY SERVICE
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
  ArchiveSurveyArgs,
  CreateSurveyArgs,
  CreateSurveyResponseArgs,
  DeleteSurveyArgs,
  GetAllSurveysArgs,
  GetPublicSurveysArgs,
  GetSurveyArgs,
  GetSurveyResponsesArgs,
  GetSurveysArgs,
  UpdateSurveyArgs,
  UpdateSurveyStatusArgs,
} from "./survey.input"

import { surveyRepository } from "../repository/survey.repository"

/**
 * Survey service containing business logic
 *
 * The service layer handles business logic and coordinates between
 * the repository and the router.
 */
class SurveyService {
  /**
   * Create a new survey
   */
  async createSurvey({ input, session }: CreateSurveyArgs) {
    try {
      // Only allow admin users to create surveys
      if (!session || session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can create surveys",
        })
      }

      // If session exists, use the user ID, otherwise create as public survey
      const createdBy = session.id
      return await surveyRepository.create(createdBy, input)
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create survey",
      })
    }
  }

  /**
   * Get all surveys for the current user
   * If session is not provided, returns public surveys
   */
  async getUserSurveys({ input, session }: GetSurveysArgs) {
    try {
      const { includePublic, includeArchived, status } = input

      const { surveys, nextCursor, totalCount } =
        await surveyRepository.getPaginated({
          createdBy: session?.id,
          includePublic: includePublic || !session,
          includeArchived: includeArchived || false,
          status,
          search: input.search,
          cursor: input.cursor,
          limit: input.limit,
        })

      return {
        surveys,
        nextCursor,
        totalCount,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch surveys",
      })
    }
  }

  /**
   * Get public surveys only
   */
  async getPublicSurveys({ input }: GetPublicSurveysArgs) {
    try {
      const { surveys, nextCursor, totalCount } =
        await surveyRepository.getPaginated({
          includePublic: true,
          includeArchived: false,
          status: "PUBLISHED",
          search: input.search,
          cursor: input.cursor,
          limit: input.limit,
        })

      return {
        surveys,
        nextCursor,
        totalCount,
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch public surveys",
      })
    }
  }

  /**
   * Get a survey by ID
   * Public surveys can be accessed without authentication
   */
  async getSurvey({ input, session }: GetSurveyArgs) {
    try {
      const survey = await surveyRepository.findById(input.id)

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        })
      }

      // Public published surveys are accessible to everyone
      if (
        survey.isPublic &&
        survey.status === "PUBLISHED" &&
        !survey.isArchived
      ) {
        return survey
      }

      // If the survey is not public but no session, deny access
      if (!session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this survey",
        })
      }

      // Check if the survey belongs to the user or if user is admin
      if (survey.createdBy !== session.id && session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this survey",
        })
      }

      return survey
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch survey",
      })
    }
  }

  /**
   * Update a survey
   */
  async updateSurvey({ input, session }: UpdateSurveyArgs) {
    try {
      const survey = await surveyRepository.findById(input.id)

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        })
      }

      // If no session, deny access
      if (!session) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this survey",
        })
      }

      // Only administrators can update surveys
      if (session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can update surveys",
        })
      }

      return await surveyRepository.update(input.id, input.data)
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update survey",
      })
    }
  }

  /**
   * Delete a survey
   */
  async deleteSurvey({ input, session }: DeleteSurveyArgs) {
    try {
      const survey = await surveyRepository.findById(input.id)

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        })
      }

      // Check session and admin role
      if (!session.role || session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can delete surveys",
        })
      }

      await surveyRepository.delete(input.id)
      return {
        success: true,
        message: "Survey deleted successfully",
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete survey",
      })
    }
  }

  /**
   * Archive a survey (soft delete)
   */
  async archiveSurvey({ input, session }: ArchiveSurveyArgs) {
    try {
      const survey = await surveyRepository.findById(input.id)

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        })
      }

      // Check session and admin role
      if (!session.role || session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can archive surveys",
        })
      }

      await surveyRepository.archive(input.id)
      return {
        success: true,
        message: "Survey archived successfully",
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to archive survey",
      })
    }
  }

  /**
   * Update a survey's status
   */
  async updateSurveyStatus({ input, session }: UpdateSurveyStatusArgs) {
    try {
      const survey = await surveyRepository.findById(input.id)

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        })
      }

      // Check session and admin role
      if (!session.role || session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can update survey status",
        })
      }

      const updatedSurvey = await surveyRepository.update(input.id, {
        status: input.status,
      })

      return {
        id: updatedSurvey.id,
        status: updatedSurvey.status,
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update survey status",
      })
    }
  }

  /**
   * Get all surveys (admin only)
   */
  async getAllSurveys({ session }: GetAllSurveysArgs) {
    try {
      // Only admins can access all surveys
      if (session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access all surveys",
        })
      }

      return await surveyRepository.getAll()
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch all surveys",
      })
    }
  }

  /**
   * Create a survey response
   */
  async createSurveyResponse({ input, session }: CreateSurveyResponseArgs) {
    try {
      const survey = await surveyRepository.findById(input.surveyId)

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        })
      }

      // Check if the survey is published
      if (survey.status !== "PUBLISHED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot submit responses to an unpublished survey",
        })
      }

      // For public access, the survey must be marked as public
      if (!session && !survey.isPublic) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This survey is not publicly accessible",
        })
      }

      // Create the response
      const response = await surveyRepository.createResponse({
        surveyId: input.surveyId,
        responseJson: input.responseJson,
        leadId: input.leadId,
        userId: session?.id,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        isCompleted: input.isCompleted ?? true,
      })

      // Return response data along with survey configuration for the frontend
      return {
        id: response.id,
        surveyId: response.surveyId,
        isCompleted: response.isCompleted,
        // Include survey configuration for the frontend
        surveyConfig: {
          redirectUrl: survey.redirectUrl,
          // Provide a default thank you message if none was specified
          thankYouMessage:
            survey.thankYouMessage || "Thank you for completing the survey!",
        },
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create survey response",
      })
    }
  }

  /**
   * Get responses for a survey
   */
  async getSurveyResponses({ input, session }: GetSurveyResponsesArgs) {
    try {
      const survey = await surveyRepository.findById(input.surveyId)

      if (!survey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Survey not found",
        })
      }

      // Only survey creator or admin can view responses
      if (survey.createdBy !== session.id && session.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to view this survey's responses",
        })
      }

      const responses = await surveyRepository.getResponses(input.surveyId)

      return {
        responses,
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch survey responses",
      })
    }
  }
}

export const surveyService = new SurveyService()
