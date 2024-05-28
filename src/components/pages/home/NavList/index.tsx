'use client'

export default function NavList({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      {children}
    </nav>
  )
}
