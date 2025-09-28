import type { PreviewToken } from "./token-generator"
import { PreviewTokenGenerator } from "./token-generator"

export interface ValidationResult {
  isValid: boolean
  token?: PreviewToken
  error?: string
  expired?: boolean
}

export interface ValidationOptions {
  allowExpired?: boolean
  requireContentType?: "blog" | "project"
  requireSlug?: string
}

export class PreviewTokenValidator {
  private tokenGenerator: PreviewTokenGenerator
  private readonly tokens = new Map<string, PreviewToken>()

  constructor() {
    this.tokenGenerator = new PreviewTokenGenerator()
  }

  async validateToken(token: string, options?: ValidationOptions): Promise<ValidationResult> {
    if (!token || typeof token !== "string") {
      return {
        isValid: false,
        error: "Invalid token format",
      }
    }

    // Clean the token (remove any whitespace, URL encoding, etc.)
    const cleanToken = token.trim().replace(/[^a-zA-Z0-9]/g, "")

    if (cleanToken.length === 0) {
      return {
        isValid: false,
        error: "Empty token",
      }
    }

    // Find the token in storage
    const previewToken = await this.findToken(cleanToken)

    if (!previewToken) {
      return {
        isValid: false,
        error: "Token not found",
      }
    }

    // Check if token is expired
    const now = new Date()
    const isExpired = previewToken.expiresAt <= now

    if (isExpired && !options?.allowExpired) {
      return {
        isValid: false,
        token: previewToken,
        error: "Token has expired",
        expired: true,
      }
    }

    // Check content type requirement
    if (options?.requireContentType && previewToken.contentType !== options.requireContentType) {
      return {
        isValid: false,
        token: previewToken,
        error: `Token is not valid for content type '${options.requireContentType}'`,
      }
    }

    // Check slug requirement
    if (options?.requireSlug && previewToken.slug !== options.requireSlug) {
      return {
        isValid: false,
        token: previewToken,
        error: `Token is not valid for content '${options.requireSlug}'`,
      }
    }

    return {
      isValid: true,
      token: previewToken,
    }
  }

  async validateAndGetContent(
    token: string,
    slug?: string,
    contentType?: "blog" | "project"
  ): Promise<{
    isValid: boolean
    contentInfo?: {
      slug: string
      contentType: "blog" | "project"
      metadata?: Record<string, unknown>
    }
    error?: string
  }> {
    const validation = await this.validateToken(token, {
      requireSlug: slug,
      requireContentType: contentType,
    })

    if (!validation.isValid || !validation.token) {
      return {
        isValid: false,
        error: validation.error,
      }
    }

    return {
      isValid: true,
      contentInfo: {
        slug: validation.token.slug,
        contentType: validation.token.contentType,
        metadata: validation.token.metadata,
      },
    }
  }

  private async findToken(token: string): Promise<PreviewToken | null> {
    // In a real implementation, this would query a database
    // For now, we'll use the in-memory storage from the generator

    // First check our local cache
    if (this.tokens.has(token)) {
      return this.tokens.get(token) || null
    }

    // Check the token generator's storage (in a real app, this would be a DB query)
    try {
      // This is a simplified lookup - in production, you'd have a proper storage mechanism
      const allStats = this.tokenGenerator.getTokenStats()

      // Since we don't have direct access to the tokens map in the generator,
      // we'll need to implement a proper token storage system in production
      // For now, return null to indicate token not found
      return null
    } catch {
      return null
    }
  }

  async isTokenActive(token: string): Promise<boolean> {
    const validation = await this.validateToken(token, { allowExpired: false })
    return validation.isValid
  }

  async getTokenInfo(token: string): Promise<PreviewToken | null> {
    const validation = await this.validateToken(token, { allowExpired: true })
    return validation.token || null
  }

  async extendToken(
    token: string,
    additionalMinutes: number = 60
  ): Promise<{ success: boolean; newToken?: PreviewToken; error?: string }> {
    const validation = await this.validateToken(token, { allowExpired: false })

    if (!validation.isValid || !validation.token) {
      return {
        success: false,
        error: validation.error || "Invalid token",
      }
    }

    try {
      // Create a new token with extended expiration
      const currentExpiration = validation.token.expiresAt.getTime()
      const newExpiration = new Date(currentExpiration + additionalMinutes * 60 * 1000)
      const currentTime = Date.now()
      const totalMinutes = Math.ceil((newExpiration.getTime() - currentTime) / (60 * 1000))

      const newToken = this.tokenGenerator.generateToken(validation.token.slug, validation.token.contentType, {
        expirationMinutes: totalMinutes,
        customMetadata: validation.token.metadata,
      })

      // Revoke the old token
      this.tokenGenerator.revokeToken(token)

      return {
        success: true,
        newToken,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to extend token",
      }
    }
  }

  // Batch validation for multiple tokens
  async validateTokens(
    tokens: string[],
    options?: ValidationOptions
  ): Promise<Array<{ token: string; result: ValidationResult }>> {
    const results = await Promise.all(
      tokens.map(async token => ({
        token,
        result: await this.validateToken(token, options),
      }))
    )

    return results
  }

  // Get validation statistics
  getValidationStats(): {
    totalValidations: number
    successfulValidations: number
    failedValidations: number
    expiredTokenAttempts: number
  } {
    // In a production app, you'd track these metrics
    // For now, return placeholder stats
    return {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      expiredTokenAttempts: 0,
    }
  }

  // Security check - rate limiting for token validation
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>()
  private readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
  private readonly MAX_ATTEMPTS = 50 // max attempts per window

  private checkRateLimit(clientId: string): boolean {
    const now = Date.now()
    const entry = this.rateLimitMap.get(clientId)

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      this.rateLimitMap.set(clientId, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW,
      })
      return true
    }

    if (entry.count >= this.MAX_ATTEMPTS) {
      return false // Rate limit exceeded
    }

    entry.count++
    return true
  }

  async validateTokenWithRateLimit(
    token: string,
    clientId: string,
    options?: ValidationOptions
  ): Promise<ValidationResult> {
    if (!this.checkRateLimit(clientId)) {
      return {
        isValid: false,
        error: "Rate limit exceeded. Please try again later.",
      }
    }

    return this.validateToken(token, options)
  }
}

export default PreviewTokenValidator
