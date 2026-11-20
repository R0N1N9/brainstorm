import { PRACTICES } from '../data/practices'
import {
  type Band,
  energyConcern,
  gadBand,
  gadTotal,
  needs,
  phqBand,
  phqTotal,
  selfHarmFlag,
  sleepConcern,
  trend,
  whoBand,
  whoScore,
} from '../scoring'
import { latest, useStore, type Assessment } from '../store'
import { CrisisCard } from './Support'

function Spark({ values, max }: { values: number[]; max: number }) {
  if (values.length < 2) return null
  const w = 120
  const h = 32
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * (w - 6) + 3},${h - 3 - (v / max) * (h - 6)}`)
  const [lx, ly] = pts[pts.length - 1].split(',')
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill="currentColor" />
    </svg>
  )
}

const TREND_TEXT = { better: 'Improving', worse: 'Worsening', steady: 'Steady' }

function Domain(p: {
  title: string
  scale: string
  value: number
  max: number
  band: Band
  history: number[]
  threshold: number
  higherIsBetter?: boolean
}) {
  const prev = p.history.length > 1 ? p.history[p.history.length - 2] : undefined
  const t = prev === undefined ? undefined : trend(prev, p.value, p.threshold, p.higherIsBetter)
  return (
    <div className={`card domain tone-${p.band.tone}`}>
      <div className="domain-head">
        <h3>{p.title}</h3>
        <span className="pill">{p.band.label}</span>
      </div>
      <div className="score">
        <strong>{p.value}</strong>
        <span className="muted">
          / {p.max} · {p.scale}
        </span>
      </div>
      <div className="meter" role="img" aria-label={`${p.value} out of ${p.max}`}>
        <div style={{ width: `${(p.value / p.max) * 100}%` }} />
      </div>
      <div className="domain-foot">
        <Spark values={p.history} max={p.max} />
        {t && <span className="muted">{TREND_TEXT[t]} since last review</span>}
      </div>
    </div>
  )
}

function reading(a: Assessment): string[] {
  const out: string[] = []
  const phq = phqTotal(a.phq)
  const gad = gadTotal(a.gad)
  const who = whoScore(a.who)
  if (phq >= 10 || gad >= 10)
    out.push(
      'Your scores are in a range where talking to a doctor or therapist is recommended. Screeners cannot diagnose, but this is the level at which clinicians usually take a closer look.',
    )
  else if (phq >= 5 || gad >= 5 || who <= 50)
    out.push('There are some mild signals here. Small, regular practices and another review in two weeks are a reasonable next step.')
  else out.push('Your scores are in the healthy range. The practices here can help keep it that way.')
  if (sleepConcern(a)) out.push('Sleep stands out. It affects mood and anxiety more quickly than almost anything else, so it is a good place to start.')
  if (energyConcern(a)) out.push('Energy is low. Gentle movement often helps before motivation returns, not after.')
  return out
}

export function Profile() {
  const s = useStore()
  const a = latest(s.assessments)
  const pulse = latest(s.pulses)

  if (!a)
    return (
      <>
        <h1>A map of your mind, drawn by you</h1>
        <section className="card hero">
          <p>
            Braindance helps you notice how you are doing, understand what research says about why, and find body-based
            practices that fit the state you are in. Everything you enter stays on this device.
          </p>
          <a className="button" href="#/checkin">
            Start with a check-in
          </a>
        </section>
        <div className="grid three">
          <a className="card link" href="#/map">
            <h3>Brain map</h3>
            <p className="muted">What stress, sleep, substances and movement are known to do, region by region.</p>
          </a>
          <a className="card link" href="#/timeline">
            <h3>Timeline</h3>
            <p className="muted">Lay out the chapters of your life at your own pace.</p>
          </a>
          <a className="card link" href="#/practices">
            <h3>Practices</h3>
            <p className="muted">Somatic tools, each with an honest evidence rating.</p>
          </a>
        </div>
      </>
    )

  const sorted = [...s.assessments].sort((x, y) => x.date.localeCompare(y.date))
  const phq = phqTotal(a.phq)
  const gad = gadTotal(a.gad)
  const who = whoScore(a.who)
  const want = needs(a, pulse)
  const picks = PRACTICES.filter((p) => p.helps.some((n) => want.includes(n))).slice(0, 3)
  const days = Math.floor((Date.now() - new Date(a.date).getTime()) / 86400000)

  return (
    <>
      <h1>
        Your profile{' '}
        <small className="muted">
          {days === 0 ? 'Reviewed today' : `Last review ${days} day${days === 1 ? '' : 's'} ago`}
        </small>
      </h1>
      {selfHarmFlag(a) && <CrisisCard />}
      {days >= 14 && (
        <p className="notice">
          It has been two weeks. <a href="#/checkin">Take a new review</a> to see how things have moved.
        </p>
      )}
      <div className="grid three">
        <Domain title="Wellbeing" scale="WHO-5" value={who} max={100} band={whoBand(who)} history={sorted.map((x) => whoScore(x.who))} threshold={10} higherIsBetter />
        <Domain title="Low mood" scale="PHQ-9" value={phq} max={27} band={phqBand(phq)} history={sorted.map((x) => phqTotal(x.phq))} threshold={5} />
        <Domain title="Anxiety" scale="GAD-7" value={gad} max={21} band={gadBand(gad)} history={sorted.map((x) => gadTotal(x.gad))} threshold={4} />
      </div>
      <section className="card">
        <h2>What this suggests</h2>
        {reading(a).map((t) => (
          <p key={t}>{t}</p>
        ))}
        <div className="chips">
          <span className={`chip ${sleepConcern(a) ? 'warn' : ''}`}>Sleep: {sleepConcern(a) ? 'worth attention' : 'no concern flagged'}</span>
          <span className={`chip ${energyConcern(a) ? 'warn' : ''}`}>Energy: {energyConcern(a) ? 'worth attention' : 'no concern flagged'}</span>
          {pulse && <span className="chip">Latest snapshot: mood {pulse.mood}/5 · tension {pulse.tension}/5</span>}
        </div>
      </section>
      {picks.length > 0 && (
        <section className="card">
          <h2>Practices that fit this state</h2>
          <div className="grid three">
            {picks.map((p) => (
              <a key={p.id} className="card link inner" href={`#/practices?open=${p.id}`}>
                <h3>{p.name}</h3>
                <p className="muted">
                  {p.minutes} min · {p.summary}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
      <p className="muted">
        Scores use the published cut-offs for each questionnaire. Sleep and energy are single-question signals, not
        validated scales.
      </p>
    </>
  )
}
