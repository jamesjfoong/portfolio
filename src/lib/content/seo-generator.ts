// SEO metadata generation service
import type { BlogPost, Project } from "@/types/content"

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType: "article" | "website"
  twitterCard: "summary" | "summary_large_image"
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  structuredData?: Record<string, unknown>
}

export interface SEOConfig {
  siteTitle: string
  siteDescription: string
  siteUrl: string
  defaultOgImage: string
  twitterHandle?: string
  authorName?: string
}

export class SEOGenerator {
  private config: SEOConfig

  constructor(config: SEOConfig) {
    this.config = config
  }

  /**
   * Generate SEO metadata for blog posts
   */
  generateBlogPostSEO(blogPost: BlogPost, baseUrl?: string): SEOMetadata {
    const url = baseUrl ? `${baseUrl}/blog/${blogPost.slug}` : undefined

    // Generate optimized title
    const title = this.generateOptimizedTitle(blogPost.title, "Blog")

    // Use excerpt or generate description
    const description =
      blogPost.excerpt ||
      this.generateDescriptionFromContent(blogPost.content) ||
      blogPost.description ||
      this.config.siteDescription

    // Generate keywords from tags and categories
    const keywords = this.generateKeywords(blogPost.tags, blogPost.categories)

    // Structured data for blog post
    const structuredData = this.generateBlogPostStructuredData(blogPost, url)

    return {
      title,
      description: this.optimizeDescription(description),
      keywords,
      canonicalUrl: url,
      ogTitle: title,
      ogDescription: this.optimizeDescription(description, 300),
      ogImage: blogPost.ogImage || this.config.defaultOgImage,
      ogType: "article",
      twitterCard: blogPost.ogImage ? "summary_large_image" : "summary",
      twitterTitle: this.truncateText(title, 70),
      twitterDescription: this.optimizeDescription(description, 200),
      twitterImage: blogPost.ogImage || this.config.defaultOgImage,
      structuredData,
    }
  }

  /**
   * Generate SEO metadata for projects
   */
  generateProjectSEO(project: Project, baseUrl?: string): SEOMetadata {
    const url = baseUrl ? `${baseUrl}/projects/${project.slug}` : undefined

    // Generate optimized title
    const title = this.generateOptimizedTitle(project.title, "Project")

    // Use description or generate from content
    const description =
      project.description || this.generateDescriptionFromContent(project.content) || this.config.siteDescription

    // Generate keywords from technologies and project info
    const keywords = this.generateProjectKeywords(project)

    // Structured data for project
    const structuredData = this.generateProjectStructuredData(project, url)

    return {
      title,
      description: this.optimizeDescription(description),
      keywords,
      canonicalUrl: url,
      ogTitle: title,
      ogDescription: this.optimizeDescription(description, 300),
      ogImage: project.images?.[0] || this.config.defaultOgImage,
      ogType: "website",
      twitterCard: project.images?.length ? "summary_large_image" : "summary",
      twitterTitle: this.truncateText(title, 70),
      twitterDescription: this.optimizeDescription(description, 200),
      twitterImage: project.images?.[0] || this.config.defaultOgImage,
      structuredData,
    }
  }

  /**
   * Generate homepage SEO metadata
   */
  generateHomepageSEO(): SEOMetadata {
    return {
      title: this.config.siteTitle,
      description: this.config.siteDescription,
      keywords: ["portfolio", "web developer", "software engineer", "next.js", "react"],
      canonicalUrl: this.config.siteUrl,
      ogTitle: this.config.siteTitle,
      ogDescription: this.config.siteDescription,
      ogImage: this.config.defaultOgImage,
      ogType: "website",
      twitterCard: "summary_large_image",
      twitterTitle: this.config.siteTitle,
      twitterDescription: this.config.siteDescription,
      twitterImage: this.config.defaultOgImage,
      structuredData: this.generatePersonStructuredData(),
    }
  }

  /**
   * Generate optimized page title
   */
  private generateOptimizedTitle(contentTitle: string, contentType?: string): string {
    // Ensure title is within SEO best practices (50-60 characters)
    const maxLength = 60
    const siteName = this.config.siteTitle
    const separator = " | "

    // If content title is too long, truncate it
    const availableSpace = maxLength - siteName.length - separator.length
    let optimizedTitle = contentTitle

    if (contentTitle.length > availableSpace) {
      optimizedTitle = this.truncateText(contentTitle, availableSpace)
    }

    // Add content type if space allows
    if (contentType && optimizedTitle.length + contentType.length + 3 < availableSpace) {
      optimizedTitle = `${contentType}: ${optimizedTitle}`
    }

    return `${optimizedTitle}${separator}${siteName}`
  }

  /**
   * Optimize description for SEO
   */
  private optimizeDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) {
      return description
    }

    // Find the last complete sentence or word within the limit
    const truncated = description.substring(0, maxLength)
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

  /**
   * Generate description from content
   */
  private generateDescriptionFromContent(content: string): string {
    if (!content) return ""

    // Remove markdown formatting and HTML
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // Remove headings
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // Remove images
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .trim()

    // Return first 160 characters as description
    return this.optimizeDescription(plainText, 160)
  }

  /**
   * Generate keywords from tags and categories
   */
  private generateKeywords(tags?: string[], categories?: string[]): string[] {
    const keywords: string[] = []

    if (tags) {
      keywords.push(...tags)
    }

    if (categories) {
      keywords.push(...categories)
    }

    // Add some default portfolio-related keywords
    keywords.push("web development", "portfolio")

    // Remove duplicates and limit to 10 keywords
    return [...new Set(keywords)].slice(0, 10)
  }

  /**
   * Generate project-specific keywords
   */
  private generateProjectKeywords(project: Project): string[] {
    const keywords: string[] = []

    if (project.technologies) {
      keywords.push(...project.technologies)
    }

    // Add project-specific keywords
    keywords.push("project", "portfolio", "web development")

    // Add keywords from project title and description
    const titleWords = project.title
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
    keywords.push(...titleWords)

    // Remove duplicates and limit
    return [...new Set(keywords)].slice(0, 10)
  }

  /**
   * Generate structured data for blog posts
   */
  private generateBlogPostStructuredData(blogPost: BlogPost, url?: string): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blogPost.title,
      description: blogPost.excerpt || blogPost.description,
      url,
      datePublished: blogPost.publishDate.toISOString(),
      dateModified: blogPost.lastModified.toISOString(),
      author: {
        "@type": "Person",
        name: blogPost.author || this.config.authorName || "Portfolio Author",
      },
      publisher: {
        "@type": "Person",
        name: this.config.authorName || "Portfolio Author",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      image: blogPost.ogImage || this.config.defaultOgImage,
      keywords: blogPost.tags?.join(", "),
    }
  }

  /**
   * Generate structured data for projects
   */
  private generateProjectStructuredData(project: Project, url?: string): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url,
      creator: {
        "@type": "Person",
        name: this.config.authorName || "Portfolio Author",
      },
      dateCreated: project.publishDate.toISOString(),
      dateModified: project.lastModified.toISOString(),
      image: project.images?.[0] || this.config.defaultOgImage,
      keywords: project.technologies?.join(", "),
      ...(project.projectLinks?.demo && { sameAs: project.projectLinks.demo }),
    }
  }

  /**
   * Generate structured data for person/portfolio
   */
  private generatePersonStructuredData(): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: this.config.authorName || "Portfolio Author",
      url: this.config.siteUrl,
      image: this.config.defaultOgImage,
      description: this.config.siteDescription,
      jobTitle: "Web Developer",
      knowsAbout: ["Web Development", "JavaScript", "TypeScript", "React", "Next.js"],
    }
  }

  /**
   * Truncate text to specified length
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text
    }

    const truncated = text.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(" ")

    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace)
    }

    return truncated
  }
}

// Default SEO configuration
const defaultSEOConfig: SEOConfig = {
  siteTitle: "Portfolio",
  siteDescription: "Professional web developer portfolio showcasing projects and blog posts",
  siteUrl: "https://yourportfolio.com",
  defaultOgImage: "/images/og-default.jpg",
  authorName: "Your Name",
}

// Export configured instance
export const seoGenerator = new SEOGenerator(defaultSEOConfig)
