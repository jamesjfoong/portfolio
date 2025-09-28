# Content API Contracts

## GET /api/content/blog

Retrieve paginated list of published blog posts.

### Request

```typescript
interface BlogListRequest {
  // Query Parameters
  page?: number // Page number (default: 1)
  limit?: number // Items per page (default: 20, max: 50)
  tags?: string[] // Filter by tags
  category?: string // Filter by category
  search?: string // Full-text search query
  sortBy?: "date" | "title" | "modified"
  sortOrder?: "asc" | "desc"
}
```

### Response

```typescript
interface BlogListResponse {
  posts: {
    slug: string
    title: string
    excerpt: string
    publishDate: string // ISO 8601
    lastModified: string // ISO 8601
    tags: string[]
    categories: string[]
    author?: string
    readingTime: number // Minutes
  }[]
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
    lastSync: string // ISO 8601
    freshness: number // Minutes since last sync
  }
}
```

### Status Codes

- `200 OK`: Success
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: System error
- `503 Service Unavailable`: GitHub API unavailable, serving cached data

---

## GET /api/content/blog/[slug]

Retrieve individual blog post content.

### Request

```typescript
interface BlogPostRequest {
  slug: string // Path parameter
}
```

### Response

```typescript
interface BlogPostResponse {
  post: {
    slug: string
    title: string
    content: string // Processed HTML
    publishDate: string // ISO 8601
    lastModified: string // ISO 8601
    tags: string[]
    categories: string[]
    author?: string
    description?: string // Meta description
    ogImage?: string // Open Graph image URL
    readingTime: number // Minutes
    wordCount: number
    headings: {
      level: number
      text: string
      id: string
    }[]
  }
  metadata: {
    cacheStatus: "fresh" | "cached"
    lastSync: string // ISO 8601
    freshness: number // Minutes since last sync
  }
}
```

### Status Codes

- `200 OK`: Success
- `404 Not Found`: Post not found or not published
- `500 Internal Server Error`: System error
- `503 Service Unavailable`: GitHub API unavailable, serving cached data

---

## GET /api/content/projects

Retrieve list of published projects.

### Request

```typescript
interface ProjectListRequest {
  // Query Parameters
  tags?: string[] // Filter by technology tags
  status?: "completed" | "in-progress" | "archived"
  sortBy?: "priority" | "date" | "title"
  sortOrder?: "asc" | "desc"
}
```

### Response

```typescript
interface ProjectListResponse {
  projects: {
    slug: string
    title: string
    description: string
    technologies: string[]
    completionStatus: string
    displayPriority: number
    publishDate: string // ISO 8601
    lastModified: string // ISO 8601
    projectLinks: {
      demo?: string
      repository?: string
      documentation?: string
    }
    images: string[] // Optimized image URLs
  }[]
  metadata: {
    cacheStatus: "fresh" | "cached"
    lastSync: string // ISO 8601
    freshness: number // Minutes since last sync
  }
}
```

### Status Codes

- `200 OK`: Success
- `400 Bad Request`: Invalid filter parameters
- `500 Internal Server Error`: System error
- `503 Service Unavailable`: GitHub API unavailable, serving cached data

---

## GET /api/content/projects/[slug]

Retrieve individual project details.

### Request

```typescript
interface ProjectRequest {
  slug: string // Path parameter
}
```

### Response

```typescript
interface ProjectResponse {
  project: {
    slug: string
    title: string
    description: string
    content: string // Processed HTML
    technologies: string[]
    completionStatus: string
    displayPriority: number
    publishDate: string // ISO 8601
    lastModified: string // ISO 8601
    projectLinks: {
      demo?: string
      repository?: string
      documentation?: string
    }
    images: string[] // Optimized image URLs with dimensions
  }
  metadata: {
    cacheStatus: "fresh" | "cached"
    lastSync: string // ISO 8601
    freshness: number // Minutes since last sync
  }
}
```

### Status Codes

- `200 OK`: Success
- `404 Not Found`: Project not found or not published
- `500 Internal Server Error`: System error
- `503 Service Unavailable`: GitHub API unavailable, serving cached data

---

## GET /api/content/search

Full-text search across all published content.

### Request

```typescript
interface SearchRequest {
  q: string // Search query
  type?: "blog" | "project" | "all"
  limit?: number // Max results (default: 20, max: 50)
}
```

### Response

```typescript
interface SearchResponse {
  results: {
    type: "blog" | "project"
    slug: string
    title: string
    excerpt: string // With highlighted search terms
    url: string
    relevanceScore: number
    matchType: string
    matchedTerms: string[]
    publishDate: string // ISO 8601
    tags: string[]
  }[]
  query: {
    term: string
    type: string
    limit: number
    totalResults: number
    searchTime: number // Milliseconds
  }
  metadata: {
    cacheStatus: "fresh" | "cached"
    indexLastUpdated: string // ISO 8601
  }
}
```

### Status Codes

- `200 OK`: Success (even if no results)
- `400 Bad Request`: Invalid search query
- `500 Internal Server Error`: System error
- `503 Service Unavailable`: Search index unavailable, limited cached results

---

## POST /api/content/sync

Trigger manual content synchronization (admin only).

### Request

```typescript
interface SyncRequest {
  type?: "full" | "partial" // Default: partial
  force?: boolean // Force sync even if recent sync completed
}
```

### Response

```typescript
interface SyncResponse {
  operation: {
    id: string
    status: "queued" | "running"
    startedAt: string // ISO 8601
    type: string
  }
  message: string
}
```

### Status Codes

- `202 Accepted`: Sync operation queued
- `409 Conflict`: Sync already in progress
- `429 Too Many Requests`: Rate limited
- `500 Internal Server Error`: System error

---

## GET /api/content/status

System status and health information.

### Response

```typescript
interface StatusResponse {
  status: "healthy" | "degraded" | "unhealthy"
  services: {
    github: {
      status: "available" | "rate-limited" | "unavailable"
      lastSuccess: string // ISO 8601
      rateLimit: {
        remaining: number
        resetAt: string // ISO 8601
      }
    }
    cache: {
      status: "healthy" | "degraded"
      hitRate: number // Percentage
      size: number // Bytes
    }
    content: {
      totalPosts: number
      totalProjects: number
      lastSync: string // ISO 8601
      syncFrequency: string // Minutes
    }
  }
  uptime: number // Seconds
  version: string
}
```

### Status Codes

- `200 OK`: System operational
- `503 Service Unavailable`: System degraded or unhealthy
