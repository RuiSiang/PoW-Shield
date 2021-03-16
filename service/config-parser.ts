import dotenv from 'dotenv'

dotenv.config()

interface Config {
  session_key: string
  waf: boolean
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
}

const config: Config = {
  session_key: process.env.SESSION_KEY || 'abcdefghijklmnop',
  waf: (process.env.WAF || 'on') == 'on',
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
  rate_limit_ip_threshold: parseInt(process.env.RATE_LIMIT_IP_THRESHOLD || '500'),
  rate_limit_ban_minutes: parseInt(process.env.RATE_LIMIT_BAN_MINUTES || '15'),
}

export default config
