'use client'

import DOMPurify from 'isomorphic-dompurify'

export default function RawHTML({ content }: { content: string }): JSX.Element {
  const sanitizedContent: string = DOMPurify.sanitize(content)

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}
