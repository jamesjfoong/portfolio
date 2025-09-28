// Content validation types

export interface ValidationError {
  code: string
  message: string
  field?: string
  value?: unknown
  severity: "error" | "warning" | "info"
  rule: string
  suggestion?: string
}

export interface ValidationResult {
  isValid: boolean
  score: number // 0-100 quality score
  errors: ValidationError[]
  warnings: ValidationError[]
  info: ValidationError[]

  // Detailed metrics
  metrics: {
    readability: {
      score: number
      wordCount: number
      averageWordsPerSentence: number
      readingLevel: string
    }
    seo: {
      score: number
      titleLength: number
      descriptionLength: number
      keywordDensity: number
      hasMetaDescription: boolean
      hasOpenGraph: boolean
    }
    structure: {
      score: number
      headingHierarchy: boolean
      headingCount: number
      listCount: number
      linkCount: number
      imageCount: number
    }
    accessibility: {
      score: number
      hasAltText: boolean
      hasDescriptiveLinks: boolean
      colorContrast: boolean
      headingStructure: boolean
    }
  }

  validatedAt: Date
  validationDuration: number // milliseconds
}

export interface ValidationRule {
  id: string
  name: string
  description: string
  category: "content" | "seo" | "structure" | "accessibility" | "technical"
  severity: "error" | "warning" | "info"
  enabled: boolean

  // Rule configuration
  config: Record<string, unknown>

  // Rule function
  validate: (content: ValidatableContent, config: Record<string, unknown>) => ValidationError[]
}

export interface ValidatableContent {
  type: "blog" | "project"
  slug: string
  filePath: string

  // Raw content
  rawContent: string
  frontmatter: Record<string, unknown>

  // Processed content
  title: string
  content: string // HTML or markdown
  excerpt?: string
  description?: string

  // Metadata
  publishDate?: Date
  lastModified: Date
  tags?: string[]
  categories?: string[]
  technologies?: string[]
  author?: string

  // Structure
  headings: Array<{
    level: number
    text: string
    id: string
  }>

  wordCount: number
  readingTime: number
}

export interface ValidationConfig {
  enabledRules: string[]
  disabledRules: string[]

  // Rule-specific configurations
  ruleConfigs: Record<string, Record<string, unknown>>

  // Validation behavior
  failOnError: boolean
  failOnWarning: boolean
  skipOnParseError: boolean

  // Performance
  timeoutPerValidation: number // milliseconds
  maxValidationsPerBatch: number

  // Output
  includeMetrics: boolean
  includeSuggestions: boolean
  detailedErrors: boolean
}

export interface ValidationBatch {
  id: string
  items: ValidatableContent[]
  startedAt: Date
  completedAt?: Date
  status: "pending" | "processing" | "completed" | "failed"

  results: Array<{
    slug: string
    result: ValidationResult
  }>

  summary: {
    total: number
    valid: number
    invalid: number
    warnings: number
    averageScore: number
    totalDuration: number
  }
}

export interface ValidationReport {
  batchId: string
  generatedAt: Date
  summary: ValidationBatch["summary"]

  // Aggregated insights
  insights: {
    mostCommonErrors: Array<{ code: string; count: number }>
    mostCommonWarnings: Array<{ code: string; count: number }>
    averageScoreByType: Record<string, number>
    topPerformers: string[] // slugs with highest scores
    needsAttention: string[] // slugs with lowest scores
  }

  // Detailed results
  results: ValidationBatch["results"]

  // Recommendations
  recommendations: Array<{
    type: "global" | "specific"
    priority: "high" | "medium" | "low"
    title: string
    description: string
    affectedItems?: string[]
    actionItems: string[]
  }>
}
