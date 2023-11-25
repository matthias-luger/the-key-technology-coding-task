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
        trace: 'on'
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
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup']
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup']
        }
    ],
    webServer: {
        command: `npx vite --port ${process.env.TEST_SERVER_PORT || 3000}`,
        port: parseInt(process.env.TEST_SERVER_PORT || '3000'),
        reuseExistingServer: true
    }
})
