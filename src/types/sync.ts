// Content synchronization types

export interface SyncOperation {
  id: string
  type: "create" | "update" | "delete"
  contentType: "blog" | "project"
  slug: string
  filePath: string
  timestamp: Date
  status: "pending" | "processing" | "completed" | "failed"
  error?: string
  retryCount: number
  maxRetries: number
}

export interface SyncBatch {
  id: string
  operations: SyncOperation[]
  startedAt: Date
  completedAt?: Date
  status: "pending" | "processing" | "completed" | "failed" | "partial"
  stats: {
    total: number
    completed: number
    failed: number
    skipped: number
  }
}

export interface SyncConfig {
  batchSize: number
  retryAttempts: number
  retryDelay: number // milliseconds
  parallelOperations: number
  timeoutPerOperation: number // milliseconds
  enableValidation: boolean
  skipOnValidationError: boolean
}

export interface SyncResult {
  success: boolean
  batchId: string
  startTime: Date
  endTime: Date
  duration: number // milliseconds
  itemsSynced: number
  itemsSkipped: number
  itemsFailed: number
  errors: string[]
  warnings: string[]
  operations: SyncOperation[]
  cacheInvalidated: boolean
  nextSyncAt?: Date
}

export interface SyncStatus {
  isActive: boolean
  currentBatch?: SyncBatch
  lastSync?: SyncResult
  nextScheduledSync?: Date
  queuedOperations: number
  failedOperations: number
  rateLimitStatus: {
    remaining: number
    resetAt: Date
  }
}

export interface ChangeDetectionResult {
  hasChanges: boolean
  changedFiles: Array<{
    path: string
    type: "added" | "modified" | "deleted"
    contentHash: string
    lastModified: Date
  }>
  unchangedFiles: string[]
  errors: Array<{
    path: string
    error: string
  }>
}

export interface SyncEvent {
  type: "sync.started" | "sync.completed" | "sync.failed" | "operation.completed" | "operation.failed"
  timestamp: Date
  data: {
    batchId?: string
    operationId?: string
    error?: string
    [key: string]: unknown
  }
}
