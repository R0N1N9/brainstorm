import { useSyncExternalStore } from 'react'

// Everything lives in this browser's localStorage. Nothing is sent anywhere.

export interface Assessment {
  id: string
  date: string
  phq: number[]
  gad: number[]
  who: number[]
}

/** Quick daily check-in, each 1 (low) – 5 (high). */
export interface Pulse {
  id: string
  date: string
  mood: number
  energy: number
  tension: number
}

export type EventCategory =
  | 'adversity'
  | 'loss'
  | 'relationship'
  | 'health'
  | 'achievement'
  | 'alcohol'
  | 'cannabis'
  | 'other'

export interface LifeEvent {
  id: string
  age: number
  title: string
  category: EventCategory
  /** -2 very hard … +2 very good */
  impact: number
}

export interface PracticeLog {
  id: string
  date: string
  practiceId: string
}

export interface State {
  assessments: Assessment[]
  pulses: Pulse[]
  events: LifeEvent[]
  practiceLogs: PracticeLog[]
}

const KEY = 'braindance.v1'
const empty: State = { assessments: [], pulses: [], events: [], practiceLogs: [] }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

let state = load()
const listeners = new Set<() => void>()

export function setState(update: (s: State) => State) {
  state = update(state)
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage unavailable (private mode / quota): keep working in memory.
  }
  listeners.forEach((l) => l())
}

export function useStore(): State {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

export const newId = () => crypto.randomUUID()
export const now = () => new Date().toISOString()

export const latest = <T extends { date: string }>(xs: T[]): T | undefined =>
  xs.length ? [...xs].sort((a, b) => a.date.localeCompare(b.date))[xs.length - 1] : undefined

export const replaceAll = (s: State) => setState(() => ({ ...empty, ...s }))
export const eraseAll = () => setState(() => empty)

export function demoState(): State {
  const day = 86400000
  const at = (daysAgo: number) => new Date(Date.now() - daysAgo * day).toISOString()
  const a = (daysAgo: number, phq: number[], gad: number[], who: number[]): Assessment => ({
    id: newId(),
    date: at(daysAgo),
    phq,
    gad,
    who,
  })
  return {
    assessments: [
      a(42, [2, 2, 3, 2, 1, 2, 1, 0, 0], [2, 3, 2, 2, 1, 2, 1], [1, 1, 1, 0, 2]),
      a(28, [2, 1, 2, 2, 1, 1, 1, 0, 0], [2, 2, 2, 2, 1, 1, 1], [2, 1, 2, 1, 2]),
      a(14, [1, 1, 2, 2, 0, 1, 1, 0, 0], [1, 2, 2, 1, 1, 1, 0], [2, 2, 2, 1, 3]),
      a(0, [1, 1, 2, 1, 0, 1, 0, 0, 0], [1, 1, 2, 1, 0, 1, 0], [3, 2, 3, 1, 3]),
    ],
    pulses: [{ id: newId(), date: at(0), mood: 3, energy: 3, tension: 4 }],
    events: [
      { id: newId(), age: 9, title: 'Parents separated', category: 'adversity', impact: -2 },
      { id: newId(), age: 17, title: 'Left home for university', category: 'achievement', impact: 1 },
      { id: newId(), age: 22, title: 'Heavy drinking years', category: 'alcohol', impact: -1 },
      { id: newId(), age: 27, title: 'Lost a close friend', category: 'loss', impact: -2 },
      { id: newId(), age: 31, title: 'Started running', category: 'health', impact: 2 },
    ],
    practiceLogs: [
      { id: newId(), date: at(3), practiceId: 'cyclic-sigh' },
      { id: newId(), date: at(1), practiceId: 'walk' },
    ],
  }
}
