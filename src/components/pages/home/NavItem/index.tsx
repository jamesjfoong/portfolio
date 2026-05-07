'use client'

import Link from 'next/link'

export default function NavItem({
  name,
  href,
  className,
}: {
  name: string
  href: string
  className?: string
}) {
  return (
    <li className={className}>
      <Link
        href={href}
        className="group flex items-center py-3 active"
        scroll={true}
      >
        <>
          <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
          <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 group-focus-visible:text-slate-200">
            {name}
          </span>
        </>
      </Link>
    </li>
  )
}
