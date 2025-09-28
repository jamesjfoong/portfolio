import React from "react"

import { env } from "../config/env"

// Error severity levels
export type ErrorSeverity = "low" | "medium" | "high" | "critical"

// Error categories
export type ErrorCategory =
  | "network"
  | "validation"
  | "authentication"
  | "authorization"
  | "database"
  | "filesystem"
  | "external_api"
  | "user_input"
  | "system"
  | "unknown"

// Error context information
export interface ErrorContext {
  userId?: string
  sessionId?: string
  requestId?: string
  userAgent?: string
  url?: string
  timestamp?: number
  component?: string
  action?: string
  metadata?: Record<string, unknown>
}

// Structured error information
export interface ErrorInfo {
  id: string
  message: string
  stack?: string
  severity: ErrorSeverity
  category: ErrorCategory
  context: ErrorContext
  fingerprint?: string
  count?: number
  firstSeen?: number
  lastSeen?: number
}

// Error reporting options
export interface ErrorReportingOptions {
  shouldReport?: boolean
  includeStack?: boolean
  includeContext?: boolean
  tags?: string[]
  extra?: Record<string, unknown>
}

// Error handler configuration
export interface ErrorHandlerConfig {
  enableConsoleLogging: boolean
  enableRemoteLogging: boolean
  maxErrorsPerSession: number
  ignoredErrorPatterns: RegExp[]
  sensitiveDataPatterns: RegExp[]
  environment: string
}

class ErrorLogger {
  private static instance: ErrorLogger
  private errors: Map<string, ErrorInfo> = new Map()
  private config: ErrorHandlerConfig
  private sessionErrorCount = 0

  private constructor() {
    this.config = this.createConfig()
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  private createConfig(): ErrorHandlerConfig {
    return {
      enableConsoleLogging: env.NODE_ENV === "development",
      enableRemoteLogging: env.ENABLE_ERROR_REPORTING,
      maxErrorsPerSession: 50,
      ignoredErrorPatterns: [
        /Script error/i,
        /Network request failed/i,
        /ResizeObserver loop limit exceeded/i,
        /Non-Error promise rejection captured/i,
      ],
      sensitiveDataPatterns: [/password/i, /token/i, /api[_-]?key/i, /secret/i, /authorization/i],
      environment: env.NODE_ENV,
    }
  }

  /**
   * Log an error with comprehensive information
   */
  logError(
    error: Error | string,
    options: {
      severity?: ErrorSeverity
      category?: ErrorCategory
      context?: Partial<ErrorContext>
      reportingOptions?: ErrorReportingOptions
    } = {}
  ): string {
    const { severity = "medium", category = "unknown", context = {}, reportingOptions = {} } = options

    // Check session error limit
    if (this.sessionErrorCount >= this.config.maxErrorsPerSession) {
      return "session-limit-exceeded"
    }

    const errorInfo = this.createErrorInfo(error, severity, category, context)

    // Check if error should be ignored
    if (this.shouldIgnoreError(errorInfo)) {
      return errorInfo.id
    }

    // Store or update error
    const existingError = this.errors.get(errorInfo.fingerprint!)
    if (existingError) {
      existingError.count = (existingError.count || 1) + 1
      existingError.lastSeen = Date.now()
      this.errors.set(errorInfo.fingerprint!, existingError)
    } else {
      this.errors.set(errorInfo.fingerprint!, errorInfo)
    }

    this.sessionErrorCount++

    // Log to console in development
    if (this.config.enableConsoleLogging) {
      this.logToConsole(errorInfo)
    }

    // Report to external service
    if (this.config.enableRemoteLogging && reportingOptions.shouldReport !== false) {
      this.reportError(errorInfo, reportingOptions)
    }

    return errorInfo.id
  }

  private createErrorInfo(
    error: Error | string,
    severity: ErrorSeverity,
    category: ErrorCategory,
    context: Partial<ErrorContext>
  ): ErrorInfo {
    const timestamp = Date.now()
    const errorMessage = typeof error === "string" ? error : error.message
    const errorStack = typeof error === "object" ? error.stack : undefined

    const fullContext: ErrorContext = {
      timestamp,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      ...context,
    }

    // Generate error fingerprint for deduplication
    const fingerprint = this.generateFingerprint(errorMessage, errorStack, category)

    return {
      id: this.generateErrorId(),
      message: this.sanitizeMessage(errorMessage),
      stack: this.sanitizeStack(errorStack),
      severity,
      category,
      context: fullContext,
      fingerprint,
      count: 1,
      firstSeen: timestamp,
      lastSeen: timestamp,
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateFingerprint(message: string, stack?: string, category?: string): string {
    const key = [message, stack?.split("\n")[0], category].filter(Boolean).join("|")
    return this.simpleHash(key)
  }

  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  private shouldIgnoreError(errorInfo: ErrorInfo): boolean {
    return this.config.ignoredErrorPatterns.some(pattern => pattern.test(errorInfo.message))
  }

  private sanitizeMessage(message: string): string {
    let sanitized = message

    this.config.sensitiveDataPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, "[REDACTED]")
    })

    return sanitized
  }

  private sanitizeStack(stack?: string): string | undefined {
    if (!stack) return undefined

    let sanitized = stack

    this.config.sensitiveDataPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, "[REDACTED]")
    })

    return sanitized
  }

  private logToConsole(errorInfo: ErrorInfo): void {
    const { message, stack, severity, category, context } = errorInfo

    const logLevel = this.getConsoleLogLevel(severity)

    if (logLevel === "error") {
      // eslint-disable-next-line no-console
      console.error(`[${category.toUpperCase()}] ${message}`, {
        severity,
        context,
        ...(stack && { stack }),
      })
    } else if (logLevel === "warn") {
      // eslint-disable-next-line no-console
      console.warn(`[${category.toUpperCase()}] ${message}`, {
        severity,
        context,
        ...(stack && { stack }),
      })
    } else {
      // eslint-disable-next-line no-console
      console.info(`[${category.toUpperCase()}] ${message}`, {
        severity,
        context,
        ...(stack && { stack }),
      })
    }
  }

  private getConsoleLogLevel(severity: ErrorSeverity): "error" | "warn" | "info" {
    switch (severity) {
      case "critical":
      case "high":
        return "error"
      case "medium":
        return "warn"
      case "low":
      default:
        return "info"
    }
  }

  private reportError(errorInfo: ErrorInfo, options: ErrorReportingOptions): void {
    // In a real implementation, this would send to external error reporting service
    // For now, we'll structure the payload that would be sent

    const payload = {
      error: {
        id: errorInfo.id,
        message: errorInfo.message,
        ...(options.includeStack !== false && errorInfo.stack && { stack: errorInfo.stack }),
      },
      severity: errorInfo.severity,
      category: errorInfo.category,
      fingerprint: errorInfo.fingerprint,
      count: errorInfo.count,
      timestamp: errorInfo.firstSeen,
      environment: this.config.environment,
      ...(options.includeContext !== false && { context: errorInfo.context }),
      ...(options.tags && { tags: options.tags }),
      ...(options.extra && { extra: options.extra }),
    }

    // This would typically send to services like Sentry, LogRocket, etc.
    if (env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("Error payload would be sent:", payload)
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(
    filters: {
      severity?: ErrorSeverity[]
      category?: ErrorCategory[]
      since?: number
    } = {}
  ): ErrorInfo[] {
    const errors = Array.from(this.errors.values())

    return errors.filter(error => {
      if (filters.severity && !filters.severity.includes(error.severity)) {
        return false
      }

      if (filters.category && !filters.category.includes(error.category)) {
        return false
      }

      if (filters.since && error.firstSeen! < filters.since) {
        return false
      }

      return true
    })
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number
    bySeverity: Record<ErrorSeverity, number>
    byCategory: Record<ErrorCategory, number>
    recentCount: number
  } {
    const errors = Array.from(this.errors.values())
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000

    const stats = {
      total: errors.length,
      bySeverity: {} as Record<ErrorSeverity, number>,
      byCategory: {} as Record<ErrorCategory, number>,
      recentCount: 0,
    }

    errors.forEach(error => {
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1

      if (error.lastSeen! > oneHourAgo) {
        stats.recentCount++
      }
    })

    return stats
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors.clear()
    this.sessionErrorCount = 0
  }

  /**
   * Set configuration
   */
  updateConfig(updates: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  /**
   * Get configuration
   */
  getConfig(): ErrorHandlerConfig {
    return { ...this.config }
  }
}

// Singleton instance
const errorLogger = ErrorLogger.getInstance()

/**
 * Convenience function to log errors
 */
export function logError(
  error: Error | string,
  options: {
    severity?: ErrorSeverity
    category?: ErrorCategory
    context?: Partial<ErrorContext>
    reportingOptions?: ErrorReportingOptions
  } = {}
): string {
  return errorLogger.logError(error, options)
}

/**
 * Log network errors
 */
export function logNetworkError(
  error: Error | string,
  context: { url?: string; method?: string; status?: number } = {}
): string {
  return logError(error, {
    category: "network",
    severity: "medium",
    context,
  })
}

/**
 * Log validation errors
 */
export function logValidationError(
  error: Error | string,
  context: { field?: string; value?: unknown; rule?: string } = {}
): string {
  return logError(error, {
    category: "validation",
    severity: "low",
    context: {
      metadata: context,
    },
  })
}

/**
 * Log authentication errors
 */
export function logAuthError(error: Error | string, context: { action?: string; userId?: string } = {}): string {
  return logError(error, {
    category: "authentication",
    severity: "high",
    context,
  })
}

/**
 * Log system errors
 */
export function logSystemError(error: Error | string, context: { component?: string; action?: string } = {}): string {
  return logError(error, {
    category: "system",
    severity: "high",
    context,
  })
}

/**
 * Create error boundary handler
 */
export function createErrorBoundaryHandler(
  fallback: (error: Error, errorInfo: { componentStack: string }) => React.ReactNode
) {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
      logError(error, {
        category: "system",
        severity: "high",
        context: {
          component: "ErrorBoundary",
          metadata: { componentStack: errorInfo.componentStack },
        },
      })
    }

    render() {
      if (this.state.hasError && this.state.error) {
        return fallback(this.state.error, { componentStack: "" })
      }

      return this.props.children
    }
  }
}

/**
 * Promise rejection handler
 */
export function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  logError(event.reason instanceof Error ? event.reason : String(event.reason), {
    category: "system",
    severity: "medium",
    context: {
      component: "UnhandledRejection",
    },
  })
}

/**
 * Global error handler
 */
export function handleGlobalError(event: ErrorEvent): void {
  logError(event.error || event.message, {
    category: "system",
    severity: "medium",
    context: {
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    },
  })
}

/**
 * Initialize global error handlers
 */
export function initializeErrorHandlers(): void {
  if (typeof window === "undefined") {
    return
  }

  // Global error handler
  window.addEventListener("error", handleGlobalError)

  // Unhandled promise rejection handler
  window.addEventListener("unhandledrejection", handleUnhandledRejection)
}

// Export singleton methods
export const {
  getErrors,
  getErrorStats,
  clearErrors,
  updateConfig: updateErrorConfig,
  getConfig: getErrorConfig,
} = errorLogger

export default errorLogger
