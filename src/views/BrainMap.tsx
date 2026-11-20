import { useState, type ReactElement } from 'react'
import { EVIDENCE_LABEL, LENSES, REGIONS, type LensId, type RegionId } from '../data/brain'
import { gadTotal, phqTotal, sleepConcern } from '../scoring'
import { latest, useStore, type State } from '../store'

// Schematic side view, front of the head to the left. Deep structures are
// drawn where they sit behind the surface; positions are illustrative.
const SHAPES: Record<RegionId, (p: React.SVGProps<SVGPathElement & SVGEllipseElement>) => ReactElement> = {
  pfc: (p) => <path d="M98 205 C92 140 130 88 190 70 C205 110 205 190 180 250 C140 255 105 240 98 205 Z" {...p} />,
  acc: (p) => <path d="M215 150 C240 112 300 108 335 128 L325 150 C298 136 258 140 238 166 Z" {...p} />,
  insula: (p) => <ellipse cx="305" cy="195" rx="36" ry="22" {...p} />,
  striatum: (p) => <ellipse cx="238" cy="212" rx="24" ry="19" {...p} />,
  hypothalamus: (p) => <ellipse cx="292" cy="246" rx="18" ry="13" {...p} />,
  amygdala: (p) => <ellipse cx="252" cy="264" rx="17" ry="13" {...p} />,
  hippocampus: (p) => <ellipse cx="352" cy="252" rx="44" ry="13" transform="rotate(-12 352 252)" {...p} />,
  brainstem: (p) => <path d="M318 282 C330 276 352 276 362 284 L384 388 C372 398 352 398 342 390 Z" {...p} />,
  cerebellum: (p) => <ellipse cx="462" cy="316" rx="68" ry="44" {...p} />,
}

const LABEL_AT: Record<RegionId, [number, number]> = {
  pfc: [146, 170],
  acc: [278, 134],
  insula: [305, 199],
  striatum: [238, 216],
  hypothalamus: [292, 250],
  amygdala: [252, 268],
  hippocampus: [352, 256],
  brainstem: [352, 345],
  cerebellum: [462, 320],
}

const SHORT: Record<RegionId, string> = {
  pfc: 'PFC',
  acc: 'ACC',
  insula: 'Ins',
  striatum: 'Rwd',
  hypothalamus: 'Hyp',
  amygdala: 'Amy',
  hippocampus: 'Hipp',
  brainstem: 'Stem',
  cerebellum: 'Cbl',
}

/** Lenses that connect to what the person has recorded, with the reason. */
function relevant(s: State): Partial<Record<LensId, string>> {
  const out: Partial<Record<LensId, string>> = {}
  const a = latest(s.assessments)
  if (a && (phqTotal(a.phq) >= 10 || gadTotal(a.gad) >= 10)) out.stress = 'your latest review'
  if (a && sleepConcern(a)) out.sleep = 'your latest review'
  for (const e of s.events) {
    if (e.category === 'adversity' && e.age < 18) out.adversity = 'your timeline'
    if (e.category === 'alcohol') out.alcohol = 'your timeline'
    if (e.category === 'cannabis') out.cannabis = 'your timeline'
  }
  if (s.practiceLogs.some((l) => ['walk', 'strength', 'yoga'].includes(l.practiceId))) out.exercise = 'your practice log'
  if (s.practiceLogs.some((l) => ['cyclic-sigh', 'slow-breath', 'body-scan'].includes(l.practiceId))) out.breath = 'your practice log'
  return out
}

export function BrainMap() {
  const s = useStore()
  const rel = relevant(s)
  const [lensId, setLensId] = useState<LensId>((Object.keys(rel)[0] as LensId) ?? 'stress')
  const lens = LENSES.find((l) => l.id === lensId)!
  const [regionId, setRegionId] = useState<RegionId | null>(null)
  const active = regionId && lens.effects[regionId] ? regionId : (Object.keys(lens.effects)[0] as RegionId)
  const region = REGIONS.find((r) => r.id === (regionId ?? active))!
  const effect = lens.effects[region.id]

  return (
    <>
      <h1>Brain map</h1>
      <p className="notice">
        This is a map of research, not a scan of you. It shows what studies of large groups associate with each
        experience. Nothing here can tell you what has happened in your own brain, and brains keep changing throughout
        life.
      </p>
      <div className="lenses" role="tablist" aria-label="Lens">
        {LENSES.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={l.id === lensId}
            className={`lens ${l.kind} ${l.id === lensId ? 'on' : ''}`}
            onClick={() => {
              setLensId(l.id)
              setRegionId(null)
            }}
          >
            {l.name}
            {rel[l.id] && <span className="dot" title={`Connected to ${rel[l.id]}`} />}
          </button>
        ))}
      </div>
      <div className="map-layout">
        <svg className={`brain ${lens.kind}`} viewBox="60 40 500 370" role="group" aria-label="Schematic brain, side view">
          <clipPath id="skull">
            <path d="M92 212 C80 120 170 52 300 52 C430 52 522 112 526 200 C528 244 506 270 470 276 C430 268 396 280 372 288 C340 300 300 300 268 292 C200 300 100 292 92 212 Z" />
          </clipPath>
          <path
            className="outline"
            d="M92 212 C80 120 170 52 300 52 C430 52 522 112 526 200 C528 244 506 270 470 276 C430 268 396 280 372 288 C340 300 300 300 268 292 C200 300 100 292 92 212 Z"
          />
          {REGIONS.map((r) => {
            const hit = lens.effects[r.id]
            const Shape = SHAPES[r.id]
            return (
              <g key={r.id} clipPath={r.id === 'pfc' ? 'url(#skull)' : undefined}>
                <Shape
                  className={`region ${hit ? `hit ${hit.evidence}` : ''} ${region.id === r.id ? 'sel' : ''}`}
                  tabIndex={0}
                  role="button"
                  aria-label={r.name}
                  onClick={() => setRegionId(r.id)}
                  onKeyDown={(e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && setRegionId(r.id)}
                />
                <text x={LABEL_AT[r.id][0]} y={LABEL_AT[r.id][1]} className="rlabel">
                  {SHORT[r.id]}
                </text>
              </g>
            )
          })}
        </svg>
        <div>
          <section className="card">
            <h2>{lens.name}</h2>
            {rel[lens.id] && <p className="pill">Connected to {rel[lens.id]}</p>}
            <p>{lens.summary}</p>
          </section>
          <section className="card">
            <h3>{region.name}</h3>
            <p className="muted">{region.role}</p>
            {effect ? (
              <>
                <p>{effect.note}</p>
                <span className={`pill ev-${effect.evidence}`}>{EVIDENCE_LABEL[effect.evidence]}</span>
              </>
            ) : (
              <p className="muted">No well-established association with {lens.name.toLowerCase()}.</p>
            )}
          </section>
          <p className="muted small">Sources: {lens.sources.join(' · ')}</p>
        </div>
      </div>
    </>
  )
}
