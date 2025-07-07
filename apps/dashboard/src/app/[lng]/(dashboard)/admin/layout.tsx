import { AdminContextProvider } from "./_contexts/adminContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminContextProvider>{children}</AdminContextProvider>
}
