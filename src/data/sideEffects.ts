// Side effects of psychiatric medications: where they start, where they are
// felt, how long they tend to last, and what is known about reversing them.
// Educational only: changes to treatment belong with a prescriber.

import type { StructureId } from './atlas'
import type { TargetId } from './pharm'
import type { Basis } from './recovery'

export type Reversal = 'fades' | 'reverses' | 'variable' | 'may-persist'

export const REVERSAL: Record<Reversal, { label: string; help: string }> = {
  fades: { label: 'Often fades on its own', help: 'Commonly eases within days to weeks as the body adapts, without changing treatment.' },
  reverses: { label: 'Reverses with a change', help: 'Usually goes away when the dose is lowered, the timing changed or the drug stopped.' },
  variable: { label: 'Usually reverses, not always', help: 'Most people recover after a change, but recovery can be slow or incomplete for some.' },
  'may-persist': { label: 'Can persist after stopping', help: 'May continue after the drug is stopped. Early recognition matters most.' },
}

export type System = 'mind' | 'movement' | 'gut' | 'heart' | 'hormones' | 'sexual' | 'sleep' | 'skin'

export const SYSTEMS: { id: System; name: string }[] = [
  { id: 'mind', name: 'Mood & thinking' },
  { id: 'sleep', name: 'Sleep & energy' },
  { id: 'movement', name: 'Movement' },
  { id: 'gut', name: 'Gut & weight' },
  { id: 'heart', name: 'Heart & circulation' },
  { id: 'hormones', name: 'Hormones, kidneys & blood' },
  { id: 'sexual', name: 'Sexual function' },
  { id: 'skin', name: 'Skin & sweating' },
]

export interface SideEffect {
  id: string
  name: string
  system: System
  how: string
  /** Where the mechanism acts. The first key is the source the signal flows from. */
  starts: Partial<Record<StructureId, string>>
  /** Where it shows up. */
  felt: Partial<Record<StructureId, string>>
  /** Receptors or transporters behind it; empty when the mechanism lies outside the targets modelled here. */
  targets: TargetId[]
  drugs: string[]
  course: string
  reversal: Reversal
  reverse: string
  helps: { text: string; basis: Basis }[]
  urgent?: string
  sources: string[]
}

const SSRI_SNRI = ['sertraline', 'fluoxetine', 'escitalopram', 'paroxetine', 'venlafaxine', 'duloxetine']

export const SIDE_EFFECTS: SideEffect[] = [
  // ───── Mood & thinking
  {
    id: 'blunting', name: 'Emotional blunting', system: 'mind',
    how: 'Raised serotonin dampens how strongly emotional and reward circuits respond, so highs and lows both feel muted. Dopamine blockade by antipsychotics can do something similar.',
    starts: { raphe: 'Sustained serotonin increase from blocked reuptake.', nacc: 'Reward signalling is damped.' },
    felt: { vmpfc: 'Feelings seem flattened or distant; harder to cry or laugh.', amygdala: 'Smaller emotional reactions, both negative and positive.' },
    targets: ['SERT', 'D2'],
    drugs: [...SSRI_SNRI, 'olanzapine', 'haloperidol', 'aripiprazole'],
    course: 'Builds over weeks of treatment. In one large survey nearly half of antidepressant users reported it.',
    reversal: 'reverses',
    reverse: 'Tends to be dose-related and usually lifts after a dose reduction or after stopping. It is worth separating from the flatness of depression itself.',
    helps: [
      { text: 'Naming it to the prescriber: a lower dose or a different antidepressant are the usual options.', basis: 'guideline' },
      { text: 'Bupropion and agomelatine are associated with less blunting in some studies.', basis: 'survey' },
    ],
    sources: ['Goodwin et al. 2017, J Affect Disord', 'Price et al. 2009, Br J Psychiatry'],
  },
  {
    id: 'cognition', name: 'Slowed thinking & memory problems', system: 'mind',
    how: 'Drugs that boost inhibition (GABA-A, α2δ) or block acetylcholine slow the circuits that form new memories and hold information in mind.',
    starts: { hippocampus: 'Encoding of new memories is weakened.', thalamus: 'Lower arousal reaching the cortex.' },
    felt: { dlpfc: 'Slower thinking, word-finding trouble, poor concentration.', hippocampus: 'Forgetting recent events or conversations.' },
    targets: ['GABAA', 'A2D', 'MUSC'],
    drugs: ['alprazolam', 'clonazepam', 'diazepam', 'zolpidem', 'pregabalin', 'gabapentin', 'amitriptyline', 'olanzapine', 'paroxetine', 'valproate'],
    course: 'Present while the drug is active; accumulates with long-term or combined use, and is most marked in older people.',
    reversal: 'variable',
    reverse: 'Improves after reducing or stopping. After long-term benzodiazepine use, a meta-analysis found thinking improved after withdrawal but had not fully returned to normal at follow-up, so recovery can take many months.',
    helps: [
      { text: 'A medication review for total “anticholinergic burden” and sedative load, especially over 65.', basis: 'guideline' },
      { text: 'Slow, supervised tapering rather than abrupt stopping.', basis: 'guideline' },
      { text: 'Lists, phone reminders and one-task-at-a-time routines while recovering.', basis: 'lived' },
    ],
    urgent: 'Sudden confusion, especially in an older person, needs same-day medical review.',
    sources: ['Crowe & Stranks 2018, Arch Clin Neuropsychol', 'Fox et al. 2011, J Am Geriatr Soc'],
  },
  {
    id: 'dependence', name: 'Tolerance & physical dependence', system: 'mind',
    how: 'With regular exposure, receptors adapt to the drug: GABA-A receptors turn down for benzodiazepines, serotonin receptors re-set for antidepressants. The same dose then does less, and removing it leaves the system out of balance.',
    starts: { amygdala: 'GABA-A receptors become less responsive.', raphe: 'Serotonin receptors and firing re-set around the drug.' },
    felt: { thalamus: 'Insomnia and sensory sensitivity when doses fall.', amygdala: 'Rebound anxiety between doses or on reduction.', motor: 'With benzodiazepines, abrupt stopping can cause seizures.' },
    targets: ['GABAA', 'A2D', 'SERT'],
    drugs: ['alprazolam', 'clonazepam', 'diazepam', 'zolpidem', 'pregabalin', 'gabapentin', ...SSRI_SNRI],
    course: 'Can develop within weeks of daily use of a benzodiazepine or Z-drug; antidepressant dependence develops over months.',
    reversal: 'variable',
    reverse: 'Receptors re-adapt after the drug is gone. Slow, proportional tapering gives them time; most people recover over weeks to months, a minority over longer.',
    helps: [
      { text: 'Gradual tapering planned with a prescriber, slowing or pausing when symptoms are severe.', basis: 'guideline' },
      { text: 'For benzodiazepines, switching to a long-acting one (often diazepam) to taper smoothly.', basis: 'guideline' },
      { text: 'Gentle practices and pacing during the taper — see Recovery.', basis: 'lived' },
    ],
    urgent: 'Never stop a benzodiazepine, Z-drug or gabapentinoid abruptly after regular use.',
    sources: ['Horowitz & Taylor 2019, Lancet Psychiatry', 'FDA 2020 boxed warning', 'Ashton 2002'],
  },
  // ───── Sleep & energy
  {
    id: 'sedation', name: 'Drowsiness & next-day grogginess', system: 'sleep',
    how: 'Histamine from the hypothalamus is a core wakefulness signal. Blocking H1 receptors, or boosting GABA, turns arousal down across the brain.',
    starts: { hypothalamus: 'Histamine wake signal is blocked (H1).' },
    felt: { thalamus: 'Less arousal reaching the cortex: sleepiness, slowed reactions.', dlpfc: 'Fogginess the next morning.' },
    targets: ['H1', 'GABAA', 'A2D', 'A1'],
    drugs: ['mirtazapine', 'trazodone', 'quetiapine', 'olanzapine', 'amitriptyline', 'alprazolam', 'clonazepam', 'diazepam', 'zolpidem', 'pregabalin', 'gabapentin', 'clonidine', 'paroxetine'],
    course: 'Strongest in the first days; sedation from H1 blockade often eases within one to two weeks.',
    reversal: 'fades',
    reverse: 'Often fades with tolerance. If it does not, taking the dose earlier in the evening or lowering it usually helps.',
    helps: [
      { text: 'Taking sedating medicines in the evening, if the prescriber agrees.', basis: 'guideline' },
      { text: 'Avoiding alcohol and other sedatives, and not driving until you know how it affects you.', basis: 'guideline' },
      { text: 'Morning light and a fixed wake time to anchor alertness.', basis: 'lived' },
    ],
    sources: ['Stahl’s Essential Psychopharmacology, 5th ed.'],
  },
  {
    id: 'insomnia', name: 'Insomnia & feeling wired', system: 'sleep',
    how: 'Drugs that raise noradrenaline or dopamine, and some SSRIs early on, increase arousal signalling from the brainstem. SSRIs also suppress REM sleep.',
    starts: { lc: 'Noradrenaline neurons drive alertness.', raphe: 'Serotonin changes sleep architecture, suppressing REM.' },
    felt: { thalamus: 'Trouble falling or staying asleep; vivid dreams.', amygdala: 'Restless, jittery or anxious feeling.' },
    targets: ['NET', 'DAT', 'SERT'],
    drugs: ['fluoxetine', 'sertraline', 'venlafaxine', 'duloxetine', 'bupropion', 'methylphenidate', 'amphetamine', 'aripiprazole'],
    course: 'Often worst in the first two weeks of an antidepressant; persists with stimulants if dosed late in the day.',
    reversal: 'fades',
    reverse: 'Often settles as the body adapts. Morning dosing usually helps; otherwise a dose change.',
    helps: [
      { text: 'Taking activating medicines in the morning, if the prescriber agrees.', basis: 'guideline' },
      { text: 'Core CBT-for-insomnia habits: fixed rise time, bed only for sleep, no clock-watching.', basis: 'trial' },
      { text: 'Cutting caffeine, which adds to the same arousal system.', basis: 'lived' },
    ],
    sources: ['Wichniak et al. 2017, Curr Psychiatry Rep', 'Trauer et al. 2015, Ann Intern Med'],
  },
  // ───── Movement
  {
    id: 'akathisia', name: 'Akathisia (inner restlessness)', system: 'movement',
    how: 'Blocking or disrupting dopamine signalling in the movement circuits, possibly with noradrenaline over-activity, produces a tormenting urge to keep moving.',
    starts: { dstr: 'Dopamine signalling in the movement circuit is disrupted.', lc: 'Noradrenaline over-activity is suspected.' },
    felt: { muscle: 'Cannot sit or stand still: pacing, rocking, shifting legs.', amygdala: 'Intense inner distress, often mistaken for anxiety.' },
    targets: ['D2', 'SERT'],
    drugs: ['aripiprazole', 'haloperidol', 'olanzapine', 'quetiapine', 'fluoxetine', 'sertraline', 'escitalopram', 'paroxetine', 'venlafaxine'],
    course: 'Usually within days to weeks of starting or raising a dose; it can also appear on reducing or stopping.',
    reversal: 'reverses',
    reverse: 'Usually resolves when the causing drug is reduced or stopped, though this must be done carefully. Clinicians may also add a treatment while that happens.',
    helps: [
      { text: 'Urgent contact with the prescriber, naming “akathisia”.', basis: 'guideline' },
      { text: 'Treatments clinicians use include propranolol, low-dose mirtazapine and short-term benzodiazepines; each has trial support.', basis: 'trial' },
    ],
    urgent: 'Akathisia is linked to suicidal thoughts and impulsive acts. Seek help the same day.',
    sources: ['Pringsheim et al. 2018, Can J Psychiatry', 'Poyurovsky 2010, Br J Psychiatry'],
  },
  {
    id: 'parkinsonism', name: 'Stiffness, tremor & slowness', system: 'movement',
    how: 'Blocking D2 receptors in the striatum removes the dopamine that keeps movement fluid, mimicking Parkinson’s disease.',
    starts: { dstr: 'D2 blockade in the nigrostriatal pathway.' },
    felt: { muscle: 'Stiff limbs, shuffling, tremor at rest, a mask-like face.', motor: 'Movements are slower to start.' },
    targets: ['D2'],
    drugs: ['haloperidol', 'olanzapine', 'aripiprazole'],
    course: 'Usually within weeks of starting or increasing an antipsychotic; more likely with strong D2 blockers and in older people.',
    reversal: 'variable',
    reverse: 'Usually reverses after the dose is lowered or the drug switched, but can take weeks to months to clear fully.',
    helps: [
      { text: 'Dose reduction or switching to an antipsychotic with lower movement risk.', basis: 'guideline' },
      { text: 'Clinicians sometimes use anticholinergic drugs short term; these add their own side effects.', basis: 'guideline' },
    ],
    urgent: 'Sudden muscle spasm of the neck, jaw or eyes (acute dystonia), or rigidity with fever and confusion, needs emergency care.',
    sources: ['Shin & Chung 2012, J Clin Neurol', 'Huhn et al. 2019, Lancet'],
  },
  {
    id: 'tardive', name: 'Tardive dyskinesia', system: 'movement',
    how: 'Long-term D2 blockade is thought to make striatal dopamine receptors over-sensitive, producing involuntary movements.',
    starts: { dstr: 'Dopamine receptors become super-sensitive after long blockade (leading hypothesis).' },
    felt: { muscle: 'Involuntary movements of the mouth, tongue, face, fingers or trunk.' },
    targets: ['D2'],
    drugs: ['haloperidol', 'olanzapine', 'aripiprazole', 'quetiapine'],
    course: 'Develops after months to years. Risk is higher with older, strong D2 blockers and with age.',
    reversal: 'may-persist',
    reverse: 'Can persist after the drug is stopped, though some people improve over months to years. Catching it early gives the best chance of improvement.',
    helps: [
      { text: 'Regular screening for abnormal movements during long-term antipsychotic treatment.', basis: 'guideline' },
      { text: 'VMAT2 inhibitors (valbenazine, deutetrabenazine) reduce symptoms in trials and are approved for this use in the US.', basis: 'trial' },
    ],
    sources: ['Carbon et al. 2017, J Clin Psychiatry', 'Bhidayasiri et al. 2018, J Neurol Sci'],
  },
  // ───── Gut & weight
  {
    id: 'nausea', name: 'Nausea & gut upset', system: 'gut',
    how: 'Most of the body’s serotonin is in the gut. Blocking its reuptake floods 5-HT3 receptors in the gut wall and in the brainstem’s vomiting centre.',
    starts: { gut: 'Serotonin rises in the gut wall.' },
    felt: { medulla: 'The area postrema triggers nausea.', vagus: 'Gut signals reach the brainstem through the vagus.' },
    targets: ['SERT', 'HT3'],
    drugs: SSRI_SNRI,
    course: 'Common in the first one to two weeks and after dose increases.',
    reversal: 'fades',
    reverse: 'Usually fades as 5-HT3 receptors adapt. Slower dose increases make it milder.',
    helps: [
      { text: 'Taking the dose with food.', basis: 'guideline' },
      { text: 'Starting low and increasing slowly.', basis: 'guideline' },
      { text: 'Ginger, small frequent meals and sips of fluid.', basis: 'lived' },
    ],
    sources: ['Kelly et al. 2008, Ther Clin Risk Manag'],
  },
  {
    id: 'weight', name: 'Weight gain & metabolic changes', system: 'gut',
    how: 'Blocking H1 and 5-HT2C receptors in the hypothalamus switches off satiety signals. Some antipsychotics also make the body less sensitive to insulin directly.',
    starts: { hypothalamus: 'Appetite brakes (H1, 5-HT2C) are blocked.' },
    felt: { gut: 'Stronger hunger and cravings, especially for carbohydrates.', liver: 'Blood sugar and cholesterol can rise.' },
    targets: ['H1', 'HT2C'],
    drugs: ['olanzapine', 'quetiapine', 'mirtazapine', 'amitriptyline', 'paroxetine', 'valproate', 'lithium', 'pregabalin', 'gabapentin'],
    course: 'Most of the gain often happens in the first months. Olanzapine carries one of the highest risks.',
    reversal: 'variable',
    reverse: 'Appetite usually normalises after a switch or stopping; the weight itself comes off more slowly and not always completely. Acting early works better than acting late.',
    helps: [
      { text: 'Weight, waist, blood sugar and lipids checked at the start and regularly.', basis: 'guideline' },
      { text: 'Metformin reduces antipsychotic-related weight gain in meta-analyses.', basis: 'trial' },
      { text: 'Switching to a lower-risk medicine where possible.', basis: 'guideline' },
      { text: 'Structured diet and activity programmes help modestly.', basis: 'trial' },
    ],
    sources: ['Pillinger et al. 2020, Lancet Psychiatry', 'de Silva et al. 2016, BMC Psychiatry'],
  },
  {
    id: 'anticholinergic', name: 'Dry mouth, constipation & blurred vision', system: 'gut',
    how: 'Blocking muscarinic acetylcholine receptors switches off the “rest and digest” signal in glands and smooth muscle across the body.',
    starts: { vagus: 'Parasympathetic signals are blocked at their receptors.' },
    felt: { gut: 'Constipation, sometimes severe.', skin: 'Dry mouth and eyes; less sweating.', pelvic: 'Difficulty passing urine.', heart: 'Faster pulse.' },
    targets: ['MUSC'],
    drugs: ['amitriptyline', 'olanzapine', 'quetiapine', 'paroxetine'],
    course: 'Starts with the first doses and continues while taking the drug; burden adds up across medicines.',
    reversal: 'reverses',
    reverse: 'Reverses within days of lowering the dose or stopping.',
    helps: [
      { text: 'Fluids, fibre and movement for constipation; tell a doctor early if it persists.', basis: 'guideline' },
      { text: 'Sugar-free gum or lozenges for dry mouth, and regular dental care.', basis: 'guideline' },
    ],
    urgent: 'Severe constipation with abdominal pain or vomiting, or being unable to pass urine, needs urgent care.',
    sources: ['Fox et al. 2011, J Am Geriatr Soc', 'Every-Palmer et al. 2016, CNS Drugs'],
  },
  {
    id: 'bleeding', name: 'Easy bruising & bleeding', system: 'hormones',
    how: 'Platelets need serotonin to clump together, and they take it up through the same transporter SSRIs block. With less serotonin inside them, they clot less well.',
    starts: { gut: 'Most blood serotonin comes from the gut and is carried by platelets.' },
    felt: { gut: 'Higher risk of stomach and gut bleeding, especially with NSAID painkillers or blood thinners.', skin: 'Bruising more easily.' },
    targets: ['SERT'],
    drugs: SSRI_SNRI,
    course: 'Develops over the first weeks as platelets turn over.',
    reversal: 'reverses',
    reverse: 'Platelets are replaced every week or two, so the effect wears off within weeks of stopping.',
    helps: [
      { text: 'Telling prescribers and dentists about SSRI use before procedures.', basis: 'guideline' },
      { text: 'Avoiding regular NSAID painkillers, or adding stomach protection, when advised.', basis: 'guideline' },
    ],
    urgent: 'Black stools or vomiting blood needs emergency care.',
    sources: ['Laporte et al. 2017, Pharmacol Res', 'Jiang et al. 2015, Clin Gastroenterol Hepatol'],
  },
  // ───── Heart
  {
    id: 'orthostatic', name: 'Dizziness on standing', system: 'heart',
    how: 'Blocking α1 receptors relaxes blood-vessel walls, so blood pools in the legs when you stand and the brain is briefly short of it.',
    starts: { symp: 'Sympathetic signal to blood vessels is blocked (α1).' },
    felt: { heart: 'Pulse races to compensate.', vestibular: 'Light-headedness, swaying, sometimes fainting.' },
    targets: ['A1'],
    drugs: ['amitriptyline', 'quetiapine', 'trazodone', 'olanzapine', 'phenelzine', 'clonidine'],
    course: 'Worst in the first days and after dose increases.',
    reversal: 'fades',
    reverse: 'The body often adapts within weeks; slower dose increases help. A lower dose usually resolves it.',
    helps: [
      { text: 'Getting up in stages: sit, pause, then stand.', basis: 'guideline' },
      { text: 'Enough fluids; extra care in heat and after alcohol.', basis: 'guideline' },
    ],
    urgent: 'Fainting or falls need a medical review, especially in older people.',
    sources: ['Gugger 2011, CNS Drugs'],
  },
  {
    id: 'qt', name: 'Heart-rhythm changes (QT)', system: 'heart',
    how: 'Some drugs slow the heart’s electrical recovery between beats, seen as a longer QT interval on an ECG. Very long QT can trigger a dangerous rhythm.',
    starts: { heart: 'Potassium channels that reset each heartbeat are partly blocked.' },
    felt: { heart: 'Usually no symptoms; rarely palpitations or fainting.' },
    targets: [],
    drugs: ['escitalopram', 'haloperidol', 'quetiapine', 'amitriptyline', 'trazodone'],
    course: 'Dose-related; higher with combinations, low potassium or magnesium, and heart disease.',
    reversal: 'reverses',
    reverse: 'Reverses when the dose is lowered or the drug changed.',
    helps: [
      { text: 'An ECG before and during treatment when risk factors are present.', basis: 'guideline' },
      { text: 'Avoiding combinations of QT-prolonging drugs where possible.', basis: 'guideline' },
    ],
    urgent: 'Fainting, or palpitations with dizziness, needs emergency care.',
    sources: ['Beach et al. 2018, Psychosomatics', 'FDA 2011 citalopram communication'],
  },
  {
    id: 'stimulant-cv', name: 'Racing heart & appetite loss', system: 'heart',
    how: 'Raising noradrenaline and dopamine increases sympathetic drive to the heart and suppresses hunger signals.',
    starts: { lc: 'Noradrenaline release rises.', symp: 'Sympathetic outflow to the organs increases.' },
    felt: { heart: 'Faster pulse and higher blood pressure.', hypothalamus: 'Appetite is suppressed.' },
    targets: ['NET', 'DAT'],
    drugs: ['methylphenidate', 'amphetamine', 'bupropion', 'venlafaxine'],
    course: 'While the drug is active each day; appetite loss is often strongest at first.',
    reversal: 'reverses',
    reverse: 'Wears off as each dose does, and resolves on stopping. Dose timing and size are the main levers.',
    helps: [
      { text: 'Pulse, blood pressure and weight checked regularly.', basis: 'guideline' },
      { text: 'A substantial breakfast before the dose and an evening meal as it wears off.', basis: 'guideline' },
    ],
    urgent: 'Chest pain, fainting or a very fast pulse needs emergency care.',
    sources: ['Cortese et al. 2018, Lancet Psychiatry'],
  },
  // ───── Hormones, kidneys & blood
  {
    id: 'prolactin', name: 'Raised prolactin', system: 'hormones',
    how: 'Dopamine from the hypothalamus normally holds back prolactin release from the pituitary. Blocking D2 receptors there removes the brake.',
    starts: { pituitary: 'D2 blockade releases prolactin.' },
    felt: { pelvic: 'Lower libido, erectile problems, irregular or absent periods.', skin: 'Breast swelling or milk production.' },
    targets: ['D2'],
    drugs: ['haloperidol', 'olanzapine'],
    course: 'Rises within days; long-term high prolactin can reduce bone density.',
    reversal: 'reverses',
    reverse: 'Falls within days to weeks of switching to a prolactin-sparing drug or lowering the dose.',
    helps: [
      { text: 'A blood test for prolactin if symptoms appear.', basis: 'guideline' },
      { text: 'Switching drug, or adding low-dose aripiprazole, which lowers prolactin in trials.', basis: 'trial' },
    ],
    sources: ['Peuskens et al. 2014, CNS Drugs', 'Meng et al. 2015, PLoS One'],
  },
  {
    id: 'hyponatraemia', name: 'Low sodium', system: 'hormones',
    how: 'Serotonergic drugs can make the hypothalamus and pituitary release too much antidiuretic hormone, so the kidneys hold on to water and dilute the blood’s sodium.',
    starts: { hypothalamus: 'Excess antidiuretic hormone signal.', pituitary: 'Antidiuretic hormone is released.' },
    felt: { kidney: 'Water is retained.', dlpfc: 'Headache, confusion, tiredness; falls in older people.' },
    targets: ['SERT'],
    drugs: [...SSRI_SNRI, 'mirtazapine'],
    course: 'Usually within the first weeks. Most common over 65, with diuretics, or at low body weight.',
    reversal: 'reverses',
    reverse: 'Corrects over days once the drug is stopped and fluids are managed under medical supervision.',
    helps: [{ text: 'A sodium blood test early in treatment for people at higher risk.', basis: 'guideline' }],
    urgent: 'Confusion, drowsiness or a seizure needs emergency care.',
    sources: ['De Picker et al. 2014, Psychosomatics'],
  },
  {
    id: 'lithium-organs', name: 'Thyroid & kidney changes', system: 'hormones',
    how: 'Lithium reduces thyroid hormone release and, over years, interferes with how the kidneys concentrate urine.',
    starts: { thyroid: 'Hormone release falls.', kidney: 'Response to antidiuretic hormone is reduced.' },
    felt: { kidney: 'Thirst and passing large amounts of urine.', hypothalamus: 'Low thyroid can bring tiredness, weight gain and low mood.' },
    targets: ['LI'],
    drugs: ['lithium'],
    course: 'Thyroid changes can appear in the first years; kidney effects build over many years.',
    reversal: 'may-persist',
    reverse: 'An underactive thyroid is easily treated with thyroid hormone. Concentrating problems may persist after stopping, and long-term kidney decline is not always reversible, which is why blood tests are regular.',
    helps: [
      { text: 'Lithium level, thyroid and kidney blood tests on a regular schedule.', basis: 'guideline' },
      { text: 'Staying hydrated, and checking with a pharmacist before NSAIDs or new blood-pressure drugs.', basis: 'guideline' },
    ],
    urgent: 'Vomiting, diarrhoea, coarse tremor, unsteadiness or confusion can mean lithium toxicity: seek urgent care.',
    sources: ['McKnight et al. 2012, Lancet', 'NICE CG185'],
  },
  // ───── Sexual
  {
    id: 'sexual', name: 'Sexual side effects', system: 'sexual',
    how: 'Raised serotonin acts on 5-HT2 receptors that dampen dopamine and noradrenaline signals involved in desire and arousal, and on spinal reflexes that trigger orgasm.',
    starts: { raphe: 'Sustained serotonin increase.', spinal: 'Serotonin inhibits spinal orgasm reflexes.' },
    felt: { pelvic: 'Delayed or absent orgasm, genital numbness, erectile difficulties.', nacc: 'Lower desire.' },
    targets: ['SERT'],
    drugs: [...SSRI_SNRI, 'amitriptyline', 'phenelzine'],
    course: 'Common and often under-reported; usually continues while taking the drug.',
    reversal: 'variable',
    reverse: 'Usually reverses after stopping or switching. In some people it persists after stopping (post-SSRI sexual dysfunction), now recognised by European regulators.',
    helps: [
      { text: 'Raising it with the prescriber: dose reduction or switching to bupropion or mirtazapine, which cause it less often.', basis: 'trial' },
      { text: 'Adding bupropion has some trial support.', basis: 'trial' },
    ],
    sources: ['Montejo et al. 2015, J Sex Marital Ther', 'EMA PRAC 2019', 'Healy et al. 2022'],
  },
  // ───── Skin
  {
    id: 'sweating', name: 'Heavy sweating', system: 'skin',
    how: 'Serotonin and noradrenaline shift the hypothalamus’s temperature set-point and increase sympathetic drive to sweat glands.',
    starts: { hypothalamus: 'Temperature regulation is reset.', symp: 'Sympathetic drive to sweat glands rises.' },
    felt: { skin: 'Night sweats or sweating in normal temperatures.' },
    targets: ['SERT', 'NET'],
    drugs: ['venlafaxine', 'duloxetine', 'sertraline', 'escitalopram', 'paroxetine', 'fluoxetine', 'amitriptyline'],
    course: 'Often persists for as long as the drug is taken.',
    reversal: 'reverses',
    reverse: 'Dose-related, and stops after the drug is stopped or switched.',
    helps: [
      { text: 'A lower dose or a different antidepressant.', basis: 'guideline' },
      { text: 'Breathable bedding and clothing, cool rooms.', basis: 'lived' },
    ],
    sources: ['Marcy & Britton 2005, Ann Pharmacother'],
  },
  {
    id: 'rash', name: 'Serious skin rash', system: 'skin',
    how: 'An immune reaction to the drug, made more likely by starting at a high dose or raising it quickly.',
    starts: { liver: 'Drug levels rise faster than the immune system tolerates, especially with valproate.' },
    felt: { skin: 'Rash, blistering, mouth ulcers, fever.' },
    targets: [],
    drugs: ['lamotrigine'],
    course: 'Usually in the first two to eight weeks of lamotrigine.',
    reversal: 'variable',
    reverse: 'Stopping the drug promptly is essential. Most rashes are mild, but the rare severe form can leave lasting damage.',
    helps: [{ text: 'Following the slow starting schedule exactly, and halving it when valproate is also taken.', basis: 'guideline' }],
    urgent: 'Any rash with fever, blisters or mouth sores on lamotrigine: stop and seek emergency care.',
    sources: ['Lamictal prescribing information', 'Wang et al. 2015, Seizure'],
  },
]

export const effectById = (id: string) => SIDE_EFFECTS.find((e) => e.id === id)
export const effectsForDrug = (drugId: string) => SIDE_EFFECTS.filter((e) => e.drugs.includes(drugId))
