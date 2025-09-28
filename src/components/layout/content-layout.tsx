import type { ReactNode } from "react"

interface ContentLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  className?: string
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
}

export function ContentLayout({ children, sidebar, maxWidth = "lg", className = "" }: ContentLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className={`mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]}`}>
        {sidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8">{sidebar}</div>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-3">{children}</main>
          </div>
        ) : (
          <main className="w-full">{children}</main>
        )}
      </div>
    </div>
  )
}

export default ContentLayout
