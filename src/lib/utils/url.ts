/**
 * URL Utilities
 *
 * Comprehensive URL handling utilities for slug generation, validation,
 * query parameter management, and SEO-friendly URL construction.
 */

import { env } from "../config/env"

// URL validation options
export interface UrlValidationOptions {
  allowRelative?: boolean
  allowFragments?: boolean
  allowQuery?: boolean
  requiredProtocols?: string[]
  maxLength?: number
}

// Slug generation options
export interface SlugOptions {
  maxLength?: number
  separator?: string
  lowercase?: boolean
  removeStopWords?: boolean
  customReplacements?: Record<string, string>
}

// Query parameter options
export interface QueryOptions {
  encodeValues?: boolean
  skipNull?: boolean
  skipEmpty?: boolean
  arrayFormat?: "brackets" | "comma" | "repeat"
}

/**
 * Generate URL-safe slug from text
 */
export function createSlug(text: string, options: SlugOptions = {}): string {
  const {
    maxLength = 100,
    separator = "-",
    lowercase = true,
    removeStopWords = false,
    customReplacements = {},
  } = options

  let slug = text

  // Apply custom replacements first
  Object.entries(customReplacements).forEach(([from, to]) => {
    slug = slug.replace(new RegExp(from, "gi"), to)
  })

  // Convert to lowercase if requested
  if (lowercase) {
    slug = slug.toLowerCase()
  }

  // Remove stop words if requested
  if (removeStopWords) {
    const stopWords = [
      "a",
      "an",
      "and",
      "are",
      "as",
      "at",
      "be",
      "by",
      "for",
      "from",
      "has",
      "he",
      "in",
      "is",
      "it",
      "its",
      "of",
      "on",
      "that",
      "the",
      "to",
      "was",
      "will",
      "with",
    ]
    const words = slug.split(/\s+/)
    slug = words.filter(word => !stopWords.includes(word)).join(" ")
  }

  // Replace accented characters
  slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks

  // Replace special characters and spaces
  slug = slug
    .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove special characters
    .replace(/\s+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`${separator}+`, "g"), separator) // Remove multiple separators
    .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "") // Trim separators

  // Truncate if needed
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength)
    // Try to cut at word boundary
    const lastSeparator = slug.lastIndexOf(separator)
    if (lastSeparator > maxLength * 0.7) {
      slug = slug.substring(0, lastSeparator)
    }
  }

  return slug
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string, options: UrlValidationOptions = {}): boolean {
  const {
    allowRelative = false,
    allowFragments = true,
    allowQuery = true,
    requiredProtocols = ["http", "https"],
    maxLength = 2048,
  } = options

  if (!url || url.length > maxLength) {
    return false
  }

  // Check for relative URLs
  if (allowRelative && url.startsWith("/")) {
    return true
  }

  try {
    const urlObj = new URL(url)

    // Check protocol
    const protocol = urlObj.protocol.slice(0, -1) // Remove trailing ':'
    if (!requiredProtocols.includes(protocol)) {
      return false
    }

    // Check fragments
    if (!allowFragments && urlObj.hash) {
      return false
    }

    // Check query parameters
    if (!allowQuery && urlObj.search) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Parse query string into object
 */
export function parseQuery(queryString: string): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {}

  if (!queryString) {
    return params
  }

  // Remove leading '?' if present
  const cleanQuery = queryString.startsWith("?") ? queryString.slice(1) : queryString

  cleanQuery.split("&").forEach(param => {
    const [key, value = ""] = param.split("=").map(decodeURIComponent)

    if (key in params) {
      // Convert to array if multiple values
      if (Array.isArray(params[key])) {
        ;(params[key] as string[]).push(value)
      } else {
        params[key] = [params[key] as string, value]
      }
    } else {
      params[key] = value
    }
  })

  return params
}

/**
 * Build query string from object
 */
export function buildQuery(params: Record<string, unknown>, options: QueryOptions = {}): string {
  const { encodeValues = true, skipNull = true, skipEmpty = false, arrayFormat = "brackets" } = options

  const pairs: string[] = []

  Object.entries(params).forEach(([key, value]) => {
    // Skip null/undefined values if requested
    if (skipNull && (value === null || value === undefined)) {
      return
    }

    // Skip empty strings if requested
    if (skipEmpty && value === "") {
      return
    }

    const processValue = (val: unknown, k: string): void => {
      const stringValue = String(val)
      const encodedValue = encodeValues ? encodeURIComponent(stringValue) : stringValue
      const encodedKey = encodeValues ? encodeURIComponent(k) : k
      pairs.push(`${encodedKey}=${encodedValue}`)
    }

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach(item => {
        switch (arrayFormat) {
          case "brackets":
            processValue(item, `${key}[]`)
            break
          case "comma":
            // Will be handled after the loop
            break
          case "repeat":
          default:
            processValue(item, key)
            break
        }
      })

      // Handle comma format
      if (arrayFormat === "comma" && value.length > 0) {
        const encodedKey = encodeValues ? encodeURIComponent(key) : key
        const encodedValues = value.map(v => (encodeValues ? encodeURIComponent(String(v)) : String(v))).join(",")
        pairs.push(`${encodedKey}=${encodedValues}`)
      }
    } else {
      processValue(value, key)
    }
  })

  return pairs.join("&")
}

/**
 * Combine URL with query parameters
 */
export function addQuery(url: string, params: Record<string, unknown>, options?: QueryOptions): string {
  const query = buildQuery(params, options)

  if (!query) {
    return url
  }

  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}${query}`
}

/**
 * Remove query parameters from URL
 */
export function removeQuery(url: string, keysToRemove?: string[]): string {
  try {
    const urlObj = new URL(url, "http://example.com") // Handle relative URLs

    if (keysToRemove) {
      keysToRemove.forEach(key => {
        urlObj.searchParams.delete(key)
      })
    } else {
      // Remove all query parameters
      urlObj.search = ""
    }

    // Return original format (relative vs absolute)
    if (url.startsWith("http")) {
      return urlObj.toString()
    } else {
      return urlObj.pathname + urlObj.search + urlObj.hash
    }
  } catch {
    return url
  }
}

/**
 * Extract domain from URL
 */
export function getDomain(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return null
  }
}

/**
 * Check if URL is external (different domain)
 */
export function isExternalUrl(url: string, baseDomain?: string): boolean {
  try {
    const urlObj = new URL(url)
    const currentDomain = baseDomain || (typeof window !== "undefined" ? window.location.hostname : "")
    return urlObj.hostname !== currentDomain
  } catch {
    return false // Relative URLs are not external
  }
}

/**
 * Normalize URL (remove trailing slash, etc.)
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)

    // Remove trailing slash from pathname (except root)
    if (urlObj.pathname !== "/" && urlObj.pathname.endsWith("/")) {
      urlObj.pathname = urlObj.pathname.slice(0, -1)
    }

    // Sort query parameters for consistency
    const params = Array.from(urlObj.searchParams.entries()).sort(([a], [b]) => a.localeCompare(b))

    urlObj.search = ""
    params.forEach(([key, value]) => {
      urlObj.searchParams.append(key, value)
    })

    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Generate SEO-friendly URL for content
 */
export function createContentUrl(
  type: "blog" | "project" | "page",
  slug: string,
  options: { includeDate?: boolean; date?: Date } = {}
): string {
  const { includeDate = false, date } = options
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || ""

  let path = `/${type}`

  if (includeDate && date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    path += `/${year}/${month}`
  }

  path += `/${slug}`

  return `${baseUrl}${path}`
}

/**
 * Generate canonical URL
 */
export function createCanonicalUrl(path: string): string {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || ""
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return normalizeUrl(`${baseUrl}${cleanPath}`)
}

/**
 * Extract file extension from URL
 */
export function getFileExtension(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const lastDot = pathname.lastIndexOf(".")

    if (lastDot === -1 || lastDot === pathname.length - 1) {
      return null
    }

    return pathname.substring(lastDot + 1).toLowerCase()
  } catch {
    return null
  }
}

/**
 * Join URL paths safely
 */
export function joinPaths(...paths: string[]): string {
  return paths
    .filter(path => path && path.length > 0)
    .map((path, index) => {
      // Remove leading slash from non-first segments
      if (index > 0 && path.startsWith("/")) {
        path = path.slice(1)
      }

      // Remove trailing slash from non-last segments
      if (index < paths.length - 1 && path.endsWith("/")) {
        path = path.slice(0, -1)
      }

      return path
    })
    .join("/")
}

/**
 * Create breadcrumb from URL path
 */
export function createBreadcrumb(url: string): Array<{ name: string; path: string }> {
  try {
    const urlObj = new URL(url, "http://example.com")
    const segments = urlObj.pathname.split("/").filter(segment => segment.length > 0)

    const breadcrumb = [{ name: "Home", path: "/" }]

    let currentPath = ""
    segments.forEach(segment => {
      currentPath += `/${segment}`
      const name = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      breadcrumb.push({ name, path: currentPath })
    })

    return breadcrumb
  } catch {
    return [{ name: "Home", path: "/" }]
  }
}

/**
 * Validate and sanitize redirect URL
 */
export function sanitizeRedirectUrl(url: string, allowedDomains: string[] = []): string | null {
  try {
    // Allow relative URLs
    if (url.startsWith("/") && !url.startsWith("//")) {
      return url
    }

    const urlObj = new URL(url)

    // Check if domain is in allowed list
    if (allowedDomains.length > 0) {
      if (!allowedDomains.includes(urlObj.hostname)) {
        return null
      }
    }

    // Block dangerous protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return null
    }

    return url
  } catch {
    return null
  }
}

/**
 * Create hash from URL for caching
 */
export function createUrlHash(url: string): string {
  // Simple hash function for URL-based cache keys
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Get URL without sensitive parameters
 */
export function sanitizeUrlForLogging(url: string): string {
  const sensitiveParams = ["token", "key", "secret", "password", "auth", "api_key"]

  try {
    const urlObj = new URL(url)

    sensitiveParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, "[REDACTED]")
      }
    })

    return urlObj.toString()
  } catch {
    return url
  }
}
