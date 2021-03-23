import utils from './utils'

const minNonceSize = 8
const nonceSize = minNonceSize + 8

class Solver {
  public solve = async (
    complexity: number,
    prefix: string
  ): Promise<Buffer> => {
    let nonce = Buffer.alloc(nonceSize)
    while (true) {
      await this.genNonce(nonce)
      const hash = await utils.hash(nonce, prefix)
      if (await utils.checkComplexity(hash, complexity)) {
        return nonce
      }
    }
  }
  private genNonce = async (buf: Buffer) => {
    const now = Date.now()
    let off = await utils.writeTimestamp(buf, now, 0)
    const words = off + (((buf.length - off) / 4) | 0) * 4
    for (; off < words; off += 4) {
      utils.writeUInt32(buf, (Math.random() * 0x100000000) >>> 0, off)
    }
    for (; off < buf.length; off++) {
      buf[off] = (Math.random() * 0x100) >>> 0
    }
  }
}

export { Solver }
