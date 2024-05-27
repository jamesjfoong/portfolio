'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import { useHashState } from '../../../../hooks/useHash'

export function NavItem({ name, href }: { name: string; href: string }) {
  const [hash, setHash] = useHashState()

  useEffect(() => {
    const handleScroll = () => {
      // update hash if the component is in view
      // if (window.scrollY >= window.innerHeight) {
      //   setHash(name.toLowerCase())
      // }
    }

    // Add the scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll)

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <li>
      <Link
        href={href}
        className="group flex items-center py-3 active"
        scroll={true}
      >
        {hash === name.toLowerCase() ? (
          <>
            <span className="nav-indicator mr-4 h-px w-16 bg-slate-200"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-200">
              {name}
            </span>
          </>
        ) : (
          <>
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
              {name}
            </span>
          </>
        )}
      </Link>
    </li>
  )
}
