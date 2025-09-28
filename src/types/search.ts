// Search system types

export interface SearchResult {
  id: string
  type: "blog" | "project"
  slug: string
  title: string
  excerpt?: string
  description?: string
  publishDate: Date
  lastModified: Date
  url: string

  // Search-specific fields
  relevanceScore: number
  matchType: "title" | "content" | "tags" | "categories" | "description"
  highlights: {
    title?: string
    content?: string
    excerpt?: string
  }

  // Content metadata
  tags?: string[]
  categories?: string[]
  technologies?: string[]
  author?: string
  readingTime?: number
  wordCount?: number
}

export interface SearchQuery {
  query: string
  filters?: {
    type?: "blog" | "project" | "all"
    tags?: string[]
    categories?: string[]
    technologies?: string[]
    author?: string
    dateRange?: {
      from?: Date
      to?: Date
    }
    published?: boolean
  }
  sort?: {
    field: "relevance" | "date" | "title" | "readingTime"
    order: "asc" | "desc"
  }
  pagination: {
    page: number
    limit: number
  }
}

export interface SearchResponse {
  results: SearchResult[]
  meta: {
    query: string
    totalResults: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    searchTime: number // milliseconds
    filters: SearchQuery["filters"]
  }
  suggestions?: string[]
  facets?: {
    types: Array<{ value: string; count: number }>
    tags: Array<{ value: string; count: number }>
    categories: Array<{ value: string; count: number }>
    technologies: Array<{ value: string; count: number }>
    authors: Array<{ value: string; count: number }>
  }
}

export interface SearchIndex {
  id: string
  type: "blog" | "project"
  slug: string
  title: string
  content: string
  excerpt?: string
  description?: string
  tags: string[]
  categories: string[]
  technologies: string[]
  author?: string
  publishDate: Date
  lastModified: Date
  wordCount: number
  url: string

  // Search optimization fields
  titleTokens: string[]
  contentTokens: string[]
  allTokens: string[]
  searchableText: string // Combined searchable content
}

export interface SearchIndexStats {
  totalDocuments: number
  totalTokens: number
  averageDocumentLength: number
  lastUpdated: Date
  indexSize: number // bytes

  breakdown: {
    blog: { count: number; avgLength: number }
    project: { count: number; avgLength: number }
  }
}

export interface SearchConfig {
  minQueryLength: number
  maxResults: number
  defaultLimit: number
  highlightLength: number
  enableFacets: boolean
  enableSuggestions: boolean

  indexing: {
    batchSize: number
    updateThreshold: number // seconds since last update
    stopWords: string[]
    minTokenLength: number
  }

  relevanceWeights: {
    title: number
    content: number
    tags: number
    categories: number
    exact: number
    partial: number
  }
}

export interface SearchAnalytics {
  query: string
  timestamp: Date
  resultCount: number
  searchTime: number
  filters?: SearchQuery["filters"]
  userAgent?: string
  clickedResults?: string[] // result IDs that were clicked
}
