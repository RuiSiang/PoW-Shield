import Koa from 'koa'
import Router from 'koa-router'
import moment from 'moment'
import NoSql from '../service/util/nosql'

import Pow from '../service/pow-service'
import config from '../service/util/config-parser'

const router = new Router()
const pow = new Pow()

router.prefix('/pow')

const nosql: NoSql = NoSql.getInstance()

router.get('/', async (ctx: Koa.ParameterizedContext) => {
  const { prefix } = pow.getProblem()
  await Object.assign(ctx.session, {
    difficulty: config.difficulty,
    prefix,
    assigned: moment().toISOString(),
  })
  await ctx.render('pow', {
    difficulty: config.difficulty,
    prefix,
    redirect: ctx.query.redirect,
  })
})

router.post('/', async (ctx: Koa.ParameterizedContext) => {
  if (!ctx.session) {
    return
  }
  if (await pow.parseAndVerify(ctx.request.body, ctx.session)) {
    await nosql.incrBy(
      `stats:ttl_solve_time`,
      moment().diff(moment(ctx.session.assigned), 'milliseconds')
    )
    await nosql.incr(`stats:prob_solved`)
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
