/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

"use client"

import { RoleBasedHeader } from "./RoleBasedHeader"

interface RoleBasedLayoutProps {
  children: React.ReactNode
}

export function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
  return (
    <div className="flex flex-col space-y-6 min-h-dynamic-screen">
      <RoleBasedHeader />
      <div className="container flex flex-1 flex-col gap-12 px-4 pb-8 lg:flex-row">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
