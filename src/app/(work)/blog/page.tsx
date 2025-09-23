import { getAllBlogPosts } from "@/lib/mdx"

import BlogClientPage from "./blog-client"

export default async function BlogPage(): Promise<React.ReactElement> {
  const posts = await getAllBlogPosts()

  return <BlogClientPage posts={posts} />
}
