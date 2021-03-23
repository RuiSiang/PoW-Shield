import { CronJob } from 'cron'
import Database from '../util/database-service'
import config from '../util/config-parser'

class Blacklist {
  private static instance: Blacklist
  public static getInstance(): Blacklist {
    if (!Blacklist.instance) {
      Blacklist.instance = new Blacklist()
    }
    return Blacklist.instance
  }

  private db: Database = Database.getInstance()
  constructor() {
    this.job.start()
  }
  public check = async (ip: string) => {
    const dbQuery = await this.db.queryAsync({
      sql: 'select * from blacklist where ip=?',
      values: [ip],
    })
    if (!dbQuery.length) {
      return true
    }
    return false || !config.rate_limit
  }
  public ban = async (ip: string, minutes: number) => {
    await this.db.queryAsync({
      sql: `insert into blacklist (ip, expiry) values(?, datetime(CURRENT_TIMESTAMP, "+${minutes} minutes"))`,
      values: [ip],
    })
  }
  private removeExpired = async () => {
    await this.db.queryAsync({
      sql: 'delete from blacklist where expiry<=datetime(CURRENT_TIMESTAMP)',
      values: [],
    })
  }
  private job = new CronJob('0 */5 * * * *', async () => {
    if (process.env.NODE_ENV !== 'test') {
      await this.removeExpired()
    }
  })
  public triggerRemoveExpired = async () => {
    if (process.env.NODE_ENV === 'test') {
      await this.removeExpired()
    }
  }
}

export default Blacklist
