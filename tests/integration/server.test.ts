import puppeteer from 'puppeteer'

let browser: puppeteer.Browser // skipcq: JS-0309
let page: puppeteer.Page // skipcq: JS-0309

beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()

  await page.goto('http://localhost:3000/endpoint?query=some-value')
})

describe('PoW page', () => {
  it('should be titled "PoW Shield"', async () => {
    expect(await page.title()).toEqual('PoW Shield')
  })

  it('should redirect to "/pow" with redirection url and query intact', () => {
    expect(page.url()).toEqual('http://localhost:3000/pow?redirect=/endpoint?query=some-value')
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
    expect(page.url()).toEqual('http://localhost:3000/endpoint?query=some-value')
    expect(await page.title()).toEqual('Example Domain')
    expect(await page.content()).toContain('Example Domain')
  })
})

afterAll(async () => {
  await browser.close()
})
