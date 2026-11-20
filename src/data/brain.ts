// An educational atlas: what group-level research associates with each region.
// It is never a measurement of the person using the app. Self-report cannot
// tell anyone what has happened inside their own brain, and the UI says so.

export type RegionId =
  | 'pfc'
  | 'acc'
  | 'insula'
  | 'striatum'
  | 'hypothalamus'
  | 'amygdala'
  | 'hippocampus'
  | 'brainstem'
  | 'cerebellum'

export interface Region {
  id: RegionId
  name: string
  role: string
}

export const REGIONS: Region[] = [
  { id: 'pfc', name: 'Prefrontal cortex', role: 'Planning, focus, and putting the brakes on impulses and strong emotion.' },
  { id: 'acc', name: 'Anterior cingulate', role: 'Notices conflict and error; links feeling, attention and effort.' },
  { id: 'insula', name: 'Insula', role: 'Interoception: the felt sense of the body — heartbeat, breath, gut.' },
  { id: 'striatum', name: 'Reward circuit', role: 'Nucleus accumbens and striatum: motivation, habit, anticipation of reward.' },
  { id: 'hypothalamus', name: 'Hypothalamus', role: 'Starts the HPA stress-hormone cascade; regulates sleep, appetite, temperature.' },
  { id: 'amygdala', name: 'Amygdala', role: 'Fast detection of threat and emotional salience.' },
  { id: 'hippocampus', name: 'Hippocampus', role: 'Forms new memories and places them in context — when, where, is it over.' },
  { id: 'brainstem', name: 'Brainstem', role: 'Arousal, breathing and heart rate; origin of the vagus nerve.' },
  { id: 'cerebellum', name: 'Cerebellum', role: 'Coordination and timing of movement; also contributes to emotion and cognition.' },
]

export type Evidence = 'consistent' | 'mixed' | 'preliminary'

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  consistent: 'Consistent finding',
  mixed: 'Mixed findings',
  preliminary: 'Early evidence',
}

export type LensId = 'stress' | 'adversity' | 'sleep' | 'alcohol' | 'cannabis' | 'exercise' | 'breath'

export interface Lens {
  id: LensId
  name: string
  kind: 'strain' | 'support'
  summary: string
  effects: Partial<Record<RegionId, { note: string; evidence: Evidence }>>
  sources: string[]
}

export const LENSES: Lens[] = [
  {
    id: 'stress',
    name: 'Chronic stress',
    kind: 'strain',
    summary:
      'Sustained stress shifts the balance from slow, deliberate prefrontal control toward fast, threat-driven responding. Most of these changes are reversible when the load comes down.',
    effects: {
      pfc: { note: 'Stress chemistry weakens working memory and top-down regulation, sometimes within minutes.', evidence: 'consistent' },
      amygdala: { note: 'Becomes more reactive and more influential over behaviour.', evidence: 'consistent' },
      hippocampus: { note: 'Rich in stress-hormone receptors; long-term high cortisol is associated with smaller volume.', evidence: 'mixed' },
      hypothalamus: { note: 'Drives the HPA axis; under chronic load its daily cortisol rhythm can flatten.', evidence: 'consistent' },
    },
    sources: ['Arnsten 2009, Nat Rev Neurosci', 'McEwen 2007, Physiol Rev'],
  },
  {
    id: 'adversity',
    name: 'Early adversity',
    kind: 'strain',
    summary:
      'Across large groups, childhood adversity is associated with small average differences in a few regions. These are averages: they do not predict any one person, they vary with timing and type, and brains keep changing throughout life.',
    effects: {
      hippocampus: { note: 'The most replicated association: modestly smaller volume on average in adults.', evidence: 'consistent' },
      amygdala: { note: 'Findings differ by age and kind of adversity; heightened reactivity is reported more often than size change.', evidence: 'mixed' },
      pfc: { note: 'Some meta-analyses report less grey matter in dorsolateral and inferior frontal areas.', evidence: 'mixed' },
      acc: { note: 'Reported differences in structure and in threat-related activity.', evidence: 'mixed' },
    },
    sources: ['Pollok et al. 2022, Neurosci Biobehav Rev', 'Calem et al. 2017, NeuroImage Clin', 'Teicher et al. 2016, Nat Rev Neurosci'],
  },
  {
    id: 'sleep',
    name: 'Sleep loss',
    kind: 'strain',
    summary:
      'Short sleep makes emotional reactions bigger and regulation weaker the very next day. It is among the fastest levers to pull, in both directions.',
    effects: {
      amygdala: { note: 'After a night without sleep, reactivity to negative images was about 60% higher in one well-known study.', evidence: 'consistent' },
      pfc: { note: 'Its calming connection to the amygdala weakens; attention and judgement dip.', evidence: 'consistent' },
      hippocampus: { note: 'Encoding of new memories is impaired after sleep deprivation.', evidence: 'consistent' },
      striatum: { note: 'Reward responses become exaggerated, tilting choices toward the immediate.', evidence: 'mixed' },
    },
    sources: ['Yoo et al. 2007, Curr Biol', 'Krause et al. 2017, Nat Rev Neurosci'],
  },
  {
    id: 'alcohol',
    name: 'Heavy alcohol use',
    kind: 'strain',
    summary:
      'Long-term heavy drinking is associated with widespread changes, strongest in frontal regions and the cerebellum. Partial recovery of volume and function is well documented in the months after stopping.',
    effects: {
      pfc: { note: 'Frontal grey and white matter are the most affected; linked to impulse control and planning difficulties.', evidence: 'consistent' },
      cerebellum: { note: 'Shrinkage associated with balance and coordination problems.', evidence: 'consistent' },
      hippocampus: { note: 'Smaller volume reported even at moderate intake in some large cohorts.', evidence: 'mixed' },
      striatum: { note: 'The reward circuit adapts: less response to everyday rewards, more to alcohol cues.', evidence: 'consistent' },
    },
    sources: ['Zahr & Pfefferbaum 2017, Alcohol Res', 'Topiwala et al. 2017, BMJ', 'Koob & Volkow 2016, Lancet Psychiatry'],
  },
  {
    id: 'cannabis',
    name: 'Heavy cannabis use',
    kind: 'strain',
    summary:
      'Cannabinoid receptors are dense in the hippocampus, reward circuit and cerebellum. Structural findings in heavy users are inconsistent and smaller than once thought; effects appear greater with early, frequent, high-THC use.',
    effects: {
      hippocampus: { note: 'Short-term memory effects while using are reliable; lasting volume differences are disputed.', evidence: 'mixed' },
      pfc: { note: 'Adolescent heavy use is associated with altered development in some longitudinal studies.', evidence: 'mixed' },
      striatum: { note: 'Blunted dopamine response reported in heavy long-term users.', evidence: 'preliminary' },
      cerebellum: { note: 'High receptor density; acute effects on timing and coordination.', evidence: 'mixed' },
    },
    sources: ['Lorenzetti et al. 2019, Eur Arch Psychiatry Clin Neurosci', 'Volkow et al. 2016, JAMA Psychiatry'],
  },
  {
    id: 'exercise',
    name: 'Regular exercise',
    kind: 'support',
    summary:
      'Aerobic and strength exercise have moderate antidepressant effects in trials, comparable to therapy for mild-to-moderate depression. The brain mechanisms are still being worked out.',
    effects: {
      hippocampus: { note: 'A year of aerobic walking increased volume by about 2% in older adults in one trial; later pooled results are smaller.', evidence: 'mixed' },
      pfc: { note: 'Associated with better executive function, most clearly in older adults.', evidence: 'mixed' },
      striatum: { note: 'Engages the reward circuit; may help restore motivation in low mood.', evidence: 'preliminary' },
    },
    sources: ['Noetel et al. 2024, BMJ', 'Erickson et al. 2011, PNAS'],
  },
  {
    id: 'breath',
    name: 'Slow breathing & body awareness',
    kind: 'support',
    summary:
      'Slow, exhale-weighted breathing shifts the autonomic nervous system toward its calming branch within minutes. Practices that train attention to the body engage interoceptive regions.',
    effects: {
      brainstem: { note: 'Breathing rhythm is generated here; slow breathing raises heart-rate variability via the vagus nerve.', evidence: 'consistent' },
      insula: { note: 'More active during interoceptive attention; differs in long-term meditators.', evidence: 'mixed' },
      amygdala: { note: 'Reduced reactivity after mindfulness training reported in several small studies.', evidence: 'preliminary' },
      acc: { note: 'Engaged when sustaining and redirecting attention.', evidence: 'mixed' },
    },
    sources: ['Balban et al. 2023, Cell Rep Med', 'Goessl et al. 2017, Psychol Med', 'Tang et al. 2015, Nat Rev Neurosci'],
  },
]
