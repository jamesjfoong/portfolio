/**
 * Cache Configuration
 *
 * Centralized configuration for all caching strategies including
 * memory cache, file system cache, and cache invalidation policies.
 */

import { env } from "./env"

export interface CacheConfig {
  // Memory cache settings
  memory: {
    enabled: boolean
    maxSize: number // in MB
    ttl: number // in seconds
    maxItems: number
    compressionEnabled: boolean
  }

  // File system cache settings
  fileSystem: {
    enabled: boolean
    directory: string
    maxSize: number // in MB
    maxAge: number // in seconds
    compressionEnabled: boolean
    cleanupInterval: number // in seconds
  }

  // Content-specific cache settings
  content: {
    blogPostTtl: number
    projectTtl: number
    searchIndexTtl: number
    assetTtl: number
    previewTtl: number
  }

  // API response cache settings
  api: {
    githubApiTtl: number
    contentApiTtl: number
    searchApiTtl: number
    syncApiTtl: number
  }

  // Cache invalidation settings
  invalidation: {
    enabled: boolean
    strategies: ("time" | "sync" | "manual")[]
    batchSize: number
    maxRetries: number
  }

  // Performance settings
  performance: {
    prefetchEnabled: boolean
    backgroundRefreshEnabled: boolean
    staleWhileRevalidate: boolean
    maxConcurrentReads: number
    maxConcurrentWrites: number
  }
}

export interface CacheStats {
  memory: {
    size: number
    items: number
    hits: number
    misses: number
    hitRate: number
  }
  fileSystem: {
    size: number
    files: number
    hits: number
    misses: number
    hitRate: number
  }
  total: {
    hits: number
    misses: number
    hitRate: number
  }
}

class CacheConfigManager {
  private static instance: CacheConfigManager
  private config: CacheConfig
  private stats: CacheStats

  private constructor() {
    this.config = this.createConfig()
    this.stats = this.initializeStats()
  }

  static getInstance(): CacheConfigManager {
    if (!CacheConfigManager.instance) {
      CacheConfigManager.instance = new CacheConfigManager()
    }
    return CacheConfigManager.instance
  }

  private createConfig(): CacheConfig {
    const isProduction = env.NODE_ENV === "production"

    return {
      // Memory cache - more aggressive in production
      memory: {
        enabled: true,
        maxSize: env.CACHE_MAX_SIZE_MB || (isProduction ? 256 : 128),
        ttl: env.CACHE_TTL_SECONDS || (isProduction ? 1800 : 300), // 30min prod, 5min dev
        maxItems: isProduction ? 1000 : 500,
        compressionEnabled: isProduction,
      },

      // File system cache
      fileSystem: {
        enabled: env.ENABLE_FILE_CACHE,
        directory: process.env.CACHE_DIRECTORY || ".cache",
        maxSize: isProduction ? 1024 : 512, // 1GB prod, 512MB dev
        maxAge: isProduction ? 86400 : 7200, // 24h prod, 2h dev
        compressionEnabled: isProduction,
        cleanupInterval: 3600, // 1 hour
      },

      // Content-specific TTLs
      content: {
        blogPostTtl: isProduction ? 3600 : 300, // 1h prod, 5min dev
        projectTtl: isProduction ? 3600 : 300,
        searchIndexTtl: isProduction ? 1800 : 180, // 30min prod, 3min dev
        assetTtl: isProduction ? 86400 : 3600, // 24h prod, 1h dev
        previewTtl: 300, // Always 5 minutes for previews
      },

      // API response caches
      api: {
        githubApiTtl: isProduction ? 600 : 120, // 10min prod, 2min dev
        contentApiTtl: isProduction ? 300 : 60, // 5min prod, 1min dev
        searchApiTtl: isProduction ? 180 : 30, // 3min prod, 30s dev
        syncApiTtl: 60, // Always 1 minute for sync operations
      },

      // Cache invalidation
      invalidation: {
        enabled: true,
        strategies: ["time", "sync", "manual"],
        batchSize: 50,
        maxRetries: 3,
      },

      // Performance optimizations
      performance: {
        prefetchEnabled: isProduction,
        backgroundRefreshEnabled: isProduction,
        staleWhileRevalidate: true,
        maxConcurrentReads: isProduction ? 20 : 10,
        maxConcurrentWrites: isProduction ? 10 : 5,
      },
    }
  }

  private initializeStats(): CacheStats {
    return {
      memory: {
        size: 0,
        items: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
      },
      fileSystem: {
        size: 0,
        files: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
      },
      total: {
        hits: 0,
        misses: 0,
        hitRate: 0,
      },
    }
  }

  getConfig(): CacheConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  // TTL helpers for different content types
  getTtlForContentType(type: keyof CacheConfig["content"]): number {
    return this.config.content[type]
  }

  getTtlForApiType(type: keyof CacheConfig["api"]): number {
    return this.config.api[type]
  }

  // Cache key generation
  generateCacheKey(type: string, identifier: string, params?: Record<string, unknown>): string {
    const baseKey = `${type}:${identifier}`

    if (params && Object.keys(params).length > 0) {
      const sortedParams = Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${String(value)}`)
        .join("&")

      return `${baseKey}:${sortedParams}`
    }

    return baseKey
  }

  // Environment-specific cache settings
  getEnvironmentOptimizations(): Partial<CacheConfig> {
    if (env.NODE_ENV === "development") {
      return {
        memory: {
          ...this.config.memory,
          maxSize: 64, // Smaller memory footprint
          ttl: 60, // Shorter TTL for faster development
        },
        fileSystem: {
          ...this.config.fileSystem,
          enabled: false, // Disable file cache in development
        },
        performance: {
          ...this.config.performance,
          prefetchEnabled: false,
          backgroundRefreshEnabled: false,
        },
      }
    }

    if (env.NODE_ENV === "test") {
      return {
        memory: {
          ...this.config.memory,
          maxSize: 32,
          ttl: 10,
        },
        fileSystem: {
          ...this.config.fileSystem,
          enabled: false,
        },
      }
    }

    return {}
  }

  // Statistics tracking
  recordHit(cacheType: "memory" | "fileSystem"): void {
    this.stats[cacheType].hits++
    this.stats.total.hits++
    this.updateHitRates()
  }

  recordMiss(cacheType: "memory" | "fileSystem"): void {
    this.stats[cacheType].misses++
    this.stats.total.misses++
    this.updateHitRates()
  }

  private updateHitRates(): void {
    // Update memory cache hit rate
    const memoryTotal = this.stats.memory.hits + this.stats.memory.misses
    this.stats.memory.hitRate = memoryTotal > 0 ? this.stats.memory.hits / memoryTotal : 0

    // Update file system cache hit rate
    const fsTotal = this.stats.fileSystem.hits + this.stats.fileSystem.misses
    this.stats.fileSystem.hitRate = fsTotal > 0 ? this.stats.fileSystem.hits / fsTotal : 0

    // Update total hit rate
    const totalRequests = this.stats.total.hits + this.stats.total.misses
    this.stats.total.hitRate = totalRequests > 0 ? this.stats.total.hits / totalRequests : 0
  }

  getStats(): CacheStats {
    return { ...this.stats }
  }

  resetStats(): void {
    this.stats = this.initializeStats()
  }

  // Cache health checks
  isHealthy(): boolean {
    const stats = this.getStats()
    const totalRequests = stats.total.hits + stats.total.misses

    // Consider cache healthy if:
    // - Hit rate is above 60% (with sufficient requests)
    // - Memory usage is reasonable
    if (totalRequests < 10) {
      return true // Not enough data to determine health
    }

    return stats.total.hitRate >= 0.6
  }

  getHealthReport(): {
    isHealthy: boolean
    issues: string[]
    recommendations: string[]
  } {
    const issues: string[] = []
    const recommendations: string[] = []
    const stats = this.getStats()

    // Check hit rates
    if (stats.total.hitRate < 0.5) {
      issues.push(`Low cache hit rate: ${(stats.total.hitRate * 100).toFixed(1)}%`)
      recommendations.push("Consider increasing TTL values or optimizing cache keys")
    }

    // Check memory usage (this would need actual memory monitoring)
    if (stats.memory.items > this.config.memory.maxItems * 0.9) {
      issues.push("Memory cache approaching capacity")
      recommendations.push("Consider increasing maxItems or implementing LRU eviction")
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
    }
  }

  // Configuration validation
  validate(): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate memory settings
    if (this.config.memory.maxSize <= 0) {
      errors.push("Memory cache maxSize must be positive")
    }

    if (this.config.memory.ttl < 0) {
      errors.push("Memory cache TTL cannot be negative")
    }

    // Validate file system settings
    if (this.config.fileSystem.maxSize <= 0) {
      warnings.push("File system cache maxSize should be positive")
    }

    // Validate performance settings
    if (this.config.performance.maxConcurrentReads <= 0) {
      errors.push("maxConcurrentReads must be positive")
    }

    if (this.config.performance.maxConcurrentWrites <= 0) {
      errors.push("maxConcurrentWrites must be positive")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }
}

// Singleton instance
const cacheConfigManager = CacheConfigManager.getInstance()

// Export the configuration
export const cacheConfig = cacheConfigManager.getConfig()

// Export commonly used methods
export const {
  getConfig: getCacheConfig,
  updateConfig: updateCacheConfig,
  getTtlForContentType,
  getTtlForApiType,
  generateCacheKey,
  recordHit,
  recordMiss,
  getStats: getCacheStats,
  resetStats: resetCacheStats,
  isHealthy: isCacheHealthy,
  getHealthReport: getCacheHealthReport,
  validate: validateCacheConfig,
} = cacheConfigManager

export default cacheConfigManager
