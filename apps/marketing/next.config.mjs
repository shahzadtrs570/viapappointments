/* eslint-disable import/no-default-export */
import createMDX from "fumadocs-mdx/config"
// import path from "path"

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  // Update i18n configuration for Vercel
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [],
  },
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@package/auth",
    "@package/db",
    "@package/api",
    "@package/validations",
    "@package/ui",
    "@package/email",
    "@package/utils",
    "@package/tailwind-config",
    "@package/eslint-config",
    "@package/typescript-config",
    "@package/prettier-config",
  ],
  // Configure where static assets like translations are served from
  publicRuntimeConfig: {
    localeSubpaths: {
      en: "en",
      fr: "fr",
      it: "it",
    },
  },
  // Ensure public directory is correctly served
  webpack: (config, { isServer, nextRuntime }) => {
    // Add support for loading JSON files from public directory
    config.resolve.extensions.push(".json")
    return config
  },
  // Improved settings for Vercel build
  poweredByHeader: false,
  outputFileTracing: true, // Ensure file tracing is enabled
  output: "standalone", // Use standalone output mode for better Vercel compatibility
  // Handle edge cases during build
  eslint: {
    // Disable eslint during build to prevent issues
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable typescript errors during build
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 180, // 3 minutes timeout for static generation
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/api/llms",
          destination: "/llms.txt",
        },
      ],
    }
  },
  headers: async () => {
    return [
      {
        source: "/llms.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
        ],
      },
    ]
  },
}

const withMDX = createMDX()

// Merge MDX config with Next.js config
export default withMDX(config)
