// API response types for GitHub CMS Integration

// Common API Response Structure
// API response and request types

// Base API response structure
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success?: boolean
  timestamp?: string
}

// Paginated response structure
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Content API Response Types
export interface BlogListResponse
  extends PaginatedResponse<{
    slug: string
    title: string
    excerpt: string
    publishDate: string
    lastModified: string
    published: boolean
    tags: string[]
    categories: string[]
    author?: string
    readingTime: number
  }> {
  filters: {
    category?: string
    tag?: string
    published?: string
  }
}

export interface BlogPostResponse
  extends ApiResponse<{
    slug: string
    title: string
    content: string
    excerpt?: string
    publishDate: string
    lastModified: string
    published: boolean
    tags: string[]
    categories: string[]
    author?: string
    description?: string
    ogImage?: string
    readingTime: number
    wordCount: number
    headings: Array<{
      level: number
      text: string
      id: string
    }>
  }> {
  meta: {
    lastSync: string
    source: string
    cached: boolean
  }
}

export interface ProjectListResponse
  extends PaginatedResponse<{
    slug: string
    title: string
    description: string
    publishDate: string
    lastModified: string
    published: boolean
    completionStatus: string
    technologies: string[]
    projectLinks: {
      demo?: string
      repository?: string
      documentation?: string
    }
    images: string[]
    displayPriority: number
  }> {
  filters: {
    technology?: string
    status?: string
    published?: string
    available: {
      technologies: string[]
      statuses: string[]
    }
  }
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    sortBy: string
  }
}

export interface ProjectResponse
  extends ApiResponse<{
    slug: string
    title: string
    description: string
    content: string
    publishDate: string
    lastModified: string
    published: boolean
    completionStatus: string
    technologies: string[]
    projectLinks: {
      demo?: string
      repository?: string
      documentation?: string
    }
    images: string[]
    displayPriority: number
    readingTime: number
    wordCount: number
    headings: Array<{
      level: number
      text: string
      id: string
    }>
  }> {
  meta: {
    lastSync: string
    source: string
    cached: boolean
  }
}

// Search API Response Types
export interface SearchResponse
  extends PaginatedResponse<{
    type: string
    slug: string
    title: string
    excerpt?: string
    description?: string
    publishDate: string
    tags?: string[]
    technologies?: string[]
    matchType: string
    relevanceScore: number
    highlights: {
      title?: string
      content?: string
    }
  }> {
  meta: {
    query: string
    type: string
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    searchTime: number
  }
  suggestions: string[]
  filters: {
    availableTypes: string[]
  }
}

// Sync API Response Types
export interface SyncResponse
  extends ApiResponse<{
    success: boolean
    startTime: string
    endTime: string
    itemsSynced: number
    itemsSkipped: number
    errors: string[]
    warnings: string[]
    syncedItems: Array<{
      slug: string
      type: string
      action: string
    }>
    stats: {
      blogPosts: {
        total: number
        created: number
        updated: number
        deleted: number
        skipped: number
      }
      projects: {
        total: number
        created: number
        updated: number
        deleted: number
        skipped: number
      }
    }
    cacheInvalidated: boolean
    nextSync: string
  }> {}

export interface SyncStatusResponse
  extends ApiResponse<{
    isRunning: boolean
    lastSync: {
      timestamp: string
      success: boolean
      duration: number
      itemsSynced: number
    }
    nextScheduledSync: string
    githubRateLimit: {
      remaining: number
      limit: number
      resetTime: string
    }
    cacheStats: {
      blogPosts: number
      projects: number
      lastClearTime: string
    }
  }> {}

// Status API Response Types
export interface StatusResponse
  extends ApiResponse<{
    status: string
    timestamp: string
    services: {
      githubApi: {
        status: string
        responseTime: number
        rateLimit: {
          remaining: number
          limit: number
          resetTime: string
        }
      }
      cache: {
        status: string
        memory: {
          totalEntries: number
          totalSize: number
          hitRate: number
          averageResponseTime: number
        }
        fileSystem: {
          status: string
          totalFiles: number
          totalSize: number
          oldestEntry: string
        }
      }
      contentSync: {
        status: string
        lastSync: string
        nextSync: string
        isRunning: boolean
      }
      search: {
        status: string
        indexStatus: string
        totalDocuments: number
        lastIndexUpdate: string
      }
    }
    content: {
      blog: {
        total: number
        published: number
        drafts: number
        lastUpdated: string
      }
      projects: {
        total: number
        published: number
        drafts: number
        lastUpdated: string
      }
    }
    performance: {
      uptime: number
      memoryUsage: {
        rss: number
        heapUsed: number
        heapTotal: number
        external: number
      }
      averageResponseTime: number
      requestsPerMinute: number
    }
    health: {
      overall: string
      issues: string[]
      warnings: string[]
    }
  }> {}

// Health API Response Types
export interface HealthResponse
  extends ApiResponse<{
    status: string
    timestamp: string
    uptime: number
    environment: string
    cache: {
      totalEntries: number
      totalSize: number
      hitRate: number
      averageResponseTime: number
      oldestEntry: string
      newestEntry: string
    }
    system: {
      nodeVersion: string
      platform: string
      arch: string
      memoryUsage: {
        rss: number
        heapUsed: number
        heapTotal: number
        external: number
      }
    }
  }> {}

// Preview API Response Types
export interface PreviewGenerateResponse
  extends ApiResponse<{
    token: string
    previewUrl: string
    expiresAt: string
  }> {}

export interface PreviewResponse
  extends ApiResponse<{
    content: {
      title: string
      content: string
      frontmatter: Record<string, unknown>
    }
    meta: {
      type: string
      slug: string
      isPreview: boolean
      expiresAt: string
    }
  }> {}

// Error Response Types
export interface ErrorResponse {
  error: string
  message: string
  code?: string
  details?: Record<string, unknown>
  timestamp: string
  path?: string
}

// Request Types
export interface SyncRequest {
  force?: boolean
  type?: "blog" | "project" | "all"
}

export interface PreviewRequest {
  type: "blog" | "project"
  slug: string
  settings?: {
    showDrafts?: boolean
    showUnpublished?: boolean
  }
  expiresIn?: number // minutes
}

export interface SearchRequest {
  q: string
  type?: "blog" | "project" | "all"
  page?: number
  limit?: number
}

// Blog API Responses
export interface BlogListResponse {
  posts: Array<{
    slug: string
    title: string
    excerpt: string
    publishDate: string
    lastModified: string
    tags: string[]
    categories: string[]
    author?: string
    readingTime: number
  }>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  metadata: {
    cacheStatus: "fresh" | "cached"
    lastSync: string
    freshness: number
  }
}

export interface BlogPostResponse {
  post: {
    slug: string
    title: string
    content: string
    publishDate: string
    lastModified: string
    tags: string[]
    categories: string[]
    author?: string
    description?: string
    ogImage?: string
    readingTime: number
    wordCount: number
    headings: Array<{
      level: number
      text: string
      id: string
    }>
  }
  metadata: {
    cacheStatus: "fresh" | "cached"
    lastSync: string
    freshness: number
  }
}

// Project API Responses
export interface ProjectListResponse {
  projects: Array<{
    slug: string
    title: string
    description: string
    technologies: string[]
    completionStatus: string
    displayPriority: number
    publishDate: string
    lastModified: string
    projectLinks: {
      demo?: string
      repository?: string
      documentation?: string
    }
    images: string[]
  }>
  metadata: {
    cacheStatus: "fresh" | "cached"
    lastSync: string
    freshness: number
  }
}

export interface ProjectResponse {
  project: {
    slug: string
    title: string
    description: string
    content: string
    technologies: string[]
    completionStatus: string
    displayPriority: number
    publishDate: string
    lastModified: string
    projectLinks: {
      demo?: string
      repository?: string
      documentation?: string
    }
    images: string[]
  }
  metadata: {
    cacheStatus: "fresh" | "cached"
    lastSync: string
    freshness: number
  }
}

// Search API Response
export interface SearchResponse {
  results: Array<{
    type: "blog" | "project"
    slug: string
    title: string
    excerpt: string
    url: string
    relevanceScore: number
    matchType: string
    matchedTerms: string[]
    publishDate: string
    tags: string[]
  }>
  query: {
    term: string
    type: string
    limit: number
    totalResults: number
    searchTime: number
  }
  metadata: {
    cacheStatus: "fresh" | "cached"
    indexLastUpdated: string
  }
}

// System Status Response
export interface StatusResponse {
  status: "healthy" | "degraded" | "unhealthy"
  services: {
    github: {
      status: "available" | "rate-limited" | "unavailable"
      lastSuccess: string
      rateLimit: {
        remaining: number
        resetAt: string
      }
    }
    cache: {
      status: "healthy" | "degraded"
      hitRate: number
      size: number
    }
    content: {
      totalPosts: number
      totalProjects: number
      lastSync: string
      syncFrequency: string
    }
  }
  uptime: number
  version: string
}

// Preview API Responses
export interface PreviewResponse {
  content: {
    type: "blog" | "project"
    slug: string
    title: string
    content: string
    publishDate?: string
    lastModified: string
    tags?: string[]
    categories?: string[]
    technologies?: string[]
    author?: string
    description?: string
  }
  preview: {
    token: string
    expiresAt: string
    accessCount: number
    isStale: boolean
  }
  notice: {
    type: "preview"
    message: string
    expiresIn: number
  }
}

export interface PreviewTokenResponse {
  token: string
  previewUrl: string
  expiresAt: string
  expiresIn: number
}

// Sync Operation Response
export interface SyncResponse {
  operation: {
    id: string
    status: "queued" | "running"
    startedAt: string
    type: string
  }
  message: string
}
