import utils from './utils'

const MIN_NONCE_SIZE = 8
const NONCE_SIZE = MIN_NONCE_SIZE + 8

class Solver {
  public solve = async (
    complexity: number,
    prefix: string
  ): Promise<Buffer> => {
    let nonce = await utils.allocBuffer(NONCE_SIZE)
    for (;;) {
      await this._genNonce(nonce)
      const hash = await utils.hash(nonce, Buffer.from(prefix, 'hex'))
      if (await utils.checkComplexity(hash, complexity)) {
        return nonce
      }
    }
  }
  private _genNonce = async (buf) => {
    const now = Date.now()
    let off = await utils.writeTimestamp(buf, now, 0)
    const words = off + (((buf.length - off) / 4) | 0) * 4
    for (; off < words; off += 4)
      utils.writeUInt32(buf, (Math.random() * 0x100000000) >>> 0, off)
    for (; off < buf.length; off++) buf[off] = (Math.random() * 0x100) >>> 0
  }
}

export default Solver
