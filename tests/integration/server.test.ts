import { launch, Browser, Page } from 'puppeteer'

let browser: Browser
let page: Page

beforeAll(async () => {
  browser = await launch()
  page = await browser.newPage()

  await page.goto('http://localhost:3000')
})

describe('PoW page', () => {
  it('should be titled "PoW Shield"', async () => {
    expect(await page.title()).toEqual('PoW Shield')
  })

  it('should redirect to "/pow"', async () => {
    expect(page.url()).toEqual('http://localhost:3000/pow')
  })

  it('should contain "Ray ID"', async () => {
    expect(await page.content()).toMatch(/Ray ID\: [0-9a-f]+\-[0-9]+/)
  })
})

describe('PoW nonce submission', () => {
  it('should pass verification', async () => {
    await page.waitForFunction('window.nonceSent == true')
    const responseStatus = await page.evaluate('window.responseStatus')
    expect(responseStatus).toEqual(200)
  }, 10000)

  it('should receive auth cookie', async () => {
    const [cookies] = await page.cookies()
    expect(cookies).toBeDefined()
  })
})

describe('PoW proxy', () => {
  it('should now proxy traffic to/from "example.org"', async () => {
    await page.waitForNavigation()
    expect(page.url()).toEqual('http://localhost:3000/')
    expect(await page.title()).toEqual('Example Domain')
    expect(await page.content()).toContain('Example Domain')
  })
})

afterAll(async () => {
  await browser.close()
})
