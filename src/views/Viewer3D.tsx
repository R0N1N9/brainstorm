import { useEffect, useRef, useState } from 'react'
import { STRUCTURES, type StructureId } from '../data/atlas'
import { createScene, type Highlight, type SceneApi, type ViewName } from '../three/scene'

export interface LegendItem {
  color: string
  label: string
  /** 0–1: rendered as swatch opacity, matching glow strength in the model. */
  strength?: number
}

const NAMES = Object.fromEntries(STRUCTURES.map((s) => [s.id, s.short])) as Record<StructureId, string>
const VIEW_OF = Object.fromEntries(STRUCTURES.map((s) => [s.id, s.view])) as Record<StructureId, ViewName>

export default function Viewer3D(p: {
  highlights: Partial<Record<StructureId, Highlight>>
  source?: StructureId | null
  selected: StructureId | null
  onSelect: (id: StructureId) => void
  legend: LegendItem[]
  label: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const api = useRef<SceneApi | null>(null)
  const onSelect = useRef(p.onSelect)
  onSelect.current = p.onSelect
  const [view, setView] = useState<ViewName>('brain')
  const [hover, setHover] = useState<StructureId | null>(null)
  const [moved, setMoved] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    api.current = createScene(canvas.current!, layer.current!, {
      names: NAMES,
      reducedMotion: reduced,
      onPick: (id) => onSelect.current(id),
      onHover: setHover,
    })
    return () => {
      api.current?.dispose()
      api.current = null
    }
  }, [])

  useEffect(() => api.current?.setHighlights(p.highlights, p.source), [p.highlights, p.source])
  useEffect(() => {
    api.current?.setSelected(p.selected)
    // Bring the selected structure into view if it lives in the other half of the model.
    if (p.selected && VIEW_OF[p.selected] !== view) setView(VIEW_OF[p.selected])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.selected])
  useEffect(() => api.current?.frame(view), [view])

  const hovered = hover && STRUCTURES.find((s) => s.id === hover)

  return (
    <div className="viewer" onPointerDown={() => setMoved(true)}>
      <canvas ref={canvas} role="img" aria-label={p.label} />
      <div ref={layer} className="label-layer" aria-hidden="true" />
      <div className="viewer-top">
        <span className={`hint ${moved ? 'gone' : ''}`}>Drag to rotate · scroll or pinch to zoom · click a part</span>
        <div className="seg small" role="group" aria-label="Camera">
          {(['brain', 'body'] as const).map((v) => (
            <button key={v} className={view === v ? 'on' : ''} aria-pressed={view === v} onClick={() => (setView(v), api.current?.frame(v))}>
              {v === 'brain' ? 'Brain' : 'Whole body'}
            </button>
          ))}
        </div>
      </div>
      {hovered && <div className="hover-name">{hovered.name}</div>}
      {p.legend.length > 0 && (
        <ul className="viewer-legend">
          {p.legend.map((l) => (
            <li key={l.label}>
              <span className="sw" style={{ background: l.color, opacity: 0.35 + 0.65 * (l.strength ?? 1) }} />
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
