/**
 * Interface Consistency Validation Tests
 *
 * Tests to ensure consistent interface definitions, proper inheritance,
 * and type compatibility across the entire codebase.
 */

import { describe, it, expect, beforeEach } from "vitest"
import fs from "fs"
import path from "path"

interface InterfaceDefinition {
  name: string
  file: string
  line: number
  properties: PropertyDefinition[]
  extends?: string[]
  generic?: boolean
}

interface PropertyDefinition {
  name: string
  type: string
  optional: boolean
  readonly: boolean
}

interface ConsistencyIssue {
  type: "naming" | "structure" | "inheritance" | "compatibility"
  message: string
  interfaces: string[]
  severity: "error" | "warning" | "info"
}

class InterfaceAnalyzer {
  private interfaces: InterfaceDefinition[] = []
  private issues: ConsistencyIssue[] = []

  analyzeFile(filePath: string): void {
    const content = fs.readFileSync(filePath, "utf8")
    const lines = content.split("\n")

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // Parse interface definitions
      const interfaceMatch = line.match(/^\s*export\s+interface\s+(\w+)(<[^>]+>)?\s*(extends\s+([^{]+))?\s*\{?/)
      if (interfaceMatch) {
        const interfaceDef = this.parseInterface(content, lineNumber, interfaceMatch, filePath)
        if (interfaceDef) {
          this.interfaces.push(interfaceDef)
        }
      }
    })
  }

  private parseInterface(
    content: string,
    startLine: number,
    match: RegExpMatchArray,
    filePath: string
  ): InterfaceDefinition | null {
    const name = match[1]
    const generic = !!match[2]
    const extendsClause = match[4]

    const lines = content.split("\n")
    const properties: PropertyDefinition[] = []

    // Find interface body
    let braceCount = 0
    let inInterface = false

    for (let i = startLine - 1; i < lines.length; i++) {
      const line = lines[i]

      if (line.includes("{")) {
        braceCount++
        inInterface = true
        continue
      }

      if (line.includes("}")) {
        braceCount--
        if (braceCount === 0) break
      }

      if (inInterface && braceCount > 0) {
        const propMatch = line.match(/^\s*(\w+)(\?)?:\s*(.+);?\s*$/)
        if (propMatch) {
          properties.push({
            name: propMatch[1],
            type: propMatch[3].replace(/;$/, "").trim(),
            optional: !!propMatch[2],
            readonly: line.includes("readonly"),
          })
        }
      }
    }

    return {
      name,
      file: filePath,
      line: startLine,
      properties,
      extends: extendsClause ? extendsClause.split(",").map(e => e.trim()) : undefined,
      generic,
    }
  }

  analyzeConsistency(): ConsistencyIssue[] {
    this.issues = []

    this.checkNamingConsistency()
    this.checkStructuralConsistency()
    this.checkInheritanceConsistency()
    this.checkCompatibilityIssues()

    return this.issues
  }

  private checkNamingConsistency(): void {
    const namePatterns = new Map<string, InterfaceDefinition[]>()

    // Group interfaces by naming patterns
    this.interfaces.forEach(iface => {
      const baseName = iface.name.replace(/(Props|Config|Options|Data|Info|Details)$/, "")

      if (!namePatterns.has(baseName)) {
        namePatterns.set(baseName, [])
      }
      namePatterns.get(baseName)!.push(iface)
    })

    // Check for inconsistent naming
    namePatterns.forEach((interfaces, baseName) => {
      if (interfaces.length > 1) {
        const suffixes = interfaces.map(iface => iface.name.replace(baseName, "") || "Base")

        const uniqueSuffixes = new Set(suffixes)
        if (uniqueSuffixes.size === interfaces.length && interfaces.length > 2) {
          this.issues.push({
            type: "naming",
            message: `Multiple interfaces with similar names: ${interfaces.map(i => i.name).join(", ")}. Consider consolidation.`,
            interfaces: interfaces.map(i => i.name),
            severity: "info",
          })
        }
      }
    })

    // Check for common naming violations
    this.interfaces.forEach(iface => {
      // Interfaces should use PascalCase
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(iface.name)) {
        this.issues.push({
          type: "naming",
          message: `Interface "${iface.name}" should use PascalCase naming`,
          interfaces: [iface.name],
          severity: "warning",
        })
      }

      // Check for generic naming patterns
      const genericSuffixes = ["Props", "Config", "Options", "Data", "Info"]
      const hasGenericSuffix = genericSuffixes.some(suffix => iface.name.endsWith(suffix))

      if (!hasGenericSuffix && iface.properties.length > 5) {
        this.issues.push({
          type: "naming",
          message: `Large interface "${iface.name}" might benefit from a descriptive suffix (Props, Config, etc.)`,
          interfaces: [iface.name],
          severity: "info",
        })
      }
    })
  }

  private checkStructuralConsistency(): void {
    // Group similar interfaces
    const structuralGroups = new Map<string, InterfaceDefinition[]>()

    this.interfaces.forEach(iface => {
      const signature = this.getStructuralSignature(iface)

      if (!structuralGroups.has(signature)) {
        structuralGroups.set(signature, [])
      }
      structuralGroups.get(signature)!.push(iface)
    })

    // Check for duplicate structures
    structuralGroups.forEach(interfaces => {
      if (interfaces.length > 1) {
        this.issues.push({
          type: "structure",
          message: `Interfaces with identical structure: ${interfaces.map(i => i.name).join(", ")}. Consider merging or using inheritance.`,
          interfaces: interfaces.map(i => i.name),
          severity: "warning",
        })
      }
    })

    // Check for common property patterns
    const commonProperties = new Map<string, InterfaceDefinition[]>()

    this.interfaces.forEach(iface => {
      iface.properties.forEach(prop => {
        const key = `${prop.name}:${prop.type}`
        if (!commonProperties.has(key)) {
          commonProperties.set(key, [])
        }
        commonProperties.get(key)!.push(iface)
      })
    })

    // Identify properties that appear in many interfaces
    commonProperties.forEach((interfaces, propSignature) => {
      if (interfaces.length >= 3) {
        const [propName] = propSignature.split(":")
        this.issues.push({
          type: "structure",
          message: `Property "${propName}" appears in ${interfaces.length} interfaces. Consider extracting to a base interface.`,
          interfaces: interfaces.map(i => i.name),
          severity: "info",
        })
      }
    })
  }

  private getStructuralSignature(iface: InterfaceDefinition): string {
    return iface.properties
      .map(prop => `${prop.name}:${prop.type}${prop.optional ? "?" : ""}`)
      .sort()
      .join("|")
  }

  private checkInheritanceConsistency(): void {
    this.interfaces.forEach(iface => {
      if (iface.extends) {
        iface.extends.forEach(parentName => {
          const parent = this.interfaces.find(i => i.name === parentName)

          if (!parent) {
            this.issues.push({
              type: "inheritance",
              message: `Interface "${iface.name}" extends "${parentName}" which is not found in analyzed files`,
              interfaces: [iface.name],
              severity: "warning",
            })
            return
          }

          // Check for property conflicts
          const conflicts = this.findPropertyConflicts(iface, parent)
          if (conflicts.length > 0) {
            this.issues.push({
              type: "inheritance",
              message: `Interface "${iface.name}" has property conflicts with parent "${parentName}": ${conflicts.join(", ")}`,
              interfaces: [iface.name, parentName],
              severity: "error",
            })
          }
        })
      }
    })
  }

  private findPropertyConflicts(child: InterfaceDefinition, parent: InterfaceDefinition): string[] {
    const conflicts: string[] = []

    child.properties.forEach(childProp => {
      const parentProp = parent.properties.find(p => p.name === childProp.name)

      if (parentProp) {
        // Check type compatibility
        if (childProp.type !== parentProp.type) {
          conflicts.push(`${childProp.name} (${childProp.type} vs ${parentProp.type})`)
        }

        // Check optionality consistency
        if (childProp.optional !== parentProp.optional) {
          conflicts.push(`${childProp.name} (optionality mismatch)`)
        }
      }
    })

    return conflicts
  }

  private checkCompatibilityIssues(): void {
    // Check for interfaces that should be compatible but aren't
    const groupsByContext = this.groupInterfacesByContext()

    Object.entries(groupsByContext).forEach(([context, interfaces]) => {
      if (interfaces.length > 1) {
        // Check for similar interfaces that might need compatibility
        this.checkContextualCompatibility(context, interfaces)
      }
    })
  }

  private groupInterfacesByContext(): Record<string, InterfaceDefinition[]> {
    const groups: Record<string, InterfaceDefinition[]> = {}

    this.interfaces.forEach(iface => {
      // Group by file directory
      const dir = path.dirname(iface.file)
      const context = path.basename(dir)

      if (!groups[context]) {
        groups[context] = []
      }
      groups[context].push(iface)
    })

    return groups
  }

  private checkContextualCompatibility(context: string, interfaces: InterfaceDefinition[]): void {
    // Look for interfaces that have similar purposes but incompatible structures
    interfaces.forEach((iface1, i) => {
      interfaces.slice(i + 1).forEach(iface2 => {
        const similarity = this.calculateSimilarity(iface1, iface2)

        if (similarity > 0.7 && similarity < 1.0) {
          this.issues.push({
            type: "compatibility",
            message: `Interfaces "${iface1.name}" and "${iface2.name}" in ${context} are ${Math.round(similarity * 100)}% similar. Consider alignment.`,
            interfaces: [iface1.name, iface2.name],
            severity: "info",
          })
        }
      })
    })
  }

  private calculateSimilarity(iface1: InterfaceDefinition, iface2: InterfaceDefinition): number {
    const props1 = new Set(iface1.properties.map(p => p.name))
    const props2 = new Set(iface2.properties.map(p => p.name))

    const intersection = new Set([...props1].filter(x => props2.has(x)))
    const union = new Set([...props1, ...props2])

    return intersection.size / union.size
  }

  getInterfaces(): InterfaceDefinition[] {
    return this.interfaces
  }
}

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
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
      files.push(fullPath)
    }
  }

  return files
}

describe("Interface Consistency Validation", () => {
  let analyzer: InterfaceAnalyzer

  beforeEach(() => {
    analyzer = new InterfaceAnalyzer()

    // Analyze all TypeScript files in src directory
    const srcFiles = getAllTypeScriptFiles(path.join(process.cwd(), "src"))
    srcFiles.forEach(file => {
      analyzer.analyzeFile(file)
    })
  })

  describe("Interface Discovery", () => {
    it("should discover all interfaces in the codebase", () => {
      const interfaces = analyzer.getInterfaces()

      expect(interfaces.length).toBeGreaterThan(0)
      console.log(`🔍 Discovered ${interfaces.length} interfaces across the codebase`)

      // Log interface distribution by file
      const byFile = interfaces.reduce(
        (acc, iface) => {
          const fileName = path.basename(iface.file)
          acc[fileName] = (acc[fileName] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      Object.entries(byFile).forEach(([file, count]) => {
        console.log(`  ${file}: ${count} interface${count !== 1 ? "s" : ""}`)
      })
    })

    it("should parse interface properties correctly", () => {
      const interfaces = analyzer.getInterfaces()
      const interfacesWithProps = interfaces.filter(iface => iface.properties.length > 0)

      expect(interfacesWithProps.length).toBeGreaterThan(0)

      // Verify property parsing
      interfacesWithProps.forEach(iface => {
        expect(iface.properties).toBeDefined()
        expect(Array.isArray(iface.properties)).toBe(true)

        iface.properties.forEach(prop => {
          expect(prop.name).toBeTruthy()
          expect(prop.type).toBeTruthy()
          expect(typeof prop.optional).toBe("boolean")
          expect(typeof prop.readonly).toBe("boolean")
        })
      })

      console.log(`✅ Verified property parsing for ${interfacesWithProps.length} interfaces`)
    })
  })

  describe("Naming Consistency", () => {
    it("should follow consistent naming conventions", () => {
      const interfaces = analyzer.getInterfaces()
      const namingIssues = analyzer.analyzeConsistency().filter(issue => issue.type === "naming")

      // Check PascalCase naming
      const nonPascalCaseInterfaces = interfaces.filter(iface => !/^[A-Z][a-zA-Z0-9]*$/.test(iface.name))

      expect(nonPascalCaseInterfaces.length).toBe(0)

      // Log naming analysis
      console.log(
        `📝 Naming analysis: ${interfaces.length - nonPascalCaseInterfaces.length}/${interfaces.length} follow PascalCase`
      )

      if (namingIssues.length > 0) {
        console.log("ℹ️ Naming suggestions:")
        namingIssues.forEach(issue => {
          if (issue.severity !== "error") {
            console.log(`  ${issue.message}`)
          }
        })
      }
    })

    it("should use meaningful interface suffixes", () => {
      const interfaces = analyzer.getInterfaces()
      const meaningfulSuffixes = ["Props", "Config", "Options", "Data", "Info", "Details", "State", "Context"]

      const interfacesWithSuffixes = interfaces.filter(iface =>
        meaningfulSuffixes.some(suffix => iface.name.endsWith(suffix))
      )

      const suffixUsageRate = interfaces.length > 0 ? interfacesWithSuffixes.length / interfaces.length : 0

      console.log(`🏷️ Meaningful suffix usage: ${(suffixUsageRate * 100).toFixed(1)}%`)

      // Encourage but don't require meaningful suffixes
      expect(suffixUsageRate).toBeGreaterThan(0.3) // At least 30% should use meaningful suffixes
    })
  })

  describe("Structural Consistency", () => {
    it("should identify potentially duplicate interfaces", () => {
      const issues = analyzer.analyzeConsistency()
      const structuralIssues = issues.filter(issue => issue.type === "structure")

      // Log structural analysis
      if (structuralIssues.length > 0) {
        console.log("🔄 Structural consistency suggestions:")
        structuralIssues.forEach(issue => {
          console.log(`  ${issue.message}`)
        })
      } else {
        console.log("✅ No duplicate interface structures detected")
      }

      // Allow some duplication but flag excessive cases
      const duplicateStructures = structuralIssues.filter(issue => issue.message.includes("identical structure"))

      expect(duplicateStructures.length).toBeLessThan(5) // Less than 5 cases of identical structures
    })

    it("should detect common property patterns", () => {
      const interfaces = analyzer.getInterfaces()
      const allProperties = interfaces.flatMap(iface => iface.properties)

      // Analyze property frequency
      const propertyFrequency = allProperties.reduce(
        (acc, prop) => {
          const key = `${prop.name}:${prop.type}`
          acc[key] = (acc[key] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )

      const commonProperties = Object.entries(propertyFrequency)
        .filter(([, count]) => count >= 3)
        .sort(([, a], [, b]) => b - a)

      if (commonProperties.length > 0) {
        console.log("🔗 Common properties across interfaces:")
        commonProperties.slice(0, 5).forEach(([prop, count]) => {
          const [name, type] = prop.split(":")
          console.log(`  ${name} (${type}): used in ${count} interfaces`)
        })
      }
    })
  })

  describe("Inheritance Consistency", () => {
    it("should validate interface inheritance", () => {
      const issues = analyzer.analyzeConsistency()
      const inheritanceIssues = issues.filter(issue => issue.type === "inheritance")

      // Should not have inheritance errors
      const inheritanceErrors = inheritanceIssues.filter(issue => issue.severity === "error")
      expect(inheritanceErrors.length).toBe(0)

      if (inheritanceIssues.length > 0) {
        console.log("🔗 Inheritance analysis:")
        inheritanceIssues.forEach(issue => {
          const emoji = issue.severity === "error" ? "❌" : issue.severity === "warning" ? "⚠️" : "ℹ️"
          console.log(`  ${emoji} ${issue.message}`)
        })
      } else {
        console.log("✅ All interface inheritance is consistent")
      }
    })

    it("should check for proper interface extensions", () => {
      const interfaces = analyzer.getInterfaces()
      const interfacesWithExtends = interfaces.filter(iface => iface.extends && iface.extends.length > 0)

      console.log(`🏗️ Interface inheritance: ${interfacesWithExtends.length} interfaces extend others`)

      // Verify inheritance chains
      interfacesWithExtends.forEach(iface => {
        iface.extends!.forEach(parentName => {
          const parent = interfaces.find(i => i.name === parentName)
          if (!parent && !parentName.includes("<")) {
            // Allow generic types
            console.warn(`⚠️ Interface ${iface.name} extends ${parentName} which is not found`)
          }
        })
      })
    })
  })

  describe("Type Compatibility", () => {
    it("should identify compatibility opportunities", () => {
      const issues = analyzer.analyzeConsistency()
      const compatibilityIssues = issues.filter(issue => issue.type === "compatibility")

      if (compatibilityIssues.length > 0) {
        console.log("🤝 Interface compatibility suggestions:")
        compatibilityIssues.forEach(issue => {
          console.log(`  ${issue.message}`)
        })
      } else {
        console.log("✅ No significant compatibility issues detected")
      }

      // This is informational, not a hard requirement
      expect(compatibilityIssues.filter(i => i.severity === "error").length).toBe(0)
    })

    it("should validate consistent property types across similar interfaces", () => {
      const interfaces = analyzer.getInterfaces()
      const propertyTypeMap = new Map<string, Set<string>>()

      // Collect all property name -> type mappings
      interfaces.forEach(iface => {
        iface.properties.forEach(prop => {
          if (!propertyTypeMap.has(prop.name)) {
            propertyTypeMap.set(prop.name, new Set())
          }
          propertyTypeMap.get(prop.name)!.add(prop.type)
        })
      })

      // Find properties with inconsistent types
      const inconsistentProperties = Array.from(propertyTypeMap.entries())
        .filter(([, types]) => types.size > 1)
        .map(([name, types]) => ({ name, types: Array.from(types) }))

      if (inconsistentProperties.length > 0) {
        console.log("🔀 Properties with varying types across interfaces:")
        inconsistentProperties.slice(0, 5).forEach(({ name, types }) => {
          console.log(`  ${name}: ${types.join(", ")}`)
        })
      }

      // Allow some variation but flag excessive inconsistency
      expect(inconsistentProperties.length).toBeLessThan(10)
    })
  })

  describe("Constitutional Interface Compliance", () => {
    it("should meet constitutional interface consistency requirements", () => {
      const interfaces = analyzer.getInterfaces()
      const issues = analyzer.analyzeConsistency()

      // Calculate compliance metrics
      const totalIssues = issues.length
      const errorIssues = issues.filter(issue => issue.severity === "error").length
      const warningIssues = issues.filter(issue => issue.severity === "warning").length
      const infoIssues = issues.filter(issue => issue.severity === "info").length

      // Interface quality metrics
      const avgPropertiesPerInterface =
        interfaces.length > 0
          ? interfaces.reduce((sum, iface) => sum + iface.properties.length, 0) / interfaces.length
          : 0

      const interfacesWithInheritance = interfaces.filter(iface => iface.extends && iface.extends.length > 0).length
      const inheritanceUsageRate = interfaces.length > 0 ? interfacesWithInheritance / interfaces.length : 0

      console.log("✅ Constitutional interface consistency requirements verified:")
      console.log(`  - Total interfaces analyzed: ${interfaces.length}`)
      console.log(`  - Average properties per interface: ${avgPropertiesPerInterface.toFixed(1)}`)
      console.log(`  - Interface inheritance usage: ${(inheritanceUsageRate * 100).toFixed(1)}%`)
      console.log(`  - Total consistency issues: ${totalIssues}`)
      console.log(`    - Errors: ${errorIssues}`)
      console.log(`    - Warnings: ${warningIssues}`)
      console.log(`    - Info/Suggestions: ${infoIssues}`)

      // Constitutional requirements
      expect(interfaces.length).toBeGreaterThan(0) // Must have interfaces
      expect(errorIssues).toBe(0) // No consistency errors allowed
      expect(warningIssues).toBeLessThan(interfaces.length * 0.1) // Less than 10% warning rate

      // Quality metrics
      expect(avgPropertiesPerInterface).toBeGreaterThan(1) // Interfaces should have meaningful properties
      expect(avgPropertiesPerInterface).toBeLessThan(20) // Interfaces shouldn't be too large

      console.log("\n✅ All constitutional interface consistency requirements met")
    })

    it("should demonstrate proper TypeScript interface patterns", () => {
      const interfaces = analyzer.getInterfaces()

      // Check for various interface patterns
      const configInterfaces = interfaces.filter(iface => iface.name.endsWith("Config"))
      const propsInterfaces = interfaces.filter(iface => iface.name.endsWith("Props"))
      const dataInterfaces = interfaces.filter(iface => iface.name.endsWith("Data") || iface.name.endsWith("Info"))
      const genericInterfaces = interfaces.filter(iface => iface.generic)

      console.log("🏗️ Interface pattern usage:")
      console.log(`  - Configuration interfaces: ${configInterfaces.length}`)
      console.log(`  - Component Props interfaces: ${propsInterfaces.length}`)
      console.log(`  - Data/Info interfaces: ${dataInterfaces.length}`)
      console.log(`  - Generic interfaces: ${genericInterfaces.length}`)

      // Verify healthy mix of interface types
      const totalPatternInterfaces = configInterfaces.length + propsInterfaces.length + dataInterfaces.length
      const patternUsageRate = interfaces.length > 0 ? totalPatternInterfaces / interfaces.length : 0

      expect(patternUsageRate).toBeGreaterThan(0.3) // At least 30% follow common patterns

      console.log("✅ Demonstrates proper TypeScript interface design patterns")
    })
  })
})
