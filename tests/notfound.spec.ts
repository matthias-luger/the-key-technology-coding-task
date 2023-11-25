import test, { expect } from '@playwright/test'

test('navigates to 404 page on unknown route', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/thisunknownroute`)
    await expect(page.locator('h1', { hasText: '404 - Page Not Found' })).toBeVisible()
})

test('doesnt navigate to 404 on known route', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/login`)
    await expect(page.locator('h1', { hasText: '404 - Page Not Found' })).not.toBeVisible()
})
