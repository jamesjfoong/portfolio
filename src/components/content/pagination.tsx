import Link from "next/link"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

function createPageUrl(baseUrl: string, page: number, searchParams?: Record<string, string>) {
  const params = new URLSearchParams(searchParams)
  params.set("page", page.toString())
  return `${baseUrl}?${params.toString()}`
}

export function ContentPagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate visible page numbers
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <nav className="flex items-center justify-center mt-12" aria-label="Pagination Navigation">
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(baseUrl, currentPage - 1, searchParams)}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go to previous page"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-3 py-2 text-gray-400 cursor-not-allowed">← Previous</span>
        )}

        {/* Page numbers */}
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">
                …
              </span>
            )
          }

          const pageNumber = page as number
          const isCurrentPage = pageNumber === currentPage

          return (
            <Link
              key={pageNumber}
              href={createPageUrl(baseUrl, pageNumber, searchParams)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isCurrentPage ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {pageNumber}
            </Link>
          )
        })}

        {/* Next button */}
        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(baseUrl, currentPage + 1, searchParams)}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go to next page"
          >
            Next →
          </Link>
        ) : (
          <span className="px-3 py-2 text-gray-400 cursor-not-allowed">Next →</span>
        )}
      </div>

      {/* Page info */}
      <div className="ml-6 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  )
}

export default ContentPagination
