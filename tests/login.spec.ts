import { test, expect } from '@playwright/test'

test('handles login', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}`)

    await page.fill('#email', process.env.TEST_EMAIL || '')
    await page.fill('#password', process.env.TEST_PASSWORD || '')

    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
})

test('handles login error', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}`)

    await page.fill('#email', 'wrong@example.com')
    await page.fill('#password', 'wrongpassword')

    await page.click('button[type="submit"]')

    const selector = await page.waitForSelector('text=Failed to login:')
    const isVisible = await selector.isVisible()
    expect(isVisible).toBe(true)
})

test('check if email is required', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/login`)

    await page.fill('#password', 'Test1234!')
    await page.click('button[type="submit"]')

    await expect(page.locator('#email')).toBeFocused()
    expect(page.url()).toBe(`http://localhost:${process.env.TEST_SERVER_PORT}/login`)
    await expect(page.locator('text=Failed to login:')).not.toBeVisible()
})

test('check if password is required', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/login`)

    await page.fill('#email', 'test@example.com')
    await page.click('button[type="submit"]')

    await expect(page.locator('#password')).toBeFocused()
    expect(page.url()).toBe(`http://localhost:${process.env.TEST_SERVER_PORT}/login`)
    await expect(page.locator('text=Failed to login:')).not.toBeVisible()
})
