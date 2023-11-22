import { test, expect } from '@playwright/test'

test('handles login', async ({ page }) => {
    // Navigate to the page containing the login form
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}`)

    // Fill in the email and password fields
    await page.fill('#email', process.env.TEST_EMAIL || '')
    await page.fill('#password', process.env.TEST_PASSWORD || '')

    // Click the login button
    await page.click('button[type="submit"]')

    // Check that the user is redirected to the '/nodes' page after successful login
    await expect(page).toHaveURL(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
})

test('handles login error', async ({ page }) => {
    // Navigate to the page containing the login form
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}`)

    // Fill in the email and password fields with incorrect data
    await page.fill('#email', 'wrong@example.com')
    await page.fill('#password', 'wrongpassword')

    // Click the login button
    await page.click('button[type="submit"]')

    const selector = await page.waitForSelector('text=Failed to login:')
    const isVisible = await selector.isVisible()
    expect(isVisible).toBe(true)
})
