import { useEffect, useState } from 'react'
import { GRADE_HELP, GRADE_LABEL, NEED_LABEL, PRACTICES, type Pacer, type Practice } from '../data/practices'
import { needs, type Need } from '../scoring'
import { latest, newId, now, setState, useStore } from '../store'

function hashParams() {
  return new URLSearchParams(window.location.hash.split('?')[1] ?? '')
}

function BreathPacer({ pacer }: { pacer: Pacer }) {
  const [running, setRunning] = useState(false)
  const [tick, setTick] = useState(0) // tenths of a second
  useEffect(() => {
    if (!running) return
    const start = Date.now() - tick * 100
    const t = setInterval(() => setTick(Math.floor((Date.now() - start) / 100)), 100)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const cycle = pacer.phases.reduce((a, p) => a + p.seconds, 0)
  let t = (tick / 10) % cycle
  let phase = pacer.phases[0]
  for (const p of pacer.phases) {
    if (t < p.seconds) {
      phase = p
      break
    }
    t -= p.seconds
  }
  const out = /exhale/i.test(phase.label)
  // Lung "fullness" 0–1 so the circle grows across all inhale phases and shrinks on the exhale.
  const inhaleTotal = pacer.phases.filter((p) => !/exhale/i.test(p.label)).reduce((a, p) => a + p.seconds, 0)
  const elapsedInhale = pacer.phases.slice(0, pacer.phases.indexOf(phase)).reduce((a, p) => a + p.seconds, 0) + t
  const fullness = out ? 1 - t / phase.seconds : elapsedInhale / inhaleTotal
  const secs = Math.floor(tick / 10)

  return (
    <div className="pacer">
      <div className="orb-wrap" aria-hidden="true">
        <div className="orb" style={{ transform: `scale(${0.45 + 0.55 * (running ? fullness : 0)})` }} />
      </div>
      <div>
        <p className="phase" aria-live="polite">
          {running ? phase.label : 'Ready when you are'}
        </p>
        <p className="muted">
          {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}
        </p>
        <button className="ghost" onClick={() => setRunning(!running)}>
          {running ? 'Pause' : tick ? 'Resume' : 'Start pacer'}
        </button>
      </div>
    </div>
  )
}

function Card({ p, open, done }: { p: Practice; open: boolean; done: number }) {
  const [logged, setLogged] = useState(false)
  return (
    <details className="card practice" open={open} id={p.id}>
      <summary>
        <span className="pname">{p.name}</span>
        <span className="meta">
          <span className="muted">{p.minutes} min</span>
          <span className={`pill grade-${p.grade}`} title={GRADE_HELP[p.grade]}>
            {GRADE_LABEL[p.grade]}
          </span>
        </span>
      </summary>
      <p>{p.summary}</p>
      <ol>
        {p.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {p.pacer && <BreathPacer pacer={p.pacer} />}
      {p.caution && <p className="notice">{p.caution}</p>}
      <p className="muted small">
        <strong>Evidence.</strong> {p.evidence}
      </p>
      <div className="row">
        <button
          className="ghost"
          onClick={() => {
            setState((s) => ({ ...s, practiceLogs: [...s.practiceLogs, { id: newId(), date: now(), practiceId: p.id }] }))
            setLogged(true)
          }}
        >
          I did this
        </button>
        <span className="muted" role="status">
          {logged ? 'Logged. ' : ''}
          {done > 0 && `Done ${done} time${done === 1 ? '' : 's'}.`}
        </span>
      </div>
    </details>
  )
}

const FILTERS: Need[] = ['ground', 'settle', 'lift', 'sleep', 'process']

export function Practices() {
  const s = useStore()
  const [params, setParams] = useState(hashParams)
  useEffect(() => {
    const on = () => setParams(hashParams())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const [filter, setFilter] = useState<Need | null>((params.get('need') as Need) ?? null)
  const openId = params.get('open')
  useEffect(() => {
    if (openId) document.getElementById(openId)?.scrollIntoView({ block: 'start' })
  }, [openId])

  const want = needs(latest(s.assessments), latest(s.pulses))
  const list = PRACTICES.filter((p) => !filter || p.helps.includes(filter))
  const count = (id: string) => s.practiceLogs.filter((l) => l.practiceId === id).length

  return (
    <>
      <h1>Practices</h1>
      <p>
        Body-first tools for shifting state. Each one carries a rating for how well it has been tested, so you know
        what you are trying.
      </p>
      <div className="lenses" role="group" aria-label="Filter by what you need">
        <button className={`lens ${filter === null ? 'on' : ''}`} onClick={() => setFilter(null)}>
          All
        </button>
        {FILTERS.map((n) => (
          <button key={n} className={`lens ${filter === n ? 'on' : ''}`} onClick={() => setFilter(n)}>
            {NEED_LABEL[n]}
            {want.includes(n) && <span className="dot" title="Fits your current state" />}
          </button>
        ))}
      </div>
      {want.length > 0 && <p className="muted small">A dot marks what fits your latest check-in.</p>}
      {list.map((p) => (
        <Card key={p.id} p={p} open={p.id === openId} done={count(p.id)} />
      ))}
    </>
  )
}
