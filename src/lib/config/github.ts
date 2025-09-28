/**
 * GitHub Repository Configuration
 *
 * Manages GitHub API configuration, rate limiting, and repository settings
 * for content synchronization and access control.
 */

import { env } from "./env"

export interface GitHubConfig {
  // Authentication
  token?: string

  // Repository settings
  owner?: string
  repo?: string
  branch: string
  contentPath: string

  // API settings
  baseUrl: string
  timeout: number
  retryAttempts: number
  retryDelay: number

  // Rate limiting
  rateLimitRequests: number
  rateLimitWindow: number
  rateLimitBuffer: number // Reserve buffer for other operations

  // Content settings
  allowedExtensions: string[]
  maxFileSize: number // in bytes
  maxFilesPerSync: number

  // Caching
  cacheFileInfo: boolean
  cacheContent: boolean
  cacheEtags: boolean
}

export interface GitHubRepositoryInfo {
  owner: string
  repo: string
  branch: string
  isPrivate: boolean
  lastUpdated?: string
  size?: number
  starCount?: number
  forkCount?: number
}

class GitHubConfigManager {
  private static instance: GitHubConfigManager
  private config: GitHubConfig
  private repositoryInfo?: GitHubRepositoryInfo
  private rateLimitInfo?: {
    limit: number
    remaining: number
    reset: number
    used: number
  }

  private constructor() {
    this.config = this.createConfig()
  }

  static getInstance(): GitHubConfigManager {
    if (!GitHubConfigManager.instance) {
      GitHubConfigManager.instance = new GitHubConfigManager()
    }
    return GitHubConfigManager.instance
  }

  private createConfig(): GitHubConfig {
    return {
      // Authentication
      token: env.GITHUB_TOKEN,

      // Repository settings
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      branch: process.env.GITHUB_BRANCH || "main",
      contentPath: env.GITHUB_CONTENT_PATH || "content",

      // API settings
      baseUrl: "https://api.github.com",
      timeout: env.API_REQUEST_TIMEOUT_MS,
      retryAttempts: 3,
      retryDelay: 1000, // 1 second base delay

      // Rate limiting (GitHub allows 5000 requests per hour)
      rateLimitRequests: env.API_RATE_LIMIT_REQUESTS,
      rateLimitWindow: env.API_RATE_LIMIT_WINDOW_MS,
      rateLimitBuffer: 500, // Keep 500 requests in reserve

      // Content settings
      allowedExtensions: [".md", ".mdx", ".json", ".yml", ".yaml"],
      maxFileSize: 1024 * 1024, // 1MB
      maxFilesPerSync: 100,

      // Caching
      cacheFileInfo: true,
      cacheContent: true,
      cacheEtags: true,
    }
  }

  getConfig(): GitHubConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<GitHubConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  // Authentication helpers
  isAuthenticated(): boolean {
    return !!this.config.token
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-CMS/1.0.0",
    }

    if (this.config.token) {
      headers["Authorization"] = `token ${this.config.token}`
    }

    return headers
  }

  // Repository info
  setRepositoryInfo(info: GitHubRepositoryInfo): void {
    this.repositoryInfo = info
  }

  getRepositoryInfo(): GitHubRepositoryInfo | undefined {
    return this.repositoryInfo
  }

  // Rate limit management
  updateRateLimitInfo(headers: Headers): void {
    const limit = headers.get("X-RateLimit-Limit")
    const remaining = headers.get("X-RateLimit-Remaining")
    const reset = headers.get("X-RateLimit-Reset")
    const used = headers.get("X-RateLimit-Used")

    if (limit && remaining && reset && used) {
      this.rateLimitInfo = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10),
        used: parseInt(used, 10),
      }
    }
  }

  getRateLimitInfo(): typeof this.rateLimitInfo {
    return this.rateLimitInfo
  }

  hasRateLimitBudget(requestsNeeded: number = 1): boolean {
    if (!this.rateLimitInfo) {
      return true // Assume we have budget if we don't know
    }

    const available = this.rateLimitInfo.remaining - this.config.rateLimitBuffer
    return available >= requestsNeeded
  }

  getTimeUntilReset(): number {
    if (!this.rateLimitInfo) {
      return 0
    }

    const resetTime = this.rateLimitInfo.reset * 1000 // Convert to milliseconds
    const now = Date.now()
    return Math.max(0, resetTime - now)
  }

  // URL builders
  getRepositoryUrl(): string {
    if (!this.config.owner || !this.config.repo) {
      throw new Error("GitHub owner and repo must be configured")
    }
    return `${this.config.baseUrl}/repos/${this.config.owner}/${this.config.repo}`
  }

  getContentsUrl(path: string = ""): string {
    const repoUrl = this.getRepositoryUrl()
    const fullPath = path ? `${this.config.contentPath}/${path}` : this.config.contentPath
    return `${repoUrl}/contents/${fullPath}?ref=${this.config.branch}`
  }

  getFileUrl(path: string): string {
    const repoUrl = this.getRepositoryUrl()
    return `${repoUrl}/contents/${path}?ref=${this.config.branch}`
  }

  getCommitsUrl(path?: string): string {
    const repoUrl = this.getRepositoryUrl()
    const params = new URLSearchParams({
      sha: this.config.branch,
      ...(path && { path }),
    })
    return `${repoUrl}/commits?${params}`
  }

  // Validation
  validate(): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Required for content operations
    if (!this.config.owner) {
      errors.push("GitHub owner is required")
    }

    if (!this.config.repo) {
      errors.push("GitHub repository name is required")
    }

    if (!this.config.token) {
      if (env.NODE_ENV === "production") {
        errors.push("GitHub token is required in production")
      } else {
        warnings.push("GitHub token not provided - API rate limits will be lower")
      }
    }

    // Validate file size limits
    if (this.config.maxFileSize > 100 * 1024 * 1024) {
      // 100MB GitHub limit
      warnings.push("Max file size exceeds GitHub API limits (100MB)")
    }

    // Validate rate limiting
    if (this.config.rateLimitRequests > 5000) {
      warnings.push("Rate limit requests exceed GitHub limits (5000/hour)")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // Content path helpers
  isContentFile(path: string): boolean {
    // Check if file is in content directory
    if (!path.startsWith(this.config.contentPath)) {
      return false
    }

    // Check file extension
    return this.config.allowedExtensions.some(ext => path.endsWith(ext))
  }

  getRelativeContentPath(fullPath: string): string {
    if (fullPath.startsWith(`${this.config.contentPath}/`)) {
      return fullPath.substring(this.config.contentPath.length + 1)
    }
    return fullPath
  }

  // Environment-specific configurations
  getEnvironmentConfig(): Partial<GitHubConfig> {
    if (env.NODE_ENV === "development") {
      return {
        retryAttempts: 1, // Faster failures in development
        timeout: 5000, // Shorter timeout
        rateLimitBuffer: 100, // Lower buffer
      }
    }

    if (env.NODE_ENV === "production") {
      return {
        retryAttempts: 3,
        timeout: 10000,
        rateLimitBuffer: 500,
      }
    }

    return {}
  }
}

// Singleton instance
const githubConfigManager = GitHubConfigManager.getInstance()

// Export the configuration
export const githubConfig = githubConfigManager.getConfig()

// Export manager methods
export const {
  getConfig: getGitHubConfig,
  updateConfig: updateGitHubConfig,
  isAuthenticated,
  getAuthHeaders,
  setRepositoryInfo,
  getRepositoryInfo,
  updateRateLimitInfo,
  getRateLimitInfo,
  hasRateLimitBudget,
  getTimeUntilReset,
  getRepositoryUrl,
  getContentsUrl,
  getFileUrl,
  getCommitsUrl,
  validate: validateGitHubConfig,
  isContentFile,
  getRelativeContentPath,
} = githubConfigManager

export default githubConfigManager
