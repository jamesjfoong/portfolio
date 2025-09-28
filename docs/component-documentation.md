# GitHub Markdown CMS - Component Documentation

## Component Architecture

The GitHub Markdown CMS uses a hierarchical component architecture with strict
TypeScript typing, accessibility compliance, and performance optimization
built-in.

## Core UI Components

### Enhanced Card (`src/components/ui/enhanced-card.tsx`)

A performant card component with accessibility features and animation support.

#### Interface

```typescript
interface EnhancedCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outlined" | "elevated"
  interactive?: boolean
  href?: string
  onClick?: () => void
  ariaLabel?: string
}
```

#### Features

- Semantic HTML structure with proper ARIA attributes
- Keyboard navigation support
- Focus management and visual indicators
- Optimized animations with `prefers-reduced-motion` support
- Multiple visual variants

#### Usage

```tsx
<EnhancedCard
  variant="elevated"
  interactive
  href="/blog/post"
  ariaLabel="Read blog post about React"
>
  <h3>Blog Post Title</h3>
  <p>Post excerpt...</p>
</EnhancedCard>
```

#### Accessibility Features

- Proper heading hierarchy
- Descriptive ARIA labels
- Keyboard interaction support
- High contrast focus indicators
- Screen reader compatibility

### Project Card (`src/components/ui/project-card.tsx`)

Specialized card for displaying project information with rich media support.

#### Interface

```typescript
interface ProjectCardProps {
  project: ProjectData
  variant?: "compact" | "detailed"
  showTechnologies?: boolean
  showDescription?: boolean
  lazy?: boolean
}

interface ProjectData {
  id: string
  title: string
  description: string
  image?: string
  technologies: string[]
  href: string
  status: "active" | "completed" | "archived"
}
```

#### Features

- Lazy loading for images and content
- Technology badge display
- Status indicators
- Progressive enhancement
- Responsive design

#### Performance Optimizations

- Next.js Image component integration
- Lazy loading with Intersection Observer
- Critical resource prioritization
- Minimal layout shift

### Blog Card (`src/components/ui/blog-card.tsx`)

Optimized card component for blog post listings with reading time and metadata.

#### Interface

```typescript
interface BlogCardProps {
  post: BlogPostData
  variant?: "summary" | "detailed"
  showExcerpt?: boolean
  showReadingTime?: boolean
  showTags?: boolean
}

interface BlogPostData {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  readingTime: number
  tags: string[]
  author?: AuthorData
}
```

#### Features

- Reading time calculation
- Tag and category display
- Author information
- Publication date formatting
- Social sharing integration

### Lazy Image (`src/components/ui/lazy-image.tsx`)

High-performance image component with lazy loading and placeholder support.

#### Interface

```typescript
interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  priority?: boolean
  quality?: number
  className?: string
}
```

#### Features

- Intersection Observer lazy loading
- WebP format optimization
- Responsive image sizing
- Blur placeholder support
- Error fallback handling

#### Performance Benefits

- Reduces initial bundle size
- Improves Core Web Vitals scores
- Minimizes bandwidth usage
- Progressive image loading

### Timeline (`src/components/ui/timeline.tsx`)

Accessible timeline component for displaying chronological information.

#### Interface

```typescript
interface TimelineProps {
  items: TimelineItem[]
  variant?: "vertical" | "horizontal"
  animated?: boolean
}

interface TimelineItem {
  id: string
  title: string
  description: string
  date: string
  icon?: React.ReactNode
  href?: string
}
```

#### Features

- Semantic timeline structure
- ARIA live regions for updates
- Keyboard navigation
- Responsive design
- Animation with reduced motion support

### Scroll Progress (`src/components/ui/scroll-progress.tsx`)

Reading progress indicator with accessibility features.

#### Interface

```typescript
interface ScrollProgressProps {
  target?: string // Element selector to track
  position?: "top" | "bottom"
  variant?: "bar" | "circle"
  showPercentage?: boolean
}
```

#### Features

- Scroll position tracking
- Visual progress indication
- Screen reader announcements
- Performance-optimized updates
- Customizable appearance

## Layout Components

### Modern Hero (`src/components/sections/modern-hero.tsx`)

Hero section component with advanced typography and animation features.

#### Interface

```typescript
interface ModernHeroProps {
  title: string
  subtitle?: string
  description?: string
  actions?: ActionButton[]
  backgroundImage?: string
  variant?: "default" | "minimal" | "gradient"
}

interface ActionButton {
  text: string
  href: string
  variant: "primary" | "secondary" | "outline"
  external?: boolean
}
```

#### Features

- Kinetic typography animation
- Responsive background handling
- Call-to-action button integration
- SEO optimization
- Performance-optimized animations

#### Accessibility Features

- Proper heading hierarchy (h1)
- Descriptive text for screen readers
- Keyboard-accessible actions
- High contrast support
- Reduced motion compliance

### Project Showcase (`src/components/sections/project-showcase.tsx`)

Gallery component for displaying projects with filtering and search
capabilities.

#### Interface

```typescript
interface ProjectShowcaseProps {
  projects: ProjectData[]
  showFilters?: boolean
  showSearch?: boolean
  columns?: 2 | 3 | 4
  pagination?: boolean
  itemsPerPage?: number
}
```

#### Features

- Advanced filtering system
- Real-time search
- Responsive grid layout
- Pagination support
- Loading states

#### Performance Optimizations

- Virtual scrolling for large lists
- Debounced search input
- Lazy loading of project cards
- Optimized re-rendering

## Navigation Components

### Main Navigation (`src/components/navigation/main-nav.tsx`)

Primary navigation component with responsive design and accessibility features.

#### Interface

```typescript
interface MainNavProps {
  items: NavigationItem[]
  currentPath: string
  variant?: "horizontal" | "vertical"
  showMobileMenu?: boolean
}

interface NavigationItem {
  label: string
  href: string
  external?: boolean
  icon?: React.ReactNode
  children?: NavigationItem[]
}
```

#### Features

- Responsive hamburger menu
- Keyboard navigation with arrow keys
- Focus trap for mobile menu
- ARIA navigation attributes
- Active state management

#### Accessibility Features

- WCAG 2.1 AAA compliant
- Screen reader navigation
- Keyboard-only operation
- Focus management
- Skip navigation links

### Navigation Loader (`src/components/navigation/navigation-loader.tsx`)

Loading indicator for navigation state changes with accessibility support.

#### Interface

```typescript
interface NavigationLoaderProps {
  isLoading: boolean
  variant?: "bar" | "spinner" | "skeleton"
  label?: string
}
```

#### Features

- Multiple loading variants
- ARIA live region updates
- Screen reader announcements
- Smooth transitions
- Reduced motion support

## Animation Components

### Interactive 3D (`src/components/animations/interactive-3d.tsx`)

3D interaction component with WebGL optimization and accessibility
considerations.

#### Interface

```typescript
interface Interactive3DProps {
  model?: string
  animation?: string
  controls?: boolean
  autoRotate?: boolean
  performanceMode?: "high" | "medium" | "low"
}
```

#### Features

- WebGL-based 3D rendering
- Touch and mouse interaction
- Performance optimization
- Accessibility alternatives
- Reduced motion compliance

#### Performance Considerations

- Adaptive quality based on device capabilities
- Frame rate optimization
- Memory management
- Progressive enhancement

### Kinetic Typography (`src/components/animations/kinetic-typography.tsx`)

Advanced text animation component with performance optimization.

#### Interface

```typescript
interface KineticTypographyProps {
  text: string
  animation?: "typewriter" | "fade" | "slide" | "wave"
  speed?: number
  delay?: number
  loop?: boolean
}
```

#### Features

- Multiple animation types
- Performance-optimized rendering
- Accessibility considerations
- Customizable timing
- Reduced motion support

## Pattern Components

### Cursor Animation (`src/components/common/cursor-animation.tsx`)

Custom cursor effects with accessibility and performance optimization.

#### Interface

```typescript
interface CursorAnimationProps {
  variant?: "default" | "magnetic" | "trail" | "glow"
  interactive?: boolean
  disabled?: boolean
}
```

#### Features

- Custom cursor effects
- Magnetic interaction
- Trail animations
- Glow effects
- Performance optimization

#### Accessibility Considerations

- Respects user preferences
- Disabled on touch devices
- Reduced motion compliance
- High contrast support

## Client-Side Components

### Blog Post Client (`src/app/(work)/blog/[slug]/blog-post-client.tsx`)

Client-side component for blog post interactivity with performance optimization.

#### Interface

```typescript
interface BlogPostClientProps {
  post: BlogPostData
  content: string
  relatedPosts?: BlogPostData[]
}
```

#### Features

- Table of contents generation
- Reading progress tracking
- Social sharing
- Comment system integration
- Print optimization

#### Performance Features

- Code splitting
- Lazy loading
- Optimized re-renders
- Memory leak prevention

### Project Detail Client (`src/components/ui/project-detail-client.tsx`)

Client-side component for project detail interactivity.

#### Interface

```typescript
interface ProjectDetailClientProps {
  project: ProjectData
  screenshots?: ImageData[]
  testimonials?: TestimonialData[]
}
```

#### Features

- Image gallery
- Testimonial carousel
- Technology details
- Live demo integration
- Contact form

## Component Testing

### Testing Standards

- Unit tests with React Testing Library
- Accessibility tests with jest-axe
- Visual regression tests
- Performance tests
- Integration tests

### Example Test Structure

```typescript
describe('EnhancedCard', () => {
  it('renders with proper accessibility attributes', () => {
    render(<EnhancedCard ariaLabel="Test card">Content</EnhancedCard>)
    expect(screen.getByLabelText('Test card')).toBeInTheDocument()
  })

  it('meets WCAG accessibility requirements', async () => {
    const { container } = render(<EnhancedCard>Content</EnhancedCard>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## Performance Guidelines

### Component Optimization

- Use React.memo for pure components
- Implement proper dependency arrays
- Optimize re-render cycles
- Lazy load heavy components
- Use Suspense boundaries

### Bundle Size Management

- Tree-shakeable imports
- Dynamic imports for route components
- Third-party library optimization
- Dead code elimination

### Accessibility Requirements

- WCAG 2.1 AAA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences

## Styling Standards

### CSS Architecture

- Tailwind CSS utility classes
- CSS custom properties
- Component-scoped styles
- Responsive design patterns

### Design Tokens

```css
:root {
  --color-primary: #0070f3;
  --color-secondary: #7c3aed;
  --spacing-unit: 0.25rem;
  --border-radius: 0.5rem;
  --animation-duration: 200ms;
}
```

### Responsive Design

- Mobile-first approach
- Flexible grid systems
- Adaptive images
- Progressive enhancement

## Component Lifecycle

### Development Process

1. Define TypeScript interfaces
2. Create component structure
3. Implement accessibility features
4. Add performance optimizations
5. Write comprehensive tests
6. Document API and usage

### Quality Assurance

- ESLint and Prettier compliance
- TypeScript strict mode
- Accessibility auditing
- Performance testing
- Visual testing

### Maintenance

- Regular dependency updates
- Performance monitoring
- Accessibility regression testing
- User feedback integration
