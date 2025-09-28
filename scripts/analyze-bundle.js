/**
 * Bundle Analysis Script
 *
 * Analyzes the Next.js bundle size, identifies large dependencies,
 * and provides optimization recommendations.
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const config = {
  buildDir: ".next",
  outputDir: "reports/bundle-analysis",
  thresholds: {
    totalSize: 2 * 1024 * 1024, // 2MB
    chunkSize: 500 * 1024, // 500KB
    assetSize: 100 * 1024, // 100KB
  },
  excludePatterns: [/node_modules/, /\.map$/, /\.d\.ts$/],
}

class BundleAnalyzer {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {},
      chunks: [],
      assets: [],
      dependencies: [],
      recommendations: [],
    }
  }

  async analyze() {
    console.log("🔍 Starting bundle analysis...")

    // Ensure build directory exists
    if (!fs.existsSync(config.buildDir)) {
      console.error('❌ Build directory not found. Run "npm run build" first.')
      process.exit(1)
    }

    // Create output directory
    this.ensureDirectory(config.outputDir)

    // Analyze different aspects
    await this.analyzeBuildOutput()
    await this.analyzePackageJson()
    await this.analyzeStaticAssets()
    await this.generateRecommendations()

    // Generate reports
    await this.generateReports()

    console.log("✅ Bundle analysis completed!")
    console.log(`📊 Reports saved to: ${config.outputDir}`)
  }

  async analyzeBuildOutput() {
    console.log("📦 Analyzing build output...")

    try {
      // Run Next.js bundle analyzer if available
      const hasAnalyzer = this.hasPackage("@next/bundle-analyzer")
      if (hasAnalyzer) {
        console.log("Using @next/bundle-analyzer...")
        // This would generate detailed bundle analysis
        // For now, we'll analyze the .next directory structure
      }

      // Analyze .next directory structure
      const buildStats = this.analyzeBuildDirectory()
      this.results.summary = buildStats.summary
      this.results.chunks = buildStats.chunks
      this.results.assets = buildStats.assets
    } catch (error) {
      console.warn("⚠️  Could not analyze build output:", error.message)
    }
  }

  analyzeBuildDirectory() {
    const staticDir = path.join(config.buildDir, "static")
    const chunks = []
    const assets = []
    let totalSize = 0

    if (fs.existsSync(staticDir)) {
      // Analyze chunks
      const chunksDir = path.join(staticDir, "chunks")
      if (fs.existsSync(chunksDir)) {
        const chunkFiles = this.getAllFiles(chunksDir)
        for (const file of chunkFiles) {
          const stats = fs.statSync(file)
          const relativePath = path.relative(config.buildDir, file)

          chunks.push({
            path: relativePath,
            size: stats.size,
            isLarge: stats.size > config.thresholds.chunkSize,
          })
          totalSize += stats.size
        }
      }

      // Analyze other static assets
      const mediaDir = path.join(staticDir, "media")
      if (fs.existsSync(mediaDir)) {
        const mediaFiles = this.getAllFiles(mediaDir)
        for (const file of mediaFiles) {
          const stats = fs.statSync(file)
          const relativePath = path.relative(config.buildDir, file)

          assets.push({
            path: relativePath,
            size: stats.size,
            type: path.extname(file).toLowerCase(),
            isLarge: stats.size > config.thresholds.assetSize,
          })
          totalSize += stats.size
        }
      }
    }

    return {
      summary: {
        totalSize,
        chunksCount: chunks.length,
        assetsCount: assets.length,
        isOverThreshold: totalSize > config.thresholds.totalSize,
      },
      chunks: chunks.sort((a, b) => b.size - a.size), // Sort by size desc
      assets: assets.sort((a, b) => b.size - a.size),
    }
  }

  async analyzePackageJson() {
    console.log("📋 Analyzing dependencies...")

    try {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      // Analyze dependency sizes (simplified)
      const depAnalysis = Object.keys(dependencies).map(dep => {
        const nodeModulePath = path.join("node_modules", dep)
        let size = 0

        if (fs.existsSync(nodeModulePath)) {
          try {
            size = this.getDirectorySize(nodeModulePath)
          } catch (error) {
            console.warn(`Could not analyze ${dep}:`, error.message)
          }
        }

        return {
          name: dep,
          version: dependencies[dep],
          size,
          type: packageJson.dependencies?.[dep] ? "dependency" : "devDependency",
        }
      })

      this.results.dependencies = depAnalysis
        .filter(dep => dep.size > 0)
        .sort((a, b) => b.size - a.size)
        .slice(0, 20) // Top 20 largest dependencies
    } catch (error) {
      console.warn("⚠️  Could not analyze package.json:", error.message)
    }
  }

  async analyzeStaticAssets() {
    console.log("🖼️  Analyzing static assets...")

    const publicDir = "public"
    if (!fs.existsSync(publicDir)) return

    const staticFiles = this.getAllFiles(publicDir)
    const assetAnalysis = []

    for (const file of staticFiles) {
      const stats = fs.statSync(file)
      const relativePath = path.relative(publicDir, file)
      const ext = path.extname(file).toLowerCase()

      // Focus on images and large assets
      if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf", ".zip"].includes(ext)) {
        assetAnalysis.push({
          path: relativePath,
          size: stats.size,
          type: ext,
          isOptimized: this.isImageOptimized(file, ext),
          recommendations: this.getAssetRecommendations(file, stats.size, ext),
        })
      }
    }

    this.results.staticAssets = assetAnalysis.sort((a, b) => b.size - a.size)
  }

  isImageOptimized(filePath, ext) {
    // Simple heuristic - check if modern formats are available
    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      const baseName = path.basename(filePath, ext)
      const dir = path.dirname(filePath)

      // Check for WebP version
      const webpPath = path.join(dir, baseName + ".webp")
      return fs.existsSync(webpPath)
    }

    return ext === ".webp" || ext === ".svg"
  }

  getAssetRecommendations(filePath, size, ext) {
    const recommendations = []

    // Size-based recommendations
    if (size > 1024 * 1024) {
      // 1MB
      recommendations.push("Consider compressing - file is over 1MB")
    }

    // Format-based recommendations
    if ([".jpg", ".jpeg", ".png"].includes(ext) && size > 100 * 1024) {
      recommendations.push("Consider converting to WebP format")
      recommendations.push("Use Next.js Image component for optimization")
    }

    if (ext === ".gif" && size > 500 * 1024) {
      recommendations.push("Consider converting to video format (MP4/WebM)")
    }

    return recommendations
  }

  async generateRecommendations() {
    console.log("💡 Generating recommendations...")

    const recommendations = []

    // Bundle size recommendations
    if (this.results.summary.isOverThreshold) {
      recommendations.push({
        type: "bundle-size",
        priority: "high",
        title: "Bundle size exceeds threshold",
        description: `Total bundle size (${this.formatBytes(this.results.summary.totalSize)}) exceeds ${this.formatBytes(config.thresholds.totalSize)}`,
        actions: [
          "Enable tree shaking in webpack config",
          "Use dynamic imports for code splitting",
          "Remove unused dependencies",
          "Consider using lighter alternatives for large dependencies",
        ],
      })
    }

    // Large chunks
    const largeChunks = this.results.chunks.filter(chunk => chunk.isLarge)
    if (largeChunks.length > 0) {
      recommendations.push({
        type: "chunk-size",
        priority: "medium",
        title: `${largeChunks.length} large chunks detected`,
        description: "Some chunks exceed the recommended size",
        actions: [
          "Split large chunks using dynamic imports",
          "Move vendor code to separate chunks",
          "Use Next.js automatic code splitting",
        ],
        affectedFiles: largeChunks.map(chunk => chunk.path),
      })
    }

    // Dependency optimization
    const largeDeps = this.results.dependencies.slice(0, 5) // Top 5 largest
    if (largeDeps.length > 0) {
      recommendations.push({
        type: "dependencies",
        priority: "medium",
        title: "Large dependencies detected",
        description: "Consider optimizing or replacing large dependencies",
        actions: [
          "Use tree shaking compatible versions",
          "Import only needed modules",
          "Consider lighter alternatives",
          "Move development dependencies to devDependencies",
        ],
        affectedDeps: largeDeps.map(dep => `${dep.name} (${this.formatBytes(dep.size)})`),
      })
    }

    // Static asset optimization
    const unoptimizedAssets = this.results.staticAssets?.filter(asset => !asset.isOptimized) || []
    if (unoptimizedAssets.length > 0) {
      recommendations.push({
        type: "assets",
        priority: "medium",
        title: "Unoptimized static assets",
        description: "Some static assets can be optimized",
        actions: [
          "Convert images to WebP format",
          "Use Next.js Image component",
          "Compress large images",
          "Use SVG for simple graphics",
        ],
        affectedFiles: unoptimizedAssets.map(asset => asset.path),
      })
    }

    this.results.recommendations = recommendations
  }

  async generateReports() {
    console.log("📄 Generating reports...")

    // JSON report
    const jsonReport = path.join(config.outputDir, "bundle-analysis.json")
    fs.writeFileSync(jsonReport, JSON.stringify(this.results, null, 2))

    // Markdown report
    const markdownReport = path.join(config.outputDir, "bundle-analysis.md")
    const markdown = this.generateMarkdownReport()
    fs.writeFileSync(markdownReport, markdown)

    // Console summary
    this.printSummary()
  }

  generateMarkdownReport() {
    const { summary, chunks, dependencies, staticAssets, recommendations } = this.results

    let md = `# Bundle Analysis Report\n\n`
    md += `Generated: ${this.results.timestamp}\n\n`

    // Summary
    md += `## Summary\n\n`
    md += `- **Total Bundle Size**: ${this.formatBytes(summary.totalSize)}\n`
    md += `- **Chunks**: ${summary.chunksCount}\n`
    md += `- **Static Assets**: ${summary.assetsCount}\n`
    md += `- **Status**: ${summary.isOverThreshold ? "⚠️ Over threshold" : "✅ Within limits"}\n\n`

    // Largest chunks
    if (chunks.length > 0) {
      md += `## Largest Chunks\n\n`
      md += `| File | Size | Status |\n`
      md += `|------|------|--------|\n`
      chunks.slice(0, 10).forEach(chunk => {
        md += `| ${chunk.path} | ${this.formatBytes(chunk.size)} | ${chunk.isLarge ? "⚠️ Large" : "✅ OK"} |\n`
      })
      md += `\n`
    }

    // Dependencies
    if (dependencies.length > 0) {
      md += `## Largest Dependencies\n\n`
      md += `| Package | Version | Size | Type |\n`
      md += `|---------|---------|------|------|\n`
      dependencies.slice(0, 10).forEach(dep => {
        md += `| ${dep.name} | ${dep.version} | ${this.formatBytes(dep.size)} | ${dep.type} |\n`
      })
      md += `\n`
    }

    // Recommendations
    if (recommendations.length > 0) {
      md += `## Recommendations\n\n`
      recommendations.forEach(rec => {
        md += `### ${rec.title} (${rec.priority} priority)\n\n`
        md += `${rec.description}\n\n`
        md += `**Actions:**\n`
        rec.actions.forEach(action => {
          md += `- ${action}\n`
        })
        if (rec.affectedFiles) {
          md += `\n**Affected files:**\n`
          rec.affectedFiles.forEach(file => {
            md += `- ${file}\n`
          })
        }
        md += `\n`
      })
    }

    return md
  }

  printSummary() {
    console.log("\n📊 Bundle Analysis Summary")
    console.log("================================")
    console.log(`Total Size: ${this.formatBytes(this.results.summary.totalSize)}`)
    console.log(`Chunks: ${this.results.summary.chunksCount}`)
    console.log(`Assets: ${this.results.summary.assetsCount}`)
    console.log(`Recommendations: ${this.results.recommendations.length}`)

    if (this.results.recommendations.length > 0) {
      console.log("\n🔧 Top Recommendations:")
      this.results.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.title} (${rec.priority})`)
      })
    }

    console.log(`\n📁 Full report: ${path.resolve(config.outputDir)}`)
  }

  // Utility methods
  getAllFiles(dir, files = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        this.getAllFiles(fullPath, files)
      } else if (entry.isFile()) {
        // Apply exclude patterns
        const shouldExclude = config.excludePatterns.some(pattern => pattern.test(fullPath))
        if (!shouldExclude) {
          files.push(fullPath)
        }
      }
    }

    return files
  }

  getDirectorySize(dirPath) {
    let size = 0

    try {
      const files = this.getAllFiles(dirPath)
      for (const file of files) {
        const stats = fs.statSync(file)
        size += stats.size
      }
    } catch (error) {
      // Ignore errors for individual files
    }

    return size
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 B"

    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  hasPackage(packageName) {
    try {
      require.resolve(packageName)
      return true
    } catch {
      return false
    }
  }

  ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}

// CLI execution
if (require.main === module) {
  const analyzer = new BundleAnalyzer()

  analyzer.analyze().catch(error => {
    console.error("❌ Bundle analysis failed:", error)
    process.exit(1)
  })
}

module.exports = { BundleAnalyzer, config }
