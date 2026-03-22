import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import JsonLd from '@/components/JsonLd'
import InquiryForm from '@/components/InquiryForm'
import { generatePageMeta } from '@/lib/seo'
import { buildLocalBusinessSchema, CHEF_ON_DEMAND_SERVICE_SCHEMA } from '@/lib/schema'
import { SITE_CONFIG } from '@/lib/config'
import { getSiteConfig } from '@/lib/cms'

export const revalidate = 60

export const metadata: Metadata = generatePageMeta('/services/chef-on-demand/')

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose Your Menu',
    description: 'Pick from our curated experiences or request a fully custom creation tailored to your occasion and dietary needs.',
  },
  {
    step: '02',
    title: 'We Shop & Prep',
    description: 'Chef Ameet sources the freshest ingredients and arrives at your home ready to create. No grocery runs, no prep work.',
  },
  {
    step: '03',
    title: 'You Host & Enjoy',
    description: 'We cook, plate, and serve each course. When the evening ends, we leave your kitchen spotless.',
  },
]

const DEFAULT_HEADLINE = 'Chef-On-Demand: Private Indian Fusion Dining in Kansas City'
const DEFAULT_DESCRIPTION = 'Curated menus by Chef Ameet, prepared in your kitchen. No shopping, no cooking, no cleanup.'

export default async function ChefOnDemandPage() {
  const localBusinessSchema = buildLocalBusinessSchema(SITE_CONFIG, 'chef-on-demand')

  let headline = DEFAULT_HEADLINE
  let description = DEFAULT_DESCRIPTION

  try {
    const config = await getSiteConfig()
    if (config.services_cod_headline) headline = config.services_cod_headline
    if (config.services_cod_description) description = config.services_cod_description
  } catch {
    // fall back to hardcoded values
  }

  return (
    <SiteLayout activeSilo="chef-on-demand" pageType="chef-on-demand">
      <JsonLd schema={[localBusinessSchema, CHEF_ON_DEMAND_SERVICE_SCHEMA]} />

      {/* Hero */}
      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="badge-orange mb-5">Private Dining · Kansas City</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-5 leading-tight">
            {headline}
          </h1>
          <p className="text-stone-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            {description}
          </p>
          <a href="#inquiry" className="btn-primary">Check Availability</a>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-stone-50 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-title">How It Works</h2>
            <span className="accent-line mx-auto" />
            <p className="section-subtitle max-w-md mx-auto">Three simple steps to an unforgettable evening.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="card p-8 text-center">
                <div className="font-display text-5xl font-bold text-orange/30 mb-4">{s.step}</div>
                <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{s.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Experience */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">The Menu Experience</h2>
            <span className="accent-line mx-auto" />
            <p className="section-subtitle max-w-xl mx-auto">
              Choose a signature journey or collaborate with Chef Ameet on something entirely your own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="card p-8 border-l-4 border-orange">
              <span className="badge-orange mb-4">Signature</span>
              <h3 className="font-display text-2xl font-bold text-stone-900 mb-3">The Spice Route Journey</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                A 5-course exploration of the Indian subcontinent — from turmeric-infused amuse bouche to a cardamom-scented dessert.
              </p>
              <ul className="text-stone-500 text-sm space-y-1.5 mb-5">
                <li className="flex gap-2"><span className="text-orange">·</span> Amuse Bouche: Turmeric-infused bite</li>
                <li className="flex gap-2"><span className="text-orange">·</span> Starter: Hand-crafted Samosas</li>
                <li className="flex gap-2"><span className="text-orange">·</span> Soup: Roasted tomato shorba</li>
                <li className="flex gap-2"><span className="text-orange">·</span> Main: Braised Lamb masala</li>
                <li className="flex gap-2"><span className="text-orange">·</span> Dessert: Cardamom Gulab Jamun</li>
              </ul>
              <Link href="/services/chef-on-demand/menus/" className="text-orange hover:underline text-sm font-semibold">
                View full menu →
              </Link>
            </article>

            <article className="card p-8">
              <span className="badge-crimson mb-4">Modern</span>
              <h3 className="font-display text-2xl font-bold text-stone-900 mb-3">Contemporary Fusion</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-4">
                Chef Ameet's modern take — where Indian technique meets global inspiration. Unexpected pairings, refined execution.
              </p>
              <ul className="text-stone-500 text-sm space-y-1.5 mb-5">
                <li className="flex gap-2"><span className="text-crimson">·</span> Starter: Miso-glazed paneer skewers</li>
                <li className="flex gap-2"><span className="text-crimson">·</span> Salad: Chaat-spiced roasted beet</li>
                <li className="flex gap-2"><span className="text-crimson">·</span> Main: Coconut curry risotto</li>
                <li className="flex gap-2"><span className="text-crimson">·</span> Cheese: Cumin paneer with fig chutney</li>
                <li className="flex gap-2"><span className="text-crimson">·</span> Dessert: Saffron-poached pear</li>
              </ul>
              <a href="#inquiry" className="text-crimson hover:underline text-sm font-semibold">Request this menu →</a>
            </article>
          </div>

          {/* Dietary */}
          <div className="bg-stone-50 rounded-2xl p-8 mt-6 text-center">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Dietary-Conscious by Design</h3>
            <p className="text-stone-500 text-sm mb-5 max-w-lg mx-auto">
              Every menu is customizable for <strong className="text-stone-700">Vegan</strong>,{' '}
              <strong className="text-stone-700">Gluten-Free</strong>, and{' '}
              <strong className="text-stone-700">Halal</strong> requirements.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Vegan', 'Gluten-Free', 'Halal', 'Nut-Free', 'Vegetarian'].map((tag) => (
                <span key={tag} className="badge-stone">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-stone-50 py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title mb-3">Pricing</h2>
          <span className="accent-line mx-auto" />
          <p className="text-stone-500 mb-10">
            A $100 deposit is required at booking, applied toward your total.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card p-8">
              <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">5-Course</p>
              <p className="font-display text-5xl font-bold text-stone-900 mb-1">$140</p>
              <p className="text-stone-400 text-xs">per person + tax</p>
            </div>
            <div className="card p-8 border-2 border-orange">
              <p className="text-orange text-xs font-bold uppercase tracking-widest mb-2">7-Course</p>
              <p className="font-display text-5xl font-bold text-stone-900 mb-1">$165</p>
              <p className="text-stone-400 text-xs">per person + tax</p>
            </div>
          </div>
          <p className="text-stone-400 text-sm mt-6">Groups of 2–20 guests. Book at least two weeks in advance.</p>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Check Availability</h2>
            <span className="accent-line mx-auto" />
            <p className="text-stone-500">Tell us about your event and Chef Ameet will be in touch within 24 hours.</p>
          </div>
          <InquiryForm type="chef-on-demand" />
        </div>
      </section>

    </SiteLayout>
  )
}
