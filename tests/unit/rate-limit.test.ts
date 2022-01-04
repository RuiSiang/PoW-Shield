import RateLimiter from '../../service/controllers/rate-limiter'

let ratelimiter: RateLimiter // skipcq: JS-0309

beforeAll(() => {
  ratelimiter = RateLimiter.getInstance()
})

describe(`Ratelimiter`, () => {
  it('should increase request count by 1 every time', async () => {
    const result = await ratelimiter.process('test_ip', {
      requests: 0,
      timestamp: 'Sun Jan 01 2090 00:00:00 GMT-0000',
      authorized: true,
    })
    expect(result).toMatchObject({
      requests: 1,
      timestamp: 'Sun Jan 01 2090 00:00:00 GMT-0000',
      authorized: true,
    })
  })

  it('should trigger auth token revoke when threshold reached', async () => {
    const result = await ratelimiter.process('test_ip', {
      requests: 2,
      timestamp: 'Sun Jan 01 2090 00:00:00 GMT-0000',
      authorized: true,
    })
    expect(result.requests).toEqual(1)
    expect(result.authorized).toEqual(false)
  })

  it('should reset statistics when sample time exceeds', async () => {
    const result = await ratelimiter.process('test_ip', {
      requests: 2,
      timestamp: 'Sun Jan 01 2000 00:00:00 GMT-0000',
      authorized: true,
    })
    await ratelimiter.triggerReset()
    expect(result.authorized).toEqual(true)
  })
})
