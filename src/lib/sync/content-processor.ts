import { CacheManager } from "@/lib/cache/cache-manager"
import { ContentValidator } from "@/lib/content/content-validator"
import { MarkdownParser } from "@/lib/content/markdown-parser"

import type { BlogPost, Project } from "@/types/content"

import type { FileChange } from "./change-detector"
import { ChangeDetector } from "./change-detector"

export type ProcessingAction = "add" | "update" | "delete"

export interface ProcessingResult {
  success: boolean
  path: string
  action: ProcessingAction
  contentType?: "blog" | "project" | "other"
  errors?: string[]
  warnings?: string[]
}

export class ContentProcessor {
  private markdownParser: MarkdownParser
  private contentValidator: ContentValidator
  private cacheManager: CacheManager
  private changeDetector: ChangeDetector

  constructor() {
    this.markdownParser = new MarkdownParser()
    this.contentValidator = new ContentValidator()
    this.cacheManager = new CacheManager()
    this.changeDetector = new ChangeDetector()
  }

  async processFile(file: FileChange, action: ProcessingAction): Promise<ProcessingResult> {
    const result: ProcessingResult = {
      success: false,
      path: file.path,
      action,
      errors: [],
      warnings: [],
    }

    try {
      // Determine content type
      result.contentType = this.getContentType(file.path)

      switch (action) {
        case "add":
        case "update":
          await this.processFileContent(file, result)
          break
        case "delete":
          await this.processFileDeletion(file, result)
          break
        default:
          throw new Error(`Unknown processing action: ${action}`)
      }

      result.success = (result.errors?.length || 0) === 0
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      result.errors = result.errors || []
      result.errors.push(errorMessage)
      result.success = false
    }

    return result
  }

  private async processFileContent(file: FileChange, result: ProcessingResult): Promise<void> {
    // Get file content
    const content = await this.changeDetector.getFileContent(file.path)

    if (!content) {
      throw new Error(`Failed to fetch content for ${file.path}`)
    }

    // Parse content based on type
    switch (result.contentType) {
      case "blog":
        await this.processBlogPost(file, content, result)
        break
      case "project":
        await this.processProject(file, content, result)
        break
      default:
        await this.processGenericContent(file, content, result)
        break
    }
  }

  private async processBlogPost(file: FileChange, content: string, result: ProcessingResult): Promise<void> {
    try {
      // Parse markdown
      const parsed = await this.markdownParser.parse(content)

      // Create blog post object
      const blogPost: Partial<BlogPost> = {
        slug: this.extractSlug(file.path),
        title: parsed.frontmatter.title,
        content: parsed.html,
        excerpt: parsed.excerpt,
        publishDate: parsed.frontmatter.publishDate || new Date().toISOString(),
        lastModified: file.lastModified.toISOString(),
        tags: parsed.frontmatter.tags || [],
        author: parsed.frontmatter.author,
        featuredImage: parsed.frontmatter.featuredImage,
        wordCount: parsed.wordCount,
        readingTime: Math.ceil(parsed.wordCount / 200), // ~200 words per minute
        seo: {
          title: parsed.frontmatter.seoTitle || parsed.frontmatter.title,
          description: parsed.frontmatter.seoDescription || parsed.excerpt,
          keywords: parsed.frontmatter.keywords || parsed.frontmatter.tags || [],
        },
      }

      // Validate blog post
      const validation = await this.contentValidator.validateBlogPost(blogPost as BlogPost)
      if (!validation.isValid) {
        result.errors?.push(...validation.errors)
        result.warnings?.push(...validation.warnings)
      }

      // Cache processed content
      await this.cacheContent("blog", blogPost.slug!, blogPost)
    } catch (error) {
      throw new Error(`Failed to process blog post ${file.path}: ${error}`)
    }
  }

  private async processProject(file: FileChange, content: string, result: ProcessingResult): Promise<void> {
    try {
      // Parse markdown
      const parsed = await this.markdownParser.parse(content)

      // Create project object
      const project: Partial<Project> = {
        slug: this.extractSlug(file.path),
        title: parsed.frontmatter.title,
        description: parsed.frontmatter.description,
        content: parsed.html,
        publishDate: parsed.frontmatter.publishDate || new Date().toISOString(),
        lastModified: file.lastModified.toISOString(),
        technologies: parsed.frontmatter.technologies || [],
        completionStatus: parsed.frontmatter.status || "completed",
        featuredImage: parsed.frontmatter.featuredImage,
        images: parsed.frontmatter.images || [],
        projectLinks: {
          demo: parsed.frontmatter.demoUrl,
          repository: parsed.frontmatter.repoUrl,
          documentation: parsed.frontmatter.docsUrl,
        },
        wordCount: parsed.wordCount,
        readingTime: Math.ceil(parsed.wordCount / 200),
        seo: {
          title: parsed.frontmatter.seoTitle || parsed.frontmatter.title,
          description: parsed.frontmatter.seoDescription || parsed.frontmatter.description,
          keywords: parsed.frontmatter.keywords || parsed.frontmatter.technologies || [],
        },
      }

      // Validate project
      const validation = await this.contentValidator.validateProject(project as Project)
      if (!validation.isValid) {
        result.errors?.push(...validation.errors)
        result.warnings?.push(...validation.warnings)
      }

      // Cache processed content
      await this.cacheContent("project", project.slug!, project)
    } catch (error) {
      throw new Error(`Failed to process project ${file.path}: ${error}`)
    }
  }

  private async processGenericContent(file: FileChange, content: string, result: ProcessingResult): Promise<void> {
    try {
      // For generic content, just parse and cache the raw content
      const parsed = await this.markdownParser.parse(content)

      const genericContent = {
        path: file.path,
        content: parsed.html,
        frontmatter: parsed.frontmatter,
        lastModified: file.lastModified.toISOString(),
        wordCount: parsed.wordCount,
      }

      // Cache generic content
      const cacheKey = `generic:${file.path}`
      await this.cacheManager.set(cacheKey, genericContent, 24 * 60 * 60 * 1000) // 24 hours
    } catch (error) {
      throw new Error(`Failed to process generic content ${file.path}: ${error}`)
    }
  }

  private async processFileDeletion(file: FileChange, result: ProcessingResult): Promise<void> {
    try {
      const slug = this.extractSlug(file.path)

      // Remove from caches
      switch (result.contentType) {
        case "blog":
          await this.cacheManager.delete(`blog:${slug}`)
          break
        case "project":
          await this.cacheManager.delete(`project:${slug}`)
          break
        default:
          await this.cacheManager.delete(`generic:${file.path}`)
          break
      }

      // Invalidate list caches
      await this.cacheManager.delete("blog:list")
      await this.cacheManager.delete("projects:list")
    } catch (error) {
      throw new Error(`Failed to process file deletion ${file.path}: ${error}`)
    }
  }

  private getContentType(path: string): "blog" | "project" | "other" {
    if (path.includes("/blog/") || path.includes("/posts/")) {
      return "blog"
    }
    if (path.includes("/projects/")) {
      return "project"
    }
    return "other"
  }

  private extractSlug(path: string): string {
    // Extract filename without extension from path
    const filename = path.split("/").pop() || ""
    return filename.replace(/\.(md|mdx)$/, "")
  }

  private async cacheContent(type: "blog" | "project", slug: string, content: object): Promise<void> {
    const cacheKey = `${type}:${slug}`
    await this.cacheManager.set(cacheKey, content, 24 * 60 * 60 * 1000) // 24 hours

    // Invalidate list caches to ensure fresh data
    await this.cacheManager.delete(`${type}:list`)
  }

  async batchProcess(
    files: FileChange[],
    action: ProcessingAction,
    concurrency: number = 3
  ): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = []

    // Process files in batches to avoid overwhelming the system
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency)
      const batchResults = await Promise.all(batch.map(file => this.processFile(file, action)))
      results.push(...batchResults)
    }

    return results
  }
}

export default ContentProcessor
