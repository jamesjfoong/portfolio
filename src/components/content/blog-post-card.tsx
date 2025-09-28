import Image from "next/image"
import Link from "next/link"

import type { BlogPost } from "@/types/content"

interface BlogPostCardProps {
  post: BlogPost
  priority?: boolean
}

export function BlogPostCard({ post, priority = false }: BlogPostCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {post.featuredImage && (
        <div className="relative aspect-video">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <time className="text-sm text-gray-500">
            {new Date(post.publishDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.readingTime && <span className="text-sm text-gray-500">{post.readingTime} min read</span>}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.description || post.excerpt}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
              >
                {tag}
              </Link>
            ))}
            {post.tags.length > 3 && <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Read more →
          </Link>

          {post.lastModified && (
            <span className="text-xs text-gray-400">Updated {new Date(post.lastModified).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default BlogPostCard
