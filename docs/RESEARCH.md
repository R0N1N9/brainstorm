# Research brief

What the evidence says about each thing Brainstorm wants to do, and what that means for the design.
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

**Design consequence.** Brainstorm does not compute an ACE score. The timeline lets a person record what they
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
- *Chronic stress, alcohol, cannabis, exercise.* See `src/data/atlas.ts`; these entries come from standard
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

**Design consequence.** Brainstorm does not attempt self-guided trauma processing. It offers
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

## 7. Medication harm, withdrawal and the sensitised nervous system

This is the least settled area in the brief. The design rule is to say what kind of evidence stands behind
every statement, and never to advise on dosing.

**How common is withdrawal?** Henssler et al. (2024, Lancet Psychiatry; 79 studies, about 21,000 people) found
31% reported at least one symptom after stopping an antidepressant against 17% after stopping placebo, giving a
placebo-adjusted incidence of about 15%, and severe symptoms in 2.8%. A 2025 reanalysis argues these figures
underestimate the problem because most data come from short industry efficacy trials where withdrawal was a
minor consideration. An earlier review (Davies & Read 2019) reported around half; that paper was not retrieved
in this pass *(unverified)*.

**Can it last?** Acute withdrawal is usually put at one to six weeks. Protracted or post-acute withdrawal,
lasting months to years, is described in case series and analyses of patient reports (Hengartner et al. 2020,
n = 69 forum reports; Cosci & Chouinard 2020; Rennwald & Hengartner 2025). These sources establish that it
happens. They cannot say how often or to whom.

**Benzodiazepines.** The FDA added a boxed warning in 2020 covering dependence and withdrawal. In a
self-selected internet survey of 1,207 users (Ritvo et al. 2023), more than half of those reporting low energy,
memory loss, anxiety and similar symptoms said they lasted a year or more; the authors proposed the term
benzodiazepine-induced neurological dysfunction (BIND). No control group, no prevalence estimate.

**Persistent sexual dysfunction.** The European Medicines Agency concluded in 2019 that sexual dysfunction can
persist after SSRIs/SNRIs are stopped and required label warnings. Diagnostic criteria were published in 2022
(Healy et al.). Incidence and treatment are unknown.

**Tapering.** Horowitz & Taylor (2019) proposed hyperbolic tapering from the curved relationship between dose
and serotonin-transporter occupancy. It rests on pharmacology and cohort data; randomised trials are in
progress. The app explains the principle and does not calculate doses.

**Recognition.** In a patient survey, 47% said their doctor did not recognise their symptoms as withdrawal
(Guy et al. 2020). Patients ask for practical non-drug coping help and specialist support (Read et al. 2024,
n = 708).

**What helps?** Almost nothing has been trialled. A survey of people stopping antidepressants or antipsychotics
linked social support and other functional coping to better outcomes, and an interview study found many
described exercise as protective. Against that, intolerance of exertion, heat, cold, stimulants, new drugs and
intensive breathwork is very widely described in peer communities, and this pass found **no published
research** on that pattern or on "windows and waves". Those items are therefore labelled *lived experience* in
the app and should be treated as hypotheses.

**Not verified in this pass:** the akathisia content (Pringsheim et al. 2018; Lohr et al. 2015), NICE NG215
wording, the Ashton Manual, the antipsychotic and benzodiazepine mechanism entries in the atlas, and the URLs
in the resources list.

**Design consequences.**
- A *Recovery* section with urgent-safety guidance first, evidence labels on every tip, and resources.
- *Sensitive-system mode*: reorders practices (gentle → adapt → often too much), attaches an adaptation note to
  each, and warns that PHQ-9/GAD-7 items overlap with withdrawal symptoms.
- A daily window/wave log, because seeing windows return is the benefit people describe most often.
- Atlas lenses for medications and withdrawal, with a fourth evidence grade, *reported, mechanism unclear*.
- No taper calculator and no supplement or drug suggestions.

## 8. Medications, side effects and interactions in the 3D atlas

**What the model shows.** Each of 29 medications is described by the receptors, transporters and enzymes it
acts on, with a three-step strength rating simplified from receptor-binding data and standard references
(Stahl's Essential Psychopharmacology; prescribing information). Where a drug acts is derived from where those
targets are dense, so the same knowledge drives every drug.

**Side effects.** 21 side effects are mapped with where they start, where they are felt, typical course,
reversibility and what helps. Each "what helps" item carries its evidence basis. Most entries rest on
well-established pharmacology and clinical guidance; the citations are listed per entry in
`src/data/sideEffects.ts` and were written from background knowledge, **not re-verified in this pass**. The
emotional-blunting, post-SSRI sexual dysfunction and benzodiazepine cognition entries draw on sources searched
earlier in this brief.

**Interactions.** Only mechanism-level rules are modelled: serotonin load and MAOI combinations, MAOI with
stimulants or bupropion, additive CNS and breathing depression, QT prolongation, anticholinergic burden, CYP2D6
inhibition, seizure threshold, valproate with lamotrigine, clonidine with beta-blockers, and opposing dopamine
actions. This is deliberately not an interaction checker: it ignores dose, alcohol, other medicines and health
conditions, and the UI says so on every result.

**Needs review before wider use.** A pharmacist or psychiatrist should check `src/data/pharm.ts` and
`src/data/sideEffects.ts`, especially strength ratings, the side-effect "what helps" items, and the drug lists
per side effect.

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
- [Henssler et al. 2024, incidence of discontinuation symptoms](https://www.nationalelfservice.net/treatment/antidepressants/antidepressant-discontinuation-symptoms-meta-analysis/) · [2025 reanalysis](https://pubmed.ncbi.nlm.nih.gov/40692314/) · [Kalfas et al., JAMA Psychiatry](https://jamanetwork.com/journals/jamapsychiatry/fullarticle/2836262)
- [Horowitz & Taylor 2019, tapering of SSRI treatment](https://pubmed.ncbi.nlm.nih.gov/30850328/)
- [Hengartner et al. 2020, protracted withdrawal](https://pmc.ncbi.nlm.nih.gov/articles/PMC7768871) · [Rennwald & Hengartner 2025, post-acute withdrawal](https://www.cambridge.org/core/product/8BE6D20F785E9DB6259F6757B5719C0E/core-reader)
- [Ritvo et al. 2023, benzodiazepine-induced neurological dysfunction](https://pmc.ncbi.nlm.nih.gov/articles/PMC10309976/)
- [Post-SSRI sexual dysfunction, BMJ 2020](https://www.doi.org/10.1136/bmj.m754)
- [Guy et al. 2020, the patient voice](https://discovery.ucl.ac.uk/id/eprint/10123719/1/The%20patient%20voice%20patients%20who%20experience%20antidepressant%20withdrawal%20symptoms%20are%20often%20dismissed,%20or%20misdiagnosed%20with%20relap.pdf) · [Read et al. 2024, recommendations from 708 patients](https://www.lelan.org.au/wp-content/uploads/2024/09/Read-et-al-2024.pdf)
- [Mahmood et al. 2024, lived experience of SSRI withdrawal](https://onlinelibrary.wiley.com/doi/10.1111/hex.13966) · [Predictors of successful discontinuation](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10235642/)
