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

class EnvironmentValidator {
  private static instance: EnvironmentValidator
  private config: EnvironmentConfig
  private errors: string[] = []
  private warnings: string[] = []

  private constructor() {
    this.config = this.loadAndValidateConfig()
  }

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator()
    }
    return EnvironmentValidator.instance
  }

  private loadAndValidateConfig(): EnvironmentConfig {
    const config: EnvironmentConfig = {
      // Environment
      NODE_ENV: this.getEnvValue('NODE_ENV', 'development') as 'development' | 'production' | 'test',
      PORT: this.getEnvNumber('PORT', 3000),
      BASE_URL: this.getEnvValue('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
      
      // GitHub
      GITHUB_TOKEN: this.getEnvValue('GITHUB_TOKEN'),
      GITHUB_OWNER: this.getEnvValue('GITHUB_OWNER'),
      GITHUB_REPO: this.getEnvValue('GITHUB_REPO'),
      GITHUB_CONTENT_PATH: this.getEnvValue('GITHUB_CONTENT_PATH', 'content'),
      
      // Cache
      CACHE_TTL_SECONDS: this.getEnvNumber('CACHE_TTL_SECONDS', 300), // 5 minutes
      CACHE_MAX_SIZE_MB: this.getEnvNumber('CACHE_MAX_SIZE_MB', 100),
      ENABLE_FILE_CACHE: this.getEnvBoolean('ENABLE_FILE_CACHE', true),
      
      // API
      API_RATE_LIMIT_REQUESTS: this.getEnvNumber('API_RATE_LIMIT_REQUESTS', 100),
      API_RATE_LIMIT_WINDOW_MS: this.getEnvNumber('API_RATE_LIMIT_WINDOW_MS', 60000), // 1 minute
      API_REQUEST_TIMEOUT_MS: this.getEnvNumber('API_REQUEST_TIMEOUT_MS', 10000), // 10 seconds
      
      // Sync
      SYNC_INTERVAL_MINUTES: this.getEnvNumber('SYNC_INTERVAL_MINUTES', 5),
      SYNC_ENABLED: this.getEnvBoolean('SYNC_ENABLED', true),
      
      // Logging
      LOG_LEVEL: this.getEnvValue('LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
      ENABLE_CONSOLE_LOGGING: this.getEnvBoolean('ENABLE_CONSOLE_LOGGING', true),
      LOG_FILE_MAX_SIZE_MB: this.getEnvNumber('LOG_FILE_MAX_SIZE_MB', 10),
      
      // Performance
      ENABLE_PERFORMANCE_MONITORING: this.getEnvBoolean('ENABLE_PERFORMANCE_MONITORING', false),
      PERFORMANCE_SAMPLE_RATE: this.getEnvNumber('PERFORMANCE_SAMPLE_RATE', 0.1),
      
      // Security
      PREVIEW_TOKEN_SECRET: this.getEnvValue('PREVIEW_TOKEN_SECRET'),
      WEBHOOK_SECRET: this.getEnvValue('WEBHOOK_SECRET'),
    }

    this.validateConfig(config)
    return config
  }

  private getEnvValue(key: string, defaultValue?: string): string | undefined {
    const value = process.env[key]
    if (value !== undefined) {
      return value
    }
    return defaultValue
  }

  private getEnvNumber(key: string, defaultValue: number): number {
    const value = process.env[key]
    if (value !== undefined) {
      const parsed = parseInt(value, 10)
      if (isNaN(parsed)) {
        this.warnings.push(`Invalid number for ${key}: ${value}, using default: ${defaultValue}`)
        return defaultValue
      }
      return parsed
    }
    return defaultValue
  }

  private getEnvBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key]
    if (value !== undefined) {
      return value.toLowerCase() === 'true'
    }
    return defaultValue
  }

  private validateConfig(config: EnvironmentConfig): void {
    // Validate NODE_ENV
    if (!['development', 'production', 'test'].includes(config.NODE_ENV)) {
      this.errors.push(`Invalid NODE_ENV: ${config.NODE_ENV}`)
    }

    // Validate LOG_LEVEL
    if (!['debug', 'info', 'warn', 'error'].includes(config.LOG_LEVEL)) {
      this.errors.push(`Invalid LOG_LEVEL: ${config.LOG_LEVEL}`)
    }

    // Validate numeric ranges
    if (config.PORT < 1 || config.PORT > 65535) {
      this.errors.push(`Invalid PORT: ${config.PORT} (must be 1-65535)`)
    }

    if (config.CACHE_TTL_SECONDS < 0) {
      this.errors.push(`Invalid CACHE_TTL_SECONDS: ${config.CACHE_TTL_SECONDS} (must be >= 0)`)
    }

    if (config.PERFORMANCE_SAMPLE_RATE < 0 || config.PERFORMANCE_SAMPLE_RATE > 1) {
      this.errors.push(`Invalid PERFORMANCE_SAMPLE_RATE: ${config.PERFORMANCE_SAMPLE_RATE} (must be 0-1)`)
    }

    // Production-specific validations
    if (config.NODE_ENV === 'production') {
      if (!config.GITHUB_TOKEN) {
        this.errors.push('GITHUB_TOKEN is required in production')
      }
      if (!config.GITHUB_OWNER) {
        this.errors.push('GITHUB_OWNER is required in production')
      }
      if (!config.GITHUB_REPO) {
        this.errors.push('GITHUB_REPO is required in production')
      }
      if (!config.PREVIEW_TOKEN_SECRET) {
        this.warnings.push('PREVIEW_TOKEN_SECRET not set in production - preview features will be disabled')
      }
    }

    // Warn about development defaults
    if (config.NODE_ENV === 'development') {
      if (!config.GITHUB_TOKEN) {
        this.warnings.push('GITHUB_TOKEN not set - GitHub API features will be limited')
      }
    }
  }

  getConfig(): EnvironmentConfig {
    return { ...this.config }
  }

  getErrors(): string[] {
    return [...this.errors]
  }

  getWarnings(): string[] {
    return [...this.warnings]
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  hasWarnings(): boolean {
    return this.warnings.length > 0
  }

  // Convenience getters for commonly used values
  get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development'
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production'
  }

  get isTest(): boolean {
    return this.config.NODE_ENV === 'test'
  }
}

// Singleton instance
const envValidator = EnvironmentValidator.getInstance()

// Export configuration object
export const env = envValidator.getConfig()

// Export validation results
export const envErrors = envValidator.getErrors()
export const envWarnings = envValidator.getWarnings()

// Export convenience methods
export const isDevelopment = envValidator.isDevelopment
export const isProduction = envValidator.isProduction
export const isTest = envValidator.isTest

// Validation function for startup checks
export function validateEnvironment(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  return {
    isValid: !envValidator.hasErrors(),
    errors: envValidator.getErrors(),
    warnings: envValidator.getWarnings()
  }
}

// Helper to get environment-specific values
export function getEnvSpecific<T>(
  development: T,
  production: T,
  test?: T
): T {
  switch (env.NODE_ENV) {
    case 'development':
      return development
    case 'production':
      return production
    case 'test':
      return test ?? development
    default:
      return development
  }
}

export type { EnvironmentConfig }
export default env