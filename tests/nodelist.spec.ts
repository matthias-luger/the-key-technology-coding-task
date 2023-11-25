import { test, expect, Page } from '@playwright/test'
import { getNodesMockData } from './mockData'

test('displays loading state', async ({ page }) => {
    await page.route(process.env.VITE_GRAPHQL_URL || '', () => {})
    page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
    await expect(page.locator('.animate-spin')).toBeVisible()
})

test('loads and displays nodes', async ({ page }) => {
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(getNodesMockData(0, 10, false))
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
            body: JSON.stringify({
                data: {
                    Admin: {
                        Tree: {
                            GetContentNodes: {
                                edges: [],
                                pageInfo: {
                                    hasNextPage: false,
                                    endCursor: ''
                                }
                            }
                        }
                    }
                }
            })
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
    await page.waitForURL(`http://localhost:${process.env.TEST_SERVER_PORT}/login`)

    const loginJwt = await page.evaluate(() => localStorage.getItem('loginJwt'))
    expect(loginJwt).toBeNull()
})

test('drag and drop nodes to change order', async ({ page }) => {
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(getNodesMockData(0, 20, false))
        })
    })

    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)

    await moveNodes(page, 'Title 0', 'Title 1')

    const finalOrder = await page.$$eval('.node-list-item', nodes => nodes.map(node => node.textContent))
    expect(finalOrder[1]).toEqual('Title 0')
    expect(finalOrder[0]).toEqual('Title 1')
})

test('test if drag and drop persists after refresh', async ({ page }) => {
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(getNodesMockData(0, 20, false))
        })
    })

    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)

    await moveNodes(page, 'Title 0', 'Title 2')
    await moveNodes(page, 'Title 3', 'Title 1')
    await moveNodes(page, 'Title 1', 'Title 2')

    const expextedOrder = ['Title 3', 'Title 2', 'Title 1', 'Title 0']

    let currentOrder = await page.$$eval('.node-list-item', nodes => nodes.map(node => node.textContent))
    for (let i = 0; i < expextedOrder.length; i++) {
        expect(currentOrder[i]).toEqual(expextedOrder[i])
    }

    await page.reload()

    await page.locator('.node-list-item').nth(0).waitFor({ state: 'visible' })

    currentOrder = await page.$$eval('.node-list-item', nodes => nodes.map(node => node.textContent))
    for (let i = 0; i < expextedOrder.length; i++) {
        expect(currentOrder[i]).toEqual(expextedOrder[i])
    }
})

test('test lazy loading', async ({ page, browserName, isMobile }) => {
    // Scrolling is not supported in mobile WebKit
    if (browserName === 'webkit' && isMobile) {
        test.skip()
    }

    let requestNumber = 0
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(getNodesMockData(requestNumber * 10 + 1, (requestNumber + 1) * 10, true))
        })
        requestNumber++
    })

    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
    await page.locator('.node-list-item').nth(0).hover()

    let nodeTextContentBefore = await page.locator('.node-list-item').last().textContent()
    await scrollTillLazyLoad(page)
    let nodeTextContentAfter = await page.locator('.node-list-item').last().textContent()
    expect(parseInt(nodeTextContentBefore?.split(' ')[1] || '0')).toBeLessThan(parseInt(nodeTextContentAfter?.split(' ')[1] || '0'))

    nodeTextContentBefore = await page.locator('.node-list-item').last().textContent()
    await scrollTillLazyLoad(page)
    nodeTextContentAfter = await page.locator('.node-list-item').last().textContent()
    expect(parseInt(nodeTextContentBefore?.split(' ')[1] || '0')).toBeLessThan(parseInt(nodeTextContentAfter?.split(' ')[1] || '0'))

    nodeTextContentBefore = await page.locator('.node-list-item').last().textContent()
    await scrollTillLazyLoad(page)
    nodeTextContentAfter = await page.locator('.node-list-item').last().textContent()
    expect(parseInt(nodeTextContentBefore?.split(' ')[1] || '0')).toBeLessThan(parseInt(nodeTextContentAfter?.split(' ')[1] || '0'))
})

test('test drag and drop persist order with lazy loading', async ({ page, browserName, isMobile }) => {
    // Scrolling is not supported in mobile WebKit
    if (browserName === 'webkit' && isMobile) {
        test.skip()
    }
    let requestNumber = 0
    await page.route(process.env.VITE_GRAPHQL_URL || '', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(getNodesMockData(requestNumber * 10 + 1, (requestNumber + 1) * 10, true))
        })
        requestNumber++
    })

    await page.goto(`http://localhost:${process.env.TEST_SERVER_PORT}/nodes`)
    await page.locator('.node-list-item').nth(0).hover()
    await scrollTillLazyLoad(page)
    await scrollTillLazyLoad(page)

    await moveNodes(page, 'Title 19', 'Title 18')
    await page.waitForTimeout(1000)

    requestNumber = 0
    await page.reload()

    await page.locator('.node-list-item').nth(0).hover()
    await scrollTillLazyLoad(page)
    await scrollTillLazyLoad(page)
    const currentOrder = await page.$$eval('.node-list-item', nodes => nodes.map(node => node.textContent))

    let isStillSwitched = false
    for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i] === 'Title 19') {
            if (currentOrder[i + 1] === 'Title 18') {
                isStillSwitched = true
            }
        }
    }
    expect(isStillSwitched).toBeTruthy()
})

// This function scrolls until the layload function calls the graphql endpoint
// This is used instead of scrollIntoView because it is inconsistent between browsers and doesnt work correctly with a virtualized list
async function scrollTillLazyLoad(page: Page) {
    return new Promise<void>(resolve => {
        let interval: NodeJS.Timeout | undefined = undefined
        page.waitForResponse(process.env.VITE_GRAPHQL_URL || '').then(() => {
            clearInterval(interval)
            resolve()
        })
        interval = setInterval(async () => {
            await page.mouse.wheel(0, 1000)
        }, 500)
    })
}

async function moveNodes(page: Page, nodeTitle1: string, nodeTitle2: string) {
    const nodeToDrag = page.locator('li', { hasText: nodeTitle1 })
    const dropTarget = page.locator('li', { hasText: nodeTitle2 })
    const nodeToDragBoundingBox = await nodeToDrag.boundingBox()
    const dropTargetBoundingBox = await dropTarget.boundingBox()

    if (!nodeToDragBoundingBox || !dropTargetBoundingBox) {
        test.fail()
        return
    }

    await page.mouse.move(nodeToDragBoundingBox.x + nodeToDragBoundingBox.width / 2, nodeToDragBoundingBox.y + nodeToDragBoundingBox.height / 2, {
        steps: 50
    })
    await page.mouse.down()
    await page.waitForTimeout(500)
    await page.mouse.move(dropTargetBoundingBox.x + dropTargetBoundingBox.width / 2, dropTargetBoundingBox.y + dropTargetBoundingBox.height / 2, {
        steps: 50
    })
    await page.waitForTimeout(500)
    await page.mouse.up()
    await page.waitForTimeout(500)
}
