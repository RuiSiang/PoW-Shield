const config = require('../config.js')

let configObj: Config = config

interface Config {
  session_key: string
  waf: boolean
  pow: boolean
  nonce_validity: number
  initial_difficulty: number
  backend_url: string
}

const getConfig = () => {
  return configObj
}

export default { get: getConfig }
