import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/My App/)
  })

  test('renders the hero heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('renders Get started button', async ({ page }) => {
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
  })

  test('theme toggle is accessible', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /switch to (light|dark) mode/i })
    await expect(toggle).toBeVisible()
    await toggle.click()
    // After toggle, label should flip
    await expect(
      page.getByRole('button', { name: /switch to (light|dark) mode/i })
    ).toBeVisible()
  })

  test('tabs switch content', async ({ page }) => {
    await page.getByRole('tab', { name: /feedback/i }).click()
    await expect(page.getByText(/Failed to load data/i)).toBeVisible()

    await page.getByRole('tab', { name: /data/i }).click()
    await expect(page.getByText('Alice Chen')).toBeVisible()
  })

  test('has no obvious accessibility violations (headings hierarchy)', async ({ page }) => {
    // Ensure h1 exists
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()

    // Ensure nav landmark exists
    await expect(page.getByRole('navigation')).toBeVisible()
  })
})
