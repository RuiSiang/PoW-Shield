import Koa from 'koa'
import Blacklist from './controllers/blacklist'
import config from './util/config-parser'
import Ratelimiter from './controllers/rate-limiter'
import Waf from './controllers/waf'

export const controller: Koa.Middleware = async function (
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  const blacklist = Blacklist.getInstance()
  const rateLimiter = Ratelimiter.getInstance()
  const waf = Waf.getInstance()
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
        } else if (ctx.request.url == '/pow') {
          await next()
          return
        } else {
          ctx.redirect(`/pow?redirect=${ctx.request.url}`)
          return
        }
      }
    } else {
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

const inspect = async (ctx: Koa.ParameterizedContext) => {
  //waf placeholder
}
