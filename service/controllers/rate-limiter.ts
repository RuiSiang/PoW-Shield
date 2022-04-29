import moment from 'moment'
import NoSql from '../util/nosql'
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

  private nosql: NoSql = NoSql.getInstance()
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
    if ((await this.getStat(ip)) >= config.rate_limit_ip_threshold) {
      if (config.rate_limit_ban_ip) {
        await this.blacklist.ban(ip, config.rate_limit_ban_minutes)
      }
    }
    session.requests++
    await this.incrStat(ip)
    return {
      requests: session.requests,
      timestamp: session.timestamp,
      authorized: session.authorized,
    }
  }

  private incrStat = async (ip: string) => {
    await this.nosql.incr(`req:${ip}`)
    await this.nosql.incr(`stats:legit_req`)
  }

  private getStat = async (ip: string) => {
    const reqCnt = await this.nosql.get(`req:${ip}`)

    if (reqCnt === null) {
      return 0
    } else {
      return parseInt(reqCnt)
    }
  }

  public triggerReset = async () => {
    if (process.env.NODE_ENV === 'test') {
      const reqKeys = await this.nosql.keys('req:*')
      for (let i = 0; i < reqKeys.length; i++) {
        await this.nosql.del(reqKeys[i])
      }
    }
  }
}

export default RateLimiter
