import { verbose as sqlite3, Database as DatabaseType } from 'sqlite3'

class Database {
  private static instance: Database
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  private sqliteDb: DatabaseType
  constructor() {
    this.sqliteDb = new (sqlite3().Database)(':memory:')
  }

  private tableCheck = false
  private createIfNotExist = async () => {
    const table_cmds = [
      'create table if not exists blacklist (ip text unique, expiry text)',
      'create table if not exists requests (ip text unique, expiry text, requests int)',
    ]
    let promises: Promise<any>[] = []
    table_cmds.forEach((table_cmd) => {
      promises.push(
        new Promise((resolve, reject) => {
          this.sqliteDb.run(table_cmd, (err) => {
            if (err) {
              reject(err)
            } else {
              this.tableCheck = true
              resolve(true)
            }
          })
        })
      )
    })
    return Promise.all(promises)
  }

  private sqliteQuery = async (
    query: string,
    params: string[] | undefined
  ): Promise<any[]> => {
    if (!params) {
      params = []
    }
    if (!this.tableCheck) {
      await this.createIfNotExist()
    }
    return new Promise((resolve, reject) => {
      this.sqliteDb.all(query, params, (err, rows) => {
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
