import Blacklist from '../../service/controllers/blacklist'

let blacklist: Blacklist // skipcq: JS-0309

beforeAll(() => {
  blacklist = Blacklist.getInstance()
})

describe(`Blacklist`, () => {
  it('should pass ban list checking normally', async () => {
    expect(await blacklist.check('test_ip')).toBeTruthy()
  })
  it('should not pass ban list checking after banned', async () => {
    await blacklist.ban('test_ip', 10)
    expect(await blacklist.check('test_ip')).toBeFalsy()
  })
  it('should pass ban list checking after ban expired', async () => {
    await blacklist.triggerReset()
    expect(await blacklist.check('test_ip')).toBeTruthy()
  })
})
