# Data Model: GitHub Markdown CMS Integration

## Core Content Entities

### BlogPost

```typescript
interface BlogPost {
  // Identity & Location
  slug: string // Unique identifier from filename or frontmatter
  filePath: string // GitHub repository file path

  // Content & Metadata
  title: string // From frontmatter or filename fallback
  content: string // Processed HTML from markdown
  excerpt?: string // Auto-generated or from frontmatter

  // Publication & Timing
  published: boolean // Publication status from frontmatter
  publishDate: Date // From frontmatter or file creation
  lastModified: Date // From GitHub API file metadata

  // Categorization & Discovery
  tags: string[] // From frontmatter
  categories: string[] // From frontmatter
  author?: string // From frontmatter

  // SEO & Social
  description?: string // Meta description from frontmatter
  ogImage?: string // Open Graph image from frontmatter

  // System Metadata
  contentHash: string // GitHub file hash for change detection
  syncTimestamp: Date // Last successful sync from GitHub
  validationStatus: "valid" | "error" | "skipped"
  validationErrors?: string[] // Specific validation issues
}
```

### Project

```typescript
interface Project {
  // Identity & Location
  slug: string // Unique identifier
  filePath: string // GitHub repository file path

  // Content & Metadata
  title: string // Project name
  description: string // Short project description
  content: string // Detailed project content (HTML)

  // Publication & Status
  published: boolean // Publication status
  publishDate: Date // From frontmatter
  lastModified: Date // From GitHub API
  completionStatus: "completed" | "in-progress" | "archived"

  // Project-Specific
  technologies: string[] // Technology stack used
  projectLinks: {
    demo?: string // Live demo URL
    repository?: string // Source code repository
    documentation?: string // Project documentation
  }
  images: string[] // Project screenshots/media
  displayPriority: number // Sort order for portfolio display

  // System Metadata
  contentHash: string // For change detection
  syncTimestamp: Date // Last sync
  validationStatus: "valid" | "error" | "skipped"
  validationErrors?: string[]
}
```

## Content Processing Entities

### ContentMetadata

```typescript
interface ContentMetadata {
  // Source Information
  filePath: string // GitHub file path
  fileType: "blog" | "project" // Content category

  // Parsed Frontmatter
  frontmatter: {
    title?: string
    published?: boolean
    date?: string
    tags?: string[]
    categories?: string[]
    description?: string
    author?: string
    [key: string]: any // Additional frontmatter fields
  }

  // Processing Results
  parsedSuccessfully: boolean
  errors: string[] // Parsing or validation errors
  warnings: string[] // Non-fatal issues

  // Content Analysis
  wordCount: number
  estimatedReadingTime: number // In minutes
  headings: {
    level: number
    text: string
    id: string // For TOC generation
  }[]
}
```

### AssetFile

```typescript
interface AssetFile {
  // Identity & Location
  filePath: string // GitHub repository path
  url: string // GitHub raw content URL

  // File Information
  filename: string // Original filename
  fileType: "image" | "document" | "other"
  mimeType: string
  sizeBytes: number

  // Image-Specific (when applicable)
  dimensions?: {
    width: number
    height: number
  }
  optimized: boolean // Whether processed by Next.js Image

  // Status & Validation
  accessible: boolean // Can be fetched successfully
  lastChecked: Date
  contentHash: string // For change detection
}
```

## System & Caching Entities

### GitHubContent

```typescript
interface GitHubContent {
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
```

### CacheEntry

```typescript
interface CacheEntry {
  // Cache Key & Content
  key: string // Unique cache identifier
  data: any // Cached content (varies by type)

  // Timing & Expiration
  createdAt: Date // Cache entry creation
  expiresAt: Date // TTL expiration
  lastAccessed: Date // For LRU eviction

  // Validation & Status
  isValid: boolean // Whether cache entry is usable
  invalidationReason?: string // Why cache was invalidated
  source: "github" | "processed" | "computed" // Data source type

  // Performance Metadata
  generationTimeMs: number // Time to generate cached data
  hitCount: number // Number of cache hits
}
```

### SyncOperation

```typescript
interface SyncOperation {
  // Operation Identity
  id: string // Unique operation ID
  startedAt: Date // Operation start time
  completedAt?: Date // Operation completion (if finished)

  // Operation Details
  type: "full-sync" | "partial-sync" | "file-sync"
  trigger: "scheduled" | "manual" | "webhook"

  // Processing Results
  status: "running" | "completed" | "failed" | "cancelled"
  processedFiles: number // Number of files processed
  addedFiles: number // New content added
  updatedFiles: number // Existing content updated
  skippedFiles: number // Files skipped due to errors

  // Error Tracking
  errors: {
    filePath: string
    errorType: "parse" | "fetch" | "validation" | "processing"
    errorMessage: string
    timestamp: Date
  }[]

  // Performance Metrics
  durationMs: number // Total operation time
  githubApiCalls: number // API requests made
  cacheHits: number // Cache efficiency
  cacheInvalidations: number // Cache entries cleared
}
```

## User Experience Entities

### SearchResult

```typescript
interface SearchResult {
  // Content Reference
  contentType: "blog" | "project"
  slug: string

  // Match Information
  title: string
  excerpt: string // With search term highlighting
  url: string // Full URL to content

  // Relevance & Ranking
  relevanceScore: number // Search ranking score
  matchType: "title" | "content" | "tag" | "description"
  matchedTerms: string[] // Which search terms matched

  // Context
  publishDate: Date
  tags: string[]
  lastModified: Date
}
```

### PreviewSession

```typescript
interface PreviewSession {
  // Session Identity
  token: string // UUID-based preview token
  contentSlug: string // Content being previewed

  // Access Control
  createdAt: Date // Token generation time
  expiresAt: Date // Token expiration (24 hours)
  accessCount: number // Number of times used

  // Content State
  contentHash: string // Hash of content when token created
  isStale: boolean // Whether content has changed since creation
}
```

### ValidationError

```typescript
interface ValidationError {
  // Error Identity & Context
  id: string // Unique error ID
  filePath: string // File that caused error
  timestamp: Date // When error occurred

  // Error Classification
  errorType: "frontmatter" | "markdown" | "asset" | "schema" | "uniqueness"
  severity: "error" | "warning"

  // Error Details
  message: string // Human-readable error description
  line?: number // Line number in file (if applicable)
  column?: number // Column number (if applicable)

  // Resolution & Tracking
  resolved: boolean // Whether error has been fixed
  resolvedAt?: Date // When error was resolved
  notificationSent: boolean // Whether creator was notified
  notificationSentAt?: Date // When notification was sent
}
```

## Entity Relationships & Constraints

### Uniqueness Constraints

- `BlogPost.slug` must be unique across all blog posts
- `Project.slug` must be unique across all projects
- `PreviewSession.token` must be globally unique
- `SyncOperation.id` must be globally unique

### State Transitions

- **Content Publication**: `published: false` → validation → `published: true`
- **Cache Lifecycle**: created → valid → stale → invalidated → expired
- **Sync Operation**: queued → running → (completed | failed)
- **Preview Session**: created → active → expired
- **Validation Error**: detected → notified → (resolved | persistent)

### Data Volume Estimates

- **BlogPost**: ~100 entries, ~50KB per entry processed
- **Project**: ~20 entries, ~100KB per entry processed
- **CacheEntry**: ~500 entries, variable size (1KB-1MB)
- **SyncOperation**: ~1000 historical records, ~5KB per record
- **ValidationError**: ~50 active errors, ~1KB per error

This data model provides comprehensive coverage for all functional requirements
while maintaining clear relationships and supporting the constitutional
requirements for performance, accessibility, and maintainability.
