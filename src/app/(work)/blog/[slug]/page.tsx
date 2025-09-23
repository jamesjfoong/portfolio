import { notFound } from "next/navigation"

import { getMDXContent, type SerializedMDXContent } from "@/lib/mdx"

import BlogPostClient from "./blog-post-client"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<React.ReactElement> {
  const { slug } = await params

  const contentResult = await getMDXContent("blog", slug)

  if (!contentResult.success) {
    notFound()
  }

  return <BlogPostClient content={contentResult.data as SerializedMDXContent} />
}
