import { test, expect } from '@playwright/test'
import { getNodesMockData } from './mockData'

test('displays loading state', async ({ page }) => {
    page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
    await page.locator('.animate-spin').waitFor({ state: 'visible' })
})

test('loads and displays nodes', async ({ page }) => {
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(getNodesMockData(8))
        })
    })

    page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
    await page.waitForResponse(process.env.VITE_GRAPHQL_URL || '')

    await expect(page.getByText('Content Nodes')).toBeVisible()
    await expect(await page.locator('.node-list li').count()).toBeGreaterThan(1)
})

test('displays no nodes message', async ({ page }) => {
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(getNodesMockData(0))
        })
    })

    page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)

    await page.waitForResponse(process.env.VITE_GRAPHQL_URL || '')

    await page.getByText('No nodes found').waitFor({ state: 'visible' })
})

test('displays error message', async ({ page }) => {
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
                errors: [
                    {
                        message: 'Failed to load nodes'
                    }
                ]
            })
        })
    })

    page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)

    await page.waitForResponse(process.env.VITE_GRAPHQL_URL || '')

    await page.getByText('Failed to load nodes').waitFor({ state: 'visible' })
})

test('successfully logout', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
    await page.locator('button', { hasText: 'Logout' }).click()
    await page.waitForURL(`http://localhost:${process.env.TEST_SERVER_PORT}/`)

    const loginJwt = await page.evaluate(() => localStorage.getItem('loginJwt'))
    expect(loginJwt).toBeNull()
})
