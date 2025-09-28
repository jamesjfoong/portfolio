// GitHub repository content fetcher service
import type { GitHubContent, GitHubFileResponse } from "@/types/github"

import type { GitHubClient } from "./client"

export interface ContentFetcherConfig {
  blogPath: string
  projectPath: string
  allowedExtensions: string[]
  maxFileSize: number // bytes
  timeout: number // milliseconds
}

export interface FetchResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  retryAfter?: number // seconds for rate limiting
}

export interface DirectoryContents {
  files: GitHubFileResponse[]
  directories: GitHubFileResponse[]
  totalSize: number
  lastModified: Date
}

export class ContentFetcher {
  private client: GitHubClient
  private config: ContentFetcherConfig

  constructor(client: GitHubClient, config: ContentFetcherConfig) {
    this.client = client
    this.config = config
  }

  /**
   * Fetch all blog post files from the configured path
   */
  async fetchBlogFiles(): Promise<FetchResult<GitHubFileResponse[]>> {
    try {
      const result = await this.client.fetchRepositoryContents(this.config.blogPath)
      const blogFiles = result.filter(
        file => file.type === "file" && this.isAllowedExtension(file.name) && file.size <= this.config.maxFileSize
      )

      return {
        success: true,
        data: blogFiles,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch blog files",
      }
    }
  }

  /**
   * Fetch all project files from the configured path
   */
  async fetchProjectFiles(): Promise<FetchResult<GitHubFileResponse[]>> {
    try {
      const result = await this.client.fetchRepositoryContents(this.config.projectPath)
      const projectFiles = result.filter(
        file => file.type === "file" && this.isAllowedExtension(file.name) && file.size <= this.config.maxFileSize
      )

      return {
        success: true,
        data: projectFiles,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch project files",
      }
    }
  }

  /**
   * Fetch individual file content
   */
  async fetchFileContent(filePath: string): Promise<FetchResult<GitHubContent>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

      const content = await this.client.fetchFileContent(filePath)
      clearTimeout(timeoutId)

      return {
        success: true,
        data: content,
      }
    } catch (error) {
      if (error instanceof Error) {
        // Handle rate limiting
        if (error.message.includes("rate limit")) {
          return {
            success: false,
            error: "GitHub API rate limit exceeded",
            retryAfter: 3600, // 1 hour default
          }
        }

        // Handle timeout
        if (error.name === "AbortError") {
          return {
            success: false,
            error: "Request timeout",
          }
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch file content",
      }
    }
  }

  /**
   * Fetch directory contents with metadata
   */
  async fetchDirectoryContents(path: string): Promise<FetchResult<DirectoryContents>> {
    try {
      const result = await this.client.fetchRepositoryContents(path)

      const files = result.filter(item => item.type === "file")
      const directories = result.filter(item => item.type === "dir")
      const totalSize = files.reduce((sum, file) => sum + file.size, 0)

      // Get the most recent modification date (GitHub doesn't provide this directly)
      const lastModified = new Date()

      return {
        success: true,
        data: {
          files,
          directories,
          totalSize,
          lastModified,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch directory contents",
      }
    }
  }

  /**
   * Batch fetch multiple files efficiently
   */
  async batchFetchFiles(filePaths: string[]): Promise<Array<FetchResult<GitHubContent>>> {
    const results: Array<FetchResult<GitHubContent>> = []

    // Process files in chunks to avoid rate limiting
    const chunkSize = 5
    for (let i = 0; i < filePaths.length; i += chunkSize) {
      const chunk = filePaths.slice(i, i + chunkSize)

      const chunkPromises = chunk.map(filePath => this.fetchFileContent(filePath))
      const chunkResults = await Promise.all(chunkPromises)

      results.push(...chunkResults)

      // Add delay between chunks to respect rate limits
      if (i + chunkSize < filePaths.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return results
  }

  /**
   * Check if file extension is allowed
   */
  private isAllowedExtension(filename: string): boolean {
    const extension = filename.split(".").pop()?.toLowerCase()
    return extension ? this.config.allowedExtensions.includes(extension) : false
  }

  /**
   * Validate file size limits
   */
  validateFileSize(file: GitHubFileResponse): boolean {
    return file.size <= this.config.maxFileSize
  }

  /**
   * Get configuration
   */
  getConfig(): ContentFetcherConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ContentFetcherConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

// Default configuration
const defaultConfig: ContentFetcherConfig = {
  blogPath: "content/blog",
  projectPath: "content/projects",
  allowedExtensions: ["md", "mdx"],
  maxFileSize: 1024 * 1024, // 1MB
  timeout: 30000, // 30 seconds
}

// Export factory function
export function createContentFetcher(client: GitHubClient, config?: Partial<ContentFetcherConfig>): ContentFetcher {
  return new ContentFetcher(client, { ...defaultConfig, ...config })
}
