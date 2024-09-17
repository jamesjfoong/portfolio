import { notFound } from 'next/navigation'

import { Post, PostDetails } from '@/lib/devto/types'

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(
    `https://dev.to/api/articles?username=${process.env.DEVTO_USERNAME}`,
    {
      next: { revalidate: 3 * 60 * 60 },
    }
  )

  if (!res.ok) notFound()
  return res.json()
}

export async function fetchPost(slug: string): Promise<PostDetails> {
  const res = await fetch(
    `https://dev.to/api/articles/${process.env.DEVTO_USERNAME}/${slug}`,
    {
      next: { revalidate: 3 * 60 * 60 },
    }
  )

  if (!res.ok) notFound()
  return res.json()
}
