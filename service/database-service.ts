import { verbose as sqlite3 } from 'sqlite3'

class Database {
  private sqliteDb = new (sqlite3().Database)(':memory:')
  constructor() {
    this.sqliteDb.run(
      'create table if not exists blacklist (ip text unique, expiry text)'
    )
    this.sqliteDb.run(
      'create table if not exists requests (ip text unique, expiry text, requests int)'
    )
  }

  private sqliteQuery = async (
    query: string,
    params: string[] | undefined
  ): Promise<any[]> => {
    if (!params) {
      params = []
    }
    const that = this
    return new Promise((resolve, reject) => {
      that.sqliteDb.all(query, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  public queryAsync = async (data: { sql: string; values: string[] }) => {
    return await this.sqliteQuery(data.sql, data.values)
  }
}
const database = new Database()
export default database
