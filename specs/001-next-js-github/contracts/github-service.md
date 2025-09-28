# GitHub Integration Contracts

## Internal GitHub API Service

Service layer for interacting with GitHub API with caching and error handling.

### fetchRepositoryContents()

```typescript
interface FetchContentsRequest {
  path: string // Repository path to fetch
  recursive?: boolean // Whether to fetch subdirectories
  ref?: string // Git reference (default: main branch)
}

interface FetchContentsResponse {
  files: {
    path: string
    name: string
    sha: string // Git SHA hash
    size: number
    type: "file" | "dir"
    lastModified: Date
    downloadUrl?: string // For files only
  }[]
  metadata: {
    apiCallsUsed: number
    cacheHit: boolean
    rateLimit: {
      remaining: number
      resetAt: Date
    }
  }
}
```

### fetchFileContent()

```typescript
interface FetchFileRequest {
  filePath: string // Full path to file in repository
  ref?: string // Git reference
  useCache?: boolean // Whether to use cached version
}

interface FetchFileResponse {
  content: string // Decoded file content
  metadata: {
    sha: string // Git SHA for change detection
    size: number
    lastModified: Date
    encoding: "utf-8" | "base64"
  }
  cache: {
    hit: boolean
    age: number // Minutes since cached
    expires: Date
  }
  api: {
    callsUsed: number
    rateLimit: {
      remaining: number
      resetAt: Date
    }
  }
}
```

### validateRepositoryAccess()

```typescript
interface ValidateAccessRequest {
  repository: string // owner/repo format
  token: string // GitHub API token
}

interface ValidateAccessResponse {
  hasAccess: boolean
  permissions: {
    read: boolean
    write: boolean
    admin: boolean
  }
  repository: {
    name: string
    fullName: string
    private: boolean
    defaultBranch: string
    lastPush: Date
  }
  rateLimit: {
    remaining: number
    resetAt: Date
  }
}
```

## Content Processing Contracts

### parseMarkdownContent()

```typescript
interface ParseMarkdownRequest {
  content: string // Raw markdown content
  filePath: string // For error reporting
  options?: {
    extractExcerpt?: boolean
    generateTOC?: boolean
    validateLinks?: boolean
  }
}

interface ParseMarkdownResponse {
  frontmatter: {
    [key: string]: any // Parsed frontmatter fields
  }
  content: string // Processed HTML content
  excerpt?: string // Auto-generated or from frontmatter
  metadata: {
    wordCount: number
    readingTime: number // Minutes
    headings: {
      level: number
      text: string
      id: string
    }[]
  }
  validation: {
    isValid: boolean
    errors: string[] // Validation errors
    warnings: string[] // Non-fatal issues
  }
}
```

### generateContentSlug()

```typescript
interface GenerateSlugRequest {
  title?: string // Preferred source for slug
  filePath: string // Fallback source
  existingSlugs: string[] // For uniqueness checking
}

interface GenerateSlugResponse {
  slug: string // Generated unique slug
  source: "title" | "filename" // What was used to generate
  conflicts: string[] // Any conflicts found and resolved
}
```

## Cache Service Contracts

### getCachedContent()

```typescript
interface GetCacheRequest {
  key: string // Cache key
  type: "content" | "api" | "processed"
}

interface GetCacheResponse {
  found: boolean
  data?: any // Cached data if found
  metadata?: {
    createdAt: Date
    expiresAt: Date
    lastAccessed: Date
    hitCount: number
    isStale: boolean
  }
}
```

### setCachedContent()

```typescript
interface SetCacheRequest {
  key: string
  data: any
  ttl?: number // TTL in seconds (default from config)
  tags?: string[] // For bulk invalidation
}

interface SetCacheResponse {
  success: boolean
  expiresAt: Date
  size: number // Bytes stored
}
```

### invalidateCache()

```typescript
interface InvalidateCacheRequest {
  pattern?: string // Key pattern to match
  tags?: string[] // Tags to invalidate
  type?: "content" | "api" | "processed"
}

interface InvalidateCacheResponse {
  invalidated: number // Number of entries removed
  keys: string[] // Keys that were invalidated
}
```

## Error Response Contracts

All APIs return consistent error responses:

```typescript
interface ErrorResponse {
  error: {
    code: string // Machine-readable error code
    message: string // Human-readable error message
    details?: any // Additional error context
    timestamp: string // ISO 8601
    requestId: string // For tracing
  }
  metadata?: {
    cacheStatus?: "unavailable" | "stale"
    fallbackData?: boolean // Whether response contains fallback data
    retryAfter?: number // Seconds before retry (for rate limiting)
  }
}
```

### Common Error Codes

- `GITHUB_API_UNAVAILABLE`: GitHub API is down or unreachable
- `GITHUB_RATE_LIMITED`: API rate limit exceeded
- `GITHUB_AUTH_FAILED`: Invalid or expired authentication
- `CONTENT_NOT_FOUND`: Requested content doesn't exist
- `CONTENT_PARSE_ERROR`: Markdown parsing failed
- `CACHE_ERROR`: Caching system failure
- `VALIDATION_ERROR`: Content validation failed
- `PREVIEW_TOKEN_INVALID`: Preview token expired or invalid
- `PREVIEW_TOKEN_EXPIRED`: Preview access has expired
- `INTERNAL_ERROR`: Unexpected system error

All contracts support graceful degradation and will attempt to serve cached data
with appropriate metadata when external services are unavailable.
