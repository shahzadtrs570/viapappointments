/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { initializeLogger } from "../../../../packages/logger/src/lib/logger"

export const logger = initializeLogger({
  webhookUrl: process.env.GOOGLE_CHAT_WEBHOOK_URL || "",
  environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
  service: "Client",
  enableConsoleLog: true,
})

// Test the logger
// try {
//   logger
//     .info("Server started", {
//       app: "storykraft",
//       env: process.env.NODE_ENV || "development",
//       timestamp: new Date().toISOString(),
//     })
//     .catch(console.error)
// } catch (error) {
//   console.error("Failed to send initial log:", error)
// }
