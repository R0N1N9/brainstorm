import { describe, expect, it } from 'vitest'
import { STRUCTURES } from './data/atlas'
import { CLASSES, DRUGS, TARGETS, drugById, drugSites, interactions } from './data/pharm'

const d = (id: string) => drugById(id)!
const levels = (a: string, b: string) => interactions(d(a), d(b)).map((x) => `${x.level}:${x.title}`)

describe('medication data', () => {
  it('every drug has a known class, real targets and unique id', () => {
    const classes = new Set(CLASSES.map((c) => c.id))
    expect(new Set(DRUGS.map((x) => x.id)).size).toBe(DRUGS.length)
    for (const x of DRUGS) {
      expect(classes.has(x.cls)).toBe(true)
      expect(x.targets.length).toBeGreaterThan(0)
      for (const t of x.targets) expect(TARGETS[t.t]).toBeDefined()
      expect(x.stopping.length).toBeGreaterThan(10)
    }
  })
  it('every target site and override is a real structure', () => {
    const ids = new Set<string>(STRUCTURES.map((s) => s.id))
    for (const t of Object.values(TARGETS)) for (const k of Object.keys(t.sites)) expect(ids.has(k)).toBe(true)
    for (const x of DRUGS) for (const k of Object.keys(x.overrides ?? {})) expect(drugSites(x).has(k as never)).toBe(true)
  })
  it('sites are sorted strongest first and use overrides', () => {
    const s = drugSites(d('quetiapine'))
    expect(s.get('hypothalamus')![0].t).toBe('H1')
    expect(s.get('dstr')!.find((x) => x.t === 'D2')!.note).toMatch(/loosely/)
  })
})

describe('interactions', () => {
  it('flags the classic dangerous combinations', () => {
    expect(levels('phenelzine', 'sertraline')).toContain('avoid:Serotonin syndrome')
    expect(levels('phenelzine', 'methylphenidate')).toContain('avoid:Hypertensive crisis')
    expect(levels('alprazolam', 'pregabalin')).toContain('caution:Breathing and sedation')
    expect(levels('valproate', 'lamotrigine')).toContain('caution:Valproate doubles lamotrigine levels')
    expect(levels('escitalopram', 'quetiapine')).toContain('caution:Heart rhythm (QT)')
  })
  it('handles enzyme interactions in the right direction', () => {
    const x = interactions(d('fluoxetine'), d('aripiprazole'))
    expect(x.some((i) => i.title === 'Fluoxetine raises Aripiprazole levels' && /halving/.test(i.body))).toBe(true)
    expect(interactions(d('aripiprazole'), d('fluoxetine')).length).toBe(x.length)
    expect(levels('duloxetine', 'amitriptyline').some((l) => l.startsWith('monitor:Duloxetine raises'))).toBe(true)
  })
  it('mentions the fluoxetine washout only when fluoxetine is involved', () => {
    expect(interactions(d('phenelzine'), d('fluoxetine'))[0].body).toMatch(/5 weeks/)
    expect(interactions(d('phenelzine'), d('sertraline'))[0].body).not.toMatch(/5 weeks/)
  })
  it('returns nothing for a drug with itself, and nothing major for an unrelated pair', () => {
    expect(interactions(d('sertraline'), d('sertraline'))).toEqual([])
    expect(levels('lamotrigine', 'sertraline').filter((l) => !l.startsWith('note'))).toEqual([])
  })
})

import { SIDE_EFFECTS, SYSTEMS, effectsForDrug } from './data/sideEffects'

describe('side effects', () => {
  it('reference real drugs, structures, targets and systems', () => {
    const ids = new Set<string>(STRUCTURES.map((s) => s.id))
    const systems = new Set<string>(SYSTEMS.map((s) => s.id))
    expect(new Set(SIDE_EFFECTS.map((e) => e.id)).size).toBe(SIDE_EFFECTS.length)
    for (const e of SIDE_EFFECTS) {
      expect(systems.has(e.system)).toBe(true)
      expect(Object.keys(e.starts).length).toBeGreaterThan(0)
      expect(Object.keys(e.felt).length).toBeGreaterThan(0)
      for (const k of [...Object.keys(e.starts), ...Object.keys(e.felt)]) expect(ids.has(k)).toBe(true)
      for (const d of e.drugs) expect(drugById(d), `${e.id} → ${d}`).toBeDefined()
      for (const t of e.targets) expect(TARGETS[t]).toBeDefined()
      expect(e.helps.length).toBeGreaterThan(0)
      expect(e.sources.length).toBeGreaterThan(0)
    }
  })
  it('every system has at least one side effect, and common drugs are covered', () => {
    for (const s of SYSTEMS) expect(SIDE_EFFECTS.some((e) => e.system === s.id)).toBe(true)
    for (const d of ['sertraline', 'olanzapine', 'alprazolam', 'lithium', 'methylphenidate']) expect(effectsForDrug(d).length).toBeGreaterThan(0)
  })
})
