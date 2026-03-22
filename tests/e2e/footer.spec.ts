import { test, expect } from '@playwright/test'

const PUBLIC_PAGES = [
  '/',
  '/parlor-kc/',
  '/order-online/',
  '/services/chef-on-demand/',
  '/services/catering/',
]

// Property 9: Footer Parlor KC link
// Property 10: Footer service area text
test.describe('Footer content', () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path} footer has Parlor KC link`, async ({ page }) => {
      await page.goto(path)
      const parlorLink = page.locator('footer a[href="https://www.parlorkcmo.com"]')
      await expect(parlorLink).toBeVisible()
    })

    test(`${path} footer has service area text`, async ({ page }) => {
      await page.goto(path)
      const footer = page.locator('footer')
      await expect(footer).toContainText('Kansas City')
      await expect(footer).toContainText('Overland Park')
    })
  }
})
