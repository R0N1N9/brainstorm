import type { Assessment, Pulse } from './store'

export type Tone = 'good' | 'watch' | 'elevated' | 'high'

export interface Band {
  label: string
  tone: Tone
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/** PHQ-9 total, 0–27. Bands from Kroenke, Spitzer & Williams (2001). */
export const phqTotal = (items: number[]) => sum(items)
export function phqBand(total: number): Band {
  if (total >= 20) return { label: 'Severe', tone: 'high' }
  if (total >= 15) return { label: 'Moderately severe', tone: 'high' }
  if (total >= 10) return { label: 'Moderate', tone: 'elevated' }
  if (total >= 5) return { label: 'Mild', tone: 'watch' }
  return { label: 'Minimal', tone: 'good' }
}

/** GAD-7 total, 0–21. Bands from Spitzer et al. (2006). */
export const gadTotal = (items: number[]) => sum(items)
export function gadBand(total: number): Band {
  if (total >= 15) return { label: 'Severe', tone: 'high' }
  if (total >= 10) return { label: 'Moderate', tone: 'elevated' }
  if (total >= 5) return { label: 'Mild', tone: 'watch' }
  return { label: 'Minimal', tone: 'good' }
}

/** WHO-5 percentage score, 0–100 (raw 0–25 × 4). Higher is better. */
export const whoScore = (items: number[]) => sum(items) * 4
export function whoBand(score: number): Band {
  if (score <= 28) return { label: 'Very low', tone: 'high' }
  if (score <= 50) return { label: 'Low', tone: 'elevated' }
  if (score < 70) return { label: 'Moderate', tone: 'watch' }
  return { label: 'Good', tone: 'good' }
}

/** PHQ-9 item 9 asks about thoughts of death or self-harm. Any non-zero answer matters. */
export const selfHarmFlag = (a: Assessment) => a.phq[8] > 0

/**
 * Sleep and energy are single-item signals pulled from the screeners. They are
 * not validated scales, so they only ever say "worth a look", never a severity.
 */
export const sleepConcern = (a: Assessment) => a.phq[2] >= 2 || a.who[3] <= 1
export const energyConcern = (a: Assessment) => a.phq[3] >= 2 || a.who[2] <= 1

export type Need = 'settle' | 'lift' | 'sleep' | 'ground' | 'process'

/** Which kinds of practice fit the current state. Order is priority. */
export function needs(a: Assessment | undefined, pulse: Pulse | undefined): Need[] {
  const out: Need[] = []
  const gad = a ? gadTotal(a.gad) : 0
  const phq = a ? phqTotal(a.phq) : 0
  if (gad >= 15 || (pulse && pulse.tension >= 5)) out.push('ground')
  if (gad >= 5 || (pulse && pulse.tension >= 4)) out.push('settle')
  if (phq >= 5 || (a && energyConcern(a)) || (pulse && (pulse.mood <= 2 || pulse.energy <= 2))) out.push('lift')
  if (a && sleepConcern(a)) out.push('sleep')
  return out
}

/** A PHQ-9 change of about 5 points is the usual threshold for a meaningful shift. */
export function trend(prev: number, curr: number, threshold: number, higherIsBetter = false) {
  const d = curr - prev
  if (Math.abs(d) < threshold) return 'steady' as const
  return d > 0 === higherIsBetter ? ('better' as const) : ('worse' as const)
}
