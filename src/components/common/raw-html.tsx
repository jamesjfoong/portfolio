"use client"

import React from "react"

import DOMPurify from "isomorphic-dompurify"

interface RawHTMLProps {
  content: string
  className?: string
  as?: keyof React.JSX.IntrinsicElements
}

/**
 * RawHTML component that sanitizes and renders HTML content safely.
 * @param {RawHTMLProps} props - The props for the RawHTML component.
 * @param {string} props.content - The HTML content to render.
 * @param {string} [props.className] - Optional CSS classes.
 * @param {keyof JSX.IntrinsicElements} [props.as='div'] - The HTML element to render as.
 * @returns {React.ReactElement} The RawHTML component.
 */
export default function RawHTML({ content, className, as: Component = "div" }: RawHTMLProps): React.ReactElement {
  const sanitizedContent: string = DOMPurify.sanitize(content)

  return <Component className={className} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}
