import Database from '../../service/util/database-service'

let db: Database // skipcq: JS-0309

beforeAll(() => {
  db = Database.getInstance()
  return
})

describe(`Database`, () => {
  it('should be settable', async () => {
    expect(await db.set('test', '0')).toStrictEqual('OK')
  })
  it('should be gettable', async () => {
    expect(await db.get('test')).toStrictEqual('0')
  })
  it('should be matchable', async () => {
    expect(await db.keys('t*')).toMatchObject(['test'])
  })
  it('should be incrementable', async () => {
    await db.incr('test')
    expect(await db.get('test')).toStrictEqual('1')
  })
  it('should be deletable', async () => {
    await db.del('test')
    expect(await db.get('test')).toBeFalsy()
  })
})
