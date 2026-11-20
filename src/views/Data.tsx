import { useRef, useState } from 'react'
import { demoState, eraseAll, replaceAll, useStore, type State } from '../store'

export function Data() {
  const s = useStore()
  const file = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [confirming, setConfirming] = useState(false)
  const empty = !s.assessments.length && !s.pulses.length && !s.events.length && !s.practiceLogs.length && !s.waves.length

  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `braindance-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const restore = async (f: File) => {
    try {
      const parsed = JSON.parse(await f.text()) as State
      if (!Array.isArray(parsed.assessments) || !Array.isArray(parsed.events)) throw new Error()
      replaceAll(parsed)
      setMsg('Backup restored.')
    } catch {
      setMsg('That file is not a Braindance backup.')
    }
  }

  return (
    <>
      <p className="eyebrow">Your data</p>
      <h1>Yours, and only on this device</h1>
      <section className="card">
        <h2>Where it lives</h2>
        <p>
          Everything you enter is stored in this browser on this device. There is no account, no server and no
          analytics. Nobody else can read it, including the people who make Braindance. Clearing your browser data
          erases it, so keep a backup if it matters to you.
        </p>
        <ul className="plain">
          <li>{s.assessments.length} two-week reviews</li>
          <li>{s.pulses.length} snapshots</li>
          <li>{s.events.length} timeline chapters</li>
          <li>{s.practiceLogs.length} practice sessions</li>
          <li>{s.waves.length} recovery log days</li>
        </ul>
        <div className="row">
          <button onClick={download} disabled={empty}>
            Download backup
          </button>
          <button className="ghost" onClick={() => file.current?.click()}>
            Restore from backup
          </button>
          <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])} />
        </div>
        {msg && <p role="status">{msg}</p>}
      </section>
      <section className="card">
        <h2>Try it with sample data</h2>
        <p className="muted">Fills the app with a fictional person’s history so you can look around.</p>
        <button
          className="ghost"
          disabled={!empty}
          onClick={() => {
            replaceAll(demoState())
            setMsg('Sample data loaded.')
          }}
        >
          Load sample data
        </button>
        {!empty && <span className="muted"> Erase your data first to load the sample.</span>}
      </section>
      <section className="card">
        <h2>Erase everything</h2>
        {confirming ? (
          <div className="row">
            <span>This cannot be undone.</span>
            <button
              className="danger"
              onClick={() => {
                eraseAll()
                setConfirming(false)
                setMsg('All data erased.')
              }}
            >
              Erase all data
            </button>
            <button className="ghost" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="ghost" disabled={empty} onClick={() => setConfirming(true)}>
            Erase all data…
          </button>
        )}
      </section>
    </>
  )
}
