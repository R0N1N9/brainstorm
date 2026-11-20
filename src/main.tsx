import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { Profile } from './views/Profile'
import { CheckIn } from './views/CheckIn'
import { BrainMap } from './views/BrainMap'
import { Timeline } from './views/Timeline'
import { Practices } from './views/Practices'
import { Data } from './views/Data'
import { Support } from './views/Support'

const TABS = [
  { id: 'profile', label: 'Profile', view: Profile },
  { id: 'checkin', label: 'Check-in', view: CheckIn },
  { id: 'map', label: 'Brain map', view: BrainMap },
  { id: 'timeline', label: 'Timeline', view: Timeline },
  { id: 'practices', label: 'Practices', view: Practices },
  { id: 'data', label: 'Your data', view: Data },
  { id: 'support', label: 'Support', view: Support },
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
  const tab = TABS.find((t) => t.id === route) ?? TABS[0]
  const View = tab.view
  return (
    <>
      <header className="top">
        <a className="brand" href="#/profile">
          braindance
        </a>
        <nav aria-label="Sections">
          {TABS.filter((t) => t.id !== 'support').map((t) => (
            <a key={t.id} href={`#/${t.id}`} aria-current={t.id === tab.id ? 'page' : undefined}>
              {t.label}
            </a>
          ))}
        </nav>
        <a className="help" href="#/support">
          Need help now?
        </a>
      </header>
      <main>
        <View />
      </main>
      <footer>
        Braindance is a self-reflection tool, not a medical device. It cannot diagnose or treat any condition and is
        no substitute for professional care.
      </footer>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
