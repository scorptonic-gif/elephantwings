import type { Metadata } from 'next'
import SiteLayout from '@/components/SiteLayout'
import InquiryForm from '@/components/InquiryForm'
import { generatePageMeta } from '@/lib/seo'

export const metadata: Metadata = generatePageMeta('/services/catering/weddings/')

export default function WeddingCateringPage() {
  return (
    <SiteLayout activeSilo="catering" pageType="catering">

      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="badge-crimson mb-5">Wedding Catering · Kansas City</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-5 leading-tight">
            Indian Fusion Wedding Catering in Kansas City
          </h1>
          <p className="text-stone-500 text-lg mb-10 max-w-2xl mx-auto">
            Make your big day unforgettable. Chef Ameet brings bold, curated Indian Fusion flavors
            to KC&apos;s most celebrated venues.
          </p>
          <a href="#inquiry" className="btn-crimson">Request Wedding Quote</a>
        </div>
      </section>

      <div className="section-container max-w-3xl">
        <div className="mb-14">
          <h2 className="font-display text-3xl font-bold text-stone-900 mb-4">
            Why Choose Indian Fusion for Your Wedding?
          </h2>
          <span className="accent-line" />
          <p className="text-stone-500 leading-relaxed mb-4">
            Your wedding menu should be as memorable as the day itself. Indian Fusion catering
            from Elephant Wings KC brings vibrant, hand-crafted flavors that your guests will be
            talking about long after the last dance.
          </p>
          <p className="text-stone-500 leading-relaxed mb-6">
            We&apos;ve catered weddings across Kansas City — from intimate backyard ceremonies to
            grand ballroom receptions. Our team handles everything from setup to cleanup.
          </p>
          <ul className="space-y-3">
            {[
              'Custom menus tailored to your vision and dietary needs',
              'Buffet, plated, and family-style service options',
              'Vegan, Gluten-Free, and Halal accommodations',
              'Professional staff for seamless execution',
              'Serving KC venues including The Bauer, Union Station, and more',
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
            <h2 className="section-title">Request a Wedding Quote</h2>
            <span className="accent-line mx-auto" />
            <p className="text-stone-500">Share your event details and we&apos;ll be in touch with a custom proposal.</p>
          </div>
          <InquiryForm type="catering" />
        </div>
      </div>

    </SiteLayout>
  )
}
