import Waf from '../../service/controllers/waf'

let waf: Waf // skipcq: JS-0309

beforeAll(() => {
  waf = Waf.getInstance()
})

describe(`WAF`, () => {
  it('should detect malicious string', () => {
    expect(waf.test('select column from database', [])).toEqual('116')
  })
  it('should return first rule triggered', () => {
    expect(
      waf.test('select column from database where column like %asdf%', [])
    ).toEqual('37')
  })
  it('should ignore malicious string if excluded', () => {
    expect(waf.test('select column from database', [116])).toEqual(0)
  })
})
