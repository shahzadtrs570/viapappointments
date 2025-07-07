import "./globals.css"
// import { Inter } from "next/font/google"

// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata = {
  title: "Srenova",
  description:
    "Connect property owners with investment opportunities for equity release.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This root layout should just pass children down.
  // The <html> and <body> tags should be in the nested [lng]/layout.tsx
  return children
}
