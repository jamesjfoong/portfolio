// GitHub API client service
import { Octokit } from "@octokit/rest"

import type { GitHubContent, GitHubFileResponse, GitHubRateLimit, GitHubRepository } from "@/types/github"

export class GitHubClient {
  private octokit: Octokit
  private config: GitHubRepository

  constructor(config: GitHubRepository) {
    this.config = config
    this.octokit = new Octokit({
      auth: config.accessToken,
    })
  }

  /**
   * Fetch repository contents from a specific path
   */
  async fetchRepositoryContents(path: string = "content", _recursive: boolean = false): Promise<GitHubFileResponse[]> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      })

      if (Array.isArray(data)) {
        return data as GitHubFileResponse[]
      } else {
        return [data as GitHubFileResponse]
      }
    } catch {
      // Use proper error logging service in production
      throw new Error(`Failed to fetch contents from path: ${path}`)
    }
  }

  /**
   * Fetch individual file content
   */
  async fetchFileContent(filePath: string): Promise<GitHubContent> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: filePath,
        ref: this.config.branch,
      })

      if (Array.isArray(data)) {
        throw new Error("Expected file, got directory")
      }

      const fileData = data as GitHubFileResponse

      if (!fileData.content) {
        throw new Error("File content not available")
      }

      // Decode base64 content
      const decodedContent = Buffer.from(fileData.content, "base64").toString("utf-8")

      const rateLimit = await this.getRateLimit()

      return {
        filePath,
        sha: fileData.sha,
        size: fileData.size,
        content: decodedContent,
        encoding: "utf-8",
        lastModified: new Date(), // GitHub API doesn't provide this directly
        fetchTimestamp: new Date(),
        eTag: undefined, // Would need to be extracted from response headers
        apiRateLimit: {
          remaining: rateLimit.remaining,
          resetTime: new Date(rateLimit.reset * 1000),
        },
      }
    } catch {
      throw new Error(`Failed to fetch file: ${filePath}`)
    }
  }

  /**
   * Check GitHub API rate limits
   */
  async getRateLimit(): Promise<GitHubRateLimit> {
    try {
      const { data } = await this.octokit.rest.rateLimit.get()
      return data.rate
    } catch {
      throw new Error("Failed to check API rate limit")
    }
  }

  /**
   * Validate repository access
   */
  async validateAccess(): Promise<boolean> {
    try {
      await this.octokit.rest.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      })
      return true
    } catch {
      return false
    }
  }
}
