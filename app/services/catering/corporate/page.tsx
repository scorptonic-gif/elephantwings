import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'
import InquiryForm from '@/components/InquiryForm'
import { generatePageMeta } from '@/lib/seo'

export const metadata: Metadata = generatePageMeta('/services/catering/corporate/')

export default function CorporateCateringPage() {
  return (
    <SiteLayout activeSilo="catering" pageType="catering">

      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="badge-orange mb-5">Corporate Catering · Kansas City</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-5 leading-tight">
            Corporate Catering Kansas City
          </h1>
          <p className="text-stone-500 text-lg mb-10 max-w-2xl mx-auto">
            Why boring sandwiches when you can have Tikka Masala? Elephant Wings brings bold Indian
            Fusion to your next KC corporate event.
          </p>
          <a href="#inquiry" className="btn-primary">Request Corporate Quote</a>
        </div>
      </section>

      <div className="section-container max-w-3xl">
        <div className="mb-14">
          <h2 className="font-display text-3xl font-bold text-stone-900 mb-4">
            Elevate Your Next Corporate Event
          </h2>
          <span className="accent-line" />
          <p className="text-stone-500 leading-relaxed mb-4">
            From team lunches to all-hands meetings and client entertainment — Elephant Wings KC
            delivers professional, flavorful Indian Fusion catering that makes an impression.
          </p>
          <p className="text-stone-500 leading-relaxed mb-6">
            We offer drop-off catering for quick office lunches and full-service buffet setups for
            larger corporate events. Every order is prepared fresh and delivered on time.
          </p>
          <ul className="space-y-3">
            {[
              'Drop-off catering for office lunches (10–50 people)',
              'Buffet service for corporate events (30–200 people)',
              'Dietary accommodations: Vegan, GF, Halal',
              'Serving Kansas City, Overland Park, Leawood, and Mission',
              'Reliable, professional, and always on time',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600 text-sm">
                <span className="text-orange font-bold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div id="inquiry">
          <div className="text-center mb-10">
            <h2 className="section-title">Request a Corporate Quote</h2>
            <span className="accent-line mx-auto" />
            <p className="text-stone-500">Tell us about your event and we&apos;ll follow up with a formal quote.</p>
          </div>
          <InquiryForm type="catering" />
        </div>
      </div>

    </SiteLayout>
  )
}
