import createHash from 'create-hash'

const writeUInt32 = (buffer: Buffer, value: number, off: number): number => {
  buffer.writeUInt32LE(value, off)
  return off + 4
}

const writeTimestamp = (buffer: Buffer, ts: number, off: number): number => {
  const high = (ts / 0x100000000) >>> 0
  const low = (ts & 0xffffffff) >>> 0
  buffer.writeUInt32BE(high, off)
  buffer.writeUInt32BE(low, off + 4)
  return off + 8
}

const readTimestamp = (buffer: Buffer, off: number) => {
  // skipcq: JS-0377
  return buffer.readUInt32BE(off) * 0x100000000 + buffer.readUInt32BE(off + 4)
}

const hash = (nonce: Buffer, prefix: string) => {
  const h = createHash('sha256')
  if (prefix) h.update(prefix, 'hex')
  h.update(nonce)
  return h.digest()
}

const checkComplexity = (hash: Buffer, complexity: number): boolean => {
  if (complexity >= hash.length * 8) {
    throw 'Complexity is too high'
  }
  let off = 0
  let i = 0
  for (i = 0; i <= complexity - 8; i += 8, off++) {
    if (hash[off] !== 0) return false
  }

  const mask = 0xff << (8 + i - complexity)
  return (hash[off] & mask) === 0
}

export default {
  writeTimestamp,
  writeUInt32,
  hash,
  checkComplexity,
  readTimestamp,
}
