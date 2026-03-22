import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import { generatePageMeta } from '@/lib/seo'

export const metadata: Metadata = generatePageMeta('/services/chef-on-demand/menus/')

const COURSES = [
  {
    num: '01',
    label: 'Amuse Bouche',
    name: 'Turmeric-Infused Bite',
    description: 'A single, elegant bite to awaken the palate. Turmeric-infused paneer on a crispy papadum with tamarind gel and micro herbs.',
  },
  {
    num: '02',
    label: 'Starter',
    name: 'Hand-Crafted Samosas',
    description: 'Golden, flaky pastry filled with spiced potato, peas, and toasted cumin. Served with house-made mint chutney and sweet tamarind sauce.',
  },
  {
    num: '03',
    label: 'Soup',
    name: 'Roasted Tomato Shorba',
    description: 'A velvety Indian-spiced tomato consommé with crispy chickpeas, a swirl of coconut cream, and fresh cilantro oil.',
  },
  {
    num: '04',
    label: 'Main',
    name: 'Braised Lamb in Masala Reduction',
    description: 'Slow-braised lamb shoulder in a 12-spice masala reduction, served over saffron basmati rice with crispy onions, cooling raita, and warm naan.',
  },
  {
    num: '05',
    label: 'Dessert',
    name: 'Cardamom-Scented Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in cardamom and rose syrup, served warm with house-made rose cream and crushed pistachios.',
  },
]

export default function ChefOnDemandMenusPage() {
  return (
    <SiteLayout activeSilo="chef-on-demand" pageType="chef-on-demand">

      {/* Hero */}
      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="badge-orange mb-5">Chef-On-Demand Menus</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-4">
            The Spice Route Journey
          </h1>
          <p className="text-stone-500 text-lg mb-8 max-w-xl mx-auto">
            A 5-course exploration of Indian Fusion — every course crafted by Chef Ameet.
          </p>
          <Link href="/services/chef-on-demand/#inquiry" className="btn-primary">Book This Experience</Link>
        </div>
      </section>

      {/* Courses */}
      <div className="section-container max-w-3xl">
        <div className="space-y-5">
          {COURSES.map((c) => (
            <article key={c.num} className="card p-7 flex gap-6 items-start">
              <div className="font-display text-3xl font-bold text-orange/25 min-w-[2.5rem] text-center shrink-0 mt-1">
                {c.num}
              </div>
              <div>
                <p className="text-orange text-xs font-bold uppercase tracking-widest mb-1">{c.label}</p>
                <h2 className="font-display text-xl font-bold text-stone-900 mb-2">{c.name}</h2>
                <p className="text-stone-500 text-sm leading-relaxed">{c.description}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Dietary */}
        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-8 mt-10 text-center">
          <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Dietary Accommodations</h3>
          <p className="text-stone-500 text-sm mb-6 max-w-md mx-auto">
            Every course can be adapted for Vegan, Gluten-Free, Halal, or Nut-Free requirements.
            Let us know when you inquire.
          </p>
          <Link href="/services/chef-on-demand/#inquiry" className="btn-primary">Request a Custom Menu</Link>
        </div>

        {/* Pricing */}
        <div className="text-center mt-10 text-stone-500 text-sm">
          <p>5-Course: <strong className="text-stone-800">$140/person</strong> · 7-Course: <strong className="text-stone-800">$165/person</strong></p>
          <p className="mt-1 text-stone-400">+ tax, gratuity not included. $100 deposit required at booking.</p>
        </div>
      </div>

    </SiteLayout>
  )
}
