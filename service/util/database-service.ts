import config from './config-parser'
import redis, { Redis } from 'ioredis'
import redisMock from 'ioredis-mock'

class Database {
  private static instance: Database
  public static getInstance() {
    if (!Database.instance) {
      try {
        Database.instance = new Database()
      } catch (err) {
        // skipcq: JS-0002
        console.log('Redis error, please check redis server status')
      }
    }
    return Database.instance
  }

  private dbInstance: Redis
  constructor() {
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'standalone'
    ) {
      this.dbInstance = new redisMock()
    } else {
      this.dbInstance = new redis({
        host: config.database_host,
        port: config.database_port,
      })
    }
  }
  public get = async (key: string) => {
    return await this.dbInstance.get(key)
  }
  public set = async (
    key: string,
    value: string,
    setexpr?: boolean,
    exprTime?: number
  ) => {
    if (setexpr) {
      return await this.dbInstance.set(key, value, 'EX', exprTime, 'NX')
    } else {
      return await this.dbInstance.set(key, value, 'NX')
    }
  }
  public incr = async (key: string) => {
    await this.dbInstance.incr(key)
  }
  public del = async (key: string) => {
    await this.dbInstance.del(key)
  }
  public keys = async (pattern: string) => {
    return await this.dbInstance.keys(pattern)
  }
}

export default Database
