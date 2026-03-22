import { test, expect } from '@playwright/test'

test.describe('Inquiry form — Chef-On-Demand', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services/chef-on-demand/')
  })

  test('shows inline errors for invalid submission', async ({ page }) => {
    // Submit without filling anything
    await page.getByRole('button', { name: /send inquiry/i }).click()
    // Should show field-level errors
    await expect(page.getByText(/required/i).first()).toBeVisible()
  })

  test('form fields are present', async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/phone/i)).toBeVisible()
    await expect(page.getByLabel(/event date/i)).toBeVisible()
  })

  test('chef-on-demand specific fields are present', async ({ page }) => {
    await expect(page.getByLabel(/guest count/i)).toBeVisible()
    await expect(page.getByLabel(/course/i)).toBeVisible()
  })
})

test.describe('Inquiry form — Catering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services/catering/')
  })

  test('shows inline errors for invalid submission', async ({ page }) => {
    await page.getByRole('button', { name: /send inquiry/i }).click()
    await expect(page.getByText(/required/i).first()).toBeVisible()
  })

  test('catering specific fields are present', async ({ page }) => {
    await expect(page.getByLabel(/event type/i)).toBeVisible()
  })
})
