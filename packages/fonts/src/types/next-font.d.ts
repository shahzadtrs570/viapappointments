declare module "next/font/local" {
  export interface FontOptions {
    src:
      | string
      | Array<{
          path: string
          weight?: string
          style?: string
        }>
    weight?: string
    style?: string
    display?: "auto" | "block" | "swap" | "fallback" | "optional"
    variable?: string
  }

  export default function localFont(options: FontOptions): {
    className: string
    style: { fontFamily: string }
    variable: string
  }
}

declare module "next/dist/compiled/@next/font" {
  export interface NextFont {
    className: string
    style: { fontFamily: string }
    variable: string
  }
}
