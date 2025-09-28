export interface ContentMetadata {
  title?: string
  description?: string
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
  category?: string
  featured?: boolean
  readingTime?: number
  author?: string
  slug?: string
}

export interface ContentData {
  content: string
  metadata: ContentMetadata
  slug: string
}

export interface ContentError {
  code: "NOT_FOUND" | "PARSE_ERROR" | "READ_ERROR"
  message: string
  slug?: string
  type?: "projects" | "blog"
}

export type ContentResult<T = ContentData> = { success: true; data: T } | { success: false; error: ContentError }

// GitHub CMS Integration Types
export interface BlogPost {
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

export interface Project {
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

export interface GitHubContentMetadata {
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
    [key: string]: unknown // Additional frontmatter fields
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

export interface AssetFile {
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
