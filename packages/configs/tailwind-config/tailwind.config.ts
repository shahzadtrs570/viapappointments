import type { Config } from "tailwindcss"

import plugin from "tailwindcss/plugin"

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      typography: ({}) => ({
        DEFAULT: {
          css: {
            maxWidth: "680px",
          },
        },
      }),
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        "background-2": "hsl(var(--background-2))",
        "background-3": "hsl(var(--background-3))",
        "background-gradient": "var(--background-gradient)",
        "background-gradient-gold": "var(--background-gradient-gold)",
        foreground: "hsl(var(--foreground))",
        foregroundGrey: "hsl(var--(foreground-grey))",
        success: "hsl(var(--success))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Srenova specific colors
        srenova: {
          navy: "#0f172a",
          gold: "#ca8a04",
          darkgold: "#a16207",
          darkgray: "#4b5563",
          lightblue: "#f0f5ff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in",
      },
      fontFamily: {
        sarabun: ["var(--font-sarabun)"],
        archivoBlack: ["var(--font-archivo-black)"],
      },
      screens: {
        xs: "425px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    plugin(({ addUtilities, matchUtilities, theme }) => {
      addUtilities({
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".text-pretty": {
          "text-wrap": "pretty",
        },
        ".min-h-dynamic-screen": {
          "min-height": ["100vh", "100dvh"],
        },
        ".min-h-dynamic-screen-nav": {
          "min-height": ["calc(100vh - 70px)", "calc(100dvh - 64px)"],
        },
        ".h-dynamic-screen": {
          height: ["100vh", "100dvh"],
        },
        ".h-dynamic-screen-nav": {
          height: ["calc(100vh - 64px)", "calc(100dvh - 64px)"],
        },
        ".max-h-dynamic-screen": {
          "max-height": ["100vh", "100dvh"],
        },
        ".break-anywhere": {
          "overflow-wrap": "anywhere",
        },
        ".container-custom": {
          maxWidth: "80rem", // 1280px
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          "@screen sm": {
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          },
          "@screen lg": {
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
        },
      })

      // Animation delay utilities
      matchUtilities(
        {
          "animate-delay": (value) => ({
            animationDelay: value,
          }),
        },
        {
          values: {
            100: "100ms",
            200: "200ms",
            300: "300ms",
            400: "400ms",
            500: "500ms",
          },
        }
      )
    }),
  ],
} satisfies Config

export default config
