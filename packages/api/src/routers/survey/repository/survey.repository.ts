/**
 * SURVEY REPOSITORY
 *
 * LINTING & CODE QUALITY NOTES:
 * -----------------------------
 * 1. Import Order (maintain blank lines between groups):
 *    - External packages (Prisma)
 *    - Package imports (@package/*)
 *    - App imports (@/*)
 *    - Relative imports (./*)
 *
 * 2. Type Safety:
 *    - Avoid using 'any' for database operations
 *    - If type assertions are necessary, use specific types:
 *      const createData: CreateInput & { userId?: string } = {...}
 *    - Use explicit type imports: import type { Something } from "..."
 *
 * 3. Common Issues:
 *    - Ensure proper null handling for optional fields
 *    - Keep database query patterns consistent
 *    - Document complex queries with comments
 */

import { db } from "@package/db"

import type {
  CreateSurveyInput,
  UpdateSurveyInput,
} from "../service/survey.input"
import type { Prisma } from "@package/db"

/**
 * Survey repository for database operations
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
 * Relationships:
 * - Survey can have many SurveyResponses (one-to-many)
 * - Survey can have many SurveyLeadConnections (one-to-many)
 */

export class SurveyRepository {
  /**
   * Create a new survey
   * @param createdBy Optional user ID for authenticated users
   * @param data Survey data
   */
  async create(createdBy: string | null, data: CreateSurveyInput) {
    // Using type assertion to satisfy Prisma's type system
    const createData: Prisma.SurveyCreateInput = {
      ...data,
      surveyJson: data.surveyJson as Prisma.InputJsonValue,
      createdBy,
    }

    return db.survey.create({
      data: createData,
    })
  }

  /**
   * Find all surveys for a user
   */
  async findByCreator(createdBy: string) {
    return db.survey.findMany({
      where: { createdBy },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Find all public surveys
   */
  async findPublic() {
    return db.survey.findMany({
      where: {
        isPublic: true,
        status: "PUBLISHED",
        isArchived: false,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Find a survey by ID
   */
  async findById(id: string) {
    return db.survey.findUnique({
      where: { id },
    })
  }

  /**
   * Update a survey
   */
  async update(id: string, data: UpdateSurveyInput) {
    const { surveyJson, ...rest } = data;
    const updateData: Prisma.SurveyUpdateInput = {
      ...rest,
      ...(surveyJson && { surveyJson: surveyJson as Prisma.InputJsonValue })
    };

    return db.survey.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * Delete a survey
   */
  async delete(id: string) {
    return db.survey.delete({
      where: { id },
    })
  }

  /**
   * Archive a survey (soft delete)
   */
  async archive(id: string) {
    return db.survey.update({
      where: { id },
      data: { isArchived: true },
    })
  }

  /**
   * Update survey status
   */
  async updateStatus(id: string, status: "DRAFT" | "PUBLISHED" | "CLOSED") {
    return db.survey.update({
      where: { id },
      data: { status },
    })
  }

  /**
   * Get paginated surveys
   * If createdBy is provided, filters by creator
   * If includePublic is true, includes public surveys
   * If includeArchived is true, includes archived surveys
   */
  async getPaginated(params: {
    createdBy?: string
    includePublic?: boolean
    includeArchived?: boolean
    status?: "DRAFT" | "PUBLISHED" | "CLOSED"
    search?: string
    cursor?: string
    limit?: number
  }) {
    const {
      createdBy,
      includePublic = false,
      includeArchived = false,
      status,
      search,
      cursor,
      limit = 10,
    } = params

    // Using type assertion for complex where conditions
    const where: Prisma.SurveyWhereInput = {}

    // Handle archive filtering
    if (!includeArchived) {
      where.isArchived = false
    }

    // Handle status filtering
    if (status) {
      where.status = status
    }

    // Handle creator and public filtering
    if (createdBy && includePublic) {
      // User's surveys OR public surveys
      where.OR = [{ createdBy }, { isPublic: true }]
    } else if (createdBy) {
      // Only user's surveys
      where.createdBy = createdBy
    } else if (includePublic) {
      // Only public surveys
      where.isPublic = true
    }

    // Add search conditions if provided
    if (search) {
      where.OR = [
        ...(where.OR || []),
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get the total count
    const totalCount = await db.survey.count({ where })

    // Query for paginated items
    const surveys = await db.survey.findMany({
      where,
      take: limit + 1, // Take one more to check if there are more results
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
    })

    // Check if there are more results
    let nextCursor: string | undefined
    if (surveys.length > limit) {
      const nextItem = surveys.pop()
      nextCursor = nextItem?.id
    }

    return {
      surveys,
      nextCursor,
      totalCount,
    }
  }

  /**
   * Get all surveys (admin only)
   */
  async getAll() {
    return db.survey.findMany({
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Create a survey response
   */
  async createResponse(data: {
    surveyId: string
    responseJson: Record<string, unknown>
    leadId?: string
    userId?: string
    ipAddress?: string
    userAgent?: string
    isCompleted?: boolean
    completedAt?: Date
  }) {
    return db.surveyResponse.create({
      data: {
        surveyId: data.surveyId,
        responseJson: data.responseJson as Prisma.InputJsonValue,
        leadId: data.leadId,
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        isCompleted: data.isCompleted ?? false,
        completedAt: data.isCompleted
          ? (data.completedAt ?? new Date())
          : undefined,
      },
    })
  }

  /**
   * Get responses for a survey
   */
  async getResponses(surveyId: string) {
    return db.surveyResponse.findMany({
      where: { surveyId },
      // orderBy: { created_at: "desc" },
    })
  }
}

export const surveyRepository = new SurveyRepository()
