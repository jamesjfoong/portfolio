import type { SyncStats } from "./sync-orchestrator"

export interface SyncNotification {
  syncId: string
  type: "sync_complete" | "sync_error" | "sync_started"
  timestamp: string
  message: string
  stats?: SyncStats
  error?: Error
}

export interface NotificationChannel {
  name: string
  enabled: boolean
  config: Record<string, unknown>
}

export interface NotificationConfig {
  channels: {
    console: NotificationChannel
    file: NotificationChannel
    webhook?: NotificationChannel
    email?: NotificationChannel
  }
  onlyErrors: boolean
  minSeverity: "info" | "warn" | "error"
}

export class NotificationService {
  private config: NotificationConfig

  constructor() {
    this.config = {
      channels: {
        console: {
          name: "console",
          enabled: process.env.NODE_ENV === "development",
          config: {},
        },
        file: {
          name: "file",
          enabled: true,
          config: {
            path: "logs/notifications.json",
          },
        },
      },
      onlyErrors: process.env.NODE_ENV === "production",
      minSeverity: process.env.NODE_ENV === "development" ? "info" : "warn",
    }

    // Load webhook config from environment
    if (process.env.SYNC_WEBHOOK_URL) {
      this.config.channels.webhook = {
        name: "webhook",
        enabled: true,
        config: {
          url: process.env.SYNC_WEBHOOK_URL,
          secret: process.env.SYNC_WEBHOOK_SECRET,
        },
      }
    }
  }

  async sendSyncStarted(data: { syncId: string }): Promise<void> {
    const notification: SyncNotification = {
      syncId: data.syncId,
      type: "sync_started",
      timestamp: new Date().toISOString(),
      message: `Sync operation ${data.syncId} started`,
    }

    await this.sendNotification(notification, "info")
  }

  async sendSyncComplete(data: { syncId: string; stats: SyncStats; success: boolean }): Promise<void> {
    const notification: SyncNotification = {
      syncId: data.syncId,
      type: "sync_complete",
      timestamp: new Date().toISOString(),
      message: `Sync operation ${data.syncId} completed successfully`,
      stats: data.stats,
    }

    await this.sendNotification(notification, "info")
  }

  async sendSyncError(data: { syncId: string; error: Error; stats: SyncStats }): Promise<void> {
    const notification: SyncNotification = {
      syncId: data.syncId,
      type: "sync_error",
      timestamp: new Date().toISOString(),
      message: `Sync operation ${data.syncId} failed: ${data.error.message}`,
      stats: data.stats,
      error: data.error,
    }

    await this.sendNotification(notification, "error")
  }

  private async sendNotification(notification: SyncNotification, severity: "info" | "warn" | "error"): Promise<void> {
    // Skip if severity is below minimum
    if (this.getSeverityLevel(severity) < this.getSeverityLevel(this.config.minSeverity)) {
      return
    }

    // Skip if only errors are enabled and this isn't an error
    if (this.config.onlyErrors && severity !== "error") {
      return
    }

    const promises = []

    // Send to console
    if (this.config.channels.console.enabled) {
      promises.push(this.sendToConsole(notification, severity))
    }

    // Send to file
    if (this.config.channels.file.enabled) {
      promises.push(this.sendToFile(notification))
    }

    // Send to webhook
    if (this.config.channels.webhook?.enabled) {
      promises.push(this.sendToWebhook(notification))
    }

    // Wait for all notifications to complete
    await Promise.allSettled(promises)
  }

  private async sendToConsole(notification: SyncNotification, severity: "info" | "warn" | "error"): Promise<void> {
    const timestamp = new Date(notification.timestamp).toLocaleTimeString()
    const prefix = `[${timestamp}] [SYNC] [${notification.syncId}]`

    switch (severity) {
      case "error":
        console.error(prefix, notification.message, notification.error || "")
        break
      case "warn":
        console.warn(prefix, notification.message)
        break
      default:
        console.log(prefix, notification.message)
    }

    if (notification.stats) {
      const stats = notification.stats
      console.log(
        `  Stats: ${stats.processedFiles}/${stats.totalFiles} files, ${stats.errors} errors, ${stats.duration}ms`
      )
    }
  }

  private async sendToFile(notification: SyncNotification): Promise<void> {
    try {
      const { promises: fs } = await import("fs")
      const { join } = await import("path")

      const logPath = join(process.cwd(), "logs", "notifications.json")

      // Ensure directory exists
      const { dirname } = await import("path")
      await fs.mkdir(dirname(logPath), { recursive: true })

      // Read existing notifications
      let notifications: SyncNotification[] = []
      try {
        const content = await fs.readFile(logPath, "utf8")
        notifications = JSON.parse(content)
      } catch {
        // File doesn't exist or is empty
      }

      // Add new notification
      notifications.push(notification)

      // Keep only last 1000 notifications
      if (notifications.length > 1000) {
        notifications = notifications.slice(-1000)
      }

      // Write back to file
      await fs.writeFile(logPath, JSON.stringify(notifications, null, 2))
    } catch (error) {
      // Fallback to console if file logging fails
      console.error("Failed to write notification to file:", error)
    }
  }

  private async sendToWebhook(notification: SyncNotification): Promise<void> {
    if (!this.config.channels.webhook) return

    try {
      const url = this.config.channels.webhook.config.url as string
      const secret = this.config.channels.webhook.config.secret as string | undefined

      const payload = {
        ...notification,
        // Remove error object for JSON serialization
        error: notification.error
          ? {
              message: notification.error.message,
              stack: notification.error.stack,
            }
          : undefined,
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "GitHub-CMS-Sync/1.0",
      }

      // Add signature if secret is provided
      if (secret) {
        const crypto = await import("crypto")
        const signature = crypto.createHmac("sha256", secret).update(JSON.stringify(payload)).digest("hex")
        headers["X-Signature-256"] = `sha256=${signature}`
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Failed to send webhook notification:", error)
    }
  }

  private getSeverityLevel(severity: "info" | "warn" | "error"): number {
    switch (severity) {
      case "info":
        return 1
      case "warn":
        return 2
      case "error":
        return 3
      default:
        return 0
    }
  }

  updateConfig(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  async getRecentNotifications(limit: number = 50): Promise<SyncNotification[]> {
    try {
      const { promises: fs } = await import("fs")
      const { join } = await import("path")

      const logPath = join(process.cwd(), "logs", "notifications.json")
      const content = await fs.readFile(logPath, "utf8")
      const notifications: SyncNotification[] = JSON.parse(content)

      return notifications.slice(-limit).reverse() // Most recent first
    } catch {
      return []
    }
  }

  async clearNotifications(): Promise<void> {
    try {
      const { promises: fs } = await import("fs")
      const { join } = await import("path")

      const logPath = join(process.cwd(), "logs", "notifications.json")
      await fs.writeFile(logPath, "[]")
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    }
  }
}

export default NotificationService
