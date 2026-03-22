import type { Metadata } from 'next'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import MenuSection, { type MenuItem } from '@/components/MenuSection'
import { generatePageMeta } from '@/lib/seo'
import ClickToCall from '@/components/ClickToCall'
import { SITE_CONFIG } from '@/lib/config'
import { getMenuItems } from '@/lib/cms'
import type { MenuItem as DbMenuItem } from '@/lib/cms-types'

export const revalidate = 60

export const metadata: Metadata = generatePageMeta('/parlor-kc/')

const FALLBACK_SIGNATURES: MenuItem[] = [
  {
    name: 'Tikka Masala Poutine',
    description: 'French fries smothered in our signature tikka masala sauce with choice of chicken, beef, paneer, or shrimp — topped with yogurt, scallions, jalapeño, curried paneer, and cilantro.',
    price: '$14',
    dietary: ['spicy'],
  },
  {
    name: 'Bombay-Mi',
    description: 'A bold Indian-Vietnamese fusion sandwich — spiced protein, pickled daikon, fresh herbs, and a house chutney aioli on a toasted baguette.',
    price: '$13',
  },
  {
    name: 'Unholy Cow',
    description: 'Slow-braised beef in a rich masala reduction, served over basmati rice with crispy onions and a cooling raita.',
    price: '$16',
    dietary: ['spicy'],
  },
  {
    name: 'Green Shrimp Coconut Curry',
    description: 'Plump shrimp in a vibrant green coconut curry with lemongrass, kaffir lime, and fresh basil. Served with jasmine rice.',
    price: '$17',
    dietary: ['gluten-free'],
  },
]

const FALLBACK_SMALL_PLATES: MenuItem[] = [
  {
    name: 'Tandoori Fries',
    description: 'Crispy fries dusted with our house tandoori spice blend, served with mint chutney and tamarind dipping sauce.',
    price: '$8',
    dietary: ['vegan', 'gluten-free'],
  },
  {
    name: 'Hand-Crafted Samosas',
    description: 'Golden, flaky pastry filled with spiced potato and peas. Served with house chutneys.',
    price: '$9',
    dietary: ['vegan'],
  },
  {
    name: 'Chaat Nachos',
    description: 'Crispy papdi chips loaded with chickpeas, tamarind chutney, mint yogurt, pomegranate, and sev.',
    price: '$11',
    dietary: ['vegetarian'],
  },
]

const FALLBACK_DRINKS: MenuItem[] = [
  {
    name: 'Mango Lassi',
    description: 'Creamy blended yogurt drink with Alphonso mango and a hint of cardamom.',
    price: '$6',
    dietary: ['vegetarian', 'gluten-free'],
  },
  {
    name: 'Masala Chai',
    description: 'House-spiced black tea with ginger, cardamom, cinnamon, and steamed milk.',
    price: '$5',
    dietary: ['vegetarian', 'gluten-free'],
  },
]

const VALID_DIETARY = ['vegan', 'vegetarian', 'gluten-free', 'spicy'] as const
type DietaryTag = typeof VALID_DIETARY[number]

function dbToMenuItem(item: DbMenuItem): MenuItem {
  return {
    name: item.name,
    description: item.description ?? '',
    price: '$' + (item.price_cents / 100).toFixed(2),
    dietary: item.dietary_tags.filter((t): t is DietaryTag =>
      (VALID_DIETARY as readonly string[]).includes(t)
    ),
  }
}

export default async function ParlorKCPage() {
  let signatures = FALLBACK_SIGNATURES
  let smallPlates = FALLBACK_SMALL_PLATES
  let drinks = FALLBACK_DRINKS

  try {
    const [dbSignatures, dbSmallPlates, dbDrinks] = await Promise.all([
      getMenuItems('signatures'),
      getMenuItems('small_plates'),
      getMenuItems('drinks'),
    ])
    if (dbSignatures.length > 0) signatures = dbSignatures.map(dbToMenuItem)
    if (dbSmallPlates.length > 0) smallPlates = dbSmallPlates.map(dbToMenuItem)
    if (dbDrinks.length > 0) drinks = dbDrinks.map(dbToMenuItem)
  } catch {
    // fall back to hardcoded arrays
  }

  return (
    <SiteLayout activeSilo="restaurant" pageType="restaurant">

      {/* Hero */}
      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="badge-orange mb-5">East Crossroads · Kansas City</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-4">
            The Parlor Menu
          </h1>
          <p className="text-stone-500 text-lg mb-8 max-w-xl mx-auto">
            Find us inside{' '}
            <a href={SITE_CONFIG.parlor.url} target="_blank" rel="noopener noreferrer"
              className="text-orange hover:underline font-medium">
              Parlor KC
            </a>{' '}
            at 1707 Locust St. Bold Indian Fusion, communal vibes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/order-online/" className="btn-primary">Order Online</Link>
            <ClickToCall phone={SITE_CONFIG.phone} display={`Call ${SITE_CONFIG.phoneDisplay}`} className="btn-outline" />
          </div>
        </div>
      </section>

      {/* Menu */}
      <div className="section-container">
        <MenuSection title="Signature Dishes" description="Our most-loved plates — the reason people keep coming back." items={signatures} />
        <MenuSection title="Small Plates & Starters" description="Perfect for sharing. Bold flavors, no commitment." items={smallPlates} />
        <MenuSection title="Drinks" description="House-crafted beverages to complement your meal." items={drinks} />

        {/* CTA */}
        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-10 text-center mt-4">
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">
            Want the Full Experience at Home?
          </h2>
          <p className="text-stone-500 mb-7 max-w-md mx-auto">
            Book Chef Ameet for a private Chef-On-Demand dinner — curated menus, prepared in your kitchen.
          </p>
          <Link href="/services/chef-on-demand/" className="btn-primary">Book Chef-On-Demand</Link>
        </div>
      </div>

    </SiteLayout>
  )
}
