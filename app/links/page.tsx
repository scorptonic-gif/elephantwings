import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SiteLayout from '@/components/SiteLayout'
import { generatePageMeta } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/config'

export const metadata: Metadata = generatePageMeta('/links/')

const LINKS = [
  { label: 'Order Online', description: 'Best price — order direct via Toast', href: '/order-online/', icon: '🛒', style: 'btn-primary' },
  { label: 'Book Chef-On-Demand', description: 'Private Indian Fusion dining in your home', href: '/services/chef-on-demand/', icon: '👨‍🍳', style: 'btn-outline' },
  { label: 'Event Catering Inquiry', description: 'Weddings, corporate events, private parties', href: '/services/catering/', icon: '🎉', style: 'btn-outline' },
  { label: 'See Our Menu', description: 'Full menu at Parlor KC · 1707 Locust St', href: '/parlor-kc/', icon: '🍽️', style: 'btn-ghost' },
  { label: 'Read the Journal', description: 'Stories from the Elephant Wings kitchen', href: '/journal/', icon: '📖', style: 'btn-ghost' },
]

export default function LinksPage() {
  return (
    <SiteLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">

        <div className="text-center mb-10">
          <Image
            src="/logo.png"
            alt="Elephant Wings KC"
            width={180}
            height={97}
            className="h-14 w-auto mx-auto mb-5"
            priority
          />
          <p className="text-stone-400 text-sm">
            Indian Fusion · Inside{' '}
            <a href={SITE_CONFIG.parlor.url} target="_blank" rel="noopener noreferrer"
              className="text-orange hover:underline">Parlor KC
            </a>{' '}
            · Kansas City, MO
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className="card p-5 flex items-center gap-4 hover:border-orange border-2 border-transparent transition-all group">
              <span className="text-2xl shrink-0">{link.icon}</span>
              <div>
                <p className="font-semibold text-stone-900 text-sm group-hover:text-orange transition-colors">{link.label}</p>
                <p className="text-stone-400 text-xs mt-0.5">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-stone-300 text-xs mt-10">
          <a href={SITE_CONFIG.domain} className="hover:text-orange transition-colors">elephantwingskc.com</a>
        </p>
      </div>
    </SiteLayout>
  )
}
