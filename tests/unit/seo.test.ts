import { describe, it, expect } from 'vitest'
import { generatePageMeta } from '@/lib/seo'
import { ROUTE_MAP } from '@/lib/routes'

const ALL_ROUTES = Object.keys(ROUTE_MAP) as string[]

describe('generatePageMeta — title format', () => {
  it('includes "Elephant Wings" in every route title', () => {
    for (const route of ALL_ROUTES) {
      const meta = generatePageMeta(route)
      expect(String(meta.title)).toContain('Elephant Wings')
    }
  })

  it('returns correct title for home page', () => {
    const meta = generatePageMeta('/')
    expect(meta.title).toContain('Elephant Wings KC')
  })
})

describe('generatePageMeta — canonical URL', () => {
  it('canonical starts with https://elephantwingskc.com', () => {
    for (const route of ALL_ROUTES) {
      const meta = generatePageMeta(route)
      const canonical = (meta.alternates as { canonical: string }).canonical
      expect(canonical).toMatch(/^https:\/\/elephantwingskc\.com/)
    }
  })

  it('canonical has no trailing slash', () => {
    for (const route of ALL_ROUTES) {
      const meta = generatePageMeta(route)
      const canonical = (meta.alternates as { canonical: string }).canonical
      expect(canonical).not.toMatch(/\/$/)
    }
  })

  it('home page canonical is exactly https://elephantwingskc.com', () => {
    const meta = generatePageMeta('/')
    const canonical = (meta.alternates as { canonical: string }).canonical
    expect(canonical).toBe('https://elephantwingskc.com')
  })
})

describe('generatePageMeta — openGraph', () => {
  it('includes OG image on every route', () => {
    for (const route of ALL_ROUTES) {
      const meta = generatePageMeta(route)
      const og = meta.openGraph as { images: Array<{ url: string }> }
      expect(og.images[0].url).toContain('elephantwingskc.com')
    }
  })

  it('OG title and description match page meta', () => {
    for (const route of ALL_ROUTES) {
      const meta = generatePageMeta(route)
      const og = meta.openGraph as { title: string; description: string }
      expect(og.title).toBe(meta.title)
      expect(og.description).toBe(meta.description)
    }
  })
})

describe('generatePageMeta — error handling', () => {
  it('throws for unknown route', () => {
    expect(() => generatePageMeta('/unknown-route/')).toThrow(/Unrecognized route/)
  })

  it('throws for empty string route', () => {
    expect(() => generatePageMeta('')).toThrow()
  })

  it('does not throw for any known route', () => {
    for (const route of ALL_ROUTES) {
      expect(() => generatePageMeta(route)).not.toThrow()
    }
  })
})
