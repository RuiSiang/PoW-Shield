import createHash from 'create-hash'
import assert from 'minimalistic-assert'
const EMPTY_BUFFER = Buffer.alloc(0)

const allocBuffer = async (size: number) => {
  return Buffer.alloc(size)
}

const writeUInt32 = async (buffer: any, value: number, off: number) => {
  buffer.writeUInt32LE(value, off, true)
  return off + 4
}

const writeTimestamp = async (buffer: any, ts: number, off: number) => {
  const hi = (ts / 0x100000000) >>> 0
  const lo = (ts & 0xffffffff) >>> 0
  buffer.writeUInt32BE(hi, off, true)
  buffer.writeUInt32BE(lo, off + 4, true)
  return off + 8
}

const readTimestamp = async (buffer: Buffer, off: number) => {
  return buffer.readUInt32BE(off) * 0x100000000 + buffer.readUInt32BE(off + 4)
}

const hash = async (nonce: Buffer, prefix: string) => {
  const h = createHash('sha256')
  if (prefix) h.update(prefix,'hex')
  h.update(nonce)
  return h.digest()
}

const checkComplexity = async (hash: Buffer, complexity: number) => {
  assert(complexity < hash.length * 8, 'Complexity is too high')
  let off = 0
  let i: number
  for (i = 0; i <= complexity - 8; i += 8, off++) {
    if (hash[off] !== 0) return false
  }

  const mask = 0xff << (8 + i - complexity)
  return (hash[off] & mask) === 0
}

export default {
  writeTimestamp,
  writeUInt32,
  allocBuffer,
  hash,
  checkComplexity,
  readTimestamp,
  EMPTY_BUFFER,
}
