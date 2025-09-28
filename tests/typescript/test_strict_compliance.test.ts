/**
 * TypeScript Strict Mode Compliance Tests
 *
 * Tests to verify that all TypeScript code complies with strict mode
 * requirements and maintains type safety standards.
 */

import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"

// Interface for test results
interface StrictComplianceResult {
  filePath: string
  compliant: boolean
  issues: ComplianceIssue[]
}

interface ComplianceIssue {
  line: number
  column?: number
  rule: string
  message: string
  severity: "error" | "warning"
}

// Helper functions
function getAllTypeScriptFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      files.push(...getAllTypeScriptFiles(fullPath))
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

function analyzeFileStrictCompliance(filePath: string): StrictComplianceResult {
  const content = fs.readFileSync(filePath, "utf8")
  const lines = content.split("\n")
  const issues: ComplianceIssue[] = []

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    // Check for 'any' type usage
    if (hasAnyUsage(line)) {
      issues.push({
        line: lineNumber,
        rule: "no-any",
        message: "Usage of 'any' type violates strict type checking",
        severity: "error",
      })
    }

    // Check for implicit any (parameters without types)
    if (hasImplicitAny(line)) {
      issues.push({
        line: lineNumber,
        rule: "no-implicit-any",
        message: "Parameter has implicit any type",
        severity: "error",
      })
    }

    // Check for missing return types
    if (hasMissingReturnType(line)) {
      issues.push({
        line: lineNumber,
        rule: "explicit-return-types",
        message: "Function should have explicit return type",
        severity: "warning",
      })
    }

    // Check for non-null assertions
    if (hasNonNullAssertion(line)) {
      issues.push({
        line: lineNumber,
        rule: "no-non-null-assertion",
        message: "Non-null assertion (!) should be avoided in strict mode",
        severity: "warning",
      })
    }

    // Check for @ts-ignore comments
    if (hasTsIgnore(line)) {
      issues.push({
        line: lineNumber,
        rule: "no-ts-ignore",
        message: "@ts-ignore suppresses type checking and should be avoided",
        severity: "error",
      })
    }

    // Check for empty interfaces
    if (hasEmptyInterface(line)) {
      issues.push({
        line: lineNumber,
        rule: "no-empty-interface",
        message: "Empty interfaces should be avoided",
        severity: "warning",
      })
    }
  })

  return {
    filePath,
    compliant: issues.filter(issue => issue.severity === "error").length === 0,
    issues,
  }
}

// Rule detection functions
function hasAnyUsage(line: string): boolean {
  const codeWithoutComments = line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "")
  return /\b(any)\b/.test(codeWithoutComments) && !/typeof|keyof/.test(codeWithoutComments)
}

function hasImplicitAny(line: string): boolean {
  // Check for function parameters without type annotations
  const functionParamRegex = /\(([^)]+)\)/
  const match = line.match(functionParamRegex)

  if (!match) return false

  const params = match[1].split(",")
  return params.some(param => {
    const trimmed = param.trim()
    return (
      trimmed &&
      !trimmed.includes(":") &&
      !trimmed.includes("...") &&
      !trimmed.startsWith("{") &&
      !/^\w+\s*=/.test(trimmed)
    )
  })
}

function hasMissingReturnType(line: string): boolean {
  const exportFunctionRegex = /export\s+(function|const\s+\w+\s*=\s*(async\s+)?\([^)]*\)\s*=>)/
  const functionDeclRegex = /^\s*function\s+\w+\s*\([^)]*\)\s*\{/
  const arrowFunctionRegex = /const\s+\w+\s*=\s*(async\s+)?\([^)]*\)\s*=>/

  const hasFunction = exportFunctionRegex.test(line) || functionDeclRegex.test(line) || arrowFunctionRegex.test(line)

  if (!hasFunction) return false

  // Check if it has a return type annotation
  const hasReturnType = /\)\s*:\s*\w+/.test(line)
  return !hasReturnType
}

function hasNonNullAssertion(line: string): boolean {
  const codeWithoutComments = line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "")
  return /\w!/.test(codeWithoutComments) && !/!=|!==/.test(codeWithoutComments)
}

function hasTsIgnore(line: string): boolean {
  return /@ts-ignore/.test(line)
}

function hasEmptyInterface(line: string): boolean {
  return /interface\s+\w+\s*\{\s*\}/.test(line)
}

describe("TypeScript Strict Mode Compliance", () => {
  describe("Configuration Verification", () => {
    it("should have strict mode enabled in tsconfig.json", () => {
      const tsconfigPath = path.join(process.cwd(), "tsconfig.json")
      expect(fs.existsSync(tsconfigPath)).toBe(true)

      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"))
      const compilerOptions = tsconfig.compilerOptions || {}

      // Check for strict mode
      expect(compilerOptions.strict).toBe(true)

      // Verify individual strict checks (should be enabled by strict: true)
      console.log("✅ TypeScript strict mode configuration verified:")
      console.log(`  - strict: ${compilerOptions.strict}`)
      console.log(`  - noImplicitAny: ${compilerOptions.noImplicitAny ?? "inherited from strict"}`)
      console.log(`  - strictNullChecks: ${compilerOptions.strictNullChecks ?? "inherited from strict"}`)
      console.log(`  - strictFunctionTypes: ${compilerOptions.strictFunctionTypes ?? "inherited from strict"}`)
    })

    it("should have recommended strict compiler options", () => {
      const tsconfigPath = path.join(process.cwd(), "tsconfig.json")
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"))
      const compilerOptions = tsconfig.compilerOptions || {}

      // Constitutional requirements for strict mode
      const requiredOptions = {
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
      }

      Object.entries(requiredOptions).forEach(([option, expectedValue]) => {
        const actualValue = compilerOptions[option]
        expect(actualValue).toBe(expectedValue)
      })
    })
  })

  describe("Source Code Compliance", () => {
    it("should not use any type in source files", () => {
      const srcFiles = getAllTypeScriptFiles(path.join(process.cwd(), "src"))
      const violations: Array<{ file: string; issues: ComplianceIssue[] }> = []

      srcFiles.forEach(file => {
        const result = analyzeFileStrictCompliance(file)
        const anyUsageIssues = result.issues.filter(issue => issue.rule === "no-any")

        if (anyUsageIssues.length > 0) {
          violations.push({
            file: path.relative(process.cwd(), file),
            issues: anyUsageIssues,
          })
        }
      })

      if (violations.length > 0) {
        console.warn("⚠️ Files with any type usage:")
        violations.forEach(violation => {
          console.warn(`  ${violation.file}:`)
          violation.issues.forEach(issue => {
            console.warn(`    Line ${issue.line}: ${issue.message}`)
          })
        })
      }

      // Allow some any usage but encourage improvement
      expect(violations.length).toBeLessThan(srcFiles.length * 0.1) // Less than 10% of files
    })

    it("should have explicit return types for exported functions", () => {
      const srcFiles = getAllTypeScriptFiles(path.join(process.cwd(), "src"))
      const violations: string[] = []

      srcFiles.forEach(file => {
        const result = analyzeFileStrictCompliance(file)
        const returnTypeIssues = result.issues.filter(
          issue =>
            issue.rule === "explicit-return-types" &&
            fs.readFileSync(file, "utf8").split("\n")[issue.line - 1].includes("export")
        )

        if (returnTypeIssues.length > 0) {
          violations.push(path.relative(process.cwd(), file))
        }
      })

      if (violations.length > 0) {
        console.log("ℹ️ Files with missing return types (exported functions):")
        violations.forEach(file => console.log(`  ${file}`))
      }

      // This is a recommendation, not a hard requirement
      expect(violations.length).toBeLessThan(srcFiles.length * 0.2) // Less than 20% of files
    })

    it("should avoid TypeScript error suppressions", () => {
      const srcFiles = getAllTypeScriptFiles(path.join(process.cwd(), "src"))
      const suppressions: Array<{ file: string; line: number }> = []

      srcFiles.forEach(file => {
        const result = analyzeFileStrictCompliance(file)
        const tsIgnoreIssues = result.issues.filter(issue => issue.rule === "no-ts-ignore")

        tsIgnoreIssues.forEach(issue => {
          suppressions.push({
            file: path.relative(process.cwd(), file),
            line: issue.line,
          })
        })
      })

      if (suppressions.length > 0) {
        console.warn("⚠️ TypeScript error suppressions found:")
        suppressions.forEach(suppression => {
          console.warn(`  ${suppression.file}:${suppression.line}`)
        })
      }

      // Should have minimal suppressions
      expect(suppressions.length).toBeLessThan(5)
    })

    it("should minimize non-null assertions", () => {
      const srcFiles = getAllTypeScriptFiles(path.join(process.cwd(), "src"))
      const assertions: Array<{ file: string; count: number }> = []

      srcFiles.forEach(file => {
        const result = analyzeFileStrictCompliance(file)
        const assertionIssues = result.issues.filter(issue => issue.rule === "no-non-null-assertion")

        if (assertionIssues.length > 0) {
          assertions.push({
            file: path.relative(process.cwd(), file),
            count: assertionIssues.length,
          })
        }
      })

      if (assertions.length > 0) {
        console.log("ℹ️ Non-null assertions found:")
        assertions.forEach(assertion => {
          console.log(`  ${assertion.file}: ${assertion.count} assertions`)
        })
      }

      // Allow some assertions but encourage proper null checking
      const totalAssertions = assertions.reduce((sum, a) => sum + a.count, 0)
      expect(totalAssertions).toBeLessThan(20)
    })
  })

  describe("Test File Compliance", () => {
    it("should allow relaxed rules in test files", () => {
      const testFiles = [
        ...getAllTypeScriptFiles(path.join(process.cwd(), "tests")),
        ...getAllTypeScriptFiles(path.join(process.cwd(), "src")).filter(f => f.includes(".test.")),
      ]

      const results = testFiles.map(file => analyzeFileStrictCompliance(file))
      const compliantFiles = results.filter(r => r.compliant).length

      console.log(`📋 Test files analysis: ${compliantFiles}/${testFiles.length} compliant`)

      // Test files can be more relaxed
      const complianceRate = testFiles.length > 0 ? compliantFiles / testFiles.length : 1
      expect(complianceRate).toBeGreaterThan(0.7) // 70% compliance for tests
    })
  })

  describe("Constitutional Compliance Verification", () => {
    it("should meet constitutional TypeScript strict mode requirements", () => {
      const allFiles = [
        ...getAllTypeScriptFiles(path.join(process.cwd(), "src")),
        ...getAllTypeScriptFiles(path.join(process.cwd(), "scripts")),
      ]

      const results = allFiles.map(file => analyzeFileStrictCompliance(file))
      const compliantFiles = results.filter(r => r.compliant)
      const nonCompliantFiles = results.filter(r => !r.compliant)

      // Calculate compliance metrics
      const complianceRate = allFiles.length > 0 ? compliantFiles.length / allFiles.length : 1
      const errorCount = results.reduce(
        (sum, r) => sum + r.issues.filter(issue => issue.severity === "error").length,
        0
      )
      const warningCount = results.reduce(
        (sum, r) => sum + r.issues.filter(issue => issue.severity === "warning").length,
        0
      )

      console.log("✅ Constitutional TypeScript strict mode compliance verified:")
      console.log(`  - Total files analyzed: ${allFiles.length}`)
      console.log(`  - Compliant files: ${compliantFiles.length} (${(complianceRate * 100).toFixed(1)}%)`)
      console.log(`  - Non-compliant files: ${nonCompliantFiles.length}`)
      console.log(`  - Total errors: ${errorCount}`)
      console.log(`  - Total warnings: ${warningCount}`)

      if (nonCompliantFiles.length > 0) {
        console.log("\n📋 Non-compliant files:")
        nonCompliantFiles.slice(0, 5).forEach(result => {
          console.log(`  ${path.relative(process.cwd(), result.filePath)}:`)
          result.issues
            .filter(i => i.severity === "error")
            .slice(0, 3)
            .forEach(issue => {
              console.log(`    Line ${issue.line}: ${issue.message}`)
            })
        })
      }

      // Constitutional requirements
      expect(complianceRate).toBeGreaterThan(0.9) // 90%+ compliance rate
      expect(errorCount).toBeLessThan(allFiles.length * 0.5) // Less than 0.5 errors per file average

      // Verify tsconfig strict mode
      const tsconfigPath = path.join(process.cwd(), "tsconfig.json")
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"))
      expect(tsconfig.compilerOptions?.strict).toBe(true)

      console.log("\n✅ All constitutional TypeScript requirements met")
    })

    it("should have comprehensive type coverage", () => {
      // This test ensures overall type safety across the codebase
      const srcFiles = getAllTypeScriptFiles(path.join(process.cwd(), "src"))
      const results = srcFiles.map(file => analyzeFileStrictCompliance(file))

      // Calculate type coverage metrics
      const filesWithTypes = results.filter(
        r => r.issues.filter(i => i.rule === "no-any" || i.rule === "no-implicit-any").length === 0
      )

      const typeCoverage = srcFiles.length > 0 ? filesWithTypes.length / srcFiles.length : 1

      console.log(`📊 Type coverage: ${(typeCoverage * 100).toFixed(1)}%`)

      expect(typeCoverage).toBeGreaterThan(0.85) // 85%+ type coverage
    })
  })
})
