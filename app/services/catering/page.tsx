import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import InquiryForm from '@/components/InquiryForm'
import { generatePageMeta } from '@/lib/seo'

export const metadata: Metadata = generatePageMeta('/services/catering/')

const SERVICE_STYLES = [
  { icon: '📦', title: 'Drop-Off Catering', description: 'Freshly prepared dishes delivered in elegant packaging — ready to serve, zero hassle.', ideal: 'Office lunches, casual parties · 10–50 guests' },
  { icon: '🍽️', title: 'Buffet Service', description: 'Elegant setups with staff to manage the flow. Beautifully arranged stations, always fresh.', ideal: 'Corporate events, family celebrations · 30–200 guests' },
  { icon: '✨', title: 'Plated Events', description: 'Full-service dining for weddings and galas. Each course plated and served — restaurant-quality at your venue.', ideal: 'Weddings, galas, formal dinners · 20–300 guests' },
]

const TESTIMONIALS = [
  { quote: 'Elephant Wings turned our corporate retreat into a flavor explosion. Professional, punctual, and absolutely delicious.', author: 'A satisfied KC client' },
  { quote: 'Chef Ameet catered our wedding and every single guest asked for the recipe. The tikka masala was out of this world.', author: 'KC wedding client' },
]

export default function CateringPage() {
  return (
    <SiteLayout activeSilo="catering" pageType="catering">
      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="badge-crimson mb-5">Event Catering · Kansas City</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-5 leading-tight">
            Indian Fusion Catering for KC&apos;s Most Memorable Events
          </h1>
          <p className="text-stone-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            From corporate lunches to wedding celebrations, we scale our flavor to fit your guest list.
          </p>
          <a href="#inquiry" className="btn-crimson">Get a Quote</a>
        </div>
      </section>

      <section className="bg-stone-50 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">Service Styles</h2>
            <span className="accent-line mx-auto" />
            <p className="section-subtitle max-w-lg mx-auto">Three ways to bring Elephant Wings to your event.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_STYLES.map((s) => (
              <div key={s.title} className="card p-8 flex flex-col">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-display text-xl font-bold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-4">{s.description}</p>
                <p className="text-orange text-xs font-semibold">{s.ideal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <blockquote key={i} className="card p-8 border-l-4 border-crimson">
                <p className="font-display text-lg italic text-stone-700 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <footer className="text-crimson text-sm font-semibold">— {t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title mb-10">Specialized Catering</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/services/catering/weddings/" className="card p-8 text-left hover:border-crimson border-2 border-transparent transition-colors group">
              <div className="text-3xl mb-3">💍</div>
              <h3 className="font-display text-xl font-bold text-stone-900 group-hover:text-crimson transition-colors mb-2">Wedding Catering</h3>
              <p className="text-stone-500 text-sm">Make your KC wedding unforgettable with bold Indian Fusion flavors.</p>
            </Link>
            <Link href="/services/catering/corporate/" className="card p-8 text-left hover:border-orange border-2 border-transparent transition-colors group">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-display text-xl font-bold text-stone-900 group-hover:text-orange transition-colors mb-2">Corporate Catering</h3>
              <p className="text-stone-500 text-sm">Upgrade your next office lunch or corporate event in Kansas City.</p>
            </Link>
          </div>
        </div>
      </section>

      <section id="inquiry" className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Get a Quote</h2>
            <span className="accent-line mx-auto" />
            <p className="text-stone-500">Tell us about your event and we&apos;ll follow up within 24 hours.</p>
          </div>
          <InquiryForm type="catering" />
        </div>
      </section>
    </SiteLayout>
  )
}
