import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { SITE_NAME, NAV_LINKS } from '@/lib/constants'

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-foreground text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          {SITE_NAME}
        </Link>

        {/* Nav + Actions */}
        <div className="flex items-center gap-1">
          <nav className="mr-2 hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
