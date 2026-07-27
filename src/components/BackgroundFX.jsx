import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'

function makeSprite() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const x = c.getContext('2d')
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(190,170,255,.9)')
  g.addColorStop(1, 'rgba(120,90,255,0)')
  x.fillStyle = g
  x.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}

function Field() {
  const { camera, scene } = useThree()
  const scroll = useRef(0)
  const tgt = useRef({ x: 0, y: 0 })
  const mou = useRef({ x: 0, y: 0 })
  const camZ = useRef(520)
  const pointsRef = useRef()
  const linesRef = useRef()

  const data = useMemo(() => {
    const COUNT = 1100, SPAN_X = 1300, SPAN_Y = 800, Z_NEAR = 200, Z_FAR = -2200
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)
    const cA = new THREE.Color(0x7c5cff), cB = new THREE.Color(0x21d4a8), nodes = []
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * SPAN_X
      const y = (Math.random() - 0.5) * SPAN_Y
      const z = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR)
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z
      const tc = cA.clone().lerp(cB, Math.random())
      col[i * 3] = tc.r; col[i * 3 + 1] = tc.g; col[i * 3 + 2] = tc.b
      nodes.push({ x, y, z, ph: Math.random() * 6.28 })
    }
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    pg.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const pm = new THREE.PointsMaterial({
      size: 7, map: makeSprite(), vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, opacity: 0.9,
    })
    const linePos = []
    let lc = 0
    for (let i = 0; i < COUNT && lc < 520; i++) {
      for (let j = i + 1; j < COUNT && lc < 520; j++) {
        const a = nodes[i], b = nodes[j]
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 140) {
          linePos.push(a.x, a.y, a.z, b.x, b.y, b.z); lc++
        }
      }
    }
    const lg = new THREE.BufferGeometry()
    lg.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
    const lm = new THREE.LineBasicMaterial({
      color: 0x7c5cff, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    return { pg, pm, lg, lm, nodes, COUNT }
  }, [])

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x07070b, 0.0016)
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    const onMove = (e) => {
      tgt.current.x = e.clientX / window.innerWidth - 0.5
      tgt.current.y = e.clientY / window.innerHeight - 0.5
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
    }
  }, [scene])

  useFrame(() => {
    const t = performance.now() * 0.001
    const arr = data.pg.attributes.position.array
    for (let i = 0; i < data.COUNT; i++) {
      const nd = data.nodes[i]
      arr[i * 3] = nd.x + Math.sin(t * 0.2 + nd.ph) * 6
      arr[i * 3 + 1] = nd.y + Math.cos(t * 0.18 + nd.ph) * 6
    }
    data.pg.attributes.position.needsUpdate = true
    const targetZ = 520 - scroll.current * 2200
    camZ.current += (targetZ - camZ.current) * 0.06
    camera.position.z = camZ.current
    mou.current.x += (tgt.current.x - mou.current.x) * 0.05
    mou.current.y += (tgt.current.y - mou.current.y) * 0.05
    camera.position.x = mou.current.x * 120
    camera.position.y = -mou.current.y * 80
    camera.lookAt(0, 0, camZ.current - 600)
    if (pointsRef.current) pointsRef.current.rotation.z = t * 0.01
    if (linesRef.current) linesRef.current.rotation.z = t * 0.01
  })

  return (
    <>
      <points ref={pointsRef} geometry={data.pg} material={data.pm} />
      <lineSegments ref={linesRef} geometry={data.lg} material={data.lm} />
    </>
  )
}

export default function BackgroundFX() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion:reduce)').matches
  return (
    <Canvas
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, display: 'block' }}
      camera={{ position: [0, 0, 520], fov: 62, near: 1, far: 2600 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      frameloop={reduce ? 'demand' : 'always'}
    >
      <Field />
    </Canvas>
  )
}
