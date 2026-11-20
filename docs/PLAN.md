# Product plan

## Mission

Help people explore the workings of their own mind and keep it healthy: see their current state clearly,
understand what science says about how they got there, and practise body-based tools that move it.

## Principles

1. **Honest about evidence.** Every claim and every practice carries a grade and a source. Where science is
   thin, the app says so.
2. **A map of research, not a scan of you.** Self-report cannot reveal an individual brain. Personal data
   selects what to explore; it never produces statements about the user's neurons.
3. **Stabilise before you dig.** Grounding is one tap from every screen. The app supports reflection on the
   past and routes deep trauma work to trained humans.
4. **Private by construction.** Data stays on the device. No account, no analytics, no ads.
5. **Screening, never diagnosis.** Wellness language throughout. Elevated scores lead to "talk to someone",
   and any sign of self-harm leads to crisis lines.

## The five pillars

| Pillar | What the user gets | v0 (built) | Later |
|---|---|---|---|
| **Profile** | A current picture of mood, anxiety and wellbeing with trends | WHO-5, PHQ-9, GAD-7; daily snapshot; change detection | Sleep (ISI), stress (PSS), trauma symptoms (PCL-5), interoception (MAIA-2); wearable HRV and sleep |
| **Atlas** | An explorable map of the whole nervous system | 29 structures across brain and body × 22 lenses in five groups (systems, life & substances, medications, withdrawal, supports); pathways drawn from their source; evidence grades | Anatomical illustration or 3D model; cortical networks; more drug classes (stimulants, lithium, gabapentinoids); recovery timelines |
| **Timeline** | Life chapters laid out in order, to notice patterns | Low-detail entries, impact curve, links to the map | Optional private notes; mood overlaid on recent months; guided "parts of the story" reflections |
| **Practices** | Somatic tools matched to the current state | 16 practices, breath pacer, matching by need, practice log, adaptations for a sensitive system | Audio guidance; before/after ratings to learn what works for *this* person; multi-week programmes |
| **Recovery** | Support when the nervous system has been destabilised by medication | Safety guidance, sensitive-system mode, window/wave log with 30-day chart, evidence-labelled tips, prescriber conversation guide | Dose-history log to share with a prescriber; symptom patterns by body system; printable summary; review by clinicians and people with lived experience |

## Architecture

- **Now:** Vite + React + TypeScript single-page app. State in `localStorage` behind `src/store.ts`.
  Content (instruments, brain atlas, practices) is plain typed data in `src/data/`, so clinicians can review it
  without reading UI code. Scoring is pure functions in `src/scoring.ts`, covered by tests.
- **Next:** installable PWA with offline support; move storage to IndexedDB with at-rest encryption behind a
  passphrase.
- **Then:** native wrapper (Capacitor or React Native) for HealthKit / Health Connect.
- **Sync, if ever:** end-to-end encrypted, opt-in, keys never leave the user's devices.
- **AI, if ever:** a reflective companion is an obvious extension and the riskiest one. Preconditions: on-device
  or zero-retention processing, hard crisis-escalation paths, no therapeutic claims, clinical review.

## Roadmap

**Phase 0 — prototype (built).** The five pillars working end to end on local data.

**Phase 1 — make it trustworthy.**
- Clinical and neuroscience review of every string in `src/data/`. Several brain-atlas entries are flagged
  unverified in `docs/RESEARCH.md`.
- Confirm instrument licences against primary sources; resolve WHO-5 if the product will be commercial.
- Localised crisis resources by region.
- Accessibility audit; PWA + encrypted storage.

**Phase 2 — make it personal.**
- Before/after ratings on practices and a simple "what works for you" view.
- Sleep and stress instruments; optional PCL-5 behind an explicit opt-in with support information.
- Wearable import (HRV, sleep).
- Insight cards that relate the user's own series to each other (sleep ↔ mood), with honest uncertainty.

**Phase 3 — go deeper.**
- Structured multi-week programmes (behavioural activation, sleep, breath training).
- Anatomical brain model and network-level views.
- "Share with my therapist" export.
- Small pilot study with pre-registered outcomes before any efficacy claim.

## Risks

| Risk | Mitigation |
|---|---|
| A distressed user is destabilised by trauma content | Low-detail timeline, no forced disclosure, grounding everywhere, no self-guided exposure |
| Brain map read as personal diagnosis | Persistent framing, evidence grades, supportive lenses, no per-user region claims |
| Scores cause alarm or false reassurance | Published cut-offs only, plain-language interpretation, prompts toward professional care |
| Sensitive data leaks | Nothing leaves the device; encryption before any sync |
| Regulatory drift into medical-device territory | Wellness wording; legal review before launch or before any treatment claim |
| Recovery content read as advice to stop medication | Safety block first on the page and on every withdrawal lens; no dosing tools; prescriber involvement stated throughout |
| Lived-experience tips mistaken for proven treatment | Each tip carries its evidence basis; the weakest category is named plainly |
| Pseudoscience creeps in | Evidence grade required for every content entry; unsupported practices excluded (list in RESEARCH.md) |

## Open decisions

1. **Commercial or non-commercial?** Determines whether WHO-5 can stay.
2. **Web-first or mobile-first?** Wearable data and daily habit formation favour mobile.
3. **Who reviews the clinical content?** A psychologist and a neuroscientist should sign off before strangers use it.
4. **Is an AI companion in scope?** It changes the risk profile of the whole product.
