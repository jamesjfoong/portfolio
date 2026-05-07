'use client'

import { useState, useEffect, useRef } from 'react'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import Icon from '@/components/common/Icon'

const navItems = [
  { name: 'about', href: '#about' },
  { name: 'experiences', href: '#experiences' },
  { name: 'projects', href: '#projects' },
  { name: 'blogs', href: '#blogs' },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 rounded-md p-2 text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 transition-colors"
        aria-label="Open navigation"
      >
        <Icon icon={faBars} className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        {/* Close button */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-slate-400 hover:text-slate-200 focus-visible:text-teal-300 transition-colors"
            aria-label="Close navigation"
          >
            <Icon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-6 py-4">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={handleLinkClick}
                  className="group flex items-center py-3 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-teal-300 focus-visible:text-teal-300 transition-colors"
                >
                  <span className="mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-12 group-hover:bg-teal-300" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
