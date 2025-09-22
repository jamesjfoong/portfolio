import { z } from "zod"

export const blogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  excerpt: z.string(),
  category: z.enum(["tutorial", "technical", "opinion", "case-study"]),
  tags: z.array(z.string()),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  readingTime: z.number(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
  }),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
})

export type BlogPostData = z.infer<typeof blogPostSchema>
