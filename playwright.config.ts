import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })
dotenv.config({ path: './.env.local' })

export default defineConfig({
    fullyParallel: true,
    testDir: './tests',
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    },
    projects: [
        {
            name: 'setup',
            testMatch: '**/tests/**/*.setup.ts'
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup']
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup']
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup']
        }

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],
    webServer: {
        command: `npx vite --port ${process.env.TEST_SERVER_PORT || 3000}`,
        port: parseInt(process.env.TEST_SERVER_PORT || '3000'),
        reuseExistingServer: !process.env.CI
    }
})
