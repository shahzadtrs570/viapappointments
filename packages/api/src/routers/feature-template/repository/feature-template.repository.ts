/**
 * FEATURE TEMPLATE REPOSITORY
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
  CreateFeatureTemplateInput,
  UpdateFeatureTemplateInput,
} from "../service/feature-template.input"
import type { Prisma } from "@package/db"

/**
 * FeatureTemplate repository for database operations
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
 * Relationships:
 * - FeatureTemplate belongs to a User (many-to-one, optional)
 */

export class FeatureTemplateRepository {
  /**
   * Create a new feature template
   * @param userId Optional user ID for authenticated users
   * @param data Template data
   */
  async create(userId: string | null, data: CreateFeatureTemplateInput) {
    // Using type assertion to satisfy Prisma's type system
    const createData: Prisma.FeatureTemplateCreateInput = {
      ...data,
    }

    // Only add userId if it exists
    if (userId) {
      createData.user = {
        connect: { id: userId },
      }
    }

    return db.featureTemplate.create({
      data: createData,
    })
  }

  /**
   * Find all feature templates for a user
   */
  async findByUserId(userId: string) {
    return db.featureTemplate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Find all public feature templates (no user associated)
   */
  async findPublic() {
    // Using type assertion to handle null in where clause
    const where: Prisma.FeatureTemplateWhereInput = {
      userId: null,
    }

    return db.featureTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Find a feature template by ID
   */
  async findById(id: string) {
    return db.featureTemplate.findUnique({
      where: { id },
    })
  }

  /**
   * Update a feature template
   */
  async update(id: string, data: UpdateFeatureTemplateInput) {
    return db.featureTemplate.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete a feature template
   */
  async delete(id: string) {
    return db.featureTemplate.delete({
      where: { id },
    })
  }

  /**
   * Get paginated feature templates
   * If userId is provided, filters by user
   * If includePublic is true, includes public templates (null userId)
   */
  async getPaginated(params: {
    userId?: string
    includePublic?: boolean
    search?: string
    cursor?: string
    limit?: number
  }) {
    const { userId, includePublic = false, search, cursor, limit = 10 } = params

    // Using type assertion for complex where conditions
    const where: Prisma.FeatureTemplateWhereInput = {}

    if (userId && includePublic) {
      // User's templates OR public templates
      where.OR = [{ userId }, { userId: null }]
    } else if (userId) {
      // Only user's templates
      where.userId = userId
    } else if (includePublic) {
      // Only public templates
      where.userId = null
    }

    // Add search conditions if provided
    if (search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get the total count
    const totalCount = await db.featureTemplate.count({ where })

    // Query for paginated items
    const featureTemplates = await db.featureTemplate.findMany({
      where,
      take: limit + 1, // Take one more to check if there are more results
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: "desc" },
    })

    // Check if there are more results
    let nextCursor: string | undefined
    if (featureTemplates.length > limit) {
      const nextItem = featureTemplates.pop()
      nextCursor = nextItem?.id
    }

    return {
      featureTemplates,
      nextCursor,
      totalCount,
    }
  }

  /**
   * Get all feature templates (admin only)
   */
  async getAll() {
    return db.featureTemplate.findMany({
      orderBy: { createdAt: "desc" },
    })
  }
}

export const featureTemplateRepository = new FeatureTemplateRepository()
