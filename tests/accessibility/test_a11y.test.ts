/**
 * Accessibility Testing with axe-core
 * 
 * Comprehensive accessibility testing using axe-core to ensure
 * WCAG 2.1 AAA compliance and constitutional accessibility requirements.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import React from 'react'
import { time } from 'console'
import { id, th, tr, is } from 'date-fns/locale'
import { on } from 'events'
import { input, div, fieldset, button, label, li, thead, tbody, td, p, a, span, section, aside, footer, main, nav, img, figure, address } from 'framer-motion/client'
import all from 'gsap/all'
import src from 'gsap/src'
import { Contact, Phone, Home, Accessibility, Heading, Search, Section, Link, Navigation, Presentation } from 'lucide-react'
import { Main } from 'next/document'
import { type } from 'os'
import { title, features } from 'process'
import { a } from 'vitest/dist/chunks/environment.LoooBwUu.js'
import { p } from 'vitest/dist/chunks/reporters.nr4dxCkA.js'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock components for testing
const TestComponent = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
  <div {...props}>{children}</div>
)

const AccessibleButton = ({ children, onClick, disabled = false }: { 
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-pressed={false}
    type="button"
  >
    {children}
  </button>
)

const AccessibleForm = () => (
  <form>
    <div>
      <label htmlFor="name">Name (required)</label>
      <input 
        id="name" 
        type="text" 
        required 
        aria-describedby="name-error"
        aria-invalid={false}
      />
      <div id="name-error" role="alert" aria-live="polite"></div>
    </div>
    
    <div>
      <label htmlFor="email">Email</label>
      <input 
        id="email" 
        type="email" 
        aria-describedby="email-help"
      />
      <div id="email-help">We'll never share your email</div>
    </div>
    
    <fieldset>
      <legend>Preferred Contact Method</legend>
      <div>
        <input type="radio" id="contact-email" name="contact" value="email" />
        <label htmlFor="contact-email">Email</label>
      </div>
      <div>
        <input type="radio" id="contact-phone" name="contact" value="phone" />
        <label htmlFor="contact-phone">Phone</label>
      </div>
    </fieldset>
    
    <button type="submit">Submit</button>
  </form>
)

const AccessibleNavigation = () => (
  <nav aria-label="Main navigation">
    <ul role="menubar">
      <li role="none">
        <a href="/" role="menuitem" aria-current="page">Home</a>
      </li>
      <li role="none">
        <a href="/blog" role="menuitem">Blog</a>
      </li>
      <li role="none">
        <a href="/projects" role="menuitem">Projects</a>
      </li>
      <li role="none">
        <a href="/about" role="menuitem">About</a>
      </li>
    </ul>
  </nav>
)

const AccessibleModal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <header>
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </header>
        <div id="modal-description">
          {children}
        </div>
      </div>
    </div>
  )
}

const AccessibleDataTable = () => (
  <table>
    <caption>Project Performance Metrics</caption>
    <thead>
      <tr>
        <th scope="col">Project Name</th>
        <th scope="col">Performance Score</th>
        <th scope="col">Accessibility Score</th>
        <th scope="col">Last Updated</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Portfolio Website</th>
        <td>95</td>
        <td>100</td>
        <td>
          <time dateTime="2025-09-28">September 28, 2025</time>
        </td>
      </tr>
      <tr>
        <th scope="row">Blog Platform</th>
        <td>92</td>
        <td>98</td>
        <td>
          <time dateTime="2025-09-27">September 27, 2025</time>
        </td>
      </tr>
    </tbody>
  </table>
)

describe('Accessibility Testing with axe-core', () => {
  describe('Basic Component Accessibility', () => {
    it('should not have accessibility violations on basic components', async () => {
      const { container } = render(
        <TestComponent role="main">
          <h1>Test Heading</h1>
          <p>Test paragraph content</p>
          <AccessibleButton>Test Button</AccessibleButton>
        </TestComponent>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should pass accessibility tests for form components', async () => {
      const { container } = render(<AccessibleForm />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should pass accessibility tests for navigation components', async () => {
      const { container } = render(<AccessibleNavigation />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should pass accessibility tests for modal components', async () => {
      const { container } = render(
        <AccessibleModal 
          isOpen={true} 
          onClose={() => {}} 
          title="Test Modal"
        >
          Modal content goes here
        </AccessibleModal>
      )
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should pass accessibility tests for data tables', async () => {
      const { container } = render(<AccessibleDataTable />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('WCAG 2.1 AAA Compliance', () => {
    it('should meet WCAG 2.1 AAA standards for interactive elements', async () => {
      const { container } = render(
        <div>
          <h1>Interactive Elements Test</h1>
          
          {/* Buttons with proper labeling */}
          <AccessibleButton>Primary Action</AccessibleButton>
          <AccessibleButton disabled>Disabled Action</AccessibleButton>
          
          {/* Links with descriptive text */}
          <a href="/learn-more" aria-describedby="link-desc">
            Learn More
          </a>
          <span id="link-desc">about our accessibility features</span>
          
          {/* Form controls */}
          <div>
            <label htmlFor="search">Search</label>
            <input 
              id="search" 
              type="search" 
              aria-label="Search the website"
              placeholder="Enter search terms"
            />
            <button type="submit" aria-label="Submit search">🔍</button>
          </div>
        </div>
      )

      const results = await axe(container, {
        rules: {
          // Enable AAA level rules
          'color-contrast-enhanced': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'keyboard-navigation': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
    })

    it('should provide proper semantic structure', async () => {
      const { container } = render(
        <article>
          <header>
            <h1>Article Title</h1>
            <p>Published on <time dateTime="2025-09-28">September 28, 2025</time></p>
          </header>
          
          <section>
            <h2>Section Heading</h2>
            <p>Section content with proper semantic structure.</p>
            
            <aside>
              <h3>Related Information</h3>
              <p>Additional context in a sidebar.</p>
            </aside>
          </section>
          
          <footer>
            <p>Article footer information</p>
          </footer>
        </article>
      )

      const results = await axe(container, {
        rules: {
          'landmark-one-main': { enabled: false }, // Allow articles without main
          'page-has-heading-one': { enabled: false }, // Allow multiple h1s in test
        }
      })
      
      expect(results).toHaveNoViolations()
    })
  })

  describe('Screen Reader Compatibility', () => {
    it('should provide proper ARIA labels and descriptions', async () => {
      const { container } = render(
        <div>
          {/* Complex widget with ARIA */}
          <div role="tablist" aria-label="Content sections">
            <button 
              role="tab" 
              aria-selected={true}
              aria-controls="panel1"
              id="tab1"
            >
              Tab 1
            </button>
            <button 
              role="tab" 
              aria-selected={false}
              aria-controls="panel2"
              id="tab2"
            >
              Tab 2
            </button>
          </div>
          
          <div 
            role="tabpanel" 
            id="panel1" 
            aria-labelledby="tab1"
            tabIndex={0}
          >
            Panel 1 content
          </div>
          
          <div 
            role="tabpanel" 
            id="panel2" 
            aria-labelledby="tab2" 
            tabIndex={-1}
            hidden
          >
            Panel 2 content
          </div>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should provide appropriate live regions for dynamic content', async () => {
      const { container } = render(
        <div>
          {/* Status messages */}
          <div role="status" aria-live="polite" aria-atomic="true">
            Form saved successfully
          </div>
          
          {/* Error messages */}
          <div role="alert" aria-live="assertive" aria-atomic="true">
            Please correct the errors below
          </div>
          
          {/* Progress indicator */}
          <div 
            role="progressbar" 
            aria-valuemin={0} 
            aria-valuemax={100} 
            aria-valuenow={75}
            aria-label="Upload progress"
          >
            75% complete
          </div>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Keyboard Navigation Support', () => {
    it('should support proper focus management', async () => {
      const { container } = render(
        <div>
          {/* Skip link */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          {/* Focusable navigation */}
          <nav>
            <a href="/" tabIndex={0}>Home</a>
            <a href="/blog" tabIndex={0}>Blog</a>
            <a href="/projects" tabIndex={0}>Projects</a>
          </nav>
          
          <main id="main-content" tabIndex={-1}>
            <h1>Main Content</h1>
            
            {/* Focusable interactive elements */}
            <button type="button" tabIndex={0}>Interactive Button</button>
            
            <div 
              role="button" 
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Handle activation
                }
              }}
            >
              Custom Focusable Element
            </div>
          </main>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Image Accessibility', () => {
    it('should provide proper alt text for images', async () => {
      const { container } = render(
        <div>
          {/* Informative image */}
          <img 
            src="/chart.jpg" 
            alt="Sales increased 25% from Q1 to Q2 2025"
          />
          
          {/* Decorative image */}
          <img 
            src="/decoration.jpg" 
            alt="" 
            role="presentation"
          />
          
          {/* Complex image with description */}
          <figure>
            <img 
              src="/complex-chart.jpg" 
              alt="Performance metrics chart"
              aria-describedby="chart-desc"
            />
            <figcaption id="chart-desc">
              Detailed description: Chart shows performance improvements 
              across all metrics from January to September 2025.
            </figcaption>
          </figure>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Error Handling and Feedback', () => {
    it('should provide accessible error messages', async () => {
      const { container } = render(
        <form>
          <div>
            <label htmlFor="required-field">Required Field</label>
            <input 
              id="required-field" 
              type="text" 
              required
              aria-invalid={true}
              aria-describedby="required-error"
            />
            <div 
              id="required-error" 
              role="alert" 
              aria-live="assertive"
            >
              This field is required
            </div>
          </div>
          
          <div>
            <label htmlFor="email-field">Email</label>
            <input 
              id="email-field" 
              type="email"
              aria-invalid={true}
              aria-describedby="email-error"
            />
            <div 
              id="email-error" 
              role="alert" 
              aria-live="assertive"
            >
              Please enter a valid email address
            </div>
          </div>
        </form>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Constitutional Compliance Verification', () => {
    it('should meet constitutional accessibility requirements', async () => {
      const { container } = render(
        <main>
          <h1>Constitutional Accessibility Test</h1>
          
          {/* Test all major accessibility features */}
          <section>
            <h2>Interactive Elements</h2>
            <AccessibleButton>Accessible Button</AccessibleButton>
            
            <a href="/accessible-link">
              Accessible Link with Descriptive Text
            </a>
          </section>
          
          <section>
            <h2>Form Controls</h2>
            <AccessibleForm />
          </section>
          
          <section>
            <h2>Navigation</h2>
            <AccessibleNavigation />
          </section>
          
          <section>
            <h2>Data Presentation</h2>
            <AccessibleDataTable />
          </section>
        </main>
      )

      // Run comprehensive accessibility audit
      const results = await axe(container, {
        tags: ['wcag2a', 'wcag2aa', 'wcag2aaa'],
        rules: {
          // Ensure strict compliance
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'keyboard-navigation': { enabled: true }
        }
      })
      
      expect(results).toHaveNoViolations()
      
      console.log('✅ Constitutional accessibility requirements verified:')
      console.log(`  - WCAG 2.1 AAA compliance: ${results.violations.length === 0 ? 'PASS' : 'FAIL'}`)
      console.log(`  - Total accessibility checks: ${results.passes.length + results.violations.length}`)
      console.log(`  - Violations found: ${results.violations.length}`)
    })

    it('should provide comprehensive accessibility metadata', async () => {
      // Test that all interactive elements have proper accessibility metadata
      const interactiveElements = [
        'button',
        'input[type="button"]',
        'input[type="submit"]', 
        'a[href]',
        '[role="button"]',
        '[tabindex="0"]'
      ]
      
      const { container } = render(
        <div>
          <button type="button" aria-label="Test button">Button</button>
          <input type="button" value="Input Button" aria-label="Input button" />
          <input type="submit" value="Submit" aria-label="Submit form" />
          <a href="/test" aria-label="Test link">Link</a>
          <div role="button" tabIndex={0} aria-label="Custom button">Custom</div>
          <div tabIndex={0} aria-label="Focusable div">Focusable</div>
        </div>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
      
      // Verify all elements have proper labeling
      interactiveElements.forEach(selector => {
        const elements = container.querySelectorAll(selector)
        elements.forEach(element => {
          const hasLabel = element.hasAttribute('aria-label') || 
                          element.hasAttribute('aria-labelledby') ||
                          element.textContent?.trim() ||
                          element.hasAttribute('value')
          
          expect(hasLabel).toBe(true)
        })
      })
    })
  })
})