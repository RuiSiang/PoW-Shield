import Koa from 'koa'
import Router from 'koa-router'
import RateLimiter from '../service/controllers/rate-limiter'
import Blacklist from '../service/controllers/blacklist'

const router = new Router()
router.prefix('/test')

router.get('/', async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  if (ctx.query.action == 'triggerRemoveExpired') {
    const rateLimiter = RateLimiter.getInstance()
    const blacklist = Blacklist.getInstance()
    await rateLimiter.triggerRemoveExpired()
    await blacklist.triggerRemoveExpired()
  }
})

export default router
