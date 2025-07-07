/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@package/auth",
    "@package/api",
    "@package/db",
    "@package/ui",
    "@package/validations",
    "@package/email",
    "@package/utils",
    "@package/tailwind-config",
    "@package/eslint-config",
    "@package/typescript-config",
    "@package/prettier-config",
  ],
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/v2",
  //       permanent: true, // Use true for a 308 redirect, false for a 307
  //     },
  //   ]
  // },
}

module.exports = nextConfig
