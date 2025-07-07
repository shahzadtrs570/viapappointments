export interface ErrorMetadata {
  taskId?: string
  referenceId?: string
  statusCode?: number
  provider?: string
  endpoint?: string
  stackTrace?: string
  userId?: string
  additionalInfo?: Record<string, unknown>
  retryAfter?: number
  scheduledFor?: string
  app?: string
  env?: string
  timestamp?: string
  error?: string
  params?: Record<string, unknown>
  currentClass?: string
  currentMethod?: string
  currentFile?: string
  source?: "client" | "server"
  [key: string]: any
}

export interface LoggerConfig {
  webhookUrl: string
  environment: string
  service: string
  enableConsoleLog?: boolean
  source?: string
}

export interface LogMessage {
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL"
  message: string
  metadata?: ErrorMetadata
  timestamp?: string
}
