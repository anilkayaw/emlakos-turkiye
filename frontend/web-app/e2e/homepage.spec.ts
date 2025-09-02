import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check if the page title is correct
    await expect(page).toHaveTitle(/emlakos/)

    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /emlakos/i })).toBeVisible()

    // Check if the hero section is visible
    await expect(page.getByText(/Türkiye'nin en büyük gayrimenkul platformu/i)).toBeVisible()
  })

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/')

    // Check if navigation items are visible
    await expect(page.getByRole('link', { name: /satın alma/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /kiralama/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /kaydol/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /giriş yap/i })).toBeVisible()
  })

  test('should open login modal when clicking login button', async ({ page }) => {
    await page.goto('/')

    // Click the login button
    await page.getByRole('button', { name: /giriş yap/i }).click()

    // Check if login modal is visible
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: /giriş yap/i })).toBeVisible()

    // Check if form fields are present
    await expect(page.getByLabel(/e-posta/i)).toBeVisible()
    await expect(page.getByLabel(/şifre/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /giriş yap/i })).toBeVisible()
  })

  test('should close login modal when clicking close button', async ({ page }) => {
    await page.goto('/')

    // Open login modal
    await page.getByRole('button', { name: /giriş yap/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Close modal
    await page.getByRole('button', { name: /close/i }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('should display search functionality', async ({ page }) => {
    await page.goto('/')

    // Check if search input is visible
    await expect(page.getByPlaceholder(/mahalle, il, ilçe, cadde ara/i)).toBeVisible()

    // Test search functionality
    await page.getByPlaceholder(/mahalle, il, ilçe, cadde ara/i).fill('Beşiktaş')
    await page.getByRole('button', { name: /ara/i }).click()

    // Should navigate to search results
    await expect(page).toHaveURL(/\/ilanlar/)
  })

  test('should display recent listings', async ({ page }) => {
    await page.goto('/')

    // Check if recent listings section is visible
    await expect(page.getByText(/son eklenen ilanlar/i)).toBeVisible()

    // Check if listing cards are present
    const listingCards = page.locator('[data-testid="listing-card"]')
    await expect(listingCards).toHaveCount(3)
  })

  test('should display popular locations', async ({ page }) => {
    await page.goto('/')

    // Check if popular locations section is visible
    await expect(page.getByText(/popüler lokasyonlar/i)).toBeVisible()

    // Check if location cards are present
    const locationCards = page.locator('[data-testid="location-card"]')
    await expect(locationCards).toHaveCount(6)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check if mobile menu button is visible
    await expect(page.getByRole('button', { name: /menüyü aç/i })).toBeVisible()

    // Open mobile menu
    await page.getByRole('button', { name: /menüyü aç/i }).click()

    // Check if mobile menu items are visible
    await expect(page.getByRole('link', { name: /ana sayfa/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /ilanlar/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /harita/i })).toBeVisible()
  })

  test('should display footer', async ({ page }) => {
    await page.goto('/')

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check if footer is visible
    await expect(page.getByText(/© 2024 emlakos/i)).toBeVisible()
    await expect(page.getByText(/tüm hakları saklıdır/i)).toBeVisible()
  })

  test('should handle scroll effects', async ({ page }) => {
    await page.goto('/')

    // Check if header is transparent initially
    const header = page.locator('header')
    await expect(header).toHaveClass(/bg-transparent/)

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 200))

    // Check if header background changes
    await expect(header).toHaveClass(/bg-white/)
  })
})
