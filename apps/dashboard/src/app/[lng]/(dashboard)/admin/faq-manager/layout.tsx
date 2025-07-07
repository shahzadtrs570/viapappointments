import type { ReactNode } from "react"

export default function FAQManagerLayout({
  children,
}: {
  children: ReactNode
}) {
  return <div className="w-full">{children}</div>
}
