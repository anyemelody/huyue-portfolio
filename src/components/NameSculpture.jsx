import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const NX = 108, NY = 26, NZ = 58
const WORDS = { engineer: 'ENGINEER', artist: 'ARTIST', creator: 'CREATOR' }

function raster(word, w, h) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d', { willReadFrequently: true })
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h)
  g.fillStyle = '#fff'
  g.textAlign = 'center'; g.textBaseline = 'alphabetic'
  const fam = '"Arial Black", "Helvetica Neue", Helvetica, sans-serif'
  let size = 100
  g.font = `900 ${size}px ${fam}`
  let m = g.measureText(word)
  const th = (m.actualBoundingBoxAscent || size * 0.72) + (m.actualBoundingBoxDescent || 0)
  size = size * Math.min((w * 0.88) / m.width, (h * 0.78) / th)
  g.font = `900 ${size}px ${fam}`
  m = g.measureText(word)
  const asc = m.actualBoundingBoxAscent || size * 0.72, desc = m.actualBoundingBoxDescent || 0
  g.fillText(word, w / 2, h / 2 + (asc - desc) / 2)
  // frame band — without it the 3-way intersection eats most of the letterforms
  g.strokeStyle = '#fff'; g.lineWidth = 2
  g.strokeRect(1, 1, w - 2, h - 2)
  const d = g.getImageData(0, 0, w, h).data
  const bits = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) bits[i] = d[i * 4] > 120 ? 1 : 0
  return (u, v) => (u < 0 || v < 0 || u >= w || v >= h) ? 0 : bits[u + v * w]
}

let FIELD = null
function buildField() {
  if (FIELD) return FIELD
  const A = raster(WORDS.engineer, NX, NY)
  const B = raster(WORDS.artist, NZ, NY)
  const C = raster(WORDS.creator, NX, NZ)
  const solid = new Uint8Array(NX * NY * NZ)
  const idx = (x, y, z) => x + y * NX + z * NX * NY
  for (let x = 0; x < NX; x++) for (let y = 0; y < NY; y++) for (let z = 0; z < NZ; z++)
    if (A(x, NY - 1 - y) && B(NZ - 1 - z, NY - 1 - y) && C(x, z)) solid[idx(x, y, z)] = 1
  const cells = []
  for (let x = 0; x < NX; x++) for (let y = 0; y < NY; y++) for (let z = 0; z < NZ; z++)
    if (solid[idx(x, y, z)]) cells.push([x - (NX - 1) / 2, y - (NY - 1) / 2, z - (NZ - 1) / 2])
  FIELD = { solid, idx, cells }
  return FIELD
}

/**
 * The three-faced sculpture: ENGINEER head-on (+Z), ARTIST from the right (+X),
 * CREATOR from above (+Y) — one object, three orthographic readings.
 *
 * mode="plaster" — the voxel field through marching cubes; a cast solid. Light theme.
 * mode="points"  — a breathing point cloud. Dark theme.
 *
 * focusFace(name) is exposed through the `api` ref; the active face is reported via onFace.
 */
export default function NameSculpture({ api, onFace, mode = 'plaster', ink = '#2f2b27', stage = '#100e0c', autoCycle = true }) {
  const hostRef = useRef(null)
  const onFaceRef = useRef(onFace)
  onFaceRef.current = onFace

  useEffect(() => {
    const host = hostRef.current
    const scene = new THREE.Scene()
    const cam = new THREE.OrthographicCamera(-60, 60, 20, -20, 1, 2000)
    cam.position.set(0, 0, 600); cam.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    host.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, { display: 'block', position: 'absolute', inset: '0', width: '100%', height: '100%' })

    // a dark object on a light ground needs a harder key and less ambient fill,
    // or the letterforms flatten into one mass
    const lum = (() => { const c = new THREE.Color(ink); return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b })()
    const dark = lum < 0.45
    scene.add(new THREE.HemisphereLight(0xd8e2ee, 0x2a2018, dark ? 0.5 : 1.0))
    const key = new THREE.DirectionalLight(0xfff4e2, dark ? 3.6 : 2.4); key.position.set(-80, 70, 90); scene.add(key)
    const fill = new THREE.DirectionalLight(0x9fb8e0, dark ? 0.55 : 1.1); fill.position.set(80, -20, 60); scene.add(fill)
    const rim = new THREE.DirectionalLight(0xffb98a, dark ? 1.8 : 1.2); rim.position.set(10, 30, -140); scene.add(rim)

    const F = buildField()
    const group = new THREE.Group()
    scene.add(group)
    const disposables = []
    let pts = null

    if (mode === 'points') {
      // one cloud per layer: a dense body plus three sparkle layers that pulse out of
      // phase, so the green reads as scintillation rather than a second solid colour
      const DENSITY = 3
      const layers = [
        // the body sits deliberately dim; contrast comes from a small bright minority
        { frac: 0.88, color: ink, size: 0.45, base: 0.32, amp: 0, phase: 0, glow: false },
        { frac: 0.06, color: '#7fd45a', size: 1.7, base: 0.85, amp: 0.15, phase: 0, glow: true },
        { frac: 0.04, color: '#b6f08a', size: 1.25, base: 0.8, amp: 0.2, phase: 2.1, glow: true },
        { frac: 0.02, color: '#ffffff', size: 1.5, base: 0.95, amp: 0.2, phase: 4.2, glow: true }
      ]
      const total = F.cells.length * DENSITY
      const all = new Float32Array(total * 3)
      for (let i = 0; i < total; i++) {
        const p = F.cells[i % F.cells.length]
        const s = i < F.cells.length ? 0.7 : 1.15
        all[i * 3] = p[0] + (Math.random() - 0.5) * s
        all[i * 3 + 1] = p[1] + (Math.random() - 0.5) * s
        all[i * 3 + 2] = p[2] + (Math.random() - 0.5) * s
      }
      const order = [...Array(total).keys()].sort(() => Math.random() - 0.5)
      pts = []
      let cursor = 0
      layers.forEach((L, li) => {
        const n = li === layers.length - 1 ? total - cursor : Math.round(total * L.frac)
        const sub = new Float32Array(n * 3)
        for (let k = 0; k < n; k++) {
          const src = order[cursor + k] * 3
          sub[k * 3] = all[src]; sub[k * 3 + 1] = all[src + 1]; sub[k * 3 + 2] = all[src + 2]
        }
        cursor += n
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(sub.slice(), 3))
        const mat = new THREE.PointsMaterial({ color: L.color, size: L.size, sizeAttenuation: true, transparent: true, opacity: L.base, blending: L.glow ? THREE.AdditiveBlending : THREE.NormalBlending, depthWrite: !L.glow })
        group.add(new THREE.Points(geo, mat))
        pts.push({ geo, base: sub, mat, cfg: L })
        disposables.push(geo, mat)
      })
    } else {
      const res = 128
      const mat = new THREE.MeshStandardMaterial({ color: ink, roughness: 0.92, metalness: 0 })
      const mc = new MarchingCubes(res, mat, true, false, 900000)
      mc.isolation = 0.42
      const ox = Math.floor((res - NX) / 2), oy = Math.floor((res - NY) / 2), oz = Math.floor((res - NZ) / 2)
      const f = mc.field
      f.fill(0)
      for (let x = 0; x < NX; x++) for (let y = 0; y < NY; y++) for (let z = 0; z < NZ; z++) {
        if (!F.solid[F.idx(x, y, z)]) continue
        f[(x + ox) + (y + oy) * res + (z + oz) * res * res] = 1
      }
      // one blur pass turns the stepped voxel boundary into a cast surface
      const at = (x, y, z) => f[x + y * res + z * res * res]
      const g2 = new Float32Array(f.length)
      for (let x = 1; x < res - 1; x++) for (let y = 1; y < res - 1; y++) for (let z = 1; z < res - 1; z++) {
        if (!at(x, y, z) && !at(x + 1, y, z) && !at(x - 1, y, z) && !at(x, y + 1, z) && !at(x, y - 1, z) && !at(x, y, z + 1) && !at(x, y, z - 1)) continue
        g2[x + y * res + z * res * res] =
          (at(x, y, z) * 2 + at(x + 1, y, z) + at(x - 1, y, z) + at(x, y + 1, z) + at(x, y - 1, z) + at(x, y, z + 1) + at(x, y, z - 1)) / 8
      }
      mc.field.set(g2)
      mc.scale.setScalar(res / 2)
      mc.update()
      group.add(mc)
      disposables.push(mat)
    }

    const q = new THREE.Quaternion(), target = new THREE.Quaternion(), tmp = new THREE.Quaternion()
    const faceQ = {
      engineer: new THREE.Quaternion(),
      artist: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0)),
      creator: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))
    }
    const seq = ['engineer', 'artist', 'creator']
    let seqI = 0, auto = autoCycle, nextAt = performance.now() + 3000, current = 'engineer'
    q.setFromEuler(new THREE.Euler(0.4, -0.8, 0.08))
    target.copy(faceQ.engineer)

    const emit = (name) => { if (name === current) return; current = name; onFaceRef.current?.(name) }
    const focusFace = (name) => {
      if (!faceQ[name]) return
      auto = false; target.copy(faceQ[name]); emit(name)
      seqI = seq.indexOf(name); nextAt = performance.now() + 9000
    }
    if (api) api.current = { focusFace }

    let dragging = false, px = 0, py = 0
    const down = (e) => { dragging = true; auto = false; host.style.cursor = 'grabbing'; px = e.clientX; py = e.clientY; host.setPointerCapture?.(e.pointerId) }
    const move = (e) => {
      if (!dragging) return
      const dx = (e.clientX - px) * 0.006, dy = (e.clientY - py) * 0.006
      px = e.clientX; py = e.clientY
      tmp.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dx); target.premultiply(tmp)
      tmp.setFromAxisAngle(new THREE.Vector3(1, 0, 0), dy); target.premultiply(tmp)
      emit('free')
    }
    const up = () => { if (!dragging) return; dragging = false; host.style.cursor = 'grab'; auto = autoCycle; nextAt = performance.now() + 3000 }
    host.addEventListener('pointerdown', down)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerup', up)
    host.addEventListener('pointerleave', up)

    const halfBox = []
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1])
      halfBox.push(new THREE.Vector3(sx * (NX / 2 + 3), sy * (NY / 2 + 3), sz * (NZ / 2 + 3)))
    const ct = new THREE.Vector3()
    let aspect = 2, curHH = 40

    // bloom only for the point cloud — the dim body stays under threshold,
    // so only the green / white minority blooms
    let composer = null
    if (mode === 'points') {
      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, cam))
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.22, 0.8))
      composer.addPass(new OutputPass())
      // the composer writes an opaque black canvas; screen-blending it over the page
      // makes that black vanish, so there is no box edge against the page ground
      renderer.domElement.style.mixBlendMode = 'screen'
    }

    const resize = () => {
      const w = host.clientWidth || 800, h = host.clientHeight || 320
      renderer.setSize(w, h, false)
      if (composer) composer.setSize(w, h)
      aspect = w / h
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(host)

    const t0 = performance.now()
    let raf = 0
    const loop = () => {
      const now = performance.now()
      if (auto && now > nextAt) { seqI = (seqI + 1) % seq.length; target.copy(faceQ[seq[seqI]]); emit(seq[seqI]); nextAt = now + 4200 }
      q.slerp(target, dragging ? 0.5 : 0.055)
      group.quaternion.copy(q)

      if (pts) {
        const t = (now - t0) / 1000
        for (const L of pts) {
          const a2 = L.geo.attributes.position.array
          for (let i = 0; i < L.base.length; i += 3) {
            a2[i] = L.base[i] + Math.sin(t * 0.8 + i) * 0.25
            a2[i + 1] = L.base[i + 1] + Math.cos(t * 0.7 + i * 0.5) * 0.25
            a2[i + 2] = L.base[i + 2] + Math.sin(t * 0.6 + i * 0.3) * 0.25
          }
          L.geo.attributes.position.needsUpdate = true
          if (L.cfg.amp) L.mat.opacity = L.cfg.base + Math.sin(t * 1.9 + L.cfg.phase) * L.cfg.amp
        }
      }

      let mx = 0, my = 0
      for (const c of halfBox) { ct.copy(c).applyQuaternion(q); mx = Math.max(mx, Math.abs(ct.x)); my = Math.max(my, Math.abs(ct.y)) }
      const wantHH = Math.max(my, mx / aspect)
      curHH += (wantHH - curHH) * 0.08
      cam.top = curHH; cam.bottom = -curHH; cam.left = -curHH * aspect; cam.right = curHH * aspect
      cam.updateProjectionMatrix()

      if (composer) composer.render(); else renderer.render(scene, cam)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      host.removeEventListener('pointerdown', down)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerup', up)
      host.removeEventListener('pointerleave', up)
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [api, autoCycle, mode, ink, stage])

  return <div className="sculpt" ref={hostRef} />
}
