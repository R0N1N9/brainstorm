# Research brief

What the evidence says about each thing Braindance wants to do, and what that means for the design.
Searches were run in November 2026. Items marked *(unverified)* come from background knowledge and were
not confirmed against a primary source in this pass.

## 1. Can software improve mental wellbeing at all?

Yes, modestly. The largest meta-analysis to date (Linardon et al. 2024, 176 randomised trials) found small
effects of mental health apps on depression (g = 0.28) and generalised anxiety (g = 0.26) against control
conditions. Against active comparison treatments the effect was not significant, and inactive controls
inflated results, which points to a "digital placebo" contribution. Apps that used CBT techniques did better.
Mindfulness apps specifically show the same size of effect (g ≈ 0.24–0.28 across 45 trials).

**Design consequence.** Promise small, real gains. The value of the product is in sustained use of practices
that have their own evidence, plus the motivating effect of seeing one's own data. It is an adjunct to care,
not a replacement.

## 2. Measuring the state of a mind

Self-report questionnaires with published cut-offs are the only defensible way to produce a "profile" without
hardware. The v0 set:

| Domain | Instrument | Items | Licence |
|---|---|---|---|
| Wellbeing | WHO-5 | 5 | © WHO 2024, CC BY-NC-SA 3.0 IGO. Free for non-commercial use with citation; no WHO logo or implied endorsement; adaptations share-alike. **Commercial use needs clearance from WHO.** |
| Low mood | PHQ-9 | 9 | No permission required to reproduce, translate, display or distribute (per secondary sources; confirm at phqscreeners.com). |
| Anxiety | GAD-7 | 7 | Same as PHQ-9. |

Candidates for later, each needing a licence check before shipping:

- **PCL-5** (PTSD symptoms): distributed free by the US National Center for PTSD *(unverified)*.
- **ISI** (insomnia), **PSS-10** (perceived stress), **AUDIT** (alcohol), **MAIA-2** (interoceptive awareness),
  **DERS** (emotion regulation): all widely used; terms vary *(unverified)*.

Rules that follow from how these tools are validated:

- Item wording, order and response options must be reproduced exactly, or the cut-offs no longer apply.
- A score is a screening result. The UI says "in a range where clinicians take a closer look", never "you have".
- PHQ-9 item 9 (thoughts of death or self-harm) must trigger crisis resources on any non-zero answer.
- Report change only when it exceeds measurement noise. A PHQ-9 shift of about 5 points is the usual
  threshold for a meaningful change *(unverified; Löwe et al. 2004)*.

### The ACE score is not an individual measure

The authors of the original ACE study (Anda, Porter & Brown 2020) state that the ACE score is "neither a
diagnostic tool nor is it predictive at the individual level". It has no clinical cut points, ignores severity,
frequency, duration and timing, and routine screening can retraumatise people who are not ready to disclose.

**Design consequence.** Braindance does not compute an ACE score. The timeline lets a person record what they
choose, in a few words, with no total and no risk label.

## 3. Mapping experience to brain regions

This is the part of the idea that needs the most care.

**What is true.** Group-level imaging research finds associations between experiences and brain structure or
function:

- *Early adversity.* Meta-analyses converge on the hippocampus (modestly smaller volume on average).
  Amygdala and prefrontal findings depend on age and type of adversity. In general-population samples the
  hippocampal effect is modest and weakens after adjusting for sex (Calem et al. 2017; Pollok et al. 2022).
- *Sleep loss.* Amygdala reactivity rises and prefrontal control weakens after a night without sleep
  (Yoo et al. 2007) *(unverified in this pass)*.
- *Chronic stress, alcohol, cannabis, exercise.* See `src/data/brain.ts`; these entries come from standard
  review literature and **have not been individually re-verified**. They need a pass by someone with
  neuroscience training before public release.

**What is not possible.** None of this can be inverted. Knowing that someone had a hard childhood, or drank
heavily, tells you nothing reliable about their particular brain. Effects are small averages across groups with
large overlap, causality is often unclear, and much of it is reversible. A feature that says "your amygdala is
affected" would be false, and for someone already distressed it could be harmful.

**Design consequence.** The brain map is an atlas of research, explicitly labelled "not a scan of you". The
user's data only decides which lenses are *marked as relevant to explore*. Every claim carries an evidence
grade (consistent / mixed / early) and a source. Supportive lenses (exercise, breathing) sit alongside the
strain lenses so the map also shows what helps.

A genuinely personal physiological layer is possible later through wearables: heart-rate variability, resting
heart rate and sleep staging are measurable, change with practice, and can be read from Apple Health or
Health Connect.

## 4. Somatic practices

| Practice | Evidence | Grade used in app |
|---|---|---|
| Aerobic exercise, strength training | Network meta-analysis of 218 trials (Noetel et al. 2024, BMJ): walking/jogging g ≈ 0.62, yoga g ≈ 0.55 for depression; strength training among the most effective and best tolerated. | Strong |
| Slow paced breathing (~6/min) | HRV-biofeedback meta-analysis, 24 studies: g = 0.83 for stress and anxiety, many small studies (Goessl et al. 2017). | Moderate |
| Yoga, incl. trauma-sensitive | As above for depression. One RCT in 131 women veterans found trauma-sensitive yoga comparable to cognitive processing therapy for PTSD with lower dropout (Kelly et al. 2023). | Moderate |
| Progressive muscle relaxation, body scan | Long trial history for anxiety and sleep; mindfulness-app meta-analysis for the body scan's parent programme *(PMR unverified)*. | Moderate |
| Expressive writing | 146-study meta-analysis: reliable but small (r = 0.075; Frattaroli 2006). Larger for diagnosed PTSD. | Moderate (small effect) |
| Cyclic sighing | One RCT, n = 108, five minutes daily for a month beat mindfulness on mood (Balban et al. 2023). | Promising |
| Somatic Experiencing (orienting, pendulation) | Scoping review of 16 studies: preliminary positive results, mixed quality, more RCTs needed (Kuhfuß et al. 2021). | Promising |
| 5-4-3-2-1 grounding, cold-water face immersion | Standard clinical skills; little direct trial evidence. | Clinical practice |

Not included because the evidence does not support specific claims: polyvagal "vagus nerve resets",
tapping/EFT, trauma-release shaking, "storing trauma in the hips".

## 5. Working with the past

- First-line treatments for PTSD are therapist-delivered trauma-focused therapies (CPT, prolonged exposure,
  EMDR) *(unverified in this pass)*. Written Exposure Therapy achieves comparable results in five sessions
  (Sloan et al. 2018), but the writing is done in session, partly as a safety measure.
- Whether a stabilisation phase must precede trauma processing is contested: reviews find it is helpful but not
  strictly necessary. That debate is about supervised therapy. For an unsupervised app, stabilisation skills
  first is the conservative choice.
- Self-directed expressive writing has a small average benefit and commonly raises distress for a few hours.

**Design consequence.** Braindance does not attempt self-guided trauma processing. It offers
(1) a low-detail timeline for perspective, (2) stabilisation skills always one tap away,
(3) time-boxed expressive writing with cautions, and (4) clear signposting to therapy for the heavy work.

## 6. Privacy and regulation

- In 2023 the FTC ordered BetterHelp to pay $7.8M and banned it from sharing health data for advertising,
  after it passed emails, IP addresses and intake answers to ad platforms. Mental health data is treated as
  highly sensitive, and mishandling it is both a legal and a trust failure.
- In the US, software that makes only general-wellness claims and carries low risk generally falls outside FDA
  device regulation; claims to diagnose or treat a condition bring it inside *(unverified; check current FDA
  General Wellness guidance and get legal advice before launch)*. The EU MDR and UK rules differ.

**Design consequence.** Local-first by default: no account, no server, no analytics. Wellness wording only.
Any future sync must be end-to-end encrypted and opt-in.

## Sources

- [Linardon et al. 2024, mental health apps meta-analysis](https://pubmed.ncbi.nlm.nih.gov/38056219/) · [summary](https://www.nationalelfservice.net/mental-health/depression/apps-for-depression-and-anxiety-big-new-meta-analysis-supports-effectiveness/)
- [Mindfulness apps meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC10785982)
- [WHO-5, WHO 2024 edition](https://cdn.who.int/media/docs/default-source/mental-health/who-5_english-original4da539d6ed4b49389e3afe47cda2326a.pdf)
- [PHQ/GAD-7 licence note](https://cdn.jsdelivr.net/npm/psytools@0.6.3/SOURCES.md)
- [Anda, Porter & Brown 2020, limits of the ACE score](https://pacesconnection.com/blog/inside-the-adverse-childhood-experience-score-strengths-limitations-and-misapplications-ajpmonline-org) · [NCTSN key points](https://www.nctsn.org/sites/default/files/resources/fact-sheet/beyond-the-ace-score-perspectives-from-the-nctsn-on-child-trauma-and-adversity-screening-and-impact-key-points.pdf)
- [Pollok et al. 2022, early adversity and grey matter](https://pubmed.ncbi.nlm.nih.gov/35189164/)
- [Calem et al. 2017, childhood adversity and hippocampus/amygdala](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5331153/)
- [Noetel et al. 2024, exercise for depression](https://pmc.ncbi.nlm.nih.gov/articles/PMC10870815/)
- [Balban et al. 2023, cyclic sighing](https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947)
- [Goessl et al. 2017, HRV biofeedback](https://www.cambridge.org/core/journals/psychological-medicine/article/effect-of-heart-rate-variability-biofeedback-training-on-stress-and-anxiety-a-metaanalysis/A839E9C968E54774DF5C8FB186764EF0)
- [Kuhfuß et al. 2021, Somatic Experiencing scoping review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8276649)
- [Kelly et al. 2023, trauma-sensitive yoga vs CPT](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2812725)
- [Bisson et al. 2020, non-psychological approaches to PTSD](https://orca.cardiff.ac.uk/135697/1/untitled.pdf)
- [Frattaroli 2006, experimental disclosure](https://Www.Gwern.net/doc/psychology/2006-frattaroli.pdf) · [Pavlacic et al. 2019](https://journals.sagepub.com/doi/10.1177/1089268019831645)
- [Written Exposure Therapy overview, Sloan & Marx](https://istss.org/clinicians-corner-written-exposure-therapy-wet-denise-m-sloan-and-brian-p-marx)
- [Is phase-based treatment needed for PTSD?](https://psychologytoday.com/ie/blog/trauma-and-ptsd/202403/is-phase-based-treatment-needed-for-ptsd)
- [FTC order against BetterHelp](https://www.ftc.gov/news-events/news/press-releases/2023/07/ftc-gives-final-approval-order-banning-betterhelp-sharing-sensitive-health-data-advertising)
