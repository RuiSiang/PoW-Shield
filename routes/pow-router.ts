import Koa from 'koa'
import Router from 'koa-router'

import Pow from '../service/pow-service'
import config from '../service/util/config-parser'

const router = new Router()
const pow = new Pow(config.initial_difficulty)

router.prefix('/pow')

router.get('/', async (ctx: Koa.ParameterizedContext) => {
  const { difficulty, prefix } = pow.getProblem()
  await Object.assign(ctx.session, { difficulty, prefix })
  await ctx.render('pow', {
    difficulty,
    prefix,
    redirect: ctx.query.redirect,
  })
})

router.post('/', async (ctx: Koa.ParameterizedContext) => {
  if (!ctx.session) {
    return
  }
  if (await pow.parseAndVerify(ctx.request.body, ctx.session)) {
    ctx.session.authorized = true
    ctx.status = 200
  } else {
    await Object.assign(ctx.session, {
      difficulty: null,
      prefix: null,
    })
    ctx.status = 401
  }
})

export default router
