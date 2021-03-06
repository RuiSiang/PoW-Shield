import Waf from '../../service/controllers/waf'

let waf: Waf

beforeAll(() => {
  waf = Waf.getInstance()
})

describe(`WAF`, () => {
  it('should detect malicious string', async () => {
    expect(await waf.test('select column from database', [])).toEqual('116')
  })
  it('should return first rule triggered', async () => {
    expect(await waf.test('select column from database where column like %asdf%', [])).toEqual('37')
  })
  it('should ignore malicious string if excluded', async () => {
    expect(await waf.test('select column from database', [116])).toEqual(0)
  })
})
