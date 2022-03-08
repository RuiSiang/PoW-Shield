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
      console.log(`Phalanx connected`)
    })
    this.socket.on('connect_error', (err) => {
      console.log(`Phalanx connection error: ${err.message}`)
    })
    this.socket.on('disconnect', (reason) => {
      console.log(`Phalanx disconnected: ${reason}`)
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
                  ttlreq: await this.nosql.get('stats:ttlreq')||'0',
                  ttlwaf: await this.nosql.get('stats:ttlwaf')||'0',
                })
              )
              break
          }
        }
      } catch (err) {
        console.log(err)
      }
    })
  }
  public send = (message: string) => {
    this.socket.emit('message', message)
  }
}
