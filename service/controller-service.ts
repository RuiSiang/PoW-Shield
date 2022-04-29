import Koa from 'koa'
import Blacklist from './controllers/blacklist'
import config from './util/config-parser'
import Ratelimiter from './controllers/rate-limiter'
import Waf from './controllers/waf'
import NoSql from './util/nosql'

const nosql: NoSql = NoSql.getInstance()
const uuidTest = new RegExp(
  '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
)

export const controller: Koa.Middleware = async function (
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  if (ctx.query.pow_token && uuidTest.test(ctx.query.pow_token as string)) {
    if (await nosql.get(`wht:${ctx.query.pow_token}`)) {
      next()
      return
    }
  }
  if (
    ctx.headers['PoW-Token'] &&
    uuidTest.test(ctx.headers['PoW-Token'] as string)
  ) {
    if (await nosql.get(`wht:${ctx.headers['PoW-Token']}`)) {
      next()
      return
    }
  }
  const blacklist = Blacklist.getInstance()
  const rateLimiter = Ratelimiter.getInstance()
  const waf = Waf.getInstance()
  await nosql.incr(`stats:ttl_req`)
  if (await blacklist.check(ctx.ip)) {
    const scanResult = await waf.scan(ctx)
    if (!scanResult) {
      if (!!ctx.session.authorized || !config.pow) {
        if (config.rate_limit) {
          await Object.assign(
            ctx.session,
            await rateLimiter.process(ctx.ip, ctx.session)
          )
        }
        next()
        return
      } else {
        if (ctx.request.url == '/') {
          ctx.redirect('/pow')
          return
        } else if (RegExp(`^\/pow`).test(ctx.request.url)) {
          await next()
          return
        } else {
          ctx.redirect(`/pow?redirect=${ctx.request.url as string}`)
          return
        }
      }
    } else {
      // skipcq: JS-0002
      console.log(
        `Rule ${scanResult.id}: "${scanResult.cmt}" in category "${
          scanResult.type
        }" has been triggered by request ${
          scanResult.location
        } at ${new Date().toISOString()}`
      )
      ctx.status = 403
      await ctx.render('waf')
      return
    }
  }
  ctx.status = 403
  await ctx.render('banned')
}
