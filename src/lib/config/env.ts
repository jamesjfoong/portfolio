/**
 * Environment Configuration
 * 
 * Centralizes environment variable handling with validation and type safety.
 * Provides fallbacks and validates required environment variables.
 */

export interface EnvironmentConfig {
  // Node.js environment
  NODE_ENV: string
  
  // Next.js configuration
  NEXT_PUBLIC_SITE_URL: string
  NEXT_PUBLIC_APP_NAME: string
  
  // GitHub configuration
  GITHUB_TOKEN: string
  GITHUB_OWNER: string
  GITHUB_REPO: string
  GITHUB_BRANCH: string
  
  // Cache configuration
  ENABLE_FILE_CACHE: boolean
  CACHE_MAX_SIZE_MB: number
  CACHE_TTL_SECONDS: number
  
  // Performance monitoring
  ENABLE_PERFORMANCE_MONITORING: boolean
  PERFORMANCE_SAMPLE_RATE: number
  
  // Development settings
  ENABLE_DEBUG_LOGGING: boolean
  DEFAULT_LOCALE: string
  DEFAULT_TIMEZONE: string
  
  // Feature flags
  ENABLE_ANALYTICS: boolean
  ENABLE_ERROR_REPORTING: boolean
}

// Helper functions
function validateRequired(name: string, value?: string): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`)
  }
  return value
}

function parseBoolean(value?: string, defaultValue = false): boolean {
  if (!value) return defaultValue
  return ['true', '1', 'yes'].includes(value.toLowerCase())
}

function createEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv = process.env.NODE_ENV || 'development'
  const isProduction = nodeEnv === 'production'
  const isDevelopment = nodeEnv === 'development'

  return {
    // Node.js environment
    NODE_ENV: nodeEnv,
    
    // Next.js configuration
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Portfolio',
    
    // GitHub configuration - Only require token in production
    GITHUB_TOKEN: isProduction ? validateRequired('GITHUB_TOKEN', process.env.GITHUB_TOKEN) : (process.env.GITHUB_TOKEN || 'dev-token'),
    GITHUB_OWNER: process.env.GITHUB_OWNER || 'portfolio-user',
    GITHUB_REPO: process.env.GITHUB_REPO || 'portfolio-content',
    GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
    
    // Cache configuration
    ENABLE_FILE_CACHE: parseBoolean(process.env.ENABLE_FILE_CACHE, isProduction),
    CACHE_MAX_SIZE_MB: parseInt(process.env.CACHE_MAX_SIZE_MB || '256', 10),
    CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '1800', 10),
    
    // Performance monitoring
    ENABLE_PERFORMANCE_MONITORING: parseBoolean(process.env.ENABLE_PERFORMANCE_MONITORING, isProduction),
    PERFORMANCE_SAMPLE_RATE: parseFloat(process.env.PERFORMANCE_SAMPLE_RATE || (isProduction ? '0.1' : '1.0')),
    
    // Development settings
    ENABLE_DEBUG_LOGGING: parseBoolean(process.env.ENABLE_DEBUG_LOGGING, isDevelopment),
    DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'en-US',
    DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'UTC',
    
    // Feature flags
    ENABLE_ANALYTICS: parseBoolean(process.env.ENABLE_ANALYTICS, isProduction),
    ENABLE_ERROR_REPORTING: parseBoolean(process.env.ENABLE_ERROR_REPORTING, isProduction)
  }
}

// Create configuration instance
const environmentConfig = createEnvironmentConfig()

// Environment helpers
export const isDevelopment = environmentConfig.NODE_ENV === 'development'
export const isProduction = environmentConfig.NODE_ENV === 'production'
export const isTest = environmentConfig.NODE_ENV === 'test'

// Validation function for startup checks
export function validateEnvironment(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate required fields in production
  if (isProduction) {
    if (!environmentConfig.GITHUB_TOKEN || environmentConfig.GITHUB_TOKEN === 'dev-token') {
      errors.push('GITHUB_TOKEN is required in production')
    }
  }

  // Validate numeric ranges
  if (environmentConfig.CACHE_MAX_SIZE_MB < 1) {
    errors.push('CACHE_MAX_SIZE_MB must be at least 1')
  }

  if (environmentConfig.CACHE_TTL_SECONDS < 1) {
    errors.push('CACHE_TTL_SECONDS must be at least 1')
  }

  if (environmentConfig.PERFORMANCE_SAMPLE_RATE < 0 || environmentConfig.PERFORMANCE_SAMPLE_RATE > 1) {
    errors.push('PERFORMANCE_SAMPLE_RATE must be between 0 and 1')
  }

  // Check for development warnings
  if (isDevelopment) {
    if (!process.env.GITHUB_TOKEN) {
      warnings.push('GITHUB_TOKEN not set - using development placeholder')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Export the configuration
export const env = environmentConfig

// Export default
export default environmentConfig