"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

interface TagFilterProps {
  availableTags: string[]
  baseUrl?: string
  onFilterChange?: (selectedTags: string[]) => void
  maxVisible?: number
}

export function TagFilter({ availableTags, baseUrl, onFilterChange, maxVisible = 10 }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  // Initialize selected tags from URL params
  useEffect(() => {
    const urlTags = searchParams.getAll("tag")
    setSelectedTags(urlTags)
  }, [searchParams])

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]

    setSelectedTags(newSelectedTags)

    // Call external handler if provided
    if (onFilterChange) {
      onFilterChange(newSelectedTags)
      return
    }

    // Default behavior: update URL
    if (baseUrl) {
      const params = new URLSearchParams(searchParams)

      // Remove existing tag params
      params.delete("tag")

      // Add new tag params
      newSelectedTags.forEach(selectedTag => {
        params.append("tag", selectedTag)
      })

      // Reset to page 1 when filtering
      params.set("page", "1")

      const newUrl = `${baseUrl}?${params.toString()}`
      router.push(newUrl)
    }
  }

  const handleClearAll = () => {
    setSelectedTags([])

    if (onFilterChange) {
      onFilterChange([])
      return
    }

    if (baseUrl) {
      const params = new URLSearchParams(searchParams)
      params.delete("tag")
      params.set("page", "1")
      const newUrl = `${baseUrl}?${params.toString()}`
      router.push(newUrl)
    }
  }

  if (availableTags.length === 0) return null

  const visibleTags = showAll ? availableTags : availableTags.slice(0, maxVisible)
  const hasMore = availableTags.length > maxVisible

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <button onClick={handleClearAll} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {visibleTags.map(tag => {
          const isSelected = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-pressed={isSelected}
            >
              {tag}
              {isSelected && (
                <span className="ml-2" aria-hidden="true">
                  ×
                </span>
              )}
            </button>
          )
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          {showAll ? "Show less" : `Show ${availableTags.length - maxVisible} more tags`}
        </button>
      )}

      {selectedTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      )}
    </div>
  )
}

export default TagFilter
