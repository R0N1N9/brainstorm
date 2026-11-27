import type { Evidence, StructureId } from '../data/atlas'
import { STRUCTURES } from '../data/atlas'

// Flat fallback for browsers without WebGL: a side view of the brain and a
// front view of the body with the same structures as the 3D model.

type Side = 't' | 'b' | 'l' | 'r'

// Illustrative positions on a side view of the brain (front to the left) and a
// front view of the body. Deep structures are shown where they sit behind the surface.
const POS: Record<StructureId, [number, number, Side]> = {
  dlpfc: [150, 135, 'b'],
  vmpfc: [128, 232, 'b'],
  acc: [232, 148, 't'],
  motor: [318, 66, 'b'],
  insula: [296, 180, 't'],
  dstr: [258, 206, 'l'],
  nacc: [224, 240, 'l'],
  thalamus: [326, 212, 'r'],
  hypothalamus: [286, 248, 't'],
  pituitary: [272, 302, 'l'],
  amygdala: [238, 272, 'l'],
  hippocampus: [358, 256, 'r'],
  midbrain: [338, 300, 'l'],
  lc: [368, 322, 'r'],
  raphe: [344, 340, 'l'],
  vestibular: [390, 350, 'r'],
  medulla: [366, 380, 'r'],
  cerebellum: [478, 300, 't'],
  vagus: [172, 112, 'r'],
  lungs: [124, 160, 'l'],
  heart: [166, 172, 'r'],
  spinal: [150, 208, 'l'],
  symp: [128, 236, 'l'],
  adrenal: [174, 250, 'r'],
  gut: [150, 288, 'r'],
  pelvic: [150, 326, 'r'],
  muscle: [118, 400, 'l'],
  peripheral: [66, 296, 'b'],
  skin: [228, 240, 'r'],
  thyroid: [134, 104, 'l'],
  liver: [112, 262, 'l'],
  kidney: [182, 272, 'r'],
}

export function Canvas2D(p: {
  view: 'brain' | 'body'
  effects: Partial<Record<StructureId, { evidence: Evidence; note?: string }>>
  source?: StructureId
  selected: StructureId
  hover: StructureId | null
  onSelect: (id: StructureId) => void
  onHover: (id: StructureId | null) => void
}) {
  const nodes = STRUCTURES.filter((s) => s.view === p.view)
  const src = p.source
  const srcView = src && STRUCTURES.find((s) => s.id === src)!.view
  // Pathways start at the source structure; in the body view a brain source enters at the head.
  const origin: [number, number] | null = !src
    ? null
    : srcView === p.view
      ? [POS[src][0], POS[src][1]]
      : p.view === 'body'
        ? [150, 62]
        : null

  return (
    <svg
      className={`canvas ${p.view}`}
      viewBox={p.view === 'brain' ? '50 30 500 390' : '0 0 300 520'}
      role="group"
      aria-label={p.view === 'brain' ? 'Brain, side view, front to the left' : 'Body, front view'}
    >
      {p.view === 'brain' ? (
        <g className="anatomy">
          <path d="M92 212 C80 120 170 52 300 52 C430 52 522 112 526 200 C528 244 506 270 470 276 C430 268 396 280 372 288 C340 300 300 300 268 292 C200 300 100 292 92 212 Z" />
          <path d="M312 280 C330 274 358 274 374 282 L400 398 C386 408 366 408 352 402 Z" />
          <ellipse cx="468" cy="312" rx="72" ry="46" />
          <path className="detail" d="M196 196 C204 128 300 104 372 136 C400 150 408 176 398 196" />
          <path className="detail" d="M214 198 C224 150 300 130 356 152" />
          <path className="detail" d="M300 54 C308 84 312 104 306 124 M400 76 C392 104 398 124 412 140 M168 86 C176 110 172 128 160 144 M452 120 C440 150 446 180 462 200" />
          <path className="detail" d="M410 304 C440 296 498 300 528 316 M408 322 C440 316 500 320 532 332 M414 340 C446 338 492 342 520 348" />
        </g>
      ) : (
        <g className="anatomy">
          <circle cx="150" cy="48" r="30" />
          <path d="M134 80 L134 96 C112 100 90 104 80 122 L58 290 C54 306 72 310 76 294 L98 168 L100 300 L96 500 L140 500 L148 334 L152 334 L160 500 L204 500 L200 300 L202 168 L224 294 C228 310 246 306 242 290 L220 122 C210 104 188 100 166 96 L166 80 Z" />
          <path className="detail" d="M150 78 L150 318" />
          <path className="detail" d="M160 80 C176 110 180 150 168 180 C160 220 170 260 156 290" />
        </g>
      )}
      {origin &&
        nodes
          .filter((n) => p.effects[n.id] && n.id !== src)
          .map((n) => {
            const [x, y] = POS[n.id]
            const mx = (origin[0] + x) / 2 + (y - origin[1]) * 0.12
            const my = (origin[1] + y) / 2 - (x - origin[0]) * 0.12
            return <path key={n.id} className="pathway" d={`M${origin[0]} ${origin[1]} Q${mx} ${my} ${x} ${y}`} />
          })}
      {nodes.map((n) => {
        const [x, y, side] = POS[n.id]
        const hit = p.effects[n.id]
        const sel = p.selected === n.id
        const show = hit || sel || p.hover === n.id
        const lx = side === 'l' ? x - 14 : side === 'r' ? x + 14 : x
        const ly = side === 't' ? y - 15 : side === 'b' ? y + 24 : y + 4
        return (
          <g
            key={n.id}
            className={`node ${hit ? `hit ${hit.evidence}` : ''} ${sel ? 'sel' : ''} ${n.id === src ? 'src' : ''}`}
            tabIndex={0}
            role="button"
            aria-label={`${n.name}${hit?.note ? `: ${hit.note}` : ''}`}
            aria-pressed={sel}
            onClick={() => p.onSelect(n.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), p.onSelect(n.id))}
            onMouseEnter={() => p.onHover(n.id)}
            onMouseLeave={() => p.onHover(null)}
          >
            <circle className="halo" cx={x} cy={y} r="17" />
            <circle className="dot" cx={x} cy={y} r={hit ? 9 : 5} />
            {show && (
              <text x={lx} y={ly} textAnchor={side === 'l' ? 'end' : side === 'r' ? 'start' : 'middle'}>
                {n.short}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

