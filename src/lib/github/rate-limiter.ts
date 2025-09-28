// GitHub API rate limiting service
import type { GitHubRateLimit } from "@/types/github"

export interface RateLimitConfig {
  maxRequestsPerHour: number
  maxRequestsPerMinute: number
  retryAfterSeconds: number
  enableAdaptiveBackoff: boolean
  warningThreshold: number // Percentage of limit before warning
}

export interface RateLimitState {
  remaining: number
  limit: number
  resetTime: Date
  lastUpdated: Date
  requestCount: number
}

export interface RateLimitCheck {
  allowed: boolean
  retryAfter?: number // seconds to wait
  warning?: string
  currentState: RateLimitState
}

export class RateLimiter {
  private config: RateLimitConfig
  private state: RateLimitState
  private requestQueue: Array<{ timestamp: Date; resolved: boolean }> = []
  private backoffMultiplier = 1

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      maxRequestsPerHour: 5000, // GitHub's default
      maxRequestsPerMinute: 60, // Conservative minute limit
      retryAfterSeconds: 60,
      enableAdaptiveBackoff: true,
      warningThreshold: 80, // Warn at 80% of limit
      ...config,
    }

    this.state = {
      remaining: this.config.maxRequestsPerHour,
      limit: this.config.maxRequestsPerHour,
      resetTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      lastUpdated: new Date(),
      requestCount: 0,
    }
  }

  /**
   * Check if a request is allowed based on current rate limits
   */
  checkRateLimit(): RateLimitCheck {
    this.cleanupOldRequests()

    const now = new Date()
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const minuteAgo = new Date(now.getTime() - 60 * 1000)

    // Count recent requests
    const requestsLastHour = this.requestQueue.filter(req => req.timestamp > hourAgo).length
    const requestsLastMinute = this.requestQueue.filter(req => req.timestamp > minuteAgo).length

    // Check if we're at limits
    const hourlyLimitExceeded = requestsLastHour >= this.config.maxRequestsPerHour
    const minuteLimitExceeded = requestsLastMinute >= this.config.maxRequestsPerMinute

    if (hourlyLimitExceeded || minuteLimitExceeded) {
      const retryAfter = this.calculateRetryAfter()
      return {
        allowed: false,
        retryAfter,
        currentState: this.state,
      }
    }

    // Check warning threshold
    let warning: string | undefined
    const hourlyUsagePercent = (requestsLastHour / this.config.maxRequestsPerHour) * 100
    const minuteUsagePercent = (requestsLastMinute / this.config.maxRequestsPerMinute) * 100

    if (hourlyUsagePercent > this.config.warningThreshold) {
      warning = `Rate limit warning: ${hourlyUsagePercent.toFixed(1)}% of hourly limit used`
    } else if (minuteUsagePercent > this.config.warningThreshold) {
      warning = `Rate limit warning: ${minuteUsagePercent.toFixed(1)}% of minute limit used`
    }

    return {
      allowed: true,
      warning,
      currentState: this.state,
    }
  }

  /**
   * Record a successful request
   */
  recordRequest(githubRateLimit?: GitHubRateLimit): void {
    const now = new Date()

    // Add to request queue
    this.requestQueue.push({ timestamp: now, resolved: true })

    // Update state with GitHub's actual rate limit if provided
    if (githubRateLimit) {
      this.state = {
        remaining: githubRateLimit.remaining,
        limit: githubRateLimit.limit,
        resetTime: new Date(githubRateLimit.reset * 1000),
        lastUpdated: now,
        requestCount: githubRateLimit.used,
      }

      // Reset backoff on successful request
      this.backoffMultiplier = 1
    }

    this.cleanupOldRequests()
  }

  /**
   * Record a failed request (for backoff calculation)
   */
  recordFailure(): void {
    if (this.config.enableAdaptiveBackoff) {
      this.backoffMultiplier = Math.min(this.backoffMultiplier * 2, 16) // Max 16x backoff
    }
  }

  /**
   * Calculate how long to wait before retry
   */
  private calculateRetryAfter(): number {
    const now = new Date()

    // If we have GitHub's reset time, use it
    if (this.state.resetTime > now) {
      const secondsUntilReset = Math.ceil((this.state.resetTime.getTime() - now.getTime()) / 1000)
      return Math.min(secondsUntilReset, this.config.retryAfterSeconds * this.backoffMultiplier)
    }

    // Otherwise use configured retry time with backoff
    return this.config.retryAfterSeconds * this.backoffMultiplier
  }

  /**
   * Clean up old requests from queue
   */
  private cleanupOldRequests(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    this.requestQueue = this.requestQueue.filter(req => req.timestamp > oneHourAgo)
  }

  /**
   * Get current rate limit status
   */
  getStatus(): RateLimitState & {
    requestsLastHour: number
    requestsLastMinute: number
    backoffMultiplier: number
  } {
    this.cleanupOldRequests()

    const now = new Date()
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const minuteAgo = new Date(now.getTime() - 60 * 1000)

    return {
      ...this.state,
      requestsLastHour: this.requestQueue.filter(req => req.timestamp > hourAgo).length,
      requestsLastMinute: this.requestQueue.filter(req => req.timestamp > minuteAgo).length,
      backoffMultiplier: this.backoffMultiplier,
    }
  }

  /**
   * Wait for rate limit to reset
   */
  async waitForReset(): Promise<void> {
    const check = this.checkRateLimit()
    if (check.retryAfter) {
      await new Promise(resolve => setTimeout(resolve, check.retryAfter! * 1000))
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Reset rate limiter state (useful for testing)
   */
  reset(): void {
    this.requestQueue = []
    this.backoffMultiplier = 1
    this.state = {
      remaining: this.config.maxRequestsPerHour,
      limit: this.config.maxRequestsPerHour,
      resetTime: new Date(Date.now() + 60 * 60 * 1000),
      lastUpdated: new Date(),
      requestCount: 0,
    }
  }

  /**
   * Check if we're approaching rate limits
   */
  isApproachingLimit(): boolean {
    const status = this.getStatus()
    const hourlyUsagePercent = (status.requestsLastHour / this.config.maxRequestsPerHour) * 100
    return hourlyUsagePercent > this.config.warningThreshold
  }
}

// Default rate limiter instance
export const githubRateLimiter = new RateLimiter()

// Decorator function for rate-limited methods
export function withRateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  rateLimiter: RateLimiter = githubRateLimiter
): T {
  return (async (...args: Parameters<T>) => {
    const check = rateLimiter.checkRateLimit()

    if (!check.allowed) {
      if (check.retryAfter) {
        await new Promise(resolve => setTimeout(resolve, check.retryAfter! * 1000))
      }
      throw new Error(`Rate limit exceeded. Retry after ${check.retryAfter} seconds`)
    }

    if (check.warning) {
      // Log warning in production environments
      if (process.env.NODE_ENV !== "test") {
        // eslint-disable-next-line no-console
        console.warn(check.warning)
      }
    }

    try {
      const result = await fn(...args)
      rateLimiter.recordRequest()
      return result
    } catch (error) {
      rateLimiter.recordFailure()
      throw error
    }
  }) as T
}
