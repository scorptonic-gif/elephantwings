import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateSlug } from '@/lib/cms'

// ─── Property 12: Slug generation produces URL-safe strings ──────────────────
// Feature: admin-cms, Property 12: Slug generation produces URL-safe strings
describe('Property 12: Slug generation produces URL-safe strings', () => {
  it('any title produces a slug with only [a-z0-9-], no leading/trailing/consecutive hyphens', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        const slug = generateSlug(title)
        // Must only contain lowercase letters, digits, and hyphens
        expect(slug).toMatch(/^[a-z0-9-]+$/)
        // No leading hyphens
        expect(slug).not.toMatch(/^-/)
        // No trailing hyphens
        expect(slug).not.toMatch(/-$/)
        // No consecutive hyphens
        expect(slug).not.toMatch(/--/)
      }),
      { numRuns: 100 }
    )
  })

  it('empty-equivalent titles return "untitled"', () => {
    // Strings that produce no alphanumeric chars should return 'untitled'
    fc.assert(
      fc.property(
        fc.string().filter((s) => !/[a-zA-Z0-9]/.test(s)),
        (title) => {
          const slug = generateSlug(title)
          expect(slug).toBe('untitled')
        }
      ),
      { numRuns: 100 }
    )
  })

  it('known examples produce expected slugs', () => {
    expect(generateSlug('Hello World!')).toBe('hello-world')
    expect(generateSlug('  Leading and trailing  ')).toBe('leading-and-trailing')
    expect(generateSlug('Multiple---Hyphens')).toBe('multiple-hyphens')
    expect(generateSlug('Café & Bistro')).toBe('caf-bistro')
    expect(generateSlug('')).toBe('untitled')
    expect(generateSlug('!!!!')).toBe('untitled')
  })
})
