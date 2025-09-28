import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: "noindex, nofollow",
}

// Mock function to get recent content - in real app this would fetch from API
async function getRecentContent() {
  // This would normally fetch from your content API
  return {
    recentPosts: [
      {
        title: "Understanding React Server Components",
        slug: "understanding-react-server-components",
        publishDate: "2024-01-15",
      },
      {
        title: "Building Scalable Design Systems",
        slug: "building-scalable-design-systems",
        publishDate: "2024-01-10",
      },
    ],
    recentProjects: [
      {
        title: "GitHub PR Review MCP",
        slug: "github-pr-review-mcp",
        publishDate: "2024-01-20",
      },
      {
        title: "GROQ Commit Tool",
        slug: "groq-commit",
        publishDate: "2024-01-18",
      },
    ],
  }
}

export default async function NotFound() {
  const { recentPosts, recentProjects } = await getRecentContent()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error illustration */}
        <div className="mb-8">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-8.5V3m0 0c-2.5 0-4.5 2-4.5 4.5S8.5 12 11 12h2c2.5 0 4.5-2 4.5-4.5S15.5 3 13 3c0 0 0 0-2 0z"
            />
          </svg>
        </div>

        {/* Error message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">404</h1>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. The link might be broken or the page may have been moved.
        </p>

        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Homepage
          </Link>

          <Link
            href="/blog"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Browse Blog Posts
          </Link>

          <Link
            href="/projects"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            View Projects
          </Link>
        </div>

        {/* Content suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Recent blog posts */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Blog Posts</h3>

            <div className="space-y-3">
              {recentPosts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{post.title}</h4>
                  <time className="text-sm text-gray-500">
                    {new Date(post.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              ))}
            </div>

            <Link
              href="/blog"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              View all blog posts →
            </Link>
          </div>

          {/* Recent projects */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>

            <div className="space-y-3">
              {recentProjects.map(project => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{project.title}</h4>
                  <time className="text-sm text-gray-500">
                    {new Date(project.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              ))}
            </div>

            <Link
              href="/projects"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              View all projects →
            </Link>
          </div>
        </div>

        {/* Search suggestion */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Still can't find what you're looking for?</p>

          <Link
            href="/search"
            className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            Try searching our content
          </Link>
        </div>
      </div>
    </div>
  )
}
