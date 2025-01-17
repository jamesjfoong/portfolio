'use client'

import Link from 'next/link'

export default function NavItem({
  name,
  href,
}: {
  name: string
  href: string
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center py-3 active"
        scroll={true}
      >
        {/* {hash === name ? (
          <>
            <span className="nav-indicator mr-4 h-px w-16 bg-slate-200"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-200">
              {name}
            </span>
          </>
        ) : ( */}
        <>
          <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-200 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
          <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 group-focus-visible:text-slate-200">
            {name}
          </span>
        </>
        {/* )} */}
      </Link>
    </li>
  )
}
