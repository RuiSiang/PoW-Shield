import { CronJob } from 'cron'
import db from '../database-service'

class Blacklist {
  constructor() {
    this.job.start()
  }
  public check = async (ip: string, session: { banned: boolean }) => {
    if (!session.banned) {
      const dbQuery = await db.queryAsync({
        sql: 'select * from blacklist where ip=?',
        values: [ip],
      })
      if (!dbQuery.length) {
        return true
      }
    }
    return false
  }
  public ban = async (ip: string, minutes?: number) => {
    minutes = minutes || 15
    await db.queryAsync({
      sql: `insert into blacklist (ip, expiry) values(?, datetime(CURRENT_TIMESTAMP, "+${minutes} minutes"))`,
      values: [ip],
    })
  }
  private removeExpired = async () => {
    await db.queryAsync({
      sql: 'delete from blacklist where expiry<datetime(CURRENT_TIMESTAMP)',
      values: [],
    })
  }
  private job = new CronJob('0 */10 * * * *', async () => {
    await this.removeExpired()
  })
}

const blacklist = new Blacklist()
export default blacklist
