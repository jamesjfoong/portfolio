'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Projects', href: '/projects' },
  { name: 'Lab', href: '/lab' },
  { name: 'About', href: '/about' },
]

export default function MainNav(): React.ReactElement {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false)
      } else {
        // Scrolling up or at the top
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => window.removeEventListener('scroll', controlNavbar)
  }, [lastScrollY])

  return (
    <>
      {/* Desktop Navigation */}
      <motion.header
        className="hidden md:fixed md:top-4 md:left-1/2 md:transform md:-translate-x-1/2 md:z-50 md:block"
        initial={{ y: 0, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <nav className="bg-background/80 backdrop-blur-xl border border-border/30 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300 ease-out">
          <div className="flex items-center gap-6">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out rounded-xl hover:bg-primary/10 hover:scale-105',
                  pathname === item.href
                    ? 'text-primary bg-primary/15 shadow-sm'
                    : 'text-foreground/70 hover:text-foreground'
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/20 rounded-xl border border-primary/30"
                    initial={false}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            JF
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M3 5H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 19H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/50 z-40"
        >
          <nav className="px-4 py-4 space-y-2">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150',
                  pathname === item.href
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  )
}
