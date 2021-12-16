import puppeteer from 'puppeteer'

let browser: puppeteer.Browser // skipcq: JS-0309
let page: puppeteer.Page // skipcq: JS-0309

beforeEach(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()

  await page.goto('http://localhost:3000')
})

describe('Auth status', () => {
  it('should be issuable', async () => {
    await page.waitForFunction('window.nonceSent == true')
    await page.waitForNavigation()
    expect(await page.title()).toEqual('Example Domain')
  }, 10000)

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
    for (let i = 0; i < 6; i++) {
      await page.goto('http://localhost:3000')
    }
    expect(await page.content()).toContain('banned')
    await page.goto('http://localhost:3000/test?action=triggerReset')
    const response = await page.goto('http://localhost:3000')
    expect(response.status()).toEqual(200)
    expect(await page.content()).not.toContain('banned')
  }, 20000)
})

describe('WAF', () => {
  it('should be triggered on malicious request', async () => {
    await page.waitForFunction('window.nonceSent == true')
    await page.waitForNavigation()
    expect(await page.title()).toEqual('Example Domain')
    const response = await page.goto(
      'http://localhost:3000/select column from users'
    )
    expect(response.status()).toEqual(403)
    expect(await page.content()).toContain('WAF rules')
  }, 10000)
})

afterEach(async () => {
  await browser.close()
})
