import { DashboardHeader } from "./DashboardHeader"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col space-y-6 min-h-dynamic-screen">
      <DashboardHeader />
      <div className="container flex flex-1 flex-col gap-12 px-4 pb-8 lg:flex-row">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
