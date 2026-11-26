---
layout: recherche
title: "07 — A public AI tool for pupils: what exists, who could bid, what the evidence says"
slug: 07-outil-ia-public
sujets: ["ecrans"]
---
{% raw %}

> Research file, 2026-10-26. English, French quotes kept. Every figure carries
> source + year + URL. **UNVERIFIED** = not confirmed on a primary or reliable
> source in this pass. Web-search budget ran out mid-pass; several items below
> are flagged UNVERIFIED for that reason only and should be rechecked.

## 0. Two tensions to resolve before drafting

| Tension | Detail | Source |
|---|---|---|
| **Internal line: "zéro IA générative pour l'élève jusqu'au bac"** | Notes 06 and 07 (rev. 2026-09-24) removed the pupil-facing AI agent; the proposal here puts a generative tool in front of pupils **from 6e**. Needs an explicit arbitration, or a reframing (supervised, guardrailed tool ≠ free use, which is what the negative evidence measures). | `education-reform/notes/07-point-faible-ia-soutien-universel.md` |
| **Ministry framework: pupil use only from 4e, in class** | Cadre d'usage (June 2025): pedagogical generative-AI use by pupils allowed **from 4e, in class, under teacher supervision**; primary pupils learn concepts without using generative services. A 6e start (and home voice mode) goes beyond it. | Banque des Territoires summary, https://www.banquedesterritoires.fr/ia-en-education-ce-que-prevoit-le-cadre-dusage-pour-la-communaute-educative ; primary text https://www.education.gouv.fr/cadre-d-usage-de-l-ia-en-education-450647 (403 to fetch: wording **UNVERIFIED** on primary) |

## A. What France already does

| Item | Facts | Source |
|---|---|---|
| **MIA Seconde** (now listed by EvidenceB as "MIA Lycée") | Adaptive exercises in maths and French for seconde, positioned from the DEPP entry tests. Announced by G. Attal, Dec 2023. **Public procurement contract** signed Aug 2022 after a 2021 call for projects; **~€2.8M over 36 months**, renewable 2×12 months. Consortium: **EvidenceB** (pedagogy, €2.04M) + **Docaposte** (hosting, maintenance, support, €751k). Libération reported €3.76M over 5 years. Algorithms and code not published ("combination of seven algorithms"). Pilot: 8 académies, 150 lycées, 300+ seconde classes (2023-24); generalisation planned rentrée 2024, ~1 year late vs original plan. | Next, 2024, https://next.ink/133921/mia-la-nouvelle-ia-de-leducation-nationale-coute-28-millions-deuros-sur-3-ans/ |
| MIA evaluation | Impact study launched (experiment started Feb 2024; protocol doc dated 4 Sept 2024). **No published results found.** "20,000 exercises" figure: press only, **UNVERIFIED**. | Académie de Martinique, 2024, https://site.ac-martinique.fr/drane/wp-content/uploads/sites/100/2024/09/Evaluation-MIA-Seconde-1.pdf ; CIDJ, https://www.cidj.com/actualite/mia-l-outil-d-intelligence-artificielle-pour-booster-le-niveau-des-lyceens |
| **Albert** (DINUM) | "L'API interministérielle de référence pour accéder à des modèles d'IA générative": DINUM instance of open-source **OpenGateLLM**, OpenAI-compatible, runs "open-weight ou propriétaires" models; sovereign hosting at **Outscale** (Nubo announced), SecNumCloud-compatible; version cleared for internal state data "en finalisation". **70+ public projects, 100,000+ requests/week.** No Éducation nationale use mentioned. | DINUM, 2026, https://ia.numerique.gouv.fr/outils-ia/albert-api |
| **Cadre d'usage de l'IA en éducation** | Consultation Jan-May 2025; published 14 June 2025 (BO 19 June 2025). AI supports, never replaces, teacher judgment; free/open tools recommended, consumer tools tolerated only without personal data; "frugal" use justified by pedagogical benefit; pupil use from 4e in class; AI-written homework without permission = fraud; mandatory AI-awareness training in 4e, 2de, CAP. | Banque des Territoires, 2025 (above); eduscol hub https://eduscol.education.gouv.fr/6702/les-intelligences-artificielles-et-leurs-usages-en-education |
| **Pix AI module** | Announced by É. Borne, 11 Feb 2025 (AI Action Summit): online course on Pix, « obligatoire pour les élèves de 4ᵉ et de 2de », 30 min to 1h30 depending on initial level, prompting, how generative AI works, data, environmental impact. Rolled out rentrée 2025. A union source says it was « peu mise en œuvre »; **no completion figures found**. | Banque des Territoires, 2025, https://www.banquedesterritoires.fr/education-et-ia-les-annonces-delisabeth-borne-impactant-les-collectivites ; Tunisie Numérique, 2026, https://www.tunisienumerique.com/?p=1123797 |
| **"1 hour of AI per week" from rentrée 2027** | PM Sébastien Lecornu (June 2026, during VivaTech, via X/RTL): one hour per week devoted to AI from rentrée 2027, inside the *Sciences numériques et technologie* (SNT) course; topics: how models work, uses, ethics, digital sovereignty, critical thinking. SNT is a seconde course, so likely seconde, but **levels UNVERIFIED**; only secondary reporting found. | Tunisie Numérique, 21 June 2026, https://www.tunisienumerique.com/?p=1123797 |
| **P2IA (Partenariat d'innovation et IA)** | Cycle 2 (CP-CE2), French + maths, AI teacher assistants for differentiation; funded by MENJ, SGPI (PIA) and Banque des Territoires; explicitly an R&D step before any generalisation. Laureates incl. **Lalilo** (French), **Adaptiv'Math** (EvidenceB consortium), **Mathia** (maths, voice). **P2IA cycle 3** (CM1-6e, French, maths, modern languages) launched rentrée 2025, 6 services tested in class from Jan 2026. | ac-Paris, https://www.ac-paris.fr/partenariat-d-innovation-en-intelligence-artificielle-133546 ; Eduscol, https://eduscol.education.gouv.fr/6717/... (403 to fetch; cycle 3 details from search snippet, **UNVERIFIED** on primary) |
| P2IA evaluation | **No published impact evaluation found** for Lalilo, Adaptiv'Math or Mathia within P2IA. EvidenceB reports an Aug 2025 study on its Adaptiv'Fraction module reducing the girls-boys maths gap, **no effect size published on the page**. | EvidenceB, https://evidenceb.fr/ |
| **Mathia** (voice maths assistant, cycle 2) | Pupils practise orally; level of questions adapts to past answers. It is the only French state-procured *voice* pupil tool found. **No outcome evaluation found**; developer identity (Educlever / Mathia consortium) **UNVERIFIED**. Lesson for us: a voice tool was procured in 2020-23 and never evaluated publicly, so evaluation must be written into the contract. | ac-Grenoble P2IA doc, https://portail-ressources-education-dsden74.web.ac-grenoble.fr/sites/default/files/inline-images/oG9e226tV22CWJuRHQ5YR5lewe1NfAvzsj3kF0peK2s5QeKDic.pdf |

## B. Firms that could bid

### B1. The two names the user remembered (corrected)

**PyxiScience**: confidence high (identity confirmed on company register).

| Field | Facts | Source |
|---|---|---|
| Company | PYXISCIENCE SAS, SIREN 977 477 900, created **1 June 2023**, Villepinte (93); **1-2 salaried employees** (INSEE band, 2024) | https://recherche-entreprises.api.gouv.fr/search?q=pyxiscience |
| Founders | **Joachim Lebovits**, PhD maths (CentraleSupélec), associate professor Université Sorbonne Paris Nord, senior lecturer NYU Paris, ex-jury agrégation (CEO); **Jacques Lévy Véhel**, Polytechnique/Télécom Paris, ex-INRIA research director, founder of Case Law Analytics (CAIO) | https://www.pyxiscience.com/ |
| Funding | **€2.0M seed, May 2025**: Bpifrance, Invess Île-de-France, **Newfund**. CFNews headline: « PyxiScience étudie son lancement américain » (19 May 2025, paywalled) | https://funding.tech.eu/deals/C1392FD3-1DBE-49B9-B388-259BFD5B25AA ; https://www.cfnews.net/L-actualite/Capital-innovation/Operations/Amorcage/PyxiScience-etudie-son-lancement-americain-530015 |
| Product | Maths only, lycée + higher ed. AI grading of **handwritten** work with comments and error diagnosis; adaptive exercise generation on weak spots; "cognitive profile" analytics; LMS integration (Canvas, Moodle, Brightspace). **No voice, no orientation layer.** Institutional licence, price on request, free pilot. | https://www.pyxiscience.com/ |
| Users (self-reported) | 30,000+ active users, 300,000+ papers graded, 220,000+ exercises generated, 95% handwriting-recognition accuracy. Clients: USPN, NYU Paris, ESCP, MyPrepa, Lycée Français de New York. **No Éducation nationale contract.** | same |
| Evaluation | Vendor claim: 4,000+ students (1 university, 3 business schools, 2 engineering schools); share of A grades 13.8% without vs 63.4% with. **No design, control group or peer review published: treat as marketing, not evidence.** | same |
| Fit | Strong maths/assessment core (handwriting is rare and fits the "paper first" line); lacks voice, multi-subject coverage, collège content, orientation; 1-2 staff: cannot carry a national contract alone, plausible as a **consortium lot** (maths diagnosis). Hosting/RGPD not stated on site. | — |

**ExcellenceAI ("Excellence")**: confidence medium-high that this is the firm meant (site excellence-ai.com, French collège-to-prépa product); the user should confirm.

| Field | Facts | Source |
|---|---|---|
| Product | « L'IA entre en classe. Vous gardez le contrôle. » Teacher side: homework/test generation, scanning and question-by-question grading of handwritten copies under teacher review, course-to-quiz conversion, dashboard of stuck pupils. Pupil side: photo of handwritten homework for feedback, tutor giving **progressive hints, not answers**, revision flashcards/quizzes, holiday workbooks. Levels **6e to prépa**. **No voice or orientation features stated.** | https://excellence-ai.com/ |
| Funding, users, evaluation | **None published.** Co-founders other than the president: **UNVERIFIED**. | — |
| Hosting | App on **Render** (US), data on **MongoDB** and **AWS EMEA**: no French/sovereign hosting stated; would need migration (e.g. SecNumCloud) to bid. | mentions légales (above) |
| Fit | Product philosophy (hints not answers, paper kept, teacher in control) matches the guardrail design almost exactly; company is 6 months old, no track record: credible only as a sub-contractor or innovation-partnership laureate. | — |

**Five questions for the founders (both)**
1. What is your **measured learning gain on an exam taken without the tool**, versus a control group, and who ran the study? (Bastani's practice/exam gap is the test.)
2. How is the tool **model-agnostic**: which LLMs today, how long to swap to a newer model, and what share of your quality comes from your own layer vs the underlying model?
3. What do pupils **cannot** get from the tool (full solutions? essays?), how is that enforced, and what is your measured "answer-leak" rate?
4. Can you host in France under **SecNumCloud / RGPD for minors**, and at what cost per pupil per year at 1M and 5M pupils?
5. Would you bid on **voice and orientation** lots, alone or in consortium, and accept **payment partly tied to independent RCT results** and open APIs/data portability at contract end?

### B2. Other French/European candidates

| Firm | What it does | Status of facts |
|---|---|---|
| **EvidenceB** (Paris) | Adaptive modules (Adaptiv'Math, Adaptiv'Collège, Adaptiv'Langue, MIA Lycée), "AI Tutoring Platform" SaaS; clients incl. MENJ, CNED, Île-de-France/PACA/Nouvelle-Aquitaine regions, publishers (Bordas, Hatier, Nathan, Pearson), World Bank, NYC DoE. Incumbent on MIA. | https://evidenceb.fr/ |
| **Lalilo** | P2IA cycle 2 French laureate (reading, CP-CE2). Acquisition by Renaissance Learning (2022): **UNVERIFIED**. | ac-Lille, https://ticejoel.etab.ac-lille.fr/files/2021/10/PresentationProjetLaliloJDouanneSept21.pdf |
| **Nomad Education** | Revision app (fiches, annales, tests), orientation content, primaire to sup, *entreprise à mission*: closest existing French product to the **orientation + revision** layer. Users: **UNVERIFIED**. | https://www.nomadeducation.fr/ |
| Domoscio, Kartable, Schoolmouv | Adaptive learning (Domoscio), online courses/revision (Kartable, Schoolmouv). **All UNVERIFIED in this pass.** | — |
| **Mistral AI**: Voxtral | Speech-understanding models (15 July 2025), Apache 2.0, 24B and 3B ("Mini", edge) variants, French supported, API from **$0.001/min**. Open weights = can be self-hosted in France. | https://mistral.ai/news/voxtral |
| **Kyutai** (Paris lab; funders Iliad, CMA CGM, Schmidt Sciences) | **Moshi** (Sept 2024): speech-native, full-duplex dialogue, low latency; **Unmute**: gives any text LLM real-time voice (streaming STT+TTS); Pocket TTS (100M params, CPU, open, training code Aug 2026). Best fit for a sovereign, swappable voice layer. Non-profit status **UNVERIFIED**. | https://kyutai.org/ |
| Gladia (FR, speech-to-text API), ElevenLabs (voice synthesis/agents) | Commercial voice infrastructure. Details **UNVERIFIED** this pass. | — |

## C. Evidence on AI tutors

| Study | Setting, design | Result | Read-across |
|---|---|---|---|
| **Bastani et al. 2025**, *PNAS* 122(26) | Turkey, large high school, grades 9-11, ~1,000 pupils, ~50 classes, RCT; four 90-min maths sessions; arms GPT Base (plain GPT-4), GPT Tutor (teacher hints, no direct answers) | During practice: **+48%** (Base), **+127%** (Tutor). Exam without AI: Base **17% lower** than never-access controls; Tutor's guardrails "largely mitigate" the harm (no gain). | Guardrails are necessary but on their own do not yet produce exam gains. https://doi.org/10.1073/pnas.2422633122 (ledger) |
| **Kestin et al. 2025**, *Sci Rep* 15 | Harvard intro physics, 194 analysed students, randomised crossover: AI tutor at home vs in-class active learning | Gain **0.63 SD** (OLS; 0.73-1.3 SD by quantile regression); median gain more than double; median **49 min** vs 60 min in class. Caveats: one course, introductory content, expert-written prompts per question, ceiling effect, low-stakes tests. | The design (scaffolded, pre-written answers) is what works, not "a chatbot". https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/ |
| **De Simone et al. 2025**, World Bank PRWP 11125 | Nigeria, secondary, 6-week after-school programme 2024, pairs using GPT-4 (Copilot) with teacher-designed prompts, RCT | **+0.31 SD** final assessment (ITT); English +0.23 SD; authors equate it to 1.5-2 years of business-as-usual schooling; largest for girls and initially stronger pupils. | Supervised, structured, in-school use = positive. https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099548105192529324 (ledger) |
| **Henkel et al. 2024**, arXiv 2402.09809 | Ghana, ~1,000 pupils grades 3-9, 11 schools, school-level assignment; **Rori** maths tutor on **WhatsApp**, 2×30 min/week for 8 months | Effect size **0.37** (p<0.001), year 1 only; small number of clusters. | Low-bandwidth, phone-based, structured content works. https://arxiv.org/abs/2402.09809 |
| **Wang et al. 2024**, Tutor CoPilot, arXiv 2410.03017 | US, RCT, 900 human tutors, 1,800 K-12 pupils in under-served communities; AI suggests moves to the *tutor* | Topic mastery **+4 pp**; **+9 pp** for pupils of lower-rated tutors; **~$20 per tutor per year**; tutors gave fewer answers, more guiding questions. | Cheapest proven option: AI behind a human. https://arxiv.org/abs/2410.03017 |
| **Strömberg, Lei & Wu 2026**, CEPR DP21577 | China, one county, 26,811 pupils grades 7-12, staggered DiD, 30 months | Homework **+18%**; monthly closed-book exams **−20%**; Gaokao **−18%**, Zhongkao **−24%**; 81% of users consistent with homework outsourcing. | The home-use risk is exactly the voice-tutor-at-home use case. https://cepr.org/publications/dp21577 (ledger) |
| **Voice-based tutors** | **No RCT of an LLM voice tutor for school pupils found** in this pass. Mathia (P2IA) unevaluated. Pre-LLM speech reading tutors (e.g. Project LISTEN): **UNVERIFIED**. | Evidence gap: the voice mode should be piloted as an RCT, not generalised. |

**Synthesis.** Positive effects (0.3 to 0.6 SD) come from **structured, scaffolded, supervised** designs (Kestin, De Simone, Henkel); **unstructured access harms exam performance** (Bastani Base, Strömberg). The proposal's guardrails and supervised CDI use are on the right side of the evidence; the home voice tutor is on the risky side unless it refuses to give answers and is tested against an unassisted exam.

## D. International public models and procurement

| Country | Model | Facts | Source |
|---|---|---|---|
| **Estonia: AI Leap (TI-Hüpe)** | Foundation created 2025 on the President's initiative; **public-private, funding split equally** | 2025-26: **20,000 grade 10-11 pupils** (learning app) + **4,700 teachers**; 2026-27: +38,000 pupils, +2,000 teachers, extended to new grade 10 and vocational schools. Pupil app co-developed with **OpenAI** (ChatGPT-based) + Estonian researchers and the Institute of the Estonian Language; teachers get paid ChatGPT or Gemini. **Anthropic participation: UNVERIFIED** (not on the site). Procurement form not stated. | https://tihupe.ee/en |
| **South Korea: AI digital textbooks** | Ministry-certified AI textbooks, pilot rollout first semester 2025: grades 3-4 (English, maths), middle and high school (English, maths, computer science) | Dec 2024: National Assembly amended the Education Act to limit "textbooks" to books/e-books (vetoed by acting president). **4 Aug 2025**: revised bill passed; AI textbooks become "educational materials", adoption school-by-school; **~30% of schools** using them; state budget ≥**₩533.3bn (~$385M)** in 2024; publishers' investment ~₩800bn; publishers sued (admin suit Apr 2025; damages suit by ~10 publishers 23 June 2026). | Korea Herald, 2025, https://www.koreaherald.com/article/10546695 ; Asia Economy, 2026, https://view.asiae.co.kr/en/article/2026062517581498063 |
| **England: Oak National Academy** | Arm's-length public body; **Aila** = AI lesson assistant **for teachers**, built on Oak's curriculum content, free to teachers, beta | Not pupil-facing. Funding/model: **UNVERIFIED** on page. DfE "content store" (curriculum data for AI tools, ~£3M, 2024) and 2025-26 pupil AI-tutoring pilots: **UNVERIFIED** (could not reach gov.uk pages). | https://labs.thenational.academy/ |
| **Singapore: SLS** | MOE EdTech Masterplan 2030; AI must be "age- and developmentally appropriate", students keep chances to « struggle productively » | Specific SLS AI features (Adaptive Learning System for maths, feedback assistants): **UNVERIFIED** this pass. | https://www.moe.gov.sg/education-in-sg/educational-technology-journey/edtech-masterplan/artificial-intelligence-in-education |
| **US: Khanmigo** | Khan Academy tutor on GPT-4, launched 14 Mar 2023; free for teachers via Microsoft (Aug 2024) | Pilot: ~65,000 pupils, 53 districts (Fast Company, 2024). Per-pupil district price: **UNVERIFIED**. No published RCT on learning; WSJ test (Feb 2024) found arithmetic errors. | https://en.wikipedia.org/wiki/Khanmigo and sources therein |

**Lessons.** (1) Korea: a national, top-down, single-format AI product without prior evaluation was legally downgraded within one year, leaving ~70% of schools out. (2) Estonia: fast, cheap, frontier-level, but by leaning on a US vendor's product. (3) England keeps AI on the teacher side. (4) France's own MIA: a 2021 call for a tool delivered 2024 = the "years behind the frontier" risk is real.

### Procurement design to stay near the frontier (proposals, not observed practice)

| Lever | How | Legal hook / precedent |
|---|---|---|
| Split lots | Lot 1 pedagogy and guardrails (French firms); Lot 2 model access via a **gateway** (Albert/OpenGateLLM is already OpenAI-compatible, multi-model); Lot 3 voice (Voxtral/Kyutai, open weights, self-hostable); Lot 4 orientation data (ONISEP, Parcoursup). | Albert API (above) |
| Model-agnostic clause | Contractor must swap in a newer model within **≤3 months** of it beating the incumbent on a public French-curriculum benchmark run by the ministry. | Proposal |
| Short re-tender cycle | Model lot re-competed every **12-24 months**; pedagogy lot on a 3-4 year framework. MIA's 36+12+12 structure is the counter-example. | MIA contract (Next, 2024) |
| Innovation partnership | Already used for P2IA: R&D phase then purchase, several laureates in parallel, keep the best. | P2IA (ac-Paris) |
| Outcome-linked payment | Part of the price (e.g. 20-30%) paid on independent RCT results measured **without the tool** (DEPP evaluations). | Proposal; motivated by Bastani |
| Portability | Open APIs, pupil data export, reversibility at contract end; French/SecNumCloud hosting of minors' data. | Cadre d'usage; Albert hosting |

## E. Teaching AI as a subject

| Country / body | What | Source |
|---|---|---|
| **China** | MoE, May 2025: *Guidelines for AI General Education in Primary and Secondary Schools (2025)* (spiral curriculum: primary = interest and basic understanding; junior high = technical principles and basic applications; senior high = systems thinking and innovation) and *Guidelines for the Use of Generative AI* (primary pupils may not independently use open-ended generation tools; teachers may not let AI replace core teaching). Beijing: AI education in schools from fall 2025; "at least 8 hours/year" figure **UNVERIFIED**. | People's Daily via Henan gov., 13 May 2025, https://english.henan.gov.cn/2025/05-13/3157405.html ; Australian DoE brief, https://www.education.gov.au/download/19495/chinas-approach-ai-education-primary-and-secondary-schools/41945/document/pdf |
| **South Korea** | Computer science among AI-textbook subjects in middle/high school (2025). | Korea Herald (above) |
| **UAE** | AI curriculum from kindergarten announced for 2025-26: **UNVERIFIED** this pass. | — |
| **EC-OECD AI Literacy Framework** | Draft May 2025, final after 2,000+ responses; four domains: **Engage with AI, Create with AI, Manage AI, Shape AI**; aimed at all subjects, not technical model-building; feeds the **PISA 2029 Media & AI Literacy** assessment. | https://ailiteracyframework.org/ |
| **France** | Pix module (30-90 min, 4e/2de, 2025) and SNT hour (2027): both are **literacy** (uses, limits, ethics, sovereignty), not the mathematics of AI. | Section A |
| Royal Society, CNIL, Conseil supérieur des programmes | Positions on AI literacy vs technical teaching: **UNVERIFIED** (not retrieved this pass). | — |

**Read-across for the "AI as a subject is a false lead" argument.** No major framework found proposes teaching the mathematics of AI at collège: China's junior-high "technical principles" is the most technical, and even it pairs with strict use restrictions. The international consensus (EC-OECD, PISA 2029) is **literacy across subjects**, which supports the proposal's claim that the useful school-level content is *using and judging* AI, best learnt through a supervised tool in projects rather than a stand-alone course. Caveat: this is an inference from frameworks, not from evidence that literacy courses work; **no causal evaluation of AI-literacy courses was found**.

## Open checks (next pass, when search budget allows)
- Primary text of the cadre d'usage (education.gouv.fr) and Lecornu's 2027 announcement (levels).
- MIA impact results; P2IA cycle 2 evaluation (DNE/DEPP); Mathia developer.
- DfE pupil AI-tutoring pilots 2025-26 and content store; Khanmigo district price; Singapore SLS features; UAE curriculum.
- Royal Society / CNIL / CSP positions; any RCT of a voice tutor.
- ExcellenceAI co-founders and funding; PyxiScience hosting and secondary-school footprint in France.
{% endraw %}
