import { useState } from 'react'
import { EVIDENCE, GROUPS, LAYERS, STRUCTURES, type GroupId, type Layer, type StructureId } from '../data/atlas'
import { gadTotal, phqTotal, sleepConcern } from '../scoring'
import { latest, useStore, type State } from '../store'

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
}

const TONE: Record<GroupId, string> = {
  systems: 'accent',
  medication: 'accent',
  experience: 'strain',
  withdrawal: 'strain',
  support: 'support',
}

/** Layers that connect to what the person has recorded, with the reason. */
function relevant(s: State): Record<string, string> {
  const out: Record<string, string> = {}
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

function Canvas(p: {
  view: 'brain' | 'body'
  layer: Layer
  selected: StructureId
  hover: StructureId | null
  onSelect: (id: StructureId) => void
  onHover: (id: StructureId | null) => void
}) {
  const nodes = STRUCTURES.filter((s) => s.view === p.view)
  const src = p.layer.source
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
          .filter((n) => p.layer.effects[n.id] && n.id !== src)
          .map((n) => {
            const [x, y] = POS[n.id]
            const mx = (origin[0] + x) / 2 + (y - origin[1]) * 0.12
            const my = (origin[1] + y) / 2 - (x - origin[0]) * 0.12
            return <path key={n.id} className="pathway" d={`M${origin[0]} ${origin[1]} Q${mx} ${my} ${x} ${y}`} />
          })}
      {nodes.map((n) => {
        const [x, y, side] = POS[n.id]
        const hit = p.layer.effects[n.id]
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
            aria-label={`${n.name}${hit ? `: ${hit.note}` : ''}`}
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

function initialLayer(rel: Record<string, string>, sensitive: boolean): string {
  const asked = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('layer')
  if (asked && LAYERS.some((l) => l.id === asked)) return asked
  if (sensitive) return 'ad-withdrawal'
  return Object.keys(rel)[0] ?? 'sympathetic'
}

export function Atlas() {
  const s = useStore()
  const rel = relevant(s)
  const [layerId, setLayerId] = useState(() => initialLayer(rel, s.sensitive))
  const layer = LAYERS.find((l) => l.id === layerId)!
  const [picked, setPicked] = useState<StructureId | null>(null)
  const [hover, setHover] = useState<StructureId | null>(null)
  const hits = STRUCTURES.filter((x) => layer.effects[x.id])
  const selected = picked ?? layer.source ?? hits[0].id
  const structure = STRUCTURES.find((x) => x.id === selected)!
  const effect = layer.effects[selected]
  const elsewhere = LAYERS.filter((l) => l.id !== layer.id && l.effects[selected])
  const group = GROUPS.find((g) => g.id === layer.group)!

  const pick = (id: string, keep = false) => {
    setLayerId(id)
    if (!keep) setPicked(null)
  }

  return (
    <>
      <p className="eyebrow">Atlas</p>
      <h1>The nervous system, mapped</h1>
      <p className="lede">
        Twenty-nine structures across brain and body, seen through {LAYERS.length} lenses. This is a map of research,
        not a scan of you: it shows what studies and clinical description associate with each experience, and nothing
        here can tell you what has happened in your own body.
      </p>

      <div className="tabs" role="tablist" aria-label="Kind of lens">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={g.id === layer.group}
            className={g.id === layer.group ? 'on' : ''}
            onClick={() => pick(LAYERS.find((l) => l.group === g.id)!.id)}
          >
            {g.name}
          </button>
        ))}
      </div>
      <div className="lenses" role="group" aria-label={group.blurb}>
        {LAYERS.filter((l) => l.group === layer.group).map((l) => (
          <button key={l.id} className={`lens ${l.id === layer.id ? 'on' : ''}`} aria-pressed={l.id === layer.id} onClick={() => pick(l.id)}>
            {l.name}
            {rel[l.id] && <span className="mark" title={`Connected to ${rel[l.id]}`} />}
          </button>
        ))}
      </div>

      <section className={`card atlas tone-${TONE[layer.group]}`}>
        <div className="canvases">
          <Canvas view="brain" layer={layer} selected={selected} hover={hover} onSelect={setPicked} onHover={setHover} />
          <Canvas view="body" layer={layer} selected={selected} hover={hover} onSelect={setPicked} onHover={setHover} />
        </div>
        <ul className="legend" aria-label="How to read the markers">
          {(Object.keys(EVIDENCE) as (keyof typeof EVIDENCE)[]).map((k) => (
            <li key={k} title={EVIDENCE[k].help}>
              <svg viewBox="0 0 20 20" width="16" height="16" className={`node hit ${k}`} aria-hidden="true">
                <circle className="dot" cx="10" cy="10" r="7" />
              </svg>
              {EVIDENCE[k].label}
            </li>
          ))}
        </ul>
      </section>

      <div className="atlas-detail">
        <div>
          <section className="card">
            <p className="eyebrow">{group.name}</p>
            <h2>{layer.name}</h2>
            {rel[layer.id] && <p className="pill">Connected to {rel[layer.id]}</p>}
            <p>{layer.summary}</p>
            {layer.group === 'withdrawal' && (
              <p className="notice">
                Never stop or change a medication because of something you read here. Reductions are safest planned
                with a prescriber. <a href="#/recovery">Recovery has more.</a>
              </p>
            )}
            <p className="muted small">Sources: {layer.sources.join(' · ')}</p>
          </section>
          <section className="card focus">
            <p className="eyebrow">{structure.view === 'brain' ? 'Brain' : 'Body'}</p>
            <h2>{structure.name}</h2>
            <p className="muted">{structure.role}</p>
            {effect ? (
              <>
                <p>{effect.note}</p>
                <span className={`pill ev-${effect.evidence}`} title={EVIDENCE[effect.evidence].help}>
                  {EVIDENCE[effect.evidence].label}
                </span>
              </>
            ) : (
              <p className="muted">Not part of this lens.</p>
            )}
            {elsewhere.length > 0 && (
              <>
                <h3 className="sub">Also appears in</h3>
                <div className="lenses tight">
                  {elsewhere.map((l) => (
                    <button key={l.id} className="lens small" onClick={() => pick(l.id, true)}>
                      {l.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
        <section className="card">
          <h2>Everything in this lens</h2>
          {(['brain', 'body'] as const).map((v) => {
            const rows = hits.filter((h) => h.view === v)
            if (!rows.length) return null
            return (
              <div key={v}>
                <h3 className="sub">{v === 'brain' ? 'Brain' : 'Body'}</h3>
                <ul className="effects">
                  {rows.map((h) => {
                    const e = layer.effects[h.id]!
                    return (
                      <li key={h.id}>
                        <button
                          className={`effect ${selected === h.id ? 'on' : ''}`}
                          onClick={() => setPicked(h.id)}
                          onMouseEnter={() => setHover(h.id)}
                          onMouseLeave={() => setHover(null)}
                        >
                          <strong>{h.name}</strong>
                          <span>{e.note}</span>
                          <small className="muted">{EVIDENCE[e.evidence].label}</small>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </section>
      </div>
    </>
  )
}
