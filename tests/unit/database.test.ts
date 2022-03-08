import NoSql from '../../service/util/nosql'

let nosql: NoSql // skipcq: JS-0309

beforeAll(() => {
  nosql = NoSql.getInstance()
  return
})

describe(`NoSql`, () => {
  it('should be settable', async () => {
    expect(await nosql.setNX('test', '0')).toStrictEqual('OK')
  })
  it('should be gettable', async () => {
    expect(await nosql.get('test')).toStrictEqual('0')
  })
  it('should be matchable', async () => {
    expect(await nosql.keys('t*')).toMatchObject(['test'])
  })
  it('should be incrementable', async () => {
    await nosql.incr('test')
    expect(await nosql.get('test')).toStrictEqual('1')
  })
  it('should be deletable', async () => {
    await nosql.del('test')
    expect(await nosql.get('test')).toBeFalsy()
  })
})
