import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { createHash } from 'crypto'

function crc32(buf) {
  let c
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      }
      t[n] = c >>> 0
    }
    return t
  })())
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const crcInput = Buffer.concat([typeBuf, data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(crcInput), 0)
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function makeIcon(size) {
  const bg = hexToRgb('#6b9e8a') // sage
  const fg = hexToRgb('#f7f4ef') // warm off-white
  const r = size * 0.22 // corner radius for rounded square
  const cx = size / 2
  const cy = size / 2
  const dropR = size * 0.30 // outer radius of the droplet mark
  const holeR = size * 0.14 // inner hole radius (donut-style, echoing the glucose icon)

  const raw = Buffer.alloc(size * (1 + size * 4))

  function inRoundedSquare(x, y) {
    const nx = Math.min(Math.max(x, r), size - r)
    const ny = Math.min(Math.max(y, r), size - r)
    const dx = x - nx
    const dy = y - ny
    return dx * dx + dy * dy <= r * r
  }

  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4)
    raw[rowStart] = 0 // filter type: None
    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 4
      let color = bg
      let alpha = 255

      if (!inRoundedSquare(x + 0.5, y + 0.5)) {
        alpha = 0
      } else {
        const dx = x + 0.5 - cx
        const dy = y + 0.5 - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= dropR && dist >= holeR) {
          color = fg
        }
      }

      raw[px] = color[0]
      raw[px + 1] = color[1]
      raw[px + 2] = color[2]
      raw[px + 3] = alpha
    }
  }

  const idatData = deflateSync(raw, { level: 9 })

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const png = Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ])

  return png
}

mkdirSync('public/icons', { recursive: true })
const png192 = makeIcon(192)
const png512 = makeIcon(512)
writeFileSync('public/icons/icon-192.png', png192)
writeFileSync('public/icons/icon-512.png', png512)

console.log('icon-192.png:', png192.length, 'bytes, sha256:', createHash('sha256').update(png192).digest('hex').slice(0, 16))
console.log('icon-512.png:', png512.length, 'bytes, sha256:', createHash('sha256').update(png512).digest('hex').slice(0, 16))
