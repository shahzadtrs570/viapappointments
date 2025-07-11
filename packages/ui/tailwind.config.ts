// tailwind config is required for editor support
import sharedConfig from "@package/tailwind-config/tailwind.config"

import type { Config } from "tailwindcss"

const config: Pick<Config, "presets"> = {
  presets: [sharedConfig],
}

export default config
