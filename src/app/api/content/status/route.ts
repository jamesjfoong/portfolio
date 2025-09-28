import { NextResponse } from "next/server"

import { GitHubClient } from "@/lib/github/client"

import type { StatusResponse } from "@/types/api"
import type { GitHubRepository } from "@/types/github"

export async function GET(): Promise<NextResponse<StatusResponse>> {
  try {
    // Get GitHub configuration from environment
    const githubConfig: GitHubRepository = {
      owner: process.env.GITHUB_OWNER || "",
      repo: process.env.GITHUB_REPO || "",
      branch: process.env.GITHUB_BRANCH || "main",
      accessToken: process.env.GITHUB_TOKEN || "",
    }

    if (!githubConfig.owner || !githubConfig.repo || !githubConfig.accessToken) {
      return NextResponse.json({
        status: "unhealthy",
        services: {
          github: {
            status: "unavailable",
            lastSuccess: new Date().toISOString(),
            rateLimit: {
              remaining: 0,
              resetAt: new Date().toISOString(),
            },
          },
          cache: {
            status: "degraded",
            hitRate: 0,
            size: 0,
          },
          content: {
            totalPosts: 0,
            totalProjects: 0,
            lastSync: new Date().toISOString(),
            syncFrequency: "5",
          },
        },
        uptime: process.uptime(),
        version: "1.0.0",
      } as StatusResponse)
    }

    const githubClient = new GitHubClient(githubConfig)

    // Check GitHub API access
    const hasAccess = await githubClient.validateAccess()
    const rateLimit = hasAccess ? await githubClient.getRateLimit() : { remaining: 0, reset: Date.now() / 1000 }

    const response: StatusResponse = {
      status: hasAccess ? "healthy" : "degraded",
      services: {
        github: {
          status: hasAccess ? "available" : "unavailable",
          lastSuccess: new Date().toISOString(),
          rateLimit: {
            remaining: rateLimit.remaining,
            resetAt: new Date(rateLimit.reset * 1000).toISOString(),
          },
        },
        cache: {
          status: "healthy",
          hitRate: 85, // Mock data for now
          size: 1024 * 1024, // Mock 1MB cache size
        },
        content: {
          totalPosts: 0, // Will be populated when content sync is implemented
          totalProjects: 0, // Will be populated when content sync is implemented
          lastSync: new Date().toISOString(),
          syncFrequency: "5", // 5 minutes
        },
      },
      uptime: process.uptime(),
      version: "1.0.0",
    }

    return NextResponse.json(response)
  } catch {
    // Return error response
    return NextResponse.json(
      {
        status: "unhealthy",
        services: {
          github: {
            status: "unavailable",
            lastSuccess: new Date().toISOString(),
            rateLimit: {
              remaining: 0,
              resetAt: new Date().toISOString(),
            },
          },
          cache: {
            status: "degraded",
            hitRate: 0,
            size: 0,
          },
          content: {
            totalPosts: 0,
            totalProjects: 0,
            lastSync: new Date().toISOString(),
            syncFrequency: "5",
          },
        },
        uptime: process.uptime(),
        version: "1.0.0",
      } as StatusResponse,
      { status: 500 }
    )
  }
}
