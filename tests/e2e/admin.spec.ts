import { test, expect } from '@playwright/test'

// Property 12: Unauthenticated admin requests return 401
test.describe('Admin panel protection', () => {
  test('unauthenticated request to /ew-admin returns 401', async ({ page }) => {
    const response = await page.goto('/ew-admin', { waitUntil: 'commit' })
    expect(response?.status()).toBe(401)
  })

  test('unauthenticated request to /ew-admin/inquiries returns 401', async ({ page }) => {
    const response = await page.goto('/ew-admin/inquiries', { waitUntil: 'commit' })
    expect(response?.status()).toBe(401)
  })

  test('no public page links to /ew-admin', async ({ page }) => {
    await page.goto('/')
    const adminLinks = await page.$$eval(
      'a[href*="ew-admin"]',
      (els) => els.map((el) => el.getAttribute('href'))
    )
    expect(adminLinks).toHaveLength(0)
  })
})
