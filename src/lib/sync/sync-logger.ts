import { promises as fs } from "fs"
import { join } from "path"

import type { SyncOptions } from "@/types/sync"

import type { SyncStats } from "./sync-orchestrator"

export interface SyncLogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  syncId: string
  message: string
  data?: any
}

export interface SyncSession {
  syncId: string
  startTime: string
  endTime?: string
  options: SyncOptions
  stats?: SyncStats
  status: "running" | "completed" | "failed" | "cancelled"
  error?: string
}

export class SyncLogger {
  private logDir: string
  private currentSession: SyncSession | null = null
  private logBuffer: SyncLogEntry[] = []
  private readonly MAX_BUFFER_SIZE = 100
  private readonly MAX_LOG_FILES = 30

  constructor() {
    this.logDir = join(process.cwd(), "logs", "sync")
    this.ensureLogDirectory()
  }

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.logDir, { recursive: true })
    } catch (error) {
      console.error("Failed to create log directory:", error)
    }
  }

  async logSyncStart(syncId: string, options: SyncOptions): Promise<void> {
    const session: SyncSession = {
      syncId,
      startTime: new Date().toISOString(),
      options,
      status: "running",
    }

    this.currentSession = session

    await this.log("info", syncId, "Sync operation started", { options })
    await this.saveSession()
  }

  async logSyncComplete(syncId: string, stats: SyncStats, message?: string): Promise<void> {
    if (this.currentSession && this.currentSession.syncId === syncId) {
      this.currentSession.endTime = new Date().toISOString()
      this.currentSession.stats = stats
      this.currentSession.status = "completed"
    }

    await this.log("info", syncId, message || "Sync operation completed", { stats })
    await this.saveSession()
    await this.flushBuffer()
  }

  async logSyncError(syncId: string, error: Error, stats: SyncStats): Promise<void> {
    if (this.currentSession && this.currentSession.syncId === syncId) {
      this.currentSession.endTime = new Date().toISOString()
      this.currentSession.stats = stats
      this.currentSession.status = "failed"
      this.currentSession.error = error.message
    }

    await this.log("error", syncId, `Sync operation failed: ${error.message}`, {
      error: {
        message: error.message,
        stack: error.stack,
      },
      stats,
    })
    await this.saveSession()
    await this.flushBuffer()
  }

  async logFileProcessed(syncId: string, filePath: string, action: string): Promise<void> {
    await this.log("info", syncId, `File ${action}: ${filePath}`)
  }

  async logFileError(syncId: string, filePath: string, error: Error): Promise<void> {
    await this.log("error", syncId, `Failed to process ${filePath}: ${error.message}`, {
      filePath,
      error: {
        message: error.message,
        stack: error.stack,
      },
    })
  }

  async info(message: string, data?: any): Promise<void> {
    await this.log("info", this.currentSession?.syncId || "system", message, data)
  }

  async warn(message: string, data?: any): Promise<void> {
    await this.log("warn", this.currentSession?.syncId || "system", message, data)
  }

  async error(message: string, data?: any): Promise<void> {
    await this.log("error", this.currentSession?.syncId || "system", message, data)
  }

  async debug(message: string, data?: any): Promise<void> {
    if (process.env.NODE_ENV === "development" || process.env.DEBUG_SYNC) {
      await this.log("debug", this.currentSession?.syncId || "system", message, data)
    }
  }

  private async log(
    level: "info" | "warn" | "error" | "debug",
    syncId: string,
    message: string,
    data?: any
  ): Promise<void> {
    const entry: SyncLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      syncId,
      message,
      data,
    }

    // Add to buffer
    this.logBuffer.push(entry)

    // Console output in development
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toLocaleTimeString()
      const prefix = `[${timestamp}] [${level.toUpperCase()}] [${syncId}]`

      switch (level) {
        case "error":
          console.error(prefix, message, data || "")
          break
        case "warn":
          console.warn(prefix, message, data || "")
          break
        case "debug":
          console.debug(prefix, message, data || "")
          break
        default:
          console.log(prefix, message, data || "")
      }
    }

    // Flush buffer if it's getting large
    if (this.logBuffer.length >= this.MAX_BUFFER_SIZE) {
      await this.flushBuffer()
    }
  }

  private async flushBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) return

    try {
      const logFile = join(this.logDir, `${this.getCurrentDate()}.log`)
      const logLines = `${this.logBuffer.map(entry => JSON.stringify(entry)).join("\n")}\n`

      await fs.appendFile(logFile, logLines, "utf8")
      this.logBuffer = []
    } catch (error) {
      console.error("Failed to flush log buffer:", error)
    }
  }

  private async saveSession(): Promise<void> {
    if (!this.currentSession) return

    try {
      const sessionFile = join(this.logDir, "sessions", `${this.currentSession.syncId}.json`)
      await fs.mkdir(join(this.logDir, "sessions"), { recursive: true })
      await fs.writeFile(sessionFile, JSON.stringify(this.currentSession, null, 2), "utf8")
    } catch (error) {
      console.error("Failed to save sync session:", error)
    }
  }

  async getLastSyncTime(): Promise<Date | undefined> {
    try {
      const sessionsDir = join(this.logDir, "sessions")
      const files = await fs.readdir(sessionsDir)

      if (files.length === 0) return undefined

      // Sort files by modification time and get the most recent
      const stats = await Promise.all(
        files.map(async file => ({
          file,
          mtime: (await fs.stat(join(sessionsDir, file))).mtime,
        }))
      )

      stats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      const latestFile = stats[0]?.file

      if (latestFile) {
        const sessionData = await fs.readFile(join(sessionsDir, latestFile), "utf8")
        const session: SyncSession = JSON.parse(sessionData)
        return new Date(session.endTime || session.startTime)
      }
    } catch (error) {
      console.error("Failed to get last sync time:", error)
    }

    return undefined
  }

  async getSyncHistory(limit: number = 10): Promise<SyncSession[]> {
    try {
      const sessionsDir = join(this.logDir, "sessions")
      const files = await fs.readdir(sessionsDir)

      // Sort files by modification time (newest first)
      const stats = await Promise.all(
        files.map(async file => ({
          file,
          mtime: (await fs.stat(join(sessionsDir, file))).mtime,
        }))
      )

      stats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      const recentFiles = stats.slice(0, limit).map(s => s.file)

      const sessions = await Promise.all(
        recentFiles.map(async file => {
          const sessionData = await fs.readFile(join(sessionsDir, file), "utf8")
          return JSON.parse(sessionData) as SyncSession
        })
      )

      return sessions
    } catch (error) {
      console.error("Failed to get sync history:", error)
      return []
    }
  }

  async cleanupOldLogs(): Promise<void> {
    try {
      // Clean up old log files
      const files = await fs.readdir(this.logDir)
      const logFiles = files
        .filter(f => f.endsWith(".log"))
        .sort()
        .reverse()

      if (logFiles.length > this.MAX_LOG_FILES) {
        const filesToDelete = logFiles.slice(this.MAX_LOG_FILES)
        await Promise.all(filesToDelete.map(file => fs.unlink(join(this.logDir, file))))
      }

      // Clean up old session files (keep last 100)
      const sessionsDir = join(this.logDir, "sessions")
      try {
        const sessionFiles = await fs.readdir(sessionsDir)
        if (sessionFiles.length > 100) {
          const stats = await Promise.all(
            sessionFiles.map(async file => ({
              file,
              mtime: (await fs.stat(join(sessionsDir, file))).mtime,
            }))
          )

          stats.sort((a, b) => a.mtime.getTime() - b.mtime.getTime())
          const filesToDelete = stats.slice(0, sessionFiles.length - 100).map(s => s.file)

          await Promise.all(filesToDelete.map(file => fs.unlink(join(sessionsDir, file))))
        }
      } catch {
        // Sessions directory might not exist yet
      }
    } catch (error) {
      console.error("Failed to cleanup old logs:", error)
    }
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split("T")[0]
  }

  async destroy(): Promise<void> {
    await this.flushBuffer()
    this.currentSession = null
  }
}

export default SyncLogger
