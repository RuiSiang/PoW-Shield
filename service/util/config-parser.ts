import dotenv from 'dotenv'

dotenv.config()

interface Config {
  session_key: string
  pow: boolean
  nonce_validity: number
  difficulty: number
  backend_url: string
  database_host?: string
  database_port?: number
  database_password?: string
  rate_limit: boolean
  rate_limit_sample_minutes: number
  rate_limit_session_threshold: number
  rate_limit_ban_ip: boolean
  rate_limit_ip_threshold: number
  rate_limit_ban_minutes: number
  waf: boolean
  waf_url_exclude_rules: string
  waf_header_exclude_rules: string
  waf_body_exclude_rules: string
  ssl: boolean
  ssl_cert_path: string
  ssl_key_path: string
  socket: boolean
  socket_url: string
  socket_token: string
}

let config: Config // skipcq: JS-0309

if (process.env.NODE_ENV === 'test') {
  config = {
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
    socket: false,
    socket_url: 'http://localhost:6000',
    socket_token: 'test-subscription-api',
  }
} else {
  config = {
    session_key: process.env.SESSION_KEY || 'abcdefghijklmnop',
    pow: (process.env.POW || 'on') == 'on',
    nonce_validity: parseInt(process.env.NONCE_VALIDITY || '') || 60 * 1000,
    difficulty: parseInt(process.env.DIFFICULTY || '') || 13,
    backend_url: process.env.BACKEND_URL || 'http://www.example.com',
    database_host: process.env.DATABASE_HOST || '127.0.0.1',
    database_port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 6379,
    database_password: process.env.DATABASE_PASSWORD || '',
    rate_limit: (process.env.RATE_LIMIT || 'on') == 'on',
    rate_limit_sample_minutes: parseInt(
      process.env.RATE_LIMIT_SAMPLE_MINUTES || '60'
    ),
    rate_limit_session_threshold: parseInt(
      process.env.RATE_LIMIT_SESSION_THRESHOLD || '100'
    ),
    rate_limit_ban_ip: (process.env.RATE_LIMIT_BAN_IP || 'on') == 'on',
    rate_limit_ip_threshold: parseInt(
      process.env.RATE_LIMIT_IP_THRESHOLD || '500'
    ),
    rate_limit_ban_minutes: parseInt(
      process.env.RATE_LIMIT_BAN_MINUTES || '15'
    ),
    waf: (process.env.WAF || 'on') == 'on',
    waf_url_exclude_rules: process.env.WAF_URL_EXCLUDE_RULES || '',
    waf_header_exclude_rules:
      process.env.WAF_HEADER_EXCLUDE_RULES || '14,33,80,96,100',
    waf_body_exclude_rules: process.env.WAF_BODY_EXCLUDE_RULES || '',
    ssl: (process.env.SSL || 'off') == 'on',
    ssl_cert_path: process.env.SSL_CERT_PATH || 'tests/ssl/mock-cert.pem',
    ssl_key_path: process.env.SSL_KEY_PATH || 'tests/ssl/mock-key.pem',
    socket: (process.env.SOCKET || 'off') == 'on',
    socket_url: process.env.SOCKET_URL || 'http://localhost:6000',
    socket_token: process.env.SOCKET_TOKEN || 'test-subscription-api',
  }
}

export default config
