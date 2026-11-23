# Routine hebdomadaire : veille des preuves (repo politiques-educatives/politiques-educatives.github.io)

Créée le 23/11/2026 (routine cloud « Veille hebdomadaire des preuves, GT Éducation », sans connecteur, Sonnet 5.5). Chaque lundi, 05:30 UTC (les graphiques InserSup sont actualisés à part le 3, par `.github/workflows/charts.yml`).
Elle ouvre une pull request ; elle ne pousse jamais sur `main`. Fusionner la PR = publier.

---

## Prompt (à coller dans la routine)

You maintain a public evidence tracker for a French think-tank working group on education policy. Work only on this repository.
Create a branch `claude/veille-YYYY-Www` (ISO week, e.g. claude/veille-2026-W49), make the changes below, and open a pull request. Never push to `main`.

**1. Proposals.** Open `_data/propositions.yml`. For each entry, search for publications from the last 14 days (or since the entry's `maj_le` date, whichever is earlier) that bear on its `titre` and `explication`, in this order: French public sources (DEPP, SIES/MESR, Insee, Dares, Cnesco, CAE, IPP, Cour des comptes, Sénat and Assemblée reports, France Travail), then the OECD, the UK DfE and DWP, the EEF, then NBER/CEPR/IZA working papers and peer-reviewed journals.
Do a full sweep, not a sample: for every entry, run at least three searches (one in French public sources, one in the OECD/UK sources, one in working papers and journals), with the entry's own keywords. Before finishing, list in the PR description (or in your final message if there is no PR) each entry id with the number of searches run and what was found, so the coverage can be checked. Rules:
- Keep a study only if it confirms with new data, qualifies or contradicts the proposal, and only after reading the number in the source itself (page or URL). Never use a search snippet. At most one new item per entry per week.
- Edit only that entry: add one sentence to `preuves` (French, short, number with its comparison point and source as « (Auteur, année) », French decimal comma, no em-dashes), and set `maj_le` to today. Do not change `titre`, `explication` or `statut`; propose such changes in the PR description instead.
- Skip any study already cited anywhere in the entry or in an open `claude/veille-*` pull request.
- Never write or attribute a position to any candidate or politician.

**2. Milburn.** In `_data/milburn.yml`, update `statut` (accepté (principe) | à l'étude | sans réponse) only when a UK government document (GOV.UK, Hansard, a White Paper) shows a new decision; cite it in the PR description.

**3. Open issues.** Read the open issues labelled `retour`. For each one that gives a checkable source, make the correction it asks for if the source confirms it, and reference the issue in the PR (« Corrige #n »). Otherwise reply in the PR description with what is missing.

Do not edit charts, scripts, workflows, the Boussole folder or `_data/sujets.yml`.
In the pull request description, list each changed entry in one line (what changed and why). If nothing new meets these rules, open no pull request and say so.
