import { banSchema } from "@package/validations"
import { z } from "zod"

// Role enum to match the database schema
const roleEnum = z.enum(["USER", "ADMIN", "SUPER_ADMIN"])

export const userIdInput = z.object({
  userId: z.string().min(1),
})

export type UserIdInput = z.infer<typeof userIdInput>

export const userEmailInput = z.object({
  email: z.string().min(1).max(100),
})

export type UserEmailInput = z.infer<typeof userEmailInput>

export const usersPaginationInput = z.object({
  page: z.number().int(),
  limit: z.number().int().positive(),
})

export type UsersPaginationInput = z.infer<typeof usersPaginationInput>

export const userBanInput = banSchema.merge(
  z.object({
    userId: z.string(),
  })
)

export type UserBanInput = z.infer<typeof userBanInput>

export const userRoleUpdateInput = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: roleEnum,
})

export type UserRoleUpdateInput = z.infer<typeof userRoleUpdateInput>
