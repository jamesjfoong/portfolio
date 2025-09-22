import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography
    h1: ({ children, ...props }) => (
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 mt-8 text-foreground" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-3 mt-6 text-foreground" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="text-lg md:text-xl font-semibold tracking-tight mb-2 mt-4 text-foreground" {...props}>
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="text-muted-foreground leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),

    // Lists
    ul: ({ children, ...props }) => (
      <ul className="space-y-2 mb-4 ml-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="space-y-2 mb-4 ml-4 list-decimal" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="flex items-start gap-3" {...props}>
        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
        <span className="text-muted-foreground">{children}</span>
      </li>
    ),

    // Links and Media
    a: ({ href, children, ...props }) => (
      <Link
        href={href || "#"}
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        {...props}
      >
        {children}
      </Link>
    ),
    img: ({ src, alt, ...props }) => (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden my-6">
        <Image
          src={src || ""}
          alt={alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          className="object-cover"
          {...props}
        />
      </div>
    ),

    // Code blocks
    code: ({ children, className, ...props }) => {
      const isInline = !className
      return (
        <code
          className={cn(
            isInline
              ? "px-2 py-1 bg-muted text-muted-foreground rounded text-sm font-mono"
              : "block p-4 bg-muted text-muted-foreground rounded-lg text-sm font-mono overflow-x-auto",
            className
          )}
          {...props}
        >
          {children}
        </code>
      )
    },
    pre: ({ children, ...props }) => (
      <pre className="mb-4 overflow-x-auto bg-muted p-4 rounded-lg" {...props}>
        {children}
      </pre>
    ),

    // Block elements
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-primary/20 pl-6 my-6 italic text-muted-foreground" {...props}>
        {children}
      </blockquote>
    ),
    hr: ({ ...props }) => <hr className="border-border my-8" {...props} />,

    // Tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse border border-border" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-border px-4 py-2" {...props}>
        {children}
      </td>
    ),

    // Custom components
    Badge,
    Button,

    ...components,
  }
}
