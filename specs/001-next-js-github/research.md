# Research: GitHub Markdown CMS Integration

## Decision: GitHub API Integration Strategy

**Chosen**: GitHub REST API v4 with Octokit.js client and polling-based sync

**Rationale**:

- REST API provides direct file access with content hashing for change detection
- Octokit.js is the official GitHub client with TypeScript support and rate
  limit handling
- Polling approach is simpler than webhooks and suitable for personal portfolio
  scale
- No server infrastructure required for webhook endpoints

**Alternatives considered**:

- GraphQL API: More complex, limited file content access
- GitHub webhooks: Requires server endpoints, overkill for personal portfolio
- Git clone approach: Resource intensive, complex change detection

## Decision: Markdown Processing Pipeline

**Chosen**: gray-matter + unified (remark/rehype) + next-mdx-remote

**Rationale**:

- gray-matter is industry standard for frontmatter parsing with excellent
  TypeScript support
- unified ecosystem (remark/rehype) provides extensible markdown processing with
  syntax highlighting
- next-mdx-remote enables secure MDX rendering without bundling remote content
- Full plugin ecosystem for advanced features (TOC, code highlighting, link
  processing)

**Alternatives considered**:

- marked.js: Less extensible, limited plugin ecosystem
- markdown-it: Good performance but less TypeScript-friendly
- Direct MDX compilation: Security concerns with remote content

## Decision: Caching Strategy

**Chosen**: Multi-layer caching (memory + file system + conditional requests)

**Rationale**:

- Memory cache for frequently accessed content provides <50ms response times
- File system cache survives server restarts and provides offline capability
- GitHub conditional requests (If-Modified-Since) minimize API usage
- Configurable TTL balances freshness with performance

**Alternatives considered**:

- Redis cache: Overkill for personal portfolio, adds infrastructure complexity
- Database storage: Unnecessary persistence layer for essentially static content
- CDN-only caching: Insufficient control over invalidation timing

## Decision: Content Preview System

**Chosen**: Time-limited preview tokens with server-side rendering

**Rationale**:

- Preview URLs with expiring tokens balance security with usability
- Server-side rendering ensures previews match published appearance exactly
- No additional authentication system required beyond token validation
- Suitable for single content creator workflow

**Alternatives considered**:

- Authentication-based previews: Overly complex for single-user scenario
- Client-side preview: Inconsistent rendering compared to published content
- Static preview generation: Complex coordination with GitHub repository state

## Decision: Error Handling and Resilience

**Chosen**: Graceful degradation with cached content and user notifications

**Rationale**:

- 99.5% uptime achievable by serving cached content during GitHub API outages
- User experience remains functional with clear freshness indicators
- Progressive enhancement approach maintains core functionality under all
  conditions
- Automated retry with exponential backoff handles transient failures

**Alternatives considered**:

- Fail-fast approach: Unacceptable user experience during outages
- Background sync only: Users wouldn't understand content freshness
- Multiple content sources: Unnecessary complexity for single repository model

## Decision: Performance Optimization Strategy

**Chosen**: Next.js App Router with ISR, image optimization, and bundle
splitting

**Rationale**:

- App Router provides optimal SEO and performance for content-heavy applications
- ISR (Incremental Static Regeneration) balances static performance with dynamic
  content
- Next.js Image component handles responsive images with WebP conversion
- Automatic code splitting keeps initial bundle size minimal

**Alternatives considered**:

- Pure SSG: Incompatible with dynamic content requirements
- Client-side rendering: Poor SEO and performance for content consumption
- SSR only: Unnecessary server load for mostly static content

## Technology Stack Summary

### Core Dependencies (Justified Constitutional Additions)

- `@octokit/rest`: Official GitHub API client
- `gray-matter`: Frontmatter parsing
- `remark`: Markdown parsing
- `rehype`: HTML processing
- `remark-gfm`: GitHub Flavored Markdown support
- `rehype-highlight`: Syntax highlighting
- `next-mdx-remote`: Secure MDX rendering

### Development Dependencies

- `@types/node`: TypeScript definitions
- `vitest`: Testing framework (constitutional requirement)
- `@testing-library/react`: Component testing (constitutional requirement)

All dependencies align with constitutional principles: essential for core
functionality, well-maintained, TypeScript-compatible, and
performance-optimized.
