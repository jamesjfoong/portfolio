// Content slug generation service
export interface SlugOptions {
  maxLength?: number
  allowNumbers?: boolean
  separator?: string
  lowercase?: boolean
  removeStopWords?: boolean
  preserveCase?: boolean
}

export interface SlugValidationResult {
  isValid: boolean
  slug: string
  suggestions?: string[]
  issues?: string[]
}

export interface SlugConflictResult {
  hasConflict: boolean
  conflictingSlugs: string[]
  suggestedAlternatives: string[]
}

export class SlugGenerator {
  private usedSlugs = new Set<string>()
  private stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "he",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "that",
    "the",
    "to",
    "was",
    "were",
    "will",
    "with",
    "or",
    "but",
    "so",
    "this",
    "these",
    "they",
    "we",
    "you",
    "your",
    "our",
    "my",
    "me",
    "him",
    "her",
    "us",
    "them",
  ])

  /**
   * Generate slug from text
   */
  generateSlug(text: string, options: SlugOptions = {}): string {
    const {
      maxLength = 60,
      allowNumbers = true,
      separator = "-",
      lowercase = true,
      removeStopWords = false,
      preserveCase = false,
    } = options

    let slug = text.trim()

    // Handle case conversion
    if (lowercase && !preserveCase) {
      slug = slug.toLowerCase()
    }

    // Remove markdown syntax
    slug = slug
      .replace(/#{1,6}\s+/g, "") // Remove heading markers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // Remove images

    // Remove HTML tags
    slug = slug.replace(/<[^>]*>/g, "")

    // Replace special characters
    slug = slug
      .replace(/[àáâãäå]/g, "a")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/[òóôõö]/g, "o")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ñ]/g, "n")
      .replace(/[ç]/g, "c")
      .replace(/[ß]/g, "ss")
      .replace(/[æ]/g, "ae")
      .replace(/[œ]/g, "oe")

    // Remove or replace punctuation and special characters
    slug = slug.replace(/[^a-zA-Z0-9\s\-_]/g, "")

    // Handle numbers
    if (!allowNumbers) {
      slug = slug.replace(/[0-9]/g, "")
    }

    // Split into words and filter
    let words = slug.split(/\s+/).filter(word => word.length > 0)

    // Remove stop words if requested
    if (removeStopWords) {
      words = words.filter(word => !this.stopWords.has(word.toLowerCase()))
    }

    // Join with separator
    slug = words.join(separator)

    // Remove multiple consecutive separators
    const separatorRegex = new RegExp(`\\${separator}+`, "g")
    slug = slug.replace(separatorRegex, separator)

    // Remove leading/trailing separators
    slug = slug.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), "")

    // Truncate if necessary
    if (slug.length > maxLength) {
      // Try to break at separator to avoid cutting words
      const truncated = slug.substring(0, maxLength)
      const lastSeparator = truncated.lastIndexOf(separator)

      if (lastSeparator > maxLength * 0.7) {
        slug = truncated.substring(0, lastSeparator)
      } else {
        slug = truncated
      }
    }

    // Ensure slug is not empty
    if (!slug) {
      slug = this.generateFallbackSlug()
    }

    return slug
  }

  /**
   * Generate slug from filename
   */
  generateSlugFromFilename(filename: string, options: SlugOptions = {}): string {
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.(md|mdx)$/, "")

    // Extract date prefix if present (e.g., "2023-12-01-title.md")
    const dateMatch = nameWithoutExt.match(/^(\d{4}-\d{2}-\d{2}-)?(.*)/)
    const titlePart = dateMatch ? dateMatch[2] : nameWithoutExt

    return this.generateSlug(titlePart, options)
  }

  /**
   * Generate slug from frontmatter data
   */
  generateSlugFromFrontmatter(
    frontmatter: Record<string, unknown>,
    filename?: string,
    options: SlugOptions = {}
  ): string {
    // Priority order: slug field, title field, filename
    if (frontmatter.slug && typeof frontmatter.slug === "string") {
      return this.generateSlug(frontmatter.slug, options)
    }

    if (frontmatter.title && typeof frontmatter.title === "string") {
      return this.generateSlug(frontmatter.title, options)
    }

    if (filename) {
      return this.generateSlugFromFilename(filename, options)
    }

    return this.generateFallbackSlug()
  }

  /**
   * Validate slug format and uniqueness
   */
  validateSlug(slug: string, options: SlugOptions = {}): SlugValidationResult {
    const issues: string[] = []
    const suggestions: string[] = []
    let isValid = true

    const { maxLength = 60, allowNumbers = true, separator = "-" } = options

    // Check if slug is empty
    if (!slug || slug.trim().length === 0) {
      issues.push("Slug cannot be empty")
      suggestions.push(this.generateFallbackSlug())
      isValid = false
    }

    // Check length
    if (slug.length > maxLength) {
      issues.push(`Slug is too long (${slug.length} characters, max: ${maxLength})`)
      suggestions.push(slug.substring(0, maxLength))
      isValid = false
    }

    // Check for invalid characters
    const validPattern = allowNumbers
      ? new RegExp(`^[a-zA-Z0-9\\${separator}]+$`)
      : new RegExp(`^[a-zA-Z\\${separator}]+$`)

    if (!validPattern.test(slug)) {
      issues.push("Slug contains invalid characters")
      suggestions.push(this.generateSlug(slug, options))
      isValid = false
    }

    // Check for leading/trailing separators
    if (slug.startsWith(separator) || slug.endsWith(separator)) {
      issues.push(`Slug cannot start or end with '${separator}'`)
      const cleaned = slug.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), "")
      suggestions.push(cleaned)
      isValid = false
    }

    // Check for consecutive separators
    const consecutiveSeparators = new RegExp(`\\${separator}{2,}`)
    if (consecutiveSeparators.test(slug)) {
      issues.push(`Slug contains consecutive '${separator}' characters`)
      const cleaned = slug.replace(new RegExp(`\\${separator}+`, "g"), separator)
      suggestions.push(cleaned)
      isValid = false
    }

    return {
      isValid,
      slug: isValid ? slug : suggestions[0] || this.generateFallbackSlug(),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      issues: issues.length > 0 ? issues : undefined,
    }
  }

  /**
   * Check for slug conflicts and suggest alternatives
   */
  checkSlugConflict(slug: string): SlugConflictResult {
    const hasConflict = this.usedSlugs.has(slug)
    const conflictingSlugs = hasConflict ? [slug] : []
    const suggestedAlternatives: string[] = []

    if (hasConflict) {
      // Generate numbered alternatives
      for (let i = 2; i <= 10; i++) {
        const alternative = `${slug}-${i}`
        if (!this.usedSlugs.has(alternative)) {
          suggestedAlternatives.push(alternative)
        }
      }

      // Generate date-based alternative
      const today = new Date().toISOString().split("T")[0]
      const dateAlternative = `${slug}-${today}`
      if (!this.usedSlugs.has(dateAlternative)) {
        suggestedAlternatives.push(dateAlternative)
      }

      // Generate random suffix alternative
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      suggestedAlternatives.push(`${slug}-${randomSuffix}`)
    }

    return {
      hasConflict,
      conflictingSlugs,
      suggestedAlternatives,
    }
  }

  /**
   * Generate unique slug ensuring no conflicts
   */
  generateUniqueSlug(text: string, options: SlugOptions = {}): string {
    let baseSlug = this.generateSlug(text, options)

    // Validate base slug
    const validation = this.validateSlug(baseSlug, options)
    baseSlug = validation.slug

    // Check for conflicts
    const conflict = this.checkSlugConflict(baseSlug)

    if (conflict.hasConflict && conflict.suggestedAlternatives.length > 0) {
      return conflict.suggestedAlternatives[0]
    }

    return baseSlug
  }

  /**
   * Register slug as used
   */
  registerSlug(slug: string): void {
    this.usedSlugs.add(slug)
  }

  /**
   * Unregister slug
   */
  unregisterSlug(slug: string): void {
    this.usedSlugs.delete(slug)
  }

  /**
   * Get all registered slugs
   */
  getUsedSlugs(): string[] {
    return Array.from(this.usedSlugs)
  }

  /**
   * Clear all registered slugs
   */
  clearUsedSlugs(): void {
    this.usedSlugs.clear()
  }

  /**
   * Generate fallback slug when all else fails
   */
  private generateFallbackSlug(): string {
    const timestamp = Date.now()
    return `untitled-${timestamp}`
  }

  /**
   * Bulk register slugs
   */
  registerSlugs(slugs: string[]): void {
    for (const slug of slugs) {
      this.usedSlugs.add(slug)
    }
  }

  /**
   * Update stop words list
   */
  updateStopWords(stopWords: string[]): void {
    this.stopWords = new Set(stopWords.map(word => word.toLowerCase()))
  }

  /**
   * Get current stop words
   */
  getStopWords(): string[] {
    return Array.from(this.stopWords)
  }
}

// Export singleton instance
export const slugGenerator = new SlugGenerator()
