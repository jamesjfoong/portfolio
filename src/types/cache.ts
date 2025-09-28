// Cache system types

export interface CacheEntry<T = unknown> {
  // Cache Key & Content
  key: string // Unique cache identifier
  data: T // Cached content (typed)

  // Timing & Expiration
  createdAt: Date // Cache entry creation
  expiresAt: Date // TTL expiration
  lastAccessed: Date // For LRU eviction

  // Validation & Status
  isValid: boolean // Whether cache entry is usable
  invalidationReason?: string // Why cache was invalidated
  source: "github" | "processed" | "computed" // Data source type

  // Performance Metadata
  generationTimeMs: number // Time to generate cached data
  hitCount: number // Number of cache hits
}

export interface CacheConfig {
  defaultTtl: number // Default TTL in seconds
  maxSize: number // Maximum cache size in bytes
  cleanupInterval: number // Cleanup interval in seconds
  memoryLimit: number // Memory cache limit in bytes
}

export interface CacheStats {
  totalEntries: number
  totalSize: number // Total cache size in bytes
  hitRate: number // Cache hit percentage
  averageResponseTime: number // Average response time in ms
  oldestEntry: Date
  newestEntry: Date
}

export type CacheSource = "memory" | "filesystem"

export interface CacheOperation<T = unknown> {
  operation: "get" | "set" | "delete" | "clear" | "cleanup"
  key?: string
  data?: T
  ttl?: number
  tags?: string[]
  success: boolean
  timestamp: Date
  executionTime: number // Operation time in ms
}
