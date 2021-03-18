import config from '../../service/config-parser'

describe('Node env', () => {
  it('should be "test"', async () => {
    expect(process.env.NODE_ENV).toStrictEqual('test')
  })
})

describe('Configuration', () => {
  it('should match test spec', async () => {
    expect(config).toMatchObject({
      session_key: 'abcdefghijklmnop',
      waf: true,
      pow: true,
      nonce_validity: 60000,
      initial_difficulty: 13,
      backend_url: 'http://example.org',
      rate_limit: true,
      rate_limit_sample_minutes: 0,
      rate_limit_session_threshold: 2,
      rate_limit_ban_ip: true,
      rate_limit_ip_threshold: 3,
      rate_limit_ban_minutes: 0,
    })
  })
})
