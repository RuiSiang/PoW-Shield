import dotenv from 'dotenv'

dotenv.config()

interface Config {
  session_key: string
  waf: boolean
  pow: boolean
  nonce_validity: number
  initial_difficulty: number
  backend_url: string
}

const getConfig = (): Config => {
  return {
    session_key: process.env.SESSION_KEY || 'abcdefghijklmnop',
    waf: process.env.WAF == 'on' || true,
    pow: process.env.POW == 'on' || true,
    nonce_validity: parseInt(process.env.NONCE_VALIDITY || '') || 60 * 1000,
    initial_difficulty: parseInt(process.env.INITIAL_DIFFICULTY || '') || 13,
    backend_url: process.env.BACKEND_URL || 'http://www.example.com',
  }
}

export default { get: getConfig }
