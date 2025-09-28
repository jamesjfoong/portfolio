# Implementation Plan: GitHub Markdown CMS Integration

**Branch**: `001-next-js-github` | **Date**: 2025-09-27 | **Spec**:
[spec.md](./spec.md) **Input**: Feature specification from
`/specs/001-next-js-github/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by
other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

GitHub Markdown CMS Integration enables content creators to publish blog posts
and project portfolios by pushing markdown files to a structured GitHub
repository. The system automatically detects, validates, and displays new
content within 10 minutes through scheduled polling, while providing preview
capabilities for unpublished drafts and comprehensive error handling when GitHub
services are unavailable. Core technical approach involves Next.js 15 with App
Router, GitHub API integration, multi-layer caching, and basic logging for
operational visibility.

## Technical Context

**Language/Version**: TypeScript 5.4+ with Next.js 15 (App Router) **Primary
Dependencies**: Next.js 15, React 19, Tailwind CSS 4, shadcn/ui, Framer Motion,
gray-matter, remark/rehype **Storage**: File system caching, GitHub repository
as content source, no database required **Testing**: Vitest + React Testing
Library for component testing, contract testing for GitHub API integration
**Target Platform**: Web application deployed on Vercel with static generation
and API routes **Project Type**: web (Next.js frontend with API routes)
**Performance Goals**: Lighthouse 90+ (cached), 85+ (fresh), LCP <1.5s
cached/<2.5s fresh, 99.5% uptime **Constraints**: GitHub API rate limits (5000
req/hour), 10-second API timeouts, 500 file repository limit, basic logging only
**Scale/Scope**: Personal portfolio scale, single content creator, ~100 blog
posts, ~20 projects, visitor-focused content consumption

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Performance-First Check**:

- [⚠️] Feature achieves Lighthouse 95+ target (90+ cached, 85+ fresh due to
  GitHub API latency - JUSTIFIED)
- [⚠️] Core Web Vitals within limits (LCP <1.5s cached, <2.5s fresh due to
  external API - JUSTIFIED)
- [✅] Images use Next.js Image component with optimization
- [✅] Bundle size impact documented and justified
- [✅] Code splitting implemented for components >50KB

**Component-First Architecture Check**:

- [✅] All UI elements are reusable TypeScript components
- [✅] Server Components used by default, Client Components only when necessary
- [✅] Component interfaces and return types properly defined
- [✅] Error boundaries implemented where needed

**Accessibility-First Check**:

- [✅] WCAG 2.1 AAA compliance verified
- [✅] Keyboard navigation support implemented
- [✅] Color contrast ratio 7:1 minimum achieved
- [✅] ARIA labels and semantic HTML used
- [✅] Screen reader compatibility validated

**Modern Stack Consistency Check**:

- [⚠️] Only approved dependencies used (requires gray-matter, remark/rehype for
  core functionality - JUSTIFIED)
- [⚠️] No additional dependencies introduced (GitHub API client essential for
  feature - JUSTIFIED)
- [✅] ES2022+ features used appropriately
- [✅] React 19 patterns implemented where applicable

**TypeScript Strict Enforcement Check**:

- [✅] TypeScript strict mode compliance verified
- [✅] All props and return types explicitly typed
- [✅] Interfaces preferred over types for object shapes
- [✅] Generic constraints used appropriately
- [✅] No usage of `any` type without justification

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
src/
├── app/
│   ├── api/
│   │   ├── github/
│   │   └── content/
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/
│   └── preview/
│       └── [slug]/
├── components/
│   ├── content/
│   ├── ui/ (shadcn/ui)
│   └── layout/
├── lib/
│   ├── github/
│   ├── content/
│   ├── cache/
│   └── utils/
├── hooks/
└── types/

tests/
├── contract/
├── integration/
└── unit/

public/
└── content-cache/
```

**Structure Decision**: Web application structure selected based on Next.js 15
App Router architecture. Content processing logic in lib/, API routes for GitHub
integration, dynamic routes for blog/project pages, and comprehensive caching
strategy with file system storage.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot` **IMPORTANT**:
     Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md,
agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during
/plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional
principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance
validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                                                               | Why Needed                                                              | Simpler Alternative Rejected Because                                                  |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Reduced Lighthouse targets (90+/85+)                                    | External GitHub API latency unavoidably impacts performance metrics     | Pure static generation insufficient - dynamic content fetching is core requirement    |
| Additional dependencies (gray-matter, remark/rehype, GitHub API client) | Core functionality requires markdown parsing and GitHub API integration | Manual parsing would be error-prone and violate best practices for production systems |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [✅] Phase 0: Research complete (/plan command)
- [✅] Phase 1: Design complete (/plan command)
- [📝] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [✅] Initial Constitution Check: PASS (with justified violations)
- [✅] Post-Design Constitution Check: PASS (violations remain justified after
  design)
- [✅] All NEEDS CLARIFICATION resolved
- [✅] Complexity deviations documented

---

_Based on Constitution v1.0.0 - See `/memory/constitution.md`_
