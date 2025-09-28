// Multi-layer cache management service
import type { CacheConfig, CacheEntry, CacheStats } from "@/types/cache"

import { type FileCache, fileCache } from "./file-cache"
import { type MemoryCache, memoryCache } from "./memory-cache"

export interface CacheManagerConfig {
  enableMemoryCache: boolean
  enableFileCache: boolean
  memoryFirst: boolean // Check memory cache first
  syncCaches: boolean // Keep caches synchronized
  defaultTtl: number // Default TTL in seconds
  prefixKeys: boolean // Add prefix to all keys
  keyPrefix: string
}

export interface CacheManagerStats {
  memory: CacheStats
  file: {
    totalFiles: number
    totalSize: number
    oldestFile: Date
    newestFile: Date
    hitCount: number
    missCount: number
  }
  combined: {
    totalHits: number
    totalMisses: number
    hitRate: number
    memoryHitRate: number
    fileHitRate: number
  }
}

export interface CacheOperation {
  key: string
  operation: "get" | "set" | "delete" | "clear"
  cacheLayer: "memory" | "file" | "both"
  success: boolean
  executionTime: number // ms
  timestamp: Date
}

export class CacheManager {
  private config: CacheManagerConfig
  private memoryCache: MemoryCache
  private fileCache: FileCache
  private operations: CacheOperation[] = []

  constructor(memCache: MemoryCache, fCache: FileCache, config?: Partial<CacheManagerConfig>) {
    this.memoryCache = memCache
    this.fileCache = fCache
    this.config = {
      enableMemoryCache: true,
      enableFileCache: true,
      memoryFirst: true,
      syncCaches: true,
      defaultTtl: 1800, // 30 minutes
      prefixKeys: false,
      keyPrefix: "cms:",
      ...config,
    }
  }

  /**
   * Get item from cache (multi-layer)
   */
  async get<T = unknown>(key: string): Promise<T | null> {
    const startTime = Date.now()
    const prefixedKey = this.getPrefixedKey(key)
    let result: T | null = null
    let cacheLayer: "memory" | "file" | "both" = "memory"

    try {
      // Check memory cache first if enabled and configured
      if (this.config.enableMemoryCache && this.config.memoryFirst) {
        result = this.memoryCache.get<T>(prefixedKey)

        if (result !== null) {
          this.recordOperation({
            key: prefixedKey,
            operation: "get",
            cacheLayer: "memory",
            success: true,
            executionTime: Date.now() - startTime,
            timestamp: new Date(),
          })
          return result
        }
      }

      // Check file cache if memory cache miss
      if (this.config.enableFileCache) {
        const fileEntry = await this.fileCache.get<T>(prefixedKey)

        if (fileEntry) {
          result = fileEntry.data
          cacheLayer = "file"

          // Sync back to memory cache if enabled and sync is configured
          if (this.config.enableMemoryCache && this.config.syncCaches) {
            const remainingTtl = Math.floor((fileEntry.expiresAt.getTime() - Date.now()) / 1000)
            if (remainingTtl > 0) {
              this.memoryCache.set(prefixedKey, result, remainingTtl)
            }
          }
        }
      }

      // Check memory cache as fallback if file-first wasn't configured
      if (!result && this.config.enableMemoryCache && !this.config.memoryFirst) {
        result = this.memoryCache.get<T>(prefixedKey)
        cacheLayer = "memory"
      }

      this.recordOperation({
        key: prefixedKey,
        operation: "get",
        cacheLayer,
        success: result !== null,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })

      return result
    } catch (error) {
      this.recordOperation({
        key: prefixedKey,
        operation: "get",
        cacheLayer: "both",
        success: false,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })

      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set item in cache (multi-layer)
   */
  async set<T = unknown>(key: string, data: T, ttl: number = this.config.defaultTtl): Promise<boolean> {
    const startTime = Date.now()
    const prefixedKey = this.getPrefixedKey(key)
    let success = true

    try {
      // Set in memory cache if enabled
      if (this.config.enableMemoryCache) {
        const memSuccess = this.memoryCache.set(prefixedKey, data, ttl)
        success = success && memSuccess
      }

      // Set in file cache if enabled
      if (this.config.enableFileCache) {
        const fileSuccess = await this.fileCache.set(prefixedKey, data, ttl)
        success = success && fileSuccess
      }

      this.recordOperation({
        key: prefixedKey,
        operation: "set",
        cacheLayer: "both",
        success,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })

      return success
    } catch (error) {
      this.recordOperation({
        key: prefixedKey,
        operation: "set",
        cacheLayer: "both",
        success: false,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })

      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete item from cache (multi-layer)
   */
  async delete(key: string): Promise<boolean> {
    const startTime = Date.now()
    const prefixedKey = this.getPrefixedKey(key)
    let success = true

    try {
      // Delete from memory cache
      if (this.config.enableMemoryCache) {
        const memSuccess = this.memoryCache.delete(prefixedKey)
        success = success && memSuccess
      }

      // Delete from file cache
      if (this.config.enableFileCache) {
        const fileSuccess = await this.fileCache.delete(prefixedKey)
        success = success && fileSuccess
      }

      this.recordOperation({
        key: prefixedKey,
        operation: "delete",
        cacheLayer: "both",
        success,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })

      return success
    } catch (error) {
      this.recordOperation({
        key: prefixedKey,
        operation: "delete",
        cacheLayer: "both",
        success: false,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })

      console.error(`Cache delete error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Check if key exists in any cache layer
   */
  async has(key: string): Promise<boolean> {
    const prefixedKey = this.getPrefixedKey(key)

    // Check memory cache first if enabled
    if (this.config.enableMemoryCache && this.memoryCache.has(prefixedKey)) {
      return true
    }

    // Check file cache if enabled
    if (this.config.enableFileCache) {
      return await this.fileCache.has(prefixedKey)
    }

    return false
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    const startTime = Date.now()

    try {
      // Clear memory cache
      if (this.config.enableMemoryCache) {
        this.memoryCache.clear()
      }

      // Clear file cache
      if (this.config.enableFileCache) {
        await this.fileCache.clear()
      }

      this.recordOperation({
        key: "*",
        operation: "clear",
        cacheLayer: "both",
        success: true,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })
    } catch (error) {
      this.recordOperation({
        key: "*",
        operation: "clear",
        cacheLayer: "both",
        success: false,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
      })

      console.error("Cache clear error:", error)
    }
  }

  /**
   * Get comprehensive cache statistics
   */
  getStats(): CacheManagerStats {
    const memoryStats = this.memoryCache.getStats()
    const fileStats = this.fileCache.getStats()

    const totalHits = memoryStats.hits + fileStats.hitCount
    const totalMisses = memoryStats.misses + fileStats.missCount
    const totalRequests = totalHits + totalMisses

    return {
      memory: memoryStats,
      file: fileStats,
      combined: {
        totalHits,
        totalMisses,
        hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0,
        memoryHitRate: memoryStats.hitRate,
        fileHitRate:
          fileStats.hitCount + fileStats.missCount > 0
            ? (fileStats.hitCount / (fileStats.hitCount + fileStats.missCount)) * 100
            : 0,
      },
    }
  }

  /**
   * Cleanup expired entries from all cache layers
   */
  async cleanup(): Promise<{ memory: boolean; file: { deletedCount: number; errorCount: number } }> {
    const results = {
      memory: true,
      file: { deletedCount: 0, errorCount: 0 },
    }

    try {
      // Cleanup memory cache
      if (this.config.enableMemoryCache) {
        this.memoryCache.cleanup()
      }

      // Cleanup file cache
      if (this.config.enableFileCache) {
        results.file = await this.fileCache.cleanup()
      }
    } catch (error) {
      console.error("Cache cleanup error:", error)
      results.memory = false
    }

    return results
  }

  /**
   * Batch operations
   */
  async batchGet<T = unknown>(keys: string[]): Promise<Array<{ key: string; value: T | null }>> {
    const results = await Promise.all(
      keys.map(async key => ({
        key,
        value: await this.get<T>(key),
      }))
    )

    return results
  }

  async batchSet<T = unknown>(items: Array<{ key: string; value: T; ttl?: number }>): Promise<boolean[]> {
    const results = await Promise.all(items.map(item => this.set(item.key, item.value, item.ttl)))

    return results
  }

  async batchDelete(keys: string[]): Promise<boolean[]> {
    const results = await Promise.all(keys.map(key => this.delete(key)))
    return results
  }

  /**
   * Get recent operations for debugging
   */
  getRecentOperations(limit: number = 100): CacheOperation[] {
    return this.operations.slice(-limit)
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CacheManagerConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): CacheManagerConfig {
    return { ...this.config }
  }

  /**
   * Add prefix to key if configured
   */
  private getPrefixedKey(key: string): string {
    return this.config.prefixKeys ? this.config.keyPrefix + key : key
  }

  /**
   * Record cache operation for analytics
   */
  private recordOperation(operation: CacheOperation): void {
    this.operations.push(operation)

    // Keep only last 1000 operations
    if (this.operations.length > 1000) {
      this.operations = this.operations.slice(-1000)
    }
  }
}

// Export configured instance
export const cacheManager = new CacheManager(memoryCache, fileCache)
