// Content for people whose nervous system has been destabilised by starting,
// changing or stopping a psychiatric medication. The research base is thin and
// contested; every entry says what kind of evidence stands behind it.

export type Basis = 'trial' | 'guideline' | 'survey' | 'lived'

export const BASIS_LABEL: Record<Basis, string> = {
  trial: 'Meta-analysis or trials',
  guideline: 'Regulator or clinical guideline',
  survey: 'Surveys and case series',
  lived: 'Lived experience',
}

export interface Fact {
  title: string
  body: string
  basis: Basis
  source: string
  layer?: string
}

export const KNOWN: Fact[] = [
  {
    title: 'Withdrawal is real and common',
    body: 'A 2024 meta-analysis of 79 studies found that about 1 in 3 people report symptoms after stopping an antidepressant, around 1 in 6–7 once placebo responses are subtracted, and about 3% have severe symptoms. Other researchers argue the true figure is higher for people who have taken the drug for years, because most of the studies were short.',
    basis: 'trial',
    source: 'Henssler et al. 2024, Lancet Psychiatry; critique in Horowitz et al. 2025',
    layer: 'ad-withdrawal',
  },
  {
    title: 'For some people it lasts',
    body: 'Acute withdrawal usually runs one to six weeks. A minority go on to have symptoms for months or years, described as protracted or post-acute withdrawal. The evidence comes from case reports and analyses of patient accounts, so nobody knows how common it is or who is at risk.',
    basis: 'survey',
    source: 'Hengartner et al. 2020; Cosci & Chouinard 2020; Rennwald & Hengartner 2025',
    layer: 'ad-withdrawal',
  },
  {
    title: 'It is often mistaken for relapse',
    body: 'In one survey, 47% of respondents said their doctor did not recognise their symptoms as withdrawal. Clues that point to withdrawal rather than the original condition returning: onset within days or weeks of a dose change, new physical symptoms such as dizziness or electric-shock sensations, and symptoms unlike anything you had before.',
    basis: 'survey',
    source: 'Guy et al. 2020, Ther Adv Psychopharmacol; Read et al. 2024',
  },
  {
    title: 'How you come off matters',
    body: 'The relationship between dose and effect on the brain is steeply curved: the last few milligrams do far more than the first. That is the reasoning behind hyperbolic tapering, where each reduction is smaller than the one before, over months rather than weeks. It rests on pharmacology and cohort studies; randomised trials are under way.',
    basis: 'guideline',
    source: 'Horowitz & Taylor 2019, Lancet Psychiatry; Maudsley Deprescribing Guidelines 2024',
  },
  {
    title: 'Benzodiazepines carry particular risk',
    body: 'Stopping suddenly after regular use can cause seizures. The US FDA added its strongest warning in 2020, covering dependence and withdrawal reactions that can last many months. In a survey of 1,207 people, more than half of those with symptoms such as low energy, memory problems and anxiety said they lasted a year or longer. The survey was self-selected, so it shows the problem exists, not how often.',
    basis: 'guideline',
    source: 'FDA 2020; Ritvo et al. 2023, PLOS ONE',
    layer: 'benzo-withdrawal',
  },
  {
    title: 'Sexual effects can persist',
    body: 'In 2019 the European Medicines Agency concluded that sexual dysfunction can continue after SSRIs and SNRIs are stopped, and required warnings on product labels. Diagnostic criteria were published in 2022. How often it happens and how to treat it are not known.',
    basis: 'guideline',
    source: 'EMA PRAC 2019; Healy et al. 2022',
    layer: 'ad-withdrawal',
  },
  {
    title: 'Akathisia needs urgent attention',
    body: 'A severe inner restlessness with a need to keep moving, caused by medication or a dose change. It is frequently mistaken for anxiety, and it is associated with suicidal thoughts. If this describes you, contact your prescriber or urgent care today and use the word akathisia.',
    basis: 'guideline',
    source: 'Pringsheim et al. 2018, Can J Psychiatry',
    layer: 'akathisia',
  },
]

export interface Tip {
  text: string
  basis: Basis
}

export const HELPS: Tip[] = [
  { text: 'Holding at the current dose, or returning to the last tolerated one, when symptoms are severe. This is a decision to make with a prescriber.', basis: 'guideline' },
  { text: 'Reducing in small steps that get smaller as the dose gets lower, and waiting until you are stable before the next one.', basis: 'guideline' },
  { text: 'Being believed. Support from people who accept the symptoms are real is linked to better outcomes.', basis: 'survey' },
  { text: 'Pacing: doing less than you could on good days so that bad days are fewer.', basis: 'lived' },
  { text: 'A steady daily rhythm of waking, light, meals and rest.', basis: 'lived' },
  { text: 'Gentle movement. Many people find it protective; start well below your old level.', basis: 'survey' },
  { text: 'Reducing sensory load during a wave: dim light, quiet, no screens.', basis: 'lived' },
  { text: 'Keeping a simple log. It shows windows returning long before it feels that way.', basis: 'lived' },
]

export const AGGRAVATES: Tip[] = [
  { text: 'Stopping abruptly, or large dose changes in either direction.', basis: 'guideline' },
  { text: 'Alcohol and recreational drugs.', basis: 'survey' },
  { text: 'Adding new drugs or supplements to treat withdrawal symptoms. People often report paradoxical reactions; discuss anything new with a prescriber first.', basis: 'lived' },
  { text: 'Caffeine and other stimulants, for many people.', basis: 'lived' },
  { text: 'Intense exercise, hot baths, saunas and cold plunges.', basis: 'lived' },
  { text: 'Intensive breathwork and long inward-focused meditation.', basis: 'lived' },
  { text: 'Pushing through on a good day.', basis: 'lived' },
]

export const SYMPTOMS: { system: string; items: string[] }[] = [
  { system: 'Balance & senses', items: ['Dizziness', 'Brain zaps', 'Light or sound sensitivity', 'Tinnitus', 'Blurred vision'] },
  { system: 'Nerves & muscle', items: ['Tingling or burning', 'Tremor or twitching', 'Muscle pain', 'Inner restlessness'] },
  { system: 'Autonomic', items: ['Palpitations', 'Sweating or chills', 'Nausea or gut upset'] },
  { system: 'Sleep & energy', items: ['Poor sleep', 'Vivid dreams', 'Exhaustion'] },
  { system: 'Mood & mind', items: ['Surges of anxiety', 'Low mood', 'Irritability', 'Feeling numb or unreal', 'Brain fog'] },
]

export const WAVE_LEVELS = ['Clear window', 'Mostly okay', 'Mixed', 'Rough', 'Heavy wave']

export const RESOURCES: { name: string; what: string; url: string }[] = [
  { name: 'Royal College of Psychiatrists — Stopping antidepressants', what: 'Patient guide to tapering and withdrawal from a professional body.', url: 'https://www.rcpsych.ac.uk/mental-health/treatments-and-wellbeing/stopping-antidepressants' },
  { name: 'NICE guideline NG215', what: 'UK clinical guidance on medicines associated with dependence or withdrawal. Useful to show a prescriber.', url: 'https://www.nice.org.uk/guidance/ng215' },
  { name: 'The Ashton Manual', what: 'Long-standing clinical guide to benzodiazepine withdrawal.', url: 'https://www.benzoinfo.com/ashtonmanual/' },
  { name: 'Benzodiazepine Information Coalition', what: 'Non-profit with medically reviewed information on benzodiazepine harm.', url: 'https://www.benzoinfo.com' },
  { name: 'Surviving Antidepressants', what: 'Large peer-support community for tapering and withdrawal. Peer advice, not medical advice.', url: 'https://www.survivingantidepressants.org' },
]
