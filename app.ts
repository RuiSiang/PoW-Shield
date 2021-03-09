import Koa from 'koa'
const app = new Koa()
import views from 'koa-views'
import json from 'koa-json'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import { createProxyMiddleware, Filter, Options } from 'http-proxy-middleware'
import c2k from 'koa2-connect'
import session from 'koa-generic-session'

import config from './service/config-parser'
import powRouter from './routes/pow-router'
import { waf, authorizer } from './service/firewall-service'

app.keys = [config.get()['session_key']]
app.use(
  session({
    key: 'pow-shield',
  })
)

const proxy = createProxyMiddleware(['**', '!/pow'], {
  target: config.get()['backend_url'],
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
if (config.get()['waf']) {
  app.use(waf)
}
if (config.get()['pow']) {
  app.use(powRouter.routes())
  app.use(authorizer)
}
app.use(c2k(proxy))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

export default app
