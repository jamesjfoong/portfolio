export interface ContentMetadata {
  title?: string
  description?: string
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
  category?: string
  featured?: boolean
}

export interface ContentData {
  content: string
  metadata: ContentMetadata
  slug: string
}

export interface ContentError {
  code: "NOT_FOUND" | "PARSE_ERROR" | "READ_ERROR"
  message: string
  slug?: string
  type?: "projects" | "blog"
}

export type ContentResult<T = ContentData> = { success: true; data: T } | { success: false; error: ContentError }
