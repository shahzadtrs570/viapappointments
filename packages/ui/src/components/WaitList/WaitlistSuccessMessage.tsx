import { motion } from "framer-motion"

import { type WaitlistFormConfig } from "./types"

interface WaitlistSuccessMessageProps {
  config: WaitlistFormConfig
}

export function WaitlistSuccessMessage({
  config,
}: WaitlistSuccessMessageProps) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-background/95"
      initial={{ opacity: 0, scale: 0.8 }}
    >
      <div className="text-center">
        <motion.div
          animate={{ scale: 1 }}
          className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10"
          initial={{ scale: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
        >
          <svg
            className="size-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </motion.div>
        <h3 className="mb-2 text-2xl font-semibold">
          {config.successMessage?.title}
        </h3>
        <div className="text-muted-foreground">
          {config.successMessage?.description}
        </div>
      </div>
    </motion.div>
  )
}
