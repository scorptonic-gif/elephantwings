import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import { generatePageMeta } from '@/lib/seo'
import ClickToCall from '@/components/ClickToCall'
import { SITE_CONFIG } from '@/lib/config'
import MailingListForm from '@/components/MailingListForm'
import { getSiteConfig, getTestimonials } from '@/lib/cms'

export const revalidate = 60

export const metadata: Metadata = generatePageMeta('/')

export default async function HomePage() {
  let heroHeadline: string | null = null
  let heroSubtext: string | null = null
  let announcementEnabled = false
  let announcementText = ''
  let testimonialQuote = 'Elephant Wings turned our corporate retreat into a flavor explosion. Professional, punctual, and absolutely delicious.'
  let testimonialAttribution = 'A satisfied KC client'

  try {
    const config = await getSiteConfig()
    heroHeadline = config.hero_headline ?? null
    heroSubtext = config.hero_subtext ?? null
    announcementEnabled = config.announcement_enabled === 'true'
    announcementText = config.announcement_text ?? ''
  } catch {
    // fall back to hardcoded values
  }

  try {
    const testimonials = await getTestimonials()
    if (testimonials.length > 0) {
      testimonialQuote = testimonials[0].quote
      testimonialAttribution = testimonials[0].attribution
    }
  } catch {
    // fall back to hardcoded testimonial
  }

  return (
    <SiteLayout>

      {/* ── ANNOUNCEMENT BANNER ── */}
      {announcementEnabled && announcementText && (
        <div className="bg-orange text-white text-center text-sm font-semibold py-2 px-4">
          {announcementText}
        </div>
      )}

      {/* ── HERO ── full-bleed, bold, asymmetric */}
      <section className="relative overflow-hidden bg-white pt-16 pb-0">
        {/* Background accent shapes */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-orange/5 rounded-bl-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-[10%] w-64 h-64 rounded-full bg-crimson/5 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-end pb-0">
          {/* Left: copy */}
          <div className="pb-20 pt-8">
            <div className="inline-flex items-center gap-2 bg-orange/10 text-orange text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange inline-block" />
              Indian Fusion · Kansas City
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-extrabold text-stone-900 leading-[0.95] tracking-tight">
              {heroHeadline ? (
                heroHeadline
              ) : (
                <>
                  Bold.<br />
                  <span className="text-orange">Spiced.</span><br />
                  <span className="text-crimson">Unforgettable.</span>
                </>
              )}
            </h1>
            <p className="text-stone-500 text-lg mt-8 mb-10 leading-relaxed max-w-sm">
              {heroSubtext ?? "Chef Ameet brings modern Indian Fusion to Kansas City — from our home at Parlor KC to your private table."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/order-online/" className="btn-primary text-base px-8 py-4">
                Order Online Now
              </Link>
              <Link href="/services/chef-on-demand/" className="btn-outline text-base px-8 py-4">
                Book Chef Ameet
              </Link>
            </div>
            <p className="text-stone-400 text-sm mt-6 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <ClickToCall phone={SITE_CONFIG.phone} display={SITE_CONFIG.phoneDisplay} className="text-orange hover:underline font-semibold" />
            </p>
          </div>

          {/* Right: floating info badges */}
          <div className="hidden md:flex flex-col items-center justify-center gap-6 pb-20 pt-8">
            <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-stone-100 self-start ml-8">
              <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest">Now Open</p>
              <p className="text-sm font-bold text-stone-900">Parlor KC · Crossroads</p>
            </div>
            <div className="bg-orange rounded-2xl shadow-lg px-6 py-4 self-end mr-8">
              <p className="text-white text-xs font-semibold uppercase tracking-widest">Chef-On-Demand</p>
              <p className="text-white text-sm font-bold">From $140/person</p>
            </div>
            <div className="bg-stone-900 rounded-2xl shadow-lg px-6 py-4 self-start ml-16">
              <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest">Catering</p>
              <p className="text-white text-sm font-bold">1 – 300+ guests</p>
            </div>
          </div>
        </div>

        {/* Bottom ticker strip */}
        <div className="bg-stone-900 mt-12 py-3 overflow-hidden">
          <div className="flex gap-12 whitespace-nowrap text-stone-400 text-xs font-bold uppercase tracking-widest px-6">
            {['Tikka Masala Poutine', 'Chef-On-Demand Dinners', 'Wedding Catering', 'Corporate Events', 'Bombay-Mi Sandwich', 'Green Shrimp Coconut Curry', 'Chaat Nachos', 'Private Chef Experience'].map((item) => (
              <span key={item} className="flex items-center gap-4">
                {item}
                <span className="text-orange">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE SILOS ── */}
      <section className="bg-white py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="badge-crimson mb-4">Four Ways to Experience Us</span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight mt-3">
                What We Do
              </h2>
            </div>
            <p className="text-stone-400 text-sm max-w-xs md:text-right">
              Every experience is crafted to leave a lasting impression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2 pt-6 items-start">
            {/* Parlor — outer left, lightest */}
            <Link href="/parlor-kc/" className="group card p-8 flex flex-col border-2 border-transparent hover:border-orange transition-all duration-300" style={{background: 'rgba(232,90,26,0.06)'}}>
              <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center mb-6 text-2xl group-hover:bg-orange/20 transition-colors">🍽️</div>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3 group-hover:text-orange transition-colors">The Parlor</h3>
              <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-6">
                Find us inside Parlor KC in the heart of the Crossroads. Bold flavors, communal vibes, a menu that surprises.
              </p>
              <span className="text-orange text-sm font-bold group-hover:underline">Browse Menu →</span>
            </Link>

            {/* Chef-On-Demand — inner left, medium */}
            <div className="card p-8 flex flex-col border-2 border-orange" style={{background: 'rgba(232,90,26,0.13)'}}>
              <div className="flex justify-center mb-4">
                <span className="badge-orange shadow-sm">Most Popular</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange/20 flex items-center justify-center mb-6 text-2xl">👨‍🍳</div>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Chef-On-Demand</h3>
              <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-6">
                Chef Ameet comes to your home. Curated menus, fresh ingredients, zero cleanup. An evening you won&apos;t forget.
              </p>
              <Link href="/services/chef-on-demand/" className="btn-primary self-start text-sm">Book Now →</Link>
            </div>

            {/* Catering — inner right, medium */}
            <Link href="/services/catering/" className="group card p-8 flex flex-col border-2 border-transparent hover:border-crimson transition-all duration-300" style={{background: 'rgba(232,90,26,0.13)'}}>
              <div className="w-12 h-12 rounded-2xl bg-crimson/10 flex items-center justify-center mb-6 text-2xl group-hover:bg-crimson/20 transition-colors">🎉</div>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3 group-hover:text-crimson transition-colors">Event Catering</h3>
              <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-6">
                Weddings, corporate lunches, private parties. We scale our flavor to fit your guest list — 1 to 300+.
              </p>
              <span className="text-crimson text-sm font-bold group-hover:underline">Get a Quote →</span>
            </Link>

            {/* Delivery — outer right, lightest */}
            <a
              href="https://order.toasttab.com/online/elephant-wings-parlor"
              target="_blank"
              rel="noopener noreferrer"
              className="group card p-8 flex flex-col border-2 border-transparent hover:border-stone-400 transition-all duration-300"
              style={{background: 'rgba(232,90,26,0.06)'}}
            >
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-6 text-2xl group-hover:bg-stone-200 transition-colors">🛵</div>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Delivery</h3>
              <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-6">
                Order direct through Toast and select delivery — the most cost-effective way to get Elephant Wings to your door.
              </p>
              <span className="text-stone-700 text-sm font-bold group-hover:underline">Order on Toast →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="bg-stone-900 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange mb-5">The Story</span>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              Indian roots.<br />Kansas City soul.
            </h2>
            <p className="text-stone-400 leading-relaxed mb-8">
              Chef Ameet grew up surrounded by the aromas of his family&apos;s kitchen — cardamom, turmeric,
              slow-cooked masalas. He brought those memories to Kansas City and built something entirely his own:
              Indian Fusion with no apologies and no boundaries.
            </p>
            <Link href="/about/" className="btn-primary">Meet Chef Ameet →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '5+', label: 'Years in KC' },
              { num: '300+', label: 'Events Catered' },
              { num: '2', label: 'Dining Formats' },
              { num: '∞', label: 'Flavor Combos' },
            ].map((s) => (
              <div key={s.label} className="bg-stone-800 rounded-2xl p-6 text-center">
                <p className="font-display text-4xl font-extrabold text-orange mb-1">{s.num}</p>
                <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-6">⭐⭐⭐⭐⭐</div>
          <blockquote className="font-display text-2xl md:text-3xl font-bold text-stone-800 leading-snug mb-6">
            &ldquo;{testimonialQuote}&rdquo;
          </blockquote>
          <p className="text-stone-400 text-sm">— {testimonialAttribution}</p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Link href="/services/catering/" className="btn-outline">Book for Your Event</Link>
            <Link href="/services/chef-on-demand/" className="btn-primary">Private Dining</Link>
          </div>
        </div>
      </section>

      {/* ── MAILING LIST ── */}
      <section className="bg-stone-50 py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <span className="badge-orange mb-5">Stay in the Loop</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-stone-900 mt-4 mb-4">
            Join Our Mailing List
          </h2>
          <p className="text-stone-500 mb-8">
            New menu drops, pop-up events, and exclusive offers — straight to your inbox. No spam, ever.
          </p>
          <MailingListForm />
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-orange py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Hungry Right Now?
          </h2>
          <p className="text-white/75 text-lg mb-10">
            Order direct via Toast for the best price, or find us on your favorite delivery app.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/order-online/"
              className="bg-white text-orange font-bold px-10 py-4 rounded-full hover:bg-orange-50 transition-colors text-sm tracking-wide shadow-lg">
              Order Online
            </Link>
            <ClickToCall
              phone={SITE_CONFIG.phone}
              display={`Call ${SITE_CONFIG.phoneDisplay}`}
              className="border-2 border-white/70 text-white font-bold px-10 py-4 rounded-full hover:border-white hover:bg-white/10 transition-colors text-sm tracking-wide min-h-[48px] inline-flex items-center"
            />
          </div>
        </div>
      </section>

    </SiteLayout>
  )
}
