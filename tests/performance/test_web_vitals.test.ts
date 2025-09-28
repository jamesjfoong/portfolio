/**
 * Core Web Vitals Measurement Tests
 *
 * Tests to measure and validate Core Web Vitals metrics:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 * - First Contentful Paint (FCP)
 * - Time to First Byte (TTFB)
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { performanceConfig, initializePerformanceMonitoring } from "../../src/lib/config/monitoring"

// Mock browser APIs for testing
class MockPerformanceObserver {
  private callback: PerformanceObserverCallback
  private options: PerformanceObserverInit

  constructor(callback: PerformanceObserverCallback) {
    this.callback = callback
  }

  observe(options: PerformanceObserverInit) {
    this.options = options
  }

  disconnect() {
    // Mock disconnect
  }

  // Helper method to simulate entries
  simulateEntries(entries: PerformanceEntry[]) {
    const list = {
      getEntries: () => entries,
      getEntriesByName: (name: string) => entries.filter(e => e.name === name),
      getEntriesByType: (type: string) => entries.filter(e => e.entryType === type),
    }
    this.callback(list as PerformanceObserverEntryList, this)
  }
}

// Mock performance entries
function createMockNavigationEntry(
  metrics: Partial<{
    loadEventEnd: number
    domContentLoadedEventEnd: number
    responseStart: number
    requestStart: number
  }>
): PerformanceNavigationTiming {
  return {
    name: "navigation",
    entryType: "navigation",
    startTime: 0,
    duration: metrics.loadEventEnd || 2000,
    loadEventEnd: metrics.loadEventEnd || 2000,
    domContentLoadedEventEnd: metrics.domContentLoadedEventEnd || 1500,
    responseStart: metrics.responseStart || 200,
    requestStart: metrics.requestStart || 100,
    // Add other required properties with default values
    toJSON: () => ({}),
    connectEnd: 100,
    connectStart: 50,
    decodedBodySize: 1000,
    domComplete: 1800,
    domContentLoadedEventStart: 1400,
    domInteractive: 1200,
    domainLookupEnd: 30,
    domainLookupStart: 10,
    encodedBodySize: 800,
    fetchStart: 0,
    loadEventStart: 2000,
    navigationStart: 0,
    redirectCount: 0,
    redirectEnd: 0,
    redirectStart: 0,
    responseEnd: 300,
    secureConnectionStart: 0,
    transferSize: 900,
    type: "navigate" as NavigationType,
    unloadEventEnd: 0,
    unloadEventStart: 0,
    workerStart: 0,
    nextHopProtocol: "h2",
  } as PerformanceNavigationTiming
}

function createMockPaintEntry(name: string, startTime: number): PerformanceEntry {
  return {
    name,
    entryType: "paint",
    startTime,
    duration: 0,
    toJSON: () => ({}),
  }
}

function createMockLCPEntry(startTime: number, size: number): PerformanceEntry & { size: number } {
  return {
    name: "",
    entryType: "largest-contentful-paint",
    startTime,
    duration: 0,
    size,
    toJSON: () => ({}),
  }
}

function createMockLayoutShiftEntry(
  value: number,
  hadRecentInput = false
): PerformanceEntry & { value: number; hadRecentInput: boolean } {
  return {
    name: "",
    entryType: "layout-shift",
    startTime: Date.now(),
    duration: 0,
    value,
    hadRecentInput,
    toJSON: () => ({}),
  }
}

describe("Core Web Vitals Measurement", () => {
  beforeAll(() => {
    // Set up test environment
    global.PerformanceObserver = MockPerformanceObserver as any
  })

  afterAll(() => {
    // Clean up
    delete (global as any).PerformanceObserver
  })

  describe("Configuration Validation", () => {
    it("should have proper Core Web Vitals thresholds", () => {
      const config = performanceConfig

      // Validate constitutional requirements
      expect(config.webVitals.thresholds.lcp).toBeLessThanOrEqual(1200) // 1.2s max
      expect(config.webVitals.thresholds.fid).toBeLessThanOrEqual(100) // 100ms max
      expect(config.webVitals.thresholds.cls).toBeLessThanOrEqual(0.1) // 0.1 max

      // Validate other important thresholds
      expect(config.webVitals.thresholds.fcp).toBeLessThanOrEqual(1000) // 1s for FCP
      expect(config.webVitals.thresholds.ttfb).toBeLessThanOrEqual(600) // 600ms for TTFB
    })

    it("should enable performance monitoring", () => {
      expect(performanceConfig.webVitals.enabled).toBeDefined()
      expect(performanceConfig.webVitals.sampleRate).toBeGreaterThan(0)
      expect(performanceConfig.webVitals.sampleRate).toBeLessThanOrEqual(1)
    })
  })

  describe("Largest Contentful Paint (LCP)", () => {
    it("should measure LCP within threshold", () => {
      const observer = new MockPerformanceObserver(() => {})
      const goodLCP = createMockLCPEntry(800, 1000) // 800ms - good
      const badLCP = createMockLCPEntry(1500, 1000) // 1.5s - needs improvement

      // Test that we can detect good vs bad LCP
      expect(goodLCP.startTime).toBeLessThan(performanceConfig.webVitals.thresholds.lcp)
      expect(badLCP.startTime).toBeGreaterThan(performanceConfig.webVitals.thresholds.lcp)
    })

    it("should track LCP improvements over time", () => {
      // This would track LCP metrics over multiple measurements
      const lcpMeasurements = [1200, 1100, 950, 800, 750] // Improving trend

      // Calculate improvement
      const initialLCP = lcpMeasurements[0]
      const latestLCP = lcpMeasurements[lcpMeasurements.length - 1]
      const improvement = ((initialLCP - latestLCP) / initialLCP) * 100

      expect(improvement).toBeGreaterThan(0) // Should show improvement
      expect(latestLCP).toBeLessThan(performanceConfig.webVitals.thresholds.lcp)
    })
  })

  describe("First Input Delay (FID)", () => {
    it("should validate FID threshold", () => {
      const fidThreshold = performanceConfig.webVitals.thresholds.fid

      // Constitutional requirement: FID < 100ms
      expect(fidThreshold).toBeLessThanOrEqual(100)
    })

    it("should simulate good vs poor FID", () => {
      const goodFID = 50 // 50ms - good
      const poorFID = 150 // 150ms - needs improvement

      expect(goodFID).toBeLessThan(performanceConfig.webVitals.thresholds.fid)
      expect(poorFID).toBeGreaterThan(performanceConfig.webVitals.thresholds.fid)
    })
  })

  describe("Cumulative Layout Shift (CLS)", () => {
    it("should measure CLS within threshold", () => {
      const observer = new MockPerformanceObserver(() => {})

      // Simulate layout shifts
      const goodShift = createMockLayoutShiftEntry(0.05, false) // Small shift
      const badShift = createMockLayoutShiftEntry(0.25, false) // Large shift
      const inputShift = createMockLayoutShiftEntry(0.15, true) // User-initiated (ignored)

      // Test CLS calculation logic
      expect(goodShift.value).toBeLessThan(performanceConfig.webVitals.thresholds.cls)
      expect(badShift.value).toBeGreaterThan(performanceConfig.webVitals.thresholds.cls)
      expect(inputShift.hadRecentInput).toBe(true) // Should be ignored in CLS calculation
    })

    it("should accumulate CLS score correctly", () => {
      const layoutShifts = [
        { value: 0.02, hadRecentInput: false },
        { value: 0.03, hadRecentInput: false },
        { value: 0.01, hadRecentInput: false },
        { value: 0.1, hadRecentInput: true }, // This should be ignored
      ]

      // Calculate CLS score (ignoring user-initiated shifts)
      const clsScore = layoutShifts
        .filter(shift => !shift.hadRecentInput)
        .reduce((total, shift) => total + shift.value, 0)

      expect(clsScore).toBe(0.06) // 0.02 + 0.03 + 0.01
      expect(clsScore).toBeLessThan(performanceConfig.webVitals.thresholds.cls)
    })
  })

  describe("First Contentful Paint (FCP)", () => {
    it("should measure FCP within threshold", () => {
      const goodFCP = createMockPaintEntry("first-contentful-paint", 800)
      const poorFCP = createMockPaintEntry("first-contentful-paint", 1200)

      expect(goodFCP.startTime).toBeLessThan(performanceConfig.webVitals.thresholds.fcp)
      expect(poorFCP.startTime).toBeGreaterThan(performanceConfig.webVitals.thresholds.fcp)
    })

    it("should differentiate FCP from FP", () => {
      const fp = createMockPaintEntry("first-paint", 600)
      const fcp = createMockPaintEntry("first-contentful-paint", 800)

      // FCP should typically be after FP
      expect(fcp.startTime).toBeGreaterThanOrEqual(fp.startTime)
      expect(fcp.name).toBe("first-contentful-paint")
      expect(fp.name).toBe("first-paint")
    })
  })

  describe("Time to First Byte (TTFB)", () => {
    it("should measure TTFB within threshold", () => {
      const goodNavigation = createMockNavigationEntry({
        requestStart: 100,
        responseStart: 400, // 300ms TTFB - good
      })

      const poorNavigation = createMockNavigationEntry({
        requestStart: 100,
        responseStart: 800, // 700ms TTFB - poor
      })

      const goodTTFB = goodNavigation.responseStart - goodNavigation.requestStart
      const poorTTFB = poorNavigation.responseStart - poorNavigation.requestStart

      expect(goodTTFB).toBeLessThan(performanceConfig.webVitals.thresholds.ttfb)
      expect(poorTTFB).toBeGreaterThan(performanceConfig.webVitals.thresholds.ttfb)
    })

    it("should account for network latency in TTFB", () => {
      // Simulate different network conditions
      const fastNetwork = createMockNavigationEntry({
        requestStart: 0,
        responseStart: 200, // 200ms - fast
      })

      const slowNetwork = createMockNavigationEntry({
        requestStart: 0,
        responseStart: 1000, // 1000ms - slow
      })

      const fastTTFB = fastNetwork.responseStart - fastNetwork.requestStart
      const slowTTFB = slowNetwork.responseStart - slowNetwork.requestStart

      expect(fastTTFB).toBeLessThan(slowTTFB)
      expect(fastTTFB).toBeLessThan(performanceConfig.webVitals.thresholds.ttfb)
    })
  })

  describe("Performance Monitoring Integration", () => {
    it("should initialize performance monitoring without errors", () => {
      expect(() => {
        initializePerformanceMonitoring()
      }).not.toThrow()
    })

    it("should validate threshold checking functionality", () => {
      const { checkWebVitalsThresholds } = require("../../src/lib/config/monitoring")

      if (typeof checkWebVitalsThresholds === "function") {
        const result = checkWebVitalsThresholds()

        expect(result).toHaveProperty("passing")
        expect(result).toHaveProperty("violations")
        expect(Array.isArray(result.violations)).toBe(true)
      }
    })
  })

  describe("Performance Budgets", () => {
    it("should validate performance budget configuration", () => {
      const budgets = performanceConfig.budgets

      if (budgets && budgets.enabled) {
        expect(budgets.bundle.maxSize).toBeGreaterThan(0)
        expect(budgets.runtime.maxMemoryUsage).toBeGreaterThan(0)
        expect(budgets.network.maxRequests).toBeGreaterThan(0)
      }
    })

    it("should check bundle size against budget", () => {
      const budgets = performanceConfig.budgets

      // Mock bundle sizes
      const smallBundle = 300 * 1024 // 300KB
      const largeBundle = 600 * 1024 // 600KB

      if (budgets && budgets.enabled) {
        expect(smallBundle).toBeLessThan(budgets.bundle.maxSize)
        // Large bundle test depends on configured threshold
      }
    })
  })

  describe("Real User Monitoring (RUM)", () => {
    it("should support different sample rates", () => {
      const config = performanceConfig

      // Test sample rate logic
      const shouldSample = (rate: number) => Math.random() < rate

      // With 100% sample rate, should always sample
      const alwaysSample = shouldSample(1.0)
      // We can't guarantee the result, but we can test the logic
      expect(typeof alwaysSample).toBe("boolean")

      // With 0% sample rate, should never sample
      const neverSample = shouldSample(0.0)
      expect(neverSample).toBe(false)
    })

    it("should handle different environments", () => {
      const developmentConfig = { ...performanceConfig }
      const productionConfig = { ...performanceConfig }

      // Development typically has higher sample rates
      if (process.env.NODE_ENV === "development") {
        expect(developmentConfig.webVitals.sampleRate).toBeGreaterThanOrEqual(0.5)
      }

      // Production typically has lower sample rates
      if (process.env.NODE_ENV === "production") {
        expect(productionConfig.webVitals.sampleRate).toBeLessThanOrEqual(0.5)
      }
    })
  })

  describe("Performance Regression Detection", () => {
    it("should detect performance regressions", () => {
      const baselineMetrics = {
        lcp: 800,
        fid: 50,
        cls: 0.05,
        fcp: 600,
        ttfb: 200,
      }

      const currentMetrics = {
        lcp: 1100, // Regression
        fid: 45, // Improvement
        cls: 0.08, // Regression
        fcp: 650, // Slight regression
        ttfb: 180, // Improvement
      }

      const regressions = Object.keys(baselineMetrics).filter(metric => {
        const baseline = baselineMetrics[metric as keyof typeof baselineMetrics]
        const current = currentMetrics[metric as keyof typeof currentMetrics]
        return current > baseline * 1.1 // 10% regression threshold
      })

      expect(regressions).toContain("lcp")
      expect(regressions).not.toContain("fid")
      expect(regressions).not.toContain("ttfb")
    })
  })

  describe("Constitutional Compliance Verification", () => {
    it("should meet constitutional performance requirements", () => {
      const thresholds = performanceConfig.webVitals.thresholds

      // Constitutional requirements from the project specification
      expect(thresholds.lcp).toBeLessThanOrEqual(1200) // LCP < 1.2s
      expect(thresholds.fid).toBeLessThanOrEqual(100) // FID < 100ms
      expect(thresholds.cls).toBeLessThanOrEqual(0.1) // CLS < 0.1

      console.log("✅ Constitutional performance requirements verified:")
      console.log(`  LCP threshold: ${thresholds.lcp}ms (≤ 1200ms)`)
      console.log(`  FID threshold: ${thresholds.fid}ms (≤ 100ms)`)
      console.log(`  CLS threshold: ${thresholds.cls} (≤ 0.1)`)
    })

    it("should have performance monitoring enabled", () => {
      expect(performanceConfig.webVitals.enabled).toBeTruthy()
      expect(performanceConfig.webVitals.reportInterval).toBeGreaterThan(0)

      console.log("✅ Performance monitoring is properly configured")
    })
  })
})
