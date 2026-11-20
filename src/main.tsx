import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { Profile } from './views/Profile'
import { CheckIn } from './views/CheckIn'
import { Atlas } from './views/Atlas'
import { Recovery } from './views/Recovery'
import { useStore } from './store'
import { Timeline } from './views/Timeline'
import { Practices } from './views/Practices'
import { Data } from './views/Data'
import { Support } from './views/Support'

const TABS = [
  { id: 'profile', label: 'Profile', view: Profile, icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18M12 8v4l3 2' },
  { id: 'checkin', label: 'Check-in', view: CheckIn, icon: 'M5 12l4 4L19 7' },
  { id: 'map', label: 'Atlas', view: Atlas, icon: 'M12 4v16M12 8c-4 0-6-1-6-4M12 8c4 0 6-1 6-4M12 14c-4 0-6 2-6 6M12 14c4 0 6 2 6 6' },
  { id: 'timeline', label: 'Timeline', view: Timeline, icon: 'M3 12h18M7 12V7M13 12v5M18 12V8' },
  { id: 'practices', label: 'Practices', view: Practices, icon: 'M3 12c3-6 6-6 9 0s6 6 9 0' },
  { id: 'recovery', label: 'Recovery', view: Recovery, icon: 'M12 20V10M12 10c0-4-3-6-7-6c0 4 3 6 7 6M12 14c0-3 3-5 7-5c0 4-3 5-7 5' },
  { id: 'data', label: 'Your data', view: Data, icon: 'M6 10V7a6 6 0 0 1 12 0v3M5 10h14v10H5z' },
  { id: 'support', label: 'Support', view: Support, icon: '' },
] as const

const current = () => window.location.hash.replace(/^#\/?/, '').split('?')[0] || 'profile'

function App() {
  const [route, setRoute] = useState(current)
  useEffect(() => {
    const onHash = () => {
      setRoute(current())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const { sensitive } = useStore()
  const tab = TABS.find((t) => t.id === route) ?? TABS[0]
  const View = tab.view
  return (
    <div className="shell">
      <header className="side">
        <a className="brand" href="#/profile">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12c3-5 6-5 9 0s6 5 9 0" />
          </svg>
          braindance
        </a>
        <nav aria-label="Sections">
          {TABS.filter((t) => t.id !== 'support').map((t) => (
            <a key={t.id} href={`#/${t.id}`} aria-current={t.id === tab.id ? 'page' : undefined}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d={t.icon} />
              </svg>
              {t.label}
            </a>
          ))}
        </nav>
        <div className="side-foot">
          {sensitive && (
            <a className="mode-flag" href="#/recovery">
              Sensitive-system mode
            </a>
          )}
          <a className="help" href="#/support">
            Need help now?
          </a>
        </div>
      </header>
      <div className="page">
        <main>
          <View />
        </main>
        <footer>
          Braindance is a self-reflection tool, not a medical device. It cannot diagnose or treat any condition and is
          no substitute for professional care.
        </footer>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
