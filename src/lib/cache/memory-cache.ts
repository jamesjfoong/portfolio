// Memory cache service for GitHub CMS
import type { CacheConfig, CacheEntry, CacheStats } from "@/types/cache"

export class MemoryCache {
  private cache = new Map<string, CacheEntry>()
  private config: CacheConfig
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
  }

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      defaultTtl: 1800, // 30 minutes
      maxSize: 50 * 1024 * 1024, // 50MB
      cleanupInterval: 300, // 5 minutes
      memoryLimit: 100 * 1024 * 1024, // 100MB
      ...config,
    }

    // Start cleanup interval
    this.startCleanup()
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      return null
    }

    // Check if expired
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key)
      this.stats.misses++
      return null
    }

    // Update access statistics
    entry.lastAccessed = new Date()
    entry.hitCount++
    this.stats.hits++

    return entry.data as T
  }

  /**
   * Set item in cache
   */
  set<T>(key: string, data: T, ttl?: number, source: "github" | "processed" | "computed" = "computed"): void {
    const now = new Date()
    const expirationTime = ttl || this.config.defaultTtl

    const entry: CacheEntry<T> = {
      key,
      data,
      createdAt: now,
      expiresAt: new Date(now.getTime() + expirationTime * 1000),
      lastAccessed: now,
      isValid: true,
      source,
      generationTimeMs: 0, // Could be passed as parameter
      hitCount: 0,
    }

    this.cache.set(key, entry)
    this.stats.sets++

    // Check if we need to evict items due to size constraints
    this.enforceMemoryLimits()
  }

  /**
   * Delete item from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key)
    if (deleted) {
      this.stats.deletes++
    }
    return deleted
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values())
    const totalSize = this.getTotalSize()

    return {
      totalEntries: this.cache.size,
      totalSize,
      hitRate: (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100 || 0,
      averageResponseTime: 1, // Mock value - would need actual measurement
      oldestEntry: entries.length > 0 ? new Date(Math.min(...entries.map(e => e.createdAt.getTime()))) : new Date(),
      newestEntry: entries.length > 0 ? new Date(Math.max(...entries.map(e => e.createdAt.getTime()))) : new Date(),
    }
  }

  /**
   * Invalidate entries by pattern or source
   */
  invalidate(pattern?: RegExp, source?: "github" | "processed" | "computed"): number {
    let invalidated = 0

    for (const [key, entry] of this.cache.entries()) {
      const matchesPattern = !pattern || pattern.test(key)
      const matchesSource = !source || entry.source === source

      if (matchesPattern && matchesSource) {
        entry.isValid = false
        entry.invalidationReason = `Invalidated by pattern: ${pattern?.source || "manual"}, source: ${source || "all"}`
        this.cache.delete(key)
        invalidated++
      }
    }

    return invalidated
  }

  /**
   * Get cache hit rate
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses
    return total === 0 ? 0 : (this.stats.hits / total) * 100
  }

  /**
   * Private: Enforce memory limits using LRU eviction
   */
  private enforceMemoryLimits(): void {
    const currentSize = this.getTotalSize()

    if (currentSize <= this.config.maxSize) {
      return
    }

    // Sort entries by last accessed (LRU)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed.getTime() - b.lastAccessed.getTime()
    )

    // Remove oldest entries until under size limit
    let removedSize = 0
    for (const [key, entry] of entries) {
      this.cache.delete(key)
      removedSize += this.estimateEntrySize(entry)

      if (currentSize - removedSize <= this.config.maxSize * 0.8) {
        // Remove to 80% capacity
        break
      }
    }
  }

  /**
   * Private: Estimate total cache size in bytes
   */
  private getTotalSize(): number {
    let totalSize = 0
    for (const entry of this.cache.values()) {
      totalSize += this.estimateEntrySize(entry)
    }
    return totalSize
  }

  /**
   * Private: Estimate individual entry size
   */
  private estimateEntrySize(entry: CacheEntry): number {
    // Rough estimation - in production, use a more accurate method
    const jsonString = JSON.stringify(entry)
    return jsonString.length * 2 // Approximate memory usage
  }

  /**
   * Private: Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    setInterval(() => {
      this.cleanupExpired()
    }, this.config.cleanupInterval * 1000)
  }

  /**
   * Private: Remove expired entries
   */
  private cleanupExpired(): void {
    const now = new Date()
    let cleaned = 0

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now || !entry.isValid) {
        this.cache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      // Optional: log cleanup results
    }
  }
}

// Singleton instance for application-wide use
export const memoryCache = new MemoryCache()
