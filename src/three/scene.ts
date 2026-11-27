import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { StructureId } from '../data/atlas'

// A stylised, procedurally built model of the nervous system. Positions are
// anatomically plausible but illustrative. Units: the brain is about 1.7 long.
// Axes: +x is the person's left, +y up, +z the direction they face.

export interface Highlight {
  color: string
  /** 0–1: how strongly the structure glows. */
  strength: number
  label?: string
}

export type ViewName = 'brain' | 'body'

export interface SceneOptions {
  names: Record<StructureId, string>
  reducedMotion: boolean
  onPick: (id: StructureId) => void
  onHover: (id: StructureId | null) => void
}

export interface SceneApi {
  setHighlights(h: Partial<Record<StructureId, Highlight>>, source?: StructureId | null): void
  setSelected(id: StructureId | null): void
  frame(view: ViewName): void
  dispose(): void
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const BRAIN_IDS = new Set<StructureId>([
  'dlpfc', 'vmpfc', 'acc', 'motor', 'insula', 'dstr', 'nacc', 'thalamus', 'hypothalamus', 'pituitary', 'amygdala',
  'hippocampus', 'midbrain', 'lc', 'raphe', 'vestibular', 'medulla', 'cerebellum',
])

// ───────────── materials

function xray(color: string, intensity: number, power = 2.2) {
  return new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, intensity: { value: intensity }, power: { value: power } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 color; uniform float intensity; uniform float power;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), power);
        float a = clamp(rim * intensity + 0.02 * intensity, 0.0, 1.0);
        gl_FragColor = vec4(color * a, a);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
}

const BASE = new THREE.Color('#8b96aa')

function nodeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: BASE.clone(),
    roughness: 0.45,
    metalness: 0.05,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    emissive: new THREE.Color('#000000'),
  })
}

// ───────────── geometry helpers

function gyri(p: THREE.Vector3, amp: number, freq: number) {
  return (
    amp *
    (Math.sin(freq * p.x + 3.1 * Math.sin(freq * 0.6 * p.y)) * Math.cos(freq * 0.9 * p.z + 2.3 * Math.sin(freq * 0.7 * p.x)) +
      0.6 * Math.sin(freq * 1.7 * p.y + 2 * Math.cos(freq * 1.3 * p.z)))
  )
}

/** Deform a sphere into an ellipsoid with folds; `shape` may further move each unit-sphere point. */
function folded(
  radii: THREE.Vector3,
  amp: number,
  freq: number,
  shape?: (unit: THREE.Vector3) => void,
  seg: [number, number] = [96, 72],
) {
  const g = new THREE.SphereGeometry(1, seg[0], seg[1])
  const pos = g.attributes.position as THREE.BufferAttribute
  const u = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    u.fromBufferAttribute(pos, i)
    const n = u.clone()
    shape?.(u)
    u.multiply(radii)
    u.addScaledVector(n, gyri(u, amp, freq))
    pos.setXYZ(i, u.x, u.y, u.z)
  }
  g.computeVertexNormals()
  return g
}

function tube(points: THREE.Vector3[], radius: number, seg = 64) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), seg, radius, 10, false)
}

function ellipsoid(r: [number, number, number], seg = 32) {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75))
  g.scale(...r)
  return g
}

function capsuleBetween(a: THREE.Vector3, b: THREE.Vector3, r: number) {
  const len = a.distanceTo(b)
  const g = new THREE.CapsuleGeometry(r, len, 8, 24)
  const m = new THREE.Mesh(g)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize())
  return m
}

/** A thin patch lying on a surface: `normal` points outward, `along` sets the long axis. */
function patch(r: [number, number, number], normal: THREE.Vector3, along: THREE.Vector3) {
  const g = ellipsoid(r, 28)
  const z = normal.clone().normalize()
  const y = along.clone().sub(z.clone().multiplyScalar(along.dot(z))).normalize()
  const x = y.clone().cross(z)
  g.applyMatrix4(new THREE.Matrix4().makeBasis(x, y, z))
  return g
}

const mirror = (v: THREE.Vector3) => V(-v.x, v.y, v.z)
const both = (v: THREE.Vector3) => [v, mirror(v)]

// ───────────── the model

interface Part {
  geom: THREE.BufferGeometry
  at?: THREE.Vector3
  /** Thin parts get a fatter invisible proxy so they are easy to click. */
  pick?: THREE.BufferGeometry
}

function buildParts(): Record<StructureId, { parts: Part[]; anchor: THREE.Vector3 }> {
  const P = (geom: THREE.BufferGeometry, at?: THREE.Vector3, pick?: THREE.BufferGeometry): Part => ({ geom, at, pick })
  const pairs = (g: () => THREE.BufferGeometry, v: THREE.Vector3) => both(v).map((p) => P(g(), p))

  const hippo = (s: number) => [V(0.29 * s, -0.31, 0.14), V(0.3 * s, -0.27, -0.06), V(0.25 * s, -0.17, -0.25), V(0.15 * s, -0.04, -0.34)]
  const acc = (s: number) => [V(0.05 * s, -0.08, 0.47), V(0.05 * s, 0.18, 0.4), V(0.05 * s, 0.3, 0.12), V(0.05 * s, 0.28, -0.12)]
  const vagus = (s: number) => [V(0.06 * s, -0.78, -0.26), V(0.17 * s, -1.2, -0.1), V(0.2 * s, -1.8, 0), V(0.2 * s, -2.3, 0.05), V(0.12 * s, -2.9, 0.12), V(0.08 * s, -3.4, 0.16)]
  const arm = (s: number) => [V(0.06 * s, -1.95, -0.38), V(0.6 * s, -2.0, -0.2), V(1.02 * s, -2.25, -0.04), V(1.08 * s, -3.7, 0.02), V(1.15 * s, -5.35, 0.06)]
  const leg = (s: number) => [V(0.05 * s, -4.75, -0.42), V(0.3 * s, -5.25, -0.25), V(0.45 * s, -5.8, -0.08), V(0.45 * s, -7.4, -0.04), V(0.45 * s, -9.15, 0.02)]
  const tubes = (pts: THREE.Vector3[][], r: number, pr = 0.07) => pts.map((p) => P(tube(p, r), undefined, tube(p, pr, 24)))

  const gut: THREE.Vector3[] = [V(0.22, -3.3, 0.2)]
  for (let i = 0; i < 7; i++) {
    const y = -3.75 - i * 0.12
    gut.push(V(i % 2 ? -0.32 : 0.32, y, 0.22 + 0.05 * Math.sin(i)), V(0, y - 0.06, 0.28))
  }
  gut.push(V(0.05, -4.7, 0.12))

  const chain = (s: number) => Array.from({ length: 13 }, (_, i) => V(0.15 * s, -1.85 - i * 0.22, -0.36))

  return {
    dlpfc: { parts: pairs(() => patch([0.1, 0.13, 0.018], V(0.55, 0.45, 0.7), V(0, 0.4, -1)), V(0.47, 0.32, 0.52)), anchor: V(0.47, 0.32, 0.52) },
    vmpfc: { parts: pairs(() => patch([0.08, 0.06, 0.018], V(0.15, -0.6, 1), V(1, 0, 0)), V(0.12, -0.14, 0.78)), anchor: V(0.12, -0.14, 0.78) },
    motor: { parts: pairs(() => patch([0.045, 0.26, 0.018], V(0.45, 1, 0), V(1, -0.5, 0)), V(0.27, 0.6, -0.04)), anchor: V(0.3, 0.6, -0.04) },
    insula: { parts: pairs(() => patch([0.11, 0.08, 0.02], V(1, 0, 0), V(0, 0.2, 1)), V(0.5, 0.02, 0.13)), anchor: V(0.5, 0.02, 0.13) },
    acc: { parts: [1, -1].map((s) => P(tube(acc(s), 0.035), undefined, tube(acc(s), 0.07, 24))), anchor: V(0.05, 0.28, 0.25) },
    dstr: { parts: pairs(() => ellipsoid([0.07, 0.12, 0.2]), V(0.21, 0.08, 0.17)), anchor: V(0.21, 0.12, 0.17) },
    nacc: { parts: pairs(() => ellipsoid([0.045, 0.04, 0.05]), V(0.09, -0.11, 0.34)), anchor: V(0.09, -0.11, 0.34) },
    thalamus: { parts: pairs(() => ellipsoid([0.085, 0.08, 0.14]), V(0.095, 0.03, -0.06)), anchor: V(0.095, 0.05, -0.06) },
    hypothalamus: { parts: [P(ellipsoid([0.075, 0.055, 0.075]), V(0, -0.2, 0.12))], anchor: V(0, -0.2, 0.12) },
    pituitary: { parts: [P(ellipsoid([0.045, 0.04, 0.045]), V(0, -0.37, 0.2)), P(tube([V(0, -0.24, 0.14), V(0, -0.34, 0.19)], 0.012, 8))], anchor: V(0, -0.37, 0.2) },
    amygdala: { parts: pairs(() => ellipsoid([0.055, 0.05, 0.06]), V(0.29, -0.31, 0.2)), anchor: V(0.29, -0.31, 0.2) },
    hippocampus: { parts: [1, -1].map((s) => P(tube(hippo(s), 0.045), undefined, tube(hippo(s), 0.07, 24))), anchor: V(0.28, -0.24, -0.12) },
    midbrain: { parts: pairs(() => ellipsoid([0.04, 0.035, 0.05]), V(0.045, -0.3, -0.1)), anchor: V(0.045, -0.3, -0.1) },
    lc: { parts: pairs(() => ellipsoid([0.022, 0.035, 0.022]), V(0.05, -0.5, -0.22)), anchor: V(0.05, -0.5, -0.22) },
    raphe: { parts: [P(ellipsoid([0.02, 0.15, 0.03]), V(0, -0.45, -0.18))], anchor: V(0, -0.42, -0.18) },
    vestibular: { parts: pairs(() => ellipsoid([0.035, 0.03, 0.03]), V(0.1, -0.61, -0.26)), anchor: V(0.1, -0.61, -0.26) },
    medulla: { parts: [P(ellipsoid([0.085, 0.12, 0.08]), V(0, -0.76, -0.29))], anchor: V(0, -0.76, -0.29) },
    cerebellum: {
      parts: [P(folded(V(0.55, 0.24, 0.3), 0.012, 30, (u) => u.setY(u.y + 0.08 * Math.sin(u.x * 3)), [64, 48]), V(0, -0.5, -0.62))],
      anchor: V(0.3, -0.48, -0.66),
    },
    spinal: { parts: tubes([[V(0, -0.86, -0.31), V(0, -1.3, -0.33), V(0, -2.5, -0.4), V(0, -3.8, -0.44), V(0, -4.75, -0.43)]], 0.045, 0.09), anchor: V(0, -3.1, -0.42) },
    vagus: { parts: tubes([vagus(1), vagus(-1), [V(0.2, -2.3, 0.05), V(0.18, -2.65, 0.16)], [V(-0.2, -2.3, 0.05), V(-0.38, -2.4, 0.02)]], 0.018), anchor: V(0.2, -1.8, 0) },
    symp: {
      parts: [1, -1].flatMap((s) => [
        P(tube(chain(s), 0.01, 32)),
        ...chain(s).map((c) => P(ellipsoid([0.03, 0.035, 0.03], 12), c, ellipsoid([0.06, 0.08, 0.06], 8))),
      ]),
      anchor: V(0.15, -2.9, -0.36),
    },
    heart: { parts: [P(ellipsoid([0.26, 0.3, 0.22]), V(0.14, -2.72, 0.18))], anchor: V(0.14, -2.72, 0.18) },
    lungs: { parts: pairs(() => ellipsoid([0.32, 0.62, 0.34]), V(0.46, -2.45, -0.02)), anchor: V(-0.52, -2.3, 0) },
    thyroid: { parts: [...pairs(() => ellipsoid([0.05, 0.09, 0.045]), V(0.08, -1.42, 0.16)), P(ellipsoid([0.06, 0.025, 0.03]), V(0, -1.46, 0.19))], anchor: V(0.08, -1.42, 0.16) },
    liver: { parts: [P(ellipsoid([0.46, 0.2, 0.3]), V(-0.3, -3.3, 0.1))], anchor: V(-0.4, -3.3, 0.1) },
    adrenal: { parts: pairs(() => ellipsoid([0.06, 0.05, 0.04]), V(0.3, -3.52, -0.32)), anchor: V(0.3, -3.52, -0.32) },
    kidney: { parts: pairs(() => ellipsoid([0.1, 0.19, 0.09]), V(0.32, -3.78, -0.33)), anchor: V(-0.32, -3.78, -0.33) },
    gut: { parts: [P(ellipsoid([0.24, 0.16, 0.16]), V(0.22, -3.35, 0.2)), P(tube(gut, 0.055, 160))], anchor: V(0, -4.1, 0.25) },
    pelvic: { parts: tubes([[V(0, -4.75, -0.42), V(0.12, -5.0, -0.2), V(0.18, -5.2, 0.1)], [V(0, -4.75, -0.42), V(-0.12, -5.0, -0.2), V(-0.18, -5.2, 0.1)], [V(0, -4.75, -0.42), V(0, -5.05, -0.1), V(0, -5.25, 0.15)]], 0.02), anchor: V(0, -5.1, 0) },
    muscle: {
      parts: [
        ...both(V(0.47, -6.4, 0.06)).map((p) => P(new THREE.CapsuleGeometry(0.2, 1.1, 8, 20), p)),
        ...both(V(1.05, -2.95, 0.08)).map((p) => P(new THREE.CapsuleGeometry(0.11, 0.7, 8, 16), p)),
      ],
      anchor: V(0.47, -6.4, 0.06),
    },
    peripheral: { parts: tubes([arm(1), arm(-1), leg(1), leg(-1)], 0.018), anchor: V(-1.1, -4.4, 0.04) },
    skin: { parts: [], anchor: V(-0.82, -3.0, 0.2) },
  }
}

function hemisphere(side: 1 | -1) {
  return folded(V(0.6, 0.57, 0.86), 0.022, 11, (u) => {
    // Flatten the medial face and tuck the underside; swell the temporal lobe.
    if (u.x * side < 0) u.x *= 0.42
    if (u.y < -0.2) u.y = -0.2 + (u.y + 0.2) * (u.z > 0.35 ? 0.45 : 0.85)
    if (u.z > -0.3 && u.z < 0.55 && u.y < 0 && u.x * side > 0.3) u.x += side * 0.08 * Math.cos((u.z - 0.12) * 3.6)
  })
}

function bodyShell() {
  const g = new THREE.Group()
  const add = (m: THREE.Mesh) => g.add(m)
  const head = new THREE.Mesh(ellipsoid([0.82, 0.92, 1.05], 48))
  head.position.set(0, 0.02, 0)
  add(head)
  const jaw = new THREE.Mesh(ellipsoid([0.55, 0.38, 0.5], 32))
  jaw.position.set(0, -0.72, 0.38)
  add(jaw)
  add(capsuleBetween(V(0, -0.85, -0.12), V(0, -1.7, -0.05), 0.33))
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.82, 2.25, 12, 40))
  torso.scale.set(1, 1, 0.58)
  torso.position.set(0, -3.5, 0)
  add(torso)
  for (const s of [1, -1]) {
    add(capsuleBetween(V(1.02 * s, -2.1, 0), V(1.08 * s, -3.75, 0), 0.19))
    add(capsuleBetween(V(1.08 * s, -3.8, 0), V(1.15 * s, -5.3, 0.04), 0.16))
    const hand = new THREE.Mesh(ellipsoid([0.1, 0.22, 0.16], 20))
    hand.position.set(1.17 * s, -5.65, 0.06)
    add(hand)
    add(capsuleBetween(V(0.45 * s, -5.25, 0), V(0.47 * s, -7.35, 0), 0.31))
    add(capsuleBetween(V(0.47 * s, -7.45, 0), V(0.45 * s, -9.2, 0), 0.22))
    const foot = new THREE.Mesh(ellipsoid([0.15, 0.1, 0.32], 20))
    foot.position.set(0.45 * s, -9.48, 0.2)
    add(foot)
  }
  return g
}

// ───────────── scene

const VIEWS: Record<ViewName, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  brain: { pos: V(2.75, 1.0, 3.0), target: V(0, -0.12, 0) },
  body: { pos: V(6.5, -3.2, 16.5), target: V(0, -4.4, 0) },
}

export function createScene(canvas: HTMLCanvasElement, labelLayer: HTMLElement, opts: SceneOptions): SceneApi {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 100)
  camera.position.copy(VIEWS.brain.pos)

  const controls = new OrbitControls(camera, canvas)
  controls.target.copy(VIEWS.brain.target)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 1.1
  controls.maxDistance = 24
  controls.autoRotate = !opts.reducedMotion
  controls.autoRotateSpeed = 0.55

  scene.add(new THREE.AmbientLight(0xffffff, 0.75))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(3, 5, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x9fb8ff, 0.7)
  rim.position.set(-4, -2, -5)
  scene.add(rim)

  // Shells: brain hemispheres, brainstem, and the body outline.
  const shellMats: THREE.ShaderMaterial[] = []
  const brainShell = xray('#a9bddf', 0.85, 1.7)
  const stemShell = xray('#9fb4d6', 0.4, 2.0)
  const skinMat = xray('#8fa3c4', 0.22, 2.6)
  const headMat = xray('#8fa3c4', 0.12, 2.6)
  shellMats.push(brainShell, stemShell, skinMat, headMat)
  for (const s of [1, -1] as const) {
    const h = new THREE.Mesh(hemisphere(s), brainShell)
    h.position.set(0.33 * s, 0.05, 0)
    h.renderOrder = 2
    scene.add(h)
  }
  const stem = new THREE.Mesh(tube([V(0, -0.12, -0.06), V(0, -0.4, -0.16), V(0, -0.65, -0.25), V(0, -0.92, -0.31)], 0.12, 32), stemShell)
  stem.renderOrder = 2
  scene.add(stem)
  const body = bodyShell()
  body.children.forEach((o, i) => {
    // The first three pieces are head, jaw and neck: kept faint so they never veil the brain.
    if (o instanceof THREE.Mesh) {
      o.material = i < 3 ? headMat : skinMat
      o.renderOrder = 3
    }
  })
  scene.add(body)

  // Structures.
  const defs = buildParts()
  const nodes = new Map<StructureId, { meshes: THREE.Mesh[]; mat: THREE.MeshStandardMaterial; anchor: THREE.Vector3 }>()
  const pickables: THREE.Mesh[] = []
  const invisible = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false })
  for (const [id, def] of Object.entries(defs) as [StructureId, { parts: Part[]; anchor: THREE.Vector3 }][]) {
    const mat = nodeMaterial()
    const meshes: THREE.Mesh[] = []
    for (const part of def.parts) {
      const m = new THREE.Mesh(part.geom, mat)
      if (part.at) m.position.copy(part.at)
      m.userData.id = id
      m.renderOrder = 1
      scene.add(m)
      meshes.push(m)
      if (part.pick) {
        const p = new THREE.Mesh(part.pick, invisible)
        if (part.at) p.position.copy(part.at)
        p.userData.id = id
        scene.add(p)
        pickables.push(p)
      } else pickables.push(m)
    }
    nodes.set(id, { meshes, mat, anchor: def.anchor })
  }

  // Selection beacon: a ring that always faces the camera.
  const beacon = new THREE.Mesh(
    new THREE.RingGeometry(0.075, 0.09, 48),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthTest: false }),
  )
  beacon.renderOrder = 10
  beacon.visible = false
  scene.add(beacon)

  // Signal particles flowing from a source to each highlighted structure.
  const FLOW = 4
  const flowGeom = new THREE.BufferGeometry()
  const flowMat = new THREE.PointsMaterial({ size: 0.045, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })
  const flow = new THREE.Points(flowGeom, flowMat)
  flow.renderOrder = 4
  scene.add(flow)
  let curves: { c: THREE.QuadraticBezierCurve3; id: StructureId }[] = []

  // Labels.
  const labels = new Map<StructureId, HTMLDivElement>()
  for (const id of nodes.keys()) {
    const el = document.createElement('div')
    el.className = 'label3d'
    el.textContent = opts.names[id]
    el.style.display = 'none'
    labelLayer.appendChild(el)
    labels.set(id, el)
  }

  let highlights: Partial<Record<StructureId, Highlight>> = {}
  const rank = (id: StructureId) => (id === selected ? 10 : id === hovered ? 9 : (highlights[id]?.strength ?? 0))
  let selected: StructureId | null = null
  let hovered: StructureId | null = null

  function paint() {
    const any = Object.keys(highlights).length > 0
    for (const [id, n] of nodes) {
      const h = highlights[id]
      const m = n.mat
      if (h) {
        m.color.set(h.color)
        m.emissive.set(h.color)
        m.opacity = 0.55 + 0.4 * h.strength
        m.depthWrite = true
      } else {
        m.color.copy(BASE)
        m.emissive.set('#000000')
        m.emissiveIntensity = 0
        m.opacity = any ? 0.16 : 0.38
        m.depthWrite = false
      }
      if (id === hovered && !h) {
        m.opacity = 0.7
      }
      const el = labels.get(id)!
      el.textContent = h?.label ? `${opts.names[id]} · ${h.label}` : opts.names[id]
      el.classList.toggle('sel', id === selected)
      el.style.setProperty('--c', h?.color ?? '#c9d2e3')
    }
    const skin = highlights.skin
    skinMat.uniforms.color.value.set(skin ? skin.color : '#8fa3c4')
    skinMat.uniforms.intensity.value = skin ? 0.38 : 0.22
  }

  function setFlow(source: StructureId | null | undefined) {
    curves = []
    if (source && nodes.has(source)) {
      const from = nodes.get(source)!.anchor
      for (const id of Object.keys(highlights) as StructureId[]) {
        if (id === source || id === 'skin') continue
        const to = nodes.get(id)!.anchor
        const mid = from.clone().add(to).multiplyScalar(0.5)
        const bend = from.distanceTo(to) * 0.25
        mid.add(V(0, bend * 0.6, bend * 0.5))
        curves.push({ c: new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone()), id })
      }
    }
    flowGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(curves.length * FLOW * 3), 3))
    flowGeom.setAttribute('color', new THREE.BufferAttribute(new Float32Array(curves.length * FLOW * 3), 3))
    flowMat.vertexColors = true
    flowMat.needsUpdate = true
    flow.visible = curves.length > 0
  }

  // Interaction.
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  let down: { x: number; y: number } | null = null
  const pickAt = (e: PointerEvent): StructureId | null => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    const hit = ray.intersectObjects(pickables, false)[0]
    return (hit?.object.userData.id as StructureId) ?? null
  }
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY }
    controls.autoRotate = false
  }
  const onUp = (e: PointerEvent) => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 5) {
      const id = pickAt(e)
      if (id) opts.onPick(id)
    }
    down = null
  }
  let hoverQueued: PointerEvent | null = null
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    hoverQueued = e
  }
  const onLeave = () => {
    hoverQueued = null
    if (hovered) {
      hovered = null
      paint()
      opts.onHover(null)
    }
    canvas.style.cursor = ''
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerleave', onLeave)
  controls.addEventListener('start', () => (controls.autoRotate = false))

  // Camera tween.
  let tween: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; t0: number } | null = null
  function frame(view: ViewName) {
    const v = VIEWS[view]
    if (opts.reducedMotion) {
      camera.position.copy(v.pos)
      controls.target.copy(v.target)
      return
    }
    tween = { from: camera.position.clone(), to: v.pos.clone(), tFrom: controls.target.clone(), tTo: v.target.clone(), t0: performance.now() }
  }

  // Resize.
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // Loop.
  const tmp = new THREE.Vector3()
  const col = new THREE.Color()
  let raf = 0
  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    if (!visible) return
    const t = now / 1000

    if (tween) {
      const k = Math.min(1, (now - tween.t0) / 900)
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      camera.position.lerpVectors(tween.from, tween.to, e)
      controls.target.lerpVectors(tween.tFrom, tween.tTo, e)
      if (k >= 1) tween = null
    }
    controls.update()

    if (hoverQueued) {
      const id = pickAt(hoverQueued)
      hoverQueued = null
      if (id !== hovered) {
        hovered = id
        canvas.style.cursor = id ? 'pointer' : ''
        paint()
        opts.onHover(id)
      }
    }

    // Glow and pulse.
    for (const [id, n] of nodes) {
      const h = highlights[id]
      if (!h) continue
      const pulse = opts.reducedMotion ? 1 : 0.8 + 0.2 * Math.sin(t * 2.2 + id.length)
      n.mat.emissiveIntensity = (0.25 + 0.75 * h.strength) * pulse * (id === selected ? 1.4 : 1)
    }

    // Flow particles.
    if (curves.length) {
      const pos = flowGeom.attributes.position as THREE.BufferAttribute
      const cols = flowGeom.attributes.color as THREE.BufferAttribute
      curves.forEach(({ c, id }, i) => {
        for (let k = 0; k < FLOW; k++) {
          const u = (t * 0.32 + k / FLOW + i * 0.137) % 1
          c.getPoint(u, tmp)
          pos.setXYZ(i * FLOW + k, tmp.x, tmp.y, tmp.z)
          col.set(highlights[id]?.color ?? '#ffffff').multiplyScalar(Math.sin(u * Math.PI))
          cols.setXYZ(i * FLOW + k, col.r, col.g, col.b)
        }
      })
      pos.needsUpdate = true
      cols.needsUpdate = true
    }

    // Beacon.
    if (selected && nodes.has(selected)) {
      beacon.visible = true
      beacon.position.copy(nodes.get(selected)!.anchor)
      beacon.quaternion.copy(camera.quaternion)
      const d = camera.position.distanceTo(beacon.position)
      beacon.scale.setScalar(Math.max(0.6, d * 0.22) * (opts.reducedMotion ? 1 : 1 + 0.08 * Math.sin(t * 3)))
    } else beacon.visible = false

    renderer.render(scene, camera)

    // Labels: highlighted, hovered and selected structures. Far away, hide brain labels to avoid a pile-up.
    // Selected and hovered labels are placed first; any other label that would overlap one already placed is hidden.
    const dist = camera.position.distanceTo(controls.target)
    const w = canvas.clientWidth
    const hgt = canvas.clientHeight
    const order = [...labels.keys()].sort((a, b) => rank(b) - rank(a))
    const placed: [number, number, number, number][] = []
    for (const id of order) {
      const el = labels.get(id)!
      const forced = id === selected || id === hovered
      const show = forced || (highlights[id] && !(dist > 6.5 && BRAIN_IDS.has(id)))
      tmp.copy(nodes.get(id)!.anchor).project(camera)
      const x = ((tmp.x + 1) / 2) * w
      const y = ((1 - tmp.y) / 2) * hgt
      const box: [number, number, number, number] = [x + 12, y - 10, x + 12 + (el.textContent!.length * 6.4 + 26), y + 10]
      const clash = placed.some((r) => box[0] < r[2] && box[2] > r[0] && box[1] < r[3] && box[3] > r[1])
      if (!show || tmp.z > 1 || (clash && !forced)) {
        el.style.display = 'none'
        continue
      }
      placed.push(box)
      el.style.display = ''
      el.style.transform = `translate(${x}px, ${y}px)`
      el.style.zIndex = id === selected ? '3' : id === hovered ? '2' : '1'
    }
  }
  raf = requestAnimationFrame(loop)

  paint()

  return {
    setHighlights(h, source) {
      highlights = h
      paint()
      setFlow(source)
    },
    setSelected(id) {
      selected = id
      paint()
    },
    frame,
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      controls.dispose()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          o.geometry.dispose()
          const m = o.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(m) ? m : [m]).forEach((x) => x.dispose())
        }
      })
      shellMats.forEach((m) => m.dispose())
      renderer.dispose()
      labels.forEach((el) => el.remove())
    },
  }
}
