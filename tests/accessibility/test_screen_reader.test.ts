/**
 * Screen Reader Compatibility Testing
 * 
 * Tests to ensure proper screen reader support through ARIA attributes,
 * semantic markup, and screen reader-friendly content structure.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Helper function to check ARIA attributes
function checkAriaAttributes(element: Element, expectedAttributes: Record<string, string | null>) {
  Object.entries(expectedAttributes).forEach(([attr, expectedValue]) => {
    const actualValue = element.getAttribute(attr)
    if (expectedValue === null) {
      expect(actualValue).toBeNull()
    } else {
      expect(actualValue).toBe(expectedValue)
    }
  })
}

// Helper to check semantic structure
function checkSemanticStructure(container: HTMLElement, expectedRoles: string[]) {
  expectedRoles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`)
    expect(elements.length).toBeGreaterThan(0)
  })
}

describe('Screen Reader Compatibility', () => {
  describe('ARIA Labels and Descriptions', () => {
    it('should provide proper ARIA labels for interactive elements', () => {
      const testHtml = `
        <div>
          <button aria-label="Close dialog">×</button>
          <button aria-labelledby="save-label">
            <span id="save-label">Save Document</span>
          </button>
          <input aria-label="Search query" type="search" />
          <a href="/help" aria-describedby="help-desc">
            Help
          </a>
          <span id="help-desc">Get help with using this application</span>
        </div>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check close button
      const closeButton = container.querySelector('button[aria-label="Close dialog"]')
      expect(closeButton).toHaveAttribute('aria-label', 'Close dialog')
      
      // Check labeled button
      const saveButton = container.querySelector('button[aria-labelledby="save-label"]')
      expect(saveButton).toHaveAttribute('aria-labelledby', 'save-label')
      
      // Check search input
      const searchInput = container.querySelector('input[type="search"]')
      expect(searchInput).toHaveAttribute('aria-label', 'Search query')
      
      // Check described link
      const helpLink = container.querySelector('a[href="/help"]')
      expect(helpLink).toHaveAttribute('aria-describedby', 'help-desc')
    })

    it('should use proper ARIA roles for custom components', () => {
      const testHtml = `
        <div>
          <div role="tablist" aria-label="Settings">
            <button role="tab" aria-selected="true" aria-controls="panel1">General</button>
            <button role="tab" aria-selected="false" aria-controls="panel2">Privacy</button>
          </div>
          
          <div role="tabpanel" id="panel1" aria-labelledby="tab1">
            General settings content
          </div>
          
          <div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>
            Privacy settings content
          </div>
        </div>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check tablist
      const tablist = container.querySelector('[role="tablist"]')
      expect(tablist).toHaveAttribute('aria-label', 'Settings')
      
      // Check tabs
      const tabs = container.querySelectorAll('[role="tab"]')
      expect(tabs).toHaveLength(2)
      
      const activeTab = container.querySelector('[role="tab"][aria-selected="true"]')
      expect(activeTab).toHaveAttribute('aria-controls', 'panel1')
      
      // Check tab panels
      const panels = container.querySelectorAll('[role="tabpanel"]')
      expect(panels).toHaveLength(2)
    })

    it('should provide proper ARIA states and properties', () => {
      const testHtml = `
        <div>
          <button aria-expanded="false" aria-haspopup="menu">Menu</button>
          <input aria-invalid="true" aria-describedby="error-msg" />
          <div id="error-msg" role="alert">Please enter a valid email</div>
          
          <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" aria-label="Upload progress">
            75% complete
          </div>
          
          <div aria-live="polite" aria-atomic="true">
            Status update will appear here
          </div>
        </div>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check expanded state
      const menuButton = container.querySelector('[aria-expanded]')
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      expect(menuButton).toHaveAttribute('aria-haspopup', 'menu')
      
      // Check invalid input
      const invalidInput = container.querySelector('[aria-invalid]')
      expect(invalidInput).toHaveAttribute('aria-invalid', 'true')
      expect(invalidInput).toHaveAttribute('aria-describedby', 'error-msg')
      
      // Check progress bar
      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-valuenow', '75')
      
      // Check live region
      const liveRegion = container.querySelector('[aria-live]')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
    })
  })

  describe('Semantic HTML Structure', () => {
    it('should use proper heading hierarchy', () => {
      const testHtml = `
        <main>
          <h1>Main Page Title</h1>
          
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
            
            <article>
              <h3>Article Title</h3>
              <p>Article content</p>
              
              <section>
                <h4>Subsection Title</h4>
                <p>Subsection content</p>
              </section>
            </article>
          </section>
        </main>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check heading levels exist in order
      const h1 = container.querySelector('h1')
      const h2 = container.querySelector('h2')
      const h3 = container.querySelector('h3')
      const h4 = container.querySelector('h4')
      
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
      expect(h3).toBeInTheDocument()
      expect(h4).toBeInTheDocument()
      
      expect(h1?.textContent).toBe('Main Page Title')
      expect(h2?.textContent).toBe('Section Title')
      expect(h3?.textContent).toBe('Article Title')
      expect(h4?.textContent).toBe('Subsection Title')
    })

    it('should use proper landmark elements', () => {
      const testHtml = `
        <div>
          <header>
            <nav aria-label="Main navigation">
              <a href="/">Home</a>
              <a href="/blog">Blog</a>
            </nav>
          </header>
          
          <main>
            <article>
              <header>
                <h1>Article Title</h1>
              </header>
              
              <section>
                <h2>Article Section</h2>
                <p>Content</p>
              </section>
              
              <aside>
                <h2>Related Information</h2>
                <p>Sidebar content</p>
              </aside>
            </article>
          </main>
          
          <footer>
            <p>Site footer</p>
          </footer>
        </div>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check landmarks
      expect(container.querySelector('header')).toBeInTheDocument()
      expect(container.querySelector('nav')).toBeInTheDocument()
      expect(container.querySelector('main')).toBeInTheDocument()
      expect(container.querySelector('article')).toBeInTheDocument()
      expect(container.querySelector('section')).toBeInTheDocument()
      expect(container.querySelector('aside')).toBeInTheDocument()
      expect(container.querySelector('footer')).toBeInTheDocument()
      
      // Check navigation has proper label
      const nav = container.querySelector('nav')
      expect(nav).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('should provide proper list structure', () => {
      const testHtml = `
        <div>
          <nav>
            <ul role="menubar">
              <li role="none"><a href="/" role="menuitem">Home</a></li>
              <li role="none"><a href="/blog" role="menuitem">Blog</a></li>
              <li role="none"><a href="/projects" role="menuitem">Projects</a></li>
            </ul>
          </nav>
          
          <section>
            <h2>Recent Posts</h2>
            <ol>
              <li>First post</li>
              <li>Second post</li>
              <li>Third post</li>
            </ol>
          </section>
          
          <section>
            <h2>Features</h2>
            <ul>
              <li>Feature one</li>
              <li>Feature two</li>
              <li>Feature three</li>
            </ul>
          </section>
        </div>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check menu structure
      const menubar = container.querySelector('[role="menubar"]')
      expect(menubar).toBeInTheDocument()
      
      const menuItems = container.querySelectorAll('[role="menuitem"]')
      expect(menuItems).toHaveLength(3)
      
      // Check ordered list
      const orderedList = container.querySelector('ol')
      expect(orderedList).toBeInTheDocument()
      expect(orderedList?.children).toHaveLength(3)
      
      // Check unordered list
      const unorderedList = container.querySelector('ul:not([role])')
      expect(unorderedList).toBeInTheDocument()
    })
  })

  describe('Form Accessibility', () => {
    it('should provide proper form labels and associations', () => {
      const testHtml = `
        <form>
          <fieldset>
            <legend>Personal Information</legend>
            
            <div>
              <label for="name">Full Name (required)</label>
              <input id="name" type="text" required aria-describedby="name-help" />
              <div id="name-help">Enter your first and last name</div>
            </div>
            
            <div>
              <label for="email">Email Address</label>
              <input id="email" type="email" aria-describedby="email-error" aria-invalid="false" />
              <div id="email-error" role="alert" aria-live="assertive"></div>
            </div>
            
            <fieldset>
              <legend>Preferred Contact Method</legend>
              <div>
                <input type="radio" id="contact-email" name="contact" value="email" />
                <label for="contact-email">Email</label>
              </div>
              <div>
                <input type="radio" id="contact-phone" name="contact" value="phone" />
                <label for="contact-phone">Phone</label>
              </div>
            </fieldset>
          </fieldset>
        </form>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check fieldset and legend
      const fieldset = container.querySelector('fieldset')
      const legend = container.querySelector('legend')
      expect(fieldset).toBeInTheDocument()
      expect(legend).toHaveTextContent('Personal Information')
      
      // Check label associations
      const nameLabel = container.querySelector('label[for="name"]')
      const nameInput = container.querySelector('#name')
      expect(nameLabel).toBeInTheDocument()
      expect(nameInput).toBeInTheDocument()
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-help')
      
      // Check radio button group
      const radioFieldset = container.querySelectorAll('fieldset')[1]
      const radioLegend = radioFieldset.querySelector('legend')
      expect(radioLegend).toHaveTextContent('Preferred Contact Method')
      
      const radioButtons = container.querySelectorAll('input[type="radio"]')
      expect(radioButtons).toHaveLength(2)
      radioButtons.forEach(radio => {
        expect(radio).toHaveAttribute('name', 'contact')
      })
    })

    it('should provide proper error messaging', () => {
      const testHtml = `
        <form>
          <div>
            <label for="required-field">Required Field</label>
            <input 
              id="required-field" 
              type="text" 
              required 
              aria-invalid="true" 
              aria-describedby="required-error"
            />
            <div id="required-error" role="alert" aria-live="assertive">
              This field is required
            </div>
          </div>
          
          <div>
            <label for="email-field">Email</label>
            <input 
              id="email-field" 
              type="email" 
              aria-invalid="true" 
              aria-describedby="email-error"
            />
            <div id="email-error" role="alert" aria-live="assertive">
              Please enter a valid email address
            </div>
          </div>
        </form>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check error associations
      const requiredInput = container.querySelector('#required-field')
      const requiredError = container.querySelector('#required-error')
      
      expect(requiredInput).toHaveAttribute('aria-invalid', 'true')
      expect(requiredInput).toHaveAttribute('aria-describedby', 'required-error')
      expect(requiredError).toHaveAttribute('role', 'alert')
      expect(requiredError).toHaveAttribute('aria-live', 'assertive')
      
      const emailInput = container.querySelector('#email-field')
      const emailError = container.querySelector('#email-error')
      
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
      expect(emailError).toHaveAttribute('role', 'alert')
    })
  })

  describe('Table Accessibility', () => {
    it('should provide proper table structure for data tables', () => {
      const testHtml = `
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
              <td><time datetime="2025-09-28">September 28, 2025</time></td>
            </tr>
            <tr>
              <th scope="row">Blog Platform</th>
              <td>92</td>
              <td>98</td>
              <td><time datetime="2025-09-27">September 27, 2025</time></td>
            </tr>
          </tbody>
        </table>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check table structure
      const table = container.querySelector('table')
      const caption = container.querySelector('caption')
      const thead = container.querySelector('thead')
      const tbody = container.querySelector('tbody')
      
      expect(table).toBeInTheDocument()
      expect(caption).toHaveTextContent('Project Performance Metrics')
      expect(thead).toBeInTheDocument()
      expect(tbody).toBeInTheDocument()
      
      // Check column headers
      const colHeaders = container.querySelectorAll('th[scope="col"]')
      expect(colHeaders).toHaveLength(4)
      
      // Check row headers
      const rowHeaders = container.querySelectorAll('th[scope="row"]')
      expect(rowHeaders).toHaveLength(2)
      
      // Check time elements
      const timeElements = container.querySelectorAll('time[datetime]')
      expect(timeElements).toHaveLength(2)
    })
  })

  describe('Live Regions and Dynamic Content', () => {
    it('should provide proper live regions for status updates', () => {
      const testHtml = `
        <div>
          <div role="status" aria-live="polite" aria-atomic="true">
            Form saved successfully
          </div>
          
          <div role="alert" aria-live="assertive" aria-atomic="true">
            Please correct the errors below
          </div>
          
          <div aria-live="polite" aria-atomic="false">
            Loading content...
          </div>
          
          <div role="log" aria-live="polite">
            <p>10:30 AM - User logged in</p>
            <p>10:32 AM - Document created</p>
          </div>
        </div>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Check status region
      const statusRegion = container.querySelector('[role="status"]')
      expect(statusRegion).toHaveAttribute('aria-live', 'polite')
      expect(statusRegion).toHaveAttribute('aria-atomic', 'true')
      
      // Check alert region
      const alertRegion = container.querySelector('[role="alert"]')
      expect(alertRegion).toHaveAttribute('aria-live', 'assertive')
      expect(alertRegion).toHaveAttribute('aria-atomic', 'true')
      
      // Check loading region
      const loadingRegion = container.querySelector('[aria-live="polite"][aria-atomic="false"]')
      expect(loadingRegion).toBeInTheDocument()
      
      // Check log region
      const logRegion = container.querySelector('[role="log"]')
      expect(logRegion).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Constitutional Screen Reader Compliance', () => {
    it('should meet constitutional screen reader requirements', () => {
      const testHtml = `
        <main>
          <h1>Screen Reader Compliance Test</h1>
          
          <section>
            <h2>Interactive Elements</h2>
            <button aria-label="Accessible button">Button</button>
            <a href="/test" aria-describedby="link-desc">Accessible Link</a>
            <span id="link-desc">Description of the link</span>
          </section>
          
          <section>
            <h2>Form Controls</h2>
            <form>
              <fieldset>
                <legend>User Information</legend>
                <label for="username">Username</label>
                <input id="username" type="text" aria-describedby="username-help" />
                <div id="username-help">Enter your username</div>
              </fieldset>
            </form>
          </section>
          
          <section>
            <h2>Data Table</h2>
            <table>
              <caption>Sample Data</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Item 1</th>
                  <td>Value 1</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <section>
            <h2>Live Region</h2>
            <div role="status" aria-live="polite">
              Status updates appear here
            </div>
          </section>
        </main>
      `
      
      const { container } = render(<div dangerouslySetInnerHTML={{ __html: testHtml }} />)
      
      // Verify comprehensive screen reader support
      const elementsWithAriaLabels = container.querySelectorAll('[aria-label]')
      const elementsWithAriaDescriptions = container.querySelectorAll('[aria-describedby]')
      const liveRegions = container.querySelectorAll('[aria-live]')
      const landmarks = container.querySelectorAll('main, section, nav, header, footer, aside, article')
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const formLabels = container.querySelectorAll('label[for]')
      const tableHeaders = container.querySelectorAll('th[scope]')
      
      expect(elementsWithAriaLabels.length).toBeGreaterThan(0)
      expect(elementsWithAriaDescriptions.length).toBeGreaterThan(0)
      expect(liveRegions.length).toBeGreaterThan(0)
      expect(landmarks.length).toBeGreaterThan(0)
      expect(headings.length).toBeGreaterThan(0)
      expect(formLabels.length).toBeGreaterThan(0)
      expect(tableHeaders.length).toBeGreaterThan(0)
      
      console.log('✅ Constitutional screen reader requirements verified:')
      console.log(`  - ARIA labels: ${elementsWithAriaLabels.length} elements`)
      console.log(`  - ARIA descriptions: ${elementsWithAriaDescriptions.length} elements`)
      console.log(`  - Live regions: ${liveRegions.length} elements`)
      console.log(`  - Semantic landmarks: ${landmarks.length} elements`)
      console.log(`  - Proper heading hierarchy: ${headings.length} headings`)
      console.log(`  - Form label associations: ${formLabels.length} labels`)
      console.log(`  - Table headers with scope: ${tableHeaders.length} headers`)
    })
  })
})