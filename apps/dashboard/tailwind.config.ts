import sharedConfig from "@package/tailwind-config/tailwind.config"

import type { Config } from "tailwindcss"

const config: Pick<Config, "presets"> = {
  presets: [
    {
      ...sharedConfig,
      content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        // h/t to https://www.willliu.com/blog/Why-your-Tailwind-styles-aren-t-working-in-your-Turborepo
        "../../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}",
        "../../packages/utils/src/**/*{.js,.ts,.jsx,.tsx}",
      ],
    },
  ],
}

export default config
