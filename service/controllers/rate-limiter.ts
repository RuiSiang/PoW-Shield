import moment from 'moment'
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
    await this.db.set(
      `req-${ip}`,
      '0',
      true,
      config.rate_limit_sample_minutes * 60
    )
    await this.db.incr(`req-${ip}`)
  }

  private get = async (ip: string) => {
    const reqCnt = await this.db.get(`req-${ip}`)

    if (reqCnt === null) {
      return 0
    } else {
      return parseInt(reqCnt)
    }
  }
  public triggerReset = async () => {
    if (process.env.NODE_ENV === 'test') {
      const reqKeys = await this.db.keys('req-*')
      for (let i = 0; i < reqKeys.length; i++) {
        await this.db.del(reqKeys[i])
      }
    }
  }
}

export default RateLimiter
