---
layout: recherche
title: "06 — An AI-resilience index for French post-bac formations: evidence base"
slug: 06-index-ia-formations
sujets: ["orientation", "emploi"]
---
{% raw %}

Research note, 2026-10-26. English. Every figure carries source, year, URL. "UNVERIFIED" = not checked against the primary text. Secondary-source figures are flagged as such.

---

## A. Occupation-level AI exposure indices

### A1. The indices compared

| Index | What it measures | Unit / data | Headline result | Main limit |
|---|---|---|---|---|
| **Felten, Raj & Seamans (AIOE), SMJ 42(12), 2021** | Overlap between progress in 10 AI applications and the 52 O*NET *abilities* used in each occupation | US SOC occupations; also industry (AIIE) and county (AIGE) | Validated occupation-level exposure score ([Princeton record](https://collaborate.princeton.edu/en/publications/occupational-industry-and-geographic-exposure-to-artificial-intel/)) | Ability-based, pre-LLM; says nothing on direction (substitute vs complement) |
| **Felten, Raj & Seamans, 2023 (LM / image-generation exposure)** | Same method re-weighted for language modelling and image generation | US occupations | Used by Fed to rank US majors (see C1) ([FEDS Note 2025](https://www.federalreserve.gov/econres/notes/feds-notes/educational-exposure-to-generative-artificial-intelligence-20250226.html)) | Same |
| **Webb, 2020** | Text overlap between verb-noun pairs in O*NET task descriptions and AI *patents* | US occupations | AI, unlike software and robots, is directed at **high-skill, high-wage** tasks; method back-tested on earlier technologies, where exposed occupations lost employment and wages ([working paper](https://conference.nber.org/confer/2020/YSAIf20/Required%2011.pdf)) | Patents measure inventive intent, not deployment; pre-LLM |
| **Eloundou, Manning, Mishkin & Rock, "GPTs are GPTs", 2023; *Science* 2024** | Human + GPT-4 rating of whether an LLM cuts task time by ≥50% | O*NET tasks → US occupations | ~**80%** of US workers have ≥10% of tasks exposed; ~**19%** have ≥50% exposed; exposure rises with wage ([arXiv 2303.10130](https://arxiv.org/abs/2303.10130v2)) | Authors partly from OpenAI; "exposure" = technical feasibility of time saving, not adoption or job loss |
| **Gmyrek, Berg & Bescond, ILO WP 96, 2023** | GPT-4-scored exposure of ISCO-08 tasks, split into automation vs augmentation potential | ISCO 4-digit, global | Augmentation dominates; **5.5%** of employment in high-income countries exposed to *automation* vs **0.4%** in low-income; clerical work (female-heavy) most exposed ([ILO release 2023](https://www.ilo.org/resource/news/generative-ai-likely-augment-rather-destroy-jobs)). Augmentation share figure: UNVERIFIED | Pre-2024 models; ISCO-level, not French tasks |
| **Gmyrek et al., ILO–NASK WP 140, May 2025** | Refined index: 2,861 tasks from the Polish classification, 52,558 data points from a survey of 1,640 workers, plus expert Delphi rounds | ISCO-08, global | **25%** of world employment in exposed occupations; **34%** in high-income countries; highest-exposure gradient = **9.6%** of female vs **3.5%** of male employment in high-income countries ([ILO WP 140](https://www.ilo.org/node/706766); [ILO news](https://www.ilo.org/resource/news/one-four-jobs-risk-being-transformed-genai-new-ilo%E2%80%93nask-global-index-shows)) | **Best fit for France**: ISCO-native, gradients separate automation-risk from transformation |
| **IMF, Cazzaniga et al., SDN/2024/001** | AIOE × a *complementarity* index (physical contact, responsibility, criticality, need for human judgment) | ILO data, 142 countries | ~**40%** of workers worldwide and ~**60%** in advanced economies in high-exposure occupations; about half of these may benefit (high complementarity) ([IMF SDN PDF](https://www.developmentaid.org/api/frontend/cms/file/2024/01/SDNEA2024001-1.pdf)). "About half" split: UNVERIFIED in primary text | Complementarity is a static O*NET proxy; **closest existing operationalisation of Garicano's "messiness"** |
| **Anthropic Economic Index, Feb 2025 →** | *Observed* usage: millions of Claude.ai conversations mapped to O*NET tasks via a privacy-preserving tool | O*NET tasks | Feb 2025: software + writing ≈ half of usage; **~36%** of occupations use AI for ≥25% of their tasks, **~4%** for ≥75%; **57%** augmentation vs **43%** automation ([Anthropic 2025](https://www.anthropic.com/research/the-anthropic-economic-index)). Third report (Nov 2025): "directive" (delegation) conversations up from **27% to 39%**; first time automation > augmentation ([arXiv 2511.15080](https://arxiv.org/pdf/2511.15080)) | One vendor's users; usage ≠ labour demand; changes every release |
| **Microsoft, Tomlinson, Jaffe, Wang, Counts & Suri, "Working with AI", 2025** | AI *applicability score*: ~200k Bing Copilot conversations, classified to O*NET work activities, weighted by task success and scope | O*NET → US occupations | Information gathering and writing most common; interpreters, historians top the applicability list ([arXiv 2507.07935](https://arxiv.org/abs/2507.07935); press: [WJLA](https://wjla.com/news/nation-world/interpreter-historian-top-list-of-40-jobs-with-high-ai-overlap-microsoft-report)) | Applicability ≠ substitution (authors say so); one product's users |

**Common limit: exposure is not displacement.** All indices score *tasks*, then average to occupations. None captures (i) whether remaining tasks cohere into a job (Garicano), (ii) demand elasticity (cheaper output can raise employment), (iii) adoption frictions and regulation. The IMF complementarity layer and the ILO gradients are the only ones that try to separate substitution from augmentation.

### A2. Early employment evidence

| Study | Data | Result | Caveat |
|---|---|---|---|
| **Brynjolfsson, Chandar & Chen, "Canaries in the Coal Mine?", Stanford DEL, Aug 2025** | ADP payroll microdata (largest US payroll processor) | Workers aged **22–25** in the most AI-exposed occupations: **−13%** relative employment, controlling for firm-level shocks; older workers in same occupations stable or growing; effects where AI *automates*, not where it *augments*; adjustment via employment, not wages ([SIEPR](https://siepr.stanford.edu/publications/working-paper/canaries-coal-mine-six-facts-about-recent-employment-effects-artificial)) | Insee (Mar 2026) cites **~16%**, likely a later version: UNVERIFIED which |
| **Humlum & Vestergaard, "Large Language Models, Small Labor Market Effects", BFI WP 2025-56 / NBER w33777** | Two adoption surveys (2023, 2024), **25,000** workers, **7,000** workplaces, 11 exposed occupations, linked to Danish registers | **No** effect on earnings or hours; CIs rule out effects >**1%** (≥2% two years on, NBER version); average time saved **3%** ([BFI PDF](https://bfi.uchicago.edu/wp-content/uploads/2025/04/BFI_WP_2025-56-3.pdf)) | Incumbent workers only, not entrants: compatible with "canaries" |
| **Yale Budget Lab & Brookings, Oct 2025** | CPS occupational mix, 33 months after ChatGPT | No economy-wide disruption; exposure/automation/augmentation measures **unrelated** to changes in (un)employment; occupational-mix shifts pre-date 2022 ([Budget Lab](https://budgetlab.yale.edu/research/evaluating-impact-ai-labor-market-current-state-affairs)) | Aggregate; early window |
| **Orr, Tucker & Warren, US Census CES-WP-26-56, Sep 2026** | Administrative records on graduates, by **major** | Most-exposed decile of majors: initial employment **−5 pp**, full-quarter initial earnings **−13%** ("comparable to graduating into a large recession"); half from lower within-industry pay, half from shift to retail/restaurants; fades with tenure but stays substantial ([Census](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-56.html)) | **Directly relevant**: a major-level design; one report says ~29% of 2016–24 US bachelor's covered (secondary, UNVERIFIED) |
| **Insee, Adjerad & Vermersch, Note de conjoncture, 24 Mar 2026** | French payroll employment | Information-communication employment **−3.0%** Q4 2023→Q4 2025, entirely from under-30s (−3.8 pts contribution); salaried employment of 15–29 (excl. apprentices) in IT activities **−7.4%** y/y in Q4 2025 vs −0.7% all private employment; adjustment via **fewer entry-level hires** ([Insee éclairage](https://www.insee.fr/fr/statistiques/8907419); [PDF](https://www.insee.fr/fr/statistiques/fichier/8907419/ndc-mars-2026-ecl-AI.pdf)) | Insee explicitly refuses to attribute it to GenAI alone (general slowdown) |
| **Insee Première n° 2120, Jul 2026** | ICT-in-firms survey | **18%** of firms in France used ≥1 AI technology in 2025 (+8 pts on 2024; EU 20%); **58%** of firms with 250+ employees; 59% in info-com ([Insee](https://www.insee.fr/fr/statistiques/9025878)) | Adoption, not effects |
| **Coface & OEM, Mar 2026** (via *Le Monde*, 18 Mar 2026) | Task-exposure mapping, France | ~**5 million** employees, **16.3%** of employment, "threatened"; exposure 10–15% for CAP/BEP vs 15–20% for higher-ed graduates, >25% for PhDs (press, [Banque des Territoires](https://www.banquedesterritoires.fr/impact-de-lia-sur-lemploi-les-metropoles-surexposees)) | Private study; methodology UNVERIFIED (original not retrieved) |
| **Roland Berger, 2023** | 3,123 tasks in 436 French occupations | ~**1/3** of French work activity exposed; ~**800,000** jobs at high automation risk ([Roland Berger](https://www.rolandberger.com/fr/Insights/Publications/L-impact-de-l-IA-g%C3%A9n%C3%A9rative-sur-l-emploi-en-France.html)) | Consultancy; not peer-reviewed |

No DARES, France Stratégie or COE publication scoring French occupations on *generative* AI exposure (2024–25) was found; the last COE work is the 2017 *Automatisation, numérisation et emploi*. Gap = opportunity for the guide.

**Reading:** exposure is real, effects on incumbents ≈ 0 so far, effects on **entrants** in exposed occupations visible in the US (ADP, Census) and consistent in France (Insee). An index aimed at 18-year-olds should therefore weight *entry-level* exposure, not occupation averages.

---

## B. The two weighting ideas

### B1. Garicano: "messy jobs"

Sources: Garicano, *A New Year's letter to a young person*, Silicon Continent, 2 Jan 2026 ([link](https://www.siliconcontinent.com/p/a-new-years-letter-to-a-young-person)); book Garicano, Li & Wu, *Messy Jobs: The Work That AI Cannot Reach*, Upriver Press, June 2026; PIIE slides, 25 Sep 2026 ([PDF](https://www.piie.com/sites/default/files/2026-09/2026-09-25garcianoppt.pdf)); Markus' Academy ep. 164, 9 Jul 2026 ([link](https://markusacademy.substack.com/p/ai-and-messy-jobs)). No 2025 Silicon Continent post on "messy jobs" was found; the argument is 2026.

- **Autonomy threshold.** "The point at which AI stops assisting and starts operating alone: the finished output is good enough that paying a human to perform the task is no longer worth it." Below it AI complements; above it, AI substitutes (PIIE slide 3).
- **Messiness ≠ difficulty.** "Coding a well-defined program can be hard, but it is still a clean task. Messiness comes from strong bundles and relationships" (slide 4). The threshold rises with messiness.
- **Three tiers** (slide 6):
  - Tier 1, single verifiable tasks: coder, junior contract lawyer, wire journalist. Price of the task collapses ("a few percent of jobs", Markus' Academy).
  - Tier 2, strong task bundles: nurse, litigation lawyer, tech sales, shoe-leather journalist. "The threshold for the whole job is higher than for any one task." Most careers.
  - Tier 3, bundles of relationships: entrepreneur, senior manager, AI-implementation consultant. Authority, accountability, tacit knowledge ("a double digit share of work").
- **When is a bundle strong?** When splitting it destroys value; three conditions: (1) unpredictable demand, (2) production spillovers between tasks, (3) indivisible measurement of output (slide 10). Coasean logic: tasks are bundled because coordination is costly; AI cuts coordination costs, so the **main threat is unbundling**, not automation (Markus' Academy; [Coy, Jul 2026](https://petercoy.substack.com/p/may-your-job-be-messy)).
- **Evidence offered:** radiology (2025: 725+ AI models, record residency demand; radiologists spend **36%** of time on scans, 2013 study cited in the letter). On Chinese hiring platforms (Aug 2024–Jun 2025), same-title postings requiring AI carry a **wage premium** for managers/coordinators and a **penalty** for analysts, data scientists, developers, journalists (slide 12; magnitudes not given).
- **Caveat stated by the authors' commentators:** "Messiness protects a job only when it's paired with cognitive difficulty" (Coy): receptionists have messy but low-cognition jobs and stay at risk.
- **Education implications:** juniors traditionally "paid" for training with grunt work AI now does; "universities will have to pick up training that used to happen on the job" (Garicano, via Coy). Letter: "The specific knowledge you learn today will depreciate faster than ever. Choose the job where you will learn most, but also the one where you will learn to learn."
- **Index implication:** score a formation by whether its graduates' entry jobs are Tier 1 (clean tasks) or Tier 2–3 (bundles, responsibility), using O*NET "responsibility", "consequence of error", "coordination", "contact" items (the IMF complementarity variables are a ready-made proxy). No published empirical "messiness index" exists yet: UNVERIFIED that the book contains one.

### B2. Deming: maths × social skills

- **Deming (2017), QJE 132(4)** ([PDF](https://scholar.harvard.edu/sites/scholar.harvard.edu/files/ddeming/files/deming_socialskills_qje.pdf)): high-social-skill occupations grew by nearly **12 pp** of US employment 1980–2012; math-intensive, low-social jobs shrank **3.3 pp**. Employment and wage growth strongest in jobs requiring **both** high maths and high social skill; return to social skills larger in NLSY97 than NLSY79; cognitive and social skills are complements in wages. Mechanism: social skill cuts coordination costs in team production (same Coasean logic as Garicano).
- **Weidmann & Deming (2021), Econometrica 89(6)**: random assignment of individuals to multiple teams; "team players" raise group performance beyond forecast; they score higher on a social-intelligence test but not on IQ, personality, education; social skill predicts team performance about as well as IQ ([Econometric Society](https://econometricsociety.org/publications/econometrica/2021/11/01/team-players-how-social-skills-improve-team-performance)).
- **Counterpoint: Deming & Noray (2020), QJE 135(4), "Earnings Dynamics, Changing Job Skills, and STEM Careers"**: using online job postings 2007–2019, skill content changes fastest in tech occupations; the initial pay premium for applied STEM majors (CS, engineering, business) **falls by more than 50%** in the first decade, and graduates exit fast-changing occupations as they age ([NBER w25065](https://www.nber.org/papers/w25065.pdf); [IDEAS](https://ideas.repec.org/a/oup/qjecon/v135y2020i4p1965-2005.html)). **Implication:** a narrow technical skill is a depreciating asset; the index should not reward "technical = safe".
- Deming, *NYT*, 2019 ("Engineers sprint but English majors endure"; ACS cross-section): CS/engineering graduates aged 23–25 earned **$61,744** vs **$45,032** for history/social science (+37%); by age 40, male social science/history graduates **$131,154** vs **$124,458** for CS/engineering; for women the applied-STEM premium fell from ~**50%** to ~**10%** ([copy](https://www.sjsu.edu/history/docs/Engineer%20Salaries%20NY%20Times.pdf)). Cross-section, not panel; selection into management/law.

---

## C. Field-of-study level mapping

### C1. Existing major-level exposure maps

| Source | Method | Result |
|---|---|---|
| **Timmerman, FEDS Note, Fed Board, 26 Feb 2025** | Felten et al. (2023) LM and image-generation scores averaged over occupations of graduates, by first major (National Survey of College Graduates 2013–21), z-scores | LM exposure: Maths & CS **+1.10**, Econ & Business **+0.89**, Social sciences **+0.79**, Education +0.68, Arts & Humanities **−0.03**, Bio & Health **−2.02**. Most exposed majors (LM): astronomy 1.93, actuarial 1.72, accounting 1.58, political science 1.37, financial management 1.35. Nursing bottom ten on both ([FEDS](https://www.federalreserve.gov/econres/notes/feds-notes/educational-exposure-to-generative-artificial-intelligence-20250226.html)) |
| **Census CES-WP-26-56, 2026** | GPT-4 task-time exposure of graduates' typical entry jobs, majors in deciles | High: CS, computer engineering, information science, statistics, applied maths, EE, actuarial science, journalism; low: education, health (press: [Fortune](https://fortune.com/2026/09/17/ai-chatgpt-college-majors-retail-jobs/); exact ranking UNVERIFIED) |
| **NY Fed, "Labor market for recent college graduates"** (2023 ACS data, per press, 2025) | Unemployment, grads aged 22–27, by major | Computer engineering **7.5%**, CS **6.1%** vs **5.8%** all recent grads; art history 3%; nutrition 0.4% (secondary: [CNBC/NBC](https://www.nbcnewyork.com/news/business/money-report/college-majors-with-the-best-and-worst-employment-prospects-philosophy-now-outranks-finance/6267486/?amp=1)) — check the NY Fed page directly (URL https://www.newyorkfed.org/research/college-labor-market, not re-fetched) |
| **Burning Glass Institute, "No Country for Young Grads", 2025** | Postings for <3 years' experience | Steep fall since 2022 in exposed occupations (business ops, project management, finance) (secondary: [eWeek](https://www.eweek.com/news/ai-impact-jobs-college-graduates/)); no major-level exposure table found |

Lightcast, Strada, OECD, Eurostat: no major-level GenAI exposure table found in this pass (UNVERIFIED that none exists).

**Lesson:** the Fed and Census results put **maths/CS/business/accounting near the top** of exposure and **health/education/caring near the bottom**, the reverse of the "STEM is safe" intuition. Humanities sit near the average. A French index will likely produce similar orderings, which is politically salient.

### C2. French data that can be matched

| Source | Coverage | Occupation variable? | Use |
|---|---|---|---|
| **InserSup (MESR-SIES)**, DSN + Insee non-salaried base | Licence, LP, master, **BUT**, bac+3 grade licence, bac+5 grade master, **diplôme d'ingénieur**, bac+5 **management schools**; employment at 6/12/18/24/**30** months; pay quartiles at 12–30 months; by mention × establishment | Contract type and pay now; **"à compter de 2026" sector of activity and PCS** ([Note méthodologique, Dec 2025](https://www.enseignementsup-recherche.gouv.fr/sites/default/files/2026-01/note-m-thodologique-insersup-2025-39129.pdf); [open data](https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-insersup)) | **The backbone.** PCS of graduates per formation becomes available from 2026 |
| **InserJeunes (DEPP/DARES)** | Vocational track, **CAP to BTS**, lycée pro and apprenticeship, up to 24 months ([DEPP](https://education.gouv.fr/media/196139/download)) | Employment/contract; occupation UNVERIFIED | BTS coverage |
| **Céreq Génération** (2017 cohort: 25,000 respondents for ~746,000 leavers; reinterviewed at 3 and 6 years) | All leavers, all levels incl. **prépa/school dropouts** ([Insee doc](https://www.insee.fr/fr/statistiques/fichier/6657784/Presentation%20de%20l'enquete%20Generation%202017.pdf)) | Yes: occupation coded (PCS) | Only source with occupation for every route; too small for formation × establishment cells. Génération 2021 details UNVERIFIED |
| **Parcoursup open data** | Formation catalogue, capacity, selectivity | No | Formation identifier & user-facing channel |
| **ONISEP** | Formation and métier descriptions | Métier ↔ ROME links | Curriculum content, not outcomes |

**Prépas (CPGE)** are not a terminal diploma: score them through the school they feed (ingénieur/commerce in InserSup).

### C3. Crosswalk chain: is it feasible?

- **PCS 2020 → ISCO-08:** Insee publishes a **probabilistic matrix** (from Enquête emploi 2021–23), xlsx/csv; Insee notes coding directly from occupation labels is better ([Insee 8292892](https://www.insee.fr/fr/information/8292892)). **Usable.**
- **ISCO-08 → exposure:** ILO WP 140 scores are native ISCO-08 (no further step). For O*NET-based indices (Felten, Eloundou, Anthropic, Microsoft), use the BLS SOC↔ISCO-08 crosswalk (standard; not re-checked here).
- **ROME 4.0:** 1,911 fiches, 14,301 appellations, since March 2023 ([data.gouv](https://www.data.gouv.fr/datasets/repertoire-operationnel-des-metiers-et-des-emplois-rome)). No official ROME 4.0 → ISCO table found. The DARES **FAP 2021** gives a FAP / PCS 2020 / ROME (V3) correspondence ([DARES](https://dares.travail-emploi.gouv.fr/sites/default/files/7ee92d53dcc3dd755c63cfe1b1bd429a/Dares_Nomenclature_FAP2021_descriptif.pdf)). ROME ↔ ESCO (which embeds ISCO) mapping: UNVERIFIED.
- **Recommended chain:** formation → (InserSup 2026+) PCS of graduates at 18–30 months → Insee PCS→ISCO matrix → ILO 2025 gradient (+ O*NET-based scores via SOC for robustness). ROME is only needed for the curriculum/skills layer, not the outcome layer.

---

## D. Liberal arts / polyvalent degrees in France

| Programme | Design | Note |
|---|---|---|
| **CPES (PSL + Lycée Henri-IV)** | 3-year licence; L1 at Henri-IV in one of three tracks (Humanités & société; Sciences; Économie, société & droit); L2 double major (e.g. Maths + Physics; Économie + Droit; Économie + Sociologie/Science politique); L3 specialisation ([PSL](https://psl.eu/formation/cpes-psl-henri-IV)) | Closest French analogue to maths × social liberal arts; other CPES exist (e.g. [Paris-Saclay](https://www.universite-paris-saclay.fr/formation/cycle-pluridisciplinaire-detudes-superieures); [MESR](https://www.enseignementsup-recherche.gouv.fr/fr/le-cycle-pluridisciplinaire-d-etudes-superieures-cpes-84197)). Intake numbers: not found |
| **Sciences Po Collège universitaire** | 3-year bachelor, 7 campuses, core of law, economics, humanities, history, political science, sociology; 3rd year abroad ([Campus France](https://ressources.campusfrance.org/pratique/etablissements/fr/univ_sciencepo_fr.pdf)) | Weak maths component (UNVERIFIED current quantitative requirement) |
| **Double licences** (e.g. maths–économie, droit–histoire, maths–philosophie), "licences pluridisciplinaires", school bachelors | Widespread; no national list retrieved | Should score well on the curriculum layer by construction |

**Evidence on returns:** US evidence is the Deming cross-section (B2) plus the Deming–Noray obsolescence mechanism. No French causal study of returns to CPES/double licences found. The Fed note shows US Liberal Arts I colleges have the **highest** LM exposure among bachelor's institutions, because of their social-science share: "liberal arts" is not automatically low-exposure.

---

## E. Method sketch

### E1. Construction (three layers)

1. **Outcome layer (data-driven).** For each formation × establishment cell: distribution of graduates' PCS at 18–30 months (InserSup 2026+; Génération for BTS/prépa routes) → ISCO via Insee matrix → exposure. Use **two** indices (ILO 2025 gradient; IMF complementarity-adjusted AIOE) and report agreement, not a single number. Weight entry-level occupations (where the Census, ADP and Insee effects sit).
2. **Messiness adjustment (job content).** Occupation-level score from O*NET/ESCO items: responsibility for outcomes, consequence of error, coordination/negotiation, face-to-face contact, unstructured problems. The IMF complementarity index already bundles several of these. Tier 1 / 2 / 3 classification à la Garicano.
3. **Curriculum layer (formation content).** Share of ECTS in quantitative methods × share in oral/team/project work and humanities; bonus for double majors and for "learning to learn" (Deming–Noray: specific skills depreciate). Must be coded by hand from maquettes: costly, gameable (see E2).

**Output:** bands (e.g. A–E) with confidence ranges, never a rank to the decimal; show the underlying earnings and employment from InserSup alongside.

### E2. Risks

| Risk | Mechanism | Mitigation |
|---|---|---|
| **False precision** | Two crosswalks (PCS→ISCO probabilistic, ISCO→O*NET) + task-based exposure ≠ displacement; US indices disagree with Danish null results | Bands, two indices, publish uncertainty; label "exposure", not "risk of unemployment" |
| **Obsolescence of the index** | Anthropic delegation share moved 27%→39% in about a year; scores built on GPT-4 era capabilities | Annual revision; date-stamp every score |
| **Selection, not value-added** | Outcomes reflect who enters (prépa/école students), not what the formation adds; same issue documented for UK LEO and US Scorecard | Report raw outcomes; adjust for bac track/mention where data allow |
| **Self-fulfilling / herding signals** | If everyone avoids "exposed" maths/CS, shortages raise their returns; demand for cheapened outputs may be elastic (Garicano's price-theory point) | Present as information, not advice; show earnings too |
| **Gaming by schools** | Re-labelling courses as "projet", "soft skills" to lift curriculum score; steering graduates to certain job titles | Curriculum layer audited or kept low-weight; outcome layer from administrative data only |
| **Equity** | Penalising formations with first-generation students; BTS/BUT routes with less data | Separate band for vocational routes; minimum cell sizes |
| **Political misreading** | Humanities near average and health lowest: index may contradict "STEM good" priors | Publish method first; frame as resilience, not prestige |

### E3. Precedents

- **UK Discover Uni / LEO:** earnings by subject × provider at 15 months, 3 and 5 years from tax records, labelled experimental ([OfS](https://www.officeforstudents.org.uk/data-and-analysis/graduate-earnings-data-on-discover-uni/)); 2021-22 release shows Computing medians across providers ranging from **£23,400 to £99,600** at five years ([DfE](https://explore-education-statistics.service.gov.uk/find-statistics/leo-graduate-outcomes-provider-level-data/2021-22)) — illustrates that the establishment matters as much as the field.
- **US College Scorecard:** median earnings and debt by field of study × institution, API and downloads ([documentation, Sep 2025](https://collegescorecard.ed.gov/files/FieldOfStudyDataDocumentation.pdf)).
- **France already exposes InserSup data** on Parcoursup, MonMaster and ONISEP once a year (InserSup note, Dec 2025): an AI-exposure column could be added to an existing channel rather than a new guide. No existing tool anywhere combines field-level outcomes with an AI-exposure score (none found).

---

## Summary (10 lines)

1. Occupation-level exposure indices (Felten-Raj-Seamans, Webb, Eloundou, ILO 2023/2025, IMF, Anthropic, Microsoft) agree that exposure rises with education and wage, but measure task feasibility or usage, not job loss.
2. The ILO 2025 index (ISCO-08, 34% of jobs exposed in high-income countries, with gradients) and the IMF complementarity layer are the best fit for a French tool.
3. Incumbents show no effects so far (Denmark: CIs exclude >1–2%; Yale: no link to unemployment); entrants do: −13% for 22–25s in exposed US occupations (ADP), −5 pp employment and −13% earnings for most-exposed US majors (Census 2026).
4. France: under-30 IT employment −7.4% y/y in Q4 2025; Insee refuses to attribute it to AI alone. No official French GenAI exposure index exists: a gap.
5. Garicano (2026 book and Silicon Continent letter, not 2025): jobs survive if they are strong bundles (unpredictable demand, spillovers, indivisible measurement) or relationship/authority jobs; the threat is unbundling; messiness protects only with cognitive difficulty.
6. Deming 2017: maths × social-skill jobs grew fastest in jobs and pay; Weidmann-Deming 2021: social skill predicts team output about as well as IQ; Deming-Noray 2020: applied-STEM premium falls >50% in a decade.
7. US major-level maps put maths/CS/accounting/business at top exposure and health/education at bottom; humanities near average.
8. Feasible French chain: InserSup (adds PCS and sector from 2026; covers licence, master, BUT, ingénieur, écoles de management) → Insee PCS→ISCO matrix → ILO scores; BTS via InserJeunes, prépa via the schools they feed, Génération for validation.
9. Liberal-arts analogues exist (CPES PSL and others, Sciences Po Collège, double licences) but no French evidence on their returns.
10. Main risks: false precision, rapid obsolescence, selection, gaming of curriculum scores; publish bands with uncertainty, anchored in administrative data, inside Parcoursup/ONISEP rather than as a standalone ranking.
{% endraw %}
