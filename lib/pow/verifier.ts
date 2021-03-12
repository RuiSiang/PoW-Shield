import config from '../../service/config-parser'
import utils from './utils'

const MIN_NONCE_LEN = 8
const MAX_NONCE_LEN = 32
const DEFAULT_VALIDITY = config.get()['nonce_validity']

export interface IVerifierOptions {
  readonly validity?: number
}

export class Verifier {
  constructor(options: IVerifierOptions) {
    this.validity = options.validity || DEFAULT_VALIDITY
  }

  private validity: number

  public check = async (
    nonce: Buffer,
    complexity: number,
    prefix: string
  ): Promise<boolean> => {
    if (nonce.length < MIN_NONCE_LEN) return false
    if (nonce.length > MAX_NONCE_LEN) return false
    const ts = await utils.readTimestamp(nonce, 0)
    const now = Date.now()
    if (Math.abs(ts - now) > this.validity) return false
    const hash = await utils.hash(nonce, prefix)
    if (!(await utils.checkComplexity(hash, complexity))) return false
    return true
  }
}

export default Verifier
