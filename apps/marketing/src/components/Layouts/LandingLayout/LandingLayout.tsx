import { Footer, Navbar } from "@/components/Misc"
import { docs } from "@/lib/fuma"

type LandingLayoutProps = {
  children: React.ReactNode
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
