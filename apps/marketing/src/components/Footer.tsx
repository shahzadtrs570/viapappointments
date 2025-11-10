import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold">Check The Lot</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered marketplace for vehicles, homes, boats, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Platform
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/search"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                Search Listings
              </Link>
              <Link
                href="/dealers"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                For Dealers
              </Link>
              <Link
                href="/about"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/faqs"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Support
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/contact"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="mailto:info@checkthelot.com"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                info@checkthelot.com
              </a>
              <a
                href="tel:+15551234567"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                +1 (555) 123-4567
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/legal/terms"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/legal/privacy"
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border/30">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Powered by AI. Built for discovery.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2025 Check The Lot. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
