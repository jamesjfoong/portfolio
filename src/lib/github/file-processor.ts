// GitHub file processing service
import type { GitHubContentMetadata } from "@/types/content"
import type { GitHubContent } from "@/types/github"

export interface ProcessingOptions {
  validateContent?: boolean
  extractMetadata?: boolean
  sanitizeContent?: boolean
  maxContentLength?: number
}

export interface ProcessingResult {
  success: boolean
  processedContent?: string
  metadata?: GitHubContentMetadata
  warnings?: string[]
  error?: string
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  fileInfo: {
    size: number
    encoding: string
    lineCount: number
    hasEmptyLines: boolean
  }
}

export class FileProcessor {
  /**
   * Process GitHub file content for CMS use
   */
  async processFile(githubContent: GitHubContent, options: ProcessingOptions = {}): Promise<ProcessingResult> {
    try {
      const {
        validateContent = true,
        extractMetadata = true,
        sanitizeContent = true,
        maxContentLength = 100000, // 100KB
      } = options

      let processedContent = githubContent.content
      const warnings: string[] = []
      let metadata: GitHubContentMetadata | undefined

      // Validate content if requested
      if (validateContent) {
        const validation = this.validateFileContent(githubContent)
        if (!validation.isValid) {
          return {
            success: false,
            error: `File validation failed: ${validation.errors.join(", ")}`,
          }
        }
        warnings.push(...validation.warnings)
      }

      // Check content length
      if (processedContent.length > maxContentLength) {
        return {
          success: false,
          error: `Content too large: ${processedContent.length} bytes (max: ${maxContentLength})`,
        }
      }

      // Sanitize content if requested
      if (sanitizeContent) {
        processedContent = this.sanitizeContent(processedContent)
      }

      // Extract metadata if requested
      if (extractMetadata) {
        metadata = this.extractBasicMetadata(githubContent, processedContent)
      }

      return {
        success: true,
        processedContent,
        metadata,
        warnings: warnings.length > 0 ? warnings : undefined,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown processing error",
      }
    }
  }

  /**
   * Validate GitHub file content
   */
  validateFileContent(githubContent: GitHubContent): FileValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const content = githubContent.content

    // Basic validation
    if (!content || content.trim().length === 0) {
      errors.push("File content is empty")
    }

    // Check encoding
    if (githubContent.encoding !== "utf-8") {
      warnings.push(`File encoding is ${githubContent.encoding}, expected utf-8`)
    }

    // Check for null bytes or other problematic characters
    if (content.includes("\0")) {
      errors.push("File contains null bytes")
    }

    // Line ending checks
    const lines = content.split("\n")
    const emptyLines = lines.filter(line => line.trim() === "")
    const hasEmptyLines = emptyLines.length > 0

    if (lines.length > 10000) {
      warnings.push("File has many lines (10000+), may impact performance")
    }

    // Check for extremely long lines
    const longLines = lines.filter(line => line.length > 1000)
    if (longLines.length > 0) {
      warnings.push(`File has ${longLines.length} very long lines (1000+ characters)`)
    }

    // File size checks
    const fileSizeKB = githubContent.size / 1024
    if (fileSizeKB > 500) {
      warnings.push(`File is large (${fileSizeKB.toFixed(1)}KB)`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileInfo: {
        size: githubContent.size,
        encoding: githubContent.encoding,
        lineCount: lines.length,
        hasEmptyLines,
      },
    }
  }

  /**
   * Sanitize content for security
   */
  private sanitizeContent(content: string): string {
    let sanitized = content

    // Remove potential script tags (basic protection)
    sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")

    // Remove potentially dangerous HTML attributes
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")

    // Normalize line endings
    sanitized = sanitized.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

    // Remove excessive whitespace but preserve markdown formatting
    sanitized = sanitized.replace(/\n{4,}/g, "\n\n\n")

    return sanitized
  }

  /**
   * Extract basic metadata from GitHub content
   */
  private extractBasicMetadata(githubContent: GitHubContent, processedContent: string): GitHubContentMetadata {
    const lines = processedContent.split("\n")
    const wordCount = processedContent
      .replace(/[#*`\-_>/\[\]()]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 0).length

    // Extract headings for basic structure analysis
    const headings = lines
      .filter(line => line.trim().startsWith("#"))
      .map(line => {
        const match = line.match(/^(#{1,6})\s+(.+)$/)
        if (match) {
          return {
            level: match[1].length,
            text: match[2].trim(),
            id: this.generateHeadingId(match[2].trim()),
          }
        }
        return null
      })
      .filter(heading => heading !== null) as Array<{
      level: number
      text: string
      id: string
    }>

    // Determine file type from path
    const fileType = this.determineFileType(githubContent.filePath)

    return {
      filePath: githubContent.filePath,
      fileType,
      frontmatter: {}, // Will be filled by markdown parser
      parsedSuccessfully: true,
      errors: [],
      warnings: [],
      wordCount,
      estimatedReadingTime: Math.ceil(wordCount / 200),
      headings,
    }
  }

  /**
   * Generate heading ID for TOC
   */
  private generateHeadingId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  /**
   * Determine file type from path
   */
  private determineFileType(filePath: string): "blog" | "project" {
    if (filePath.includes("/blog/") || filePath.includes("/posts/")) {
      return "blog"
    }
    if (filePath.includes("/project/") || filePath.includes("/portfolio/")) {
      return "project"
    }
    return "blog" // Default fallback
  }

  /**
   * Process multiple files in batch
   */
  async batchProcess(githubContents: GitHubContent[], options: ProcessingOptions = {}): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = []

    for (const content of githubContents) {
      const result = await this.processFile(content, options)
      results.push(result)

      // Add small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    return results
  }

  /**
   * Get processing statistics
   */
  getProcessingStats(results: ProcessingResult[]): {
    total: number
    successful: number
    failed: number
    withWarnings: number
  } {
    return {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      withWarnings: results.filter(r => r.warnings && r.warnings.length > 0).length,
    }
  }
}

// Export singleton instance
export const fileProcessor = new FileProcessor()
