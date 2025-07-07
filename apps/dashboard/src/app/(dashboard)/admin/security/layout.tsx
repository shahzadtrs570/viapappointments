import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Security Scanner",
  description: "Real-time security analysis of your application",
}

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
