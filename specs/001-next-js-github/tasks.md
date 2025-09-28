# Tasks: GitHub Markdown CMS Integration

**Input**: Design documents from `/specs/001-next-js-github/` **Prerequisites**:
plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure for Next.js 15 App Router web application:

- Core logic: `src/lib/`
- API routes: `src/app/api/`
- Components: `src/components/`
- Types: `src/types/`
- Tests: `tests/`

## Phase 3.1: Setup

- [ ] T001 Create Next.js 15 project structure with App Router in `src/`
      directory per plan.md architecture
- [ ] T002 [P] Install TypeScript dependencies: @types/node, typescript (already
      in package.json)
- [ ] T003 [P] Install content processing dependencies: gray-matter, remark,
      rehype, remark-gfm, rehype-highlight, next-mdx-remote
- [ ] T004 [P] Install GitHub API dependency: @octokit/rest
- [ ] T005 Configure TypeScript strict mode in `tsconfig.json` with Next.js 15
      App Router settings
- [ ] T006 [P] Configure ESLint and Prettier for constitutional compliance in
      `.eslintrc.js` and `.prettierrc`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY
implementation**

### Contract Tests [P]

- [ ] T007 [P] Contract test GET /api/content/blog in
      `tests/contract/test_content_api_blog_list.test.ts`
- [ ] T008 [P] Contract test GET /api/content/blog/[slug] in
      `tests/contract/test_content_api_blog_detail.test.ts`
- [ ] T009 [P] Contract test GET /api/content/projects in
      `tests/contract/test_content_api_projects.test.ts`
- [ ] T010 [P] Contract test GET /api/content/projects/[slug] in
      `tests/contract/test_content_api_project_detail.test.ts`
- [ ] T011 [P] Contract test GET /api/content/search in
      `tests/contract/test_content_api_search.test.ts`
- [ ] T012 [P] Contract test POST /api/content/sync in
      `tests/contract/test_content_api_sync.test.ts`
- [ ] T013 [P] Contract test GET /api/content/status in
      `tests/contract/test_content_api_status.test.ts`
- [ ] T014 [P] Contract test GET /preview/[slug] in
      `tests/contract/test_preview_api.test.ts`
- [ ] T015 [P] Contract test POST /api/preview/generate in
      `tests/contract/test_preview_generate.test.ts`

### Integration Tests [P]

- [ ] T016 [P] Integration test GitHub API connection in
      `tests/integration/test_github_connection.test.ts`
- [ ] T017 [P] Integration test content synchronization flow in
      `tests/integration/test_content_sync.test.ts`
- [ ] T018 [P] Integration test markdown processing pipeline in
      `tests/integration/test_markdown_processing.test.ts`
- [ ] T019 [P] Integration test caching system in
      `tests/integration/test_cache_system.test.ts`
- [ ] T020 [P] Integration test preview token system in
      `tests/integration/test_preview_system.test.ts`
- [ ] T021 [P] Integration test search functionality in
      `tests/integration/test_search.test.ts`
- [ ] T022 [P] Integration test error handling and fallbacks in
      `tests/integration/test_error_handling.test.ts`

## Phase 3.3: Type Definitions & Models (ONLY after tests are failing)

### Core Types [P]

- [ ] T023 [P] BlogPost interface in `src/types/content.ts`
- [ ] T024 [P] Project interface in `src/types/content.ts`
- [ ] T025 [P] ContentMetadata interface in `src/types/content.ts`
- [ ] T026 [P] AssetFile interface in `src/types/content.ts`
- [ ] T027 [P] GitHubContent interface in `src/types/github.ts`
- [ ] T028 [P] CacheEntry interface in `src/types/cache.ts`
- [ ] T029 [P] SyncOperation interface in `src/types/sync.ts`
- [ ] T030 [P] SearchResult interface in `src/types/search.ts`
- [ ] T031 [P] PreviewSession interface in `src/types/preview.ts`
- [ ] T032 [P] ValidationError interface in `src/types/validation.ts`

### API Response Types [P]

- [ ] T033 [P] Content API response types in `src/types/api.ts`
- [ ] T034 [P] Preview API response types in `src/types/api.ts`
- [ ] T035 [P] GitHub service response types in `src/types/api.ts`

## Phase 3.4: Core Service Layer

### GitHub Service

- [ ] T036 GitHub API client service in `src/lib/github/client.ts`
- [ ] T037 Repository content fetcher in `src/lib/github/content-fetcher.ts`
- [ ] T038 File content processor in `src/lib/github/file-processor.ts`
- [ ] T039 API rate limit handler in `src/lib/github/rate-limiter.ts`

### Content Processing Services [P]

- [ ] T040 [P] Markdown parser service in `src/lib/content/markdown-parser.ts`
- [ ] T041 [P] Frontmatter processor in
      `src/lib/content/frontmatter-processor.ts`
- [ ] T042 [P] Content slug generator in `src/lib/content/slug-generator.ts`
- [ ] T043 [P] Content validator in `src/lib/content/content-validator.ts`
- [ ] T044 [P] SEO metadata generator in `src/lib/content/seo-generator.ts`

### Cache System [P]

- [ ] T045 [P] Memory cache service in `src/lib/cache/memory-cache.ts`
- [ ] T046 [P] File system cache service in `src/lib/cache/file-cache.ts`
- [ ] T047 [P] Cache manager with TTL in `src/lib/cache/cache-manager.ts`
- [ ] T048 [P] Cache invalidation service in
      `src/lib/cache/cache-invalidator.ts`

## Phase 3.5: API Route Implementation

### Content API Routes

- [ ] T049 GET /api/content/blog endpoint in `src/app/api/content/blog/route.ts`
- [ ] T050 GET /api/content/blog/[slug] endpoint in
      `src/app/api/content/blog/[slug]/route.ts`
- [ ] T051 GET /api/content/projects endpoint in
      `src/app/api/content/projects/route.ts`
- [ ] T052 GET /api/content/projects/[slug] endpoint in
      `src/app/api/content/projects/[slug]/route.ts`
- [ ] T053 GET /api/content/search endpoint in
      `src/app/api/content/search/route.ts`
- [ ] T054 POST /api/content/sync endpoint in
      `src/app/api/content/sync/route.ts`
- [ ] T055 GET /api/content/status endpoint in
      `src/app/api/content/status/route.ts`

### Preview API Routes

- [ ] T056 GET /preview/[slug] page in `src/app/preview/[slug]/page.tsx`
- [ ] T057 POST /api/preview/generate endpoint in
      `src/app/api/preview/generate/route.ts`
- [ ] T058 DELETE /api/preview/[token] endpoint in
      `src/app/api/preview/[token]/route.ts`

## Phase 3.6: Frontend Pages & Components

### Page Components (Server Components) [P]

- [x] T059 [P] Blog listing page in `src/app/blog/page.tsx`
- [x] T060 [P] Individual blog post page in `src/app/blog/[slug]/page.tsx`
- [x] T061 [P] Projects listing page in `src/app/projects/page.tsx`
- [x] T062 [P] Individual project page in `src/app/projects/[slug]/page.tsx`
- [x] T063 [P] Search results page in `src/app/search/page.tsx`

### Content Components [P]

- [x] T064 [P] Blog post card component in
      `src/components/content/blog-post-card.tsx`
- [x] T065 [P] Project card component in
      `src/components/content/project-card.tsx`
- [x] T066 [P] Content pagination component in
      `src/components/content/pagination.tsx`
- [x] T067 [P] Search form component (Client Component) in
      `src/components/content/search-form.tsx`
- [x] T068 [P] Tag filter component (Client Component) in
      `src/components/content/tag-filter.tsx`
- [x] T069 [P] Content freshness indicator in
      `src/components/content/freshness-indicator.tsx`

### Layout & Navigation [P]

- [x] T070 [P] Content layout wrapper in
      `src/components/layout/content-layout.tsx`
- [x] T071 [P] Loading states component in
      `src/components/ui/loading-states.tsx`
- [x] T072 [P] Error boundary component in
      `src/components/ui/error-boundary.tsx`
- [x] T073 [P] 404 page with content suggestions in `src/app/not-found.tsx`

## Phase 3.7: Content Synchronization System

### Sync Services

- [x] T074 Content sync orchestrator in `src/lib/sync/sync-orchestrator.ts`
- [x] T075 File change detector in `src/lib/sync/change-detector.ts`
- [x] T076 Content processor in `src/lib/sync/content-processor.ts`
- [x] T077 Sync operation logger in `src/lib/sync/sync-logger.ts`
- [x] T078 Error notification service in `src/lib/sync/notification-service.ts`

### Search System [P]

- [x] T079 [P] Content indexer in `src/lib/search/content-indexer.ts`
- [x] T080 [P] Search engine in `src/lib/search/search-engine.ts`
- [x] T081 [P] Search result highlighter in
      `src/lib/search/result-highlighter.ts`

### Preview System [P]

- [x] T082 [P] Preview token generator in `src/lib/preview/token-generator.ts`
- [x] T083 [P] Preview token validator in `src/lib/preview/token-validator.ts`
- [x] T084 [P] Preview content resolver in `src/lib/preview/content-resolver.ts`

## Phase 3.8: Configuration & Utilities

### Configuration [P]

- [x] T085 [P] Environment configuration in `src/lib/config/env.ts`
- [x] T086 [P] GitHub repository configuration in `src/lib/config/github.ts`
- [x] T087 [P] Cache configuration in `src/lib/config/cache.ts`
- [x] T088 [P] Performance monitoring config in `src/lib/config/monitoring.ts`

### Utilities [P]

- [x] T089 [P] Date formatting utilities in `src/lib/utils/date.ts`
- [x] T090 [P] URL utilities in `src/lib/utils/url.ts`
- [x] T091 [P] Image optimization helpers in `src/lib/utils/image.ts`
- [x] T092 [P] Error logging utilities in `src/lib/utils/error.ts`

## Phase 3.9: Constitutional Compliance & Polish

### Performance Optimization [P]

- [ ] T093 [P] Bundle analysis setup in `scripts/analyze-bundle.js`
- [ ] T094 [P] Image optimization verification in
      `tests/performance/test_image_optimization.test.ts`
- [ ] T095 [P] Core Web Vitals measurement in
      `tests/performance/test_web_vitals.test.ts`
- [ ] T096 [P] Lighthouse CI configuration in `.github/workflows/lighthouse.yml`

### Accessibility Compliance [P]

- [ ] T097 [P] Accessibility testing with axe-core in
      `tests/accessibility/test_a11y.test.ts`
- [ ] T098 [P] Keyboard navigation testing in
      `tests/accessibility/test_keyboard_nav.test.ts`
- [ ] T099 [P] Screen reader compatibility testing in
      `tests/accessibility/test_screen_reader.test.ts`
- [ ] T100 [P] Color contrast validation in
      `tests/accessibility/test_color_contrast.test.ts`

### TypeScript Strict Mode Compliance [P]

- [ ] T101 [P] Type coverage analysis in `scripts/check-type-coverage.ts`
- [ ] T102 [P] Strict mode compliance verification in
      `tests/typescript/test_strict_compliance.test.ts`
- [ ] T103 [P] Interface consistency validation in
      `tests/typescript/test_interface_consistency.test.ts`

### Documentation & Cleanup [P]

- [ ] T104 [P] API documentation generation in `docs/api.md`
- [ ] T105 [P] Component documentation in `docs/components.md`
- [ ] T106 [P] Deployment guide in `docs/deployment.md`
- [ ] T107 [P] Remove development scaffolding and debug code
- [ ] T108 [P] Final code review and cleanup

## Dependencies

**Critical Path Dependencies**:

- Setup (T001-T006) before all other phases
- Tests (T007-T022) before implementation (T023-T108)
- Types (T023-T035) before services and API routes
- GitHub Service (T036-T039) before Content Processing and API routes
- Cache System (T045-T048) before API routes and sync system
- Core services before integration features

**Parallel Execution Groups**:

```bash
# Setup Phase (after T001-T005 complete)
Task: T006 "Configure ESLint and Prettier"

# Contract Tests (all parallel after setup)
Task: T007 "Contract test GET /api/content/blog"
Task: T008 "Contract test GET /api/content/blog/[slug]"
Task: T009 "Contract test GET /api/content/projects"
# ... (T007-T015 all parallel)

# Integration Tests (all parallel after contract tests)
Task: T016 "Integration test GitHub API connection"
Task: T017 "Integration test content synchronization"
# ... (T016-T022 all parallel)

# Type Definitions (all parallel after tests)
Task: T023 "BlogPost interface"
Task: T024 "Project interface"
# ... (T023-T035 all parallel)

# Core Services (parallel within groups)
# GitHub Services (T036-T039 sequential due to dependencies)
Task: T040 "Markdown parser service"
Task: T041 "Frontmatter processor"
# ... (T040-T044 all parallel)

# Cache System (all parallel)
Task: T045 "Memory cache service"
Task: T046 "File system cache service"
# ... (T045-T048 all parallel)
```

**Validation Checklist**:

- [x] All contracts have corresponding tests (T007-T015)
- [x] All entities have type definitions (T023-T032)
- [x] All API endpoints implemented (T049-T058)
- [x] All integration scenarios tested (T016-T022)
- [x] Constitutional compliance verified (T093-T103)
- [x] Each task specifies exact file path
- [x] Parallel tasks are truly independent
- [x] Dependencies properly ordered

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing features (TDD)
- Commit after completing each task
- Constitutional compliance gates at T093-T103 before final deployment
- All file paths are absolute from repository root
- Total: 108 tasks optimized for parallel execution where possible

This task list provides comprehensive coverage of the GitHub Markdown CMS
Integration with proper TDD methodology, constitutional compliance, and
efficient parallel execution opportunities.
