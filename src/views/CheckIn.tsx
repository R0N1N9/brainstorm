import { useState } from 'react'
import { INSTRUMENTS, type InstrumentId } from '../data/instruments'
import { newId, now, setState } from '../store'
import { CrisisCard } from './Support'

type Answers = Record<InstrumentId, (number | undefined)[]>

const blank = (): Answers => ({
  who: Array(5).fill(undefined),
  phq: Array(9).fill(undefined),
  gad: Array(7).fill(undefined),
})

function Pulse() {
  const [v, setV] = useState({ mood: 3, energy: 3, tension: 3 })
  const [saved, setSaved] = useState(false)
  const row = (key: keyof typeof v, label: string, lo: string, hi: string) => (
    <label className="slider">
      <span>{label}</span>
      <input
        type="range"
        min={1}
        max={5}
        value={v[key]}
        onChange={(e) => {
          setV({ ...v, [key]: Number(e.target.value) })
          setSaved(false)
        }}
      />
      <small>
        <span>{lo}</span>
        <span>{hi}</span>
      </small>
    </label>
  )
  return (
    <section className="card">
      <h2>Right now</h2>
      <p className="muted">A ten-second snapshot. Use it as often as you like.</p>
      {row('mood', 'Mood', 'Low', 'Good')}
      {row('energy', 'Energy', 'Drained', 'Energised')}
      {row('tension', 'Tension', 'Calm', 'On edge')}
      <button
        onClick={() => {
          setState((s) => ({ ...s, pulses: [...s.pulses, { id: newId(), date: now(), ...v }] }))
          setSaved(true)
        }}
      >
        Save snapshot
      </button>
      {saved && (
        <span className="saved" role="status">
          Saved. <a href="#/practices">See what might help</a>
        </span>
      )}
    </section>
  )
}

export function CheckIn() {
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState(blank)
  const [flag, setFlag] = useState(false)

  if (step === -1)
    return (
      <>
        <h1>Check-in</h1>
        <Pulse />
        <section className="card">
          <h2>Two-week review</h2>
          <p>
            Twenty-one questions from three questionnaires used in clinics and research worldwide: the WHO-5 for
            wellbeing, the PHQ-9 for low mood and the GAD-7 for anxiety. It takes about four minutes. Repeating it
            every two weeks shows how things are moving.
          </p>
          <p className="muted">
            These are screening tools. A high score is a reason to talk to a professional, not a diagnosis.
          </p>
          <button onClick={() => setStep(0)}>Begin</button>
        </section>
      </>
    )

  if (step === INSTRUMENTS.length)
    return (
      <>
        <h1>Check-in saved</h1>
        {flag && <CrisisCard />}
        <section className="card">
          <p>Thank you for taking the time. Your profile has been updated.</p>
          <a className="button" href="#/profile">
            See your profile
          </a>
        </section>
      </>
    )

  const inst = INSTRUMENTS[step]
  const vals = answers[inst.id]
  const done = vals.every((x) => x !== undefined)

  const next = () => {
    if (step < INSTRUMENTS.length - 1) {
      setStep(step + 1)
      window.scrollTo(0, 0)
      return
    }
    const a = {
      id: newId(),
      date: now(),
      who: answers.who as number[],
      phq: answers.phq as number[],
      gad: answers.gad as number[],
    }
    setState((s) => ({ ...s, assessments: [...s.assessments, a] }))
    setFlag(a.phq[8] > 0)
    setStep(INSTRUMENTS.length)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <h1>
        {inst.measures}{' '}
        <small className="muted">
          Part {step + 1} of {INSTRUMENTS.length} · {inst.name}
        </small>
      </h1>
      <p className="stem">{inst.stem}</p>
      {inst.items.map((item, i) => (
        <fieldset key={i} className="card item">
          <legend>{item}</legend>
          <div className="options">
            {inst.options.map((o) => (
              <label key={o.value} className={vals[i] === o.value ? 'on' : ''}>
                <input
                  type="radio"
                  name={`${inst.id}-${i}`}
                  checked={vals[i] === o.value}
                  onChange={() =>
                    setAnswers({ ...answers, [inst.id]: vals.map((x, j) => (j === i ? o.value : x)) })
                  }
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div className="row">
        <button className="ghost" onClick={() => setStep(step - 1)}>
          Back
        </button>
        <button disabled={!done} onClick={next}>
          {step < INSTRUMENTS.length - 1 ? 'Continue' : 'Finish'}
        </button>
        {!done && <span className="muted">Answer every question to continue.</span>}
      </div>
    </>
  )
}
