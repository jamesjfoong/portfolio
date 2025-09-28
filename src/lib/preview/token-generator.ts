import { createHash, randomBytes } from "crypto"

export interface PreviewToken {
  token: string
  slug: string
  contentType: "blog" | "project"
  expiresAt: Date
  createdAt: Date
  metadata?: Record<string, unknown>
}

export interface TokenGenerationOptions {
  expirationMinutes: number
  includeSlugInToken: boolean
  customMetadata?: Record<string, unknown>
}

export class PreviewTokenGenerator {
  private readonly DEFAULT_EXPIRATION = 60 * 24 // 24 hours in minutes
  private readonly TOKEN_LENGTH = 32
  private readonly tokens = new Map<string, PreviewToken>()

  generateToken(
    slug: string,
    contentType: "blog" | "project",
    options?: Partial<TokenGenerationOptions>
  ): PreviewToken {
    const opts = {
      expirationMinutes: this.DEFAULT_EXPIRATION,
      includeSlugInToken: false,
      ...options,
    }

    // Generate a cryptographically secure random token
    const tokenData = opts.includeSlugInToken
      ? `${slug}-${randomBytes(this.TOKEN_LENGTH).toString("hex")}`
      : randomBytes(this.TOKEN_LENGTH).toString("hex")

    // Create a hash of the token for additional security
    const token = createHash("sha256")
      .update(tokenData)
      .update(slug)
      .update(contentType)
      .digest("hex")
      .substring(0, this.TOKEN_LENGTH)

    const now = new Date()
    const expiresAt = new Date(now.getTime() + opts.expirationMinutes * 60 * 1000)

    const previewToken: PreviewToken = {
      token,
      slug,
      contentType,
      expiresAt,
      createdAt: now,
      metadata: opts.customMetadata,
    }

    // Store token in memory (in production, this should be stored in a database)
    this.tokens.set(token, previewToken)

    // Clean up expired tokens
    this.cleanupExpiredTokens()

    return previewToken
  }

  generateShareableUrl(token: string, baseUrl?: string): string {
    const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    return `${base}/preview/${token}`
  }

  generateContentUrl(slug: string, contentType: "blog" | "project", token: string, baseUrl?: string): string {
    const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    return `${base}/${contentType}/${slug}?preview=true&token=${token}`
  }

  refreshToken(existingToken: string, expirationMinutes?: number): PreviewToken | null {
    const token = this.tokens.get(existingToken)

    if (!token) {
      return null
    }

    // Create new token with extended expiration
    const newExpirationMinutes = expirationMinutes || this.DEFAULT_EXPIRATION
    const newToken = this.generateToken(token.slug, token.contentType, {
      expirationMinutes: newExpirationMinutes,
      customMetadata: token.metadata,
    })

    // Remove old token
    this.tokens.delete(existingToken)

    return newToken
  }

  revokeToken(token: string): boolean {
    return this.tokens.delete(token)
  }

  revokeTokensForContent(slug: string, contentType?: "blog" | "project"): number {
    let revokedCount = 0

    for (const [tokenKey, tokenData] of this.tokens.entries()) {
      if (tokenData.slug === slug && (!contentType || tokenData.contentType === contentType)) {
        this.tokens.delete(tokenKey)
        revokedCount++
      }
    }

    return revokedCount
  }

  getAllTokensForContent(slug: string, contentType?: "blog" | "project"): PreviewToken[] {
    const tokens: PreviewToken[] = []

    for (const tokenData of this.tokens.values()) {
      if (tokenData.slug === slug && (!contentType || tokenData.contentType === contentType)) {
        tokens.push(tokenData)
      }
    }

    return tokens.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getActiveTokenCount(): number {
    this.cleanupExpiredTokens()
    return this.tokens.size
  }

  getTokenStats(): {
    total: number
    byType: Record<"blog" | "project", number>
    expiringSoon: number // expires within 1 hour
  } {
    this.cleanupExpiredTokens()

    const stats = {
      total: this.tokens.size,
      byType: { blog: 0, project: 0 },
      expiringSoon: 0,
    }

    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)

    for (const token of this.tokens.values()) {
      stats.byType[token.contentType]++

      if (token.expiresAt <= oneHourFromNow) {
        stats.expiringSoon++
      }
    }

    return stats
  }

  private cleanupExpiredTokens(): number {
    const now = new Date()
    let cleanedCount = 0

    for (const [tokenKey, tokenData] of this.tokens.entries()) {
      if (tokenData.expiresAt <= now) {
        this.tokens.delete(tokenKey)
        cleanedCount++
      }
    }

    return cleanedCount
  }

  // For testing purposes
  clearAllTokens(): void {
    this.tokens.clear()
  }

  // Generate batch tokens for multiple content items
  generateBatchTokens(
    items: Array<{ slug: string; contentType: "blog" | "project" }>,
    options?: Partial<TokenGenerationOptions>
  ): PreviewToken[] {
    return items.map(item => this.generateToken(item.slug, item.contentType, options))
  }
}

export default PreviewTokenGenerator
