import dotenv from 'dotenv'

dotenv.config()

interface Config {
  session_key: string
  pow: boolean
  nonce_validity: number
  initial_difficulty: number
  backend_url: string
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
}

let config: Config

if (process.env.NODE_ENV === 'test') {
  config = {
    session_key: 'abcdefghijklmnop',
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
    waf: true,
    waf_url_exclude_rules: '',
    waf_header_exclude_rules: '14,33,80,96,100',
    waf_body_exclude_rules: '',
  }
} else {
  config = {
    session_key: process.env.SESSION_KEY || 'abcdefghijklmnop',
    pow: (process.env.POW || 'on') == 'on',
    nonce_validity: parseInt(process.env.NONCE_VALIDITY || '') || 60 * 1000,
    initial_difficulty: parseInt(process.env.INITIAL_DIFFICULTY || '') || 13,
    backend_url: process.env.BACKEND_URL || 'http://www.example.com',
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
    waf_header_exclude_rules: process.env.WAF_HEADER_EXCLUDE_RULES || '14,33,80,96,100',
    waf_body_exclude_rules: process.env.WAF_BODY_EXCLUDE_RULES || '',
  }
}

export default config
