import localFont from "next/font/local"
import { NextFont } from "next/dist/compiled/@next/font"

// Load default fonts

// Sarabun font family
export const sarabun = localFont({
  src: [
    {
      path: "./assets/Sarabun-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "./assets/Sarabun-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "./assets/Sarabun-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./assets/Sarabun-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./assets/Sarabun-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./assets/Sarabun-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./assets/Sarabun-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./assets/Sarabun-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./assets/Sarabun-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-sarabun",
})

// Archivo Black font
export const archivoBlack = localFont({
  src: "./assets/ArchivoBlack-Regular.woff2",
  display: "swap",
  variable: "--font-archivo-black",
})

// // SF Pro Display font family
// export const sfProDisplay = localFont({
//   src: [
//     {
//       path: "./assets/SFProDisplay-Thin.woff2",
//       weight: "100",
//       style: "normal",
//     },
//     {
//       path: "./assets/SFProDisplay-Light.woff2",
//       weight: "300",
//       style: "normal",
//     },
//     {
//       path: "./assets/SFProDisplay-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "./assets/SFProDisplay-Medium.woff2",
//       weight: "500",
//       style: "normal",
//     },
//     {
//       path: "./assets/SFProDisplay-Semibold.woff2",
//       weight: "600",
//       style: "normal",
//     },
//     {
//       path: "./assets/SFProDisplay-Bold.woff2",
//       weight: "700",
//       style: "normal",
//     },
//     {
//       path: "./assets/SFProDisplay-Heavy.woff2",
//       weight: "800",
//       style: "normal",
//     },
//   ],
//   display: "swap",
//   variable: "--font-sf-pro-display",
// })

// Helper function to get all font variables
export const getFontVariables = (): string => {
  return `${sarabun.variable} ${archivoBlack.variable}`
}

// This is the default font for the application use this font unless you want to use a different font
export const defaultFont = sarabun

// Export font types
export type FontFamily = NextFont
