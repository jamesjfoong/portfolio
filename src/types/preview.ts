// Preview system types

export interface PreviewSession {
  token: string
  type: "blog" | "project"
  slug: string
  filePath: string

  // Session metadata
  createdAt: Date
  expiresAt: Date
  lastAccessed: Date
  accessCount: number

  // Content snapshot
  contentHash: string
  content: {
    title: string
    rawContent: string
    processedContent: string
    frontmatter: Record<string, unknown>
  }

  // Preview-specific settings
  settings: {
    showDrafts: boolean
    showUnpublished: boolean
    enableComments: boolean
    showMetadata: boolean
  }

  // Security
  ipAddress?: string
  userAgent?: string
  isValid: boolean
}

export interface PreviewToken {
  token: string
  type: "blog" | "project"
  slug: string
  createdAt: Date
  expiresAt: Date
  maxAccess: number
  currentAccess: number
  isActive: boolean
}

export interface PreviewConfig {
  tokenLength: number
  expirationTime: number // minutes
  maxAccessCount: number
  cleanupInterval: number // minutes
  enableIpValidation: boolean
  enableUserAgentValidation: boolean
  allowedIpRanges?: string[]
  secretKey: string // for token generation
}

export interface PreviewRequest {
  type: "blog" | "project"
  slug: string
  filePath: string
  settings?: {
    showDrafts?: boolean
    showUnpublished?: boolean
    enableComments?: boolean
    showMetadata?: boolean
  }
  expiresIn?: number // minutes, overrides default
  maxAccess?: number // overrides default
}

export interface PreviewResponse {
  success: boolean
  token?: string
  previewUrl?: string
  expiresAt?: Date
  error?: string
  session?: PreviewSession
}

export interface PreviewStats {
  activeSessions: number
  totalSessions: number
  expiredSessions: number
  averageAccessCount: number

  breakdown: {
    blog: { active: number; total: number }
    project: { active: number; total: number }
  }

  recentActivity: Array<{
    token: string
    type: "created" | "accessed" | "expired"
    timestamp: Date
    slug: string
  }>
}

export interface PreviewAnalytics {
  token: string
  slug: string
  type: "blog" | "project"
  event: "created" | "accessed" | "expired" | "deleted"
  timestamp: Date
  metadata: {
    ipAddress?: string
    userAgent?: string
    referer?: string
    accessCount?: number
    timeOnPage?: number // seconds
  }
}
