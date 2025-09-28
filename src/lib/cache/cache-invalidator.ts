// Cache invalidation service
import type { CacheManager } from "./cache-manager"

export interface InvalidationRule {
  pattern: string | RegExp // Key pattern to match
  type: "exact" | "prefix" | "suffix" | "contains" | "regex"
  reason: string // Why this rule exists
  priority: number // Higher priority rules run first
}

export interface InvalidationEvent {
  trigger: "content-update" | "manual" | "scheduled" | "error"
  keys: string[]
  timestamp: Date
  reason: string
  success: boolean
  deletedCount: number
  errorCount: number
}

export interface InvalidationConfig {
  enableAutomaticInvalidation: boolean
  maxInvalidationHistory: number
  batchSize: number // Process invalidations in batches
  throttleMs: number // Delay between batches
}

export class CacheInvalidator {
  private cacheManager: CacheManager
  private config: InvalidationConfig
  private rules: InvalidationRule[] = []
  private history: InvalidationEvent[] = []
  private isProcessing = false

  constructor(cacheManager: CacheManager, config?: Partial<InvalidationConfig>) {
    this.cacheManager = cacheManager
    this.config = {
      enableAutomaticInvalidation: true,
      maxInvalidationHistory: 1000,
      batchSize: 50,
      throttleMs: 100,
      ...config,
    }

    this.setupDefaultRules()
  }

  /**
   * Setup default invalidation rules
   */
  private setupDefaultRules(): void {
    this.addRule({
      pattern: "content:blog:",
      type: "prefix",
      reason: "Blog content updated",
      priority: 100,
    })

    this.addRule({
      pattern: "content:project:",
      type: "prefix",
      reason: "Project content updated",
      priority: 100,
    })

    this.addRule({
      pattern: "search:",
      type: "prefix",
      reason: "Search index updated",
      priority: 90,
    })

    this.addRule({
      pattern: ":list",
      type: "suffix",
      reason: "List cache invalidation",
      priority: 80,
    })

    this.addRule({
      pattern: /sync:.*/,
      type: "regex",
      reason: "Sync operation cache cleanup",
      priority: 70,
    })
  }

  /**
   * Add invalidation rule
   */
  addRule(rule: InvalidationRule): void {
    this.rules.push(rule)
    this.rules.sort((a, b) => b.priority - a.priority) // Sort by priority desc
  }

  /**
   * Remove invalidation rule
   */
  removeRule(pattern: string | RegExp): boolean {
    const initialLength = this.rules.length
    this.rules = this.rules.filter(rule => rule.pattern.toString() !== pattern.toString())
    return this.rules.length < initialLength
  }

  /**
   * Get all invalidation rules
   */
  getRules(): InvalidationRule[] {
    return [...this.rules]
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidateByPattern(
    pattern: string | RegExp,
    type: InvalidationRule["type"] = "prefix",
    reason: string = "Manual invalidation"
  ): Promise<InvalidationEvent> {
    const startTime = Date.now()
    const matchedKeys: string[] = []
    let deletedCount = 0
    let errorCount = 0

    try {
      // Get all cache keys from both memory and file cache
      const allKeys = await this.getAllCacheKeys()

      // Find matching keys
      for (const key of allKeys) {
        if (this.matchesPattern(key, pattern, type)) {
          matchedKeys.push(key)
        }
      }

      // Delete matched keys in batches
      if (matchedKeys.length > 0) {
        const result = await this.batchDelete(matchedKeys)
        deletedCount = result.deletedCount
        errorCount = result.errorCount
      }

      const event: InvalidationEvent = {
        trigger: "manual",
        keys: matchedKeys,
        timestamp: new Date(),
        reason,
        success: errorCount === 0,
        deletedCount,
        errorCount,
      }

      this.recordEvent(event)
      return event
    } catch (error) {
      const event: InvalidationEvent = {
        trigger: "manual",
        keys: matchedKeys,
        timestamp: new Date(),
        reason: `${reason} (failed)`,
        success: false,
        deletedCount,
        errorCount: matchedKeys.length,
      }

      this.recordEvent(event)
      console.error("Cache invalidation error:", error)
      return event
    }
  }

  /**
   * Invalidate specific keys
   */
  async invalidateKeys(keys: string[], reason: string = "Manual key invalidation"): Promise<InvalidationEvent> {
    const result = await this.batchDelete(keys)

    const event: InvalidationEvent = {
      trigger: "manual",
      keys,
      timestamp: new Date(),
      reason,
      success: result.errorCount === 0,
      deletedCount: result.deletedCount,
      errorCount: result.errorCount,
    }

    this.recordEvent(event)
    return event
  }

  /**
   * Invalidate cache when content is updated
   */
  async invalidateOnContentUpdate(
    contentType: "blog" | "project" | "all",
    slug?: string
  ): Promise<InvalidationEvent[]> {
    if (!this.config.enableAutomaticInvalidation) {
      return []
    }

    const events: InvalidationEvent[] = []

    try {
      // Invalidate specific content if slug provided
      if (slug) {
        const contentEvent = await this.invalidateByPattern(
          `content:${contentType}:${slug}`,
          "prefix",
          `Content updated: ${contentType}/${slug}`
        )
        events.push(contentEvent)
      }

      // Invalidate list caches
      if (contentType === "blog" || contentType === "all") {
        const blogListEvent = await this.invalidateByPattern(
          "content:blog:list",
          "prefix",
          "Blog list cache invalidation"
        )
        events.push(blogListEvent)
      }

      if (contentType === "project" || contentType === "all") {
        const projectListEvent = await this.invalidateByPattern(
          "content:project:list",
          "prefix",
          "Project list cache invalidation"
        )
        events.push(projectListEvent)
      }

      // Invalidate search cache
      const searchEvent = await this.invalidateByPattern(
        "search:",
        "prefix",
        "Search cache invalidation after content update"
      )
      events.push(searchEvent)

      return events
    } catch (error) {
      console.error("Content update invalidation error:", error)
      return events
    }
  }

  /**
   * Scheduled cache cleanup
   */
  async scheduledCleanup(): Promise<InvalidationEvent> {
    const allKeys = await this.getAllCacheKeys()
    const expiredKeys: string[] = []

    // This is a simplified approach - in practice, you'd check expiration
    // by examining cache entries, but that would be expensive for all keys

    const result = await this.batchDelete(expiredKeys)

    const event: InvalidationEvent = {
      trigger: "scheduled",
      keys: expiredKeys,
      timestamp: new Date(),
      reason: "Scheduled cache cleanup",
      success: result.errorCount === 0,
      deletedCount: result.deletedCount,
      errorCount: result.errorCount,
    }

    this.recordEvent(event)
    return event
  }

  /**
   * Get invalidation history
   */
  getHistory(limit: number = 100): InvalidationEvent[] {
    return this.history.slice(-limit)
  }

  /**
   * Clear invalidation history
   */
  clearHistory(): void {
    this.history = []
  }

  /**
   * Check if key matches pattern
   */
  private matchesPattern(key: string, pattern: string | RegExp, type: InvalidationRule["type"]): boolean {
    switch (type) {
      case "exact":
        return key === pattern

      case "prefix":
        return typeof pattern === "string" && key.startsWith(pattern)

      case "suffix":
        return typeof pattern === "string" && key.endsWith(pattern)

      case "contains":
        return typeof pattern === "string" && key.includes(pattern)

      case "regex":
        if (pattern instanceof RegExp) {
          return pattern.test(key)
        }
        if (typeof pattern === "string") {
          return new RegExp(pattern).test(key)
        }
        return false

      default:
        return false
    }
  }

  /**
   * Get all cache keys from both memory and file cache
   */
  private async getAllCacheKeys(): Promise<string[]> {
    const keys = new Set<string>()

    try {
      // Get memory cache keys (implementation depends on MemoryCache interface)
      const memoryKeys = this.cacheManager["memoryCache"]?.getKeys?.() || []
      memoryKeys.forEach(key => keys.add(key))

      // Get file cache keys
      const fileKeys = (await this.cacheManager["fileCache"]?.getKeys?.()) || []
      fileKeys.forEach(key => keys.add(key))
    } catch (error) {
      console.error("Error getting cache keys:", error)
    }

    return Array.from(keys)
  }

  /**
   * Delete keys in batches
   */
  private async batchDelete(keys: string[]): Promise<{ deletedCount: number; errorCount: number }> {
    if (this.isProcessing) {
      throw new Error("Cache invalidation is already in progress")
    }

    this.isProcessing = true
    let deletedCount = 0
    let errorCount = 0

    try {
      // Process keys in batches
      for (let i = 0; i < keys.length; i += this.config.batchSize) {
        const batch = keys.slice(i, i + this.config.batchSize)

        const results = await Promise.all(
          batch.map(async key => {
            try {
              const success = await this.cacheManager.delete(key)
              return success
            } catch {
              return false
            }
          })
        )

        deletedCount += results.filter(Boolean).length
        errorCount += results.filter(r => !r).length

        // Throttle between batches
        if (i + this.config.batchSize < keys.length && this.config.throttleMs > 0) {
          await new Promise(resolve => setTimeout(resolve, this.config.throttleMs))
        }
      }
    } finally {
      this.isProcessing = false
    }

    return { deletedCount, errorCount }
  }

  /**
   * Record invalidation event
   */
  private recordEvent(event: InvalidationEvent): void {
    this.history.push(event)

    // Keep history within limits
    if (this.history.length > this.config.maxInvalidationHistory) {
      this.history = this.history.slice(-this.config.maxInvalidationHistory)
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<InvalidationConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): InvalidationConfig {
    return { ...this.config }
  }
}

// Note: This will be instantiated where cacheManager is available
// export const cacheInvalidator = new CacheInvalidator(cacheManager)
