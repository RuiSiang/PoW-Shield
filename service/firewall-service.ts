import Koa from 'koa'

export const authorizer = async (
  ctx: Koa.ParameterizedContext,
  next: Koa.Next
) => {
  if (!!ctx.session.authorized) {
    await next()
  } else {
    if (ctx.request.url == '/') {
      ctx.redirect('/pow')
    } else {
      ctx.redirect(`/pow?redirect=${ctx.request.url}`)
    }
  }
}

export const waf = async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  //placeholder
  await next()
}
