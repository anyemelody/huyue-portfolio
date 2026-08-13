import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { FaGithub, FaInstagram, FaLinkedinIn, FaVimeoV, FaYoutube } from 'react-icons/fa6'

/*
 * 3D scroll gallery — faithful port of design reference `3d-gallery-v2.html`.
 * Artworks hang as silk-scroll canvases in a dark endless hall; the camera
 * dollies forward on scroll, easing to a fixed waypoint in front of each work.
 */

// Works in design order. `video` plays in an overlay; `href` opens page/sketch.
const WORKS = [
  { title: 'Lan Sketch', meta: 'Creative Coding', href: 'https://anyemelody.github.io/LanSketch/', src: '/assets/creative-coding/lan_flower_sketch.gif' },
  { title: 'Mei Sketch', meta: 'Creative Coding', href: 'https://anyemelody.github.io/MeiSketch/', src: '/assets/creative-coding/mei_sketch.gif' },
  { title: 'Lotus Love', meta: 'VFX · Shader', video: '/assets/lotus-love/luotusImproveShader.mp4', src: '/assets/lotus-love/cover_image.gif' },
  { title: 'Green Hairy Grass · Circle', meta: 'Creative Coding', href: 'https://anyemelody.github.io/GreenHairyGrass/circle.html', src: '/assets/creative-coding/green_hair_grass_circle.gif' },
  { title: 'Animal Party', meta: 'VFX · Shader', video: '/assets/animal-party/Animal Party.mp4', href: '/work/animal-party', src: '/assets/animal-party/cover.gif' },
  { title: 'Garden', meta: 'Creative Coding', href: 'https://anyemelody.github.io/Garden/', src: '/assets/creative-coding/garden.png' },
  { title: 'Green Hairy Grass · Landscape', meta: 'Creative Coding', href: 'https://anyemelody.github.io/GreenHairyGrass/landscape.html', src: '/assets/creative-coding/green_hair_grass_landscape.gif' },
  { title: 'Dreamy Galaxy', meta: 'VFX · Interactive', video: '/assets/dreamy-galaxy/Galaxy.mp4', href: '/work/dreamy-galaxy', src: '/assets/dreamy-galaxy/cover.png' },
  { title: 'Sound Emotion', meta: 'Sound Visualization', video: 'https://vimeo.com/164668057', href: 'https://vimeo.com/164668057', src: '/assets/sound-emotion/cover.png' },
  { title: 'Collatz Conjecture · Plant', meta: 'Algorithmic Growth', href: 'https://anyemelody.github.io/CollatzConjecturePlant/plant.html', src: '/assets/creative-coding/collatz_conjecture_plant.gif' },
  { title: 'Collatz Conjecture · Creature', meta: 'Algorithmic Growth', href: 'https://anyemelody.github.io/CollatzConjecturePlant/creature.html', src: '/assets/creative-coding/collatz_conjecture_creature.gif' },
]
const N = WORKS.length

// [x, centerY, z, w, h] — MONUMENTAL: giant scroll canvases (7–11m) flanking a wide
// central axis, bottoms near the floor, |x| widening with depth; pairs share a depth.
const LAYOUT = [
  [-6.9, 4.80, -10, 6.75, 9.0],
  [ 6.3, 4.05, -10, 5.60, 7.5],
  [-8.5, 5.55, -20, 7.90, 10.5],
  [ 7.6, 4.40, -20, 6.15, 8.2],
  [-9.0, 4.90, -30, 6.90, 9.2],
  [ 9.7, 5.90, -34, 8.40, 11.2],
  [ 0.0, 5.00, -42, 12.4, 7.0],
  [-9.7, 4.50, -52, 6.30, 8.4],
  [10.4, 5.50, -52, 7.80, 10.4],
  [-10.3, 4.65, -62, 6.50, 8.7],
  [11.8, 3.90, -62, 9.60, 5.4],
]
// endless dark space (cineshader-style): no walls, fog swallows the distance
const HALL_LEN = 90, HALL_Z0 = 8
const MAX_P = N + 1 // final stop: turn back and take in the whole hall

// Bloom presets. Normal = low threshold soft glow; white-heavy artworks get a gentle
// high-threshold preset so big white areas never blow out. Tunable live via `?bloom`
// in the URL; overrides persist in localStorage `gallery-bloom-v2`.
const DEFAULT_BLOOM = { strength: 0.42, radius: 0.55, threshold: 0.12, falloff: 1, wstrength: 0.14, wradius: 0.35, wthreshold: 0.85, wfalloff: 1 }
const BLOOM_KEYS = [
  ['strength', 'Strength cap', 0, 1.5], ['radius', 'Radius', 0, 1.5], ['threshold', 'Threshold', 0, 1], ['falloff', 'Distance falloff', 0, 1],
  ['wstrength', 'White · strength', 0, 1], ['wradius', 'White · radius', 0, 1.5], ['wthreshold', 'White · threshold', 0, 1], ['wfalloff', 'White · falloff', 0, 1],
]
function readBloom() {
  try { return { ...DEFAULT_BLOOM, ...JSON.parse(localStorage.getItem('gallery-bloom-v2') || '{}') } }
  catch (_) { return { ...DEFAULT_BLOOM } }
}

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/anyemelody', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yue-melody-hu-60a84295/', Icon: FaLinkedinIn },
  { label: 'YouTube', href: 'https://www.youtube.com/watch?v=iMw3da1VIuo&list=PL68yBH9mbDAyLis85tYUav0YoqEYoR6rJ', Icon: FaYoutube },
  { label: 'Vimeo', href: 'https://vimeo.com/user44110761', Icon: FaVimeoV },
  { label: 'Instagram', href: 'https://www.instagram.com/anyemelody/', Icon: FaInstagram },
]

/* ---------- generated textures (no image assets needed besides the artworks) ---------- */

// silk texture for the gauze: woven grain + shimmer bands + baked vertical lightmap
function makeSilkTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#ece7de'; g.fillRect(0, 0, 256, 512)
  let s = 11
  const rnd = () => (s = (s * 233280 + 810731) % 433494437) / 433494437
  for (let y = 0; y < 512; y += 2) { g.fillStyle = `rgba(255,255,255,${0.03 + rnd() * 0.05})`; g.fillRect(0, y, 256, 1) }
  for (let x = 0; x < 256; x += 2) { g.fillStyle = `rgba(180,172,158,${0.03 + rnd() * 0.05})`; g.fillRect(x, 0, 1, 512) }
  // silk shimmer: soft diagonal highlight bands
  for (let k = 0; k < 7; k++) {
    const x0 = rnd() * 256, wBand = 26 + rnd() * 60
    const gr = g.createLinearGradient(x0 - wBand, 0, x0 + wBand, 512)
    gr.addColorStop(0, 'rgba(255,250,240,0)')
    gr.addColorStop(0.5, `rgba(255,250,240,${0.12 + rnd() * 0.14})`)
    gr.addColorStop(1, 'rgba(255,250,240,0)')
    g.fillStyle = gr; g.fillRect(0, 0, 256, 512)
  }
  // baked lightmap: brighter at the rod, falling off toward the hem
  const lm = g.createLinearGradient(0, 0, 0, 512)
  lm.addColorStop(0, 'rgba(255,248,235,0.22)')
  lm.addColorStop(0.45, 'rgba(255,248,235,0.05)')
  lm.addColorStop(1, 'rgba(20,18,24,0.25)')
  g.fillStyle = lm; g.fillRect(0, 0, 256, 512)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}

// light wood texture for the scroll rods (grain runs along the axis = v)
function makeWoodTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#ddc9ab'; g.fillRect(0, 0, 128, 512)
  let s = 23
  const rnd = () => (s = (s * 233280 + 810731) % 433494437) / 433494437
  for (let k = 0; k < 46; k++) {
    const x = rnd() * 128, amp = 2 + rnd() * 5, per = 60 + rnd() * 140
    const tone = rnd()
    g.strokeStyle = tone < 0.7
      ? `rgba(170,140,104,${0.08 + rnd() * 0.13})`
      : `rgba(255,248,232,${0.10 + rnd() * 0.12})`
    g.lineWidth = 0.8 + rnd() * 1.6
    g.beginPath()
    for (let y = 0; y <= 512; y += 8) {
      const xx = x + Math.sin(y / per * Math.PI * 2 + rnd() * 0.4) * amp
      y === 0 ? g.moveTo(xx, y) : g.lineTo(xx, y)
    }
    g.stroke()
  }
  // baked cylindrical shading: bright center strip, darker toward the silhouette edges
  const sh = g.createLinearGradient(0, 0, 128, 0)
  sh.addColorStop(0, 'rgba(40,32,22,0.22)')
  sh.addColorStop(0.3, 'rgba(255,248,232,0.2)')
  sh.addColorStop(0.55, 'rgba(40,32,22,0.03)')
  sh.addColorStop(1, 'rgba(40,32,22,0.22)')
  g.fillStyle = sh; g.fillRect(0, 0, 128, 512)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapT = THREE.RepeatWrapping
  return t
}

// wood height/bump texture: grayscale grain ridges for a rough tactile surface
function makeWoodBumpTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#808080'; g.fillRect(0, 0, 128, 512)
  let s = 23 // same seed as woodTex → ridges align with the visible grain
  const rnd = () => (s = (s * 233280 + 810731) % 433494437) / 433494437
  for (let k = 0; k < 46; k++) {
    const x = rnd() * 128, amp = 2 + rnd() * 5, per = 60 + rnd() * 140
    const tone = rnd()
    const lum = tone < 0.7 ? 60 - rnd() * 30 : 180 + rnd() * 50 // dark grain = groove, light = ridge
    g.strokeStyle = `rgba(${lum},${lum},${lum},0.6)`
    g.lineWidth = 0.8 + rnd() * 1.6
    g.beginPath()
    for (let y = 0; y <= 512; y += 8) {
      const xx = x + Math.sin(y / per * Math.PI * 2 + rnd() * 0.4) * amp
      y === 0 ? g.moveTo(xx, y) : g.lineTo(xx, y)
    }
    g.stroke()
  }
  for (let n = 0; n < 2600; n++) {
    const lum = 100 + rnd() * 60
    g.fillStyle = `rgba(${lum},${lum},${lum},0.35)`
    g.fillRect(rnd() * 128, rnd() * 512, 1 + rnd() * 2, 1)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapT = THREE.RepeatWrapping
  return t
}

// light beam: radial soft core high up, dissolving in every direction — no hard edges
function makeBeamTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(64, 20, 4, 64, 90, 190)
  gr.addColorStop(0, 'rgba(255,244,224,0.34)')
  gr.addColorStop(0.35, 'rgba(255,244,224,0.10)')
  gr.addColorStop(0.7, 'rgba(255,244,224,0.025)')
  gr.addColorStop(1, 'rgba(255,244,224,0)')
  g.fillStyle = gr; g.fillRect(0, 0, 128, 256)
  // extra feathering so the quad borders never show
  const side = g.createLinearGradient(0, 0, 128, 0)
  side.addColorStop(0, 'rgba(0,0,0,1)')
  side.addColorStop(0.35, 'rgba(0,0,0,0)')
  side.addColorStop(0.65, 'rgba(0,0,0,0)')
  side.addColorStop(1, 'rgba(0,0,0,1)')
  g.globalCompositeOperation = 'destination-out'
  g.fillStyle = side; g.fillRect(0, 0, 128, 256)
  const vert = g.createLinearGradient(0, 0, 0, 256)
  vert.addColorStop(0, 'rgba(0,0,0,1)')
  vert.addColorStop(0.18, 'rgba(0,0,0,0)')
  vert.addColorStop(0.8, 'rgba(0,0,0,0)')
  vert.addColorStop(1, 'rgba(0,0,0,1)')
  g.fillStyle = vert; g.fillRect(0, 0, 128, 256)
  return new THREE.CanvasTexture(c)
}

// soft round dust mote sprite
function makeDustTexture() {
  const c = document.createElement('canvas'); c.width = 32; c.height = 32
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  gr.addColorStop(0, 'rgba(255,248,232,1)')
  gr.addColorStop(0.4, 'rgba(255,248,232,0.4)')
  gr.addColorStop(1, 'rgba(255,248,232,0)')
  g.fillStyle = gr; g.beginPath(); g.arc(16, 16, 16, 0, 7); g.fill()
  return new THREE.CanvasTexture(c)
}

// vertical fade for reflections (strong at contact, dissolves with distance)
function makeFadeTexture() {
  const c = document.createElement('canvas'); c.width = 2; c.height = 256
  const g = c.getContext('2d')
  const gr = g.createLinearGradient(0, 0, 0, 256)
  gr.addColorStop(0, '#000'); gr.addColorStop(0.55, '#555'); gr.addColorStop(1, '#fff')
  g.fillStyle = gr; g.fillRect(0, 0, 2, 256)
  return new THREE.CanvasTexture(c)
}

/* ---------- helpers ---------- */

// detect large white/near-white areas → use the gentler bloom preset.
// Bright AND low-saturation, so warm creams (e.g. #f5efe0 paper) count as white
// but saturated brights (a glowing sun) don't.
function isWhiteHeavy(img) {
  try {
    const c = document.createElement('canvas'); c.width = 32; c.height = 32
    const g = c.getContext('2d')
    g.drawImage(img, 0, 0, 32, 32)
    const d = g.getImageData(0, 0, 32, 32).data
    let n = 0
    for (let p = 0; p < d.length; p += 4) {
      const r = d[p], gr = d[p + 1], b = d[p + 2]
      if ((r + gr + b) / 3 > 215 && Math.min(r, gr, b) > 190) n++
    }
    return n / 1024 > 0.22
  } catch (_) { return false }
}

// contain-fit dims for an image inside a panel (no stretch, no crop)
function containDims(iw, ih, pw, ph, margin) {
  const s = Math.min(pw * margin / iw, ph * margin / ih)
  return [iw * s, ih * s]
}

// blurred copy of an image for reflections (matches image ratio)
function blurTexture(srcImage) {
  const c = document.createElement('canvas')
  c.width = 160; c.height = Math.max(2, Math.round(160 * srcImage.height / srcImage.width))
  const g = c.getContext('2d')
  g.filter = 'blur(7px)'
  g.drawImage(srcImage, -12, -12, c.width + 24, c.height + 24)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}

export default function ArtGallery() {
  const section = useRef(null)
  const stage = useRef(null)
  const head = useRef(null)
  const mount = useRef(null)
  const videoVeil = useRef(null)
  const videoEl = useRef(null)
  const [focus, setFocus] = useState(-1)
  const [outro, setOutro] = useState(false)
  const [videoSrc, setVideoSrc] = useState(null)
  const bloomRef = useRef(null)
  if (!bloomRef.current) bloomRef.current = readBloom()
  const [showBloomPanel] = useState(() => typeof window !== 'undefined' && /[?&#]bloom/.test(window.location.search + window.location.hash))
  const [bloomVals, setBloomVals] = useState(() => ({ ...bloomRef.current }))
  const setBloomKey = (key, value) => {
    const next = { ...bloomVals, [key]: value }
    setBloomVals(next)
    Object.assign(bloomRef.current, next)
    try { localStorage.setItem('gallery-bloom-v2', JSON.stringify(next)) } catch (_) { /* private mode */ }
  }
  const resetBloom = () => {
    const next = { ...DEFAULT_BLOOM }
    setBloomVals(next)
    Object.assign(bloomRef.current, next)
    try { localStorage.removeItem('gallery-bloom-v2') } catch (_) { /* private mode */ }
  }

  // video overlay — local mp4 via <video>, vimeo.com links via player embed
  const vimeoId = videoSrc ? (videoSrc.match(/vimeo\.com\/(\d+)/) || [])[1] : null
  useEffect(() => {
    if (!videoSrc) return undefined
    const v = videoEl.current
    if (v) { v.src = videoSrc; v.play().catch(() => {}) }
    const onKey = (e) => { if (e.key === 'Escape') setVideoSrc(null) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (v) { v.pause(); v.removeAttribute('src'); v.load() }
    }
  }, [videoSrc])

  useEffect(() => {
    const sectionEl = section.current
    const mountEl = mount.current
    if (!sectionEl || !mountEl) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    if (window.matchMedia('(max-width: 760px)').matches) return undefined

    /* ---------- renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    mountEl.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0b0e)
    scene.fog = new THREE.Fog(0x0a0b0e, 24, 110)

    const camera = new THREE.PerspectiveCamera(62, mountEl.clientWidth / mountEl.clientHeight, 0.1, 160)
    camera.position.set(0, 2.0, 0)

    // bloom: panels genuinely glow
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(mountEl.clientWidth, mountEl.clientHeight), 0.27, 0.4, 0.8)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    // bloom presets — shared object with the ?bloom tuning panel (live updates)
    const BLOOM = bloomRef.current

    scene.add(new THREE.AmbientLight(0xaab2cc, 0.6))

    const silkTex = makeSilkTexture()
    const woodTex = makeWoodTexture()
    const woodBumpTex = makeWoodBumpTexture()
    const beamTex = makeBeamTexture()
    const dustTex = makeDustTexture()
    const fadeTex = makeFadeTexture()

    /* ---------- floating luminous panels + mirror clones ---------- */
    const artworks = []
    const layout = LAYOUT.map((row) => row.slice()) // runtime copy — ratio rule may resize panels

    for (let i = 0; i < N; i++) {
      const [x, y, z, w, h] = layout[i]
      const g = new THREE.Group()
      g.position.set(x, y, z)

      // sheer gauze canvas as the BACKDROP of each image — subdivided for cloth animation
      const gauze = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h, 64, 64),
        new THREE.MeshBasicMaterial({ map: silkTex, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false })
      )
      gauze.renderOrder = 3
      // the image itself keeps its native ratio, drawn solid on top of the gauze.
      // OPAQUE + front-side only: writes depth so near canvases occlude far ones,
      // and from behind you see the silk back, never the image.
      const mat = new THREE.MeshBasicMaterial({ side: THREE.FrontSide })
      const art = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.92, h * 0.92, 64, 64), mat)
      art.position.z = 0.02
      art.userData.index = i
      art.renderOrder = 4
      art.visible = false // until its texture is ready
      // cloth back of the painting: silk, back faces only (shares the animated geometry)
      const artBack = new THREE.Mesh(art.geometry, new THREE.MeshBasicMaterial({
        map: silkTex, side: THREE.BackSide, transparent: true, opacity: 0.55, depthWrite: false,
      }))
      artBack.position.z = 0.02
      artBack.renderOrder = 3
      artBack.visible = false
      g.add(gauze, art, artBack)

      // scroll rod (卷轴) across the top of the canvas
      const rod = new THREE.Group()
      const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, bumpMap: woodBumpTex, bumpScale: 0.012, roughness: 0.62, metalness: 0.05 })
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, w + 0.3, 24), woodMat)
      bar.rotation.z = Math.PI / 2
      // protruding end handles: flange + neck + rounded knob
      const makeHandle = (dir) => {
        const grp = new THREE.Group()
        const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.035, 24), woodMat)
        flange.rotation.z = Math.PI / 2
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.07, 16), woodMat)
        neck.rotation.z = Math.PI / 2; neck.position.x = dir * 0.05
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 16), woodMat)
        knob.position.x = dir * 0.105
        grp.add(flange, neck, knob)
        return grp
      }
      const capL = makeHandle(-1)
      capL.position.x = -(w + 0.3) / 2 - 0.02
      const capR = makeHandle(1)
      capR.position.x = (w + 0.3) / 2 + 0.02
      rod.add(bar, capL, capR)
      rod.position.y = h / 2 + 0.02
      g.add(rod)
      scene.add(g)

      // mirror clone below the floor: art only, no gauze/rod — shares the animated geometry
      const mirror = new THREE.Group()
      mirror.position.set(x, -y, z)
      mirror.scale.y = -1
      // FrontSide (three.js auto-corrects winding for the negative y-scale):
      // reflections show from the panel's front and vanish when viewed from behind (outro)
      const mirrorMat = new THREE.MeshBasicMaterial({
        transparent: true, opacity: 0.7, alphaMap: fadeTex, depthWrite: false, side: THREE.FrontSide,
      })
      mirrorMat.visible = false
      const mirrorArt = new THREE.Mesh(art.geometry, mirrorMat)
      mirrorArt.position.z = 0.02
      mirrorArt.renderOrder = 2 // draw over the floor → reflections stay vivid
      mirror.add(mirrorArt)
      scene.add(mirror)

      // volumetric light beam above the canvas: two crossed additive planes
      const beamH = 11 + h * 0.4
      const beamMat = new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
      const beam = new THREE.Group()
      const q1 = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, beamH), beamMat)
      const q2 = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, beamH), beamMat)
      q2.rotation.y = Math.PI / 2
      beam.add(q1, q2)
      beam.position.set(x, y + h / 2 + beamH / 2 - 0.4, z + 0.15)
      beam.renderOrder = 6
      scene.add(beam)

      artworks.push({
        group: g, art, artBack, mat, gauze, rod, bar, capL, capR,
        mirror, mirrorArt, mirrorMat, beam, beamQ: [q1, q2],
        x, y, z, w, h, ratio: w / h,
        freq: 0.75 + (i * 0.37) % 0.6, phase: i * 2.4,
        boost: 0, whiteHeavy: false, anim: null,
      })
    }

    // design rule: canvas ratio follows the image — landscape (≥1.15) gets 16:9, square & portrait get 3:4
    function ensureCanvasRatio(a, iw, ih) {
      const ar = iw / ih
      const target = ar >= 1.15 ? 16 / 9 : 0.75
      if (Math.abs(a.ratio - target) < 0.01) return
      const area = a.w * a.h
      const nw = Math.sqrt(area * target), nh = nw / target
      a.w = nw; a.h = nh; a.ratio = target
      a.y = Math.max(a.y, nh / 2 + 0.4)
      a.group.position.y = a.y
      a.mirror.position.y = -a.y
      a.gauze.geometry.dispose()
      a.gauze.geometry = new THREE.PlaneGeometry(nw, nh, 64, 64)
      a.bar.geometry.dispose()
      a.bar.geometry = new THREE.CylinderGeometry(0.045, 0.045, nw + 0.3, 24)
      a.capL.position.x = -(nw + 0.3) / 2 - 0.02
      a.capR.position.x = (nw + 0.3) / 2 + 0.02
      a.rod.position.y = nh / 2 + 0.02
      // beam follows the resized canvas
      const beamH = 11 + nh * 0.4
      a.beamQ.forEach((q) => { q.geometry.dispose(); q.geometry = new THREE.PlaneGeometry(nw * 0.9, beamH) })
      a.beam.position.set(a.x, a.y + nh / 2 + beamH / 2 - 0.4, a.z + 0.15)
      const li = layout[a.art.userData.index]
      li[1] = a.y; li[3] = nw; li[4] = nh
    }

    let disposed = false

    // animated GIF support: decode frames → live texture; reflection re-blurs at low rate
    const gifAnims = []
    async function setupGifAnimator(i, url) {
      const a = artworks[i]
      if (a.anim) a.anim.dead = true
      try {
        const buf = await (await fetch(url)).arrayBuffer()
        const dec = new ImageDecoder({ data: buf, type: 'image/gif' })
        await dec.tracks.ready
        await dec.completed
        const count = dec.tracks.selectedTrack.frameCount
        if (count < 2 || disposed) return
        const first = await dec.decode({ frameIndex: 0 })
        const fw = first.image.displayWidth, fh = first.image.displayHeight
        const c = document.createElement('canvas')
        c.width = fw; c.height = fh
        const ctx = c.getContext('2d')
        first.image.close()
        // size the art plane to the gif's native ratio
        const [gdw, gdh] = containDims(fw, fh, a.w, a.h, 0.92)
        a.art.geometry.dispose()
        a.art.geometry = new THREE.PlaneGeometry(gdw, gdh, 64, 64)
        a.artBack.geometry = a.art.geometry
        a.mirrorArt.geometry = a.art.geometry
        const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
        const mc = document.createElement('canvas'); mc.width = 160; mc.height = Math.max(2, Math.round(160 * fh / fw))
        const mg = mc.getContext('2d')
        const mtex = new THREE.CanvasTexture(mc); mtex.colorSpace = THREE.SRGBColorSpace
        a.mat.map = tex; a.mat.needsUpdate = true
        a.mirrorMat.map = mtex; a.mirrorMat.needsUpdate = true
        const anim = {
          idx: 0, next: 0, tick: 0, busy: false, dead: false,
          async step(now) {
            if (this.dead || this.busy || now < this.next) return
            this.busy = true
            try {
              const { image } = await dec.decode({ frameIndex: this.idx })
              const durMs = image.duration ? image.duration / 1000 : 100
              ctx.clearRect(0, 0, c.width, c.height)
              ctx.drawImage(image, 0, 0)
              image.close()
              tex.needsUpdate = true
              this.next = now + Math.max(20, durMs)
              this.idx = (this.idx + 1) % count
              if (++this.tick % 3 === 0) {
                mg.filter = 'blur(6px)'
                mg.drawImage(c, -12, -12, mc.width + 24, mc.height + 24)
                mtex.needsUpdate = true
              }
            } catch (_) { this.dead = true }
            this.busy = false
          },
        }
        a.anim = anim; gifAnims.push(anim)
      } catch (_) { /* static texture stays as the safe fallback */ }
    }

    function applyImage(i, url) {
      const img = new Image()
      img.onload = () => {
        if (disposed) return
        const a = artworks[i]
        ensureCanvasRatio(a, img.width, img.height)
        // image keeps its native ratio, contained in front of the gauze backdrop
        const t = new THREE.Texture(img); t.needsUpdate = true; t.colorSpace = THREE.SRGBColorSpace
        a.mat.map = t; a.mat.needsUpdate = true
        a.whiteHeavy = isWhiteHeavy(img)
        const [dw, dh] = containDims(img.width, img.height, a.w, a.h, 0.92)
        a.art.geometry.dispose()
        a.art.geometry = new THREE.PlaneGeometry(dw, dh, 64, 64)
        a.artBack.geometry = a.art.geometry
        a.mirrorArt.geometry = a.art.geometry
        a.art.visible = true
        a.artBack.visible = true
        a.mirrorMat.map = blurTexture(img); a.mirrorMat.needsUpdate = true
        a.mirrorMat.visible = true
        if (/\.gif($|\?)/i.test(url) && 'ImageDecoder' in window) setupGifAnimator(i, url)
      }
      img.src = url
    }
    for (let i = 0; i < N; i++) applyImage(i, WORKS[i].src)

    /* ---------- floating dust motes ---------- */
    const DUST_N = 420
    const dustGeo = new THREE.BufferGeometry()
    const dustPos = new Float32Array(DUST_N * 3)
    const dustSeed = new Float32Array(DUST_N)
    for (let d = 0; d < DUST_N; d++) {
      dustPos[d * 3] = (Math.random() - 0.5) * 26
      dustPos[d * 3 + 1] = Math.random() * 12
      dustPos[d * 3 + 2] = 6 - Math.random() * 80
      dustSeed[d] = Math.random() * 100
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      map: dustTex, size: 0.09, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    }))
    scene.add(dust)

    // polished dark floor: vast, edges lost in the fog — no visible boundary
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      new THREE.MeshPhysicalMaterial({ color: 0x08090c, roughness: 0.32, metalness: 0.35, clearcoat: 0.3, clearcoatRoughness: 0.6, transparent: true, opacity: 0.9, depthWrite: false })
    )
    floor.renderOrder = 1 // mirrors (renderOrder 2) composite on top
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, 0, HALL_Z0 - HALL_LEN / 2)
    scene.add(floor)

    /* ---------- scroll-driven progress ---------- */
    let targetP = 0, curP = 0
    let lastInput = performance.now()
    const parallax = { x: 0, y: 0 }
    const clampP = (v) => Math.max(0, Math.min(MAX_P, v))

    let lastScrollY = null
    const readScroll = () => {
      const box = sectionEl.getBoundingClientRect()
      // progress starts once the intro head has scrolled past (stage pinned at top)
      const introH = head.current ? head.current.offsetHeight : 0
      const f = Math.min(1, Math.max(0, (-box.top - introH) / Math.max(1, box.height - introH - window.innerHeight)))
      targetP = clampP(f * MAX_P)
      lastInput = performance.now()
      // title fades out as it scrolls past, like the projects sections before it
      const fade = Math.max(0, Math.min(1, 1 + box.top / Math.max(1, introH * 0.75)))
      sectionEl.style.setProperty('--art-intro', fade.toFixed(3))
    }
    // polled from the render loop — never misses a scroll, no extra listeners needed
    const pollScroll = () => {
      if (window.scrollY !== lastScrollY) { lastScrollY = window.scrollY; readScroll() }
    }
    readScroll()
    window.addEventListener('resize', readScroll)

    const onPointerMove = (e) => {
      parallax.x = (e.clientX / window.innerWidth - 0.5)
      parallax.y = (e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onPointerMove)

    /* ---------- click a work to travel to it / open it ---------- */
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let downXY = null
    let focused = -1
    const scrollToStop = (p) => {
      const box = sectionEl.getBoundingClientRect()
      const top = box.top + window.scrollY
      window.scrollTo({ top: top + (p / MAX_P) * (box.height - window.innerHeight), behavior: 'smooth' })
    }
    const onPointerDown = (e) => { downXY = [e.clientX, e.clientY] }
    const onPointerUp = (e) => {
      if (!downXY) return
      const moved = Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]); downXY = null
      if (moved > 6) return
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(artworks.map((w) => w.art))
      if (!hits.length) return
      const i = hits[0].object.userData.index
      if (i === focused && WORKS[i].video) { setVideoSrc(WORKS[i].video); return }
      if (i === focused && WORKS[i].href) {
        WORKS[i].href.startsWith('/')
          ? window.location.assign(WORKS[i].href)
          : window.open(WORKS[i].href, '_blank', 'noopener,noreferrer')
        return
      }
      scrollToStop(i + 1)
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

    /* ---------- camera waypoints ---------- */
    const look = new THREE.Vector3()
    const CAM_START = new THREE.Vector3(0, 2.0, 0)
    function stopPos(i) {
      if (i >= N) return new THREE.Vector3(-7.5, 5.0, -73) // finale: beside the last left canvas, gazing across
      // camera stop: squared up to the panel, slightly below center, at the distance
      // where the panel just fits the view (small margin), whichever axis binds
      const [x, y, z, w, h] = layout[i]
      const vf = THREE.MathUtils.degToRad(camera.fov / 2)
      const dV = (h / 2) / Math.tan(vf)
      const dH = (w / 2) / (Math.tan(vf) * camera.aspect)
      return new THREE.Vector3(x, Math.max(1.1, y - h * 0.22), z + Math.max(dV, dH) * 1.18)
    }
    function lookPoint(j) {
      // what the camera aims at around stop j: entry vista, then each panel's center
      if (j <= 0) return new THREE.Vector3(0, 6.0, -32)
      if (j >= N + 1) return new THREE.Vector3(7, 4.8, -50) // finale: diagonal across the last pairs
      const a = layout[Math.min(N, j) - 1]
      return new THREE.Vector3(a[0], a[1], a[2])
    }
    const camPosA = new THREE.Vector3(), camPosB = new THREE.Vector3()
    function camPosAt(p, out) {
      if (p <= 0) { out.copy(CAM_START); return out }
      const k = Math.max(0, Math.min(N, Math.floor(p)))
      const f = Math.min(1, p - k)
      camPosA.copy(k === 0 ? CAM_START : stopPos(k - 1))
      camPosB.copy(stopPos(k))
      out.lerpVectors(camPosA, camPosB, f)
      return out
    }

    /* ---------- title card / hud / outro state (React) ---------- */
    let outroShown = false
    function updateCard() {
      const nearest = Math.round(curP) - 1
      const close = Math.abs(curP - Math.round(curP)) < 0.25 && nearest >= 0 && nearest < N
      const next = close ? nearest : -1
      if (next !== focused) { focused = next; setFocus(next) }
      const o = curP > N + 0.5
      if (o !== outroShown) { outroShown = o; setOutro(o) }
      sectionEl.style.setProperty('--gallery-p', `${(curP / MAX_P) * 100}%`)
    }

    /* ---------- resize ---------- */
    const onResize = () => {
      const w = mountEl.clientWidth, h = mountEl.clientHeight
      camera.aspect = w / h; camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* ---------- loop ---------- */
    const clock = new THREE.Clock()
    let prevCamX = 0, roll = 0
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta()
      const tSec = clock.elapsedTime
      // cloth: gauze + image sway together as one piece, pinned at the rod
      for (const a of artworks) {
        const tA = tSec * a.freq + a.phase
        const amp = 0.035 * a.h * (1 + 0.4 * a.boost) // arrival response: livelier sway
        for (const mesh of [a.gauze, a.art]) {
          const pos = mesh.geometry.attributes.position
          for (let vi = 0; vi < pos.count; vi++) {
            const vx = pos.getX(vi), vy = pos.getY(vi)
            const pin = Math.max(0, (a.h / 2 - vy) / a.h) // 0 at rod → 1 at bottom
            const wave = Math.sin(vx * 1.4 + tA * 0.55 + a.z) * 0.45
              + Math.sin(vy * 1.1 + tA * 0.4 + a.x) * 0.35
              + Math.sin((vx + vy) * 2.6 + tA * 0.9 + a.z * 2.0) * 0.14
              + Math.sin(vx * 4.2 - tA * 0.7 + a.x * 3.0) * 0.06
            pos.setZ(vi, wave * amp * pin)
          }
          pos.needsUpdate = true
        }
      }
      // dust motes drift slowly upward
      {
        const dp = dustGeo.attributes.position
        for (let d = 0; d < DUST_N; d++) {
          let y = dp.getY(d) + dt * (0.06 + 0.05 * Math.sin(dustSeed[d]))
          const x = dp.getX(d) + Math.sin(tSec * 0.12 + dustSeed[d]) * dt * 0.12
          if (y > 12) y = 0
          dp.setXYZ(d, x, y, dp.getZ(d))
        }
        dp.needsUpdate = true
      }
      const nowMs = performance.now()
      pollScroll()
      for (const an of gifAnims) an.step(nowMs)
      // snap: shortly after input stops, ease to the nearest stop (each stop fronts a work)
      const effTarget = nowMs - lastInput > 260 ? clampP(Math.round(targetP)) : targetP
      curP += (effTarget - curP) * Math.min(1, dt * 3.5)

      // camera glides between stops in full 3D (x, y, z)
      camPosAt(curP, camera.position)
      const kIdx = Math.max(0, Math.min(N, Math.floor(curP)))
      const kf = THREE.MathUtils.smoothstep(Math.min(1, curP - kIdx), 0, 1)
      look.lerpVectors(lookPoint(kIdx), lookPoint(Math.min(N, kIdx + 1)), kf)
      camera.lookAt(look)
      // subtle roll from lateral motion (walking feel)
      const vx = dt > 0 ? (camera.position.x - prevCamX) / dt : 0
      prevCamX = camera.position.x
      roll += (THREE.MathUtils.clamp(-vx * 0.006, -0.035, 0.035) - roll) * Math.min(1, dt * 2.5)
      camera.rotation.z += roll
      camera.rotation.y -= parallax.x * 0.05
      camera.rotation.x -= parallax.y * 0.035

      // two presets: white-heavy images get gentle bloom; others get low threshold.
      // Keyed off the CURRENT WAYPOINT's artwork (what the camera faces), not raw
      // distance — the camera often passes closer to a neighboring panel than to
      // the one it is squared up to.
      const refIdx = Math.min(N - 1, Math.max(0, Math.round(curP) - 1))
      const nearestA = artworks[refIdx]
      const dMin = camera.position.distanceTo(nearestA.group.position)
      const falloff = nearestA.whiteHeavy ? BLOOM.wfalloff : BLOOM.falloff
      // proximity: bloom builds as the camera closes in on the nearest artwork
      const prox = THREE.MathUtils.clamp(1 - (dMin - 7) / 14, 0, 1)
      const tS = (nearestA.whiteHeavy ? BLOOM.wstrength : BLOOM.strength) * (0.35 + 0.65 * prox)
      const tR = nearestA.whiteHeavy ? BLOOM.wradius : BLOOM.radius
      const tT = nearestA.whiteHeavy ? BLOOM.wthreshold : BLOOM.threshold
      // ease toward the target preset — no hard jumps when the nearest artwork changes mid-flight
      const ease = Math.min(1, dt * 2.5)
      bloom.strength += (tS - bloom.strength) * ease
      bloom.radius += (tR - bloom.radius) * ease
      bloom.threshold += (tT - bloom.threshold) * ease
      const finaleK = THREE.MathUtils.clamp(curP - N, 0, 1) // finale: the whole hall lights up
      for (const a of artworks) {
        const d = camera.position.distanceTo(a.group.position)
        const k = Math.max(THREE.MathUtils.clamp(1 - (d - 9.0) * falloff * 2, 0, 1), finaleK)
        const target = focused === a.art.userData.index ? 1 : 0
        a.boost += (target - a.boost) * Math.min(1, dt * 2)
        a.mat.color.setScalar(0.72 + 0.28 * k + 0.1 * a.boost)
        // fresnel-ish reflections: stronger at grazing angles (far), faint underfoot
        a.mirrorMat.opacity = THREE.MathUtils.clamp(0.16 + d * 0.011, 0.16, 0.72)
      }

      updateCard()
      if (window.__galleryDebug) window.__galleryDbg = { nearest: WORKS[artworks.indexOf(nearestA)].title, wh: nearestA.whiteHeavy, dMin, s: bloom.strength, r: bloom.radius, t: bloom.threshold }
      composer.render()
    })

    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      for (const an of gifAnims) an.dead = true
      window.removeEventListener('resize', readScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => { m.map?.dispose?.(); m.dispose?.() })
        }
      })
      composer.dispose()
      renderer.dispose()
      mountEl.removeChild(renderer.domElement)
    }
  }, [])

  const focusedWork = focus >= 0 ? WORKS[focus] : null

  return (
    <section className="art-gallery art-gallery--webgl" id="art" ref={section}>
      {/* intro head sits ABOVE the gallery in normal flow — the 3D hall starts below it */}
      <div className="art-gallery-head" ref={head} data-nosnippet>
        <div className="art-gallery-head-inner">
          <div className="mono art-gallery-kicker">03 — ART WORK / CREATIVE CODING</div>
          <h2>A gallery you <em>walk through.</em></h2>
          <p>Scroll through luminous, suspended silk scrolls. Click a work to travel to it — click again to open its project or live sketch.</p>
        </div>
      </div>
      <div className="art-gallery-stage" ref={stage}>
        <div className="art-gallery-canvas" ref={mount} aria-hidden="true" />
        <div className="art-gallery-vignette" aria-hidden="true" />
        <div className={`art-gallery-hint mono${outro ? ' is-hidden' : ''}`} aria-hidden="true">SCROLL TO WALK · CLICK A WORK TO TRAVEL · CLICK AGAIN TO OPEN</div>
        <div className={`art-gallery-titlecard${focusedWork ? ' show' : ''}`} aria-hidden="true">
          <div className="name">{focusedWork ? focusedWork.title : ''}</div>
          <div className="meta mono">{focusedWork ? focusedWork.meta : ''}</div>
        </div>
        <div className={`art-gallery-hud mono${outro ? ' is-hidden' : ''}`} aria-hidden="true">
          <b>{String(Math.max(0, focus) + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</b>
        </div>
        <div className="art-gallery-progress" aria-hidden="true" />
      </div>

      {/* video overlay (Lotus Love / Animal Party / Dreamy Galaxy / Sound Emotion) */}
      {videoSrc && (
        <div className="art-video-veil" ref={videoVeil} onClick={(e) => { if (e.target !== videoEl.current) setVideoSrc(null) }}>
          {vimeoId ? (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
              title="Video player"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video ref={videoEl} controls playsInline />
          )}
          <div className="close mono">CLICK ANYWHERE TO CLOSE</div>
        </div>
      )}

      {/* mobile / reduced-motion fallback */}
      <div className="art-gallery-fallback">
        {WORKS.map((work) => {
          const href = work.href || work.video
          return (
            <a key={work.title} href={href} target={href.startsWith('/') && !work.video ? undefined : '_blank'} rel={href.startsWith('/') && !work.video ? undefined : 'noreferrer'}>
              <img src={work.src} alt="" loading="lazy" />
              <span className="mono">{work.meta.toUpperCase()}</span>
              <strong>{work.title} ↗</strong>
            </a>
          )
        })}
      </div>

      {/* outro / contact — fades in over the fully lit hall past the last waypoint */}
      <div className={`art-outro${outro ? ' show' : ''}`}>
        <div className="art-outro-intro">
          <div className="art-outro-status mono">OPEN TO NEW OPPORTUNITIES</div>
          <div className="art-outro-tagline">Tell me what you’re building —</div>
        </div>
        <a className="art-outro-email oi" href="mailto:anyemelody@gmail.com">anyemelody@gmail.com</a>
        <a className="art-outro-resume oi mono" href="/Yue_Hu_Resume_New.pdf" target="_blank" rel="noreferrer">VIEW RÉSUMÉ ↗</a>
        <nav className="art-outro-socials" aria-label="Social links">
          {socialLinks.map(({ label, href, Icon }) => (
            <a key={label} className="oi" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
              <Icon aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>

      {/* anchor for /#contact — end of the gallery journey */}
      <div id="contact" className="art-gallery-contact-anchor" aria-hidden="true" />

      {/* bloom tuning panel — open the page with ?bloom to show; values persist */}
      {showBloomPanel && (
        <div className="art-bloom-panel mono">
          <h3>Bloom</h3>
          {BLOOM_KEYS.map(([key, label, min, max]) => (
            <label key={key}>
              <span>{label} <output>{Number(bloomVals[key]).toFixed(2)}</output></span>
              <input type="range" min={min} max={max} step="0.01" value={bloomVals[key]}
                onChange={(e) => setBloomKey(key, parseFloat(e.target.value))} />
            </label>
          ))}
          <button type="button" onClick={resetBloom}>RESET DEFAULTS</button>
        </div>
      )}
    </section>
  )
}
