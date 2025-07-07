/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

"use client"

import { DashboardLinks } from "@/components/Layouts/DashboardLayout/DashboardLinks"

export function RoleBasedSideNav() {
  return (
    <div className="hidden flex-1 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <DashboardLinks isRoleBased />
        </div>
      </div>
    </div>
  )
}
