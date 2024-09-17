import { fetchPost } from '@/lib/devto/fetch'
import { renderMarkdown } from '@/lib/markdown'

import 'highlight.js/styles/github-dark.css' // Import your favorite highlight.js theme

export async function generateMetaData({
  params,
}: {
  params: { slug: string }
}) {
  const { title, description } = await fetchPost(params.slug)

  return { title, description }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { body_markdown } = await fetchPost(params.slug)
  const content = await renderMarkdown(body_markdown)

  return (
    <>
      <article>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </article>
    </>
  )
}
