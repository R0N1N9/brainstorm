import type { Need } from '../scoring'

export type Grade = 'strong' | 'moderate' | 'promising' | 'practice' | 'lived'

export const GRADE_LABEL: Record<Grade, string> = {
  strong: 'Strong evidence',
  moderate: 'Moderate evidence',
  promising: 'Promising',
  practice: 'Clinical practice',
  lived: 'Lived experience',
}

export const GRADE_HELP: Record<Grade, string> = {
  strong: 'Supported by large meta-analyses of randomised trials.',
  moderate: 'Supported by several trials or a meta-analysis with limitations.',
  promising: 'One or a few trials; needs replication.',
  practice: 'Widely taught by clinicians; little direct trial evidence.',
  lived: 'Reported as helpful by people in withdrawal and the clinicians who support them. No trials yet.',
}

export interface Pacer {
  phases: { label: string; seconds: number }[]
}

export interface Practice {
  id: string
  name: string
  minutes: number
  grade: Grade
  helps: Need[]
  summary: string
  steps: string[]
  evidence: string
  caution?: string
  pacer?: Pacer
  /** How this practice suits a sensitised nervous system (withdrawal, medication injury). */
  sensitive: { fit: Fit; note: string }
}

export type Fit = 'gentle' | 'adapt' | 'caution'

export const FIT_LABEL: Record<Fit, string> = {
  gentle: 'Gentle',
  adapt: 'Adapt for a sensitive system',
  caution: 'Often too much right now',
}

export const NEED_LABEL: Record<Need, string> = {
  steady: 'Sensitive system',
  ground: 'Grounding',
  settle: 'Settling',
  lift: 'Lifting',
  sleep: 'Sleep',
  process: 'Processing',
}

export const PRACTICES: Practice[] = [
  {
    id: 'pacing',
    name: 'Pacing',
    minutes: 5,
    grade: 'lived',
    helps: ['steady'],
    summary: 'Plan the day to stay inside what your system can currently handle, so good days are not followed by crashes.',
    steps: [
      'Note what you managed on a recent ordinary day. That is your baseline.',
      'Plan today at about three quarters of it, and break it into short blocks with rest between.',
      'On a good day, resist doing more. Raise the baseline by a little each week instead.',
      'If symptoms flare a day later, step back to the last level that was fine.',
    ],
    evidence:
      'Pacing comes from rehabilitation for other conditions where exertion backfires. It has not been trialled in medication withdrawal; it is included because people in withdrawal consistently describe a boom-and-bust pattern.',
    sensitive: { fit: 'gentle', note: 'Designed for exactly this.' },
  },
  {
    id: 'low-stim',
    name: 'Low-stimulation rest',
    minutes: 15,
    grade: 'lived',
    helps: ['steady', 'ground'],
    summary: 'Give an over-reactive nervous system less to react to.',
    steps: [
      'Dim the lights or cover your eyes. Reduce noise, or use steady low sound.',
      'Lie or recline with your head supported. No screens.',
      'Let your attention rest on something neutral outside you: the weight of a blanket, a distant sound.',
      'This is rest, not a technique. There is nothing to achieve.',
    ],
    evidence:
      'Sensitivity to light and sound is a recognised withdrawal symptom, particularly with benzodiazepines. Reducing input is common advice from clinicians and peers; it has not been formally tested.',
    sensitive: { fit: 'gentle', note: 'Useful several times a day during a wave.' },
  },
  {
    id: 'wave-card',
    name: 'Riding a wave',
    minutes: 2,
    grade: 'lived',
    helps: ['steady', 'ground'],
    summary: 'A short script for when symptoms surge and it feels as if they will never end.',
    steps: [
      'Name it: “This is a wave. It is my nervous system readjusting.”',
      'Remember: “I have had waves before and they passed. This is not a new illness and not who I am.”',
      'Decide nothing. Big decisions wait for a window.',
      'Do the next small physical thing: a sip of water, feet on the floor, look around the room.',
    ],
    evidence:
      'Symptoms that come and go in waves, with clearer windows between, are widely described by people in withdrawal. Naming a state and delaying decisions are borrowed from acceptance-based therapies. Not tested for withdrawal.',
    sensitive: { fit: 'gentle', note: 'Keep it somewhere you can find it when thinking is hard.' },
  },
  {
    id: 'rhythm',
    name: 'Steady daily rhythm',
    minutes: 5,
    grade: 'moderate',
    helps: ['steady', 'sleep'],
    summary: 'Fixed anchors in the day give a destabilised body clock something to hold on to.',
    steps: [
      'Get up at the same time every day, however the night went.',
      'Get outdoor light within an hour of waking.',
      'Eat at regular times; long gaps can feel like anxiety.',
      'Keep evenings dim and predictable. If you cannot sleep, rest in the dark without clock-watching.',
    ],
    evidence:
      'A consistent rise time and morning light are core parts of cognitive behavioural therapy for insomnia, which has strong trial support in general. Whether they shorten withdrawal insomnia is unknown.',
    sensitive: { fit: 'gentle', note: 'Withdrawal insomnia often does not respond to effort. Aim for rhythm and rest, not for sleep itself.' },
  },
  {
    id: 'company',
    name: 'Safe company',
    minutes: 20,
    grade: 'moderate',
    helps: ['steady', 'settle', 'lift'],
    summary: 'Time near someone who believes you, with no need to talk about symptoms.',
    steps: [
      'Choose a person, or a peer group, who accepts that what you are going through is real.',
      'Keep it low-effort: sit together, watch something gentle, share a short walk.',
      'Tell them what helps and what does not. “Just sit with me” is enough.',
    ],
    evidence:
      'In a survey of several thousand people coming off antidepressants or antipsychotics, seeking social support was linked to better outcomes. Peer groups are where most people in withdrawal say they found practical help.',
    sensitive: { fit: 'gentle', note: 'Being believed matters. Many people report their symptoms were dismissed at first.' },
  },
  {
    id: 'cyclic-sigh',
    name: 'Cyclic sighing',
    minutes: 5,
    grade: 'promising',
    helps: ['settle', 'ground'],
    summary: 'A double inhale through the nose, then a long slow exhale through the mouth.',
    steps: [
      'Breathe in through your nose until your lungs feel comfortably full.',
      'Take a second, shorter sip of air on top.',
      'Let it all out slowly through your mouth, taking about twice as long as the inhale.',
      'Repeat for five minutes.',
    ],
    evidence:
      'In a month-long randomised trial (108 people), five minutes a day improved mood more than mindfulness meditation and lowered resting breathing rate. One trial, self-reported outcomes.',
    pacer: { phases: [{ label: 'Inhale', seconds: 2 }, { label: 'Sip in', seconds: 1 }, { label: 'Long exhale', seconds: 6 }] },
    sensitive: { fit: 'adapt', note: 'Breathwork can over-stimulate a sensitised system. Try three rounds instead of five minutes, and stop if you feel dizzy or more activated.' },
  },
  {
    id: 'slow-breath',
    name: 'Slow paced breathing',
    minutes: 10,
    grade: 'moderate',
    helps: ['settle', 'sleep'],
    summary: 'Around six breaths a minute — the pace used in heart-rate-variability biofeedback.',
    steps: [
      'Sit or lie comfortably. Breathe through your nose if you can.',
      'Inhale gently for five seconds, exhale for five. Keep it soft, not deep.',
      'If you feel light-headed, breathe less air, not more.',
    ],
    evidence:
      'A meta-analysis of 24 HRV-biofeedback studies found a large average reduction in stress and anxiety (g ≈ 0.8), though many studies were small.',
    pacer: { phases: [{ label: 'Inhale', seconds: 5 }, { label: 'Exhale', seconds: 5 }] },
    sensitive: { fit: 'adapt', note: 'Start with two minutes and no breath-holding. If focusing on breath raises anxiety, let it go and use orienting instead.' },
  },
  {
    id: 'grounding',
    name: '5-4-3-2-1 grounding',
    minutes: 3,
    grade: 'practice',
    helps: ['ground'],
    summary: 'Use your senses to come back to the room when your mind is somewhere else.',
    steps: [
      'Name five things you can see.',
      'Four things you can feel — feet on the floor, fabric, air.',
      'Three things you can hear.',
      'Two things you can smell.',
      'One thing you can taste. Say today’s date and where you are.',
    ],
    evidence: 'A standard stabilisation skill in trauma therapy. It has not been tested much on its own.',
    sensitive: { fit: 'gentle', note: 'Outward attention is usually well tolerated.' },
  },
  {
    id: 'orienting',
    name: 'Orienting',
    minutes: 3,
    grade: 'promising',
    helps: ['ground', 'settle'],
    summary: 'Slowly look around and let your eyes rest on whatever is neutral or pleasant.',
    steps: [
      'Let your head and eyes move slowly around the space, including behind you.',
      'Notice colours, light, distance. Let your gaze settle wherever it wants to.',
      'Notice any change in your breath or shoulders. No need to make anything happen.',
    ],
    evidence:
      'A core exercise in Somatic Experiencing. Reviews of that therapy find preliminary positive results for trauma symptoms and call for more randomised trials.',
    sensitive: { fit: 'gentle', note: 'Often the easiest practice in a wave: nothing to do, nothing to feel on purpose.' },
  },
  {
    id: 'cold-face',
    name: 'Cold water on the face',
    minutes: 1,
    grade: 'practice',
    helps: ['ground'],
    summary: 'A fast physiological brake for very high distress.',
    steps: [
      'Hold your breath and put a cold, wet cloth or cold pack over your eyes and cheeks for 15–30 seconds.',
      'Breathe out slowly afterwards.',
    ],
    evidence: 'Triggers the diving reflex, which slows the heart. Taught in dialectical behaviour therapy as a crisis skill.',
    caution: 'Skip this if you have a heart condition or an eating disorder unless your doctor has cleared it.',
    sensitive: { fit: 'caution', note: 'Strong heat and cold are commonly reported to set off symptoms. Leave this one until your system is steadier.' },
  },
  {
    id: 'pmr',
    name: 'Progressive muscle relaxation',
    minutes: 12,
    grade: 'moderate',
    helps: ['settle', 'sleep'],
    summary: 'Tense and release muscle groups from feet to face.',
    steps: [
      'Starting with your feet, tense one muscle group for about five seconds.',
      'Release and notice the difference for fifteen seconds.',
      'Work upward: calves, thighs, hands, arms, shoulders, face.',
    ],
    evidence: 'Decades of trials show reductions in anxiety and improvements in sleep; quality of studies varies.',
    caution: 'Tense gently around any injury.',
    sensitive: { fit: 'adapt', note: 'Skip the tensing and only release, or tense at a tenth of your strength. Hard tensing can trigger tremor or cramps.' },
  },
  {
    id: 'body-scan',
    name: 'Body scan',
    minutes: 10,
    grade: 'moderate',
    helps: ['settle', 'sleep'],
    summary: 'Move attention slowly through the body, noticing sensation without changing it.',
    steps: [
      'Lie or sit. Start at the toes and move attention upward, a region at a time.',
      'Name what you find — warm, tight, numb, nothing — and move on.',
      'When the mind wanders, return to where you left off.',
    ],
    evidence: 'A component of mindfulness programmes; mindfulness apps show small reliable effects on depression and anxiety (g ≈ 0.25).',
    caution:
      'Turning attention inward can intensify distress for some people with trauma histories. Keep your eyes open, stay with neutral areas such as hands or feet, and stop if it gets too much.',
    sensitive: { fit: 'caution', note: 'Turning attention inward tends to amplify withdrawal sensations. Prefer practices that face outward.' },
  },
  {
    id: 'walk',
    name: 'Brisk walk',
    minutes: 25,
    grade: 'strong',
    helps: ['lift', 'sleep'],
    summary: 'Walk fast enough that talking takes a little effort. Outdoors if possible.',
    steps: ['Put shoes on and go. Any length counts; twenty minutes or more is the usual trial dose.', 'Notice your feet landing and what you can see at a distance.'],
    evidence:
      'In a 2024 network meta-analysis of 218 trials, walking or jogging had a moderate effect on depression (g ≈ 0.6), in the range of psychotherapy. More intensity gave more benefit.',
    sensitive: { fit: 'adapt', note: 'Start with five to ten easy minutes on the flat. Symptoms can flare a day after overdoing it, so raise the dose slowly and judge it by tomorrow, not today.' },
  },
  {
    id: 'strength',
    name: 'Strength training',
    minutes: 30,
    grade: 'strong',
    helps: ['lift'],
    summary: 'Bodyweight or weights, two or three times a week.',
    steps: ['Pick four or five movements: squat, push, pull, hinge, carry.', 'Two or three sets each, stopping a couple of repetitions short of your limit.'],
    evidence: 'Among the most effective and best-tolerated forms of exercise for depression in the same 2024 analysis.',
    sensitive: { fit: 'caution', note: 'Intense effort is a common trigger for a wave. Wait for a steadier stretch and restart very lightly.' },
  },
  {
    id: 'yoga',
    name: 'Gentle yoga',
    minutes: 20,
    grade: 'moderate',
    helps: ['lift', 'settle'],
    summary: 'Slow movement linked to the breath, with every pose optional.',
    steps: [
      'Choose a beginner or trauma-sensitive sequence.',
      'Treat each instruction as an invitation. Skip or change anything that does not feel right.',
      'Notice what you feel in the muscles that are working.',
    ],
    evidence:
      'Moderate effect on depression across trials (g ≈ 0.55). In a trial of 131 women veterans with PTSD, trauma-sensitive yoga performed comparably to cognitive processing therapy, with fewer people dropping out.',
    sensitive: { fit: 'adapt', note: 'Restorative or floor-based only. Avoid heated rooms, strong breathwork and inversions.' },
  },
  {
    id: 'writing',
    name: 'Expressive writing',
    minutes: 15,
    grade: 'moderate',
    helps: ['process'],
    summary: 'Write freely about something that weighs on you, for your eyes only.',
    steps: [
      'Set a timer for fifteen minutes. Write about what happened and how you feel about it.',
      'Do not worry about spelling or sense. Keep it or destroy it.',
      'Repeat on three or four days. Finish with a grounding practice.',
    ],
    evidence:
      'A meta-analysis of 146 studies found a reliable but small benefit. Effects on post-traumatic stress were larger in people with a diagnosis.',
    caution:
      'It is normal to feel worse for an hour or two afterwards. Do not use this in a crisis, and work on the hardest memories with a therapist rather than alone.',
    sensitive: { fit: 'adapt', note: 'Emotions in withdrawal can be amplified by the withdrawal itself. Keep it to five minutes and stay with the present rather than the past.' },
  },
]
