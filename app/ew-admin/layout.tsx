import Link from 'next/link'
import { logoutAction } from './login/actions'
import DeployButton from './components/DeployButton'

const navLinks = [
  { href: '/ew-admin', label: '🏠 Dashboard' },
  { href: '/ew-admin/builder', label: '🎨 Page Builder' },
  { href: '/ew-admin/site-info', label: '🏪 Site Info' },
  { href: '/ew-admin/homepage', label: '📣 Homepage' },
  { href: '/ew-admin/menu', label: '🍽️ Menu' },
  { href: '/ew-admin/testimonials', label: '⭐ Testimonials' },
  { href: '/ew-admin/about', label: '👨‍🍳 About' },
  { href: '/ew-admin/journal', label: '📖 Journal' },
  { href: '/ew-admin/services', label: '🎪 Services' },
  { href: '/ew-admin/media', label: '🖼️ Media' },
  { href: '/ew-admin/inquiries', label: '📬 Inquiries' },
  { href: '/ew-admin/analytics', label: '📊 Analytics' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm tracking-wide">🐘 EW Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <DeployButton />
          <div className="w-px h-4 bg-gray-700" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-xs transition-colors"
          >
            View Site →
          </a>
          <form action={logoutAction}>
            <button type="submit" className="text-gray-400 hover:text-red-400 text-xs transition-colors">
              Log Out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — hidden on mobile, visible md+ */}
        <nav className="hidden md:flex flex-col w-52 bg-gray-900 border-r border-gray-800 py-4 shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav — horizontal scroll strip */}
        <div className="md:hidden w-full bg-gray-900 border-b border-gray-800 overflow-x-auto flex gap-1 px-3 py-2 sticky top-[49px] z-40">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-800 rounded-lg whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}
