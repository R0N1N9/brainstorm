# Braindance

A private, local-first tool for exploring your own mind: a profile of how you are doing, an atlas of the
nervous system across brain and body, a timeline of your life's chapters, a library of somatic practices rated
by evidence, and a recovery section for people whose system has been destabilised by psychiatric medication.

Braindance is a self-reflection tool. It is not a medical device and does not diagnose or treat anything.

## Run it

```sh
npm install
npm run dev      # http://localhost:5173
npm test
npm run build
```

Open **Your data → Load sample data** to look around with a fictional history.

## What is here

| Path | Contents |
|---|---|
| `docs/RESEARCH.md` | The evidence behind each feature, with sources and what is still unverified |
| `docs/PLAN.md` | Mission, principles, architecture, roadmap, risks, open decisions |
| `src/data/` | Reviewable content: questionnaires, nervous-system atlas, practices, recovery guidance |
| `src/scoring.ts` | Scoring, cut-offs and practice matching (tested) |
| `src/views/` | Profile, Check-in, Atlas, Timeline, Practices, Recovery, Your data, Support |

## Licences of included instruments

- PHQ-9 and GAD-7: developed by Drs. Spitzer, Williams, Kroenke and colleagues; no permission required to reproduce.
- WHO-5 Well-Being Index: © World Health Organization 2024, CC BY-NC-SA 3.0 IGO. Non-commercial use only.
  WHO does not endorse this software.
