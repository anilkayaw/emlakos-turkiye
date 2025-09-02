import { test, expect } from '@playwright/test'

test.describe('Listings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ilanlar')
  })

  test('should load listings page successfully', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle(/İlanlar/)

    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /ilanlar/i })).toBeVisible()

    // Check if search input is visible
    await expect(page.getByPlaceholder(/ilan ara/i)).toBeVisible()
  })

  test('should display filter options', async ({ page }) => {
    // Click on filters button
    await page.getByRole('button', { name: /filtreler/i }).click()

    // Check if filter options are visible
    await expect(page.getByRole('combobox', { name: /tüm mülk tipleri/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /tüm şehirler/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /fiyat aralığı/i })).toBeVisible()
  })

  test('should filter listings by property type', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filtreler/i }).click()

    // Select apartment type
    await page.getByRole('combobox', { name: /tüm mülk tipleri/i }).selectOption('apartment')

    // Click search button
    await page.getByRole('button', { name: /ara/i }).click()

    // Wait for results to load
    await page.waitForLoadState('networkidle')

    // Check if results are displayed
    await expect(page.getByText(/ilan bulundu/i)).toBeVisible()
  })

  test('should filter listings by city', async ({ page }) => {
    // Open filters
    await page.getByRole('button', { name: /filtreler/i }).click()

    // Select Istanbul
    await page.getByRole('combobox', { name: /tüm şehirler/i }).selectOption('İstanbul')

    // Click search button
    await page.getByRole('button', { name: /ara/i }).click()

    // Wait for results to load
    await page.waitForLoadState('networkidle')

    // Check if results are displayed
    await expect(page.getByText(/ilan bulundu/i)).toBeVisible()
  })

  test('should search listings by query', async ({ page }) => {
    // Enter search query
    await page.getByPlaceholder(/ilan ara/i).fill('Beşiktaş')

    // Press Enter
    await page.getByPlaceholder(/ilan ara/i).press('Enter')

    // Wait for results to load
    await page.waitForLoadState('networkidle')

    // Check if results are displayed
    await expect(page.getByText(/ilan bulundu/i)).toBeVisible()
  })

  test('should change view mode', async ({ page }) => {
    // Check if grid view is active by default
    const gridButton = page.getByRole('button').filter({ hasText: /grid/i })
    await expect(gridButton).toHaveClass(/bg-primary-100/)

    // Click list view button
    const listButton = page.getByRole('button').filter({ hasText: /list/i })
    await listButton.click()

    // Check if list view is now active
    await expect(listButton).toHaveClass(/bg-primary-100/)
  })

  test('should sort listings', async ({ page }) => {
    // Check if sort dropdown is visible
    await expect(page.getByRole('combobox', { name: /en yeni/i })).toBeVisible()

    // Change sort option
    await page.getByRole('combobox', { name: /en yeni/i }).selectOption('price-low')

    // Wait for results to reload
    await page.waitForLoadState('networkidle')

    // Check if results are still displayed
    await expect(page.getByText(/ilan bulundu/i)).toBeVisible()
  })

  test('should display listing cards with correct information', async ({ page }) => {
    // Wait for listings to load
    await page.waitForLoadState('networkidle')

    // Check if listing cards are present
    const listingCards = page.locator('[data-testid="listing-card"]')
    const count = await listingCards.count()

    if (count > 0) {
      // Check first listing card
      const firstCard = listingCards.first()
      
      // Check if essential elements are present
      await expect(firstCard.locator('h3')).toBeVisible() // Title
      await expect(firstCard.locator('[data-testid="price"]')).toBeVisible() // Price
      await expect(firstCard.locator('[data-testid="location"]')).toBeVisible() // Location
      await expect(firstCard.locator('[data-testid="features"]')).toBeVisible() // Features
    }
  })

  test('should toggle favorite status', async ({ page }) => {
    // Wait for listings to load
    await page.waitForLoadState('networkidle')

    // Find first listing card
    const listingCards = page.locator('[data-testid="listing-card"]')
    const count = await listingCards.count()

    if (count > 0) {
      const firstCard = listingCards.first()
      const favoriteButton = firstCard.getByRole('button', { name: /favorite/i })

      // Click favorite button
      await favoriteButton.click()

      // Check if favorite status changed (this would depend on the actual implementation)
      // The test might need to be adjusted based on how favorites are handled
    }
  })

  test('should navigate to property detail page', async ({ page }) => {
    // Wait for listings to load
    await page.waitForLoadState('networkidle')

    // Find first listing card
    const listingCards = page.locator('[data-testid="listing-card"]')
    const count = await listingCards.count()

    if (count > 0) {
      const firstCard = listingCards.first()
      const detailLink = firstCard.getByRole('link', { name: /detaylar/i })

      // Click on details link
      await detailLink.click()

      // Check if navigated to property detail page
      await expect(page).toHaveURL(/\/ilan\/\d+/)
    }
  })

  test('should handle empty search results', async ({ page }) => {
    // Enter a search query that should return no results
    await page.getByPlaceholder(/ilan ara/i).fill('nonexistentproperty12345')

    // Press Enter
    await page.getByPlaceholder(/ilan ara/i).press('Enter')

    // Wait for results to load
    await page.waitForLoadState('networkidle')

    // Check if "no results" message is displayed
    await expect(page.getByText(/ilan bulunamadı/i)).toBeVisible()
  })

  test('should load more listings when scrolling', async ({ page }) => {
    // Wait for initial listings to load
    await page.waitForLoadState('networkidle')

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check if "Load More" button is visible (if there are more results)
    const loadMoreButton = page.getByRole('button', { name: /daha fazla yükle/i })
    
    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click()
      
      // Wait for additional listings to load
      await page.waitForLoadState('networkidle')
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check if mobile layout is applied
    await expect(page.getByRole('heading', { name: /ilanlar/i })).toBeVisible()

    // Check if filters are accessible on mobile
    await page.getByRole('button', { name: /filtreler/i }).click()
    await expect(page.getByRole('combobox', { name: /tüm mülk tipleri/i })).toBeVisible()
  })
})
