export interface HighlightOptions {
  maxLength: number
  contextWords: number
  highlightTag: string
  highlightClass: string
  caseSensitive: boolean
}

export class ResultHighlighter {
  private readonly DEFAULT_OPTIONS: HighlightOptions = {
    maxLength: 300,
    contextWords: 5,
    highlightTag: "mark",
    highlightClass: "search-highlight",
    caseSensitive: false,
  }

  async highlight(text: string, searchTerms: string[], options?: Partial<HighlightOptions>): Promise<string> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }

    if (!text || searchTerms.length === 0) {
      return text
    }

    // Clean and prepare text
    const cleanText = this.cleanText(text)

    // Find all match positions
    const matches = this.findMatches(cleanText, searchTerms, opts)

    if (matches.length === 0) {
      return this.truncateText(cleanText, opts.maxLength)
    }

    // Create excerpt around matches
    const excerpt = this.createExcerpt(cleanText, matches, opts)

    // Apply highlighting
    return this.applyHighlighting(excerpt, matches, searchTerms, opts)
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, " ") // Remove HTML tags
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
  }

  private findMatches(
    text: string,
    searchTerms: string[],
    options: HighlightOptions
  ): Array<{ start: number; end: number; term: string }> {
    const matches: Array<{ start: number; end: number; term: string }> = []
    const flags = options.caseSensitive ? "g" : "gi"

    for (const term of searchTerms) {
      const escapedTerm = this.escapeRegex(term)
      const regex = new RegExp(`\\b${escapedTerm}\\b`, flags)
      let match

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          term: match[0],
        })

        // Prevent infinite loop
        if (!regex.global) break
      }
    }

    // Sort matches by position and merge overlapping ones
    return this.mergeOverlappingMatches(matches.sort((a, b) => a.start - b.start))
  }

  private mergeOverlappingMatches(
    matches: Array<{ start: number; end: number; term: string }>
  ): Array<{ start: number; end: number; term: string }> {
    if (matches.length <= 1) return matches

    const merged: Array<{ start: number; end: number; term: string }> = []
    let current = matches[0]

    for (let i = 1; i < matches.length; i++) {
      const next = matches[i]

      if (next.start <= current.end + 1) {
        // Allow 1 character gap
        // Merge overlapping/adjacent matches
        current = {
          start: current.start,
          end: Math.max(current.end, next.end),
          term: current.term, // Keep first term for highlighting
        }
      } else {
        merged.push(current)
        current = next
      }
    }

    merged.push(current)
    return merged
  }

  private createExcerpt(
    text: string,
    matches: Array<{ start: number; end: number; term: string }>,
    options: HighlightOptions
  ): string {
    if (text.length <= options.maxLength) {
      return text
    }

    // Find the best excerpt window that includes the most matches
    const bestWindow = this.findBestExcerptWindow(text, matches, options.maxLength)

    if (bestWindow) {
      let excerpt = text.substring(bestWindow.start, bestWindow.end)

      // Add ellipsis if we're cutting off text
      if (bestWindow.start > 0) {
        excerpt = `...${excerpt}`
      }
      if (bestWindow.end < text.length) {
        excerpt = `${excerpt}...`
      }

      return excerpt
    }

    // Fallback: just truncate from the beginning
    return this.truncateText(text, options.maxLength)
  }

  private findBestExcerptWindow(
    text: string,
    matches: Array<{ start: number; end: number; term: string }>,
    maxLength: number
  ): { start: number; end: number } | null {
    if (matches.length === 0) return null

    let bestScore = 0
    let bestWindow = null

    // Try different windows around each match
    for (const match of matches) {
      const center = Math.floor((match.start + match.end) / 2)
      const windowStart = Math.max(0, center - Math.floor(maxLength / 2))
      const windowEnd = Math.min(text.length, windowStart + maxLength)

      // Adjust start if we hit the end of the text
      const adjustedStart = Math.max(0, windowEnd - maxLength)

      const window = {
        start: adjustedStart,
        end: windowEnd,
      }

      // Score this window based on how many matches it contains
      const score = matches.filter(m => m.start >= window.start && m.end <= window.end).length

      if (score > bestScore) {
        bestScore = score
        bestWindow = window
      }
    }

    return bestWindow
  }

  private applyHighlighting(
    text: string,
    originalMatches: Array<{ start: number; end: number; term: string }>,
    searchTerms: string[],
    options: HighlightOptions
  ): string {
    // Re-find matches in the (potentially modified) excerpt text
    const matches = this.findMatches(text, searchTerms, options)

    if (matches.length === 0) {
      return text
    }

    // Apply highlighting from right to left to maintain positions
    let highlightedText = text

    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i]
      const matchedText = highlightedText.substring(match.start, match.end)

      const highlightedMatch = `<${options.highlightTag} class="${options.highlightClass}">${matchedText}</${options.highlightTag}>`

      highlightedText =
        highlightedText.substring(0, match.start) + highlightedMatch + highlightedText.substring(match.end)
    }

    return highlightedText
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text
    }

    // Try to break at word boundary
    const truncated = text.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(" ")

    if (lastSpaceIndex > maxLength * 0.8) {
      return `${truncated.substring(0, lastSpaceIndex)}...`
    }

    return `${truncated}...`
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  // Utility method to highlight without excerpt creation
  highlightInPlace(text: string, searchTerms: string[], options?: Partial<HighlightOptions>): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options }

    if (!text || searchTerms.length === 0) {
      return text
    }

    const matches = this.findMatches(text, searchTerms, opts)
    return this.applyHighlighting(text, matches, searchTerms, opts)
  }

  // Remove highlighting from text
  removeHighlighting(highlightedText: string): string {
    return highlightedText.replace(/<[^>]*>/g, "")
  }
}

export default ResultHighlighter
