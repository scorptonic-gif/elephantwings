'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Silo } from '@/lib/routes'

interface HeaderProps {
  activeSilo?: Silo
}

const NAV_LINKS = [
  { label: 'The Parlor', href: '/parlor-kc/', silo: 'restaurant' as Silo },
  { label: 'Chef-On-Demand', href: '/services/chef-on-demand/', silo: 'chef-on-demand' as Silo },
  { label: 'Catering', href: '/services/catering/', silo: 'catering' as Silo },
  { label: 'Journal', href: '/journal/', silo: 'journal' as Silo },
  { label: 'About', href: '/about/', silo: undefined as unknown as Silo },
]

export default function Header({ activeSilo }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-cream-dark shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <Image
            src="/logo.png"
            alt="Elephant Wings KC"
            width={140}
            height={75}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors duration-150 hover:text-orange ${
                activeSilo === link.silo
                  ? 'text-orange border-b-2 border-orange pb-0.5'
                  : 'text-charcoal-light'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/order-online/" className="btn-primary py-2 px-5 text-xs">
            Order Online
          </Link>
          <Link href="/services/chef-on-demand/" className="btn-outline py-2 px-5 text-xs">
            Book Chef Ameet
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-charcoal p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-cream transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <>
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav
          className="md:hidden bg-white border-t border-cream-dark px-4 pb-5"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col divide-y divide-cream-dark">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3.5 text-sm font-semibold transition-colors hover:text-orange ${
                  activeSilo === link.silo ? 'text-orange' : 'text-charcoal'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 mt-5">
            <Link href="/order-online/" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
              Order Online
            </Link>
            <Link href="/services/chef-on-demand/" onClick={() => setMenuOpen(false)} className="btn-outline w-full justify-center">
              Book Chef Ameet
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
