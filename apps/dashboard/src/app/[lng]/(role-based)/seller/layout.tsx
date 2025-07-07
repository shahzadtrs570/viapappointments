import { RoleBasedLayout } from "@/components/Layouts/RoleBasedLayout"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RoleBasedLayout>{children}</RoleBasedLayout>
}
