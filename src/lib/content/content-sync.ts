// Content synchronization service
import type { BlogPost, GitHubContentMetadata, Project } from "@/types/content"

import { memoryCache } from "../cache/memory-cache"
import type { GitHubClient } from "../github/client"
import { contentValidator } from "./content-validator"
import { markdownParser } from "./markdown-parser"

export interface SyncOptions {
  forceRefresh?: boolean
  skipValidation?: boolean
  dryRun?: boolean
}

export interface SyncResult {
  success: boolean
  itemsSynced: number
  itemsSkipped: number
  errors: string[]
  warnings: string[]
  syncedItems: Array<{
    slug: string
    type: "blog" | "project"
    action: "created" | "updated" | "skipped"
  }>
}

export interface ContentSyncConfig {
  blogPath: string
  projectPath: string
  cacheKeyPrefix: string
  cacheTTL: number // Cache time-to-live in milliseconds
}

class ContentSyncService {
  private config: ContentSyncConfig
  private githubClient: GitHubClient

  constructor(config: ContentSyncConfig, githubClient: GitHubClient) {
    this.config = config
    this.githubClient = githubClient
  }

  /**
   * Sync all content from GitHub
   */
  async syncAllContent(options: SyncOptions = {}): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      itemsSynced: 0,
      itemsSkipped: 0,
      errors: [],
      warnings: [],
      syncedItems: [],
    }

    try {
      // Sync blog posts
      const blogResult = await this.syncBlogPosts(options)
      this.mergeSyncResults(result, blogResult)

      // Sync projects
      const projectResult = await this.syncProjects(options)
      this.mergeSyncResults(result, projectResult)

      // Update overall success status
      result.success = result.errors.length === 0

      return result
    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : "Unknown sync error")
      return result
    }
  }

  /**
   * Sync blog posts from GitHub
   */
  async syncBlogPosts(options: SyncOptions = {}): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      itemsSynced: 0,
      itemsSkipped: 0,
      errors: [],
      warnings: [],
      syncedItems: [],
    }

    try {
      // List all markdown files in blog directory
      const blogFiles = await this.githubClient.fetchRepositoryContents(this.config.blogPath)
      const markdownFiles = blogFiles.filter(
        (file: { name: string; type: string }) =>
          file.type === "file" && (file.name.endsWith(".md") || file.name.endsWith(".mdx"))
      )

      for (const file of markdownFiles) {
        try {
          const syncItemResult = await this.syncBlogPost(file.path, options)
          if (syncItemResult) {
            result.itemsSynced++
            result.syncedItems.push({
              slug: this.extractSlugFromPath(file.path),
              type: "blog",
              action: syncItemResult.action,
            })
          } else {
            result.itemsSkipped++
            result.syncedItems.push({
              slug: this.extractSlugFromPath(file.path),
              type: "blog",
              action: "skipped",
            })
          }
        } catch (error) {
          result.errors.push(
            `Error syncing blog post ${file.path}: ${error instanceof Error ? error.message : "Unknown error"}`
          )
        }
      }

      return result
    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : "Failed to sync blog posts")
      return result
    }
  }

  /**
   * Sync projects from GitHub
   */
  async syncProjects(options: SyncOptions = {}): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      itemsSynced: 0,
      itemsSkipped: 0,
      errors: [],
      warnings: [],
      syncedItems: [],
    }

    try {
      // List all markdown files in projects directory
      const projectFiles = await this.githubClient.fetchRepositoryContents(this.config.projectPath)
      const markdownFiles = projectFiles.filter(
        (file: { name: string; type: string }) =>
          file.type === "file" && (file.name.endsWith(".md") || file.name.endsWith(".mdx"))
      )

      for (const file of markdownFiles) {
        try {
          const syncItemResult = await this.syncProject(file.path, options)
          if (syncItemResult) {
            result.itemsSynced++
            result.syncedItems.push({
              slug: this.extractSlugFromPath(file.path),
              type: "project",
              action: syncItemResult.action,
            })
          } else {
            result.itemsSkipped++
            result.syncedItems.push({
              slug: this.extractSlugFromPath(file.path),
              type: "project",
              action: "skipped",
            })
          }
        } catch (error) {
          result.errors.push(
            `Error syncing project ${file.path}: ${error instanceof Error ? error.message : "Unknown error"}`
          )
        }
      }

      return result
    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : "Failed to sync projects")
      return result
    }
  }

  /**
   * Sync individual blog post
   */
  private async syncBlogPost(
    filePath: string,
    options: SyncOptions = {}
  ): Promise<{ action: "created" | "updated" } | null> {
    const cacheKey = `${this.config.cacheKeyPrefix}:blog:${filePath}`
    const slug = this.extractSlugFromPath(filePath)

    // Check if we need to sync this file
    if (!options.forceRefresh) {
      const cached = memoryCache.get<BlogPost>(cacheKey)
      if (cached) {
        // Check if file was modified since last sync
        const fileContent = await this.githubClient.fetchFileContent(filePath)
        if (cached.contentHash === fileContent.sha) {
          return null // Skip - no changes
        }
      }
    }

    if (options.dryRun) {
      return { action: "updated" } // Simulate action
    }

    // Fetch and parse content
    const githubContent = await this.githubClient.fetchFileContent(filePath)
    const metadata = await markdownParser.parseMarkdown(githubContent.content, filePath)
    const htmlContent = await markdownParser.markdownToHtml(githubContent.content.split("---").slice(2).join("---"))

    // Create BlogPost object
    const blogPost = this.createBlogPostFromMetadata(slug, filePath, htmlContent, metadata)

    // Set content hash from GitHub
    blogPost.contentHash = githubContent.sha

    // Validate content
    if (!options.skipValidation) {
      const validation = contentValidator.validateBlogPost(blogPost, metadata)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`)
      }
    }

    // Cache the result
    memoryCache.set(cacheKey, blogPost, this.config.cacheTTL)

    // Determine if this was a create or update
    const existingPost = memoryCache.get<BlogPost>(cacheKey)
    return { action: existingPost ? "updated" : "created" }
  }

  /**
   * Sync individual project
   */
  private async syncProject(
    filePath: string,
    options: SyncOptions = {}
  ): Promise<{ action: "created" | "updated" } | null> {
    const cacheKey = `${this.config.cacheKeyPrefix}:project:${filePath}`
    const slug = this.extractSlugFromPath(filePath)

    // Check if we need to sync this file
    if (!options.forceRefresh) {
      const cached = memoryCache.get<Project>(cacheKey)
      if (cached) {
        // Check if file was modified since last sync
        const fileContent = await this.githubClient.fetchFileContent(filePath)
        if (cached.contentHash === fileContent.sha) {
          return null // Skip - no changes
        }
      }
    }

    if (options.dryRun) {
      return { action: "updated" } // Simulate action
    }

    // Fetch and parse content
    const githubContent = await this.githubClient.fetchFileContent(filePath)
    const metadata = await markdownParser.parseMarkdown(githubContent.content, filePath)
    const htmlContent = await markdownParser.markdownToHtml(githubContent.content.split("---").slice(2).join("---"))

    // Create Project object
    const project = this.createProjectFromMetadata(slug, filePath, htmlContent, metadata)

    // Set content hash from GitHub
    project.contentHash = githubContent.sha

    // Validate content
    if (!options.skipValidation) {
      const validation = contentValidator.validateProject(project, metadata)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`)
      }
    }

    // Cache the result
    memoryCache.set(cacheKey, project, this.config.cacheTTL)

    // Determine if this was a create or update
    const existingProject = memoryCache.get<Project>(cacheKey)
    return { action: existingProject ? "updated" : "created" }
  }

  /**
   * Create BlogPost from parsed metadata
   */
  private createBlogPostFromMetadata(
    slug: string,
    filePath: string,
    content: string,
    metadata: GitHubContentMetadata
  ): BlogPost {
    const now = new Date()

    return {
      slug,
      filePath,
      title: (metadata.frontmatter.title as string) || slug,
      content,
      excerpt: metadata.frontmatter.description as string,
      published: (metadata.frontmatter.published as boolean) ?? true,
      publishDate: metadata.frontmatter.date ? new Date(metadata.frontmatter.date as string) : now,
      lastModified: now,
      tags: (metadata.frontmatter.tags as string[]) || [],
      categories: (metadata.frontmatter.categories as string[]) || [],
      author: metadata.frontmatter.author as string,
      description: metadata.frontmatter.description as string,
      ogImage: metadata.frontmatter.ogImage as string,
      contentHash: "", // Will be set by sync process
      syncTimestamp: now,
      validationStatus: "valid",
    }
  }

  /**
   * Create Project from parsed metadata
   */
  private createProjectFromMetadata(
    slug: string,
    filePath: string,
    content: string,
    metadata: GitHubContentMetadata
  ): Project {
    const now = new Date()

    return {
      slug,
      filePath,
      title: (metadata.frontmatter.title as string) || slug,
      description: (metadata.frontmatter.description as string) || "",
      content,
      published: (metadata.frontmatter.published as boolean) ?? true,
      publishDate: metadata.frontmatter.date ? new Date(metadata.frontmatter.date as string) : now,
      lastModified: now,
      completionStatus: (metadata.frontmatter.status as "completed" | "in-progress" | "archived") || "completed",
      technologies: (metadata.frontmatter.technologies as string[]) || [],
      projectLinks: {
        demo: metadata.frontmatter.demo as string,
        repository: metadata.frontmatter.repository as string,
        documentation: metadata.frontmatter.documentation as string,
      },
      images: (metadata.frontmatter.images as string[]) || [],
      displayPriority: (metadata.frontmatter.priority as number) || 0,
      contentHash: "", // Will be set by sync process
      syncTimestamp: now,
      validationStatus: "valid",
    }
  }

  /**
   * Extract slug from file path
   */
  private extractSlugFromPath(filePath: string): string {
    const filename = filePath.split("/").pop() || ""
    return filename.replace(/\.(md|mdx)$/, "")
  }

  /**
   * Merge sync results
   */
  private mergeSyncResults(target: SyncResult, source: SyncResult): void {
    target.itemsSynced += source.itemsSynced
    target.itemsSkipped += source.itemsSkipped
    target.errors.push(...source.errors)
    target.warnings.push(...source.warnings)
    target.syncedItems.push(...source.syncedItems)
  }
}

// Default configuration
const defaultConfig: ContentSyncConfig = {
  blogPath: "content/blog",
  projectPath: "content/projects",
  cacheKeyPrefix: "content-sync",
  cacheTTL: 1000 * 60 * 15, // 15 minutes
}

// Export the service class and default config for manual instantiation
export { ContentSyncService, defaultConfig }
