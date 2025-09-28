/**
 * Type Coverage Analysis Script
 *
 * Analyzes TypeScript type coverage across the codebase to ensure
 * strict mode compliance and comprehensive type safety.
 */

import { execSync } from "child_process"
import fs from "fs"
import path from "path"

interface TypeCoverageReport {
  timestamp: string
  totalFiles: number
  typedFiles: number
  untypedFiles: number
  coverage: number
  strictModeFiles: number
  issues: TypeCoverageIssue[]
  recommendations: string[]
}

interface TypeCoverageIssue {
  file: string
  line?: number
  column?: number
  message: string
  severity: "error" | "warning" | "info"
  category: "missing-types" | "any-usage" | "strict-mode" | "interface-consistency"
}

class TypeCoverageAnalyzer {
  private sourceDirectories = ["src/", "tests/", "scripts/"]

  private excludePatterns = [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/__mocks__/**",
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/coverage/**",
  ]

  async analyze(): Promise<TypeCoverageReport> {
    console.log("🔍 Starting TypeScript type coverage analysis...")

    const report: TypeCoverageReport = {
      timestamp: new Date().toISOString(),
      totalFiles: 0,
      typedFiles: 0,
      untypedFiles: 0,
      coverage: 0,
      strictModeFiles: 0,
      issues: [],
      recommendations: [],
    }

    try {
      // Get all TypeScript files
      const tsFiles = await this.getTsFiles()
      report.totalFiles = tsFiles.length

      console.log(`📁 Found ${tsFiles.length} TypeScript files`)

      // Analyze each file
      for (const file of tsFiles) {
        await this.analyzeFile(file, report)
      }

      // Calculate coverage
      report.coverage = report.totalFiles > 0 ? (report.typedFiles / report.totalFiles) * 100 : 100

      // Generate recommendations
      this.generateRecommendations(report)

      // Run type coverage tool if available
      await this.runTypeCoverageTool(report)

      console.log("✅ Type coverage analysis completed!")
      return report
    } catch (error) {
      console.error("❌ Type coverage analysis failed:", error)
      throw error
    }
  }

  private async getTsFiles(): Promise<string[]> {
    const files: string[] = []

    for (const dir of this.sourceDirectories) {
      if (fs.existsSync(dir)) {
        const dirFiles = await this.findTsFilesInDirectory(dir)
        files.push(...dirFiles)
      }
    }

    return files.filter(file => !this.shouldExcludeFile(file))
  }

  private async findTsFilesInDirectory(dir: string): Promise<string[]> {
    const files: string[] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        const subFiles = await this.findTsFilesInDirectory(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        files.push(fullPath)
      }
    }

    return files
  }

  private shouldExcludeFile(filePath: string): boolean {
    return this.excludePatterns.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*"))
      return regex.test(filePath)
    })
  }

  private async analyzeFile(filePath: string, report: TypeCoverageReport): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, "utf8")
      const lines = content.split("\n")

      let isTyped = true
      let hasStrictMode = false
      const fileIssues: TypeCoverageIssue[] = []

      // Check for strict mode indicators
      const tsConfigPath = this.findTsConfig(filePath)
      if (tsConfigPath) {
        const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf8"))
        hasStrictMode =
          tsConfig.compilerOptions?.strict === true ||
          (tsConfig.compilerOptions?.noImplicitAny === true && tsConfig.compilerOptions?.strictNullChecks === true)
      }

      // Analyze file content
      lines.forEach((line, index) => {
        const lineNumber = index + 1

        // Check for 'any' usage
        if (this.containsAnyUsage(line)) {
          fileIssues.push({
            file: filePath,
            line: lineNumber,
            message: "Usage of 'any' type detected",
            severity: "warning",
            category: "any-usage",
          })
          isTyped = false
        }

        // Check for missing return types
        if (this.hasMissingReturnType(line)) {
          fileIssues.push({
            file: filePath,
            line: lineNumber,
            message: "Function missing explicit return type",
            severity: "info",
            category: "missing-types",
          })
        }

        // Check for missing parameter types
        if (this.hasMissingParameterTypes(line)) {
          fileIssues.push({
            file: filePath,
            line: lineNumber,
            message: "Function parameter missing type annotation",
            severity: "warning",
            category: "missing-types",
          })
          isTyped = false
        }

        // Check for @ts-ignore or @ts-expect-error
        if (line.includes("@ts-ignore") || line.includes("@ts-expect-error")) {
          fileIssues.push({
            file: filePath,
            line: lineNumber,
            message: "TypeScript error suppression detected",
            severity: "warning",
            category: "strict-mode",
          })
        }
      })

      // Update report
      if (isTyped) {
        report.typedFiles++
      } else {
        report.untypedFiles++
      }

      if (hasStrictMode) {
        report.strictModeFiles++
      }

      report.issues.push(...fileIssues)
    } catch (error) {
      console.warn(`⚠️ Could not analyze ${filePath}:`, (error as Error).message)
    }
  }

  private findTsConfig(filePath: string): string | null {
    let currentDir = path.dirname(filePath)

    while (currentDir !== path.dirname(currentDir)) {
      const tsConfigPath = path.join(currentDir, "tsconfig.json")
      if (fs.existsSync(tsConfigPath)) {
        return tsConfigPath
      }
      currentDir = path.dirname(currentDir)
    }

    return null
  }

  private containsAnyUsage(line: string): boolean {
    // Detect explicit 'any' usage (but not in comments)
    const codeWithoutComments = line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "")
    return /\b(any)\b/.test(codeWithoutComments) && !/typeof|keyof/.test(codeWithoutComments)
  }

  private hasMissingReturnType(line: string): boolean {
    // Check for function declarations without return types
    const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{|const\s+\w+\s*=\s*\([^)]*\)\s*=>/
    const hasReturnType = /:\s*\w+\s*(\||&|<|{|=>)/

    return functionRegex.test(line) && !hasReturnType.test(line)
  }

  private hasMissingParameterTypes(line: string): boolean {
    // Check for parameters without type annotations
    const paramRegex = /\(([^)]+)\)/
    const match = line.match(paramRegex)

    if (!match) return false

    const params = match[1].split(",")
    return params.some(param => {
      const trimmed = param.trim()
      return trimmed && !trimmed.includes(":") && !trimmed.includes("...") && trimmed !== "void"
    })
  }

  private async runTypeCoverageTool(report: TypeCoverageReport): Promise<void> {
    try {
      // Check if type-coverage is installed
      const result = execSync("npx type-coverage --version", { encoding: "utf8", stdio: "pipe" })

      if (result) {
        console.log("📊 Running type-coverage tool...")

        const coverage = execSync("npx type-coverage --detail --strict", {
          encoding: "utf8",
          stdio: "pipe",
        })

        // Parse type-coverage output
        this.parseTypeCoverageOutput(coverage, report)
      }
    } catch (error) {
      console.log("ℹ️ type-coverage tool not available, using internal analysis")
    }
  }

  private parseTypeCoverageOutput(output: string, report: TypeCoverageReport): void {
    const lines = output.split("\n")

    lines.forEach(line => {
      if (line.includes("type coverage is")) {
        const match = line.match(/(\d+\.\d+)%/)
        if (match) {
          const toolCoverage = parseFloat(match[1])
          // Use tool coverage if available and different
          if (Math.abs(toolCoverage - report.coverage) > 1) {
            console.log(`📊 Tool reports coverage: ${toolCoverage}%, internal analysis: ${report.coverage.toFixed(2)}%`)
          }
        }
      }
    })
  }

  private generateRecommendations(report: TypeCoverageReport): void {
    const recommendations: string[] = []

    // Coverage-based recommendations
    if (report.coverage < 95) {
      recommendations.push("Increase type coverage to 95%+ by adding explicit type annotations")
    }

    if (report.coverage < 90) {
      recommendations.push("Consider enabling stricter TypeScript compiler options")
    }

    // Issue-based recommendations
    const anyUsageCount = report.issues.filter(issue => issue.category === "any-usage").length
    if (anyUsageCount > 0) {
      recommendations.push(`Eliminate ${anyUsageCount} instances of 'any' type usage`)
    }

    const missingTypesCount = report.issues.filter(issue => issue.category === "missing-types").length
    if (missingTypesCount > 0) {
      recommendations.push(`Add explicit types for ${missingTypesCount} functions/parameters`)
    }

    const strictModeIssues = report.issues.filter(issue => issue.category === "strict-mode").length
    if (strictModeIssues > 0) {
      recommendations.push(`Address ${strictModeIssues} strict mode compliance issues`)
    }

    // Strict mode recommendations
    const strictModePercentage = report.totalFiles > 0 ? (report.strictModeFiles / report.totalFiles) * 100 : 0

    if (strictModePercentage < 100) {
      recommendations.push("Enable strict mode for all TypeScript files")
    }

    report.recommendations = recommendations
  }

  async generateReport(report: TypeCoverageReport): Promise<void> {
    const reportDir = "reports/type-coverage"

    // Ensure directory exists
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true })
    }

    // JSON report
    const jsonPath = path.join(reportDir, "type-coverage.json")
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2))

    // Markdown report
    const mdPath = path.join(reportDir, "type-coverage.md")
    const markdown = this.generateMarkdownReport(report)
    fs.writeFileSync(mdPath, markdown)

    // Console summary
    this.printSummary(report)

    console.log(`📄 Reports saved to: ${reportDir}`)
  }

  private generateMarkdownReport(report: TypeCoverageReport): string {
    let md = `# TypeScript Type Coverage Report\n\n`
    md += `Generated: ${report.timestamp}\n\n`

    // Summary
    md += `## Summary\n\n`
    md += `- **Total Files**: ${report.totalFiles}\n`
    md += `- **Typed Files**: ${report.typedFiles}\n`
    md += `- **Type Coverage**: ${report.coverage.toFixed(2)}%\n`
    md += `- **Strict Mode Files**: ${report.strictModeFiles}\n`
    md += `- **Total Issues**: ${report.issues.length}\n\n`

    // Coverage status
    const status = report.coverage >= 95 ? "🟢" : report.coverage >= 90 ? "🟡" : "🔴"
    md += `## Coverage Status: ${status}\n\n`

    if (report.coverage < 95) {
      md += `⚠️ Type coverage is below the recommended 95% threshold.\n\n`
    } else {
      md += `✅ Type coverage meets the recommended threshold.\n\n`
    }

    // Issues breakdown
    if (report.issues.length > 0) {
      md += `## Issues by Category\n\n`

      const categories = ["any-usage", "missing-types", "strict-mode", "interface-consistency"] as const
      categories.forEach(category => {
        const categoryIssues = report.issues.filter(issue => issue.category === category)
        if (categoryIssues.length > 0) {
          md += `### ${category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} (${categoryIssues.length})\n\n`
          categoryIssues.slice(0, 10).forEach(issue => {
            md += `- **${issue.file}**`
            if (issue.line) md += `:${issue.line}`
            md += ` - ${issue.message}\n`
          })
          if (categoryIssues.length > 10) {
            md += `\n... and ${categoryIssues.length - 10} more\n`
          }
          md += `\n`
        }
      })
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      md += `## Recommendations\n\n`
      report.recommendations.forEach(rec => {
        md += `- ${rec}\n`
      })
      md += `\n`
    }

    return md
  }

  private printSummary(report: TypeCoverageReport): void {
    console.log("\n📊 Type Coverage Summary")
    console.log("=========================")
    console.log(`Total Files: ${report.totalFiles}`)
    console.log(`Type Coverage: ${report.coverage.toFixed(2)}%`)
    console.log(`Strict Mode Files: ${report.strictModeFiles}/${report.totalFiles}`)
    console.log(`Issues Found: ${report.issues.length}`)

    const status = report.coverage >= 95 ? "🟢 EXCELLENT" : report.coverage >= 90 ? "🟡 GOOD" : "🔴 NEEDS IMPROVEMENT"
    console.log(`Status: ${status}`)

    if (report.recommendations.length > 0) {
      console.log("\n🔧 Top Recommendations:")
      report.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`)
      })
    }
  }
}

// CLI execution
if (require.main === module) {
  const analyzer = new TypeCoverageAnalyzer()

  analyzer
    .analyze()
    .then(report => analyzer.generateReport(report))
    .then(() => process.exit(0))
    .catch(error => {
      console.error("❌ Analysis failed:", error)
      process.exit(1)
    })
}

export { TypeCoverageAnalyzer, type TypeCoverageReport, type TypeCoverageIssue }
