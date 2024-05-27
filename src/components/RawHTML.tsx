'use client'

import DOMPurify from 'dompurify'

export function RawHTML({ content }: { content: string }): JSX.Element {
  const sanitizedContent: string = DOMPurify.sanitize(content)

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}
