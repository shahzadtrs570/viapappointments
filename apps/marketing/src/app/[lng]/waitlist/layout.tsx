import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Join the Waitlist - NextJet",
  description:
    "Join our waitlist to get early access to NextJet's powerful features and be the first to know when we launch.",
  openGraph: {
    title: "Join the Waitlist - NextJet",
    description:
      "Join our waitlist to get early access to NextJet's powerful features and be the first to know when we launch.",
  },
}

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="flex min-h-screen flex-col">{children}</main>
}
