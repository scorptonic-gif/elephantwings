import { test, expect } from '@playwright/test'

// Property 3: Menu content is HTML, not PDF
test.describe('No PDF links on menu pages', () => {
  const MENU_PAGES = [
    '/parlor-kc/',
    '/services/chef-on-demand/menus/',
  ]

  for (const path of MENU_PAGES) {
    test(`${path} has no PDF links`, async ({ page }) => {
      await page.goto(path)
      const pdfLinks = await page.$$eval(
        'a[href$=".pdf"]',
        (els) => els.map((el) => el.getAttribute('href'))
      )
      expect(pdfLinks).toHaveLength(0)
    })
  }
})
