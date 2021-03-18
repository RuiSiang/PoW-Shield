import Koa from 'koa'
import Blacklist from './controllers/blacklist'
import config from './config-parser'
import Ratelimiter from './controllers/rate-limiter'

export const controller: Koa.Middleware = async function (
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  const blacklist = Blacklist.getInstance()
  const rateLimiter = Ratelimiter.getInstance()
  if ((await blacklist.check(ctx.ip)) || !config.rate_limit) {
    if (!!ctx.session.authorized || !config.pow) {
      if (config.rate_limit) {
        await Object.assign(
          ctx.session,
          await rateLimiter.process(ctx.ip, ctx.session)
        )
      }
      next()
    } else {
      console.log(ctx.request.url)
      if (ctx.request.url == '/') {
        ctx.redirect('/pow')
      } else if (ctx.request.url == '/pow') {
        await next()
      } else {
        ctx.redirect(`/pow?redirect=${ctx.request.url}`)
      }
    }
  } else {
    ctx.status = 403
    await ctx.render('banned')
  }
}

const inspect = async (ctx: Koa.ParameterizedContext) => {
  //waf placeholder
}
