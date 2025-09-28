// Content validation service
import type { BlogPost, GitHubContentMetadata, Project } from "@/types/content"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  score: number // 0-100 quality score
}

export interface ContentQualityMetrics {
  readabilityScore: number
  seoScore: number
  structureScore: number
  accessibilityScore: number
}

export class ContentValidator {
  /**
   * Validate blog post content
   */
  validateBlogPost(blogPost: BlogPost, metadata?: GitHubContentMetadata): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic required fields
    if (!blogPost.title?.trim()) {
      errors.push("Blog post title is required")
    }

    if (!blogPost.content?.trim()) {
      errors.push("Blog post content is required")
    }

    if (!blogPost.slug?.trim()) {
      errors.push("Blog post slug is required")
    }

    if (!blogPost.publishDate) {
      errors.push("Blog post publish date is required")
    }

    // Content quality checks
    if (blogPost.content && blogPost.content.length < 300) {
      warnings.push("Blog post content is quite short (less than 300 characters)")
    }

    if (blogPost.title && blogPost.title.length > 60) {
      warnings.push("Blog post title is longer than recommended (60+ characters)")
    }

    // SEO checks
    if (!blogPost.excerpt?.trim()) {
      warnings.push("Blog post excerpt is missing - important for SEO")
    }

    if (blogPost.excerpt && blogPost.excerpt.length > 160) {
      warnings.push("Blog post excerpt is longer than recommended (160+ characters)")
    }

    if (!blogPost.tags || blogPost.tags.length === 0) {
      warnings.push("Blog post has no tags - consider adding relevant tags")
    }

    if (blogPost.tags && blogPost.tags.length > 10) {
      warnings.push("Blog post has many tags (10+) - consider reducing for better SEO")
    }

    // Technical checks
    if (metadata?.wordCount && metadata.wordCount < 100) {
      warnings.push("Blog post word count is very low for good SEO")
    }

    if (metadata?.headings && metadata.headings.length === 0) {
      warnings.push("Blog post has no headings - consider adding structure")
    }

    // Calculate quality score
    const qualityMetrics = this.calculateBlogQualityMetrics(blogPost, metadata)
    const score = this.calculateOverallScore(qualityMetrics, errors, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    }
  }

  /**
   * Validate project content
   */
  validateProject(project: Project, metadata?: GitHubContentMetadata): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Basic required fields
    if (!project.title?.trim()) {
      errors.push("Project title is required")
    }

    if (!project.description?.trim()) {
      errors.push("Project description is required")
    }

    if (!project.slug?.trim()) {
      errors.push("Project slug is required")
    }

    // Project-specific fields
    if (!project.technologies || project.technologies.length === 0) {
      warnings.push("Project has no technologies listed")
    }

    if (!project.projectLinks?.repository && !project.projectLinks?.demo) {
      warnings.push("Project has no repository or live demo link")
    }

    // Content quality checks
    if (project.description && project.description.length < 100) {
      warnings.push("Project description is quite short (less than 100 characters)")
    }

    if (project.title && project.title.length > 50) {
      warnings.push("Project title is longer than recommended (50+ characters)")
    }

    // Technical validation
    if (project.projectLinks?.repository && !this.isValidUrl(project.projectLinks.repository)) {
      errors.push("Project repository URL is not valid")
    }

    if (project.projectLinks?.demo && !this.isValidUrl(project.projectLinks.demo)) {
      errors.push("Project live demo URL is not valid")
    }

    // Calculate quality score
    const qualityMetrics = this.calculateProjectQualityMetrics(project, metadata)
    const score = this.calculateOverallScore(qualityMetrics, errors, warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    }
  }

  /**
   * Validate content metadata
   */
  validateMetadata(metadata: GitHubContentMetadata): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!metadata.parsedSuccessfully) {
      errors.push("Content failed to parse successfully")
    }

    if (metadata.errors && metadata.errors.length > 0) {
      errors.push(...metadata.errors)
    }

    if (metadata.warnings && metadata.warnings.length > 0) {
      warnings.push(...metadata.warnings)
    }

    if (metadata.wordCount === 0) {
      warnings.push("Content appears to have no words")
    }

    if (metadata.headings && metadata.headings.length === 0) {
      warnings.push("Content has no headings - consider adding structure")
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: metadata.parsedSuccessfully ? 80 : 0,
    }
  }

  /**
   * Calculate blog post quality metrics
   */
  private calculateBlogQualityMetrics(blogPost: BlogPost, metadata?: GitHubContentMetadata): ContentQualityMetrics {
    const readabilityScore = this.calculateReadabilityScore(blogPost.content, metadata)
    const seoScore = this.calculateBlogSeoScore(blogPost)
    const structureScore = this.calculateStructureScore(metadata)
    const accessibilityScore = this.calculateAccessibilityScore(blogPost.content)

    return {
      readabilityScore,
      seoScore,
      structureScore,
      accessibilityScore,
    }
  }

  /**
   * Calculate project quality metrics
   */
  private calculateProjectQualityMetrics(project: Project, metadata?: GitHubContentMetadata): ContentQualityMetrics {
    const readabilityScore = this.calculateReadabilityScore(project.description, metadata)
    const seoScore = this.calculateProjectSeoScore(project)
    const structureScore = this.calculateStructureScore(metadata)
    const accessibilityScore = this.calculateAccessibilityScore(project.description)

    return {
      readabilityScore,
      seoScore,
      structureScore,
      accessibilityScore,
    }
  }

  /**
   * Calculate readability score
   */
  private calculateReadabilityScore(content?: string, metadata?: GitHubContentMetadata): number {
    if (!content) return 0

    let score = 50 // Base score

    // Word count considerations
    const wordCount = metadata?.wordCount || content.split(/\s+/).length
    if (wordCount >= 300) score += 20
    if (wordCount >= 500) score += 10

    // Sentence variety (basic check)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const avgWordsPerSentence = wordCount / sentences.length

    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) {
      score += 20 // Good sentence length
    }

    return Math.min(100, score)
  }

  /**
   * Calculate SEO score for blog posts
   */
  private calculateBlogSeoScore(blogPost: BlogPost): number {
    let score = 0

    if (blogPost.title && blogPost.title.length >= 30 && blogPost.title.length <= 60) {
      score += 25
    }

    if (blogPost.excerpt && blogPost.excerpt.length >= 120 && blogPost.excerpt.length <= 160) {
      score += 25
    }

    if (blogPost.tags && blogPost.tags.length >= 3 && blogPost.tags.length <= 8) {
      score += 25
    }

    if (blogPost.categories && blogPost.categories.length >= 1 && blogPost.categories.length <= 3) {
      score += 25
    }

    return score
  }

  /**
   * Calculate SEO score for projects
   */
  private calculateProjectSeoScore(project: Project): number {
    let score = 0

    if (project.title && project.title.length >= 10 && project.title.length <= 50) {
      score += 30
    }

    if (project.description && project.description.length >= 100) {
      score += 30
    }

    if (project.technologies && project.technologies.length >= 2) {
      score += 20
    }

    if (project.projectLinks?.repository || project.projectLinks?.demo) {
      score += 20
    }

    return score
  }

  /**
   * Calculate structure score based on headings
   */
  private calculateStructureScore(metadata?: GitHubContentMetadata): number {
    if (!metadata?.headings) return 50

    let score = 30 // Base score

    const headings = metadata.headings
    if (headings.length >= 2) score += 30
    if (headings.length >= 4) score += 20

    // Check heading hierarchy
    const levels = headings.map(h => h.level)
    const hasGoodHierarchy = levels.every((level, index) => {
      if (index === 0) return true
      return level <= levels[index - 1] + 1 // No skipping levels
    })

    if (hasGoodHierarchy) score += 20

    return Math.min(100, score)
  }

  /**
   * Calculate accessibility score
   */
  private calculateAccessibilityScore(content?: string): number {
    if (!content) return 50

    let score = 50 // Base score

    // Check for image alt text patterns (basic)
    const imageMatches = content.match(/!\[([^\]]*)\]/g) || []
    const imagesWithAlt = imageMatches.filter(match => match.length > 4) // ![...]

    if (imageMatches.length === 0 || imagesWithAlt.length === imageMatches.length) {
      score += 25 // All images have alt text or no images
    }

    // Check for link text quality (basic)
    const linkMatches = content.match(/\[([^\]]+)\]/g) || []
    const descriptiveLinks = linkMatches.filter(match => {
      const text = match.slice(1, -1)
      return text.length > 5 && !["click here", "read more", "link"].includes(text.toLowerCase())
    })

    if (linkMatches.length === 0 || descriptiveLinks.length / linkMatches.length >= 0.8) {
      score += 25 // Most links are descriptive
    }

    return Math.min(100, score)
  }

  /**
   * Calculate overall quality score
   */
  private calculateOverallScore(metrics: ContentQualityMetrics, errors: string[], warnings: string[]): number {
    // Base score from metrics (weighted average)
    const baseScore =
      metrics.readabilityScore * 0.3 +
      metrics.seoScore * 0.3 +
      metrics.structureScore * 0.2 +
      metrics.accessibilityScore * 0.2

    // Penalty for errors and warnings
    const errorPenalty = errors.length * 15
    const warningPenalty = warnings.length * 5

    const finalScore = Math.max(0, baseScore - errorPenalty - warningPenalty)
    return Math.round(finalScore)
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const contentValidator = new ContentValidator()
