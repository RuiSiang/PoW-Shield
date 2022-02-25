import NoSql from '../util/nosql'
import config from '../util/config-parser'

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
    const blk = await this.nosql.get(`blk:${ip}`)
    if (blk!='1') {
      return true
    }
    return false || !config.rate_limit
  }
  public ban = async (ip: string, minutes: number) => {
    await this.nosql.set(`blk:${ip}`, '1', true, minutes * 60)
  }
  public triggerReset = async () => {
    if (process.env.NODE_ENV === 'test') {
      const blkKeys = await this.nosql.keys('blk:*')
      for (let i = 0; i < blkKeys.length; i++) {
        await this.nosql.del(blkKeys[i])
      }
    }
  }
}

export default Blacklist
