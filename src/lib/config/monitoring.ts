/**
 * Performance Monitoring Configuration
 *
 * Configures performance monitoring, metrics collection, and alerting
 * for Core Web Vitals, API performance, and system health.
 */

import { env } from "./env"

export interface PerformanceConfig {
  // Core Web Vitals monitoring
  webVitals: {
    enabled: boolean
    sampleRate: number // 0-1
    thresholds: {
      lcp: number // Largest Contentful Paint (ms)
      fid: number // First Input Delay (ms)
      cls: number // Cumulative Layout Shift
      fcp: number // First Contentful Paint (ms)
      ttfb: number // Time to First Byte (ms)
    }
    reportInterval: number // seconds
  }

  // API performance monitoring
  api: {
    enabled: boolean
    sampleRate: number
    thresholds: {
      responseTime: number // ms
      errorRate: number // percentage
      throughput: number // requests per second
    }
    trackEndpoints: string[]
    excludeEndpoints: string[]
  }

  // Resource monitoring
  resources: {
    enabled: boolean
    trackImages: boolean
    trackFonts: boolean
    trackScripts: boolean
    trackStyles: boolean
    thresholds: {
      loadTime: number // ms
      size: number // bytes
    }
  }

  // Error monitoring
  errors: {
    enabled: boolean
    trackJSErrors: boolean
    trackApiErrors: boolean
    trackNetworkErrors: boolean
    sampleRate: number
    ignoredErrors: string[] // Error message patterns to ignore
  }

  // Performance budgets
  budgets: {
    enabled: boolean
    bundle: {
      maxSize: number // bytes
      maxChunks: number
    }
    runtime: {
      maxMemoryUsage: number // MB
      maxCPUUsage: number // percentage
    }
    network: {
      maxRequests: number
      maxTransferSize: number // bytes
    }
  }

  // Reporting configuration
  reporting: {
    console: boolean
    analytics: boolean
    webhook?: {
      url: string
      headers?: Record<string, string>
      batchSize: number
      batchTimeout: number // ms
    }
  }
}

export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url?: string
  userAgent?: string
  connectionType?: string
  tags?: Record<string, string>
}

export interface PerformanceReport {
  period: {
    start: number
    end: number
  }
  webVitals: {
    lcp: { p50: number; p75: number; p95: number }
    fid: { p50: number; p75: number; p95: number }
    cls: { p50: number; p75: number; p95: number }
    fcp: { p50: number; p75: number; p95: number }
    ttfb: { p50: number; p75: number; p95: number }
  }
  api: {
    averageResponseTime: number
    errorRate: number
    throughput: number
    slowestEndpoints: Array<{ endpoint: string; averageTime: number }>
  }
  resources: {
    totalSize: number
    totalRequests: number
    slowestResources: Array<{ url: string; loadTime: number; size: number }>
  }
  errors: {
    total: number
    byType: Record<string, number>
    topErrors: Array<{ message: string; count: number; lastSeen: number }>
  }
}

class PerformanceMonitoringManager {
  private static instance: PerformanceMonitoringManager
  private config: PerformanceConfig
  private metrics: PerformanceMetric[] = []
  private isInitialized = false

  private constructor() {
    this.config = this.createConfig()
  }

  static getInstance(): PerformanceMonitoringManager {
    if (!PerformanceMonitoringManager.instance) {
      PerformanceMonitoringManager.instance = new PerformanceMonitoringManager()
    }
    return PerformanceMonitoringManager.instance
  }

  private createConfig(): PerformanceConfig {
    const isProduction = env.NODE_ENV === "production"
    const isDevelopment = env.NODE_ENV === "development"

    return {
      // Core Web Vitals - Constitution requires strict monitoring
      webVitals: {
        enabled: env.ENABLE_PERFORMANCE_MONITORING,
        sampleRate: env.PERFORMANCE_SAMPLE_RATE,
        thresholds: {
          // Constitution targets: LCP < 1.2s, FID < 100ms, CLS < 0.1
          lcp: 1200, // 1.2 seconds
          fid: 100, // 100ms
          cls: 0.1, // 0.1
          fcp: 1000, // 1 second
          ttfb: 600, // 600ms
        },
        reportInterval: isProduction ? 60 : 300, // 1min prod, 5min dev
      },

      // API monitoring
      api: {
        enabled: true,
        sampleRate: isProduction ? 0.1 : 1.0, // 10% prod, 100% dev
        thresholds: {
          responseTime: isProduction ? 2000 : 5000, // 2s prod, 5s dev
          errorRate: 5, // 5% error rate threshold
          throughput: 100, // 100 requests/second
        },
        trackEndpoints: ["/api/content/blog", "/api/content/projects", "/api/content/search", "/api/content/sync"],
        excludeEndpoints: ["/api/health", "/_next/static", "/favicon.ico"],
      },

      // Resource monitoring
      resources: {
        enabled: env.ENABLE_PERFORMANCE_MONITORING,
        trackImages: true,
        trackFonts: true,
        trackScripts: true,
        trackStyles: true,
        thresholds: {
          loadTime: 3000, // 3 seconds
          size: 1024 * 1024, // 1MB
        },
      },

      // Error monitoring
      errors: {
        enabled: true,
        trackJSErrors: true,
        trackApiErrors: true,
        trackNetworkErrors: true,
        sampleRate: isProduction ? 0.2 : 1.0, // 20% prod, 100% dev
        ignoredErrors: ["Script error.", "Network request failed", "ResizeObserver loop limit exceeded"],
      },

      // Performance budgets
      budgets: {
        enabled: isProduction,
        bundle: {
          maxSize: 500 * 1024, // 500KB
          maxChunks: 10,
        },
        runtime: {
          maxMemoryUsage: 100, // 100MB
          maxCPUUsage: 80, // 80%
        },
        network: {
          maxRequests: 50,
          maxTransferSize: 2 * 1024 * 1024, // 2MB
        },
      },

      // Reporting
      reporting: {
        console: isDevelopment,
        analytics: isProduction,
        webhook: process.env.PERFORMANCE_WEBHOOK_URL
          ? {
              url: process.env.PERFORMANCE_WEBHOOK_URL,
              headers: {
                "Content-Type": "application/json",
                ...(process.env.PERFORMANCE_WEBHOOK_AUTH && {
                  Authorization: process.env.PERFORMANCE_WEBHOOK_AUTH,
                }),
              },
              batchSize: 50,
              batchTimeout: 5000, // 5 seconds
            }
          : undefined,
      },
    }
  }

  getConfig(): PerformanceConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  // Initialize monitoring
  initialize(): void {
    if (this.isInitialized || typeof window === "undefined") {
      return
    }

    this.initializeWebVitalsMonitoring()
    this.initializeResourceMonitoring()
    this.initializeErrorMonitoring()
    this.isInitialized = true
  }

  private initializeWebVitalsMonitoring(): void {
    if (!this.config.webVitals.enabled) return

    // This would integrate with web-vitals library
    // For now, just set up the framework
    if (typeof window !== "undefined") {
      // Monitor CLS (Cumulative Layout Shift)
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "layout-shift") {
            const layoutShiftEntry = entry as PerformanceEntry & {
              value: number
              hadRecentInput: boolean
            }
            if (!layoutShiftEntry.hadRecentInput) {
              this.recordMetric("cls", layoutShiftEntry.value)
            }
          }
        }
      })

      try {
        observer.observe({ type: "layout-shift", buffered: true })
      } catch {
        // Layout shift observer not supported
      }
    }
  }

  private initializeResourceMonitoring(): void {
    if (!this.config.resources.enabled || typeof window === "undefined") return

    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "resource") {
          const resourceEntry = entry as PerformanceResourceTiming
          this.recordResourceMetric(resourceEntry)
        }
      }
    })

    try {
      observer.observe({ type: "resource", buffered: true })
    } catch {
      // Resource observer not supported
    }
  }

  private initializeErrorMonitoring(): void {
    if (!this.config.errors.enabled || typeof window === "undefined") return

    // Global error handler
    window.addEventListener("error", event => {
      if (this.shouldIgnoreError(event.message)) return

      this.recordErrorMetric({
        type: "javascript",
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", event => {
      this.recordErrorMetric({
        type: "promise",
        message: event.reason?.toString() || "Unhandled promise rejection",
      })
    })
  }

  // Metric recording
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.shouldSample()) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      tags,
    }

    this.metrics.push(metric)
    this.reportMetric(metric)
  }

  private recordResourceMetric(entry: PerformanceResourceTiming): void {
    const loadTime = entry.responseEnd - entry.requestStart
    const size = entry.transferSize || entry.encodedBodySize

    // Check against thresholds
    if (loadTime > this.config.resources.thresholds.loadTime) {
      this.recordMetric("resource.slow_load", loadTime, {
        url: entry.name,
        type: this.getResourceType(entry.name),
      })
    }

    if (size > this.config.resources.thresholds.size) {
      this.recordMetric("resource.large_size", size, {
        url: entry.name,
        type: this.getResourceType(entry.name),
      })
    }
  }

  private recordErrorMetric(error: {
    type: string
    message: string
    filename?: string
    lineno?: number
    colno?: number
  }): void {
    this.recordMetric("error", 1, {
      type: error.type,
      message: error.message.substring(0, 200), // Truncate long messages
      ...(error.filename && { filename: error.filename }),
      ...(error.lineno && { line: error.lineno.toString() }),
      ...(error.colno && { column: error.colno.toString() }),
    })
  }

  private shouldSample(): boolean {
    return Math.random() < this.config.webVitals.sampleRate
  }

  private shouldIgnoreError(message: string): boolean {
    return this.config.errors.ignoredErrors.some(pattern => message.includes(pattern))
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return "image"
    if (url.match(/\.(woff|woff2|ttf|otf)$/i)) return "font"
    if (url.match(/\.js$/i)) return "script"
    if (url.match(/\.css$/i)) return "style"
    return "other"
  }

  private reportMetric(metric: PerformanceMetric): void {
    if (this.config.reporting.console && env.NODE_ENV === "development") {
      // Development-only performance logging
      if (env.ENABLE_DEBUG_LOGGING) {
        // eslint-disable-next-line no-console
        console.log("Performance Metric:", metric)
      }
    }

    // In a real implementation, this would send to analytics service
    // or webhook endpoint
  }

  // Threshold checking
  checkWebVitalsThresholds(): {
    passing: boolean
    violations: Array<{ metric: string; value: number; threshold: number }>
  } {
    const violations: Array<{ metric: string; value: number; threshold: number }> = []
    const recent = this.getRecentMetrics(60000) // Last minute

    // Check each Web Vital threshold
    Object.entries(this.config.webVitals.thresholds).forEach(([metric, threshold]) => {
      const values = recent.filter(m => m.name === metric).map(m => m.value)
      if (values.length > 0) {
        const p75 = this.calculatePercentile(values, 0.75)
        if (p75 > threshold) {
          violations.push({ metric, value: p75, threshold })
        }
      }
    })

    return {
      passing: violations.length === 0,
      violations,
    }
  }

  // Utility methods
  private getRecentMetrics(timeWindowMs: number): PerformanceMetric[] {
    const cutoff = Date.now() - timeWindowMs
    return this.metrics.filter(m => m.timestamp > cutoff)
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * percentile) - 1
    return sorted[index] || 0
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  clearMetrics(): void {
    this.metrics = []
  }

  // Health check
  isHealthy(): boolean {
    const check = this.checkWebVitalsThresholds()
    return check.passing
  }

  getHealthReport(): {
    isHealthy: boolean
    webVitals: { passing: boolean; violations: Array<{ metric: string; value: number; threshold: number }> }
    recommendations: string[]
  } {
    const webVitals = this.checkWebVitalsThresholds()
    const recommendations: string[] = []

    if (!webVitals.passing) {
      webVitals.violations.forEach(violation => {
        recommendations.push(
          `Improve ${violation.metric}: current ${violation.value}ms exceeds threshold ${violation.threshold}ms`
        )
      })
    }

    return {
      isHealthy: webVitals.passing,
      webVitals,
      recommendations,
    }
  }
}

// Singleton instance
const performanceMonitoringManager = PerformanceMonitoringManager.getInstance()

// Export the configuration
export const performanceConfig = performanceMonitoringManager.getConfig()

// Export commonly used methods
export const {
  getConfig: getPerformanceConfig,
  updateConfig: updatePerformanceConfig,
  initialize: initializePerformanceMonitoring,
  recordMetric,
  checkWebVitalsThresholds,
  getMetrics: getPerformanceMetrics,
  clearMetrics: clearPerformanceMetrics,
  isHealthy: isPerformanceHealthy,
  getHealthReport: getPerformanceHealthReport,
} = performanceMonitoringManager

export default performanceMonitoringManager
