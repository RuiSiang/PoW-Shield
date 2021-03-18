import Database from '../../service/database-service'

let db: Database
const tables = [
  {
    name: 'blacklist',
    columns: ['ip', 'expiry'],
    insert_cmd:
      'insert into blacklist (ip, expiry) values("test_ip", "test_time")',
    insert_result: [{ ip: 'test_ip', expiry: 'test_time' }],
    update_cmd: 'update blacklist set expiry="test_time+1" where ip="test_ip"',
    update_result: [{ ip: 'test_ip', expiry: 'test_time+1' }],
  },
  {
    name: 'requests',
    columns: ['ip', 'expiry', 'requests'],
    insert_cmd:
      'insert into requests (ip, expiry, requests) values("test_ip", "test_time", 0)',
    insert_result: [{ ip: 'test_ip', expiry: 'test_time', requests: 0 }],
    update_cmd: 'update requests set requests=requests+1 where ip="test_ip"',
    update_result: [{ ip: 'test_ip', expiry: 'test_time', requests: 1 }],
  },
]

beforeAll(() => {
  db = Database.getInstance()
  return
})

tables.forEach((table) => {
  describe(`Database table "${table.name}"`, () => {
    it('should have specified columns', async () => {
      const pragma = await db.queryAsync({
        sql: `PRAGMA table_info(${table.name})`,
        values: [],
      })
      let sortedPragma: string[] = []
      pragma.forEach((element: { name: string }) => {
        sortedPragma.push(element.name)
      })
      table.columns.forEach((column) => {
        expect(sortedPragma).toContain(column)
      })
    })

    it('should be insertable', async () => {
      await db.queryAsync({
        sql: table.insert_cmd,
        values: [],
      })
      expect(
        await db.queryAsync({
          sql: `select * from ${table.name}`,
          values: [],
        })
      ).toMatchObject(table.insert_result)
    })

    it('should be updatable', async () => {
      await db.queryAsync({
        sql: table.update_cmd,
        values: [],
      })
      expect(
        await db.queryAsync({
          sql: `select * from ${table.name}`,
          values: [],
        })
      ).toMatchObject(table.update_result)
    })

    it('should be deletable', async () => {
      await db.queryAsync({
        sql: `delete from ${table.name}`,
        values: [],
      })
      expect(
        await db.queryAsync({
          sql: `select * from ${table.name}`,
          values: [],
        })
      ).toMatchObject([])
    })
  })
})
