// GitHub API integration types

export interface GitHubContent {
  // Source Information
  filePath: string // Repository file path
  sha: string // Git SHA hash
  size: number // File size in bytes

  // Content & Metadata
  content: string // Base64 or decoded content
  encoding: "base64" | "utf-8"
  lastModified: Date // From GitHub API

  // API Response Metadata
  fetchTimestamp: Date // When fetched from GitHub
  eTag?: string // HTTP ETag for conditional requests
  apiRateLimit: {
    remaining: number
    resetTime: Date
  }
}

export interface GitHubRepository {
  owner: string
  repo: string
  branch: string
  accessToken: string
}

export interface GitHubApiError {
  status: number
  message: string
  documentation_url?: string
  errors?: Array<{
    resource: string
    field: string
    code: string
  }>
}

export interface GitHubRateLimit {
  remaining: number
  limit: number
  reset: number
  used: number
}

export interface GitHubFileResponse {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: "file" | "dir"
  content?: string
  encoding?: "base64"
  _links: {
    self: string
    git: string
    html: string
  }
}
