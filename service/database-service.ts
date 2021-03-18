import { verbose as sqlite3 } from 'sqlite3'

class Database {
  private static instance: Database
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  private sqliteDb: any
  constructor() {
    this.sqliteDb = new (sqlite3().Database)(':memory:')
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
export default Database
