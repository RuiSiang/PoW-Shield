import Blacklist from '../../service/controllers/blacklist'

let blacklist: Blacklist

beforeAll(() => {
  blacklist = Blacklist.getInstance()
})

describe(`Blacklist`, () => {
  it('should pass ban list checking normally', async () => {
    expect(await blacklist.check('test_ip')).toBeTruthy()
  })
  it('should not pass ban list checking after banned', async () => {
    await blacklist.ban('test_ip', 0)
    expect(await blacklist.check('test_ip')).toBeFalsy()
  })
  it('should pass ban list checking after ban expired', async () => {
    await blacklist.triggerRemoveExpired()
    expect(await blacklist.check('test_ip')).toBeTruthy()
  })
})
