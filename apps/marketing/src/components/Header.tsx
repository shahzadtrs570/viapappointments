import { Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Image
              src="/images/vip/logo.png"
              alt="Check The Lot"
              width={44}
              height={44}
              className="transition-transform group-hover:scale-110"
            />
            <div>
              <h1 className="font-display text-xl font-black tracking-tight">
                Check The Lot
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Listings of Things
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dealers"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                For Dealers
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-2 glass-strong px-5 py-2.5 rounded-full hover:bg-primary/5 transition-all cursor-pointer">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold">AI-Powered Search</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
