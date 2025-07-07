"use client"

import type { ReactNode } from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"

import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({
  children,
  ...props
}: { children: ReactNode } & ThemeProviderProps) {
  return (
    <NextThemesProvider
      // enableSystem
      attribute="class"
      defaultTheme="light"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
