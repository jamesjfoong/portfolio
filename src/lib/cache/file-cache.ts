// File system cache service
import { existsSync } from "fs"
import { mkdir, readFile, stat, unlink, writeFile } from "fs/promises"
import { join } from "path"

import type { CacheEntry } from "@/types/cache"

export interface FileCacheConfig {
  cacheDir: string
  maxFileSize: number // Maximum file size in bytes
  compressionEnabled: boolean
  fileExtension: string
  createDirectories: boolean
}

export interface FileCacheStats {
  totalFiles: number
  totalSize: number // Total cache size in bytes
  oldestFile: Date
  newestFile: Date
  hitCount: number
  missCount: number
}

export class FileCache {
  private config: FileCacheConfig
  private stats: FileCacheStats

  constructor(config?: Partial<FileCacheConfig>) {
    this.config = {
      cacheDir: ".cache",
      maxFileSize: 10 * 1024 * 1024, // 10MB
      compressionEnabled: false, // Simple implementation without compression
      fileExtension: ".cache.json",
      createDirectories: true,
      ...config,
    }

    this.stats = {
      totalFiles: 0,
      totalSize: 0,
      oldestFile: new Date(),
      newestFile: new Date(),
      hitCount: 0,
      missCount: 0,
    }

    this.initializeCache()
  }

  /**
   * Initialize cache directory
   */
  private async initializeCache(): Promise<void> {
    if (this.config.createDirectories && !existsSync(this.config.cacheDir)) {
      try {
        await mkdir(this.config.cacheDir, { recursive: true })
      } catch (error) {
        console.error("Failed to create cache directory:", error)
      }
    }

    // Load initial stats
    await this.updateStats()
  }

  /**
   * Get item from file cache
   */
  async get<T = unknown>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const filePath = this.getFilePath(key)

      if (!existsSync(filePath)) {
        this.stats.missCount++
        return null
      }

      const fileContent = await readFile(filePath, "utf-8")
      const cacheEntry = JSON.parse(fileContent) as CacheEntry<T>

      // Check if entry has expired
      if (cacheEntry.expiresAt <= new Date()) {
        await this.delete(key)
        this.stats.missCount++
        return null
      }

      // Update last accessed time
      cacheEntry.lastAccessed = new Date()
      await this.writeToFile(filePath, cacheEntry)

      this.stats.hitCount++
      return cacheEntry
    } catch (error) {
      console.error(`Error reading cache file for key ${key}:`, error)
      this.stats.missCount++
      return null
    }
  }

  /**
   * Set item in file cache
   */
  async set<T = unknown>(
    key: string,
    data: T,
    ttl: number = 1800 // 30 minutes default
  ): Promise<boolean> {
    try {
      const now = new Date()
      const cacheEntry: CacheEntry<T> = {
        key,
        data,
        createdAt: now,
        expiresAt: new Date(now.getTime() + ttl * 1000),
        lastAccessed: now,
        isValid: true,
        source: "github",
        generationTimeMs: 0,
        hitCount: 0,
      }

      const filePath = this.getFilePath(key)
      const success = await this.writeToFile(filePath, cacheEntry)

      if (success) {
        await this.updateStats()
      }

      return success
    } catch (error) {
      console.error(`Error writing cache file for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete item from file cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key)

      if (existsSync(filePath)) {
        await unlink(filePath)
        await this.updateStats()
        return true
      }

      return false
    } catch (error) {
      console.error(`Error deleting cache file for key ${key}:`, error)
      return false
    }
  }

  /**
   * Check if key exists in cache
   */
  async has(key: string): Promise<boolean> {
    const filePath = this.getFilePath(key)

    if (!existsSync(filePath)) {
      return false
    }

    try {
      const fileContent = await readFile(filePath, "utf-8")
      const cacheEntry = JSON.parse(fileContent) as CacheEntry

      // Check if expired
      if (cacheEntry.expiresAt <= new Date()) {
        await this.delete(key)
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * Clear all cache files
   */
  async clear(): Promise<void> {
    try {
      const { readdir } = await import("fs/promises")

      if (!existsSync(this.config.cacheDir)) {
        return
      }

      const files = await readdir(this.config.cacheDir)
      const cacheFiles = files.filter(file => file.endsWith(this.config.fileExtension))

      await Promise.all(
        cacheFiles.map(file =>
          unlink(join(this.config.cacheDir, file)).catch(() => {
            // Ignore errors for individual file deletion
          })
        )
      )

      await this.updateStats()
    } catch (error) {
      console.error("Error clearing cache:", error)
    }
  }

  /**
   * Clean up expired entries
   */
  async cleanup(): Promise<{ deletedCount: number; errorCount: number }> {
    let deletedCount = 0
    let errorCount = 0

    try {
      const { readdir } = await import("fs/promises")

      if (!existsSync(this.config.cacheDir)) {
        return { deletedCount, errorCount }
      }

      const files = await readdir(this.config.cacheDir)
      const cacheFiles = files.filter(file => file.endsWith(this.config.fileExtension))

      for (const file of cacheFiles) {
        try {
          const filePath = join(this.config.cacheDir, file)
          const fileContent = await readFile(filePath, "utf-8")
          const cacheEntry = JSON.parse(fileContent) as CacheEntry

          if (cacheEntry.expiresAt <= new Date()) {
            await unlink(filePath)
            deletedCount++
          }
        } catch {
          errorCount++
        }
      }

      await this.updateStats()
    } catch (error) {
      console.error("Error during cleanup:", error)
      errorCount++
    }

    return { deletedCount, errorCount }
  }

  /**
   * Get cache statistics
   */
  getStats(): FileCacheStats {
    return { ...this.stats }
  }

  /**
   * Update cache statistics
   */
  private async updateStats(): Promise<void> {
    try {
      const { readdir } = await import("fs/promises")

      if (!existsSync(this.config.cacheDir)) {
        this.stats = {
          ...this.stats,
          totalFiles: 0,
          totalSize: 0,
        }
        return
      }

      const files = await readdir(this.config.cacheDir)
      const cacheFiles = files.filter(file => file.endsWith(this.config.fileExtension))

      let totalSize = 0
      let oldestDate = new Date()
      let newestDate = new Date(0)

      for (const file of cacheFiles) {
        try {
          const filePath = join(this.config.cacheDir, file)
          const stats = await stat(filePath)

          totalSize += stats.size

          if (stats.mtime < oldestDate) {
            oldestDate = stats.mtime
          }

          if (stats.mtime > newestDate) {
            newestDate = stats.mtime
          }
        } catch {
          // Ignore individual file stat errors
        }
      }

      this.stats.totalFiles = cacheFiles.length
      this.stats.totalSize = totalSize

      if (cacheFiles.length > 0) {
        this.stats.oldestFile = oldestDate
        this.stats.newestFile = newestDate
      }
    } catch (error) {
      console.error("Error updating cache stats:", error)
    }
  }

  /**
   * Get file path for cache key
   */
  private getFilePath(key: string): string {
    // Sanitize key for filename
    const sanitizedKey = key.replace(/[^a-zA-Z0-9\-_]/g, "_").substring(0, 100) // Limit filename length

    return join(this.config.cacheDir, sanitizedKey + this.config.fileExtension)
  }

  /**
   * Write data to file with size validation
   */
  private async writeToFile<T>(filePath: string, data: T): Promise<boolean> {
    try {
      const jsonString = JSON.stringify(data, null, 2)

      // Check file size limit
      if (Buffer.byteLength(jsonString, "utf8") > this.config.maxFileSize) {
        console.warn(`Cache entry too large for key, skipping file cache`)
        return false
      }

      await writeFile(filePath, jsonString, "utf-8")
      return true
    } catch (error) {
      console.error(`Error writing to cache file ${filePath}:`, error)
      return false
    }
  }

  /**
   * Get all cache keys
   */
  async getKeys(): Promise<string[]> {
    try {
      const { readdir } = await import("fs/promises")

      if (!existsSync(this.config.cacheDir)) {
        return []
      }

      const files = await readdir(this.config.cacheDir)
      return files
        .filter(file => file.endsWith(this.config.fileExtension))
        .map(file => file.replace(this.config.fileExtension, ""))
        .map(filename => filename.replace(/_/g, "/")) // Reverse sanitization
    } catch {
      return []
    }
  }
}

// Default configuration
const defaultConfig: FileCacheConfig = {
  cacheDir: ".cache",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  compressionEnabled: false,
  fileExtension: ".cache.json",
  createDirectories: true,
}

// Export configured instance
export const fileCache = new FileCache(defaultConfig)
