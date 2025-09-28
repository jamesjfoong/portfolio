// Frontmatter processing service
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"

export interface FrontmatterValidationRules {
  required?: string[] // Required fields
  optional?: string[] // Optional fields (for documentation)
  types?: Record<string, "string" | "number" | "boolean" | "array" | "date"> // Field type validation
  patterns?: Record<string, RegExp> // Regex patterns for string fields
  arrayItemTypes?: Record<string, "string" | "number"> // Types for array items
}

export interface FrontmatterValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  normalizedData: Record<string, unknown>
}

export interface ProcessedFrontmatter {
  data: Record<string, unknown>
  content: string
  validation: FrontmatterValidationResult
  originalFrontmatter: string
}

export class FrontmatterProcessor {
  private blogValidationRules: FrontmatterValidationRules
  private projectValidationRules: FrontmatterValidationRules

  constructor() {
    // Blog post validation rules
    this.blogValidationRules = {
      required: ["title", "date", "published"],
      optional: ["excerpt", "tags", "categories", "author", "description", "ogImage"],
      types: {
        title: "string",
        date: "date",
        published: "boolean",
        excerpt: "string",
        tags: "array",
        categories: "array",
        author: "string",
        description: "string",
        ogImage: "string",
      },
      arrayItemTypes: {
        tags: "string",
        categories: "string",
      },
    }

    // Project validation rules
    this.projectValidationRules = {
      required: ["title", "description", "published"],
      optional: ["date", "technologies", "demo", "repository", "images", "status", "priority"],
      types: {
        title: "string",
        description: "string",
        published: "boolean",
        date: "date",
        technologies: "array",
        demo: "string",
        repository: "string",
        images: "array",
        status: "string",
        priority: "number",
      },
      arrayItemTypes: {
        technologies: "string",
        images: "string",
      },
      patterns: {
        demo: /^https?:\/\/.+/,
        repository: /^https?:\/\/.+/,
      },
    }
  }

  /**
   * Process frontmatter from markdown content
   */
  processFrontmatter(rawContent: string, fileType: "blog" | "project" = "blog"): ProcessedFrontmatter {
    const { frontmatter, content, originalFrontmatter } = this.extractFrontmatter(rawContent)

    const rules = fileType === "blog" ? this.blogValidationRules : this.projectValidationRules
    const validation = this.validateFrontmatter(frontmatter, rules)

    return {
      data: validation.normalizedData,
      content,
      validation,
      originalFrontmatter,
    }
  }

  /**
   * Extract frontmatter from markdown content
   */
  private extractFrontmatter(rawContent: string): {
    frontmatter: Record<string, unknown>
    content: string
    originalFrontmatter: string
  } {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/
    const match = rawContent.match(frontmatterRegex)

    if (!match) {
      return {
        frontmatter: {},
        content: rawContent,
        originalFrontmatter: "",
      }
    }

    const [, frontmatterYaml, content] = match

    try {
      const frontmatter = parseYaml(frontmatterYaml) || {}
      return {
        frontmatter: typeof frontmatter === "object" ? frontmatter : {},
        content: content.trim(),
        originalFrontmatter: frontmatterYaml,
      }
    } catch (error) {
      throw new Error(`Failed to parse frontmatter YAML: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Validate frontmatter against rules
   */
  private validateFrontmatter(
    frontmatter: Record<string, unknown>,
    rules: FrontmatterValidationRules
  ): FrontmatterValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const normalizedData: Record<string, unknown> = { ...frontmatter }

    // Check required fields
    if (rules.required) {
      for (const field of rules.required) {
        if (!(field in frontmatter) || frontmatter[field] === null || frontmatter[field] === undefined) {
          errors.push(`Missing required field: ${field}`)
        }
      }
    }

    // Validate types and normalize data
    if (rules.types) {
      for (const [field, expectedType] of Object.entries(rules.types)) {
        if (field in frontmatter) {
          const value = frontmatter[field]
          const validationResult = this.validateFieldType(field, value, expectedType)

          if (!validationResult.isValid) {
            errors.push(validationResult.error!)
          } else {
            normalizedData[field] = validationResult.normalizedValue
          }
        }
      }
    }

    // Validate array item types
    if (rules.arrayItemTypes) {
      for (const [field, itemType] of Object.entries(rules.arrayItemTypes)) {
        if (field in normalizedData && Array.isArray(normalizedData[field])) {
          const array = normalizedData[field] as unknown[]
          const validItems: unknown[] = []

          for (const item of array) {
            const validation = this.validateFieldType(`${field}[]`, item, itemType)
            if (validation.isValid) {
              validItems.push(validation.normalizedValue)
            } else {
              warnings.push(`Invalid ${field} array item: ${validation.error}`)
            }
          }

          normalizedData[field] = validItems
        }
      }
    }

    // Validate patterns
    if (rules.patterns) {
      for (const [field, pattern] of Object.entries(rules.patterns)) {
        if (field in normalizedData && typeof normalizedData[field] === "string") {
          const value = normalizedData[field] as string
          if (!pattern.test(value)) {
            errors.push(`Field ${field} does not match expected pattern: ${value}`)
          }
        }
      }
    }

    // Check for unknown fields (warning only)
    const knownFields = new Set([
      ...(rules.required || []),
      ...(rules.optional || []),
      ...Object.keys(rules.types || {}),
    ])

    for (const field of Object.keys(frontmatter)) {
      if (!knownFields.has(field)) {
        warnings.push(`Unknown field: ${field}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      normalizedData,
    }
  }

  /**
   * Validate individual field type
   */
  private validateFieldType(
    fieldName: string,
    value: unknown,
    expectedType: string
  ): { isValid: boolean; normalizedValue?: unknown; error?: string } {
    switch (expectedType) {
      case "string":
        if (typeof value === "string") {
          return { isValid: true, normalizedValue: value.trim() }
        }
        if (typeof value === "number") {
          return { isValid: true, normalizedValue: String(value) }
        }
        return { isValid: false, error: `${fieldName} must be a string, got ${typeof value}` }

      case "number":
        if (typeof value === "number" && !isNaN(value)) {
          return { isValid: true, normalizedValue: value }
        }
        if (typeof value === "string") {
          const parsed = parseFloat(value)
          if (!isNaN(parsed)) {
            return { isValid: true, normalizedValue: parsed }
          }
        }
        return { isValid: false, error: `${fieldName} must be a number, got ${typeof value}` }

      case "boolean":
        if (typeof value === "boolean") {
          return { isValid: true, normalizedValue: value }
        }
        if (typeof value === "string") {
          const lower = value.toLowerCase()
          if (lower === "true" || lower === "yes" || lower === "1") {
            return { isValid: true, normalizedValue: true }
          }
          if (lower === "false" || lower === "no" || lower === "0") {
            return { isValid: true, normalizedValue: false }
          }
        }
        return { isValid: false, error: `${fieldName} must be a boolean, got ${typeof value}` }

      case "array":
        if (Array.isArray(value)) {
          return { isValid: true, normalizedValue: value }
        }
        if (typeof value === "string") {
          // Try to parse comma-separated values
          const array = value
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0)
          return { isValid: true, normalizedValue: array }
        }
        return { isValid: false, error: `${fieldName} must be an array, got ${typeof value}` }

      case "date":
        if (value instanceof Date) {
          return { isValid: true, normalizedValue: value }
        }
        if (typeof value === "string") {
          const date = new Date(value)
          if (!isNaN(date.getTime())) {
            return { isValid: true, normalizedValue: date }
          }
        }
        return { isValid: false, error: `${fieldName} must be a valid date, got ${typeof value}` }

      default:
        return { isValid: false, error: `Unknown validation type: ${expectedType}` }
    }
  }

  /**
   * Generate frontmatter from data object
   */
  generateFrontmatter(data: Record<string, unknown>): string {
    try {
      const yamlString = stringifyYaml(data, { indent: 2 })
      return `---\n${yamlString}---\n`
    } catch (error) {
      throw new Error(`Failed to generate frontmatter: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Update existing frontmatter
   */
  updateFrontmatter(
    rawContent: string,
    updates: Record<string, unknown>,
    fileType: "blog" | "project" = "blog"
  ): string {
    const processed = this.processFrontmatter(rawContent, fileType)
    const updatedData = { ...processed.data, ...updates }

    const newFrontmatter = this.generateFrontmatter(updatedData)
    return newFrontmatter + processed.content
  }

  /**
   * Get validation rules for file type
   */
  getValidationRules(fileType: "blog" | "project"): FrontmatterValidationRules {
    return fileType === "blog" ? { ...this.blogValidationRules } : { ...this.projectValidationRules }
  }

  /**
   * Update validation rules
   */
  updateValidationRules(fileType: "blog" | "project", rules: Partial<FrontmatterValidationRules>): void {
    if (fileType === "blog") {
      this.blogValidationRules = { ...this.blogValidationRules, ...rules }
    } else {
      this.projectValidationRules = { ...this.projectValidationRules, ...rules }
    }
  }
}

// Export singleton instance
export const frontmatterProcessor = new FrontmatterProcessor()
