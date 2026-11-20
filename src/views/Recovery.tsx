import { useState } from 'react'
import { PRACTICES } from '../data/practices'
import { AGGRAVATES, BASIS_LABEL, HELPS, KNOWN, RESOURCES, SYMPTOMS, WAVE_LEVELS, type Tip } from '../data/recovery'
import { newId, now, setState, useStore, type WaveLog } from '../store'

const dayKey = (iso: string) => iso.slice(0, 10)

function WaveChart({ logs }: { logs: WaveLog[] }) {
  // One bar per calendar day for the last 30 days; the latest entry of a day wins.
  const byDay = new Map(logs.map((l) => [dayKey(l.date), l]))
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000)
    return { d, log: byDay.get(dayKey(d.toISOString())) }
  })
  const logged = days.filter((x) => x.log)
  const windows = logged.filter((x) => x.log!.level <= 1).length
  const W = 600
  const H = 120
  const bw = W / 30
  return (
    <figure className="chart">
      <figcaption>
        <strong>Last 30 days</strong>
        <span className="muted">
          {logged.length ? `${windows} of ${logged.length} logged days were windows` : 'No days logged yet'}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H + 22}`} role="img" aria-label={`Symptom intensity by day. ${windows} of ${logged.length} logged days were windows.`}>
        {[0, 2, 4].map((lv) => (
          <g key={lv}>
            <line x1="0" x2={W} y1={H - (lv / 4) * (H - 12)} y2={H - (lv / 4) * (H - 12)} className="grid" />
          </g>
        ))}
        {days.map(({ d, log }, i) => {
          const x = i * bw + 2
          if (!log) return <rect key={i} x={x} y={H - 2} width={bw - 4} height="2" className="empty" />
          const h = 6 + (log.level / 4) * (H - 18)
          return (
            <rect key={i} x={x} y={H - h} width={bw - 4} height={h} rx="3" className={`bar lv${log.level}`}>
              <title>{`${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${WAVE_LEVELS[log.level]}${log.symptoms.length ? ` — ${log.symptoms.join(', ')}` : ''}`}</title>
            </rect>
          )
        })}
        <text x="0" y={H + 16} className="tick">
          {days[0].d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </text>
        <text x={W} y={H + 16} className="tick" textAnchor="end">
          Today
        </text>
      </svg>
      <p className="muted small">Shorter, paler bars are windows; taller, darker bars are waves. Hover a bar for the day’s detail.</p>
    </figure>
  )
}

function Log() {
  const { waves } = useStore()
  const [level, setLevel] = useState<number | null>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const toggle = (x: string) => {
    setSymptoms(symptoms.includes(x) ? symptoms.filter((y) => y !== x) : [...symptoms, x])
    setSaved(false)
  }
  return (
    <section className="card">
      <h2>How is today?</h2>
      <p className="muted">
        Recovery from withdrawal is rarely a straight line. People describe waves of symptoms with clearer windows
        between them, and the windows tend to lengthen over time. Logging makes that visible.
      </p>
      <div className="options" role="radiogroup" aria-label="Today">
        {WAVE_LEVELS.map((l, i) => (
          <label key={l} className={level === i ? 'on' : ''}>
            <input
              type="radio"
              name="wave"
              checked={level === i}
              onChange={() => {
                setLevel(i)
                setSaved(false)
              }}
            />
            {l}
          </label>
        ))}
      </div>
      <details className="symptoms">
        <summary>Add symptoms{symptoms.length ? ` (${symptoms.length})` : ''}</summary>
        {SYMPTOMS.map((g) => (
          <div key={g.system} className="symptom-row">
            <span className="muted small">{g.system}</span>
            <div className="options">
              {g.items.map((x) => (
                <label key={x} className={symptoms.includes(x) ? 'on' : ''}>
                  <input type="checkbox" checked={symptoms.includes(x)} onChange={() => toggle(x)} />
                  {x}
                </label>
              ))}
            </div>
          </div>
        ))}
      </details>
      <div className="row">
        <button
          disabled={level === null}
          onClick={() => {
            const today = dayKey(now())
            setState((s) => ({
              ...s,
              waves: [...s.waves.filter((w) => dayKey(w.date) !== today), { id: newId(), date: now(), level: level!, symptoms }],
            }))
            setSaved(true)
          }}
        >
          Save today
        </button>
        {saved && (
          <span role="status">
            Saved.{' '}
            {level! >= 3 ? (
              <a href="#/practices?open=wave-card">Open “Riding a wave”</a>
            ) : (
              'Windows are worth noticing too.'
            )}
          </span>
        )}
      </div>
      <WaveChart logs={waves} />
    </section>
  )
}

const Tips = ({ title, tips }: { title: string; tips: Tip[] }) => (
  <section className="card">
    <h2>{title}</h2>
    <ul className="tips">
      {tips.map((t) => (
        <li key={t.text}>
          <span>{t.text}</span>
          <small className={`basis b-${t.basis}`}>{BASIS_LABEL[t.basis]}</small>
        </li>
      ))}
    </ul>
  </section>
)

export function Recovery() {
  const s = useStore()
  const gentle = PRACTICES.filter((p) => p.sensitive.fit === 'gentle')
  return (
    <>
      <p className="eyebrow">Recovery</p>
      <h1>When your nervous system has been knocked off balance</h1>
      <p className="lede">
        For people who are struggling after starting, changing or coming off a psychiatric medication. Ordinary
        wellbeing advice often assumes a nervous system that can take a push. A sensitised one needs a different
        approach: less input, smaller steps, more time.
      </p>

      <section className="card urgent">
        <h2>First, three things</h2>
        <ul className="plain spaced">
          <li>
            <strong>Do not stop or change a dose suddenly.</strong> Abrupt changes are the best-established cause of
            severe withdrawal, and with benzodiazepines they can cause seizures. Plan any change with a prescriber.
          </li>
          <li>
            <strong>Get help today</strong> if you have unbearable restlessness, thoughts of ending your life, a
            seizure, confusion or a very high temperature. <a href="#/support">Crisis lines are here.</a>
          </li>
          <li>
            <strong>This is information, not treatment.</strong> The research in this area is young. Each item below
            is labelled with the kind of evidence behind it, and much of it is the experience of people who have been
            through this.
          </li>
        </ul>
      </section>

      <section className={`card mode ${s.sensitive ? 'on' : ''}`}>
        <div>
          <h2>Sensitive-system mode</h2>
          <p className="muted">
            Puts gentle practices first, shows how to adapt the rest, flags the ones that often backfire, and reads
            your scores with withdrawal in mind.
          </p>
        </div>
        <label className="switch">
          <input type="checkbox" checked={s.sensitive} onChange={(e) => setState((st) => ({ ...st, sensitive: e.target.checked }))} />
          <span aria-hidden="true" />
          {s.sensitive ? 'On' : 'Off'}
        </label>
      </section>

      <Log />

      <section className="card">
        <h2>Gentle practices</h2>
        <div className="grid three">
          {gentle.map((p) => (
            <a key={p.id} className="card link inner" href={`#/practices?open=${p.id}`}>
              <h3>{p.name}</h3>
              <p className="muted">
                {p.minutes} min · {p.summary}
              </p>
            </a>
          ))}
        </div>
      </section>

      <div className="grid two">
        <Tips title="What tends to help" tips={HELPS} />
        <Tips title="What often makes it worse" tips={AGGRAVATES} />
      </div>

      <section className="card">
        <h2>What is known</h2>
        {KNOWN.map((k) => (
          <details key={k.title} className="fact">
            <summary>
              <span>{k.title}</span>
              <small className={`basis b-${k.basis}`}>{BASIS_LABEL[k.basis]}</small>
            </summary>
            <p>{k.body}</p>
            <p className="muted small">
              {k.source}
              {k.layer && (
                <>
                  {' · '}
                  <a href={`#/map?layer=${k.layer}`}>See it on the atlas</a>
                </>
              )}
            </p>
          </details>
        ))}
      </section>

      <section className="card">
        <h2>Talking to a prescriber</h2>
        <ul className="plain spaced">
          <li>Bring dates: when each dose changed and when each symptom began. Your log and timeline can help.</li>
          <li>Describe the physical symptoms first. They are what most clearly separate withdrawal from relapse.</li>
          <li>Ask about a slower, proportional taper and about liquid or smaller-dose formulations.</li>
          <li>If you are not heard, you can ask for a second opinion or bring the guidance below with you.</li>
        </ul>
      </section>

      <section className="card">
        <h2>Further help</h2>
        <ul className="plain spaced">
          {RESOURCES.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.name}
              </a>
              <br />
              <span className="muted">{r.what}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
