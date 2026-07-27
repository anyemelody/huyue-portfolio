#!/usr/bin/env node
/**
 * Download all project assets listed in scripts/assets.json into
 * public/assets/<slug>/.  Run from the project root:
 *
 *     node scripts/download_assets.mjs
 *
 * Re-running skips files that already exist. Uses Node's built-in fetch
 * (Node 18+). No external deps.
 */
import { readFile, mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outRoot = join(root, 'public', 'assets')

const exists = (p) => access(p, constants.F_OK).then(() => true).catch(() => false)

function fileNameFor(url) {
  // .../media/7514a4_abc~mv2_d_1234_5678_s_2.jpg  ->  7514a4_abc.jpg-ish
  const base = url.split('/media/')[1] || url.split('/').pop()
  const ext = (base.match(/\.(png|jpg|jpeg|gif|webp|mp4|webm)/i) || ['.png'])[0].replace(/^\./, '')
  const id = base.split('~')[0].split('.')[0]
  return `${id}.${ext.toLowerCase()}`
}

const manifest = JSON.parse(await readFile(join(__dirname, 'assets.json'), 'utf8'))

let ok = 0, skip = 0, fail = 0

async function grab(slug, url) {
  const dir = join(outRoot, slug)
  await mkdir(dir, { recursive: true })
  const dest = join(dir, fileNameFor(url))
  if (await exists(dest)) { skip++; return }
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    await writeFile(dest, Buffer.from(await res.arrayBuffer()))
    ok++
    process.stdout.write(`✓ ${slug}/${fileNameFor(url)}\n`)
  } catch (e) {
    fail++
    process.stdout.write(`✗ ${slug}  ${url}  (${e.message})\n`)
  }
}

// homepage cover images first (so card covers match the old site)
if (manifest._covers) {
  for (const [slug, url] of Object.entries(manifest._covers)) await grab(slug, url)
}

for (const [slug, urls] of Object.entries(manifest)) {
  if (slug.startsWith('_') || !Array.isArray(urls) || urls.length === 0) continue
  const dir = join(outRoot, slug)
  await mkdir(dir, { recursive: true })
  for (const url of urls) {
    const dest = join(dir, fileNameFor(url))
    if (await exists(dest)) { skip++; continue }
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const buf = Buffer.from(await res.arrayBuffer())
      await writeFile(dest, buf)
      ok++
      process.stdout.write(`✓ ${slug}/${fileNameFor(url)}\n`)
    } catch (e) {
      fail++
      process.stdout.write(`✗ ${slug}  ${url}  (${e.message})\n`)
    }
  }
}
console.log(`\nDone. downloaded=${ok}  skipped(existing)=${skip}  failed=${fail}`)
console.log('Assets are in public/assets/<slug>/. Reference them as /assets/<slug>/<file> in your data files.')
