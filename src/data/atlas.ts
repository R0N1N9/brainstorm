// An educational atlas of the nervous system: what group-level research and
// clinical description associate with each structure. It is never a
// measurement of the person using the app, and the UI says so.

export type StructureId =
  // brain
  | 'dlpfc' | 'vmpfc' | 'acc' | 'motor' | 'insula' | 'dstr' | 'nacc' | 'thalamus' | 'hypothalamus'
  | 'pituitary' | 'amygdala' | 'hippocampus' | 'midbrain' | 'lc' | 'raphe' | 'vestibular' | 'medulla' | 'cerebellum'
  // body
  | 'vagus' | 'spinal' | 'symp' | 'heart' | 'lungs' | 'adrenal' | 'gut' | 'pelvic' | 'muscle' | 'peripheral' | 'skin'
  | 'thyroid' | 'liver' | 'kidney'

export interface Structure {
  id: StructureId
  view: 'brain' | 'body'
  name: string
  short: string
  role: string
}

export const STRUCTURES: Structure[] = [
  { id: 'dlpfc', view: 'brain', name: 'Dorsolateral prefrontal cortex', short: 'dlPFC', role: 'Working memory, planning and deliberate focus.' },
  { id: 'vmpfc', view: 'brain', name: 'Ventromedial & orbitofrontal cortex', short: 'vmPFC', role: 'Weighs value and safety; quiets the amygdala once a threat has passed.' },
  { id: 'acc', view: 'brain', name: 'Anterior cingulate cortex', short: 'ACC', role: 'Detects conflict and error; links feeling, attention and effort.' },
  { id: 'motor', view: 'brain', name: 'Sensorimotor cortex', short: 'Sensorimotor', role: 'Voluntary movement and the map of touch across the body.' },
  { id: 'insula', view: 'brain', name: 'Insula', short: 'Insula', role: 'Interoception: the felt sense of heartbeat, breath, gut and temperature.' },
  { id: 'dstr', view: 'brain', name: 'Dorsal striatum', short: 'Dorsal striatum', role: 'Part of the basal ganglia: habits and the smooth starting and stopping of movement.' },
  { id: 'nacc', view: 'brain', name: 'Nucleus accumbens', short: 'Accumbens', role: 'Core of the reward circuit: wanting, motivation, anticipation.' },
  { id: 'thalamus', view: 'brain', name: 'Thalamus', short: 'Thalamus', role: 'Relay and gate for sensory signals; helps switch between sleep and waking.' },
  { id: 'hypothalamus', view: 'brain', name: 'Hypothalamus', short: 'Hypothalamus', role: 'Commands the autonomic system and stress hormones; sets sleep, appetite and temperature.' },
  { id: 'pituitary', view: 'brain', name: 'Pituitary gland', short: 'Pituitary', role: 'Releases hormones into the blood on the hypothalamus’s instruction.' },
  { id: 'amygdala', view: 'brain', name: 'Amygdala', short: 'Amygdala', role: 'Fast detection of threat and emotional significance.' },
  { id: 'hippocampus', view: 'brain', name: 'Hippocampus', short: 'Hippocampus', role: 'Forms new memories and places them in context: when, where, and whether it is over.' },
  { id: 'midbrain', view: 'brain', name: 'Midbrain dopamine nuclei', short: 'VTA / SN', role: 'Ventral tegmental area and substantia nigra: the source of most of the brain’s dopamine.' },
  { id: 'lc', view: 'brain', name: 'Locus coeruleus', short: 'Locus coeruleus', role: 'Source of the brain’s noradrenaline: alertness, vigilance, the startle of alarm.' },
  { id: 'raphe', view: 'brain', name: 'Raphe nuclei', short: 'Raphe', role: 'Source of the brain’s serotonin, sending fibres almost everywhere.' },
  { id: 'vestibular', view: 'brain', name: 'Vestibular nuclei', short: 'Vestibular', role: 'Combine signals from the inner ear, eyes and body to keep balance and a steady gaze.' },
  { id: 'medulla', view: 'brain', name: 'Medulla', short: 'Medulla', role: 'Sets breathing and heart rate; where the vagus nerve reports in and departs.' },
  { id: 'cerebellum', view: 'brain', name: 'Cerebellum', short: 'Cerebellum', role: 'Timing and coordination of movement; also contributes to emotion and thought.' },
  { id: 'vagus', view: 'body', name: 'Vagus nerve', short: 'Vagus', role: 'Main parasympathetic nerve. About four fifths of its fibres carry information from the organs up to the brain.' },
  { id: 'spinal', view: 'body', name: 'Spinal cord', short: 'Spinal cord', role: 'Carries movement commands down and sensation up; runs reflexes of its own.' },
  { id: 'symp', view: 'body', name: 'Sympathetic chain', short: 'Sympathetic', role: 'Ganglia beside the spine that carry the “mobilise” signal to every organ.' },
  { id: 'heart', view: 'body', name: 'Heart', short: 'Heart', role: 'Speeded by sympathetic nerves, slowed beat by beat by the vagus.' },
  { id: 'lungs', view: 'body', name: 'Lungs & diaphragm', short: 'Breath', role: 'The one autonomic function that is also under voluntary control.' },
  { id: 'adrenal', view: 'body', name: 'Adrenal glands', short: 'Adrenals', role: 'Release adrenaline within seconds and cortisol within minutes.' },
  { id: 'gut', view: 'body', name: 'Gut & enteric nervous system', short: 'Gut', role: 'Hundreds of millions of neurons lining the gut; makes most of the body’s serotonin.' },
  { id: 'pelvic', view: 'body', name: 'Pelvic nerves', short: 'Pelvic', role: 'Autonomic and sensory supply for sexual function, bladder and bowel.' },
  { id: 'muscle', view: 'body', name: 'Skeletal muscle', short: 'Muscle', role: 'Tone is set continuously by the spinal cord, brainstem and basal ganglia.' },
  { id: 'peripheral', view: 'body', name: 'Peripheral sensory nerves', short: 'Sensory nerves', role: 'Carry touch, temperature, pain and position from skin and limbs.' },
  { id: 'skin', view: 'body', name: 'Skin & sweat glands', short: 'Skin', role: 'Sweating and blood flow here are driven by sympathetic nerves.' },
  { id: 'thyroid', view: 'body', name: 'Thyroid gland', short: 'Thyroid', role: 'Sets the body’s metabolic pace; thyroid problems can look like depression or anxiety.' },
  { id: 'liver', view: 'body', name: 'Liver', short: 'Liver', role: 'Breaks down most psychiatric drugs, mainly through the cytochrome P450 enzymes.' },
  { id: 'kidney', view: 'body', name: 'Kidneys', short: 'Kidneys', role: 'Clear some drugs, including lithium and gabapentinoids, from the blood.' },
]

export type Evidence = 'consistent' | 'mixed' | 'preliminary' | 'reported'

export const EVIDENCE: Record<Evidence, { label: string; help: string }> = {
  consistent: { label: 'Well established', help: 'Replicated across many studies or basic physiology.' },
  mixed: { label: 'Mixed findings', help: 'Studies disagree, or the effect depends on who is studied.' },
  preliminary: { label: 'Early evidence', help: 'A few small studies or a leading hypothesis.' },
  reported: { label: 'Reported, mechanism unclear', help: 'Described by patients and clinicians; why it happens is not yet understood.' },
}

export type GroupId = 'systems' | 'experience' | 'medication' | 'withdrawal' | 'support'

export const GROUPS: { id: GroupId; name: string; blurb: string }[] = [
  { id: 'systems', name: 'Systems', blurb: 'How the nervous system is wired.' },
  { id: 'experience', name: 'Life & substances', blurb: 'What experiences are associated with.' },
  { id: 'medication', name: 'Drug classes', blurb: 'Where each class of psychiatric drug acts and how the body adapts.' },
  { id: 'withdrawal', name: 'Withdrawal & after', blurb: 'What can happen when a drug is reduced or stopped.' },
  { id: 'support', name: 'Supports', blurb: 'What helps, and where it acts.' },
]

export interface Layer {
  id: string
  group: GroupId
  name: string
  summary: string
  /** Where the pathway starts; lines are drawn from here within the same view. */
  source?: StructureId
  effects: Partial<Record<StructureId, { note: string; evidence: Evidence }>>
  sources: string[]
}

const c = (note: string) => ({ note, evidence: 'consistent' as const })
const m = (note: string) => ({ note, evidence: 'mixed' as const })
const p = (note: string) => ({ note, evidence: 'preliminary' as const })
const r = (note: string) => ({ note, evidence: 'reported' as const })

export const LAYERS: Layer[] = [
  // ───────────── Systems
  {
    id: 'sympathetic', group: 'systems', name: 'Sympathetic “accelerator”', source: 'hypothalamus',
    summary: 'The mobilising branch of the autonomic nervous system. It raises heart rate, breathing and blood sugar within seconds. It is meant to switch on briefly and then stand down.',
    effects: {
      hypothalamus: c('Issues the command to mobilise.'),
      lc: c('Fires in step with sympathetic arousal, sharpening vigilance.'),
      symp: c('Relays the signal to every organ at once.'),
      heart: c('Rate and force of contraction rise.'),
      lungs: c('Airways widen and breathing quickens.'),
      adrenal: c('Releases adrenaline into the blood, prolonging the response.'),
      gut: c('Digestion is put on hold; this is the “knot in the stomach”.'),
      skin: c('Sweating increases; blood is diverted away from the skin.'),
      muscle: c('Tension and readiness increase.'),
    },
    sources: ['Standard autonomic physiology', 'McCorry 2007, Am J Pharm Educ'],
  },
  {
    id: 'vagal', group: 'systems', name: 'Parasympathetic “brake”', source: 'medulla',
    summary: 'The restoring branch, carried mostly by the vagus nerve. It slows the heart with each out-breath and supports digestion and rest. Heart-rate variability is a rough window onto how actively it is working.',
    effects: {
      medulla: c('Vagal nuclei here send and receive the signals.'),
      vagus: c('Carries “slow down” to the organs and a constant report of body state back up.'),
      heart: c('Slowed on every exhale — the basis of heart-rate variability.'),
      lungs: c('Long, slow exhales strengthen vagal influence on the heart.'),
      gut: c('Digestion and gut movement are switched on.'),
      vmpfc: m('Higher resting heart-rate variability goes with stronger prefrontal regulation of emotion.'),
      insula: c('Receives the body’s report relayed from the vagus.'),
    },
    sources: ['Thayer & Lane 2009, Neurosci Biobehav Rev', 'Lehrer & Gevirtz 2014, Front Psychol'],
  },
  {
    id: 'hpa', group: 'systems', name: 'Stress-hormone axis (HPA)', source: 'hypothalamus',
    summary: 'A slower, hormonal stress response. The hypothalamus signals the pituitary, which signals the adrenal glands to release cortisol. Cortisol then feeds back to the brain to switch the response off.',
    effects: {
      hypothalamus: c('Releases CRH to start the cascade.'),
      pituitary: c('Releases ACTH into the bloodstream.'),
      adrenal: c('Release cortisol, peaking about 20–30 minutes after a stressor.'),
      hippocampus: c('Dense in cortisol receptors; helps shut the response down.'),
      amygdala: c('Drives the axis when it detects threat.'),
      vmpfc: c('Applies the brake when the situation is judged safe.'),
    },
    sources: ['McEwen 2007, Physiol Rev', 'Ulrich-Lai & Herman 2009, Nat Rev Neurosci'],
  },
  {
    id: 'interoception', group: 'systems', name: 'Interoception: body to brain', source: 'medulla',
    summary: 'The pathway by which the state of the body becomes a feeling. Signals from the organs travel up the vagus and spinal cord and are assembled in the insula into the sense of “how I am”.',
    effects: {
      vagus: c('Carries signals from heart, lungs and gut upward.'),
      gut: c('A major source of interoceptive signal.'),
      heart: c('Each heartbeat is registered by the brain.'),
      medulla: c('First relay, at the nucleus of the solitary tract.'),
      thalamus: c('Passes the signals on to the cortex.'),
      insula: c('Builds the conscious felt sense of the body.'),
      acc: c('Turns that feeling into motivation to act.'),
    },
    sources: ['Craig 2002, Nat Rev Neurosci', 'Khalsa et al. 2018, Biol Psychiatry CNNI'],
  },
  {
    id: 'serotonin', group: 'systems', name: 'Serotonin', source: 'raphe',
    summary: 'A modulator, not a simple “happiness chemical”. It tunes mood, sleep, appetite, pain, temperature and gut movement. A 2022 umbrella review found no consistent evidence that depression is caused by low serotonin.',
    effects: {
      raphe: c('Where the brain’s serotonin neurons live.'),
      vmpfc: c('Receives dense serotonin input; involved in emotional appraisal.'),
      amygdala: c('Serotonin shapes how strongly threat is registered.'),
      hippocampus: c('Rich in serotonin receptors.'),
      hypothalamus: c('Influences appetite, temperature and sleep timing.'),
      thalamus: c('Helps regulate sleep stages and sensory gating.'),
      gut: c('Around 90% of the body’s serotonin is made here, where it drives gut movement and nausea signalling.'),
      spinal: c('Descending fibres turn pain signals up or down.'),
    },
    sources: ['Moncrieff et al. 2022, Mol Psychiatry', 'Gershon & Tack 2007, Gastroenterology'],
  },
  {
    id: 'dopamine', group: 'systems', name: 'Dopamine', source: 'midbrain',
    summary: 'Signals what is worth pursuing and helps start movement. It is more about wanting and learning than about pleasure itself.',
    effects: {
      midbrain: c('Source of the main dopamine pathways.'),
      nacc: c('Mesolimbic pathway: motivation and reward learning.'),
      dstr: c('Nigrostriatal pathway: initiating and smoothing movement.'),
      dlpfc: c('Mesocortical pathway: working memory and focus.'),
      pituitary: c('Dopamine from the hypothalamus holds prolactin release in check.'),
    },
    sources: ['Berridge & Robinson 2016, Am Psychol', 'Standard neuroanatomy'],
  },
  {
    id: 'noradrenaline', group: 'systems', name: 'Noradrenaline', source: 'lc',
    summary: 'The brain’s alerting signal and the main messenger of the sympathetic nerves. Moderate levels sharpen thinking; high levels switch the prefrontal cortex toward reflex.',
    effects: {
      lc: c('Almost all of the brain’s noradrenaline starts here.'),
      dlpfc: c('Works best at moderate levels; impaired when levels are very high.'),
      amygdala: c('Strengthens the storage of emotional memories.'),
      thalamus: c('Raises alertness and sensory sensitivity.'),
      hippocampus: c('Marks events as worth remembering.'),
    },
    sources: ['Arnsten 2009, Nat Rev Neurosci', 'Sara 2009, Nat Rev Neurosci'],
  },
  {
    id: 'gaba', group: 'systems', name: 'GABA', source: 'thalamus',
    summary: 'The main inhibitory signal of the nervous system. It does not come from one place: GABA neurons are everywhere, keeping excitation in check. The highlighted structures are where its effects are most noticeable.',
    effects: {
      thalamus: c('GABA gating here filters sensation and permits sleep.'),
      amygdala: c('Local inhibition restrains fear output.'),
      cerebellum: c('Its main output cells are GABA neurons; essential for coordination.'),
      motor: c('Inhibition prevents runaway cortical firing.'),
      hippocampus: c('Inhibitory cells pace memory rhythms.'),
      spinal: c('Sets muscle tone and dampens reflexes.'),
      muscle: c('Loss of inhibition shows up as stiffness, twitching or tremor.'),
    },
    sources: ['Standard neurophysiology', 'Möhler 2012, Neuropharmacology'],
  },

  // ───────────── Life & substances
  {
    id: 'stress', group: 'experience', name: 'Chronic stress',
    summary: 'Sustained stress tilts the balance from deliberate prefrontal control toward fast, threat-driven responding, and keeps the body mobilised. Most of these changes reverse when the load comes down.',
    effects: {
      dlpfc: c('Working memory and flexible thinking weaken, sometimes within minutes.'),
      vmpfc: c('Loses some of its ability to quiet the amygdala.'),
      amygdala: c('Becomes more reactive and more influential over behaviour.'),
      hippocampus: m('Long-term high cortisol is associated with smaller volume.'),
      hypothalamus: c('The daily cortisol rhythm can flatten.'),
      lc: c('Baseline firing rises: more vigilance, lighter sleep.'),
      adrenal: c('Sustained cortisol and adrenaline output.'),
      heart: c('Lower heart-rate variability; higher resting rate.'),
      gut: c('Altered movement and sensitivity; a recognised trigger for irritable bowel symptoms.'),
      muscle: c('Persistently raised tension, especially neck, jaw and shoulders.'),
    },
    sources: ['Arnsten 2009, Nat Rev Neurosci', 'McEwen 2007, Physiol Rev', 'Kim et al. 2018, Psychiatry Investig'],
  },
  {
    id: 'adversity', group: 'experience', name: 'Early adversity',
    summary: 'Across large groups, childhood adversity is associated with small average differences in a few regions and in stress-system settings. These are averages: they do not predict any one person, they vary with timing and type, and brains keep changing throughout life.',
    effects: {
      hippocampus: c('The most replicated association: modestly smaller volume on average in adults.'),
      amygdala: m('Heightened reactivity is reported more often than a change in size; findings vary with age.'),
      dlpfc: m('Some meta-analyses report less grey matter.'),
      vmpfc: m('Differences in the circuit that signals safety.'),
      acc: m('Reported differences in structure and threat-related activity.'),
      hypothalamus: m('Stress-hormone responses may be set higher or, after prolonged adversity, blunted.'),
      insula: p('Altered awareness of body signals is described in some trauma studies.'),
    },
    sources: ['Pollok et al. 2022, Neurosci Biobehav Rev', 'Calem et al. 2017, NeuroImage Clin', 'Teicher et al. 2016, Nat Rev Neurosci'],
  },
  {
    id: 'sleep', group: 'experience', name: 'Sleep loss',
    summary: 'Short sleep makes emotional reactions bigger and regulation weaker the very next day. It is among the fastest levers to pull, in both directions.',
    effects: {
      amygdala: c('Reactivity to negative images was about 60% higher after a night without sleep in one well-known study.'),
      vmpfc: c('Its calming connection to the amygdala weakens.'),
      dlpfc: c('Attention and judgement dip.'),
      hippocampus: c('Encoding of new memories is impaired.'),
      nacc: m('Reward responses become exaggerated, tilting choices toward the immediate.'),
      thalamus: c('Brief lapses of sensory relay produce “microsleeps”.'),
      heart: c('Sympathetic tone rises; heart-rate variability falls.'),
    },
    sources: ['Yoo et al. 2007, Curr Biol', 'Krause et al. 2017, Nat Rev Neurosci'],
  },
  {
    id: 'alcohol', group: 'experience', name: 'Heavy alcohol use',
    summary: 'Alcohol enhances GABA and suppresses glutamate. With long-term heavy use the brain adapts in the opposite direction, which is why stopping suddenly can be dangerous. Partial recovery of volume and function is well documented in the months after stopping.',
    effects: {
      dlpfc: c('Frontal grey and white matter are most affected; linked to planning and impulse-control difficulties.'),
      cerebellum: c('Shrinkage associated with balance and coordination problems.'),
      hippocampus: m('Smaller volume reported even at moderate intake in some large cohorts.'),
      nacc: c('Less response to everyday rewards, more to alcohol cues.'),
      amygdala: c('Rebound over-activity in withdrawal drives anxiety.'),
      peripheral: c('Long-term heavy use can damage nerves in the feet and hands.'),
      gut: c('Irritates the gut lining and alters the microbiome.'),
    },
    sources: ['Zahr & Pfefferbaum 2017, Alcohol Res', 'Topiwala et al. 2017, BMJ', 'Koob & Volkow 2016, Lancet Psychiatry'],
  },
  {
    id: 'cannabis', group: 'experience', name: 'Heavy cannabis use',
    summary: 'Cannabinoid receptors are dense in the hippocampus, reward circuit and cerebellum. Structural findings in heavy users are inconsistent and smaller than once thought; effects appear greater with early, frequent, high-THC use.',
    effects: {
      hippocampus: m('Short-term memory effects while using are reliable; lasting volume differences are disputed.'),
      dlpfc: m('Adolescent heavy use is associated with altered development in some longitudinal studies.'),
      nacc: p('Blunted dopamine response reported in heavy long-term users.'),
      cerebellum: m('High receptor density; acute effects on timing and coordination.'),
      amygdala: m('Low doses tend to calm, high doses can provoke anxiety.'),
    },
    sources: ['Lorenzetti et al. 2019, Eur Arch Psychiatry Clin Neurosci', 'Volkow et al. 2016, JAMA Psychiatry'],
  },

  // ───────────── Medications
  {
    id: 'ssri', group: 'medication', name: 'SSRIs & SNRIs', source: 'raphe',
    summary: 'These block the serotonin transporter (SNRIs also the noradrenaline transporter), raising serotonin at synapses throughout the brain and body. Over weeks the nervous system adapts to the new level by adjusting receptors. That adaptation is part of how they work and also why stopping can produce symptoms.',
    effects: {
      raphe: c('Serotonin neurons first slow their firing, then recover over weeks as autoreceptors adapt.'),
      amygdala: m('Reduced reactivity to negative faces, sometimes within days.'),
      vmpfc: r('“Emotional blunting” — feeling less of everything — was reported by nearly half of users in one large survey.'),
      hippocampus: p('Animal work suggests increased plasticity; human evidence is indirect.'),
      gut: c('Nausea and bowel changes are common early on, reflecting the gut’s own serotonin system.'),
      pelvic: c('Reduced libido, genital sensation and orgasm are among the most common side effects.'),
      thalamus: c('REM sleep is suppressed; dreams can become vivid.'),
      skin: c('Increased sweating is a recognised side effect.'),
    },
    sources: ['Harmer et al. 2017, Lancet Psychiatry', 'Goodwin et al. 2017, J Affect Disord', 'Horowitz & Taylor 2019, Lancet Psychiatry'],
  },
  {
    id: 'benzo', group: 'medication', name: 'Benzodiazepines & Z-drugs', source: 'thalamus',
    summary: 'These make GABA-A receptors respond more strongly, quieting the whole nervous system within minutes. With regular use over weeks the receptors adapt and the same dose does less. Prescribing guidance generally limits them to short-term use.',
    effects: {
      amygdala: c('Rapid reduction in fear and anxiety.'),
      thalamus: c('Sedation and sleep onset.'),
      hippocampus: c('Formation of new memories is impaired while the drug is active.'),
      cerebellum: c('Unsteadiness and slowed coordination.'),
      dlpfc: m('Long-term use is associated with slower processing and attention; partly reversible after stopping.'),
      spinal: c('Muscle relaxation.'),
      medulla: c('Breathing is suppressed when combined with opioids or alcohol.'),
    },
    sources: ['FDA Drug Safety Communication 2020', 'Crowe & Stranks 2018, Arch Clin Neuropsychol', 'Möhler 2012, Neuropharmacology'],
  },
  {
    id: 'antipsychotic', group: 'medication', name: 'Antipsychotics', source: 'midbrain',
    summary: 'These block dopamine D2 receptors; most also act on serotonin, histamine and other receptors. Blocking dopamine in one pathway reduces psychotic symptoms, and in the others produces most of the side effects.',
    effects: {
      midbrain: c('Dopamine neurons keep firing; the drug blocks their signal at the receiving end.'),
      nacc: c('Reduced dopamine signalling eases psychosis; some people also describe flattened motivation.'),
      dstr: c('Movement side effects: stiffness, tremor, restlessness (akathisia) and, with long use, tardive dyskinesia.'),
      pituitary: c('Prolactin rises when dopamine’s brake is blocked, affecting sexual and reproductive function.'),
      hypothalamus: c('Increased appetite and weight gain with many agents.'),
      dlpfc: m('Effects on thinking are debated; sedation contributes.'),
      heart: c('Some agents lengthen the QT interval or raise resting heart rate.'),
      muscle: c('Stiffness and inner restlessness originate in the basal ganglia but are felt here.'),
    },
    sources: ['Kapur & Seeman 2001, Am J Psychiatry', 'Huhn et al. 2019, Lancet'],
  },

  // ───────────── Withdrawal & after
  {
    id: 'ad-withdrawal', group: 'withdrawal', name: 'Antidepressant withdrawal', source: 'raphe',
    summary: 'When the dose falls faster than the nervous system can re-adapt, symptoms appear across many body systems at once. A 2024 meta-analysis put the placebo-adjusted incidence at about 1 in 6–7 people, with about 3% severe; other researchers argue this underestimates long-term users. In a minority, symptoms last months or longer. Why is not established.',
    effects: {
      raphe: p('Leading hypothesis: receptors that adapted to the drug take time to readjust once it is gone.'),
      vestibular: r('Dizziness, vertigo and a sense of the head lagging behind eye movements.'),
      peripheral: r('“Brain zaps” — brief electric-shock sensations — plus tingling and burning.'),
      gut: r('Nausea, cramps and diarrhoea.'),
      thalamus: r('Insomnia, vivid dreams, sensitivity to light and sound.'),
      amygdala: r('Surges of anxiety, panic, irritability or tearfulness, often unlike the original condition.'),
      lc: p('Noradrenaline over-activity is proposed to underlie agitation and hyperarousal.'),
      skin: r('Sweating, flushing and chills.'),
      heart: r('Palpitations and a racing pulse.'),
      muscle: r('Aches, tremor and restlessness; severe inner restlessness (akathisia) can occur.'),
      pelvic: r('In some people sexual numbness persists after stopping (PSSD), recognised by the European Medicines Agency in 2019.'),
    },
    sources: ['Henssler et al. 2024, Lancet Psychiatry', 'Horowitz & Taylor 2019, Lancet Psychiatry', 'Hengartner et al. 2020, Ther Adv Psychopharmacol', 'Cosci & Chouinard 2020, Psychother Psychosom'],
  },
  {
    id: 'benzo-withdrawal', group: 'withdrawal', name: 'Benzodiazepine withdrawal', source: 'thalamus',
    summary: 'After regular use, GABA receptors have turned themselves down. Reducing the drug leaves the nervous system under-inhibited until they recover. Stopping abruptly can cause seizures, which is why the FDA added a boxed warning in 2020. In a survey of 1,207 people, many reported symptoms lasting a year or more; the survey was self-selected, so how common this is remains unknown.',
    effects: {
      motor: c('Abrupt withdrawal from regular use can provoke seizures.'),
      amygdala: c('Rebound anxiety and panic, often stronger than before treatment.'),
      thalamus: c('Insomnia and heightened sensitivity to light, sound and touch.'),
      cerebellum: r('Unsteadiness and a rocking or swaying sensation.'),
      hippocampus: r('Poor memory and concentration were among the most persistent symptoms in surveys.'),
      muscle: c('Stiffness, twitching, tremor and pain.'),
      peripheral: r('Tingling, burning and numbness.'),
      heart: c('Palpitations and raised pulse from unopposed sympathetic drive.'),
      gut: r('Nausea, cramping and changes in appetite.'),
      symp: c('The accelerator runs with less brake: sweating, shaking, startle.'),
    },
    sources: ['FDA Drug Safety Communication 2020', 'Ritvo et al. 2023, PLOS ONE', 'Ashton 2002, Benzodiazepines: How They Work and How to Withdraw'],
  },
  {
    id: 'akathisia', group: 'withdrawal', name: 'Akathisia', source: 'midbrain',
    summary: 'An intense inner restlessness with a compulsion to move, caused by medication: most often antipsychotics, also antidepressants, and sometimes on starting, changing or stopping a dose. It is frequently mistaken for anxiety or agitation. It is associated with suicidal thoughts and should be treated as urgent.',
    effects: {
      midbrain: p('Thought to involve disrupted dopamine signalling, though the mechanism is not settled.'),
      dstr: p('The movement circuit most implicated.'),
      lc: p('Noradrenaline over-activity is suspected; beta-blockers are one treatment clinicians use.'),
      muscle: c('Unable to sit or stand still; pacing, rocking, shifting.'),
      amygdala: r('Described as terror or torment rather than ordinary anxiety.'),
    },
    sources: ['Pringsheim et al. 2018, Can J Psychiatry', 'Lohr et al. 2015, CNS Spectr'],
  },

  // ───────────── Supports
  {
    id: 'exercise', group: 'support', name: 'Regular movement',
    summary: 'Aerobic and strength exercise have moderate antidepressant effects in trials. The brain mechanisms are still being worked out. For a sensitised nervous system the dose matters: see Recovery.',
    effects: {
      hippocampus: m('A year of aerobic walking increased volume by about 2% in older adults in one trial; pooled results are smaller.'),
      dlpfc: m('Associated with better executive function, most clearly in older adults.'),
      nacc: p('Engages the reward circuit; may help restore motivation in low mood.'),
      heart: c('Raises heart-rate variability and lowers resting rate over weeks.'),
      muscle: c('Releases signalling molecules that act on the brain; discharges tension.'),
      hypothalamus: m('Regular training is associated with a smaller cortisol response to stress.'),
    },
    sources: ['Noetel et al. 2024, BMJ', 'Erickson et al. 2011, PNAS'],
  },
  {
    id: 'breath', group: 'support', name: 'Slow breathing & body awareness', source: 'lungs',
    summary: 'Breathing is the one autonomic rhythm that can be steered on purpose. Slow, exhale-weighted breathing shifts the balance toward the parasympathetic branch within minutes.',
    effects: {
      lungs: c('Slow diaphragmatic breaths at around six per minute.'),
      vagus: c('Stretch receptors in the lungs report upward; vagal outflow to the heart increases on the exhale.'),
      heart: c('Heart-rate variability rises during the practice.'),
      medulla: c('Breathing rhythm and heart rhythm are coupled here.'),
      insula: m('More active during attention to the body; differs in long-term meditators.'),
      amygdala: p('Reduced reactivity after mindfulness training in several small studies.'),
      lc: p('Animal work links slow breathing rhythm to calmer locus coeruleus activity.'),
    },
    sources: ['Balban et al. 2023, Cell Rep Med', 'Goessl et al. 2017, Psychol Med', 'Yackle et al. 2017, Science'],
  },
  {
    id: 'contact', group: 'support', name: 'Safe company',
    summary: 'The presence of a trusted person measurably lowers threat responses. Social support is one of the most consistent predictors of recovery across mental and physical illness.',
    effects: {
      amygdala: m('Threat responses were smaller while holding a partner’s hand in brain-imaging experiments.'),
      hypothalamus: m('Cortisol responses to stress are lower with social support.'),
      vmpfc: m('Safety signals from familiar people are processed here.'),
      heart: m('Supportive contact is associated with lower cardiovascular reactivity.'),
    },
    sources: ['Coan et al. 2006, Psychol Sci', 'Heinrichs et al. 2003, Biol Psychiatry', 'Holt-Lunstad et al. 2010, PLoS Med'],
  },
]
