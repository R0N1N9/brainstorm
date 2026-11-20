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
import { latest, useStore, type Assessment, type Pulse } from '../store'
import type { Tone } from '../scoring'
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

const TONE_RANK: Tone[] = ['good', 'watch', 'elevated', 'high']
const HEADLINE: Record<Tone, string> = {
  good: 'Steady',
  watch: 'Mostly steady',
  elevated: 'Some strain',
  high: 'Heavy going',
}

/** Three concentric meters, each fuller when things are better. Values and labels sit beside it as text. */
function StateRing({ rings, tone }: { rings: { label: string; fill: number; tone: Tone }[]; tone: Tone }) {
  return (
    <svg className="ring" viewBox="0 0 200 200" role="img" aria-label={`Overall: ${HEADLINE[tone]}. ${rings.map((r) => `${r.label} ${Math.round(r.fill * 100)}%`).join(', ')}`}>
      {rings.map((r, i) => {
        const rad = 88 - i * 20
        const c = 2 * Math.PI * rad
        return (
          <g key={r.label} className={`tone-${r.tone}`}>
            <circle cx="100" cy="100" r={rad} className="track" />
            <circle
              cx="100"
              cy="100"
              r={rad}
              className="arc"
              strokeDasharray={`${Math.max(0.02, r.fill) * c} ${c}`}
              transform="rotate(-90 100 100)"
            >
              <title>{`${r.label}: ${Math.round(r.fill * 100)}%`}</title>
            </circle>
          </g>
        )
      })}
    </svg>
  )
}

function Week({ pulses, practiceCount, windows }: { pulses: Pulse[]; practiceCount: number; windows: string | null }) {
  const recent = [...pulses].sort((a, b) => a.date.localeCompare(b.date)).slice(-14)
  const series: { key: 'mood' | 'energy' | 'tension'; label: string }[] = [
    { key: 'mood', label: 'Mood' },
    { key: 'energy', label: 'Energy' },
    { key: 'tension', label: 'Tension' },
  ]
  return (
    <section className="card">
      <h2>Lately</h2>
      <div className="grid tiles">
        {series.map((sr) => {
          const vals = recent.map((p) => p[sr.key])
          return (
            <div key={sr.key} className="tile">
              <span className="muted small">{sr.label}</span>
              <strong>{vals.length ? `${vals[vals.length - 1]}/5` : '—'}</strong>
              <Spark values={vals.map((v) => v - 1)} max={4} />
            </div>
          )
        })}
        <div className="tile">
          <span className="muted small">Practices, last 7 days</span>
          <strong>{practiceCount}</strong>
        </div>
        {windows && (
          <div className="tile">
            <span className="muted small">Recovery log</span>
            <strong>{windows}</strong>
          </div>
        )}
      </div>
      {recent.length < 2 && <p className="muted small">Save a snapshot on a few different days to see lines appear here.</p>}
    </section>
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
        <p className="eyebrow">Welcome</p>
        <h1>A map of your mind, drawn by you</h1>
        <section className="card hero">
          <p className="lede">
            Notice how you are doing, understand what research says about why, and find body-based practices that fit
            the state you are in. Everything you enter stays on this device.
          </p>
          <a className="button" href="#/checkin">
            Start with a check-in
          </a>
        </section>
        <div className="grid two">
          <a className="card link" href="#/map">
            <p className="eyebrow">Atlas</p>
            <h3>The nervous system, mapped</h3>
            <p className="muted">Brain, body and chemistry: what stress, sleep, substances and medications are known to do.</p>
          </a>
          <a className="card link" href="#/recovery">
            <p className="eyebrow">Recovery</p>
            <h3>For a sensitised system</h3>
            <p className="muted">When ordinary advice does not apply: support after medication harm or withdrawal.</p>
          </a>
          <a className="card link" href="#/timeline">
            <p className="eyebrow">Timeline</p>
            <h3>The chapters that shaped you</h3>
            <p className="muted">Lay out your life at your own pace and see the patterns.</p>
          </a>
          <a className="card link" href="#/practices">
            <p className="eyebrow">Practices</p>
            <h3>Body-first tools</h3>
            <p className="muted">Somatic practices, each with an honest evidence rating.</p>
          </a>
        </div>
      </>
    )

  const sorted = [...s.assessments].sort((x, y) => x.date.localeCompare(y.date))
  const phq = phqTotal(a.phq)
  const gad = gadTotal(a.gad)
  const who = whoScore(a.who)
  const want = needs(a, pulse, s.sensitive)
  const fitRank = { gentle: 0, adapt: 1, caution: 2 }
  const picks = PRACTICES.filter((p) => p.helps.some((n) => want.includes(n)) && !(s.sensitive && p.sensitive.fit === 'caution'))
    .sort((x, y) => (s.sensitive ? fitRank[x.sensitive.fit] - fitRank[y.sensitive.fit] : 0))
    .slice(0, 3)
  const days = Math.floor((Date.now() - new Date(a.date).getTime()) / 86400000)
  const bands = { who: whoBand(who), phq: phqBand(phq), gad: gadBand(gad) }
  const tone = TONE_RANK[Math.max(...Object.values(bands).map((b) => TONE_RANK.indexOf(b.tone)))]
  const weekAgo = Date.now() - 7 * 86400000
  const practiceCount = s.practiceLogs.filter((l) => new Date(l.date).getTime() >= weekAgo).length
  const recentWaves = s.waves.filter((w) => new Date(w.date).getTime() >= Date.now() - 14 * 86400000)
  const windows = recentWaves.length ? `${recentWaves.filter((w) => w.level <= 1).length} of ${recentWaves.length} days clear` : null

  return (
    <>
      <p className="eyebrow">Profile · {days === 0 ? 'reviewed today' : `reviewed ${days} day${days === 1 ? '' : 's'} ago`}</p>
      <h1>Your mind, lately</h1>
      {selfHarmFlag(a) && <CrisisCard />}
      {days >= 14 && (
        <p className="notice">
          It has been two weeks. <a href="#/checkin">Take a new review</a> to see how things have moved.
        </p>
      )}
      <section className={`card overview tone-${tone}`}>
        <StateRing
          tone={tone}
          rings={[
            { label: 'Wellbeing', fill: who / 100, tone: bands.who.tone },
            { label: 'Mood', fill: 1 - phq / 27, tone: bands.phq.tone },
            { label: 'Calm', fill: 1 - gad / 21, tone: bands.gad.tone },
          ]}
        />
        <div>
          <p className="headline">{HEADLINE[tone]}</p>
          <p className="muted small ring-key">
            Outer ring wellbeing ({bands.who.label.toLowerCase()}) · middle mood ({bands.phq.label.toLowerCase()}) · inner calm (
            {bands.gad.label.toLowerCase()})
          </p>
          {reading(a).map((t) => (
            <p key={t}>{t}</p>
          ))}
          {s.sensitive && (
            <p className="notice">
              You are in sensitive-system mode. These questionnaires overlap with withdrawal symptoms such as poor
              sleep, restlessness and trouble concentrating, so a high score may reflect withdrawal and not your
              original difficulties returning. <a href="#/recovery">More in Recovery.</a>
            </p>
          )}
          <div className="chips">
            <span className={`chip ${sleepConcern(a) ? 'warn' : ''}`}>Sleep: {sleepConcern(a) ? 'worth attention' : 'no concern flagged'}</span>
            <span className={`chip ${energyConcern(a) ? 'warn' : ''}`}>Energy: {energyConcern(a) ? 'worth attention' : 'no concern flagged'}</span>
          </div>
        </div>
      </section>
      <div className="grid three">
        <Domain title="Wellbeing" scale="WHO-5" value={who} max={100} band={bands.who} history={sorted.map((x) => whoScore(x.who))} threshold={10} higherIsBetter />
        <Domain title="Low mood" scale="PHQ-9" value={phq} max={27} band={bands.phq} history={sorted.map((x) => phqTotal(x.phq))} threshold={5} />
        <Domain title="Anxiety" scale="GAD-7" value={gad} max={21} band={bands.gad} history={sorted.map((x) => gadTotal(x.gad))} threshold={4} />
      </div>
      <Week pulses={s.pulses} practiceCount={practiceCount} windows={windows} />
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
      <p className="muted small">
        Rings are fuller when things are better. Scores use the published cut-offs for each questionnaire; sleep and
        energy are single-question signals, not validated scales.
      </p>
    </>
  )
}
