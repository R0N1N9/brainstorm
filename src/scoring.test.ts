import { describe, expect, it } from 'vitest'
import { GAD7, PHQ9, WHO5 } from './data/instruments'
import { LENSES, REGIONS } from './data/brain'
import { PRACTICES } from './data/practices'
import { gadBand, needs, phqBand, selfHarmFlag, sleepConcern, trend, whoBand, whoScore } from './scoring'
import type { Assessment } from './store'

const a = (over: Partial<Assessment> = {}): Assessment => ({
  id: 'x',
  date: '2026-01-01T00:00:00Z',
  phq: Array(9).fill(0),
  gad: Array(7).fill(0),
  who: Array(5).fill(5),
  ...over,
})

describe('instruments', () => {
  it('have the published number of items', () => {
    expect(PHQ9.items).toHaveLength(9)
    expect(GAD7.items).toHaveLength(7)
    expect(WHO5.items).toHaveLength(5)
  })
})

describe('bands', () => {
  it('PHQ-9 cut-offs at 5/10/15/20', () => {
    expect([4, 5, 9, 10, 14, 15, 19, 20, 27].map((n) => phqBand(n).label)).toEqual([
      'Minimal', 'Mild', 'Mild', 'Moderate', 'Moderate', 'Moderately severe', 'Moderately severe', 'Severe', 'Severe',
    ])
  })
  it('GAD-7 cut-offs at 5/10/15', () => {
    expect([4, 5, 9, 10, 14, 15].map((n) => gadBand(n).label)).toEqual(['Minimal', 'Mild', 'Mild', 'Moderate', 'Moderate', 'Severe'])
  })
  it('WHO-5 is raw × 4 with cut-offs at 28 and 50', () => {
    expect(whoScore([5, 5, 5, 5, 5])).toBe(100)
    expect(whoScore([1, 2, 1, 2, 1])).toBe(28)
    expect([28, 32, 50, 52, 72].map((n) => whoBand(n).tone)).toEqual(['high', 'elevated', 'elevated', 'watch', 'good'])
  })
})

describe('flags and needs', () => {
  it('flags any non-zero answer to PHQ-9 item 9', () => {
    expect(selfHarmFlag(a())).toBe(false)
    expect(selfHarmFlag(a({ phq: [0, 0, 0, 0, 0, 0, 0, 0, 1] }))).toBe(true)
  })
  it('detects a sleep concern from either screener', () => {
    expect(sleepConcern(a({ phq: [0, 0, 2, 0, 0, 0, 0, 0, 0] }))).toBe(true)
    expect(sleepConcern(a({ who: [5, 5, 5, 1, 5] }))).toBe(true)
    expect(sleepConcern(a())).toBe(false)
  })
  it('suggests nothing when all is well and grounding first when anxiety is severe', () => {
    expect(needs(a(), undefined)).toEqual([])
    expect(needs(a({ gad: Array(7).fill(3) }), undefined)[0]).toBe('ground')
    expect(needs(undefined, { id: 'p', date: '', mood: 1, energy: 3, tension: 2 })).toEqual(['lift'])
  })
  it('only reports a trend past the threshold, in the right direction', () => {
    expect(trend(12, 9, 5)).toBe('steady')
    expect(trend(12, 6, 5)).toBe('better')
    expect(trend(40, 60, 10, true)).toBe('better')
    expect(trend(60, 40, 10, true)).toBe('worse')
  })
})

describe('content integrity', () => {
  it('every lens effect points at a real region', () => {
    const ids = new Set(REGIONS.map((r) => r.id))
    for (const l of LENSES) for (const k of Object.keys(l.effects)) expect(ids.has(k as never)).toBe(true)
  })
  it('every practice has steps, evidence and at least one need', () => {
    for (const p of PRACTICES) {
      expect(p.steps.length).toBeGreaterThan(0)
      expect(p.evidence.length).toBeGreaterThan(20)
      expect(p.helps.length).toBeGreaterThan(0)
    }
  })
})
