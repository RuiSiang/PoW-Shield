import NoSql from '../util/nosql'
import config from '../util/config-parser'
import Client from '../util/socket'

class Blacklist {
  private static instance: Blacklist
  public static getInstance(): Blacklist {
    if (!Blacklist.instance) {
      Blacklist.instance = new Blacklist()
    }
    return Blacklist.instance
  }

  private nosql: NoSql = NoSql.getInstance()
  public check = async (ip: string) => {
    const ban = await this.nosql.get(`ban:${ip}`)
    if (ban != '1') {
      return true
    }
    return false || !config.rate_limit
  }
  public ban = async (ip: string, minutes: number) => {
    await this.nosql.setNX(`ban:${ip}`, '1', true, minutes * 60)
    if (config.socket) {
      Client.getInstance().send(
        JSON.stringify({ method: 'phlx_ban_ip', arguments: [ip, minutes * 60] })
      )
    }
  }
  public triggerReset = async () => {
    if (process.env.NODE_ENV === 'test') {
      const banKeys = await this.nosql.keys('ban:*')
      for (let i = 0; i < banKeys.length; i++) {
        await this.nosql.del(banKeys[i])
      }
    }
  }
}

export default Blacklist
