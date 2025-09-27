<!--
Sync Impact Report:
- Version change: none → 1.0.0
- New constitution created for Next.js 15 Portfolio Project
- Added principles: Performance-First, Component-First, Accessibility-First, Modern Stack, TypeScript Strict
- Added sections: Performance Standards, Development Workflow
- Templates requiring updates:
  ✅ constitution.md (created)
  ⚠ plan-template.md (needs constitution check section update)
  ⚠ spec-template.md (needs performance requirement checks)
  ⚠ tasks-template.md (needs performance validation tasks)
- Follow-up TODOs: Update template files for consistency
-->

# Next.js Portfolio Constitution

## Core Principles

### I. Performance-First (NON-NEGOTIABLE)

Every feature MUST achieve Lighthouse 95+ across all metrics before deployment.
Core Web Vitals targets: LCP < 1.2s, FID < 100ms, CLS < 0.1. All images MUST use
Next.js Image component with proper optimization. Code splitting via dynamic
imports is REQUIRED for components over 50KB. Bundle size increases require
explicit justification.

**Rationale**: Portfolio projects are judged primarily on technical execution.
Performance demonstrates senior-level frontend expertise and directly impacts
user experience and SEO rankings.

### II. Component-First Architecture

All UI elements MUST be implemented as reusable TypeScript components with
proper interfaces. Server Components are the default; Client Components only for
interactivity, hooks, or browser APIs. All components MUST follow the
established pattern: interfaces for props, explicit return types, proper error
boundaries.

**Rationale**: Demonstrates advanced React architecture skills, ensures
maintainability, and showcases modern Next.js 15 App Router patterns to
potential employers.

### III. Accessibility-First (NON-NEGOTIABLE)

WCAG 2.1 AAA compliance is MANDATORY. All interactive elements MUST support
keyboard navigation. Color contrast ratio MUST be 7:1 minimum. ARIA labels and
semantic HTML are REQUIRED. Screen reader compatibility MUST be validated before
any feature ships.

**Rationale**: Accessibility demonstrates professional frontend expertise and is
legally required in many contexts. Senior developers must build inclusive
experiences by default.

### IV. Modern Stack Consistency

Tech stack is FIXED: Next.js 15, TypeScript strict mode, Tailwind CSS 4,
shadcn/ui, Framer Motion. NO additional dependencies without explicit
constitutional amendment. All code MUST use ES2022+ features appropriately.
React 19 patterns are REQUIRED where applicable.

**Rationale**: Consistency demonstrates expertise with modern tools. Dependency
discipline prevents bloat and maintains performance. Fixed stack ensures deep
specialization over surface-level breadth.

### V. TypeScript Strict Enforcement

TypeScript strict mode is NON-NEGOTIABLE. All component props and return types
MUST be explicitly typed. Interfaces are preferred over types for object shapes.
Generic constraints MUST be used appropriately. Any use of `any` type requires
architectural review and explicit justification.

**Rationale**: Strong typing prevents runtime errors, improves developer
experience, and demonstrates advanced TypeScript skills expected at senior
levels.

## Performance Standards

Core Web Vitals enforcement: All pages MUST achieve LCP < 1.2s, FID < 100ms, CLS
< 0.1 in production. Bundle analysis MUST be performed for every build. Images
MUST be optimized using Next.js Image component with appropriate loading
strategies. Critical CSS MUST be inlined, non-critical CSS MUST be loaded
asynchronously. JavaScript execution time MUST stay under 100ms for main thread
blocking.

Performance monitoring via Lighthouse CI in deployment pipeline is MANDATORY.
Any performance regression blocks deployment until resolved.

## Development Workflow

Code quality gates: ESLint and Prettier MUST pass before commits. TypeScript
compilation MUST succeed with zero errors or warnings. Accessibility tests via
axe-core are MANDATORY. Component testing in isolation using Vitest + React
Testing Library is REQUIRED for all interactive components.

Commit standards: Conventional commits are MANDATORY. Performance impact MUST be
documented in commit messages where applicable. All commits MUST include bundle
size impact assessment for changes affecting JavaScript payload.

## Governance

This constitution supersedes all other development practices and guidelines. Any
feature development MUST verify compliance with all five core principles before
deployment. Performance standards are non-negotiable and require constitutional
amendment to modify.

Amendment process: Changes require documentation of rationale, performance
impact assessment, and migration plan for existing code. Emergency amendments
for critical security or performance issues may bypass normal review with
post-hoc justification.

Development guidance: Use `.github/copilot-instructions.md` and `.cursorrules`
for detailed implementation patterns. All specifications and tasks MUST
reference this constitution for compliance verification.

**Version**: 1.0.0 | **Ratified**: 2025-09-27 | **Last Amended**: 2025-09-27
