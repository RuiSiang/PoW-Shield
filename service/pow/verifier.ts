import config from '../util/config-parser'
import utils from './utils'

const minNonceSize = 8
const maxNonceSize = 32
const DEFAULT_VALIDITY = config.nonce_validity

export interface IVerifierOptions {
  readonly validity?: number
}

export class Verifier {
  constructor(options: IVerifierOptions) {
    this.validity = options.validity || DEFAULT_VALIDITY
  }

  private validity: number

  public check = (
    nonce: Buffer,
    complexity: number,
    prefix: string
  ): boolean => {
    if (nonce.length < minNonceSize || nonce.length > maxNonceSize) {
      return false
    }
    const diff = utils.readTimestamp(nonce, 0) - Date.now()
    if (Math.abs(diff) > this.validity) {
      return false
    }
    const hash = utils.hash(nonce, prefix)
    if (!utils.checkComplexity(hash, complexity)) {
      return false
    }
    return true
  }
}

export default Verifier
