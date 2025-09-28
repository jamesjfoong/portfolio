/**
 * Image Optimization Utilities
 *
 * Comprehensive image handling utilities for optimization, lazy loading,
 * responsive images, and format conversion with Next.js integration.
 */

import { env } from "../config/env"

// Image optimization options
export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: "auto" | "webp" | "avif" | "jpeg" | "png"
  fit?: "cover" | "contain" | "fill" | "inside" | "outside"
  position?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right"
  blur?: number
  sharpen?: boolean
  grayscale?: boolean
  progressive?: boolean
}

// Responsive image configuration
export interface ResponsiveImageConfig {
  sizes: string
  srcSet: Array<{
    width: number
    src: string
  }>
  fallbackSrc: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

// Image metadata
export interface ImageMetadata {
  src: string
  width?: number
  height?: number
  aspectRatio?: number
  format?: string
  size?: number
  alt?: string
  title?: string
  blurDataURL?: string
}

// Supported image formats
const SUPPORTED_FORMATS = ["jpeg", "jpg", "png", "webp", "avif", "gif", "svg"]
const MODERN_FORMATS = ["webp", "avif"]

/**
 * Check if format is supported
 */
export function isSupportedImageFormat(format: string): boolean {
  return SUPPORTED_FORMATS.includes(format.toLowerCase())
}

/**
 * Check if format is modern (WebP, AVIF)
 */
export function isModernImageFormat(format: string): boolean {
  return MODERN_FORMATS.includes(format.toLowerCase())
}

/**
 * Extract image format from URL or filename
 */
export function getImageFormat(src: string): string | null {
  const match = src.match(/\.([^.?#]+)(\?|#|$)/)
  if (match && match[1]) {
    const format = match[1].toLowerCase()
    return isSupportedImageFormat(format) ? format : null
  }
  return null
}

/**
 * Generate Next.js optimized image URL
 */
export function getOptimizedImageUrl(src: string, options: ImageOptimizationOptions = {}): string {
  // Return original if external URL or SVG
  if (isExternalUrl(src) || getImageFormat(src) === "svg") {
    return src
  }

  const { width, height, quality = 75, format = "auto" } = options

  const params = new URLSearchParams()

  if (width) params.set("w", width.toString())
  if (height) params.set("h", height.toString())
  if (quality !== 75) params.set("q", quality.toString())
  if (format !== "auto") params.set("f", format)

  const queryString = params.toString()
  const separator = queryString ? "?" : ""

  // Use Next.js image optimization endpoint
  return `/_next/image${separator}url=${encodeURIComponent(src)}&${queryString}`
}

/**
 * Generate responsive image configuration
 */
export function createResponsiveImageConfig(
  src: string,
  breakpoints: number[] = [640, 768, 1024, 1280, 1536],
  options: Partial<ImageOptimizationOptions> = {}
): ResponsiveImageConfig {
  const srcSet = breakpoints.map(width => ({
    width,
    src: getOptimizedImageUrl(src, { ...options, width }),
  }))

  return {
    sizes: generateSizesAttribute(breakpoints),
    srcSet,
    fallbackSrc: getOptimizedImageUrl(src, options),
    placeholder: options.blur ? "blur" : "empty",
  }
}

/**
 * Generate sizes attribute for responsive images
 */
function generateSizesAttribute(breakpoints: number[]): string {
  const sortedBreakpoints = [...breakpoints].sort((a, b) => a - b)

  const sizes = sortedBreakpoints.map((bp, index) => {
    if (index === sortedBreakpoints.length - 1) {
      return `${bp}px`
    }
    return `(max-width: ${bp}px) ${bp}px`
  })

  return sizes.join(", ")
}

/**
 * Create blur placeholder data URL
 */
export function createBlurPlaceholder(width = 10, height = 10, color = "#f3f4f6"): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString("base64")}`
}

/**
 * Generate gradient placeholder for better loading experience
 */
export function createGradientPlaceholder(width = 10, height = 10, colors = ["#f3f4f6", "#e5e7eb"]): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `

  return `data:image/svg+xml;base64,${Buffer.from(svg.trim()).toString("base64")}`
}

/**
 * Calculate aspect ratio from width and height
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height
}

/**
 * Get dimensions maintaining aspect ratio
 */
export function getDimensionsWithAspectRatio(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  const aspectRatio = calculateAspectRatio(originalWidth, originalHeight)

  if (targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight }
  }

  if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    }
  }

  if (targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    }
  }

  return { width: originalWidth, height: originalHeight }
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number,
  maxWidth = 4096,
  maxHeight = 4096,
  minWidth = 1,
  minHeight = 1
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (width < minWidth) {
    errors.push(`Width ${width} is below minimum ${minWidth}`)
  }

  if (height < minHeight) {
    errors.push(`Height ${height} is below minimum ${minHeight}`)
  }

  if (width > maxWidth) {
    errors.push(`Width ${width} exceeds maximum ${maxWidth}`)
  }

  if (height > maxHeight) {
    errors.push(`Height ${height} exceeds maximum ${maxHeight}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(originalFormat: string, supportedFormats: string[] = []): string {
  // If no format detection is available, return original
  if (supportedFormats.length === 0) {
    return originalFormat
  }

  // Prefer AVIF if supported
  if (supportedFormats.includes("avif") && originalFormat !== "svg") {
    return "avif"
  }

  // Prefer WebP if supported
  if (supportedFormats.includes("webp") && originalFormat !== "svg") {
    return "webp"
  }

  // Keep SVG as is
  if (originalFormat === "svg") {
    return "svg"
  }

  // Default to original format
  return originalFormat
}

/**
 * Create image metadata object
 */
export function createImageMetadata(src: string, options: Partial<ImageMetadata> = {}): ImageMetadata {
  const format = getImageFormat(src)

  return {
    src,
    format: format || undefined,
    aspectRatio: options.width && options.height ? calculateAspectRatio(options.width, options.height) : undefined,
    blurDataURL: options.blurDataURL || createBlurPlaceholder(),
    ...options,
  }
}

/**
 * Generate srcSet string from responsive config
 */
export function generateSrcSet(srcSet: Array<{ width: number; src: string }>): string {
  return srcSet.map(({ src, width }) => `${src} ${width}w`).join(", ")
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, options: ImageOptimizationOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve()
      return
    }

    const img = new Image()

    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))

    // Use optimized URL if available
    img.src = getOptimizedImageUrl(src, options)
  })
}

/**
 * Lazy load image with intersection observer
 */
export function createLazyImageLoader(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null
  }

  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * Check if URL is external
 */
function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const currentDomain = env.NEXT_PUBLIC_SITE_URL
      ? new URL(env.NEXT_PUBLIC_SITE_URL).hostname
      : typeof window !== "undefined"
        ? window.location.hostname
        : ""
    return urlObj.hostname !== currentDomain
  } catch {
    return false // Relative URLs are not external
  }
}

/**
 * Get image loading priority based on position and viewport
 */
export function getImageLoadingPriority(
  isAboveFold = false,
  isHero = false,
  isBackground = false
): "high" | "low" | "auto" {
  if (isHero) return "high"
  if (isAboveFold && !isBackground) return "high"
  return "low"
}

/**
 * Create image props for Next.js Image component
 */
export function createNextImageProps(
  src: string,
  options: {
    alt: string
    width?: number
    height?: number
    quality?: number
    priority?: boolean
    fill?: boolean
    sizes?: string
    className?: string
  }
) {
  const { alt, width, height, quality = 75, priority = false, fill = false, sizes, className } = options

  const baseProps = {
    src,
    alt,
    quality,
    priority,
    className,
    ...(sizes && { sizes }),
  }

  if (fill) {
    return {
      ...baseProps,
      fill: true,
    }
  }

  return {
    ...baseProps,
    width,
    height,
  }
}

/**
 * Convert image to different format (client-side)
 */
export function convertImageFormat(file: File, targetFormat: "jpeg" | "png" | "webp", quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Image conversion not available on server"))
      return
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      if (ctx) {
        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to convert image"))
            }
          },
          `image/${targetFormat}`,
          quality
        )
      } else {
        reject(new Error("Canvas context not available"))
      }
    }

    img.onerror = () => reject(new Error("Failed to load image for conversion"))
    img.src = URL.createObjectURL(file)
  })
}
