interface LoadingSkeletonProps {
  className?: string
}

function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

// Card loading skeleton
export function LoadingCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <LoadingSkeleton className="h-48 w-full" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-16" />
        </div>
        <LoadingSkeleton className="h-6 w-3/4 mb-3" />
        <LoadingSkeleton className="h-4 w-full mb-2" />
        <LoadingSkeleton className="h-4 w-5/6 mb-4" />
        <div className="flex space-x-2 mb-4">
          <LoadingSkeleton className="h-6 w-16" />
          <LoadingSkeleton className="h-6 w-20" />
          <LoadingSkeleton className="h-6 w-14" />
        </div>
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

// Grid of loading cards
export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

// List loading skeleton
export function LoadingList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <LoadingSkeleton className="h-6 w-3/4 mb-2" />
              <LoadingSkeleton className="h-4 w-full mb-1" />
              <LoadingSkeleton className="h-4 w-2/3 mb-3" />
              <div className="flex space-x-2">
                <LoadingSkeleton className="h-5 w-12" />
                <LoadingSkeleton className="h-5 w-16" />
                <LoadingSkeleton className="h-5 w-10" />
              </div>
            </div>
            <LoadingSkeleton className="h-16 w-20 ml-4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Content page loading skeleton
export function LoadingContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Breadcrumb */}
        <LoadingSkeleton className="h-4 w-64 mb-6" />

        {/* Title */}
        <LoadingSkeleton className="h-12 w-3/4 mb-4" />

        {/* Meta */}
        <div className="flex space-x-4 mb-6">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-4 w-16" />
        </div>

        {/* Tags */}
        <div className="flex space-x-2 mb-8">
          <LoadingSkeleton className="h-8 w-20" />
          <LoadingSkeleton className="h-8 w-24" />
          <LoadingSkeleton className="h-8 w-16" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          {Array.from({ length: 12 }, (_, i) => (
            <LoadingSkeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Spinner component
export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={`inline-block ${className}`}>
      <svg className={`animate-spin ${sizeClasses[size]} text-blue-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

// Full page loading
export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

export default {
  Card: LoadingCard,
  Grid: LoadingGrid,
  List: LoadingList,
  Content: LoadingContent,
  Spinner: LoadingSpinner,
  Page: LoadingPage,
}
