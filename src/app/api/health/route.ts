// Health check and status API endpoint
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { memoryCache } from "@/lib/cache/memory-cache"

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const timestamp = new Date().toISOString()

    // Get cache statistics
    const cacheStats = memoryCache.getStats()

    // Basic health check data
    const healthData = {
      status: "healthy",
      timestamp,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      cache: {
        totalEntries: cacheStats.totalEntries,
        totalSize: cacheStats.totalSize,
        hitRate: cacheStats.hitRate,
        averageResponseTime: cacheStats.averageResponseTime,
        oldestEntry: cacheStats.oldestEntry,
        newestEntry: cacheStats.newestEntry,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memoryUsage: {
          rss: process.memoryUsage().rss,
          heapUsed: process.memoryUsage().heapUsed,
          heapTotal: process.memoryUsage().heapTotal,
          external: process.memoryUsage().external,
        },
      },
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    const errorData = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }

    return NextResponse.json(errorData, {
      status: 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
}
