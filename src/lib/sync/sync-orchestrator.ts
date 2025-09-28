import { CacheManager } from "@/lib/cache/cache-manager"

import type { GitHubContent } from "@/types/github"
import type { SyncOperation, SyncOptions, SyncResult } from "@/types/sync"

import { ChangeDetector } from "./change-detector"
import { ContentProcessor } from "./content-processor"
import { NotificationService } from "./notification-service"
import { SyncLogger } from "./sync-logger"

export interface SyncStats {
  totalFiles: number
  processedFiles: number
  newFiles: number
  updatedFiles: number
  deletedFiles: number
  errors: number
  duration: number
}

export class SyncOrchestrator {
  private changeDetector: ChangeDetector
  private contentProcessor: ContentProcessor
  private logger: SyncLogger
  private notificationService: NotificationService
  private cacheManager: CacheManager
  private isRunning: boolean = false

  constructor() {
    this.changeDetector = new ChangeDetector()
    this.contentProcessor = new ContentProcessor()
    this.logger = new SyncLogger()
    this.notificationService = new NotificationService()
    this.cacheManager = new CacheManager()
  }

  async syncContent(options: SyncOptions = {}): Promise<SyncResult> {
    if (this.isRunning) {
      throw new Error("Sync operation already in progress")
    }

    this.isRunning = true
    const startTime = Date.now()
    const syncId = `sync-${Date.now()}`

    const stats: SyncStats = {
      totalFiles: 0,
      processedFiles: 0,
      newFiles: 0,
      updatedFiles: 0,
      deletedFiles: 0,
      errors: 0,
      duration: 0,
    }

    try {
      await this.logger.logSyncStart(syncId, options)

      // Step 1: Detect changes
      this.logger.info("Detecting content changes...")
      const changes = await this.changeDetector.detectChanges({
        force: options.force || false,
        paths: options.paths,
      })

      stats.totalFiles = changes.added.length + changes.modified.length + changes.deleted.length

      if (stats.totalFiles === 0 && !options.force) {
        await this.logger.logSyncComplete(syncId, stats, "No changes detected")
        return {
          success: true,
          syncId,
          stats,
          message: "No changes detected",
        }
      }

      // Step 2: Process content files
      await this.processChanges(syncId, changes, stats, options)

      // Step 3: Update cache and indexes
      if (options.updateCache !== false) {
        await this.updateCacheAndIndexes(changes)
      }

      stats.duration = Date.now() - startTime
      await this.logger.logSyncComplete(syncId, stats)

      // Send success notification
      await this.notificationService.sendSyncComplete({
        syncId,
        stats,
        success: true,
      })

      return {
        success: true,
        syncId,
        stats,
        message: `Sync completed: ${stats.processedFiles}/${stats.totalFiles} files processed`,
      }
    } catch (error) {
      stats.duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      await this.logger.logSyncError(syncId, error as Error, stats)

      // Send error notification
      await this.notificationService.sendSyncError({
        syncId,
        error: error as Error,
        stats,
      })

      return {
        success: false,
        syncId,
        stats,
        error: errorMessage,
      }
    } finally {
      this.isRunning = false
    }
  }

  private async processChanges(
    syncId: string,
    changes: Awaited<ReturnType<ChangeDetector["detectChanges"]>>,
    stats: SyncStats,
    options: SyncOptions
  ): Promise<void> {
    // Process added files
    for (const file of changes.added) {
      try {
        await this.contentProcessor.processFile(file, "add")
        stats.newFiles++
        stats.processedFiles++
        await this.logger.logFileProcessed(syncId, file.path, "added")
      } catch (error) {
        stats.errors++
        await this.logger.logFileError(syncId, file.path, error as Error)
        if (!options.continueOnError) {
          throw error
        }
      }
    }

    // Process modified files
    for (const file of changes.modified) {
      try {
        await this.contentProcessor.processFile(file, "update")
        stats.updatedFiles++
        stats.processedFiles++
        await this.logger.logFileProcessed(syncId, file.path, "updated")
      } catch (error) {
        stats.errors++
        await this.logger.logFileError(syncId, file.path, error as Error)
        if (!options.continueOnError) {
          throw error
        }
      }
    }

    // Process deleted files
    for (const file of changes.deleted) {
      try {
        await this.contentProcessor.processFile(file, "delete")
        stats.deletedFiles++
        stats.processedFiles++
        await this.logger.logFileProcessed(syncId, file.path, "deleted")
      } catch (error) {
        stats.errors++
        await this.logger.logFileError(syncId, file.path, error as Error)
        if (!options.continueOnError) {
          throw error
        }
      }
    }
  }

  private async updateCacheAndIndexes(changes: Awaited<ReturnType<ChangeDetector["detectChanges"]>>): Promise<void> {
    // Clear cache for changed files
    const allChangedFiles = [...changes.added, ...changes.modified, ...changes.deleted]

    for (const file of allChangedFiles) {
      // Clear content cache
      await this.cacheManager.delete(`content:${file.path}`)

      // Clear related caches (e.g., search index)
      await this.cacheManager.delete(`search:${file.path}`)
    }

    // Invalidate list caches if any content files changed
    if (allChangedFiles.some(f => f.path.includes(".md"))) {
      await this.cacheManager.delete("blog:list")
      await this.cacheManager.delete("projects:list")
    }
  }

  async getSyncStatus(): Promise<{
    isRunning: boolean
    lastSync?: Date
    nextScheduledSync?: Date
  }> {
    return {
      isRunning: this.isRunning,
      lastSync: await this.logger.getLastSyncTime(),
      nextScheduledSync: undefined, // TODO: Implement scheduling
    }
  }

  async cancelSync(): Promise<boolean> {
    if (!this.isRunning) {
      return false
    }

    // TODO: Implement graceful cancellation
    this.logger.warn("Sync cancellation requested but not yet implemented")
    return false
  }
}

export default SyncOrchestrator
