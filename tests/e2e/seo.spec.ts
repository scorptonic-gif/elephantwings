import { test, expect } from '@playwright/test'

const SILO_PAGES = [
  '/',
  '/parlor-kc/',
  '/order-online/',
  '/services/chef-on-demand/',
  '/services/chef-on-demand/menus/',
  '/services/catering/',
  '/services/catering/weddings/',
  '/services/catering/corporate/',
  '/journal/',
]

// Property 4 (partial): LocalBusiness JSON-LD present in <head> on all silo pages
test.describe('JSON-LD presence', () => {
  for (const path of SILO_PAGES) {
    test(`${path} has LocalBusiness JSON-LD in <head>`, async ({ page }) => {
      await page.goto(path)
      const scripts = await page.$$eval(
        'script[type="application/ld+json"]',
        (els) => els.map((el) => el.textContent ?? '')
      )
      const hasLocalBusiness = scripts.some((s) => {
        try {
          const json = JSON.parse(s)
          return json['@type'] === 'LocalBusiness' || json['@type'] === 'Restaurant'
        } catch {
          return false
        }
      })
      expect(hasLocalBusiness).toBe(true)
    })
  }
})

// Property 1: Canonical URL format — present and correctly formatted
test.describe('Canonical tags', () => {
  for (const path of SILO_PAGES) {
    test(`${path} has canonical tag starting with https://elephantwingskc.com and no trailing slash`, async ({ page }) => {
      await page.goto(path)
      const canonical = await page.$eval(
        'link[rel="canonical"]',
        (el) => el.getAttribute('href') ?? ''
      )
      expect(canonical).toMatch(/^https:\/\/elephantwingskc\.com/)
      expect(canonical).not.toMatch(/\/$/)
    })
  }
})
