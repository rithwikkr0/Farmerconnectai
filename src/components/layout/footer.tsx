import { SITE_NAME } from '@/lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-muted-foreground text-center text-xs">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
