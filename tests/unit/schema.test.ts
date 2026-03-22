import { describe, it, expect } from 'vitest'
import { buildLocalBusinessSchema } from '@/lib/schema'
import { SITE_CONFIG } from '@/lib/config'

describe('buildLocalBusinessSchema — @type', () => {
  it('returns Restaurant for restaurant pageType', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema['@type']).toBe('Restaurant')
  })

  it('returns LocalBusiness for general pageType', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'general')
    expect(schema['@type']).toBe('LocalBusiness')
  })

  it('returns LocalBusiness for chef-on-demand pageType', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'chef-on-demand')
    expect(schema['@type']).toBe('LocalBusiness')
  })

  it('returns LocalBusiness for catering pageType', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'catering')
    expect(schema['@type']).toBe('LocalBusiness')
  })
})

describe('buildLocalBusinessSchema — restaurant-only fields', () => {
  it('includes servesCuisine for restaurant type', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.servesCuisine).toContain('Indian Fusion')
  })

  it('includes priceRange for restaurant type', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.priceRange).toBeDefined()
  })

  it('includes hasMenu for restaurant type', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.hasMenu).toContain('elephantwingskc.com')
  })

  it('does NOT include servesCuisine for non-restaurant type', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'general')
    expect(schema.servesCuisine).toBeUndefined()
  })

  it('does NOT include hasMenu for non-restaurant type', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'general')
    expect(schema.hasMenu).toBeUndefined()
  })
})

describe('buildLocalBusinessSchema — NAP accuracy', () => {
  it('streetAddress matches config', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.address.streetAddress).toBe(SITE_CONFIG.address.street)
  })

  it('addressLocality is Kansas City', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.address.addressLocality).toBe('Kansas City')
  })

  it('addressRegion is MO', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.address.addressRegion).toBe('MO')
  })

  it('postalCode is 64108', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.address.postalCode).toBe('64108')
  })

  it('telephone is prefixed with +', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.telephone).toMatch(/^\+/)
  })
})

describe('buildLocalBusinessSchema — schema context', () => {
  it('uses https://schema.org context', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'catering')
    expect(schema['@context']).toBe('https://schema.org')
  })

  it('includes opening hours', () => {
    const schema = buildLocalBusinessSchema(SITE_CONFIG, 'restaurant')
    expect(schema.openingHoursSpecification.length).toBeGreaterThan(0)
    expect(schema.openingHoursSpecification[0].opens).toBeTruthy()
    expect(schema.openingHoursSpecification[0].closes).toBeTruthy()
  })
})
