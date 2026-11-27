import { lazy, Suspense, useMemo, useState } from 'react'
import { EVIDENCE, GROUPS, LAYERS, STRUCTURES, type Evidence, type GroupId, type StructureId } from '../data/atlas'
import {
  ACTION_LABEL, CLASSES, DRUGS, LEVEL_LABEL, TARGETS, drugById, drugSites, interactions, sharedTargets,
  type Drug, type TargetId,
} from '../data/pharm'
import { gadTotal, phqTotal, sleepConcern } from '../scoring'
import { latest, useStore, type State } from '../store'
import { webglAvailable } from '../three/gl'
import type { Highlight } from '../three/scene'
import { Canvas2D } from './Atlas2D'
import type { LegendItem } from './Viewer3D'
import { BASIS_LABEL } from '../data/recovery'
import { REVERSAL, SIDE_EFFECTS, SYSTEMS, effectById, effectsForDrug } from '../data/sideEffects'

const Viewer3D = lazy(() => import('./Viewer3D'))

type Mode = 'lens' | 'meds' | 'combine' | 'effects'

// Validated categorical palette, dark steps (the viewer is always dark).
const SERIES = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#0ca30c', '#9085e9', '#e66767']
const GROUP_COLOR: Record<GroupId, string> = {
  systems: '#6fa3ef',
  medication: '#6fa3ef',
  experience: '#ef8a6c',
  withdrawal: '#ef8a6c',
  support: '#4fd1b5',
}
const EVIDENCE_STRENGTH: Record<Evidence, number> = { consistent: 1, mixed: 0.7, preliminary: 0.4, reported: 0.4 }
const BY_ID = Object.fromEntries(STRUCTURES.map((s) => [s.id, s])) as Record<StructureId, (typeof STRUCTURES)[number]>

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

const params = () => new URLSearchParams(window.location.hash.split('?')[1] ?? '')

function writeUrl(q: Record<string, string>) {
  const qs = new URLSearchParams(q).toString()
  try {
    history.replaceState(null, '', `#/map?${qs}`)
  } catch {
    // Sandboxed frames may block history; the page still works.
  }
}

const targetColor = (d: Drug) => Object.fromEntries(d.targets.map((x, i) => [x.t, SERIES[i % SERIES.length]])) as Record<TargetId, string>

function Dots({ n }: { n: number }) {
  return (
    <span className="dots" aria-label={['', 'weak', 'moderate', 'strong'][n]}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? 'on' : ''} />
      ))}
    </span>
  )
}

/** The model, or a flat fallback when WebGL is unavailable. */
function Model(p: {
  highlights: Partial<Record<StructureId, Highlight>>
  source?: StructureId | null
  selected: StructureId
  onSelect: (id: StructureId) => void
  legend: LegendItem[]
  label: string
}) {
  const [gl] = useState(webglAvailable)
  const [hover, setHover] = useState<StructureId | null>(null)
  if (!gl) {
    const effects = Object.fromEntries(Object.keys(p.highlights).map((k) => [k, { evidence: 'consistent' as Evidence }]))
    return (
      <div className="card flat">
        <p className="muted small">3D needs WebGL, which this browser has turned off. Showing a flat map instead.</p>
        <div className="canvases">
          {(['brain', 'body'] as const).map((v) => (
            <Canvas2D key={v} view={v} effects={effects} source={p.source ?? undefined} selected={p.selected} hover={hover} onSelect={p.onSelect} onHover={setHover} />
          ))}
        </div>
      </div>
    )
  }
  return (
    <Suspense fallback={<div className="viewer loading">Loading the 3D model…</div>}>
      <Viewer3D {...p} />
    </Suspense>
  )
}

function StructureList(p: {
  rows: { id: StructureId; note: string; meta: string; color: string }[]
  selected: StructureId
  onSelect: (id: StructureId) => void
  title: string
}) {
  return (
    <section className="card">
      <h2>{p.title}</h2>
      {(['brain', 'body'] as const).map((v) => {
        const rows = p.rows.filter((r) => BY_ID[r.id].view === v)
        if (!rows.length) return null
        return (
          <div key={v}>
            <h3 className="sub">{v === 'brain' ? 'Brain' : 'Body'}</h3>
            <ul className="effects">
              {rows.map((r) => (
                <li key={r.id}>
                  <button
                    className={`effect ${p.selected === r.id ? 'on' : ''}`}
                    style={{ borderLeftColor: r.color }}
                    onClick={() => {
                      p.onSelect(r.id)
                      document.querySelector('.viewer')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
                    }}
                  >
                    <strong>{BY_ID[r.id].name}</strong>
                    <span>{r.note}</span>
                    <small className="muted">{r.meta}</small>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}

function Focus({ id, children }: { id: StructureId; children: React.ReactNode }) {
  const s = BY_ID[id]
  return (
    <section className="card focus">
      <p className="eyebrow">{s.view === 'brain' ? 'Brain' : 'Body'}</p>
      <h2>{s.name}</h2>
      <p className="muted">{s.role}</p>
      {children}
    </section>
  )
}

// ───────────── Lens mode

function LensMode({ rel, initial }: { rel: Record<string, string>; initial: string }) {
  const [layerId, setLayerId] = useState(initial)
  const layer = LAYERS.find((l) => l.id === layerId)!
  const group = GROUPS.find((g) => g.id === layer.group)!
  const hits = STRUCTURES.filter((x) => layer.effects[x.id])
  const [picked, setPicked] = useState<StructureId | null>(null)
  const selected = picked ?? layer.source ?? hits[0].id
  const effect = layer.effects[selected]
  const elsewhere = LAYERS.filter((l) => l.id !== layer.id && l.effects[selected])
  const color = GROUP_COLOR[layer.group]

  const pick = (id: string, keep = false) => {
    setLayerId(id)
    writeUrl({ layer: id })
    if (!keep) setPicked(null)
  }

  const highlights = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(layer.effects).map(([k, e]) => [k, { color, strength: EVIDENCE_STRENGTH[e!.evidence] }]),
      ) as Partial<Record<StructureId, Highlight>>,
    [layer, color],
  )

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Kind of lens">
        {GROUPS.map((g) => (
          <button key={g.id} role="tab" aria-selected={g.id === layer.group} className={g.id === layer.group ? 'on' : ''} onClick={() => pick(LAYERS.find((l) => l.group === g.id)!.id)}>
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
      <div className="atlas3d">
        <Model
          highlights={highlights}
          source={layer.source}
          selected={selected}
          onSelect={setPicked}
          label={`3D model of the nervous system showing ${layer.name}: ${hits.map((h) => h.name).join(', ')}.`}
          legend={(['consistent', 'mixed', 'preliminary'] as Evidence[]).map((e) => ({
            color,
            strength: EVIDENCE_STRENGTH[e],
            label: e === 'preliminary' ? 'Early or reported only' : EVIDENCE[e].label,
          }))}
        />
        <div className="side-panel">
          <section className="card">
            <p className="eyebrow">{group.name}</p>
            <h2>{layer.name}</h2>
            {rel[layer.id] && <p className="pill">Connected to {rel[layer.id]}</p>}
            <p>{layer.summary}</p>
            {layer.group === 'withdrawal' && (
              <p className="notice">
                Never stop or change a medication because of something you read here. Reductions are safest planned with
                a prescriber. <a href="#/recovery">Recovery has more.</a>
              </p>
            )}
            <p className="muted small">Sources: {layer.sources.join(' · ')}</p>
          </section>
          <Focus id={selected}>
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
          </Focus>
        </div>
      </div>
      <StructureList
        title="Everything in this lens"
        selected={selected}
        onSelect={setPicked}
        rows={hits.map((h) => ({ id: h.id, note: layer.effects[h.id]!.note, meta: EVIDENCE[layer.effects[h.id]!.evidence].label, color }))}
      />
    </>
  )
}

// ───────────── Medication mode

function DrugPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const drug = drugById(value)!
  const [cls, setCls] = useState(drug.cls)
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const list = query
    ? DRUGS.filter((d) => `${d.name} ${d.brands}`.toLowerCase().includes(query))
    : DRUGS.filter((d) => d.cls === cls)
  return (
    <div className="picker">
      <input
        type="search"
        className="search"
        placeholder="Find a medication or brand name"
        aria-label="Find a medication"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {!query && (
        <div className="tabs" role="tablist" aria-label="Medication class">
          {CLASSES.map((c) => (
            <button key={c.id} role="tab" aria-selected={c.id === cls} className={c.id === cls ? 'on' : ''} onClick={() => setCls(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
      )}
      <div className="lenses">
        {list.map((d) => (
          <button key={d.id} className={`lens ${d.id === value ? 'on' : ''}`} aria-pressed={d.id === value} onClick={() => onChange(d.id)}>
            {d.name}
          </button>
        ))}
        {!list.length && <span className="muted">Not in this atlas yet.</span>}
      </div>
    </div>
  )
}

function MedMode({ initial, onCombine, onEffect }: { initial: string; onCombine: (id: string) => void; onEffect: (id: string) => void }) {
  const [drugId, setDrugId] = useState(initial)
  const drug = drugById(drugId)!
  const sites = useMemo(() => drugSites(drug), [drug])
  const colors = targetColor(drug)
  const ranked = [...sites.entries()].sort((a, b) => b[1][0].weight - a[1][0].weight)
  const [picked, setPicked] = useState<StructureId | null>(null)
  const selected = picked ?? ranked[0][0]
  const here = sites.get(selected)

  const highlights = useMemo(
    () =>
      Object.fromEntries(
        [...sites.entries()].map(([id, list]) => [
          id,
          { color: colors[list[0].t], strength: Math.max(0.4, list[0].weight / 3), label: list.map((x) => TARGETS[x.t].short).join(' + ') },
        ]),
      ) as Partial<Record<StructureId, Highlight>>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sites],
  )

  const choose = (id: string) => {
    setDrugId(id)
    setPicked(null)
    writeUrl({ mode: 'meds', drug: id })
  }

  return (
    <>
      <DrugPicker value={drugId} onChange={choose} />
      <div className="atlas3d">
        <Model
          highlights={highlights}
          selected={selected}
          onSelect={setPicked}
          label={`3D model showing where ${drug.name} acts: ${ranked.map(([id]) => BY_ID[id].name).join(', ')}.`}
          legend={drug.targets.map((x) => ({ color: colors[x.t], label: `${TARGETS[x.t].short} · ${ACTION_LABEL[x.action]}` }))}
        />
        <div className="side-panel">
          <section className="card">
            <p className="eyebrow">{CLASSES.find((c) => c.id === drug.cls)!.name}</p>
            <h2>{drug.name}</h2>
            <p className="muted small">{drug.brands}</p>
            <dl className="facts">
              <dt>Used for</dt>
              <dd>{drug.uses}</dd>
              <dt>Half-life</dt>
              <dd>{drug.halfLife}</dd>
            </dl>
            <h3 className="sub">Where it acts</h3>
            <ul className="targets">
              {drug.targets.map((x) => (
                <li key={x.t}>
                  <span className="sw" style={{ background: colors[x.t] }} />
                  <div>
                    <strong>
                      {ACTION_LABEL[x.action][0].toUpperCase() + ACTION_LABEL[x.action].slice(1)} {TARGETS[x.t].name}
                    </strong>{' '}
                    <Dots n={x.weight} />
                    <p className="muted small">{TARGETS[x.t].does}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <Focus id={selected}>
            {here ? (
              here.map((x) => (
                <p key={x.t}>
                  <span className="sw inline" style={{ background: colors[x.t] }} />
                  <strong>{TARGETS[x.t].short}.</strong> {x.note}
                </p>
              ))
            ) : (
              <p className="muted">{drug.name} has no well-described action here.</p>
            )}
          </Focus>
        </div>
      </div>
      <div className="grid two">
        <section className="card">
          <h2>What people notice</h2>
          <ul className="plain chips-list">
            {drug.effects.map((e) => (
              <li key={e} className="chip">
                {e}
              </li>
            ))}
          </ul>
          {effectsForDrug(drug.id).length > 0 && (
            <>
              <h3 className="sub">Mapped in 3D</h3>
              <div className="lenses tight">
                {effectsForDrug(drug.id).map((e) => (
                  <button key={e.id} className="lens small" onClick={() => onEffect(e.id)}>
                    {e.name}
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="notice">{drug.safety}</p>
        </section>
        <section className="card">
          <h2>Coming off</h2>
          <p>{drug.stopping}</p>
          <p className="muted small">
            Plan any change with a prescriber. <a href="#/recovery">Recovery</a> covers withdrawal and what helps.
          </p>
          <button className="ghost" onClick={() => onCombine(drug.id)}>
            Combine with another medication
          </button>
        </section>
      </div>
      <StructureList
        title={`Everywhere ${drug.name} reaches`}
        selected={selected}
        onSelect={setPicked}
        rows={ranked.map(([id, list]) => ({
          id,
          note: list[0].note,
          meta: list.map((x) => `${TARGETS[x.t].short} (${ACTION_LABEL[x.action]})`).join(' · '),
          color: colors[list[0].t],
        }))}
      />
      <p className="muted small">
        Strength dots show how much each target contributes at usual doses, simplified from receptor-binding data.
        Effects vary with dose and between people.
      </p>
    </>
  )
}

// ───────────── Combine mode

const PAIR = { a: SERIES[0], b: SERIES[1], both: SERIES[2] }

function DrugSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <label className="select">
      <span className="muted small">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {CLASSES.map((c) => (
          <optgroup key={c.id} label={c.name}>
            {DRUGS.filter((d) => d.cls === c.id).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}

function CombineMode({ initialA, initialB }: { initialA: string; initialB: string }) {
  const [aId, setA] = useState(initialA)
  const [bId, setB] = useState(initialB)
  const a = drugById(aId)!
  const b = drugById(bId)!
  const sa = useMemo(() => drugSites(a), [a])
  const sb = useMemo(() => drugSites(b), [b])
  const ids = [...new Set([...sa.keys(), ...sb.keys()])]
  const kind = (id: StructureId) => (sa.has(id) && sb.has(id) ? 'both' : sa.has(id) ? 'a' : 'b')
  const found = interactions(a, b)
  const shared = sharedTargets(a, b)
  const [picked, setPicked] = useState<StructureId | null>(null)
  const selected = picked ?? ids.find((id) => kind(id) === 'both') ?? ids[0]

  const update = (na: string, nb: string) => {
    setA(na)
    setB(nb)
    setPicked(null)
    writeUrl({ mode: 'combine', a: na, b: nb })
  }

  const highlights = useMemo(
    () =>
      Object.fromEntries(
        ids.map((id) => {
          const k = kind(id)
          return [id, { color: PAIR[k], strength: k === 'both' ? 1 : 0.7, label: k === 'both' ? 'both' : k === 'a' ? a.name : b.name }]
        }),
      ) as Partial<Record<StructureId, Highlight>>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sa, sb],
  )

  const order = { avoid: 0, caution: 1, monitor: 2, note: 3 }
  const sorted = [...found].sort((x, y) => order[x.level] - order[y.level])
  const notes = (id: StructureId) => [
    ...(sa.get(id) ?? []).map((x) => ({ who: a.name, ...x })),
    ...(sb.get(id) ?? []).map((x) => ({ who: b.name, ...x })),
  ]

  return (
    <>
      <div className="pair">
        <DrugSelect label="First medication" value={aId} onChange={(v) => update(v, bId)} />
        <button className="ghost swap" aria-label="Swap" onClick={() => update(bId, aId)}>
          ⇄
        </button>
        <DrugSelect label="Second medication" value={bId} onChange={(v) => update(aId, v)} />
      </div>
      <div className="atlas3d">
        <Model
          highlights={highlights}
          selected={selected}
          onSelect={setPicked}
          label={`3D model comparing where ${a.name} and ${b.name} act.`}
          legend={[
            { color: PAIR.a, label: `${a.name} only` },
            { color: PAIR.b, label: `${b.name} only` },
            { color: PAIR.both, label: 'Both' },
          ]}
        />
        <div className="side-panel">
          <section className="card">
            <p className="eyebrow">Together</p>
            <h2>
              {a.name} + {b.name}
            </h2>
            {a.id === b.id ? (
              <p className="muted">Pick two different medications.</p>
            ) : sorted.length ? (
              <ul className="interactions">
                {sorted.map((x) => (
                  <li key={x.title} className={`lvl-${x.level}`}>
                    <span className="pill">{LEVEL_LABEL[x.level]}</span>
                    <strong>{x.title}</strong>
                    <p>{x.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No interaction is flagged by the mechanisms this atlas models — which is not the same as none.</p>
            )}
            {shared.length > 0 && (
              <p className="muted small">Shared targets: {shared.map((t) => TARGETS[t].name).join(', ')}.</p>
            )}
            <p className="notice small">
              This models a handful of well-established mechanisms only. It is not an interaction checker and does not
              cover alcohol, other medicines, supplements, doses or health conditions. Ask a pharmacist before
              combining or changing anything.
            </p>
          </section>
          <Focus id={selected}>
            {notes(selected).map((x) => (
              <p key={x.who + x.t}>
                <strong>
                  {x.who} · {TARGETS[x.t].short}.
                </strong>{' '}
                {x.note}
              </p>
            ))}
          </Focus>
        </div>
      </div>
      <StructureList
        title="Where they act"
        selected={selected}
        onSelect={setPicked}
        rows={ids
          .sort((x, y) => ['both', 'a', 'b'].indexOf(kind(x)) - ['both', 'a', 'b'].indexOf(kind(y)))
          .map((id) => ({
            id,
            note: notes(id).map((x) => `${x.who}: ${x.note}`).join(' '),
            meta: kind(id) === 'both' ? 'Both' : kind(id) === 'a' ? `${a.name} only` : `${b.name} only`,
            color: PAIR[kind(id)],
          }))}
      />
    </>
  )
}

// ───────────── Side-effect mode

const ROLE = { starts: SERIES[0], felt: SERIES[1], both: SERIES[2] }

function EffectMode({ initial, onDrug }: { initial: string; onDrug: (id: string) => void }) {
  const [effectId, setEffectId] = useState(initial)
  const fx = effectById(effectId)!
  const [system, setSystem] = useState(fx.system)
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const list = query
    ? SIDE_EFFECTS.filter((e) => `${e.name} ${e.drugs.join(' ')}`.toLowerCase().includes(query))
    : SIDE_EFFECTS.filter((e) => e.system === system)
  const ids = [...new Set([...Object.keys(fx.starts), ...Object.keys(fx.felt)])] as StructureId[]
  const role = (id: StructureId) => (fx.starts[id] && fx.felt[id] ? 'both' : fx.starts[id] ? 'starts' : 'felt')
  const source = Object.keys(fx.starts)[0] as StructureId
  const [picked, setPicked] = useState<StructureId | null>(null)
  const selected = picked ?? (Object.keys(fx.felt)[0] as StructureId)

  const choose = (id: string) => {
    setEffectId(id)
    setPicked(null)
    writeUrl({ mode: 'effects', effect: id })
  }

  const highlights = useMemo(
    () =>
      Object.fromEntries(
        ids.map((id) => {
          const r = role(id)
          return [id, { color: ROLE[r], strength: r === 'felt' ? 0.8 : 1, label: r === 'both' ? 'starts & felt' : r === 'starts' ? 'starts' : 'felt' }]
        }),
      ) as Partial<Record<StructureId, Highlight>>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fx],
  )

  const notes = (id: StructureId) =>
    [fx.starts[id] && { k: 'Where it starts', t: fx.starts[id]! }, fx.felt[id] && { k: 'Where it is felt', t: fx.felt[id]! }].filter(Boolean) as {
      k: string
      t: string
    }[]

  return (
    <>
      <div className="picker">
        <input
          type="search"
          className="search"
          placeholder="Find a side effect or medication"
          aria-label="Find a side effect"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {!query && (
          <div className="tabs" role="tablist" aria-label="Body system">
            {SYSTEMS.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === system} className={x.id === system ? 'on' : ''} onClick={() => setSystem(x.id)}>
                {x.name}
              </button>
            ))}
          </div>
        )}
        <div className="lenses">
          {list.map((e) => (
            <button key={e.id} className={`lens ${e.id === effectId ? 'on' : ''}`} aria-pressed={e.id === effectId} onClick={() => choose(e.id)}>
              {e.name}
            </button>
          ))}
          {!list.length && <span className="muted">Nothing mapped for that yet.</span>}
        </div>
      </div>
      <div className="atlas3d">
        <Model
          highlights={highlights}
          source={source}
          selected={selected}
          onSelect={setPicked}
          label={`3D model of ${fx.name}: starts in ${Object.keys(fx.starts).map((k) => BY_ID[k as StructureId].name).join(', ')}; felt in ${Object.keys(fx.felt).map((k) => BY_ID[k as StructureId].name).join(', ')}.`}
          legend={[
            { color: ROLE.starts, label: 'Where it starts' },
            { color: ROLE.felt, label: 'Where it is felt' },
            ...(ids.some((id) => role(id) === 'both') ? [{ color: ROLE.both, label: 'Both' }] : []),
          ]}
        />
        <div className="side-panel">
          <section className="card">
            <p className="eyebrow">{SYSTEMS.find((x) => x.id === fx.system)!.name}</p>
            <h2>{fx.name}</h2>
            <span className={`pill rev-${fx.reversal}`} title={REVERSAL[fx.reversal].help}>
              {REVERSAL[fx.reversal].label}
            </span>
            <h3 className="sub">How it happens</h3>
            <p>{fx.how}</p>
            <h3 className="sub">Typical course</h3>
            <p>{fx.course}</p>
            <h3 className="sub">Can it be reversed?</h3>
            <p>{fx.reverse}</p>
            {fx.urgent && <p className="notice urgent-note">{fx.urgent}</p>}
          </section>
          <Focus id={selected}>
            {notes(selected).length ? (
              notes(selected).map((n) => (
                <p key={n.k}>
                  <strong>{n.k}.</strong> {n.t}
                </p>
              ))
            ) : (
              <p className="muted">Not part of this side effect.</p>
            )}
          </Focus>
        </div>
      </div>
      <div className="grid two">
        <section className="card">
          <h2>What helps</h2>
          <ul className="tips">
            {fx.helps.map((h) => (
              <li key={h.text}>
                <span>{h.text}</span>
                <small className={`basis b-${h.basis}`}>{BASIS_LABEL[h.basis]}</small>
              </li>
            ))}
          </ul>
          <p className="muted small">Any change to a medication belongs with the prescriber.</p>
        </section>
        <section className="card">
          <h2>Commonly caused by</h2>
          <div className="lenses tight">
            {fx.drugs.map((id) => (
              <button key={id} className="lens small" onClick={() => onDrug(id)}>
                {drugById(id)!.name}
              </button>
            ))}
          </div>
          {fx.targets.length > 0 && (
            <p className="muted small">Through: {fx.targets.map((t) => TARGETS[t].name).join(', ')}.</p>
          )}
          <p className="muted small">The list covers medicines in this atlas only. Sources: {fx.sources.join(' · ')}</p>
        </section>
      </div>
      <StructureList
        title="Where it happens"
        selected={selected}
        onSelect={setPicked}
        rows={ids.map((id) => ({
          id,
          note: notes(id).map((n) => n.t).join(' '),
          meta: role(id) === 'both' ? 'Starts and felt here' : role(id) === 'starts' ? 'Where it starts' : 'Where it is felt',
          color: ROLE[role(id)],
        }))}
      />
    </>
  )
}

// ───────────── Page

export function Atlas() {
  const s = useStore()
  const rel = relevant(s)
  const q = params()
  const m = q.get('mode')
  const initialMode: Mode = m === 'meds' || q.get('drug') ? 'meds' : m === 'combine' ? 'combine' : m === 'effects' || q.get('effect') ? 'effects' : 'lens'
  const [mode, setMode] = useState<Mode>(initialMode)
  const asked = q.get('layer')
  const layer = asked && LAYERS.some((l) => l.id === asked) ? asked : s.sensitive ? 'ad-withdrawal' : (Object.keys(rel)[0] ?? 'sympathetic')
  const [drug, setDrug] = useState(() => (drugById(q.get('drug') ?? '') ? q.get('drug')! : 'sertraline'))
  const [effect, setEffect] = useState(() => (effectById(q.get('effect') ?? '') ? q.get('effect')! : 'blunting'))
  const [[ca, cb], setPair] = useState(() => [
    drugById(q.get('a') ?? '') ? q.get('a')! : 'sertraline',
    drugById(q.get('b') ?? '') ? q.get('b')! : 'quetiapine',
  ])

  const switchTo = (m: Mode) => {
    setMode(m)
    writeUrl(m === 'lens' ? { layer } : m === 'meds' ? { mode: 'meds', drug } : m === 'effects' ? { mode: 'effects', effect } : { mode: 'combine', a: ca, b: cb })
  }

  return (
    <>
      <p className="eyebrow">Atlas</p>
      <h1>The nervous system, in three dimensions</h1>
      <p className="lede">
        {STRUCTURES.length} structures across brain and body. Explore how systems are wired, what life and
        medications do to them, where side effects start and how they reverse, and how two medications meet. A map
        of research, not a scan of you.
      </p>
      <div className="seg" role="tablist" aria-label="What to explore">
        {(
          [
            ['lens', 'Systems & experiences'],
            ['meds', 'Medications'],
            ['effects', 'Side effects'],
            ['combine', 'Combine two'],
          ] as const
        ).map(([m, label]) => (
          <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'on' : ''} onClick={() => switchTo(m)}>
            {label}
          </button>
        ))}
      </div>
      {mode === 'lens' && <LensMode rel={rel} initial={layer} />}
      {mode === 'meds' && (
        <MedMode
          initial={drug}
          onCombine={(id) => {
            const other = id === 'sertraline' ? 'quetiapine' : 'sertraline'
            setPair([id, other])
            setMode('combine')
            writeUrl({ mode: 'combine', a: id, b: other })
            window.scrollTo(0, 0)
          }}
          onEffect={(id) => {
            setEffect(id)
            setMode('effects')
            writeUrl({ mode: 'effects', effect: id })
            window.scrollTo(0, 0)
          }}
        />
      )}
      {mode === 'effects' && (
        <EffectMode
          initial={effect}
          onDrug={(id) => {
            setDrug(id)
            setMode('meds')
            writeUrl({ mode: 'meds', drug: id })
            window.scrollTo(0, 0)
          }}
        />
      )}
      {mode === 'combine' && <CombineMode initialA={ca} initialB={cb} />}
      <p className="muted small">
        The model is stylised: positions are anatomically plausible but simplified, and each structure stands for a
        larger region or network.
      </p>
    </>
  )
}
