import { CacheManager } from "@/lib/cache/cache-manager"
import { GitHubClient } from "@/lib/github/client"

import type { GitHubContent } from "@/types/github"

export interface ChangeDetectionOptions {
  force?: boolean
  paths?: string[]
  since?: Date
}

export interface FileChange {
  path: string
  type: "file" | "dir"
  sha: string
  size: number
  url: string
  content?: string
  lastModified: Date
}

export interface ChangeSet {
  added: FileChange[]
  modified: FileChange[]
  deleted: FileChange[]
  total: number
}

interface CachedFileInfo {
  path: string
  sha: string
  lastModified: string
  size: number
}

export class ChangeDetector {
  private githubClient: GitHubClient
  private cacheManager: CacheManager
  private readonly CACHE_KEY_PREFIX = "file-info:"
  private readonly CONTENT_EXTENSIONS = [".md", ".mdx", ".json"]

  constructor() {
    this.githubClient = new GitHubClient()
    this.cacheManager = new CacheManager()
  }

  async detectChanges(options: ChangeDetectionOptions = {}): Promise<ChangeSet> {
    const { force = false, paths, since } = options

    // Get current repository state
    const currentFiles = await this.getRepositoryFiles(paths)

    // Get cached file information
    const cachedFiles = force ? new Map() : await this.getCachedFileInfo()

    const changes: ChangeSet = {
      added: [],
      modified: [],
      deleted: [],
      total: 0,
    }

    // Detect additions and modifications
    for (const file of currentFiles) {
      const cached = cachedFiles.get(file.path)

      if (!cached) {
        // New file
        changes.added.push(file)
      } else if (cached.sha !== file.sha) {
        // Modified file
        changes.modified.push(file)
      } else if (since && new Date(cached.lastModified) < since) {
        // File modified since specified date
        changes.modified.push(file)
      }
    }

    // Detect deletions
    const currentPaths = new Set(currentFiles.map(f => f.path))
    for (const [path, cached] of cachedFiles) {
      if (!currentPaths.has(path)) {
        changes.deleted.push({
          path: cached.path,
          type: "file" as const,
          sha: cached.sha,
          size: cached.size,
          url: "",
          lastModified: new Date(cached.lastModified),
        })
      }
    }

    changes.total = changes.added.length + changes.modified.length + changes.deleted.length

    // Update cache with current file information
    await this.updateCachedFileInfo(currentFiles)

    return changes
  }

  private async getRepositoryFiles(paths?: string[]): Promise<FileChange[]> {
    const allFiles = await this.githubClient.getRepositoryContents("", true)

    return allFiles
      .filter(file => {
        // Only process content files
        if (file.type !== "file") return false

        // Check file extension
        const hasValidExtension = this.CONTENT_EXTENSIONS.some(ext => file.path.endsWith(ext))
        if (!hasValidExtension) return false

        // Filter by paths if specified
        if (paths && paths.length > 0) {
          return paths.some(path => file.path.startsWith(path))
        }

        return true
      })
      .map(file => ({
        path: file.path,
        type: file.type as "file" | "dir",
        sha: file.sha,
        size: file.size,
        url: file.url,
        lastModified: new Date(), // GitHub API doesn't provide last modified, using current time
      }))
  }

  private async getCachedFileInfo(): Promise<Map<string, CachedFileInfo>> {
    const cached = new Map<string, CachedFileInfo>()

    try {
      // Get all cached file info keys
      const keys = await this.cacheManager.getKeys(this.CACHE_KEY_PREFIX)

      for (const key of keys) {
        const fileInfo = await this.cacheManager.get<CachedFileInfo>(key)
        if (fileInfo) {
          cached.set(fileInfo.path, fileInfo)
        }
      }
    } catch (error) {
      console.warn("Failed to load cached file info:", error)
    }

    return cached
  }

  private async updateCachedFileInfo(files: FileChange[]): Promise<void> {
    const operations = files.map(async file => {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${file.path}`
      const fileInfo: CachedFileInfo = {
        path: file.path,
        sha: file.sha,
        lastModified: file.lastModified.toISOString(),
        size: file.size,
      }

      return this.cacheManager.set(cacheKey, fileInfo, 24 * 60 * 60 * 1000) // 24 hours
    })

    await Promise.all(operations)
  }

  async getFileContent(path: string): Promise<string | null> {
    try {
      return await this.githubClient.getFileContent(path)
    } catch (error) {
      console.error(`Failed to get content for ${path}:`, error)
      return null
    }
  }

  async validateFileExists(path: string): Promise<boolean> {
    try {
      await this.githubClient.getFileContent(path)
      return true
    } catch {
      return false
    }
  }

  async getLastChangeTime(path: string): Promise<Date | null> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${path}`
    const fileInfo = await this.cacheManager.get<CachedFileInfo>(cacheKey)

    return fileInfo ? new Date(fileInfo.lastModified) : null
  }

  async clearCache(): Promise<void> {
    const keys = await this.cacheManager.getKeys(this.CACHE_KEY_PREFIX)
    await Promise.all(keys.map(key => this.cacheManager.delete(key)))
  }
}

export default ChangeDetector
