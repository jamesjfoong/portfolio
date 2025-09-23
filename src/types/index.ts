import type {
  ExperienceType,
  MediaType,
  ProjectCategory,
  ProjectStatus,
  SkillLevel,
  SocialPlatform,
  TechCategory,
} from "./enums"

export interface Social {
  platform: SocialPlatform
  username: string
  url: string
}

export interface Education {
  university: string
  degree: string
  concentration: string
  minor?: string
  graduation: string
  gpa?: number
}

export interface Technology {
  name: string
  category: TechCategory
  level: SkillLevel
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  type: ExperienceType
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements: string[]
  technologies: Technology[]
}

export interface ProjectMetrics {
  impact?: string
  performance?: number[]
  users?: number
  github_stars?: number
}

export interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  category: ProjectCategory
  status: ProjectStatus
  year: string
  startDate: string
  endDate?: string
  technologies: Technology[]
  features: string[]
  challenges: string[]
  solutions: string[]
  media: {
    type: MediaType
    thumbnail: string
    gallery?: string[]
    video?: string
    demo?: string
  }
  links: {
    live?: string
    github?: string
    case_study?: string
  }
  metrics?: ProjectMetrics
  testimonials?: Testimonial[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating?: number
}

export interface PersonalData {
  name: string
  title: string
  bio: string
  location: string
  email: string
  phone?: string
  socials: Social[]
  education: Education
  experiences: Experience[]
  projects: Project[]
  skills: Technology[]
  testimonials: Testimonial[]
  quote: string
}
