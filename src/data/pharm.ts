// How psychiatric medications act on the nervous system, and a deliberately
// small set of well-established interaction mechanisms between them.
//
// Educational only. Doses, formulations and individual factors change the
// picture, and this is not an interaction checker: the UI says so.

import type { StructureId } from './atlas'

export type TargetId =
  | 'SERT' | 'NET' | 'DAT' | 'MAO' | 'GABAA' | 'GABAT' | 'A2D' | 'D2' | 'HT2A' | 'HT2C' | 'HT1A' | 'HT3'
  | 'H1' | 'MUSC' | 'A1' | 'A2' | 'BETA' | 'NAV' | 'NMDA' | 'LI' | 'CYP2D6' | 'UGT'

export interface Target {
  id: TargetId
  name: string
  short: string
  does: string
  sites: Partial<Record<StructureId, string>>
}

export const TARGETS: Record<TargetId, Target> = {
  SERT: {
    id: 'SERT', name: 'Serotonin transporter', short: 'SERT',
    does: 'Clears serotonin from the synapse. Blocking it leaves serotonin acting for longer; over weeks the receptors adapt.',
    sites: {
      raphe: 'Serotonin cell bodies. Their autoreceptors first slow firing, then adapt over two to six weeks — one explanation for the delayed effect.',
      amygdala: 'Less reactivity to threatening faces, sometimes within days.',
      hippocampus: 'Dense serotonin input; animal work suggests increased plasticity.',
      vmpfc: 'Changes in emotional appraisal; also linked to emotional blunting.',
      hypothalamus: 'Appetite, temperature and sleep timing shift.',
      thalamus: 'REM sleep is suppressed and dreams can become vivid.',
      gut: 'The gut holds most of the body’s serotonin: nausea and bowel changes are common early on.',
      spinal: 'Descending serotonin fibres modulate pain signals.',
      pelvic: 'Downstream: lower libido, genital numbing and delayed orgasm are common.',
    },
  },
  NET: {
    id: 'NET', name: 'Noradrenaline transporter', short: 'NET',
    does: 'Clears noradrenaline. Blocking it raises noradrenaline in the brain and at sympathetic nerve endings.',
    sites: {
      lc: 'Noradrenaline neurons adjust their firing to the higher levels.',
      dlpfc: 'In the prefrontal cortex this transporter also clears dopamine, so blocking it raises both — relevant to focus.',
      symp: 'More noradrenaline at sympathetic nerve endings throughout the body.',
      heart: 'Heart rate and blood pressure can rise.',
      skin: 'Sweating increases.',
      pelvic: 'Can make passing urine harder.',
    },
  },
  DAT: {
    id: 'DAT', name: 'Dopamine transporter', short: 'DAT',
    does: 'Clears dopamine. Blocking or reversing it raises dopamine, mostly in the striatum where the transporter is densest.',
    sites: {
      dstr: 'Dense transporter here; raised dopamine affects movement and habit.',
      nacc: 'Reward circuit: drive and motivation increase; also the basis of misuse potential.',
      midbrain: 'Dopamine neurons slow their firing in response.',
    },
  },
  MAO: {
    id: 'MAO', name: 'Monoamine oxidase (A & B)', short: 'MAO',
    does: 'An enzyme that breaks down serotonin, noradrenaline and dopamine. Inhibiting it raises all three.',
    sites: {
      raphe: 'More serotonin available for release.',
      lc: 'More noradrenaline available for release.',
      midbrain: 'More dopamine available for release.',
      gut: 'MAO in the gut wall normally destroys tyramine from food. When it is blocked, aged cheese, cured meats and similar foods can trigger a dangerous blood-pressure spike.',
      liver: 'MAO here also clears dietary amines.',
    },
  },
  GABAA: {
    id: 'GABAA', name: 'GABA-A receptor (benzodiazepine site)', short: 'GABA-A',
    does: 'Makes GABA-A receptors open more readily, strengthening the nervous system’s main inhibitory signal. With regular use the receptors adapt and tolerance develops.',
    sites: {
      amygdala: 'Fear and anxiety fall within minutes.',
      thalamus: 'Sedation and sleep onset.',
      hippocampus: 'New memories form less well while the drug is active.',
      cerebellum: 'Unsteadiness and slowed coordination; a cause of falls in older people.',
      motor: 'Raises the seizure threshold. After regular use, stopping abruptly can cause seizures.',
      spinal: 'Muscle relaxation.',
      medulla: 'Breathing drive is suppressed when combined with opioids, alcohol or other sedatives.',
    },
  },
  GABAT: {
    id: 'GABAT', name: 'GABA breakdown', short: 'GABA ↑',
    does: 'Slows the breakdown and increases the synthesis of GABA, raising inhibitory tone overall.',
    sites: {
      motor: 'Anticonvulsant effect.',
      thalamus: 'Sedation in some people.',
      cerebellum: 'Tremor and unsteadiness are possible side effects.',
    },
  },
  A2D: {
    id: 'A2D', name: 'α2δ calcium-channel subunit', short: 'α2δ',
    does: 'Reduces the release of excitatory signals such as glutamate and noradrenaline from overactive nerve cells.',
    sites: {
      spinal: 'Dorsal horn: reduces pain signalling — the basis for its use in nerve pain.',
      peripheral: 'Used for neuropathic pain.',
      amygdala: 'Anxiety reduction.',
      cerebellum: 'Dizziness and unsteadiness are among the commonest side effects.',
      motor: 'Anticonvulsant effect.',
      medulla: 'Breathing can be suppressed with opioids or other sedatives, or in lung disease (FDA warning, 2019).',
      kidney: 'Cleared unchanged by the kidneys; doses are lowered when kidney function is reduced.',
    },
  },
  D2: {
    id: 'D2', name: 'Dopamine D2 receptor', short: 'D2',
    does: 'The main target of antipsychotics. Reducing D2 signalling in one pathway eases psychosis; in the others it causes most of the side effects.',
    sites: {
      nacc: 'Mesolimbic pathway: psychotic symptoms ease. Some people describe flattened drive or pleasure.',
      dstr: 'Nigrostriatal pathway: stiffness, tremor, restlessness (akathisia) and, with long use, tardive dyskinesia.',
      pituitary: 'Removes dopamine’s brake on prolactin: breast changes, missed periods, sexual effects.',
      medulla: 'Chemoreceptor trigger zone: anti-nausea effect.',
      dlpfc: 'Mesocortical pathway: possible effects on motivation and thinking.',
    },
  },
  HT2A: {
    id: 'HT2A', name: 'Serotonin 5-HT2A receptor', short: '5-HT2A',
    does: 'Dense in the cortex. Blocking it deepens sleep and is thought to ease psychosis; it also takes some of the edge off D2-blockade movement effects.',
    sites: {
      dlpfc: 'Dense receptor field across the cortex.',
      vmpfc: 'Involved in emotional processing and perception.',
      dstr: 'Blocking it frees some striatal dopamine, which may reduce movement side effects.',
      thalamus: 'Deeper slow-wave sleep.',
    },
  },
  HT2C: {
    id: 'HT2C', name: 'Serotonin 5-HT2C receptor', short: '5-HT2C',
    does: 'Normally restrains appetite and the release of dopamine and noradrenaline.',
    sites: {
      hypothalamus: 'Appetite control: blocking it increases appetite and weight.',
      midbrain: 'Blocking it releases the brake on dopamine and noradrenaline in the frontal cortex.',
    },
  },
  HT1A: {
    id: 'HT1A', name: 'Serotonin 5-HT1A receptor', short: '5-HT1A',
    does: 'An autoreceptor on serotonin neurons and a receptor in limbic areas, linked to anxiety regulation.',
    sites: {
      raphe: 'Autoreceptor that sets how fast serotonin neurons fire.',
      hippocampus: 'Dense receptor field.',
      amygdala: 'Linked to anxiety regulation.',
    },
  },
  HT3: {
    id: 'HT3', name: 'Serotonin 5-HT3 receptor', short: '5-HT3',
    does: 'An ion channel that triggers nausea and gut movement. Blocking it is anti-nausea.',
    sites: {
      gut: 'Less nausea and slower gut movement.',
      medulla: 'Vomiting centre (area postrema).',
    },
  },
  H1: {
    id: 'H1', name: 'Histamine H1 receptor', short: 'H1',
    does: 'Histamine is one of the brain’s main wakefulness signals. Blocking H1 causes sedation and increased appetite.',
    sites: {
      hypothalamus: 'Histamine neurons here keep you awake; blocking their receptors causes drowsiness and hunger.',
      thalamus: 'Lower cortical arousal.',
    },
  },
  MUSC: {
    id: 'MUSC', name: 'Muscarinic acetylcholine receptors', short: 'Muscarinic',
    does: 'Blocking them produces “anticholinergic” effects across the brain and body. The burden adds up across drugs, especially in older people.',
    sites: {
      hippocampus: 'Memory and concentration can suffer; confusion in older people.',
      gut: 'Constipation.',
      pelvic: 'Difficulty passing urine.',
      heart: 'Faster heart rate.',
      skin: 'Less sweating; dry mouth and eyes.',
    },
  },
  A1: {
    id: 'A1', name: 'α1-adrenergic receptor', short: 'α1',
    does: 'Keeps blood vessels toned. Blocking it lowers blood pressure, especially on standing.',
    sites: {
      symp: 'Blood vessels relax: dizziness or fainting on standing up.',
      heart: 'Reflex speeding of the heart on standing.',
      pelvic: 'Rarely, prolonged painful erection (priapism) — an emergency.',
    },
  },
  A2: {
    id: 'A2', name: 'α2-adrenergic receptor', short: 'α2',
    does: 'A brake on noradrenaline release. Activating it calms the system; blocking it increases noradrenaline and serotonin release.',
    sites: {
      lc: 'Autoreceptor that sets how much noradrenaline is released.',
      raphe: 'Heteroreceptor on serotonin terminals; also regulates serotonin release.',
      heart: 'Activation lowers heart rate and blood pressure.',
      symp: 'Activation reduces sympathetic outflow.',
    },
  },
  BETA: {
    id: 'BETA', name: 'β-adrenergic receptors', short: 'β',
    does: 'Receive adrenaline and noradrenaline in the heart, airways and muscle. Blocking them damps the physical surge of anxiety.',
    sites: {
      heart: 'Slower, less forceful heartbeat; the pounding heart of anxiety is blunted.',
      muscle: 'Less tremor.',
      lungs: 'Airways can narrow: caution in asthma.',
    },
  },
  NAV: {
    id: 'NAV', name: 'Voltage-gated sodium channels', short: 'Na⁺',
    does: 'Carry the electrical impulse along nerve and heart cells. Blocking them stabilises overactive neurons.',
    sites: {
      motor: 'Anticonvulsant effect; also reduces glutamate release.',
      heart: 'In overdose, slows electrical conduction in the heart — one reason tricyclic overdose is dangerous.',
      peripheral: 'Dampens nerve-pain signalling.',
    },
  },
  NMDA: {
    id: 'NMDA', name: 'NMDA glutamate receptor', short: 'NMDA',
    does: 'The main receptor for glutamate-driven plasticity. Blocking it briefly triggers a burst of glutamate signalling, thought to underlie a rapid antidepressant effect.',
    sites: {
      dlpfc: 'Rapid growth of synaptic connections in animal studies.',
      hippocampus: 'Plasticity signalling.',
      thalamus: 'Dissociation and altered perception during treatment.',
      symp: 'Blood pressure rises transiently.',
    },
  },
  LI: {
    id: 'LI', name: 'Lithium’s intracellular targets', short: 'GSK-3 / inositol',
    does: 'Lithium works inside cells, inhibiting enzymes such as GSK-3 and inositol monophosphatase. How this stabilises mood is not fully understood.',
    sites: {
      hippocampus: 'Neuroprotective signalling in animal and imaging studies.',
      vmpfc: 'Mood stabilisation; also the strongest evidence of any drug for reducing suicide in mood disorders.',
      kidney: 'Cleared by the kidneys. Long-term use can reduce kidney concentrating ability and function.',
      thyroid: 'Can reduce thyroid hormone output; checked with regular blood tests.',
      muscle: 'Fine tremor is common.',
    },
  },
  CYP2D6: {
    id: 'CYP2D6', name: 'CYP2D6 liver enzyme', short: 'CYP2D6',
    does: 'Breaks down many antidepressants, antipsychotics and beta-blockers. Inhibiting it raises the levels of those drugs.',
    sites: { liver: 'Strong inhibition can several-fold raise the levels of drugs that depend on this enzyme.' },
  },
  UGT: {
    id: 'UGT', name: 'Glucuronidation (UGT enzymes)', short: 'UGT',
    does: 'A liver pathway that clears lamotrigine and some other drugs.',
    sites: { liver: 'Valproate inhibits it, roughly doubling lamotrigine levels.' },
  },
}

export type ClassId =
  | 'ssri' | 'snri' | 'atypical-ad' | 'tca' | 'maoi' | 'benzo' | 'z' | 'antipsychotic' | 'mood' | 'stimulant'
  | 'gabapentinoid' | 'other'

export const CLASSES: { id: ClassId; name: string }[] = [
  { id: 'ssri', name: 'SSRIs' },
  { id: 'snri', name: 'SNRIs' },
  { id: 'atypical-ad', name: 'Other antidepressants' },
  { id: 'tca', name: 'Tricyclics' },
  { id: 'maoi', name: 'MAOIs' },
  { id: 'benzo', name: 'Benzodiazepines' },
  { id: 'z', name: 'Z-drugs' },
  { id: 'antipsychotic', name: 'Antipsychotics' },
  { id: 'mood', name: 'Mood stabilisers' },
  { id: 'stimulant', name: 'Stimulants' },
  { id: 'gabapentinoid', name: 'Gabapentinoids' },
  { id: 'other', name: 'Others' },
]

export type Action = 'blocks' | 'activates' | 'partial' | 'enhances' | 'inhibits' | 'releases'

export const ACTION_LABEL: Record<Action, string> = {
  blocks: 'blocks',
  activates: 'activates',
  partial: 'partially activates',
  enhances: 'enhances',
  inhibits: 'inhibits',
  releases: 'reverses (releases)',
}

/** Mechanism flags the interaction rules work from. */
export type Flag =
  | 'serotonergic' // meaningful serotonin increase
  | 'serotonergic-low' // smaller or indirect serotonergic contribution
  | 'maoi'
  | 'sedating'
  | 'gaba-depressant' // benzodiazepines, Z-drugs, gabapentinoids
  | 'qt'
  | 'anticholinergic'
  | 'cyp2d6-strong'
  | 'cyp2d6-moderate'
  | 'cyp2d6-substrate'
  | 'seizure'
  | 'pressor' // raises blood pressure or heart rate meaningfully
  | 'da-up'
  | 'da-block'
  | 'lamotrigine'
  | 'valproate'
  | 'clonidine'
  | 'beta-blocker'

export interface Drug {
  id: string
  name: string
  brands: string
  cls: ClassId
  halfLife: string
  uses: string
  targets: { t: TargetId; action: Action; weight: 1 | 2 | 3 }[]
  effects: string[]
  safety: string
  stopping: string
  flags: Flag[]
  /** Drug-specific notes that replace the generic target note at a structure. */
  overrides?: Partial<Record<StructureId, string>>
}

export const DRUGS: Drug[] = [
  // ───── SSRIs
  {
    id: 'sertraline', name: 'Sertraline', brands: 'Zoloft, Lustral', cls: 'ssri', halfLife: 'About 1 day',
    uses: 'Depression, anxiety disorders, OCD, PTSD.',
    targets: [{ t: 'SERT', action: 'blocks', weight: 3 }, { t: 'DAT', action: 'blocks', weight: 1 }],
    effects: ['Nausea and loose stools early on', 'Sexual side effects', 'Sweating', 'Sleep changes', 'Emotional blunting in some'],
    safety: 'Agitation or suicidal thoughts can increase in the first weeks, especially under 25. Report this promptly.',
    stopping: 'Reduce gradually with a prescriber. Withdrawal symptoms are fairly common with a one-day half-life.',
    flags: ['serotonergic'],
  },
  {
    id: 'fluoxetine', name: 'Fluoxetine', brands: 'Prozac', cls: 'ssri', halfLife: '1–4 days; active metabolite 1–2 weeks',
    uses: 'Depression, OCD, bulimia.',
    targets: [{ t: 'SERT', action: 'blocks', weight: 3 }, { t: 'HT2C', action: 'blocks', weight: 1 }, { t: 'CYP2D6', action: 'inhibits', weight: 3 }],
    effects: ['Restlessness or activation early on', 'Insomnia', 'Nausea', 'Sexual side effects'],
    safety: 'Strongly inhibits CYP2D6, raising levels of many other drugs. Stays in the body for weeks after stopping.',
    stopping: 'The very long half-life acts as a partial built-in taper, so withdrawal is often milder or delayed — but it does occur.',
    flags: ['serotonergic', 'cyp2d6-strong'],
  },
  {
    id: 'escitalopram', name: 'Escitalopram', brands: 'Lexapro, Cipralex', cls: 'ssri', halfLife: 'About 1–1.5 days',
    uses: 'Depression, generalised anxiety, panic.',
    targets: [{ t: 'SERT', action: 'blocks', weight: 3 }],
    effects: ['Nausea', 'Sexual side effects', 'Sweating', 'Fatigue or insomnia'],
    safety: 'Dose-related lengthening of the QT interval on the ECG (more so with citalopram).',
    stopping: 'Reduce gradually with a prescriber.',
    flags: ['serotonergic', 'qt'],
  },
  {
    id: 'paroxetine', name: 'Paroxetine', brands: 'Paxil, Seroxat', cls: 'ssri', halfLife: 'About 21 hours',
    uses: 'Depression, anxiety disorders, PTSD.',
    targets: [{ t: 'SERT', action: 'blocks', weight: 3 }, { t: 'MUSC', action: 'blocks', weight: 1 }, { t: 'CYP2D6', action: 'inhibits', weight: 3 }],
    effects: ['Drowsiness', 'Weight gain', 'Sexual side effects', 'Constipation and dry mouth'],
    safety: 'Strongly inhibits CYP2D6. Avoided in pregnancy where possible.',
    stopping: 'Among the antidepressants most associated with withdrawal: a short half-life, and it inhibits its own breakdown, so levels fall steeply as the dose comes down.',
    flags: ['serotonergic', 'anticholinergic', 'cyp2d6-strong'],
  },
  // ───── SNRIs
  {
    id: 'venlafaxine', name: 'Venlafaxine', brands: 'Effexor', cls: 'snri', halfLife: '5 hours (active metabolite about 11)',
    uses: 'Depression, generalised anxiety, panic.',
    targets: [{ t: 'SERT', action: 'blocks', weight: 3 }, { t: 'NET', action: 'blocks', weight: 2 }],
    effects: ['Nausea', 'Sweating', 'Raised blood pressure at higher doses', 'Sexual side effects'],
    safety: 'Blood pressure should be checked at higher doses. Dangerous in overdose.',
    stopping: 'Known for withdrawal symptoms, sometimes within a day of a missed dose, because of its short half-life.',
    flags: ['serotonergic', 'pressor', 'cyp2d6-substrate'],
    overrides: { lc: 'Noradrenaline reuptake is blocked mainly at higher doses.' },
  },
  {
    id: 'duloxetine', name: 'Duloxetine', brands: 'Cymbalta', cls: 'snri', halfLife: 'About 12 hours',
    uses: 'Depression, generalised anxiety, nerve pain, fibromyalgia.',
    targets: [{ t: 'SERT', action: 'blocks', weight: 3 }, { t: 'NET', action: 'blocks', weight: 3 }, { t: 'CYP2D6', action: 'inhibits', weight: 2 }],
    effects: ['Nausea', 'Dry mouth', 'Sweating', 'Constipation', 'Sexual side effects'],
    safety: 'Moderately inhibits CYP2D6. Avoided in significant liver disease.',
    stopping: 'Withdrawal symptoms are common; reduce gradually.',
    flags: ['serotonergic', 'cyp2d6-moderate', 'cyp2d6-substrate'],
    overrides: { spinal: 'Boosting descending serotonin and noradrenaline is thought to explain its effect on chronic pain.' },
  },
  // ───── Other antidepressants
  {
    id: 'bupropion', name: 'Bupropion', brands: 'Wellbutrin, Zyban', cls: 'atypical-ad', halfLife: 'About 21 hours',
    uses: 'Depression, seasonal depression, stopping smoking.',
    targets: [{ t: 'NET', action: 'blocks', weight: 2 }, { t: 'DAT', action: 'blocks', weight: 2 }, { t: 'CYP2D6', action: 'inhibits', weight: 3 }],
    effects: ['Insomnia', 'Dry mouth', 'Anxiety or agitation', 'Headache', 'Few sexual side effects'],
    safety: 'Lowers the seizure threshold, more so at higher doses. Strongly inhibits CYP2D6.',
    stopping: 'Withdrawal is generally milder than with serotonergic antidepressants.',
    flags: ['seizure', 'cyp2d6-strong', 'pressor', 'da-up'],
  },
  {
    id: 'mirtazapine', name: 'Mirtazapine', brands: 'Remeron, Zispin', cls: 'atypical-ad', halfLife: '20–40 hours',
    uses: 'Depression, especially with poor sleep or appetite.',
    targets: [
      { t: 'A2', action: 'blocks', weight: 3 }, { t: 'H1', action: 'blocks', weight: 3 }, { t: 'HT2A', action: 'blocks', weight: 2 },
      { t: 'HT2C', action: 'blocks', weight: 2 }, { t: 'HT3', action: 'blocks', weight: 2 },
    ],
    effects: ['Sleepiness', 'Increased appetite and weight gain', 'Few sexual side effects', 'Little nausea'],
    safety: 'Sedation is often strongest at low doses.',
    stopping: 'Rebound insomnia and anxiety are common; reduce gradually.',
    flags: ['sedating', 'serotonergic-low'],
  },
  {
    id: 'trazodone', name: 'Trazodone', brands: 'Desyrel, Molipaxin', cls: 'atypical-ad', halfLife: '5–9 hours',
    uses: 'Depression; widely used at low doses for sleep.',
    targets: [
      { t: 'HT2A', action: 'blocks', weight: 3 }, { t: 'A1', action: 'blocks', weight: 2 }, { t: 'H1', action: 'blocks', weight: 2 },
      { t: 'SERT', action: 'blocks', weight: 1 },
    ],
    effects: ['Sleepiness', 'Dizziness on standing', 'Morning grogginess'],
    safety: 'Rarely causes priapism, which needs emergency care.',
    stopping: 'Usually easier than SSRIs; rebound insomnia is common.',
    flags: ['sedating', 'serotonergic-low', 'qt'],
  },
  {
    id: 'esketamine', name: 'Esketamine', brands: 'Spravato', cls: 'atypical-ad', halfLife: '7–12 hours',
    uses: 'Treatment-resistant depression, given as a nasal spray under supervision.',
    targets: [{ t: 'NMDA', action: 'blocks', weight: 3 }],
    effects: ['Dissociation during treatment', 'Raised blood pressure for a few hours', 'Nausea', 'Sedation'],
    safety: 'Given in a clinic with at least two hours of monitoring. Misuse potential.',
    stopping: 'Stopped under clinical supervision; relapse is the main concern.',
    flags: ['sedating'],
  },
  // ───── Tricyclic
  {
    id: 'amitriptyline', name: 'Amitriptyline', brands: 'Elavil', cls: 'tca', halfLife: '10–28 hours (active metabolite up to 44)',
    uses: 'Depression at full dose; nerve pain, migraine prevention and sleep at low dose.',
    targets: [
      { t: 'SERT', action: 'blocks', weight: 3 }, { t: 'NET', action: 'blocks', weight: 2 }, { t: 'H1', action: 'blocks', weight: 3 },
      { t: 'MUSC', action: 'blocks', weight: 3 }, { t: 'A1', action: 'blocks', weight: 3 }, { t: 'NAV', action: 'blocks', weight: 2 },
    ],
    effects: ['Dry mouth', 'Constipation', 'Drowsiness', 'Weight gain', 'Dizziness on standing'],
    safety: 'Dangerous in overdose because of effects on heart rhythm.',
    stopping: 'Withdrawal can include “cholinergic rebound”: nausea, sweating, vivid dreams. Reduce gradually.',
    flags: ['serotonergic', 'sedating', 'anticholinergic', 'qt', 'seizure', 'cyp2d6-substrate'],
  },
  // ───── MAOI
  {
    id: 'phenelzine', name: 'Phenelzine', brands: 'Nardil', cls: 'maoi', halfLife: 'About 11 hours, but the enzyme takes about 2 weeks to recover',
    uses: 'Depression that has not responded to other treatments; social anxiety.',
    targets: [{ t: 'MAO', action: 'inhibits', weight: 3 }],
    effects: ['Dizziness on standing', 'Weight gain', 'Insomnia or sleepiness', 'Sexual side effects'],
    safety: 'Needs a low-tyramine diet. Dangerous with many medicines, including other antidepressants, stimulants, some painkillers and cold remedies.',
    stopping: 'Withdrawal can be marked; reduce gradually. Interaction precautions continue for 2 weeks after the last dose.',
    flags: ['maoi', 'serotonergic'],
  },
  // ───── Benzodiazepines
  {
    id: 'alprazolam', name: 'Alprazolam', brands: 'Xanax', cls: 'benzo', halfLife: 'About 11 hours',
    uses: 'Panic disorder, short-term anxiety.',
    targets: [{ t: 'GABAA', action: 'enhances', weight: 3 }],
    effects: ['Drowsiness', 'Unsteadiness', 'Memory problems', 'Rebound anxiety between doses'],
    safety: 'FDA boxed warning (2020): misuse, dependence and withdrawal reactions. Dangerous with opioids or alcohol.',
    stopping: 'Short-acting, so levels fall quickly. Never stop suddenly after regular use; tapers are slow and often switch to a longer-acting drug.',
    flags: ['sedating', 'gaba-depressant'],
  },
  {
    id: 'clonazepam', name: 'Clonazepam', brands: 'Klonopin, Rivotril', cls: 'benzo', halfLife: '30–40 hours',
    uses: 'Panic disorder, seizures.',
    targets: [{ t: 'GABAA', action: 'enhances', weight: 3 }],
    effects: ['Drowsiness', 'Unsteadiness', 'Low mood in some', 'Memory problems'],
    safety: 'FDA boxed warning (2020): misuse, dependence and withdrawal reactions. Dangerous with opioids or alcohol.',
    stopping: 'Never stop suddenly after regular use. Reduce slowly with a prescriber.',
    flags: ['sedating', 'gaba-depressant'],
  },
  {
    id: 'diazepam', name: 'Diazepam', brands: 'Valium', cls: 'benzo', halfLife: '1–2 days; active metabolite up to 4 days or more',
    uses: 'Anxiety, muscle spasm, alcohol withdrawal, seizures.',
    targets: [{ t: 'GABAA', action: 'enhances', weight: 3 }],
    effects: ['Drowsiness', 'Unsteadiness', 'Memory problems'],
    safety: 'Accumulates with repeated doses, especially in older people.',
    stopping: 'Its long half-life makes it the usual drug to switch to for a slow benzodiazepine taper (the Ashton approach).',
    flags: ['sedating', 'gaba-depressant'],
  },
  // ───── Z-drug
  {
    id: 'zolpidem', name: 'Zolpidem', brands: 'Ambien, Stilnoct', cls: 'z', halfLife: '2–3 hours',
    uses: 'Short-term insomnia.',
    targets: [{ t: 'GABAA', action: 'enhances', weight: 3 }],
    effects: ['Next-day drowsiness', 'Memory gaps', 'Sleepwalking or sleep-eating'],
    safety: 'FDA boxed warning (2019): complex sleep behaviours such as sleep-driving, sometimes fatal.',
    stopping: 'Rebound insomnia is common for a few nights; reduce gradually after regular use.',
    flags: ['sedating', 'gaba-depressant'],
    overrides: { amygdala: 'Selective for the α1 subtype, so it is mainly sedating with less anti-anxiety effect.' },
  },
  // ───── Antipsychotics
  {
    id: 'haloperidol', name: 'Haloperidol', brands: 'Haldol', cls: 'antipsychotic', halfLife: 'About 1 day',
    uses: 'Psychosis, acute agitation, delirium.',
    targets: [{ t: 'D2', action: 'blocks', weight: 3 }, { t: 'A1', action: 'blocks', weight: 1 }],
    effects: ['Stiffness and tremor', 'Akathisia', 'Raised prolactin'],
    safety: 'High risk of movement side effects. Can lengthen QT, especially intravenously.',
    stopping: 'Gradual reduction lowers the risk of relapse and withdrawal-emergent movement symptoms.',
    flags: ['da-block', 'qt', 'cyp2d6-substrate'],
  },
  {
    id: 'olanzapine', name: 'Olanzapine', brands: 'Zyprexa', cls: 'antipsychotic', halfLife: 'About 30 hours',
    uses: 'Schizophrenia, bipolar disorder.',
    targets: [
      { t: 'HT2A', action: 'blocks', weight: 3 }, { t: 'H1', action: 'blocks', weight: 3 }, { t: 'D2', action: 'blocks', weight: 2 },
      { t: 'HT2C', action: 'blocks', weight: 2 }, { t: 'MUSC', action: 'blocks', weight: 2 }, { t: 'A1', action: 'blocks', weight: 1 },
    ],
    effects: ['Sleepiness', 'Large appetite increase and weight gain', 'Raised blood sugar and cholesterol'],
    safety: 'Metabolic monitoring (weight, glucose, lipids) is recommended.',
    stopping: 'Rebound insomnia, nausea and restlessness are reported; reduce gradually.',
    flags: ['sedating', 'anticholinergic', 'da-block'],
  },
  {
    id: 'quetiapine', name: 'Quetiapine', brands: 'Seroquel', cls: 'antipsychotic', halfLife: 'About 7 hours',
    uses: 'Schizophrenia, bipolar disorder, add-on for depression; widely used off-label for sleep.',
    targets: [
      { t: 'H1', action: 'blocks', weight: 3 }, { t: 'HT2A', action: 'blocks', weight: 2 }, { t: 'A1', action: 'blocks', weight: 2 },
      { t: 'D2', action: 'blocks', weight: 1 }, { t: 'NET', action: 'blocks', weight: 1 }, { t: 'MUSC', action: 'blocks', weight: 1 },
    ],
    effects: ['Sleepiness', 'Dizziness on standing', 'Weight gain', 'Dry mouth'],
    safety: 'Metabolic monitoring recommended. Can lengthen QT.',
    stopping: 'Rebound insomnia, nausea and sweating are common; reduce gradually.',
    flags: ['sedating', 'qt', 'anticholinergic', 'da-block'],
    overrides: { dstr: 'Binds D2 only loosely and briefly, so movement side effects are uncommon.' },
  },
  {
    id: 'aripiprazole', name: 'Aripiprazole', brands: 'Abilify', cls: 'antipsychotic', halfLife: 'About 3 days',
    uses: 'Schizophrenia, bipolar disorder, add-on for depression.',
    targets: [{ t: 'D2', action: 'partial', weight: 3 }, { t: 'HT1A', action: 'partial', weight: 2 }, { t: 'HT2A', action: 'blocks', weight: 2 }],
    effects: ['Akathisia and restlessness', 'Insomnia', 'Nausea', 'Less weight gain than many antipsychotics'],
    safety: 'Regulators have warned about compulsive gambling, shopping and eating (FDA 2016).',
    stopping: 'The long half-life slows the fall in levels; reduce gradually.',
    flags: ['da-block', 'cyp2d6-substrate'],
    overrides: {
      dstr: 'As a partial agonist it lowers dopamine signalling without blocking it entirely. Akathisia is its most common movement side effect.',
      pituitary: 'Prolactin usually stays normal or falls.',
    },
  },
  // ───── Mood stabilisers
  {
    id: 'lithium', name: 'Lithium', brands: 'Priadel, Lithobid', cls: 'mood', halfLife: '18–36 hours',
    uses: 'Bipolar disorder; add-on for depression.',
    targets: [{ t: 'LI', action: 'inhibits', weight: 3 }],
    effects: ['Thirst and passing more urine', 'Fine tremor', 'Weight gain', 'Thyroid and kidney changes over years'],
    safety: 'Narrow gap between effective and toxic levels, so blood levels are checked regularly. Dehydration, NSAID painkillers and some blood-pressure drugs raise levels.',
    stopping: 'Stopping quickly raises the risk of relapse into mania; reduce over at least four weeks.',
    flags: ['serotonergic-low'],
  },
  {
    id: 'lamotrigine', name: 'Lamotrigine', brands: 'Lamictal', cls: 'mood', halfLife: 'About 25–33 hours',
    uses: 'Preventing bipolar depression; epilepsy.',
    targets: [{ t: 'NAV', action: 'blocks', weight: 3 }, { t: 'UGT', action: 'inhibits', weight: 1 }],
    effects: ['Headache', 'Dizziness', 'Usually weight-neutral', 'Rash'],
    safety: 'Must be started slowly: fast increases raise the risk of a rare, life-threatening rash (Stevens–Johnson syndrome).',
    stopping: 'Reduce gradually; if more than a few days are missed it must be restarted from a low dose.',
    flags: ['lamotrigine'],
    overrides: { liver: 'Cleared mainly by glucuronidation, which is why valproate raises its levels.' },
  },
  {
    id: 'valproate', name: 'Valproate', brands: 'Depakote, Epilim', cls: 'mood', halfLife: '9–16 hours',
    uses: 'Bipolar disorder (mania), epilepsy.',
    targets: [{ t: 'GABAT', action: 'inhibits', weight: 2 }, { t: 'NAV', action: 'blocks', weight: 2 }, { t: 'UGT', action: 'inhibits', weight: 2 }],
    effects: ['Weight gain', 'Tremor', 'Hair thinning', 'Nausea'],
    safety: 'Causes serious birth defects and developmental problems; regulators restrict its use in anyone who could become pregnant. Can affect the liver and pancreas.',
    stopping: 'Reduce gradually; abrupt stopping can trigger seizures in epilepsy.',
    flags: ['valproate', 'sedating'],
  },
  // ───── Stimulants
  {
    id: 'methylphenidate', name: 'Methylphenidate', brands: 'Ritalin, Concerta', cls: 'stimulant', halfLife: '2–3 hours (longer-acting forms release it slowly)',
    uses: 'ADHD, narcolepsy.',
    targets: [{ t: 'DAT', action: 'blocks', weight: 3 }, { t: 'NET', action: 'blocks', weight: 3 }],
    effects: ['Reduced appetite', 'Insomnia', 'Raised heart rate and blood pressure', 'Anxiety', 'Evening rebound'],
    safety: 'Heart rate and blood pressure are monitored. Misuse potential.',
    stopping: 'Usually stopped without a long taper; fatigue and low mood can follow heavy use.',
    flags: ['pressor', 'da-up'],
  },
  {
    id: 'amphetamine', name: 'Amphetamine', brands: 'Adderall, Vyvanse (lisdexamfetamine)', cls: 'stimulant', halfLife: 'About 10 hours',
    uses: 'ADHD, narcolepsy, binge-eating disorder (lisdexamfetamine).',
    targets: [{ t: 'DAT', action: 'releases', weight: 3 }, { t: 'NET', action: 'releases', weight: 3 }, { t: 'SERT', action: 'releases', weight: 1 }],
    effects: ['Reduced appetite', 'Insomnia', 'Raised heart rate and blood pressure', 'Irritability'],
    safety: 'Heart rate and blood pressure are monitored. Higher misuse potential than methylphenidate.',
    stopping: 'A “crash” of fatigue, sleepiness and low mood can follow heavy use.',
    flags: ['pressor', 'da-up', 'serotonergic-low'],
    overrides: { nacc: 'Reverses the transporter so dopamine is pushed out, rather than only blocked from returning.' },
  },
  // ───── Gabapentinoids
  {
    id: 'pregabalin', name: 'Pregabalin', brands: 'Lyrica', cls: 'gabapentinoid', halfLife: 'About 6 hours',
    uses: 'Generalised anxiety (in some countries), nerve pain, epilepsy.',
    targets: [{ t: 'A2D', action: 'blocks', weight: 3 }],
    effects: ['Dizziness', 'Sleepiness', 'Weight gain', 'Blurred vision', 'Euphoria in some'],
    safety: 'Misuse and dependence occur; controlled drug in the UK since 2019. Breathing risk with opioids.',
    stopping: 'Withdrawal resembles benzodiazepine withdrawal in some people; reduce over at least a week, often much longer.',
    flags: ['sedating', 'gaba-depressant'],
  },
  {
    id: 'gabapentin', name: 'Gabapentin', brands: 'Neurontin', cls: 'gabapentinoid', halfLife: '5–7 hours',
    uses: 'Nerve pain, epilepsy; off-label for anxiety, sleep and alcohol use disorder.',
    targets: [{ t: 'A2D', action: 'blocks', weight: 3 }],
    effects: ['Dizziness', 'Sleepiness', 'Unsteadiness', 'Swelling of the ankles'],
    safety: 'Misuse and dependence occur. Breathing risk with opioids.',
    stopping: 'Reduce over at least a week; withdrawal can include anxiety, insomnia, pain and sweating.',
    flags: ['sedating', 'gaba-depressant'],
  },
  // ───── Others
  {
    id: 'propranolol', name: 'Propranolol', brands: 'Inderal', cls: 'other', halfLife: '3–6 hours',
    uses: 'Physical symptoms of anxiety and stage fright; akathisia; tremor; migraine.',
    targets: [{ t: 'BETA', action: 'blocks', weight: 3 }],
    effects: ['Tiredness', 'Cold hands and feet', 'Vivid dreams', 'Slow pulse'],
    safety: 'Avoid in asthma. Very dangerous in overdose.',
    stopping: 'After regular use, stopping suddenly can cause a rebound fast heartbeat; reduce gradually.',
    flags: ['beta-blocker', 'cyp2d6-substrate'],
  },
  {
    id: 'clonidine', name: 'Clonidine', brands: 'Catapres, Kapvay', cls: 'other', halfLife: '12–16 hours',
    uses: 'ADHD, hyperarousal and nightmares (off-label), opioid withdrawal symptoms, high blood pressure.',
    targets: [{ t: 'A2', action: 'activates', weight: 3 }],
    effects: ['Sleepiness', 'Low blood pressure', 'Dry mouth', 'Dizziness'],
    safety: 'Adds to the effects of other sedatives and blood-pressure-lowering drugs.',
    stopping: 'Stopping suddenly can cause rebound high blood pressure and agitation; reduce gradually.',
    flags: ['sedating', 'clonidine'],
    overrides: { lc: 'Activating this autoreceptor quietens noradrenaline firing: calmer, sleepier.' },
  },
]

export const drugById = (id: string) => DRUGS.find((d) => d.id === id)

/** Structures a drug reaches, with the targets acting at each, strongest first. */
export function drugSites(d: Drug) {
  const out = new Map<StructureId, { t: TargetId; action: Action; weight: number; note: string }[]>()
  for (const x of d.targets) {
    for (const [sid, note] of Object.entries(TARGETS[x.t].sites) as [StructureId, string][]) {
      const list = out.get(sid) ?? []
      list.push({ t: x.t, action: x.action, weight: x.weight, note: d.overrides?.[sid] ?? note })
      out.set(sid, list)
    }
  }
  for (const list of out.values()) list.sort((a, b) => b.weight - a.weight)
  return out
}

// ───────────── Interactions

export type Level = 'avoid' | 'caution' | 'monitor' | 'note'

export const LEVEL_LABEL: Record<Level, string> = {
  avoid: 'Usually avoided',
  caution: 'Needs caution',
  monitor: 'Monitor',
  note: 'Worth knowing',
}

export interface Interaction {
  level: Level
  title: string
  body: string
}

const has = (d: Drug, f: Flag) => d.flags.includes(f)
const ser = (d: Drug) => has(d, 'serotonergic')
const serAny = (d: Drug) => has(d, 'serotonergic') || has(d, 'serotonergic-low')
const either = (a: Drug, b: Drug, p: (d: Drug) => boolean, q: (d: Drug) => boolean) => (p(a) && q(b)) || (p(b) && q(a))

export function interactions(a: Drug, b: Drug): Interaction[] {
  if (a.id === b.id) return []
  const out: Interaction[] = []
  const names = `${a.name} and ${b.name}`

  if (either(a, b, (d) => has(d, 'maoi'), (d) => serAny(d) && !has(d, 'maoi') && d.id !== 'lithium')) {
    const fluox = a.id === 'fluoxetine' || b.id === 'fluoxetine'
    out.push({
      level: 'avoid',
      title: 'Serotonin syndrome',
      body: `An MAOI combined with another drug that raises serotonin can cause serotonin syndrome: agitation, fever, sweating, tremor and muscle rigidity, which can be fatal. Switching between them needs a gap — usually 2 weeks after stopping an MAOI${fluox ? ', and 5 weeks after stopping fluoxetine because of its long half-life' : ''}.`,
    })
  } else if (ser(a) && ser(b)) {
    out.push({
      level: 'caution',
      title: 'Serotonin load',
      body: 'Both raise serotonin, so the risk of serotonin toxicity is higher. Some combinations are prescribed deliberately under supervision; the warning signs are agitation, tremor, sweating, fever and twitching muscles.',
    })
  } else if (either(a, b, ser, (d) => has(d, 'serotonergic-low'))) {
    out.push({
      level: 'monitor',
      title: 'Serotonin load',
      body: 'One raises serotonin directly and the other contributes indirectly. Serotonin toxicity is uncommon with this pairing but has been reported.',
    })
  }

  if (either(a, b, (d) => has(d, 'maoi'), (d) => has(d, 'pressor'))) {
    out.push({
      level: 'avoid',
      title: 'Hypertensive crisis',
      body: 'MAOIs prevent noradrenaline and dopamine from being broken down. Adding a stimulant or bupropion can drive blood pressure dangerously high.',
    })
  } else if (has(a, 'pressor') && has(b, 'pressor')) {
    out.push({ level: 'monitor', title: 'Heart rate and blood pressure', body: 'Both can raise heart rate and blood pressure, and the effects add up.' })
  }

  if (has(a, 'gaba-depressant') && has(b, 'gaba-depressant')) {
    out.push({
      level: 'caution',
      title: 'Breathing and sedation',
      body: 'Both depress the central nervous system. Together they add to sedation, unsteadiness and, at higher doses or with opioids or alcohol, suppression of breathing. US regulators have warned about benzodiazepines with opioids (2016) and gabapentinoids with other depressants (2019).',
    })
  } else if (has(a, 'sedating') && has(b, 'sedating')) {
    out.push({ level: 'monitor', title: 'Added sedation', body: 'Both are sedating. Drowsiness, slowed reactions and falls are more likely, especially in older people and with alcohol.' })
  }

  if (has(a, 'qt') && has(b, 'qt')) {
    out.push({
      level: 'caution',
      title: 'Heart rhythm (QT)',
      body: 'Both can lengthen the QT interval on the ECG. Combined, the risk of a dangerous rhythm rises, particularly with low potassium, heart disease or high doses. An ECG may be advised.',
    })
  }

  if (has(a, 'anticholinergic') && has(b, 'anticholinergic')) {
    out.push({
      level: 'monitor',
      title: 'Anticholinergic burden',
      body: 'Both block acetylcholine receptors. The burden adds up: constipation, urinary retention, dry mouth and, in older people, confusion and memory problems.',
    })
  }

  for (const [inh, sub] of [[a, b], [b, a]] as const) {
    if (!has(sub, 'cyp2d6-substrate')) continue
    const strong = has(inh, 'cyp2d6-strong')
    if (!strong && !has(inh, 'cyp2d6-moderate')) continue
    out.push({
      level: strong ? 'caution' : 'monitor',
      title: `${inh.name} raises ${sub.name} levels`,
      body:
        `${inh.name} ${strong ? 'strongly' : 'moderately'} inhibits CYP2D6, the liver enzyme that breaks down ${sub.name}, so its levels and side effects can rise.` +
        (sub.id === 'aripiprazole' && strong ? ' Aripiprazole’s prescribing information advises halving its dose with strong CYP2D6 inhibitors.' : '') +
        (sub.id === 'amitriptyline' ? ' Raised tricyclic levels can affect heart rhythm.' : ''),
    })
  }

  if (has(a, 'seizure') && has(b, 'seizure')) {
    out.push({ level: 'caution', title: 'Seizure threshold', body: 'Both lower the seizure threshold, and the effect adds up, particularly at higher doses.' })
  }

  if (either(a, b, (d) => has(d, 'valproate'), (d) => has(d, 'lamotrigine'))) {
    out.push({
      level: 'caution',
      title: 'Valproate doubles lamotrigine levels',
      body: 'Valproate blocks the main route that clears lamotrigine, roughly doubling its levels. Lamotrigine is started at a lower dose and increased more slowly to limit the risk of serious rash.',
    })
  }

  if (either(a, b, (d) => has(d, 'clonidine'), (d) => has(d, 'beta-blocker'))) {
    out.push({
      level: 'caution',
      title: 'Rebound blood pressure',
      body: 'If clonidine is stopped while a beta-blocker is being taken, rebound high blood pressure can be more severe. The beta-blocker is usually withdrawn first.',
    })
  }

  if (either(a, b, (d) => has(d, 'da-up'), (d) => has(d, 'da-block'))) {
    out.push({ level: 'note', title: 'Opposing actions on dopamine', body: 'One raises dopamine signalling and the other reduces it, so each may blunt the other’s effect.' })
  }

  if (a.cls === b.cls) {
    out.push({ level: 'note', title: 'Same class', body: `${names} work in the same way. Two drugs from one class are rarely combined except during a supervised switch.` })
  }

  return out
}

/** Targets both drugs act on. */
export const sharedTargets = (a: Drug, b: Drug) => a.targets.filter((x) => b.targets.some((y) => y.t === x.t)).map((x) => x.t)
