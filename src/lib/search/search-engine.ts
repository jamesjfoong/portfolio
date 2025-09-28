import type { SearchDocument, SearchFilters, SearchQuery, SearchResult } from "@/types/search"

import { ContentIndexer } from "./content-indexer"
import { ResultHighlighter } from "./result-highlighter"

export interface SearchOptions {
  limit: number
  offset: number
  highlightResults: boolean
  fuzzyMatching: boolean
  boostRecent: boolean
  minScore: number
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  filters?: SearchFilters
  executionTime: number
  suggestions?: string[]
}

export class SearchEngine {
  private indexer: ContentIndexer
  private highlighter: ResultHighlighter
  private readonly DEFAULT_OPTIONS: SearchOptions = {
    limit: 20,
    offset: 0,
    highlightResults: true,
    fuzzyMatching: true,
    boostRecent: false,
    minScore: 0.1,
  }

  constructor() {
    this.indexer = new ContentIndexer()
    this.highlighter = new ResultHighlighter()
  }

  async search(query: SearchQuery, filters?: SearchFilters, options?: Partial<SearchOptions>): Promise<SearchResponse> {
    const startTime = Date.now()
    const opts = { ...this.DEFAULT_OPTIONS, ...options }

    try {
      // Get search index
      const index = await this.indexer.getIndex()
      if (!index) {
        return this.emptyResponse(query.q, filters, Date.now() - startTime)
      }

      // Prepare search terms
      const searchTerms = this.prepareSearchTerms(query.q)
      if (searchTerms.length === 0) {
        return this.emptyResponse(query.q, filters, Date.now() - startTime)
      }

      // Filter documents by type and other filters
      const documents = this.applyFilters(index.documents, filters)

      // Score and rank documents
      const scoredResults = documents
        .map(doc => this.scoreDocument(doc, searchTerms, opts))
        .filter(result => result.score >= opts.minScore)
        .sort((a, b) => b.score - a.score)

      // Apply pagination
      const total = scoredResults.length
      const paginatedResults = scoredResults.slice(opts.offset, opts.offset + opts.limit)

      // Highlight results if requested
      const results = opts.highlightResults
        ? await Promise.all(
            paginatedResults.map(async result => ({
              ...result,
              highlightedTitle: await this.highlighter.highlight(result.title, searchTerms),
              highlightedExcerpt: result.excerpt
                ? await this.highlighter.highlight(result.excerpt, searchTerms)
                : undefined,
            }))
          )
        : paginatedResults

      return {
        results,
        total,
        query: query.q,
        filters,
        executionTime: Date.now() - startTime,
        suggestions: await this.generateSuggestions(query.q, index.documents),
      }
    } catch (error) {
      console.error("Search error:", error)
      return this.emptyResponse(query.q, filters, Date.now() - startTime)
    }
  }

  private prepareSearchTerms(query: string): string[] {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(term => term.length > 1) // Filter out very short terms
      .map(term => term.replace(/[^\w\s]/g, "")) // Remove special characters
      .filter(term => term.length > 0)
  }

  private applyFilters(documents: SearchDocument[], filters?: SearchFilters): SearchDocument[] {
    let filtered = documents

    if (filters?.type && filters.type !== "all") {
      filtered = filtered.filter(doc => doc.type === filters.type)
    }

    if (filters?.tags && filters.tags.length > 0) {
      filtered = filtered.filter(doc => filters.tags!.some(tag => doc.keywords.includes(tag.toLowerCase())))
    }

    if (filters?.dateRange) {
      const { start, end } = filters.dateRange
      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.publishDate)
        return (!start || docDate >= new Date(start)) && (!end || docDate <= new Date(end))
      })
    }

    if (filters?.author) {
      filtered = filtered.filter(doc => doc.keywords.includes(filters.author!.toLowerCase()))
    }

    return filtered
  }

  private scoreDocument(document: SearchDocument, searchTerms: string[], options: SearchOptions): SearchResult {
    let score = 0
    const matchedTerms: string[] = []
    const matchPositions: Array<{ term: string; position: number; field: string }> = []

    // Title matching (highest weight)
    const titleScore = this.calculateFieldScore(
      document.title.toLowerCase(),
      searchTerms,
      3.0,
      "title",
      matchedTerms,
      matchPositions
    )
    score += titleScore

    // Description matching (medium weight)
    const descriptionScore = this.calculateFieldScore(
      document.description.toLowerCase(),
      searchTerms,
      2.0,
      "description",
      matchedTerms,
      matchPositions
    )
    score += descriptionScore

    // Content matching (lower weight but important for relevance)
    if (document.content) {
      const contentScore = this.calculateFieldScore(
        document.content.toLowerCase(),
        searchTerms,
        1.0,
        "content",
        matchedTerms,
        matchPositions
      )
      score += contentScore
    }

    // Keywords matching (medium weight)
    const keywordScore = this.calculateKeywordScore(document.keywords, searchTerms, matchedTerms)
    score += keywordScore

    // Apply document boost
    score *= document.boost || 1.0

    // Apply recency boost if requested
    if (options.boostRecent) {
      const recencyBoost = this.calculateRecencyBoost(document.publishDate)
      score *= recencyBoost
    }

    // Fuzzy matching for typos (lower score)
    if (options.fuzzyMatching && matchedTerms.length < searchTerms.length) {
      const fuzzyScore = this.calculateFuzzyScore(document.searchableText, searchTerms, matchedTerms)
      score += fuzzyScore * 0.3 // Lower weight for fuzzy matches
    }

    return {
      id: document.id,
      type: document.type,
      title: document.title,
      description: document.description,
      excerpt: document.excerpt,
      url: document.url,
      publishDate: document.publishDate,
      keywords: document.keywords,
      score: Math.round(score * 1000) / 1000, // Round to 3 decimal places
      matchedTerms: [...new Set(matchedTerms)],
      matchPositions,
    }
  }

  private calculateFieldScore(
    fieldText: string,
    searchTerms: string[],
    weight: number,
    fieldName: string,
    matchedTerms: string[],
    matchPositions: Array<{ term: string; position: number; field: string }>
  ): number {
    let fieldScore = 0

    for (const term of searchTerms) {
      const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, "gi")
      const matches = fieldText.match(regex)

      if (matches) {
        matchedTerms.push(term)

        // Base score for the match
        let termScore = matches.length * weight

        // Bonus for exact matches
        const exactMatches = fieldText.match(new RegExp(`\\b${this.escapeRegex(term)}\\b`, "g"))
        if (exactMatches) {
          termScore *= 1.2
        }

        // Position bonus (earlier matches get higher scores)
        const firstMatch = fieldText.search(regex)
        if (firstMatch !== -1) {
          matchPositions.push({
            term,
            position: firstMatch,
            field: fieldName,
          })

          const positionBonus = Math.max(0.1, 1 - firstMatch / fieldText.length)
          termScore *= 1 + positionBonus * 0.5
        }

        fieldScore += termScore
      }
    }

    return fieldScore
  }

  private calculateKeywordScore(keywords: string[], searchTerms: string[], matchedTerms: string[]): number {
    let score = 0

    for (const term of searchTerms) {
      if (keywords.some(keyword => keyword.toLowerCase().includes(term))) {
        matchedTerms.push(term)
        score += 1.5 // Keywords get a good boost
      }
    }

    return score
  }

  private calculateRecencyBoost(publishDate: string): number {
    const age = Date.now() - new Date(publishDate).getTime()
    const daysOld = age / (1000 * 60 * 60 * 24)

    if (daysOld < 7) return 1.3
    if (daysOld < 30) return 1.2
    if (daysOld < 90) return 1.1

    return 1.0
  }

  private calculateFuzzyScore(text: string, searchTerms: string[], alreadyMatched: string[]): number {
    let fuzzyScore = 0
    const unmatchedTerms = searchTerms.filter(term => !alreadyMatched.includes(term))

    for (const term of unmatchedTerms) {
      // Simple fuzzy matching - look for partial matches
      if (term.length > 3) {
        const partialRegex = new RegExp(term.substring(0, term.length - 1), "gi")
        if (text.match(partialRegex)) {
          fuzzyScore += 0.5
        }
      }
    }

    return fuzzyScore
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  private async generateSuggestions(query: string, documents: SearchDocument[]): Promise<string[]> {
    const suggestions: Set<string> = new Set()
    const queryLower = query.toLowerCase()

    // Find similar terms from document titles and keywords
    for (const doc of documents) {
      // Check title words
      const titleWords = doc.title.toLowerCase().split(/\s+/)
      for (const word of titleWords) {
        if (word.length > 3 && word.includes(queryLower.substring(0, 3))) {
          suggestions.add(word)
        }
      }

      // Check keywords
      for (const keyword of doc.keywords) {
        if (keyword.includes(queryLower) || queryLower.includes(keyword)) {
          suggestions.add(keyword)
        }
      }
    }

    return Array.from(suggestions)
      .filter(suggestion => suggestion !== queryLower)
      .slice(0, 5) // Limit suggestions
  }

  private emptyResponse(query: string, filters?: SearchFilters, executionTime?: number): SearchResponse {
    return {
      results: [],
      total: 0,
      query,
      filters,
      executionTime: executionTime || 0,
      suggestions: [],
    }
  }

  async getSearchStats(): Promise<{
    totalDocuments: number
    avgScore: number
    topKeywords: Array<{ keyword: string; count: number }>
  } | null> {
    const stats = await this.indexer.getStats()
    const index = await this.indexer.getIndex()

    if (!stats || !index) return null

    // Calculate keyword frequency
    const keywordCounts = new Map<string, number>()

    for (const doc of index.documents) {
      for (const keyword of doc.keywords) {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1)
      }
    }

    const topKeywords = Array.from(keywordCounts.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalDocuments: stats.totalDocuments,
      avgScore: index.documents.reduce((sum, doc) => sum + (doc.boost || 1), 0) / index.documents.length,
      topKeywords,
    }
  }
}

export default SearchEngine
