# GitHub Markdown CMS - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the GitHub Markdown
CMS to production environments with optimal performance, security, and
accessibility compliance.

## Prerequisites

### System Requirements

- Node.js 18+ or 20+
- npm, yarn, or pnpm package manager
- Git version control
- GitHub repository access
- Vercel account (recommended) or alternative hosting platform

### Required Environment Variables

```bash
# GitHub Integration (Required)
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name

# Application Environment (Required)
NODE_ENV=production
VERCEL_URL=https://your-domain.com

# Analytics & Monitoring (Optional)
ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn
VERCEL_ANALYTICS_ID=your_vercel_analytics_id

# Performance Monitoring (Optional)
NEXT_PUBLIC_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_DEBUG_MODE=false
```

## GitHub Repository Setup

### 1. Repository Configuration

Create a GitHub repository with the following structure:

```
your-content-repo/
├── content/
│   ├── blog/
│   │   ├── _meta.json
│   │   └── *.mdx
│   ├── projects/
│   │   ├── _meta.json
│   │   └── *.mdx
│   └── lab/
│       ├── _meta.json
│       └── *.mdx
├── public/
│   └── images/
└── README.md
```

### 2. GitHub Personal Access Token

Create a Personal Access Token with the following permissions:

- `Contents`: Read access to repository contents
- `Metadata`: Read access to repository metadata
- `Pull Requests`: Read access (if using PR-based content management)

**Security Best Practices:**

- Set minimal required permissions
- Use token expiration dates
- Store securely in environment variables
- Monitor token usage in GitHub settings

### 3. Content Structure

#### Blog Posts (`content/blog/`)

```markdown
---
title: "Your Blog Post Title"
excerpt: "Brief description for SEO and previews"
publishedAt: "2024-01-01"
updatedAt: "2024-01-01"
tags: ["react", "typescript", "performance"]
author: "Your Name"
featured: true
draft: false
---

# Your Blog Post Content

Blog post content in Markdown format...
```

#### Projects (`content/projects/`)

```markdown
---
title: "Project Name"
description: "Project description"
image: "/projects/project-screenshot.jpg"
technologies: ["Next.js", "TypeScript", "Tailwind CSS"]
githubUrl: "https://github.com/username/project"
liveUrl: "https://project-demo.com"
featured: true
status: "completed"
startDate: "2024-01-01"
endDate: "2024-03-01"
---

# Project Overview

Detailed project description...
```

#### Meta Files (`_meta.json`)

```json
{
  "title": "Blog",
  "description": "Technical blog posts and tutorials",
  "order": ["latest-post", "featured-post", "older-post"],
  "featured": ["latest-post", "featured-post"],
  "pagination": {
    "enabled": true,
    "itemsPerPage": 10
  }
}
```

## Platform-Specific Deployment

### Vercel Deployment (Recommended)

#### 1. Initial Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel
```

#### 2. Vercel Configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate=300"
        }
      ]
    },
    {
      "source": "/(.*\\.(js|css|png|jpg|jpeg|gif|webp|svg|ico))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    },
    {
      "source": "/robots.txt",
      "destination": "/api/robots"
    }
  ]
}
```

#### 3. Environment Variables Setup

In Vercel Dashboard:

1. Go to Project Settings > Environment Variables
2. Add all required environment variables
3. Set appropriate scopes (Production, Preview, Development)

#### 4. Performance Optimization

```json
{
  "images": {
    "domains": ["raw.githubusercontent.com", "github.com"],
    "formats": ["image/webp", "image/avif"],
    "minimumCacheTTL": 31536000
  },
  "experimental": {
    "optimizePackageImports": ["@heroicons/react", "framer-motion"],
    "optimizeCss": true,
    "gzipSize": true
  }
}
```

### Netlify Deployment

#### 1. Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"

[[redirects]]
  from = "/sitemap.xml"
  to = "/api/sitemap"
  status = 200

[[redirects]]
  from = "/robots.txt"
  to = "/api/robots"
  status = 200
```

#### 2. Build Settings

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js version: 18.x or 20.x

### Self-Hosted Deployment

#### 1. Docker Configuration (`Dockerfile`)

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Docker Compose (`docker-compose.yml`)

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_OWNER=${GITHUB_OWNER}
      - GITHUB_REPO=${GITHUB_REPO}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped
```

#### 3. Nginx Configuration (`nginx.conf`)

```nginx
events {
  worker_connections 1024;
}

http {
  upstream app {
    server app:3000;
  }

  server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
  }

  server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
      proxy_pass http://app;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_cache_bypass $http_upgrade;
    }

    location /_next/static/ {
      proxy_pass http://app;
      proxy_cache_valid 200 1y;
      add_header Cache-Control "public, immutable";
    }
  }
}
```

## Pre-Deployment Checklist

### 1. Code Quality Verification

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run all tests
npm test

# Check bundle size
npm run analyze

# Verify accessibility
npm run test:a11y
```

### 2. Performance Validation

```bash
# Build and analyze
npm run build
npm run analyze

# Test Core Web Vitals
npm run test:performance

# Lighthouse audit
npm run lighthouse
```

### 3. Security Audit

```bash
# Check for vulnerabilities
npm audit

# Validate environment variables
npm run validate-env

# Test HTTPS configuration
npm run test:security
```

### 4. Content Validation

- Verify all markdown files parse correctly
- Check image paths and accessibility
- Validate metadata completeness
- Test search functionality

## Post-Deployment Monitoring

### 1. Performance Monitoring

Set up monitoring for:

- Core Web Vitals (LCP, FID, CLS)
- Bundle size tracking
- API response times
- Error rates

#### Vercel Analytics Integration

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Error Tracking

```typescript
// lib/monitoring.ts
import * as Sentry from "@sentry/nextjs"

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
  })
}
```

### 3. Uptime Monitoring

Set up uptime monitoring for:

- Main application endpoints
- API routes
- Critical user flows
- Core Web Vitals tracking

## Maintenance Procedures

### 1. Regular Updates

```bash
# Update dependencies monthly
npm update

# Security patches (run immediately when available)
npm audit fix

# Rebuild and redeploy
npm run build
vercel --prod
```

### 2. Content Updates

- Content changes auto-deploy via GitHub integration
- Monitor build logs for failures
- Validate new content before publishing
- Test search index updates

### 3. Performance Optimization

- Monthly bundle size analysis
- Core Web Vitals monitoring
- Image optimization review
- Cache performance evaluation

### 4. Security Maintenance

- Rotate GitHub tokens quarterly
- Update SSL certificates
- Security dependency updates
- Access log review

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear caches
rm -rf .next node_modules
npm install
npm run build
```

#### GitHub API Rate Limiting

- Check token permissions
- Implement proper caching
- Consider GitHub App authentication
- Monitor API usage

#### Performance Issues

```bash
# Analyze bundle
npm run analyze

# Check Core Web Vitals
npm run test:performance

# Profile build
npm run build -- --profile
```

#### Content Loading Issues

- Verify GitHub repository access
- Check content file formats
- Validate frontmatter syntax
- Test API endpoints

### Debug Mode

```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG_MODE=true npm run dev

# Check build output
npm run build -- --debug

# Analyze webpack bundle
npm run analyze -- --verbose
```

## Rollback Procedures

### Vercel Rollback

```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push --force-with-lease origin main
```

## Support and Resources

### Documentation

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Platform Documentation](https://vercel.com/docs)
- [GitHub API Documentation](https://docs.github.com/en/rest)

### Community Support

- GitHub Issues for bug reports
- GitHub Discussions for questions
- Stack Overflow for technical questions

### Professional Support

- Next.js Enterprise Support
- Vercel Pro Support
- Custom consulting services available
