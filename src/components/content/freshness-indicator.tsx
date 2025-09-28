import { formatDistanceToNow } from "date-fns"

interface ContentFreshnessIndicatorProps {
  publishDate: string
  lastModified?: string
  className?: string
}

function getFreshnessLevel(date: Date): {
  level: "fresh" | "recent" | "old"
  color: string
  label: string
} {
  const now = new Date()
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

  if (diffInDays <= 30) {
    return {
      level: "fresh",
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Fresh",
    }
  } else if (diffInDays <= 90) {
    return {
      level: "recent",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      label: "Recent",
    }
  } else {
    return {
      level: "old",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Older",
    }
  }
}

export function ContentFreshnessIndicator({
  publishDate,
  lastModified,
  className = "",
}: ContentFreshnessIndicatorProps) {
  const targetDate = new Date(lastModified || publishDate)
  const freshness = getFreshnessLevel(targetDate)
  const timeAgo = formatDistanceToNow(targetDate, { addSuffix: true })

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${freshness.color}`}
        title={`Content is ${freshness.label.toLowerCase()}`}
      >
        {freshness.label}
      </span>

      <span className="text-sm text-gray-600" title={targetDate.toLocaleDateString()}>
        {lastModified ? "Updated" : "Published"} {timeAgo}
      </span>
    </div>
  )
}

export default ContentFreshnessIndicator
