import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import { generatePageMeta } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/config'

export const metadata: Metadata = generatePageMeta('/order-online/')

const THIRD_PARTY = [
  {
    platform: 'doordash' as const,
    label: 'Order on DoorDash',
    url: SITE_CONFIG.ordering.doordash,
    note: 'Delivery & pickup',
  },
  {
    platform: 'ubereats' as const,
    label: 'Order on Uber Eats',
    url: SITE_CONFIG.ordering.ubereats,
    note: 'Delivery & pickup',
  },
  {
    platform: 'grubhub' as const,
    label: 'Order on GrubHub',
    url: SITE_CONFIG.ordering.grubhub,
    note: 'Delivery & pickup',
  },
]

export default function OrderOnlinePage() {
  const toastUrl = process.env.TOAST_ORDER_URL ?? SITE_CONFIG.ordering.toast

  return (
    <SiteLayout activeSilo="restaurant" pageType="restaurant">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark to-surface py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-sm font-bold uppercase tracking-widest mb-3">
            Indian Food Delivery · Kansas City
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-text mb-4">
            Order Online
          </h1>
          <p className="text-text-muted text-xl mb-4">
            Fresh Indian Fusion delivered straight to your door in KC. Order direct for the best
            price — or find us on your favorite delivery app.
          </p>
        </div>
      </section>

      <div className="section-container max-w-2xl">
        {/* Toast — Primary */}
        <div className="bg-accent rounded-2xl p-8 text-center mb-8">
          <p className="text-primary-dark text-xs font-bold uppercase tracking-widest mb-2">
            Best Price · No Commission Fees
          </p>
          <h2 className="font-display text-3xl font-bold text-primary-dark mb-3">
            Order Direct via Toast
          </h2>
          <p className="text-primary-dark/80 mb-6">
            Ordering directly through Toast means more of your money goes to the food — not
            delivery app fees. Same great menu, best price guaranteed.
          </p>
          <a
            href={toastUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-accent font-bold text-lg px-8 py-4 rounded-xl hover:bg-primary-dark transition-colors inline-block min-h-[44px]"
          >
            Order Direct (Best Price)
          </a>
          {/* Fallback CTA if Toast embed fails */}
          <p className="text-primary-dark/60 text-sm mt-4">
            Having trouble?{' '}
            <a href={toastUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Click here to open Toast directly
            </a>
          </p>
        </div>

        {/* Third-party */}
        <h2 className="font-display text-2xl font-bold text-text mb-4 text-center">
          Also Available On
        </h2>
        <div className="flex flex-col gap-4 mb-12">
          {THIRD_PARTY.map((tp) => (
            <a
              key={tp.platform}
              href={tp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface rounded-xl p-5 flex items-center justify-between hover:border hover:border-accent transition-all group min-h-[44px]"
            >
              <div>
                <p className="font-bold text-text group-hover:text-accent transition-colors">
                  {tp.label}
                </p>
                <p className="text-text-muted text-sm">{tp.note}</p>
              </div>
              <span className="text-accent text-xl">→</span>
            </a>
          ))}
        </div>

        {/* SEO copy */}
        <div className="bg-surface rounded-2xl p-8">
          <h2 className="font-display text-2xl font-bold text-text mb-4">
            Indian Food Delivery in Kansas City
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Craving bold Indian Fusion in Kansas City? Elephant Wings delivers the same
            hand-crafted dishes from our Parlor KC kitchen straight to your door. From our
            signature Tikka Masala Poutine to the Green Shrimp Coconut Curry — every order is
            made fresh.
          </p>
          <p className="text-text-muted leading-relaxed mb-6">
            We deliver across Kansas City, Overland Park, Leawood, and the surrounding metro area.
            Order direct via Toast for the fastest service and best price, or find us on DoorDash,
            Uber Eats, and GrubHub.
          </p>
          <Link href="/parlor-kc/" className="btn-outline text-sm">
            Browse the Full Menu
          </Link>
        </div>
      </div>
    </SiteLayout>
  )
}
