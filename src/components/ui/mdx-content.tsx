"use client"

import { MDXRemote } from "next-mdx-remote"
import type { MDXRemoteSerializeResult } from "next-mdx-remote"
import { useMDXComponents } from "../../../mdx-components"
import { cn } from "@/lib/utils"

interface MDXContentProps {
  /** The serialized MDX content to render */
  serializedContent: MDXRemoteSerializeResult
  /** Optional CSS class name for the container */
  className?: string
}

/**
 * Renders MDX content using next-mdx-remote
 *
 * @param serializedContent - The serialized MDX content from next-mdx-remote
 * @param className - Optional CSS class name for styling
 * @returns A React element containing the rendered MDX content
 */
export default function MDXContent({ serializedContent, className }: MDXContentProps): React.ReactElement {
  const components = useMDXComponents({})

  return (
    <div className={cn("prose prose-lg max-w-none text-muted-foreground", className)}>
      <MDXRemote {...serializedContent} components={components} />
    </div>
  )
}
