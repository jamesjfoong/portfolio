import { CacheManager } from "@/lib/cache/cache-manager"

import type { BlogPost, Project } from "@/types/content"
import type { SearchDocument, SearchIndex } from "@/types/search"

export interface IndexingOptions {
  includeContent: boolean
  includeExcerpts: boolean
  maxContentLength: number
  stemming: boolean
}

export interface IndexStats {
  totalDocuments: number
  blogPosts: number
  projects: number
  lastUpdated: string
  indexSize: number
}

export class ContentIndexer {
  private cacheManager: CacheManager
  private readonly INDEX_CACHE_KEY = "search:index"
  private readonly STATS_CACHE_KEY = "search:stats"
  private readonly DEFAULT_OPTIONS: IndexingOptions = {
    includeContent: true,
    includeExcerpts: true,
    maxContentLength: 10000,
    stemming: true,
  }

  constructor() {
    this.cacheManager = new CacheManager()
  }

  async indexContent(content: (BlogPost | Project)[], options: Partial<IndexingOptions> = {}): Promise<IndexStats> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }
    const documents: SearchDocument[] = []

    let blogCount = 0
    let projectCount = 0

    for (const item of content) {
      const doc = this.createSearchDocument(item, opts)
      if (doc) {
        documents.push(doc)
        if ("tags" in item) blogCount++
        else projectCount++
      }
    }

    // Create search index
    const index: SearchIndex = {
      documents,
      metadata: {
        created: new Date().toISOString(),
        documentCount: documents.length,
        options: opts,
      },
    }

    // Store index in cache
    await this.cacheManager.set(this.INDEX_CACHE_KEY, index, 24 * 60 * 60 * 1000) // 24 hours

    // Store stats
    const stats: IndexStats = {
      totalDocuments: documents.length,
      blogPosts: blogCount,
      projects: projectCount,
      lastUpdated: new Date().toISOString(),
      indexSize: JSON.stringify(index).length,
    }

    await this.cacheManager.set(this.STATS_CACHE_KEY, stats, 24 * 60 * 60 * 1000)

    return stats
  }

  private createSearchDocument(content: BlogPost | Project, options: IndexingOptions): SearchDocument | null {
    try {
      // Determine content type
      const type = "tags" in content ? "blog" : "project"

      // Extract searchable text
      const title = content.title || ""
      const description = content.description || ("excerpt" in content ? content.excerpt : "") || ""

      let bodyContent = ""
      if (options.includeContent && content.content) {
        bodyContent = this.extractTextFromHtml(content.content)
        if (bodyContent.length > options.maxContentLength) {
          bodyContent = `${bodyContent.substring(0, options.maxContentLength)}...`
        }
      }

      // Create searchable text by combining all text fields
      const searchableText = [title, description, bodyContent].filter(Boolean).join(" ").toLowerCase().trim()

      if (!searchableText) {
        return null // Skip empty documents
      }

      // Extract keywords/tags
      const keywords = this.extractKeywords(content, type)

      // Create document
      const document: SearchDocument = {
        id: content.slug,
        type,
        title,
        description,
        content: options.includeContent ? bodyContent : undefined,
        excerpt: options.includeExcerpts ? this.createExcerpt(bodyContent || description, 200) : undefined,
        keywords,
        searchableText,
        wordCount: searchableText.split(/\s+/).length,
        publishDate: content.publishDate,
        lastModified: content.lastModified,
        url: type === "blog" ? `/blog/${content.slug}` : `/projects/${content.slug}`,
        boost: this.calculateBoost(content, type),
      }

      return document
    } catch (error) {
      console.warn(`Failed to index ${content.slug}:`, error)
      return null
    }
  }

  private extractTextFromHtml(html: string): string {
    // Remove HTML tags and decode entities
    return html
      .replace(/<[^>]*>/g, " ") // Remove HTML tags
      .replace(/&[^;]+;/g, " ") // Remove HTML entities
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
  }

  private extractKeywords(content: BlogPost | Project, type: "blog" | "project"): string[] {
    const keywords: string[] = []

    if (type === "blog") {
      const blogPost = content as BlogPost
      if (blogPost.tags) {
        keywords.push(...blogPost.tags)
      }
      if (blogPost.author) {
        keywords.push(blogPost.author)
      }
    } else {
      const project = content as Project
      if (project.technologies) {
        keywords.push(...project.technologies)
      }
      if (project.completionStatus) {
        keywords.push(project.completionStatus)
      }
    }

    // Add SEO keywords if available
    if (content.seo?.keywords) {
      keywords.push(...content.seo.keywords)
    }

    return [...new Set(keywords.map(k => k.toLowerCase()))]
  }

  private createExcerpt(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text
    }

    // Find the last complete word within the limit
    const truncated = text.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(" ")

    return lastSpaceIndex > maxLength * 0.8 ? `${truncated.substring(0, lastSpaceIndex)}...` : `${truncated}...`
  }

  private calculateBoost(content: BlogPost | Project, type: "blog" | "project"): number {
    let boost = 1.0

    // Boost recent content
    const age = Date.now() - new Date(content.publishDate).getTime()
    const daysOld = age / (1000 * 60 * 60 * 24)

    if (daysOld < 30) boost += 0.5
    else if (daysOld < 90) boost += 0.2

    // Boost longer content
    if (content.wordCount && content.wordCount > 1000) {
      boost += 0.3
    }

    // Type-specific boosts
    if (type === "blog") {
      const blogPost = content as BlogPost
      // Boost posts with more tags
      if (blogPost.tags && blogPost.tags.length > 3) {
        boost += 0.2
      }
    } else {
      const project = content as Project
      // Boost completed projects
      if (project.completionStatus === "completed") {
        boost += 0.3
      }
      // Boost projects with demo links
      if (project.projectLinks?.demo) {
        boost += 0.2
      }
    }

    return Math.round(boost * 100) / 100 // Round to 2 decimal places
  }

  async getIndex(): Promise<SearchIndex | null> {
    try {
      return await this.cacheManager.get<SearchIndex>(this.INDEX_CACHE_KEY)
    } catch {
      return null
    }
  }

  async getStats(): Promise<IndexStats | null> {
    try {
      return await this.cacheManager.get<IndexStats>(this.STATS_CACHE_KEY)
    } catch {
      return null
    }
  }

  async addDocument(content: BlogPost | Project, options?: Partial<IndexingOptions>): Promise<void> {
    const index = await this.getIndex()
    if (!index) {
      // If no index exists, create a new one with just this document
      await this.indexContent([content], options)
      return
    }

    const opts = { ...this.DEFAULT_OPTIONS, ...options }
    const document = this.createSearchDocument(content, opts)

    if (!document) return

    // Remove existing document with same ID if it exists
    index.documents = index.documents.filter(doc => doc.id !== document.id)

    // Add new document
    index.documents.push(document)

    // Update metadata
    index.metadata.documentCount = index.documents.length

    // Save updated index
    await this.cacheManager.set(this.INDEX_CACHE_KEY, index, 24 * 60 * 60 * 1000)

    // Update stats
    const stats = await this.getStats()
    if (stats) {
      stats.totalDocuments = index.documents.length
      stats.lastUpdated = new Date().toISOString()
      stats.indexSize = JSON.stringify(index).length

      await this.cacheManager.set(this.STATS_CACHE_KEY, stats, 24 * 60 * 60 * 1000)
    }
  }

  async removeDocument(id: string): Promise<void> {
    const index = await this.getIndex()
    if (!index) return

    // Remove document
    const originalCount = index.documents.length
    index.documents = index.documents.filter(doc => doc.id !== id)

    if (index.documents.length === originalCount) {
      return // Document wasn't found
    }

    // Update metadata
    index.metadata.documentCount = index.documents.length

    // Save updated index
    await this.cacheManager.set(this.INDEX_CACHE_KEY, index, 24 * 60 * 60 * 1000)

    // Update stats
    const stats = await this.getStats()
    if (stats) {
      stats.totalDocuments = index.documents.length
      stats.lastUpdated = new Date().toISOString()
      stats.indexSize = JSON.stringify(index).length

      await this.cacheManager.set(this.STATS_CACHE_KEY, stats, 24 * 60 * 60 * 1000)
    }
  }

  async clearIndex(): Promise<void> {
    await this.cacheManager.delete(this.INDEX_CACHE_KEY)
    await this.cacheManager.delete(this.STATS_CACHE_KEY)
  }

  async rebuildIndex(content: (BlogPost | Project)[], options?: Partial<IndexingOptions>): Promise<IndexStats> {
    await this.clearIndex()
    return this.indexContent(content, options)
  }
}

export default ContentIndexer
