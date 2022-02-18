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
    const scanResult = waf.scan(ctx)
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
