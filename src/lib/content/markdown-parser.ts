// Markdown parser service with frontmatter support
import matter from "gray-matter"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"

import type { GitHubContentMetadata } from "@/types/content"

export interface ParsedMarkdown {
  content: string
  frontmatter: Record<string, unknown>
  metadata: {
    wordCount: number
    readingTime: number
    headings: Array<{
      level: number
      text: string
      id: string
    }>
  }
}

export interface ParseMarkdownOptions {
  extractExcerpt?: boolean
  generateTOC?: boolean
  validateLinks?: boolean
}

export class MarkdownParser {
  private processor = remark().use(remarkGfm).use(remarkRehype).use(rehypeHighlight).use(rehypeStringify)

  /**
   * Parse markdown content with frontmatter
   */
  async parseMarkdown(
    rawContent: string,
    filePath: string,
    _options: ParseMarkdownOptions = {}
  ): Promise<GitHubContentMetadata> {
    try {
      // Parse frontmatter
      const { data: frontmatter, content: markdownContent } = matter(rawContent)

      // Process markdown to HTML
      const processedContent = await this.processor.process(markdownContent)
      const htmlContent = processedContent.toString()

      // Extract metadata
      const metadata = this.extractMetadata(markdownContent, htmlContent)

      return {
        filePath,
        fileType: this.determineFileType(filePath),
        frontmatter,
        parsedSuccessfully: true,
        errors: [],
        warnings: [],
        wordCount: metadata.wordCount,
        estimatedReadingTime: metadata.readingTime,
        headings: metadata.headings,
      }
    } catch (error) {
      return {
        filePath,
        fileType: this.determineFileType(filePath),
        frontmatter: {},
        parsedSuccessfully: false,
        errors: [error instanceof Error ? error.message : "Unknown parsing error"],
        warnings: [],
        wordCount: 0,
        estimatedReadingTime: 0,
        headings: [],
      }
    }
  }

  /**
   * Process markdown to HTML
   */
  async markdownToHtml(markdownContent: string): Promise<string> {
    const processed = await this.processor.process(markdownContent)
    return processed.toString()
  }

  /**
   * Extract metadata from markdown content
   */
  private extractMetadata(markdownContent: string, _htmlContent: string) {
    // Calculate word count
    const words = markdownContent.split(/\s+/).filter(word => word.length > 0)
    const wordCount = words.length

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200)

    // Extract headings
    const headings = this.extractHeadings(markdownContent)

    return {
      wordCount,
      readingTime,
      headings,
    }
  }

  /**
   * Extract headings from markdown for TOC generation
   */
  private extractHeadings(markdownContent: string): Array<{
    level: number
    text: string
    id: string
  }> {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const headings: Array<{ level: number; text: string; id: string }> = []

    let match
    while ((match = headingRegex.exec(markdownContent)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = this.generateHeadingId(text)

      headings.push({ level, text, id })
    }

    return headings
  }

  /**
   * Generate URL-friendly heading ID
   */
  private generateHeadingId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .trim()
  }

  /**
   * Determine file type from file path
   */
  private determineFileType(filePath: string): "blog" | "project" {
    if (filePath.includes("/blogs/") || filePath.includes("/blog/")) {
      return "blog"
    }
    if (filePath.includes("/projects/") || filePath.includes("/project/")) {
      return "project"
    }

    // Default fallback based on common patterns
    return filePath.includes("blog") ? "blog" : "project"
  }

  /**
   * Validate frontmatter structure
   */
  validateFrontmatter(frontmatter: Record<string, unknown>, fileType: "blog" | "project"): string[] {
    const errors: string[] = []

    // Common validations
    if (!frontmatter.title || typeof frontmatter.title !== "string") {
      errors.push("Title is required and must be a string")
    }

    if (frontmatter.published !== undefined && typeof frontmatter.published !== "boolean") {
      errors.push("Published field must be a boolean")
    }

    if (frontmatter.date && typeof frontmatter.date !== "string") {
      errors.push("Date must be a string in YYYY-MM-DD format")
    }

    if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
      errors.push("Tags must be an array of strings")
    }

    // File type specific validations
    if (fileType === "blog") {
      if (frontmatter.categories && !Array.isArray(frontmatter.categories)) {
        errors.push("Categories must be an array of strings")
      }
    }

    if (fileType === "project") {
      if (frontmatter.technologies && !Array.isArray(frontmatter.technologies)) {
        errors.push("Technologies must be an array of strings")
      }
    }

    return errors
  }

  /**
   * Generate excerpt from content
   */
  generateExcerpt(content: string, maxLength: number = 160): string {
    // Remove markdown formatting
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // Remove headings
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
      .trim()

    if (plainText.length <= maxLength) {
      return plainText
    }

    // Find the last complete sentence within the limit
    const truncated = plainText.substring(0, maxLength)
    const lastSentence = truncated.lastIndexOf(".")
    const lastSpace = truncated.lastIndexOf(" ")

    if (lastSentence > maxLength * 0.8) {
      return truncated.substring(0, lastSentence + 1)
    } else if (lastSpace > maxLength * 0.8) {
      return `${truncated.substring(0, lastSpace)}...`
    } else {
      return `${truncated}...`
    }
  }
}

// Export singleton instance
export const markdownParser = new MarkdownParser()
