import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

// Compresses images in public/ in place, keeping file names and formats so
// existing references (code and database rows) keep working.
// A file is only overwritten when the result is smaller.

const publicDir = path.join(process.cwd(), 'public')
const MAX_WIDTH = 1600
const LOGO_MAX_WIDTH = 512

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })

const files = walk(publicDir).filter((f) => /\.(png|jpe?g)$/i.test(f))

let before = 0
let after = 0

for (const file of files) {
  const input = fs.readFileSync(file)
  before += input.length

  const isLogo = path.basename(file).toLowerCase() === 'logo.png'
  const maxWidth = isLogo ? LOGO_MAX_WIDTH : MAX_WIDTH
  const pipeline = sharp(input).rotate().resize({ width: maxWidth, withoutEnlargement: true })

  const output = /\.png$/i.test(file)
    ? await pipeline.png({ palette: true, quality: 80, compressionLevel: 9 }).toBuffer()
    : await pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer()

  if (output.length < input.length) {
    fs.writeFileSync(file, output)
    after += output.length
  } else {
    after += input.length
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
console.log(`Optimized ${files.length} images: ${mb(before)} MB -> ${mb(after)} MB`)
