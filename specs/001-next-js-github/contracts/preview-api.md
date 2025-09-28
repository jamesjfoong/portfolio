# Preview API Contracts

## GET /preview/[slug]

Access unpublished content via preview token.

### Request

```typescript
interface PreviewRequest {
  slug: string // Path parameter - content slug
  token: string // Query parameter - preview token
}
```

### Response

```typescript
interface PreviewResponse {
  content: {
    type: "blog" | "project"
    slug: string
    title: string
    content: string // Processed HTML
    publishDate?: string // ISO 8601 (if set)
    lastModified: string // ISO 8601
    tags?: string[]
    categories?: string[] // Blog only
    technologies?: string[] // Projects only
    author?: string
    description?: string
    // ... other fields based on content type
  }
  preview: {
    token: string
    expiresAt: string // ISO 8601
    accessCount: number
    isStale: boolean // Content changed since token creation
  }
  notice: {
    type: "preview"
    message: string // "This is a preview of unpublished content"
    expiresIn: number // Minutes until token expires
  }
}
```

### Status Codes

- `200 OK`: Preview content served successfully
- `400 Bad Request`: Invalid or missing token
- `401 Unauthorized`: Token expired or invalid
- `404 Not Found`: Content not found
- `500 Internal Server Error`: System error

---

## POST /api/preview/generate

Generate preview token for unpublished content (internal API).

### Request

```typescript
interface PreviewTokenRequest {
  slug: string // Content slug
  contentType: "blog" | "project"
  contentHash: string // Current content hash
}
```

### Response

```typescript
interface PreviewTokenResponse {
  token: string // UUID-based token
  previewUrl: string // Full preview URL
  expiresAt: string // ISO 8601
  expiresIn: number // Seconds until expiration
}
```

### Status Codes

- `201 Created`: Token generated successfully
- `400 Bad Request`: Invalid content reference
- `404 Not Found`: Content not found
- `500 Internal Server Error`: System error

---

## DELETE /api/preview/[token]

Revoke preview token (cleanup/security).

### Request

```typescript
interface RevokeTokenRequest {
  token: string // Path parameter
}
```

### Response

```typescript
interface RevokeTokenResponse {
  success: boolean
  message: string
}
```

### Status Codes

- `200 OK`: Token revoked successfully
- `404 Not Found`: Token not found or already expired
- `500 Internal Server Error`: System error
