import Koa from 'koa'
const app = new Koa()
import views from 'koa-views'
import json from 'koa-json'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import { createProxyMiddleware } from 'http-proxy-middleware'
import c2k from 'koa2-connect'
import session from 'koa-session-minimal'
import redisStore from 'koa-redis'
import config from './service/util/config-parser'
import powRouter from './routes/pow-router'
import testRouter from './routes/test-router'
import { controller } from './service/controller-service'

app.keys = [config.session_key]
app.use(
  session({
    key: 'pow-shield',
    cookie: {
      maxAge: 86400000,
      overwrite: true,
      httpOnly: true,
      signed: true,
      sameSite: 'strict',
    },
    store:
      process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'standalone'
        ? undefined
        : redisStore({
            host: config.database_host,
            port: config.database_port,
            password: config.database_password,
          }),
  })
)

const proxy = createProxyMiddleware(['**', '!/pow'], {
  target: config.backend_url,
  changeOrigin: true,
  ws: true,
})

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
  })
)

// logger
app.use(async (ctx, next) => {
  const start: any = new Date()
  await next()
  const ms = <any>new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// service and routes
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'standalone') {
  app.use(testRouter.routes())
}
app.use(controller)
if (config.pow) {
  app.use(powRouter.routes())
}
app.use(c2k(proxy))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

export default app
