import moment from 'moment'
import { CronJob } from 'cron'
import Database from '../util/database-service'
import Blacklist from './blacklist'
import config from '../util/config-parser'

class RateLimiter {
  private static instance: RateLimiter
  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  private db: Database = Database.getInstance()
  private blacklist: Blacklist = Blacklist.getInstance()
  constructor() {
    this.job.start()
  }
  public process = async (
    ip: string,
    session: {
      requests: number
      timestamp: string
      authorized: boolean
    }
  ) => {
    if (!session.requests) {
      session.requests = 0
    }
    if (!session.timestamp) {
      session.timestamp = moment().toString()
    }
    if (
      moment(new Date(session.timestamp)).add(
        config.rate_limit_sample_minutes,
        'minutes'
      ) < moment()
    ) {
      session.requests = 0
      session.timestamp = moment().toString()
    }
    if (session.requests >= config.rate_limit_session_threshold) {
      session.requests = 0
      session.timestamp = moment().toString()
      session.authorized = false
    }
    if ((await this.get(ip)) >= config.rate_limit_ip_threshold) {
      if (config.rate_limit_ban_ip) {
        await this.blacklist.ban(ip, config.rate_limit_ban_minutes)
      }
    }
    session.requests++
    await this.add(ip)
    return {
      requests: session.requests,
      timestamp: session.timestamp,
      authorized: session.authorized,
    }
  }
  private add = async (ip: string) => {
    await this.db.queryAsync({
      sql: `insert into requests (ip, expiry, requests) values(?, datetime(CURRENT_TIMESTAMP, "+${config.rate_limit_sample_minutes} minutes"), 0) on conflict(ip) do update set requests=requests+1`,
      values: [ip],
    })
  }

  private get = async (ip: string) => {
    const dbQuery = await this.db.queryAsync({
      sql: 'select requests from requests where ip=?',
      values: [ip],
    })
    if (!dbQuery.length) {
      return 0
    } else {
      return dbQuery[0].requests
    }
  }
  private removeExpired = async () => {
    await this.db.queryAsync({
      sql: 'delete from requests where expiry<=datetime(CURRENT_TIMESTAMP)',
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

export default RateLimiter
