/**
 * Date Formatting Utilities
 *
 * Comprehensive date formatting utilities with internationalization support,
 * relative date formatting, and timezone handling.
 */

import { env } from "../config/env"

// Date format options
export interface DateFormatOptions {
  format?: "full" | "long" | "medium" | "short" | "custom"
  locale?: string
  timeZone?: string
  includeTime?: boolean
  relative?: boolean
  customFormat?: string
}

// Relative time configuration
interface RelativeTimeConfig {
  now: string
  seconds: string
  minutes: string
  hours: string
  days: string
  weeks: string
  months: string
  years: string
}

const relativeTimeStrings: Record<string, RelativeTimeConfig> = {
  en: {
    now: "just now",
    seconds: "second",
    minutes: "minute",
    hours: "hour",
    days: "day",
    weeks: "week",
    months: "month",
    years: "year",
  },
  // Add more locales as needed
}

/**
 * Format a date according to the specified options
 */
export function formatDate(date: Date | string | number, options: DateFormatOptions = {}): string {
  const { format = "medium", locale = "en-US", timeZone, includeTime = false, relative = false, customFormat } = options

  const dateObj = new Date(date)

  // Validate date
  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided")
  }

  // Return relative time if requested
  if (relative) {
    return formatRelativeDate(dateObj, locale)
  }

  // Custom format
  if (format === "custom" && customFormat) {
    return formatCustomDate(dateObj, customFormat, locale, timeZone)
  }

  // Standard Intl.DateTimeFormat options
  const formatOptions: Intl.DateTimeFormatOptions = {
    ...(timeZone && { timeZone }),
    ...getDateFormatStyle(format, includeTime),
  }

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)
}

/**
 * Get standard format styles
 */
function getDateFormatStyle(format: string, includeTime: boolean): Intl.DateTimeFormatOptions {
  const baseOptions: Record<string, Intl.DateTimeFormatOptions> = {
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    medium: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    short: {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    },
  }

  const options = baseOptions[format] || baseOptions.medium

  if (includeTime) {
    return {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  }

  return options
}

/**
 * Format relative date (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeDate(date: Date | string | number, locale = "en-US"): string {
  const dateObj = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  const isInFuture = diffMs < 0
  const absValue = Math.abs

  const localeConfig = relativeTimeStrings[locale.split("-")[0]] || relativeTimeStrings.en

  // Use Intl.RelativeTimeFormat if available
  if (typeof Intl !== "undefined" && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

    if (Math.abs(diffSeconds) < 60) {
      return Math.abs(diffSeconds) < 10 ? localeConfig.now : rtf.format(-diffSeconds, "second")
    } else if (Math.abs(diffMinutes) < 60) {
      return rtf.format(-diffMinutes, "minute")
    } else if (Math.abs(diffHours) < 24) {
      return rtf.format(-diffHours, "hour")
    } else if (Math.abs(diffDays) < 7) {
      return rtf.format(-diffDays, "day")
    } else if (Math.abs(diffWeeks) < 4) {
      return rtf.format(-diffWeeks, "week")
    } else if (Math.abs(diffMonths) < 12) {
      return rtf.format(-diffMonths, "month")
    } else {
      return rtf.format(-diffYears, "year")
    }
  }

  // Fallback for older browsers
  if (absValue(diffSeconds) < 60) {
    return absValue(diffSeconds) < 10
      ? localeConfig.now
      : `${absValue(diffSeconds)} ${localeConfig.seconds}${absValue(diffSeconds) !== 1 ? "s" : ""} ${isInFuture ? "from now" : "ago"}`
  } else if (absValue(diffMinutes) < 60) {
    return `${absValue(diffMinutes)} ${localeConfig.minutes}${absValue(diffMinutes) !== 1 ? "s" : ""} ${isInFuture ? "from now" : "ago"}`
  } else if (absValue(diffHours) < 24) {
    return `${absValue(diffHours)} ${localeConfig.hours}${absValue(diffHours) !== 1 ? "s" : ""} ${isInFuture ? "from now" : "ago"}`
  } else if (absValue(diffDays) < 7) {
    return `${absValue(diffDays)} ${localeConfig.days}${absValue(diffDays) !== 1 ? "s" : ""} ${isInFuture ? "from now" : "ago"}`
  } else if (absValue(diffWeeks) < 4) {
    return `${absValue(diffWeeks)} ${localeConfig.weeks}${absValue(diffWeeks) !== 1 ? "s" : ""} ${isInFuture ? "from now" : "ago"}`
  } else if (absValue(diffMonths) < 12) {
    return `${absValue(diffMonths)} ${localeConfig.months}${absValue(diffMonths) !== 1 ? "s" : ""} ${isInFuture ? "from now" : "ago"}`
  } else {
    return `${absValue(diffYears)} ${localeConfig.years}${absValue(diffYears) !== 1 ? "s" : ""} ${isInFuture ? "from now" : "ago"}`
  }
}

/**
 * Format date with custom format string
 */
function formatCustomDate(date: Date, format: string, _locale = "en-US", _timeZone?: string): string {
  // Simple format token replacement
  // This could be extended to support more sophisticated formatting
  const tokens: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    YY: date.getFullYear().toString().slice(-2),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    M: (date.getMonth() + 1).toString(),
    DD: date.getDate().toString().padStart(2, "0"),
    D: date.getDate().toString(),
    HH: date.getHours().toString().padStart(2, "0"),
    H: date.getHours().toString(),
    mm: date.getMinutes().toString().padStart(2, "0"),
    m: date.getMinutes().toString(),
    ss: date.getSeconds().toString().padStart(2, "0"),
    s: date.getSeconds().toString(),
  }

  let formatted = format
  Object.entries(tokens).forEach(([token, value]) => {
    formatted = formatted.replace(new RegExp(token, "g"), value)
  })

  return formatted
}

/**
 * Format date for blog posts and content
 */
export function formatContentDate(
  date: Date | string | number,
  options: { includeTime?: boolean; relative?: boolean } = {}
): string {
  const { includeTime = false, relative = false } = options

  return formatDate(date, {
    format: "long",
    includeTime,
    relative,
    locale: env.DEFAULT_LOCALE || "en-US",
  })
}

/**
 * Format date for timestamps (precise formatting)
 */
export function formatTimestamp(date: Date | string | number, options: { timeZone?: string } = {}): string {
  return formatDate(date, {
    format: "full",
    includeTime: true,
    timeZone: options.timeZone || env.DEFAULT_TIMEZONE,
  })
}

/**
 * Format date for URLs (safe characters)
 */
export function formatUrlDate(date: Date | string | number): string {
  return formatDate(date, {
    customFormat: "YYYY-MM-DD",
    format: "custom",
  })
}

/**
 * Format date range
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number,
  options: DateFormatOptions = {}
): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Same day
  if (start.toDateString() === end.toDateString()) {
    const dateStr = formatDate(start, options)
    if (options.includeTime) {
      const startTime = formatDate(start, { customFormat: "HH:mm", format: "custom" })
      const endTime = formatDate(end, { customFormat: "HH:mm", format: "custom" })
      return `${dateStr}, ${startTime} - ${endTime}`
    }
    return dateStr
  }

  // Different days
  const startStr = formatDate(start, options)
  const endStr = formatDate(end, options)
  return `${startStr} - ${endStr}`
}

/**
 * Get timezone offset string
 */
export function getTimezoneOffset(date: Date = new Date()): string {
  const offset = -date.getTimezoneOffset()
  const hours = Math.floor(offset / 60)
  const minutes = offset % 60
  const sign = offset >= 0 ? "+" : "-"

  return `${sign}${Math.abs(hours).toString().padStart(2, "0")}:${Math.abs(minutes).toString().padStart(2, "0")}`
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string | number): boolean {
  const dateObj = new Date(date)
  const today = new Date()

  return dateObj.toDateString() === today.toDateString()
}

/**
 * Check if date is this week
 */
export function isThisWeek(date: Date | string | number): boolean {
  const dateObj = new Date(date)
  const today = new Date()
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

  return dateObj >= weekStart && dateObj < weekEnd
}

/**
 * Parse various date formats
 */
export function parseDate(input: string | number | Date): Date {
  if (input instanceof Date) {
    return input
  }

  if (typeof input === "number") {
    return new Date(input)
  }

  // Try to parse string
  const parsed = new Date(input)
  if (!isNaN(parsed.getTime())) {
    return parsed
  }

  // Try ISO format variations
  const isoFormats = [
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, // ISO 8601
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
  ]

  for (const format of isoFormats) {
    if (format.test(input)) {
      const attempt = new Date(input)
      if (!isNaN(attempt.getTime())) {
        return attempt
      }
    }
  }

  throw new Error(`Unable to parse date: ${input}`)
}

/**
 * Get date parts as object
 */
export function getDateParts(date: Date | string | number): {
  year: number
  month: number
  day: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  dayOfWeek: number
  dayOfYear: number
  weekOfYear: number
} {
  const dateObj = new Date(date)

  const startOfYear = new Date(dateObj.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((dateObj.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1

  const startOfWeek = new Date(dateObj.getFullYear(), 0, 1 - new Date(dateObj.getFullYear(), 0, 1).getDay())
  const weekOfYear = Math.floor((dateObj.getTime() - startOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1, // 1-based month
    day: dateObj.getDate(),
    hours: dateObj.getHours(),
    minutes: dateObj.getMinutes(),
    seconds: dateObj.getSeconds(),
    milliseconds: dateObj.getMilliseconds(),
    dayOfWeek: dateObj.getDay(), // 0 = Sunday
    dayOfYear,
    weekOfYear,
  }
}
