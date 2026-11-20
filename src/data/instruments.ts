// Validated self-report screeners. Item wording is reproduced verbatim and must
// not be edited: changing the words invalidates the published cut-offs.
//
// PHQ-9 / GAD-7: Spitzer, Williams, Kroenke et al. No permission required to
//   reproduce, translate, display or distribute (phqscreeners.com).
// WHO-5: © World Health Organization 2024, CC BY-NC-SA 3.0 IGO. Non-commercial
//   use only; WHO does not endorse this software. See docs/RESEARCH.md.

export type InstrumentId = 'phq' | 'gad' | 'who'

export interface Instrument {
  id: InstrumentId
  name: string
  measures: string
  stem: string
  items: string[]
  options: { label: string; value: number }[]
}

const FREQ_0_3 = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
]

export const PHQ9: Instrument = {
  id: 'phq',
  name: 'PHQ-9',
  measures: 'Low mood',
  stem: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  items: [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
    'Trouble falling or staying asleep, or sleeping too much',
    'Feeling tired or having little energy',
    'Poor appetite or overeating',
    'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    'Trouble concentrating on things, such as reading the newspaper or watching television',
    'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
    'Thoughts that you would be better off dead or of hurting yourself in some way',
  ],
  options: FREQ_0_3,
}

export const GAD7: Instrument = {
  id: 'gad',
  name: 'GAD-7',
  measures: 'Anxiety',
  stem: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  items: [
    'Feeling nervous, anxious or on edge',
    'Not being able to stop or control worrying',
    'Worrying too much about different things',
    'Trouble relaxing',
    'Being so restless that it is hard to sit still',
    'Becoming easily annoyed or irritable',
    'Feeling afraid as if something awful might happen',
  ],
  options: FREQ_0_3,
}

export const WHO5: Instrument = {
  id: 'who',
  name: 'WHO-5',
  measures: 'Wellbeing',
  stem: 'Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.',
  items: [
    'I have felt cheerful and in good spirits',
    'I have felt calm and relaxed',
    'I have felt active and vigorous',
    'I woke up feeling fresh and rested',
    'My daily life has been filled with things that interest me',
  ],
  options: [
    { label: 'All of the time', value: 5 },
    { label: 'Most of the time', value: 4 },
    { label: 'More than half of the time', value: 3 },
    { label: 'Less than half of the time', value: 2 },
    { label: 'Some of the time', value: 1 },
    { label: 'At no time', value: 0 },
  ],
}

export const INSTRUMENTS: Instrument[] = [WHO5, PHQ9, GAD7]
