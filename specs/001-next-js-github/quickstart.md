# Quickstart: GitHub Markdown CMS Integration

This guide walks through setting up and validating the GitHub Markdown CMS
Integration feature from initial configuration to content publication.

## Prerequisites

- Next.js 15 portfolio project with App Router
- GitHub repository for content storage
- GitHub Personal Access Token with repository read access
- Node.js 18+ and npm/yarn

## Phase 1: Environment Setup

### 1.1 Configure Environment Variables

Create `.env.local` file:

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-content-repository
GITHUB_BRANCH=main

# Content Configuration
CONTENT_CACHE_TTL=1800  # 30 minutes in seconds
SYNC_INTERVAL=300       # 5 minutes in seconds
PREVIEW_TOKEN_TTL=86400 # 24 hours in seconds

# Notification Configuration (optional)
NOTIFICATION_EMAIL=your-email@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

### 1.2 Content Repository Structure

Set up your content repository with this structure:

```
content-repository/
├── content/
│   ├── blogs/
│   │   ├── my-first-post.md
│   │   └── another-post.mdx
│   ├── projects/
│   │   ├── portfolio-website.md
│   │   └── github-cms.md
│   └── assets/
│       └── images/
│           ├── hero-image.jpg
│           └── project-screenshot.png
└── README.md
```

### 1.3 Sample Content Files

**Blog Post Example** (`content/blogs/my-first-post.md`):

```markdown
---
title: "My First Blog Post"
published: true
date: "2025-09-27"
tags: ["javascript", "nextjs", "tutorial"]
categories: ["development"]
description: "Learn how to create your first blog post with our GitHub CMS"
author: "Your Name"
---

# Welcome to My Blog

This is my first blog post using the GitHub Markdown CMS integration.

## Features

- Automatic content synchronization
- Markdown support with syntax highlighting
- SEO optimization
- Tag-based filtering

The system automatically processes this content and makes it available on the
website.
```

**Project Example** (`content/projects/portfolio-website.md`):

```markdown
---
title: "Personal Portfolio Website"
published: true
date: "2025-09-27"
technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"]
completionStatus: "completed"
displayPriority: 1
description:
  "A modern portfolio website showcasing my development projects and blog posts"
projectLinks:
  demo: "https://yourportfolio.com"
  repository: "https://github.com/yourusername/portfolio"
---

# Portfolio Website

A comprehensive portfolio website built with modern web technologies.

## Key Features

- Server-side rendering with Next.js 15
- TypeScript for type safety
- Responsive design with Tailwind CSS
- GitHub CMS integration for content management

## Technical Implementation

The website uses Next.js App Router for optimal performance and SEO...
```

## Phase 2: Basic Integration Validation

### 2.1 Test GitHub API Connection

Run this test to verify GitHub access:

```typescript
// test-github-connection.ts
import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

async function testConnection() {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: "content",
    })

    console.log("✅ GitHub connection successful")
    console.log(
      `Found ${Array.isArray(data) ? data.length : 1} items in content directory`
    )

    const rateLimit = await octokit.rest.rateLimit.get()
    console.log(
      `API Rate Limit: ${rateLimit.data.rate.remaining}/${rateLimit.data.rate.limit}`
    )
  } catch (error) {
    console.error("❌ GitHub connection failed:", error)
  }
}

testConnection()
```

Expected output:

```
✅ GitHub connection successful
Found 3 items in content directory
API Rate Limit: 4999/5000
```

### 2.2 Test Content Parsing

Validate markdown processing:

```typescript
// test-content-parsing.ts
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

const testMarkdown = `---
title: "Test Post"
published: true
date: "2025-09-27"
tags: ["test"]
---

# Test Content

This is a **test** post with *emphasis* and [a link](https://example.com).

\`\`\`javascript
console.log('Hello, world!');
\`\`\`
`

async function testParsing() {
  try {
    // Parse frontmatter
    const { data: frontmatter, content } = matter(testMarkdown)
    console.log("✅ Frontmatter parsed:", frontmatter)

    // Process markdown to HTML
    const result = await remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(content)

    console.log("✅ Markdown processed to HTML")
    console.log("Content length:", result.toString().length)
  } catch (error) {
    console.error("❌ Content parsing failed:", error)
  }
}

testParsing()
```

Expected output:

```
✅ Frontmatter parsed: { title: 'Test Post', published: true, date: '2025-09-27', tags: ['test'] }
✅ Markdown processed to HTML
Content length: 234
```

## Phase 3: API Endpoint Testing

### 3.1 Test Content API

Test the main content endpoints:

```bash
# Test blog list endpoint
curl "http://localhost:3000/api/content/blog?limit=5" | jq '.'

# Expected response structure:
{
  "posts": [
    {
      "slug": "my-first-post",
      "title": "My First Blog Post",
      "excerpt": "Learn how to create your first blog post...",
      "publishDate": "2025-09-27T00:00:00.000Z",
      "tags": ["javascript", "nextjs", "tutorial"],
      "readingTime": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "metadata": {
    "cacheStatus": "fresh",
    "lastSync": "2025-09-27T15:30:00.000Z",
    "freshness": 2
  }
}

# Test individual blog post
curl "http://localhost:3000/api/content/blog/my-first-post" | jq '.post.title'
# Expected: "My First Blog Post"

# Test projects endpoint
curl "http://localhost:3000/api/content/projects" | jq '.projects[].title'
# Expected: "Personal Portfolio Website"
```

### 3.2 Test Search Functionality

```bash
# Test search across content
curl "http://localhost:3000/api/content/search?q=javascript" | jq '.results[].title'
# Expected: Results containing "javascript" in content or tags

# Test filtered search
curl "http://localhost:3000/api/content/search?q=portfolio&type=project" | jq '.query.totalResults'
# Expected: Number of matching projects
```

### 3.3 Test System Status

```bash
# Check system health
curl "http://localhost:3000/api/content/status" | jq '.status'
# Expected: "healthy"

curl "http://localhost:3000/api/content/status" | jq '.services.github.status'
# Expected: "available"
```

## Phase 4: Content Management Workflow

### 4.1 Test Content Publication

1. **Create Unpublished Content**:

   ```markdown
   ---
   title: "Draft Post"
   published: false
   date: "2025-09-27"
   tags: ["draft"]
   ---

   This is a draft post that shouldn't appear publicly.
   ```

2. **Verify Draft Exclusion**:

   ```bash
   curl "http://localhost:3000/api/content/blog" | jq '.posts[] | select(.slug == "draft-post")'
   # Expected: No results (draft posts excluded)
   ```

3. **Generate Preview**:

   ```bash
   # This would be done internally by the system
   # Manual test: access /preview/draft-post?token=generated-token
   ```

4. **Publish Content**:
   - Update `published: true` in GitHub
   - Wait 5 minutes for sync or trigger manual sync
   - Verify content appears in public API

### 4.2 Test Error Handling

1. **Invalid Frontmatter**: Create a file with malformed YAML frontmatter and
   verify:
   - File is skipped during sync
   - Error is logged
   - Email notification sent (if configured)
   - Website continues functioning with valid content

2. **Network Failure Simulation**:
   - Block GitHub API access temporarily
   - Verify cached content is served
   - Check that freshness indicators show cached status
   - Confirm search works on cached content only

## Phase 5: Performance Validation

### 5.1 Page Speed Testing

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test blog listing page
lighthouse http://localhost:3000/blog --only-categories=performance --chrome-flags="--headless"

# Expected: Performance score 90+ for cached content

# Test individual blog post
lighthouse http://localhost:3000/blog/my-first-post --only-categories=performance --chrome-flags="--headless"

# Expected: Performance score 90+ with proper image optimization
```

### 5.2 Load Testing

```bash
# Install Artillery for load testing
npm install -g artillery

# Create artillery config: loadtest.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Content API Load Test"
    requests:
      - get:
          url: "/api/content/blog"
      - get:
          url: "/api/content/projects"
      - get:
          url: "/api/content/search?q=javascript"

# Run load test
artillery run loadtest.yml

# Expected:
# - Response times < 200ms for cached content
# - No errors under normal load
# - Cache hit rate > 80%
```

## Phase 6: Accessibility Validation

### 6.1 Automated Testing

```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Test blog pages for accessibility
axe http://localhost:3000/blog
axe http://localhost:3000/blog/my-first-post

# Expected: No accessibility violations
# All content should meet WCAG 2.1 AAA standards
```

### 6.2 Manual Testing

1. **Keyboard Navigation**: Verify all interactive elements are accessible via
   keyboard
2. **Screen Reader**: Test with screen reader software (NVDA, JAWS, or
   VoiceOver)
3. **Color Contrast**: Verify 7:1 minimum contrast ratio
4. **Focus Management**: Check visible focus indicators

## Success Criteria Checklist

### ✅ Basic Functionality

- [ ] GitHub API connection established
- [ ] Content repository structure validated
- [ ] Markdown parsing working correctly
- [ ] API endpoints responding properly
- [ ] Search functionality operational
- [ ] Content sync process running

### ✅ Content Management

- [ ] Published content appears automatically
- [ ] Draft content remains hidden from public
- [ ] Preview URLs work for unpublished content
- [ ] Error handling for malformed content
- [ ] Email notifications for validation failures

### ✅ Performance Requirements

- [ ] Lighthouse scores meet targets (90+/85+)
- [ ] Core Web Vitals within limits
- [ ] Cache hit ratio > 80%
- [ ] Page load times under 4s (3G, cached)
- [ ] Search response times < 200ms

### ✅ Accessibility Compliance

- [ ] WCAG 2.1 AAA compliance verified
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] Color contrast 7:1 minimum
- [ ] Semantic HTML structure

### ✅ Reliability & Error Handling

- [ ] Graceful degradation during GitHub API outages
- [ ] Cached content served with proper indicators
- [ ] Error logging functional
- [ ] Content validation working
- [ ] Preview token system operational

## Troubleshooting Common Issues

### GitHub API Issues

```bash
# Check API rate limits
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit

# Verify repository access
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO
```

### Cache Issues

```bash
# Clear application cache
rm -rf public/content-cache/*

# Restart application to clear memory cache
npm run dev
```

### Content Processing Issues

```bash
# Validate individual markdown file
node -e "
const matter = require('gray-matter');
const fs = require('fs');
const content = fs.readFileSync('path/to/content.md', 'utf8');
try {
  const parsed = matter(content);
  console.log('✅ Valid:', parsed.data);
} catch (e) {
  console.error('❌ Invalid:', e.message);
}
"
```

This quickstart provides comprehensive validation of all core functionality and
ensures the GitHub Markdown CMS Integration meets all requirements before
production deployment.
