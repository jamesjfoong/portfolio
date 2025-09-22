import { z } from "zod"

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  fullDescription: z.string(),
  category: z.enum(["web-development", "ai-ml", "developer-tools", "data-science", "game-development"]),
  status: z.enum(["completed", "in-progress", "planned"]),
  year: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  technologies: z.array(
    z.object({
      name: z.string(),
      category: z.string(),
      level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
    })
  ),
  features: z.array(z.string()),
  challenges: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
  links: z.object({
    live: z.string().url().optional(),
    github: z.string().url().optional(),
    case_study: z.string().url().optional(),
  }),
  metrics: z
    .object({
      impact: z.string().optional(),
      users: z.number().optional(),
      github_stars: z.number().optional(),
    })
    .optional(),
})

export type ProjectData = z.infer<typeof projectSchema>
