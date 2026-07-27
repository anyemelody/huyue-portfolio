// Unified project registry keyed by slug — combines Highlight (flagships) + Journey (eras),
// and attaches the image gallery (built from keys -> public/assets folders).
import { eras } from './eras.js'
import { flagships } from './flagships.js'
import { galleries } from './galleries.js'
import { projectStories } from './projectStories.js'

function gallery(keys = []) {
  return keys.flatMap((k) => galleries[k] || [])
}

const list = []

// flagships (Highlight Work)
flagships.forEach((f) => {
  list.push({
    slug: f.slug,
    name: f.title,
    era: 'now · GenAI Engineer',
    cover: f.cover || null,
    video: f.video || null,
    hue: f.hue,
    depth: f.depth || 'full',
    detail: {
      medium: f.cat,
      body: f.desc,
      arch: f.arch,
      role: (f.role || '').replace(/<[^>]+>/g, ''),
      tools: f.stack,
      stack: f.stack,
      links: f.links,
      metrics: f.metrics,
      badges: f.badges,
    },
    story: projectStories[f.slug] || null,
    images: (f.images && f.images.length) ? f.images : gallery(f.keys),
  })
})

// era projects (Journey)
eras.forEach((e) => {
  e.projects.forEach((p) => {
    list.push({
      slug: p.slug,
      name: p.name,
      era: `${e.years} · ${e.title}`,
      cover: p.img || null,
      hue: p.hue,
      depth: p.depth || 'light',
      detail: p.detail || {},
      story: projectStories[p.slug] || null,
      images: gallery(p.keys),
    })
  })
})

export const projects = list
export const bySlug = Object.fromEntries(list.map((p) => [p.slug, p]))
