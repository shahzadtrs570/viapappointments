/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable @typescript-eslint/no-unused-vars*/

"use client"

import {
  UserMenu,
  type UserMenuProps,
} from "@/components/Layouts/DashboardLayout/UserMenu"

export function RoleBasedUserMenu() {
  return <UserMenu isRoleBased />
}
