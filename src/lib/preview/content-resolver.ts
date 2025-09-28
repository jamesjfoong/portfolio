import type { BlogPost, Project } from "@/types/content"

import { ChangeDetector } from "../sync/change-detector"
import { ContentProcessor } from "../sync/content-processor"
import type { PreviewToken } from "./token-generator"
import { PreviewTokenValidator } from "./token-validator"

export interface PreviewContent {
  content: BlogPost | Project
  isPreview: boolean
  previewToken: string
  lastFetched: Date
  warnings?: string[]
}

export interface ResolverOptions {
  forceFresh?: boolean
  includeUnpublished?: boolean
  validateToken?: boolean
}

export class PreviewContentResolver {
  private tokenValidator: PreviewTokenValidator
  private changeDetector: ChangeDetector
  private contentProcessor: ContentProcessor
  private contentCache = new Map<string, PreviewContent>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.tokenValidator = new PreviewTokenValidator()
    this.changeDetector = new ChangeDetector()
    this.contentProcessor = new ContentProcessor()
  }

  async resolveContent(
    token: string,
    slug?: string,
    options?: ResolverOptions
  ): Promise<{
    success: boolean
    content?: PreviewContent
    error?: string
  }> {
    const opts = {
      forceFresh: false,
      includeUnpublished: true,
      validateToken: true,
      ...options,
    }

    try {
      // Validate token if requested
      if (opts.validateToken) {
        const validation = await this.tokenValidator.validateToken(token, {
          requireSlug: slug,
        })

        if (!validation.isValid) {
          return {
            success: false,
            error: validation.error || "Invalid preview token",
          }
        }

        // Use token info if slug not provided
        if (!slug && validation.token) {
          slug = validation.token.slug
        }
      }

      if (!slug) {
        return {
          success: false,
          error: "Content slug is required",
        }
      }

      // Check cache first (unless force fresh)
      const cacheKey = `${token}-${slug}`
      if (!opts.forceFresh && this.contentCache.has(cacheKey)) {
        const cached = this.contentCache.get(cacheKey)!
        const isExpired = Date.now() - cached.lastFetched.getTime() > this.CACHE_TTL

        if (!isExpired) {
          return {
            success: true,
            content: cached,
          }
        }
      }

      // Determine content type from token or slug pattern
      const contentType = this.determineContentType(slug, token)

      // Fetch fresh content
      const content = await this.fetchContent(slug, contentType, opts)

      if (!content) {
        return {
          success: false,
          error: `Content not found: ${slug}`,
        }
      }

      // Create preview content object
      const previewContent: PreviewContent = {
        content,
        isPreview: true,
        previewToken: token,
        lastFetched: new Date(),
        warnings: await this.generateWarnings(content, contentType),
      }

      // Cache the result
      this.contentCache.set(cacheKey, previewContent)

      // Clean up old cache entries
      this.cleanupCache()

      return {
        success: true,
        content: previewContent,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to resolve preview content",
      }
    }
  }

  private async fetchContent(
    slug: string,
    contentType: "blog" | "project",
    options: ResolverOptions
  ): Promise<BlogPost | Project | null> {
    try {
      // Construct file path based on content type
      const filePath = contentType === "blog" ? `content/blog/${slug}.md` : `content/projects/${slug}.md`

      // Check if file exists
      const fileExists = await this.changeDetector.validateFileExists(filePath)
      if (!fileExists) {
        // Try with .mdx extension
        const mdxPath = filePath.replace(".md", ".mdx")
        const mdxExists = await this.changeDetector.validateFileExists(mdxPath)
        if (!mdxExists) {
          return null
        }
      }

      // Get file content
      const rawContent = await this.changeDetector.getFileContent(filePath)
      if (!rawContent) {
        return null
      }

      // Process the content
      const fileChange = {
        path: filePath,
        type: "file" as const,
        sha: "",
        size: rawContent.length,
        url: "",
        lastModified: new Date(),
        content: rawContent,
      }

      const processingResult = await this.contentProcessor.processFile(fileChange, "update")

      if (!processingResult.success) {
        throw new Error(`Failed to process content: ${processingResult.errors?.join(", ")}`)
      }

      // For now, return a mock content object since we don't have direct access to processed content
      // In a real implementation, the ContentProcessor would return the processed content
      const mockContent =
        contentType === "blog" ? this.createMockBlogPost(slug, rawContent) : this.createMockProject(slug, rawContent)

      return mockContent
    } catch (error) {
      console.error(`Error fetching ${contentType} content for ${slug}:`, error)
      return null
    }
  }

  private determineContentType(slug: string, token: string): "blog" | "project" {
    // Try to determine from token validation first
    // For now, use simple heuristics
    if (slug.includes("blog") || slug.includes("post")) {
      return "blog"
    }
    if (slug.includes("project")) {
      return "project"
    }

    // Default to blog
    return "blog"
  }

  private createMockBlogPost(slug: string, content: string): BlogPost {
    // Parse frontmatter and content (simplified)
    const lines = content.split("\n")
    const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line.trim() === "---")
    const title =
      lines
        .find(line => line.startsWith("title:"))
        ?.replace("title:", "")
        .trim() || slug

    return {
      slug,
      title,
      content: content.substring(content.indexOf("---", 3) + 3).trim(),
      excerpt: "",
      publishDate: new Date().toISOString(),
      lastModified: new Date(),
      tags: [],
      wordCount: content.split(" ").length,
      readingTime: Math.ceil(content.split(" ").length / 200),
      seo: {
        title,
        description: "",
        keywords: [],
      },
    }
  }

  private createMockProject(slug: string, content: string): Project {
    // Parse frontmatter and content (simplified)
    const lines = content.split("\n")
    const title =
      lines
        .find(line => line.startsWith("title:"))
        ?.replace("title:", "")
        .trim() || slug
    const description =
      lines
        .find(line => line.startsWith("description:"))
        ?.replace("description:", "")
        .trim() || ""

    return {
      slug,
      title,
      description,
      content: content.substring(content.indexOf("---", 3) + 3).trim(),
      publishDate: new Date().toISOString(),
      lastModified: new Date(),
      technologies: [],
      completionStatus: "completed",
      images: [],
      projectLinks: {},
      wordCount: content.split(" ").length,
      readingTime: Math.ceil(content.split(" ").length / 200),
      seo: {
        title,
        description,
        keywords: [],
      },
    }
  }

  private async generateWarnings(content: BlogPost | Project, contentType: "blog" | "project"): Promise<string[]> {
    const warnings: string[] = []

    // Check for common issues
    if (!content.title || content.title.trim().length === 0) {
      warnings.push("Content has no title")
    }

    if (contentType === "blog") {
      const blogPost = content as BlogPost
      if (!blogPost.excerpt || blogPost.excerpt.trim().length === 0) {
        warnings.push("Blog post has no excerpt")
      }
      if (!blogPost.tags || blogPost.tags.length === 0) {
        warnings.push("Blog post has no tags")
      }
    } else {
      const project = content as Project
      if (!project.description || project.description.trim().length === 0) {
        warnings.push("Project has no description")
      }
      if (!project.technologies || project.technologies.length === 0) {
        warnings.push("Project has no technologies listed")
      }
    }

    if (!content.seo?.description) {
      warnings.push("Content has no SEO description")
    }

    return warnings
  }

  private cleanupCache(): void {
    const now = Date.now()

    for (const [key, value] of this.contentCache.entries()) {
      const age = now - value.lastFetched.getTime()
      if (age > this.CACHE_TTL * 2) {
        // Remove entries older than 2x TTL
        this.contentCache.delete(key)
      }
    }
  }

  async preloadContent(
    tokens: string[],
    options?: ResolverOptions
  ): Promise<Array<{ token: string; success: boolean; error?: string }>> {
    const results = await Promise.all(
      tokens.map(async token => {
        try {
          const result = await this.resolveContent(token, undefined, options)
          return {
            token,
            success: result.success,
            error: result.error,
          }
        } catch (error) {
          return {
            token,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          }
        }
      })
    )

    return results
  }

  clearCache(): void {
    this.contentCache.clear()
  }

  getCacheStats(): {
    size: number
    entries: Array<{ key: string; lastFetched: Date; contentType: string }>
  } {
    const entries = Array.from(this.contentCache.entries()).map(([key, value]) => ({
      key,
      lastFetched: value.lastFetched,
      contentType: "tags" in value.content ? "blog" : "project",
    }))

    return {
      size: this.contentCache.size,
      entries,
    }
  }
}

export default PreviewContentResolver
