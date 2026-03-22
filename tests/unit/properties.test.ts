import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generatePageMeta } from '@/lib/seo'
import { validateInquiry } from '@/lib/validation'
import { buildLocalBusinessSchema } from '@/lib/schema'
import { ROUTE_MAP, type SiloRoute } from '@/lib/routes'
import { SITE_CONFIG } from '@/lib/config'

const ALL_ROUTES = Object.keys(ROUTE_MAP) as SiloRoute[]

// ─── Property 1: Canonical URL format ────────────────────────────────────────
describe('Property 1: Canonical URL format', () => {
  it('canonical starts with https://elephantwingskc.com and has no trailing slash', () => {
    for (const route of ALL_ROUTES) {
      const meta = generatePageMeta(route)
      const canonical = (meta.alternates as { canonical: string }).canonical
      expect(canonical).toMatch(/^https:\/\/elephantwingskc\.com/)
      expect(canonical).not.toMatch(/\/$/)
    }
  })
})

// ─── Property 4: LocalBusiness JSON-LD NAP accuracy ──────────────────────────
describe('Property 4: LocalBusiness JSON-LD NAP accuracy', () => {
  it('address fields always match SITE_CONFIG exactly', () => {
    const pageTypes = ['restaurant', 'chef-on-demand', 'catering', 'general'] as const
    for (const pageType of pageTypes) {
      const schema = buildLocalBusinessSchema(SITE_CONFIG, pageType)
      expect(schema.address.streetAddress).toBe(SITE_CONFIG.address.street)
      expect(schema.address.addressLocality).toBe(SITE_CONFIG.address.city)
      expect(schema.address.addressRegion).toBe(SITE_CONFIG.address.state)
      expect(schema.address.postalCode).toBe(SITE_CONFIG.address.zip)
    }
  })
})

// ─── Property 5: Chef-On-Demand guest count validation ───────────────────────
describe('Property 5: Chef-On-Demand guest count validation', () => {
  it('any guestCount outside valid options returns non-empty errors', () => {
    const validOptions = new Set(['2-6', '7-12', '13-20'])
    fc.assert(
      fc.property(
        fc.string().filter((s) => !validOptions.has(s)),
        (invalidGuestCount) => {
          const errors = validateInquiry({
            type: 'chef-on-demand',
            name: 'Jane',
            email: 'jane@example.com',
            phone: '816-555-0100',
            eventDate: '2099-12-31',
            guestCount: invalidGuestCount as never,
            courseOption: '5-course',
          })
          return Object.keys(errors).length > 0
        }
      )
    )
  })
})

// ─── Property 7: All SiloRoutes have RouteConfig entries ─────────────────────
describe('Property 7: All SiloRoutes have RouteConfig entries', () => {
  it('every route in ROUTE_MAP has path, silo, primaryKeyword, and meta', () => {
    for (const [route, config] of Object.entries(ROUTE_MAP)) {
      expect(config.path).toBeTruthy()
      expect(config.silo).toBeTruthy()
      expect(config.primaryKeyword).toBeTruthy()
      expect(config.meta.title).toBeTruthy()
      expect(config.meta.description).toBeTruthy()
      expect(config.path).toBe(route)
    }
  })
})

// ─── Property 15: generatePageMeta description length ────────────────────────
describe('Property 15: generatePageMeta description length', () => {
  it('description is between 50 and 200 characters for all routes', () => {
    for (const route of ALL_ROUTES) {
      const meta = generatePageMeta(route)
      const desc = meta.description as string
      expect(desc.length).toBeGreaterThanOrEqual(50)
      expect(desc.length).toBeLessThanOrEqual(200)
    }
  })
})

// ─── Property 16: buildLocalBusinessSchema telephone format ──────────────────
describe('Property 16: buildLocalBusinessSchema telephone format', () => {
  it('telephone is always prefixed with +', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('restaurant', 'chef-on-demand', 'catering', 'general' as const),
        (pageType) => {
          const schema = buildLocalBusinessSchema(SITE_CONFIG, pageType)
          return schema.telephone.startsWith('+')
        }
      )
    )
  })
})
