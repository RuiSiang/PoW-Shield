import app from '../app'
import Debug from 'debug'
import http from 'http'
const debug = Debug('demo:server')

const port: number = parseInt(process.env.PORT || '3000')
const server: http.Server = http.createServer(app.callback())

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function onError(error: any) { // skipcq: JS-0323
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind =
    typeof port === 'string'
      ? `Pipe ${port as string}`
      : `Port ${port.toString()}`
  switch (error.code) {
    case 'EACCES':
      // skipcq: JS-0002
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      // skipcq: JS-0002
      console.error(`${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}
function onListening() {
  const addr = server.address()
  if (addr) {
    const bind =
      typeof addr === 'string'
        ? `pipe ${addr as string}`
        : `port ${<string>addr.port}`
    debug('Listening on ' + bind)
  }
}
