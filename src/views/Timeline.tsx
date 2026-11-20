import { useState } from 'react'
import { newId, setState, useStore, type EventCategory } from '../store'

const CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'adversity', label: 'Hard time or adversity' },
  { id: 'loss', label: 'Loss' },
  { id: 'relationship', label: 'Relationship' },
  { id: 'health', label: 'Health or body' },
  { id: 'achievement', label: 'Achievement or turning point' },
  { id: 'alcohol', label: 'Period of heavy drinking' },
  { id: 'cannabis', label: 'Period of heavy cannabis use' },
  { id: 'other', label: 'Other' },
]

const IMPACT = [
  { v: -2, label: 'Very hard' },
  { v: -1, label: 'Hard' },
  { v: 0, label: 'Mixed' },
  { v: 1, label: 'Good' },
  { v: 2, label: 'Very good' },
]

export function Timeline() {
  const { events } = useStore()
  const [form, setForm] = useState({ age: '', title: '', category: 'other' as EventCategory, impact: 0 })
  const sorted = [...events].sort((a, b) => a.age - b.age)
  const maxAge = Math.max(40, ...sorted.map((e) => e.age + 5))
  const W = 720
  const x = (age: number) => 30 + (age / maxAge) * (W - 60)
  const y = (impact: number) => 80 - impact * 28
  const valid = form.title.trim() && form.age !== '' && Number(form.age) >= 0 && Number(form.age) <= 120

  return (
    <>
      <h1>Timeline</h1>
      <section className="card">
        <p>
          Lay out the chapters that shaped you — the hard ones and the good ones. Seeing them in order often shows
          patterns that are hard to notice from inside.
        </p>
        <p className="notice">
          Go gently. A few words are enough; you do not need to describe what happened. If something feels like too
          much, stop and use a <a href="#/practices?need=ground">grounding practice</a>. The hardest memories are best
          worked through with a trauma-trained therapist.
        </p>
      </section>

      {sorted.length > 0 && (
        <section className="card">
          <svg className="lifeline" viewBox={`0 0 ${W} 170`} role="img" aria-label="Life events by age and impact">
            <line x1="30" x2={W - 30} y1="80" y2="80" className="axis" />
            {Array.from({ length: Math.floor(maxAge / 10) + 1 }, (_, i) => i * 10).map((age) => (
              <text key={age} x={x(age)} y="160" className="tick">
                {age}
              </text>
            ))}
            {sorted.map((e) => (
              <g key={e.id}>
                <line x1={x(e.age)} x2={x(e.age)} y1="80" y2={y(e.impact)} className="stem-line" />
                <circle cx={x(e.age)} cy={y(e.impact)} r="7" className={e.impact < 0 ? 'neg' : e.impact > 0 ? 'pos' : 'neu'}>
                  <title>{`${e.title} (age ${e.age})`}</title>
                </circle>
              </g>
            ))}
          </svg>
          <ul className="events">
            {sorted.map((e) => (
              <li key={e.id}>
                <span className="age">Age {e.age}</span>
                <span>
                  {e.title}
                  <small className="muted"> · {CATEGORIES.find((c) => c.id === e.category)?.label}</small>
                </span>
                <button
                  className="ghost small"
                  aria-label={`Remove ${e.title}`}
                  onClick={() => setState((s) => ({ ...s, events: s.events.filter((x) => x.id !== e.id) }))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="muted">
            Events you tag as early adversity or substance use are highlighted on the <a href="#/map">brain map</a>.
          </p>
        </section>
      )}

      <form
        className="card form"
        onSubmit={(ev) => {
          ev.preventDefault()
          if (!valid) return
          setState((s) => ({
            ...s,
            events: [...s.events, { id: newId(), age: Number(form.age), title: form.title.trim(), category: form.category, impact: form.impact }],
          }))
          setForm({ ...form, age: '', title: '' })
        }}
      >
        <h2>Add a chapter</h2>
        <label>
          A few words
          <input value={form.title} maxLength={80} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Moved cities" />
        </label>
        <label>
          Your age at the time
          <input type="number" min={0} max={120} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        </label>
        <label>
          Kind
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>How it felt overall</legend>
          <div className="options">
            {IMPACT.map((o) => (
              <label key={o.v} className={form.impact === o.v ? 'on' : ''}>
                <input type="radio" name="impact" checked={form.impact === o.v} onChange={() => setForm({ ...form, impact: o.v })} />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
        <button disabled={!valid}>Add to timeline</button>
      </form>
    </>
  )
}
