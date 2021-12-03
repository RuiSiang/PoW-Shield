import Koa from 'koa'
import Router from 'koa-router'
import RateLimiter from '../service/controllers/rate-limiter'
import Blacklist from '../service/controllers/blacklist'

const router = new Router()
router.prefix('/test')

router.get('/', async (ctx: Koa.ParameterizedContext, ) => {
  if (ctx.query.action == 'triggerReset') {
    const rateLimiter = RateLimiter.getInstance()
    const blacklist = Blacklist.getInstance()
    await rateLimiter.triggerReset()
    await blacklist.triggerReset()
  }
})

export default router
