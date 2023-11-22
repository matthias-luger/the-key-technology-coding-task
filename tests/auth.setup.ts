import { expect, test } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

test('authenticate', async ({ page }) => {
    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}`)
    await page.getByLabel('E-Mail:').fill(process.env.TEST_EMAIL || '')
    await page.getByLabel('Password:').fill(process.env.TEST_PASSWORD || '')
    await page.getByRole('button', { name: 'Login' }).click()

    await page.waitForURL(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)

    const token = await page.evaluate(() => localStorage.getItem('loginJwt'))
    expect(token).toBeTruthy()

    await page.context().storageState({
        path: authFile
    })
})
