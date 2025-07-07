import type {
  BanUserByIdArgs,
  UnbanUserByIdArgs,
  UpdateUserRoleArgs,
} from "../service/adminUser.service.types"

export type BanUserByIdData = BanUserByIdArgs["input"] & {
  bannedByUserId: string
}

export type UnbanUserByIdData = UnbanUserByIdArgs["input"] & {
  unbannedByUserId: string
}

export type UpdateUserRoleData = UpdateUserRoleArgs["input"]
