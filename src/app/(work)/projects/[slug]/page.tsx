import { notFound } from "next/navigation"

import ProjectDetailClient from "@/components/ui/project-detail-client"
import { getMDXContent, type SerializedMDXContent } from "@/lib/mdx"
import personalData from "@/data/unified-data"

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps): Promise<React.ReactElement> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  const project = personalData.projects.find(p => p.slug === slug)

  if (!project) {
    notFound()
  }

  // Load MDX content with safe error handling
  let serializedMdx: SerializedMDXContent["serialized"] | null = null
  let contentError: string | null = null

  try {
    const result = await getMDXContent("projects", slug)
    if (result.success) {
      const data = result.data as SerializedMDXContent
      serializedMdx = data.serialized
    } else {
      contentError = result.error.message
    }
  } catch {
    contentError = "Failed to load content"
  }

  return <ProjectDetailClient project={project} serializedMdx={serializedMdx} contentError={contentError} />
}
