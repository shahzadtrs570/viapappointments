// import { AdminNav } from "@/app/(dashboard)/_components/AdminNavigation"
import { AdminNav } from "@/app/[lng]/(dashboard)/_components/AdminNavigation"

import { DashboardLinks } from "./DashboardLinks"

export function DashboardSideNav() {
  return (
    <div className="hidden flex-1 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <DashboardLinks />
          <div className="mt-8">
            <AdminNav />
          </div>
        </div>
      </div>
    </div>
  )
}
