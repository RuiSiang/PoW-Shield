import { launch, Browser, Page } from 'puppeteer'

let browser: Browser
let page: Page

beforeEach(async () => {
  browser = await launch()
  page = await browser.newPage()

  await page.goto('http://localhost:3000')
})

describe('Auth status', () => {
  it('should be issuable', async () => {
    await page.waitForFunction('window.nonceSent == true')
    await page.waitForNavigation()
    expect(await page.title()).toEqual('Example Domain')
  }, 20000)

  it('should be revocable', async () => {
    for (let i = 0; i < 3; i++) {
      await page.goto('http://localhost:3000')
    }
    expect(await page.title()).toEqual('PoW Shield')
  })
})

describe('IP banning', () => {
  it('should be triggerable and resets after ban expires', async () => {
    await page.waitForFunction('window.nonceSent == true')
    await page.waitForNavigation()
    expect(await page.title()).toEqual('Example Domain')
    for (let i = 0; i < 4; i++) {
      await page.goto('http://localhost:3000')
    }
    expect(await page.content()).toContain('banned')
    await page.goto('http://localhost:3000/test?action=triggerRemoveExpired')
    await page.goto('http://localhost:3000')
    expect(await page.content()).not.toContain('banned')
  }, 20000)
})

afterEach(async () => {
  await browser.close()
})
