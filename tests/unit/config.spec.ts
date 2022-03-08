import config from '../../service/util/config-parser'

describe('Node env', () => {
  it('should be "test"', () => {
    expect(process.env.NODE_ENV).toStrictEqual('test')
  })
})

describe('Configuration', () => {
  it('should match test spec', () => {
    expect(config).toMatchObject({
      session_key: 'abcdefghijklmnop',
      pow: true,
      nonce_validity: 60000,
      difficulty: 5,
      backend_url: 'http://example.org',
      rate_limit: true,
      rate_limit_sample_minutes: 10,
      rate_limit_session_threshold: 2,
      rate_limit_ban_ip: true,
      rate_limit_ip_threshold: 3,
      rate_limit_ban_minutes: 10,
      waf: true,
      waf_url_exclude_rules: '',
      waf_header_exclude_rules: '14,33,80,96,100',
      waf_body_exclude_rules: '',
      ssl: false,
      ssl_cert_path: 'tests/ssl/mock-cert.pem',
      ssl_key_path: 'tests/ssl/mock-key.pem',
    })
  })
})
