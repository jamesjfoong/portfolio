import { cache } from "react"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"

import fs from "fs"
import matter from "gray-matter"
import path from "path"

import type { ContentData, ContentMetadata, ContentResult } from "@/types/content"

export interface SerializedMDXContent extends ContentData {
  serialized: MDXRemoteSerializeResult
}

const CONTENT_DIR = path.join(process.cwd(), "src/content")

/**
 * Parses frontmatter from markdown content using gray-matter
 * @param content - The full markdown content
 * @returns Parsed frontmatter and content without frontmatter
 */
function parseFrontmatter(content: string): { metadata: ContentMetadata; content: string } {
  try {
    const { data, content: parsedContent } = matter(content)

    // Type-safe assignment of frontmatter data
    const metadata: ContentMetadata = {}

    if (data.title && typeof data.title === "string") metadata.title = data.title
    if (data.description && typeof data.description === "string") metadata.description = data.description
    if (data.publishedAt && typeof data.publishedAt === "string") metadata.publishedAt = data.publishedAt
    if (data.updatedAt && typeof data.updatedAt === "string") metadata.updatedAt = data.updatedAt
    if (data.category && typeof data.category === "string") metadata.category = data.category
    if (typeof data.featured === "boolean") metadata.featured = data.featured
    if (Array.isArray(data.tags)) metadata.tags = data.tags.filter((tag): tag is string => typeof tag === "string")

    return { metadata, content: parsedContent }
  } catch {
    // eslint-disable-next-line no-console
    console.warn("Failed to parse frontmatter")
    return { metadata: {}, content }
  }
}

/**
 * Retrieves and parses MDX content for a given type and slug
 * @param type - Content type ('projects' | 'blog')
 * @param slug - Content slug
 * @returns ContentResult with either success data or error
 */
export const getMDXContent = cache(async (type: "projects" | "blog", slug: string): Promise<ContentResult> => {
  try {
    // Validate input
    if (!slug || slug.trim() === "") {
      return {
        success: false,
        error: {
          code: "READ_ERROR",
          message: "Invalid slug provided",
          slug,
          type,
        },
      }
    }

    const filePath = path.join(CONTENT_DIR, type, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Content file not found: ${slug}.mdx`,
          slug,
          type,
        },
      }
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    const { metadata, content } = parseFrontmatter(fileContent)

    // Serialize the MDX content
    const serialized = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    })

    return {
      success: true,
      data: {
        content,
        metadata,
        slug,
        serialized,
      } as SerializedMDXContent,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    // eslint-disable-next-line no-console
    console.error(`Error reading MDX file for ${slug}:`, error)

    return {
      success: false,
      error: {
        code: "READ_ERROR",
        message: `Failed to read content: ${errorMessage}`,
        slug,
        type,
      },
    }
  }
})

export const listMDXFiles = cache((type: "projects" | "blog"): string[] => {
  try {
    const dirPath = path.join(CONTENT_DIR, type)

    if (!fs.existsSync(dirPath)) {
      return []
    }

    return fs
      .readdirSync(dirPath)
      .filter(file => file.endsWith(".mdx"))
      .map(file => file.replace(".mdx", ""))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error listing MDX files for ${type}:`, error)
    return []
  }
})
