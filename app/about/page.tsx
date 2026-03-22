import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import MailingListForm from '@/components/MailingListForm'
import { getSiteConfig } from '@/lib/cms'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About Us | Elephant Wings KC',
  description:
    'Meet Chef Ameet Malhotra and the story behind Elephant Wings KC — bold Indian Fusion rooted in Kansas City\'s Crossroads.',
}

const DEFAULT_BIO_PARAGRAPHS = [
  "Chef Ameet grew up surrounded by the aromas of his family's kitchen in India — cardamom, turmeric, slow-cooked masalas. He carried those memories across the world, trained in modern culinary technique, and landed in Kansas City with a vision: Indian flavors, no rules.",
  "Elephant Wings was born at Parlor KC in the heart of the Crossroads. What started as a pop-up concept quickly became one of KC's most talked-about food experiences — from the Tikka Masala Poutine to private Chef-On-Demand dinners in your home.",
  "Every dish is a conversation between tradition and curiosity. That's the Elephant Wings way.",
]

const DEFAULT_VALUES = [
  {
    icon: '🌶️',
    title: 'Bold Without Apology',
    body: "We don't dial back the spice. We trust you to handle it — and we think you'll love us for it.",
  },
  {
    icon: '🤝',
    title: 'Community First',
    body: 'Kansas City gave us a home. We give back through local sourcing, community events, and showing up for the people who show up for us.',
  },
  {
    icon: '✨',
    title: 'Craft in Every Plate',
    body: "Whether it's a $14 poutine at Parlor or a 7-course private dinner, every dish gets the same attention.",
  },
]

export default async function AboutPage() {
  let bioParagraphs = DEFAULT_BIO_PARAGRAPHS
  let values = DEFAULT_VALUES

  try {
    const config = await getSiteConfig()

    if (config.about_bio) {
      bioParagraphs = config.about_bio.split('\n\n').filter(Boolean)
    }

    if (config.about_values) {
      const rawValues = config.about_values.split('\n\n').filter(Boolean)
      if (rawValues.length > 0) {
        // Each value item is plain text; map to display format preserving icons from defaults where possible
        values = rawValues.map((item, i) => ({
          icon: DEFAULT_VALUES[i]?.icon ?? '✦',
          title: item.split('\n')[0] ?? item,
          body: item.split('\n').slice(1).join(' ') || item,
        }))
      }
    }
  } catch {
    // fall back to hardcoded values
  }

  return (
    <SiteLayout>

      {/* Hero */}
      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="badge-orange mb-5">Our Story</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-5">
            About Elephant Wings KC
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Bold Indian Fusion, rooted in Kansas City. Born from a love of spice, technique, and the
            belief that food should surprise you.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="badge-crimson mb-5">Chef Ameet Malhotra</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-4 mb-5">
              The Chef Behind the Flavor
            </h2>
            {bioParagraphs.map((para, i) => (
              <p key={i} className="text-stone-600 leading-relaxed mb-4">
                {para}
              </p>
            ))}
          </div>

          {/* Visual accent */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-3xl bg-orange/8 rotate-3" />
              <div className="absolute inset-0 rounded-3xl bg-crimson/6 -rotate-2" />
              <div className="absolute inset-4 rounded-2xl bg-orange/12 flex items-center justify-center">
                <span className="text-8xl select-none" role="img" aria-label="Elephant">🐘</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-50 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              What We Stand For
            </h2>
            <span className="accent-line mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-8 text-center flex flex-col items-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-3">{v.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mailing List */}
      <section className="bg-white py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <span className="badge-orange mb-5">Stay in the Loop</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mt-4 mb-4">
            Join Our Mailing List
          </h2>
          <p className="text-stone-500 mb-10">
            New menu drops, pop-up events, and exclusive offers — straight to your inbox. No spam, ever.
          </p>
          <MailingListForm />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience It?
          </h2>
          <p className="text-white/75 mb-8">Come find us at Parlor KC or book Chef Ameet for your next event.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/parlor-kc/" className="bg-white text-orange font-semibold px-8 py-3.5 rounded-full hover:bg-orange-50 transition-colors text-sm tracking-wide">
              See the Menu
            </Link>
            <Link href="/services/chef-on-demand/" className="border-2 border-white/70 text-white font-semibold px-8 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-colors text-sm tracking-wide">
              Book Chef Ameet
            </Link>
          </div>
        </div>
      </section>

    </SiteLayout>
  )
}
