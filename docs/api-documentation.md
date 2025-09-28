# GitHub Markdown CMS - API Documentation

## Overview

The GitHub Markdown CMS is a comprehensive content management system built on
Next.js 15 that uses GitHub as a backend for Markdown content. This system
provides full-featured CMS capabilities with performance optimization,
accessibility compliance, and TypeScript strict mode enforcement.

## Architecture

### Core Components

#### Content Management

- **Content Service** (`src/lib/services/content.ts`): Core content fetching and
  management
- **GitHub Service** (`src/lib/services/github.ts`): GitHub API integration with
  authentication
- **Cache Service** (`src/lib/services/cache.ts`): Multi-layer caching strategy
- **Search Service** (`src/lib/services/search.ts`): Full-text search with fuzzy
  matching

#### Performance Layer

- **Performance Monitoring** (`src/lib/services/performance.ts`): Core Web
  Vitals tracking
- **Image Optimization** (`src/lib/utils/image.ts`): Advanced image processing
- **Bundle Analysis** (`scripts/analyze-bundle.js`): Performance optimization
  tools

#### Accessibility Framework

- **A11y Testing Suite** (`tests/accessibility/`): Comprehensive WCAG 2.1 AAA
  compliance
- **Screen Reader Support** (`src/components/ui/`): Semantic HTML and ARIA
  implementation
- **Keyboard Navigation** (`src/hooks/`): Complete keyboard accessibility

### Configuration System

#### Environment Configuration

```typescript
interface EnvironmentConfig {
  GITHUB_TOKEN: string
  GITHUB_OWNER: string
  GITHUB_REPO: string
  NODE_ENV: "development" | "production" | "test"
  VERCEL_URL?: string
  ANALYTICS_ID?: string
}
```

#### GitHub Configuration

```typescript
interface GitHubConfig {
  owner: string
  repo: string
  token: string
  apiUrl: string
  rateLimit: {
    requests: number
    window: number
  }
  retryPolicy: {
    attempts: number
    backoff: "exponential" | "linear"
    delay: number
  }
}
```

#### Cache Configuration

```typescript
interface CacheConfig {
  content: {
    ttl: number // 30 minutes
    maxSize: number // 1000 items
  }
  search: {
    ttl: number // 1 hour
    maxSize: number // 500 items
  }
  github: {
    ttl: number // 15 minutes
    maxSize: number // 2000 items
  }
}
```

## API Reference

### Content Service API

#### `getContent(path: string, options?: ContentOptions): Promise<ContentItem>`

Retrieves a single content item by path.

**Parameters:**

- `path`: Content path (e.g., 'blog/my-post')
- `options`: Optional configuration

**Returns:** Promise resolving to ContentItem

**Example:**

```typescript
const post = await getContent("blog/understanding-react-hooks", {
  includeMetadata: true,
  cache: true,
})
```

#### `getContentList(type: ContentType, options?: ListOptions): Promise<ContentItem[]>`

Retrieves a list of content items by type.

**Parameters:**

- `type`: Content type ('blog', 'projects', 'lab')
- `options`: Filtering and pagination options

**Returns:** Promise resolving to ContentItem array

#### `searchContent(query: string, options?: SearchOptions): Promise<SearchResult[]>`

Performs full-text search across content.

**Parameters:**

- `query`: Search query string
- `options`: Search configuration

**Returns:** Promise resolving to SearchResult array

### GitHub Service API

#### `fetchFile(path: string): Promise<GitHubFile>`

Fetches a file from the GitHub repository.

**Parameters:**

- `path`: Repository file path

**Returns:** Promise resolving to GitHubFile

#### `fetchDirectory(path: string): Promise<GitHubDirectory>`

Fetches directory contents from the GitHub repository.

**Parameters:**

- `path`: Repository directory path

**Returns:** Promise resolving to GitHubDirectory

#### `getCommitHistory(path?: string): Promise<GitHubCommit[]>`

Retrieves commit history for a file or the entire repository.

### Cache Service API

#### `get<T>(key: string): Promise<T | null>`

Retrieves cached data by key.

#### `set<T>(key: string, data: T, ttl?: number): Promise<void>`

Stores data in cache with optional TTL.

#### `invalidate(pattern: string): Promise<void>`

Invalidates cached data matching pattern.

#### `clear(): Promise<void>`

Clears all cached data.

### Search Service API

#### `indexContent(content: ContentItem[]): Promise<void>`

Builds search index from content items.

#### `search(query: string, options?: SearchOptions): Promise<SearchResult[]>`

Performs search against indexed content.

**Search Options:**

```typescript
interface SearchOptions {
  limit?: number
  fuzzy?: boolean
  fields?: string[]
  boost?: Record<string, number>
}
```

## Performance Standards

### Core Web Vitals Requirements

- **LCP (Largest Contentful Paint)**: < 1.2s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Performance Monitoring

```typescript
interface PerformanceMetrics {
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
}
```

### Bundle Size Optimization

- Main bundle: < 200KB gzipped
- Route-based code splitting
- Dynamic imports for heavy components
- Optimized third-party libraries

## Accessibility Standards

### WCAG 2.1 AAA Compliance

- **Perceivable**: Color contrast ratios ≥ 7:1, text alternatives for images
- **Operable**: Full keyboard navigation, no seizure-inducing content
- **Understandable**: Clear navigation, consistent behavior
- **Robust**: Valid HTML, compatible with assistive technologies

### Semantic HTML Structure

```html
<main role="main">
  <article role="article">
    <header>
      <h1>Article Title</h1>
      <time datetime="2024-01-01">January 1, 2024</time>
    </header>
    <section role="main">
      <!-- Content -->
    </section>
  </article>
</main>
```

### ARIA Implementation

- Proper role attributes
- Descriptive labels and descriptions
- Live regions for dynamic content
- Skip navigation links

## TypeScript Standards

### Strict Mode Requirements

- `strict: true` in tsconfig.json
- No implicit any types
- Strict null checks enabled
- No unused locals or parameters

### Interface Design Patterns

```typescript
// Configuration interfaces
interface ComponentConfig {
  enabled: boolean
  settings: Record<string, unknown>
}

// Component props interfaces
interface ComponentProps {
  children: React.ReactNode
  className?: string
  variant?: "primary" | "secondary"
}

// Data interfaces
interface ContentData {
  id: string
  title: string
  content: string
  metadata: ContentMetadata
}
```

### Type Coverage Requirements

- Minimum 95% type coverage
- All public APIs fully typed
- Comprehensive interface definitions
- Generic types where appropriate

## Error Handling

### Error Types

```typescript
class ContentError extends Error {
  code: string
  statusCode: number

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message)
    this.code = code
    this.statusCode = statusCode
  }
}

class GitHubError extends Error {
  response: Response

  constructor(message: string, response: Response) {
    super(message)
    this.response = response
  }
}
```

### Error Recovery

- Automatic retry with exponential backoff
- Graceful degradation for non-critical features
- Fallback content for failed requests
- User-friendly error messages

## Security Considerations

### GitHub Token Management

- Environment variable storage
- Minimal required permissions
- Token rotation support
- Rate limiting compliance

### Content Security

- Input sanitization for search queries
- XSS prevention in markdown rendering
- Safe HTML parsing
- CORS configuration

## Deployment

### Environment Setup

```bash
# Required environment variables
GITHUB_TOKEN=ghp_xxxxx
GITHUB_OWNER=username
GITHUB_REPO=repository-name
NODE_ENV=production
```

### Build Configuration

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "analyze": "node scripts/analyze-bundle.js"
  }
}
```

### Monitoring

- Performance tracking with Core Web Vitals
- Error tracking and alerting
- Cache hit rate monitoring
- API usage analytics

## Development Guidelines

### Code Quality

- ESLint configuration with strict rules
- Prettier formatting enforcement
- Pre-commit hooks for quality checks
- Comprehensive test coverage

### Testing Strategy

- Unit tests for utilities and services
- Integration tests for API endpoints
- Component tests with React Testing Library
- End-to-end tests with Playwright
- Performance tests for Core Web Vitals
- Accessibility tests with axe-core

### Contribution Workflow

1. Fork repository
2. Create feature branch
3. Implement changes with tests
4. Ensure all quality checks pass
5. Submit pull request with description

## Support

### Documentation

- API documentation (this file)
- Component documentation (see component-docs.md)
- Deployment guide (see deployment-guide.md)

### Troubleshooting

- Performance debugging tools
- Accessibility testing guidelines
- Common error resolution
- Configuration validation

### Community

- GitHub Issues for bug reports
- GitHub Discussions for questions
- Contributing guidelines in CONTRIBUTING.md
