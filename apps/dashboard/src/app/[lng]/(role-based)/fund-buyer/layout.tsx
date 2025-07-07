import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

export default function FundBuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleBasedLayout>{children}</RoleBasedLayout>
}
