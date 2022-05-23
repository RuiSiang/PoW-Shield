import { io, Socket } from 'socket.io-client'
import config from './config-parser'
import NoSql from './nosql'

export default class Client {
  private static instance: Client
  private nosql: NoSql = NoSql.getInstance()

  public static getInstance() {
    if (!Client.instance) {
      try {
        Client.instance = new Client()
      } catch (err) {
        // skipcq: JS-0002
        console.log('Socket init error')
      }
    }
    return Client.instance
  }
  private socket: Socket
  constructor() {
    this.socket = io(config.socket_url, {
      query: { token: config.socket_token },
    })

    this.socket.on('connect', () => {
      // skipcq: JS-0002
      console.log(`Phalanx connected`)
    })
    this.socket.on('connect_error', (err) => {
      // skipcq: JS-0002
      console.log(`Phalanx connection error: ${err.message}`)
    })
    this.socket.on('disconnect', () => {
      // skipcq: JS-0002
      console.log(`Phalanx disconnected`)
    })

    this.socket.on('message', async (message: string) => {
      try {
        const obj = JSON.parse(message)
        if (obj.method) {
          switch (obj.method) {
            case 'set_config':
              config[obj.arguments[0]] = obj.arguments[1]
              break
            case 'fetch_stats':
              this.send(
                JSON.stringify({
                  method: 'update_stats',
                  arguments: [
                    (await this.nosql.get('stats:legit_req')) || '0', //legit_req
                    (await this.nosql.get('stats:ttl_req')) || '0', //ttl_req
                    (await this.nosql.get('stats:bad_nonce')) || '0', //bad_nonce
                    (await this.nosql.get('stats:ttl_waf')) || '0', //ttl_waf
                  ],
                })
              )
              break
            case 'add_whitelist':
              await this.nosql.setNX(`wht:${obj.arguments[0]}`, '1')
              break
            case 'remove_whitelist':
              await this.nosql.del(`wht:${obj.arguments[0]}`)
              break
            case 'ban':
              await this.nosql.setNX(
                `ban:${obj.arguments[0]}`,
                '1',
                true,
                obj.arguments[1]
              )
              break
            case 'update_model':
              //TODO
              break
          }
        }
      } catch (err) {
        // skipcq: JS-0002
        console.log(err)
      }
    })
  }
  public send = (message: string): void => {
    this.socket.emit('message', message)
  }
}
