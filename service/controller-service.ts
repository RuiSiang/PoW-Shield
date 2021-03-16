import Koa from 'koa'
import blacklist from './controllers/blacklist'
import config from './config-parser'
import rateLimiter from './controllers/rate-limiter'

export const controller: Koa.Middleware = async function (
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) {
  if ((await blacklist.check(ctx.ip, ctx.session)) || !config.rate_limit) {
    if (!!ctx.session.authorized || !config.pow) {
      Object.assign(ctx.session, await rateLimiter.process(ctx.ip, ctx.session))
      next()
    } else {
      if (ctx.request.url == '/') {
        ctx.redirect('/pow')
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
