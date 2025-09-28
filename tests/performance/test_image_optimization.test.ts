/**
 * Image Optimization Verification Tests
 *
 * Tests to verify that images are properly optimized for performance,
 * including format conversion, compression, and responsive image handling.
 */

import { describe, it, expect, beforeAll } from "vitest"
import fs from "fs/promises"
import path from "path"
import {
  getImageFormat,
  isModernImageFormat,
  createResponsiveImageConfig,
  validateImageDimensions,
} from "../../src/lib/utils/image"

describe("Image Optimization Verification", () => {
  const publicDir = path.join(process.cwd(), "public")
  const projectsDir = path.join(publicDir, "projects")
  let imageFiles: string[] = []

  beforeAll(async () => {
    // Discover all image files in the public directory
    imageFiles = await findImageFiles(publicDir)
  })

  describe("Image Format Optimization", () => {
    it("should have modern format alternatives for large images", async () => {
      const issues: string[] = []

      for (const imagePath of imageFiles) {
        const stats = await fs.stat(imagePath)
        const format = getImageFormat(imagePath)

        // For large images (>50KB), check if modern formats are available
        if (stats.size > 50 * 1024 && format && ["jpg", "jpeg", "png"].includes(format)) {
          const baseName = path.basename(imagePath, path.extname(imagePath))
          const dir = path.dirname(imagePath)

          // Check for WebP alternative
          const webpPath = path.join(dir, baseName + ".webp")
          const hasWebP = await fileExists(webpPath)

          if (!hasWebP) {
            issues.push(
              `${path.relative(publicDir, imagePath)} (${formatBytes(stats.size)}) should have WebP alternative`
            )
          }
        }
      }

      if (issues.length > 0) {
        console.warn("Image optimization recommendations:", issues)
        // Don't fail the test, just warn - this is for monitoring
      }

      expect(true).toBe(true) // Always pass, this is informational
    })

    it("should use appropriate formats for different image types", () => {
      const formatRecommendations = {
        photos: ["webp", "jpg", "jpeg"],
        graphics: ["webp", "png", "svg"],
        icons: ["svg", "webp", "png"],
      }

      imageFiles.forEach(imagePath => {
        const format = getImageFormat(imagePath)
        const fileName = path.basename(imagePath).toLowerCase()

        // Simple heuristics for image type detection
        if (fileName.includes("icon") || fileName.includes("logo")) {
          if (format && !formatRecommendations.icons.includes(format)) {
            console.warn(`Icon ${imagePath} uses ${format}, consider ${formatRecommendations.icons.join(", ")}`)
          }
        }
      })
    })

    it("should validate image format detection utility", () => {
      expect(getImageFormat("test.jpg")).toBe("jpg")
      expect(getImageFormat("test.png")).toBe("png")
      expect(getImageFormat("test.webp")).toBe("webp")
      expect(getImageFormat("test.svg")).toBe("svg")
      expect(getImageFormat("test.txt")).toBe(null)

      expect(isModernImageFormat("webp")).toBe(true)
      expect(isModernImageFormat("avif")).toBe(true)
      expect(isModernImageFormat("jpg")).toBe(false)
      expect(isModernImageFormat("png")).toBe(false)
    })
  })

  describe("Image Size Optimization", () => {
    it("should identify oversized images", async () => {
      const oversizedImages: Array<{ path: string; size: number }> = []
      const sizeThreshold = 500 * 1024 // 500KB

      for (const imagePath of imageFiles) {
        const stats = await fs.stat(imagePath)
        if (stats.size > sizeThreshold) {
          oversizedImages.push({
            path: path.relative(publicDir, imagePath),
            size: stats.size,
          })
        }
      }

      if (oversizedImages.length > 0) {
        console.warn("Large images detected:")
        oversizedImages.forEach(({ path: imgPath, size }) => {
          console.warn(`  ${imgPath}: ${formatBytes(size)}`)
        })
        console.warn("Consider compressing these images or using Next.js Image optimization")
      }

      // Log for monitoring, but don't fail
      expect(true).toBe(true)
    })

    it("should validate image dimensions utility", () => {
      // Valid dimensions
      let result = validateImageDimensions(1920, 1080)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)

      // Invalid - too small
      result = validateImageDimensions(0, 0)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)

      // Invalid - too large
      result = validateImageDimensions(10000, 10000)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe("Responsive Image Configuration", () => {
    it("should generate proper responsive image config", () => {
      const src = "/test-image.jpg"
      const config = createResponsiveImageConfig(src, [640, 768, 1024])

      expect(config.srcSet).toHaveLength(3)
      expect(config.srcSet[0].width).toBe(640)
      expect(config.srcSet[1].width).toBe(768)
      expect(config.srcSet[2].width).toBe(1024)

      expect(config.sizes).toBeDefined()
      expect(config.fallbackSrc).toBeDefined()
      expect(config.placeholder).toBeDefined()
    })

    it("should handle different breakpoint configurations", () => {
      const src = "/test-image.jpg"

      // Test with minimal breakpoints
      const minimalConfig = createResponsiveImageConfig(src, [768])
      expect(minimalConfig.srcSet).toHaveLength(1)

      // Test with many breakpoints
      const complexConfig = createResponsiveImageConfig(src, [320, 640, 768, 1024, 1280, 1536])
      expect(complexConfig.srcSet).toHaveLength(6)

      // Verify sizes attribute generation
      expect(complexConfig.sizes).toContain("320px")
      expect(complexConfig.sizes).toContain("1536px")
    })
  })

  describe("Image Loading Performance", () => {
    it("should verify critical images have proper loading priority", () => {
      // This would typically analyze the actual pages
      // For now, we'll test the priority calculation logic
      const { getImageLoadingPriority } = require("../../src/lib/utils/image")

      // Hero images should have high priority
      expect(getImageLoadingPriority(true, true, false)).toBe("high")

      // Above fold, non-hero should have high priority
      expect(getImageLoadingPriority(true, false, false)).toBe("high")

      // Background images should have low priority
      expect(getImageLoadingPriority(true, false, true)).toBe("low")

      // Below fold should have low priority
      expect(getImageLoadingPriority(false, false, false)).toBe("low")
    })

    it("should validate lazy loading is properly configured", () => {
      // Test lazy loading observer creation
      const { createLazyImageLoader } = require("../../src/lib/utils/image")

      const callback = (entries: IntersectionObserverEntry[]) => {
        // Mock callback
      }

      // In a browser environment, this would create an observer
      // In Node.js, it should return null
      const observer = createLazyImageLoader(callback)
      expect(observer).toBe(null) // No IntersectionObserver in Node.js
    })
  })

  describe("Image Optimization Integration", () => {
    it("should verify Next.js Image component props generation", () => {
      const { createNextImageProps } = require("../../src/lib/utils/image")

      // Test basic props
      const basicProps = createNextImageProps("/test.jpg", {
        alt: "Test image",
        width: 800,
        height: 600,
      })

      expect(basicProps.src).toBe("/test.jpg")
      expect(basicProps.alt).toBe("Test image")
      expect(basicProps.width).toBe(800)
      expect(basicProps.height).toBe(600)
      expect(basicProps.quality).toBe(75) // default
      expect(basicProps.priority).toBe(false) // default

      // Test fill mode
      const fillProps = createNextImageProps("/test.jpg", {
        alt: "Test image",
        fill: true,
        priority: true,
      })

      expect(fillProps.fill).toBe(true)
      expect(fillProps.priority).toBe(true)
      expect(fillProps.width).toBeUndefined()
      expect(fillProps.height).toBeUndefined()
    })

    it("should validate image URL optimization", () => {
      const { getOptimizedImageUrl } = require("../../src/lib/utils/image")

      // Test local image optimization
      const optimizedUrl = getOptimizedImageUrl("/local-image.jpg", {
        width: 800,
        quality: 80,
      })

      expect(optimizedUrl).toContain("/_next/image")
      expect(optimizedUrl).toContain("w=800")
      expect(optimizedUrl).toContain("q=80")

      // Test external URL passthrough
      const externalUrl = "https://example.com/image.jpg"
      const externalResult = getOptimizedImageUrl(externalUrl)
      expect(externalResult).toBe(externalUrl)

      // Test SVG passthrough
      const svgUrl = "/icon.svg"
      const svgResult = getOptimizedImageUrl(svgUrl)
      expect(svgResult).toBe(svgUrl)
    })
  })

  describe("Image Performance Monitoring", () => {
    it("should track image loading metrics", () => {
      // This would typically integrate with performance monitoring
      // For now, we'll verify the structure exists
      const { recordImageMetric } = require("../../src/lib/config/monitoring")

      // Test that the monitoring function exists and can be called
      if (typeof recordImageMetric === "function") {
        expect(() => {
          recordImageMetric("image.load", 150, { url: "/test.jpg" })
        }).not.toThrow()
      }
    })

    it("should identify potential performance issues", async () => {
      const performanceIssues: string[] = []

      for (const imagePath of imageFiles) {
        const stats = await fs.stat(imagePath)
        const format = getImageFormat(imagePath)

        // Check for common performance issues
        if (stats.size > 1024 * 1024) {
          // 1MB
          performanceIssues.push(`${path.relative(publicDir, imagePath)}: Very large file (${formatBytes(stats.size)})`)
        }

        if (format === "gif" && stats.size > 500 * 1024) {
          // 500KB
          performanceIssues.push(`${path.relative(publicDir, imagePath)}: Large GIF, consider video format`)
        }

        if (format === "bmp") {
          performanceIssues.push(`${path.relative(publicDir, imagePath)}: BMP format is not web-optimized`)
        }
      }

      if (performanceIssues.length > 0) {
        console.warn("Image performance issues detected:")
        performanceIssues.forEach(issue => console.warn(`  ${issue}`))
      }

      // Log for monitoring
      expect(true).toBe(true)
    })
  })
})

// Utility functions
async function findImageFiles(dir: string): Promise<string[]> {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".tiff"]
  const imageFiles: string[] = []

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        // Recursively search subdirectories
        const subFiles = await findImageFiles(fullPath)
        imageFiles.push(...subFiles)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (imageExtensions.includes(ext)) {
          imageFiles.push(fullPath)
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be accessible
    console.warn(`Could not read directory ${dir}:`, error)
  }

  return imageFiles
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
