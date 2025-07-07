import sharedConfig from "@package/tailwind-config/tailwind.config"
import { createPreset } from "fumadocs-ui/tailwind-plugin"

import type { Config } from "tailwindcss"

const config: Pick<Config, "presets"> = {
  presets: [
    createPreset(),
    {
      ...sharedConfig,
      content: [
        // h/t to https://www.willliu.com/blog/Why-your-Tailwind-styles-aren-t-working-in-your-Turborepo
        "./src/**/*.{js,ts,jsx,tsx,md,mdx}",
        "../../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}",
        "../../packages/utils/src/**/*{.js,.ts,.jsx,.tsx}",

        // Make fumadocs-ui styles available to the app
        "./node_modules/fumadocs-ui/dist/**/*.js",
        // Enable tailwind for MDX files
        "./content/**/*.{js,ts,jsx,tsx,md,mdx}",
        "./mdx-components.tsx",
      ],
    },
  ],
}

export default config
