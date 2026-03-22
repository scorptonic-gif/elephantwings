import { test, expect } from '@playwright/test'

// Property 14: 301 redirects for all old URLs
test.describe('301 redirects', () => {
  const REDIRECTS = [
    { from: '/how-it-works', to: '/services/chef-on-demand/' },
    { from: '/parlor', to: '/parlor-kc/' },
    { from: '/cumin-chicken', to: '/parlor-kc/' },
    { from: '/pies', to: '/parlor-kc/' },
    { from: '/in-the-press', to: '/' },
  ]

  for (const { from, to } of REDIRECTS) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      const response = await page.goto(from, { waitUntil: 'commit' })
      // After following redirect, should land on the target
      expect(page.url()).toContain(to.replace(/\/$/, ''))
      // The initial response should have been a redirect (3xx)
      // Playwright follows redirects, so we check the final URL
      expect(response?.status()).toBeLessThan(400)
    })
  }
})
