# Copilot Instructions for Portfolio Project

This project is a Next.js 15 portfolio, showcasing advanced frontend skills with a focus on performance, accessibility, and innovative user interactions. Follow these guidelines to be immediately productive as an AI coding agent:

## Architecture & Structure

- **Framework:** Next.js 15 (App Router only, no Pages Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4, CSS variables, shadcn/ui
- **State Management:** Zustand (for complex UI interactions)
- **Animations:** Framer Motion, CSS transforms, custom micro-interactions
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel

## Component & File Patterns

- Use **Server Components** by default; use **Client Components** only for interactivity, hooks, or browser APIs
- Component props and return types must always be typed
- Prefer interfaces over types for object shapes
- Use kebab-case for file names; PascalCase for components; camelCase for hooks/utils
- Group related components in folders with `index.tsx` barrel exports
- Example component:
  ```typescript
  interface ComponentProps {
    /* ... */
  }
  export default function Component(props: ComponentProps): JSX.Element {
    /* ... */
  }
  ```

## Data & Content

- Static data lives in `src/data/unified-data.ts` (migrate any JS data to TS interfaces)
- Content (projects, snippets) is in `src/content/`

## Developer Workflows

- **Start dev server:** `npm run dev` or `yarn dev`
- **Run tests:** `npm test` (Vitest)
- **Lint/format:** `npm run lint` and `npm run format`
- **Build:** `npm run build`
- **Preview:** `npm run preview`

## Performance & Accessibility

- Optimize images with Next.js `Image` component
- Use lazy loading and dynamic imports for code splitting
- Target Core Web Vitals: LCP < 1.2s, FID < 100ms, CLS < 0.1
- Ensure WCAG 2.1 AAA compliance, semantic HTML, ARIA labels, keyboard navigation
- Respect `prefers-reduced-motion` for animations

## Error Handling & SEO

- Use error boundaries and fallback UI states
- Provide meaningful error messages for async operations
- Implement meta tags and Open Graph for SEO in `next-seo.config.ts`

## Commit & Code Quality

- Use conventional commits
- Run ESLint, Prettier, and accessibility checks before committing
- Test components in isolation

## Integration Points

- External libraries: FontAwesome, Framer Motion, Zustand, shadcn/ui
- API routes: `src/app/api/`

## References

- See `.cursorrules` for detailed architecture and conventions
- See `README.md` for getting started and deployment
- Key directories: `src/components/`, `src/hooks/`, `src/lib/`, `src/data/`, `src/content/`, `src/types/`

---

**Every change should demonstrate senior-level frontend expertise: prioritize performance, accessibility, and user experience.**
