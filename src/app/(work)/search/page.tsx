// Search results page - Server Component
import type { Metadata } from "next"
import Link from "next/link"

import type { SearchResponse } from "@/types/api"

interface SearchProps {
  searchParams: {
    q?: string
    type?: "all" | "blog" | "projects"
    page?: string
  }
}

// Fetch search results
async function getSearchResults(
  query: string,
  type: string = "all",
  page: number = 1
): Promise<SearchResponse["data"] | null> {
  if (!query || query.length < 2) return null

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const params = new URLSearchParams({
    q: query,
    type,
    page: page.toString(),
    limit: "20",
  })

  const response = await fetch(`${baseUrl}/api/search?${params}`, {
    next: { revalidate: 300 }, // 5 minute cache
  })

  if (!response.ok) {
    return null
  }

  const result: SearchResponse = await response.json()
  return result.data || null
}

// Generate metadata
export async function generateMetadata({ searchParams }: SearchProps): Promise<Metadata> {
  const query = searchParams.q || ""

  if (!query) {
    return {
      title: "Search",
      description: "Search through blog posts and projects.",
    }
  }

  return {
    title: `Search results for "${query}"`,
    description: `Find blog posts and projects related to "${query}".`,
    robots: "noindex, nofollow", // Don't index search result pages
  }
}

// Search filter component
function SearchFilters({
  currentType,
  query,
  totalResults,
}: {
  currentType: string
  query: string
  totalResults: { all: number; blog: number; projects: number }
}) {
  const filters = [
    { key: "all", label: "All", count: totalResults.all },
    { key: "blog", label: "Blog Posts", count: totalResults.blog },
    { key: "projects", label: "Projects", count: totalResults.projects },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(filter => (
        <Link
          key={filter.key}
          href={`/search?q=${encodeURIComponent(query)}&type=${filter.key}`}
          className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
            currentType === filter.key
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {filter.label} ({filter.count})
        </Link>
      ))}
    </div>
  )
}

// Search result item component
function SearchResultItem({ result }: { result: SearchResponse["data"]["results"][0] }) {
  const href = result.type === "blog" ? `/blog/${result.slug}` : `/projects/${result.slug}`

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              result.type === "blog" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {result.type === "blog" ? "Blog Post" : "Project"}
          </span>
          {result.publishDate && (
            <time className="text-sm text-gray-500">
              {new Date(result.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          )}
        </div>
        {result.score && <div className="text-sm text-gray-500">{Math.round(result.score * 100)}% match</div>}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        <Link href={href} className="hover:text-blue-600 transition-colors">
          {result.title}
        </Link>
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-2">{result.description}</p>

      {result.excerpt && (
        <div className="bg-gray-50 p-3 rounded mb-4">
          <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: result.excerpt }} />
        </div>
      )}

      {result.tags && result.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {result.tags.slice(0, 5).map(tag => (
            <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {tag}
            </span>
          ))}
          {result.tags.length > 5 && <span className="text-xs text-gray-500">+{result.tags.length - 5} more</span>}
        </div>
      )}

      <Link href={href} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
        Read more →
      </Link>
    </article>
  )
}

// Pagination component
function Pagination({
  currentPage,
  totalPages,
  query,
  type,
}: {
  currentPage: number
  totalPages: number
  query: string
  type: string
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(
    page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)
  )

  return (
    <nav className="flex justify-center mt-12">
      <div className="flex items-center space-x-1">
        {currentPage > 1 && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${currentPage - 1}`}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Previous
          </Link>
        )}

        {visiblePages.map((page, index) => {
          const showEllipsis = index > 0 && visiblePages[index - 1] !== page - 1

          return (
            <div key={page} className="flex items-center">
              {showEllipsis && <span className="px-2 text-gray-500">...</span>}
              <Link
                href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}`}
                className={`px-3 py-2 rounded transition-colors ${
                  currentPage === page ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </Link>
            </div>
          )
        })}

        {currentPage < totalPages && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=${type}&page=${currentPage + 1}`}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  )
}

// Search input component
function SearchInput({ query, type }: { query: string; type: string }) {
  return (
    <div className="mb-8">
      <form method="GET" action="/search" className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="search-query" className="sr-only">
            Search query
          </label>
          <input
            id="search-query"
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Search blog posts and projects..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <input type="hidden" name="type" value={type} />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Search
        </button>
      </form>
    </div>
  )
}

// No results component
function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <span className="text-6xl text-gray-300">🔍</span>
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">No results found for "{query}"</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Try adjusting your search terms or check out our latest blog posts and projects.
      </p>
      <div className="flex justify-center space-x-4">
        <Link href="/blog" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Browse Blog Posts
        </Link>
        <Link
          href="/projects"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Projects
        </Link>
      </div>
    </div>
  )
}

// Main search page
export default async function SearchPage({ searchParams }: SearchProps) {
  const query = searchParams.q || ""
  const type = searchParams.type || "all"
  const page = parseInt(searchParams.page || "1", 10)

  // Redirect empty searches to search page
  if (!query) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search</h1>
        <SearchInput query="" type={type} />
        <div className="text-center py-12">
          <div className="mb-4">
            <span className="text-6xl text-gray-300">🔍</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Start your search</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Search through all blog posts and projects to find what you're looking for.
          </p>
        </div>
      </div>
    )
  }

  const searchResults = await getSearchResults(query, type, page)

  if (!searchResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search</h1>
        <SearchInput query={query} type={type} />
        <div className="text-center py-12">
          <p className="text-red-600">Error loading search results. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
        <p className="text-gray-600">
          Found {searchResults.totalResults.all} results for "{query}"
        </p>
      </div>

      {/* Search Input */}
      <SearchInput query={query} type={type} />

      {/* Filters */}
      <SearchFilters currentType={type} query={query} totalResults={searchResults.totalResults} />

      {/* Results */}
      {searchResults.results.length > 0 ? (
        <>
          <div className="space-y-6">
            {searchResults.results.map(result => (
              <SearchResultItem key={`${result.type}-${result.slug}`} result={result} />
            ))}
          </div>

          <Pagination
            currentPage={searchResults.pagination.page}
            totalPages={searchResults.pagination.pages}
            query={query}
            type={type}
          />
        </>
      ) : (
        <NoResults query={query} />
      )}
    </div>
  )
}
