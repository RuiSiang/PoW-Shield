import Koa from 'koa'
import Router from 'koa-router'
import rateLimiter from '../service/controllers/rate-limiter'
import blacklist from '../service/controllers/blacklist'

const router = new Router()
router.prefix('/test')

router.get('/', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  if (ctx.query.action == 'triggerRemoveExpired') {
    await rateLimiter.triggerRemoveExpired()
    await blacklist.triggerRemoveExpired()
  }
})

export default router
