---
layout: recherche
title: "21 · Codifiabilité : données publiques et plan d'intégration (Boussole, indice de risque)"
slug: 21-codifiabilite-donnees
sujets: []
---
{% raw %}

Note de travail, 19 novembre 2026. Complète `2026-11-19-revue-codifiabilite.md` (même dossier) et `research/19-mesure-risque-filieres-techniques/2026-11-19-mesure-risque.md`.
Conventions : **[V]** lu sur la source primaire ou dans le fichier pendant cette session ; **[V-19]** vérifié dans la note 19 (non relu ici) ; **[résumé]** page d'accueil, README ou résumé seulement ; **À VÉRIFIER** non confirmé. Prototype de calcul : scripts dans le bloc-notes de session, non versionnés (voir § 3.4).

---

## 1. Inventaire

Chaîne de passage commune : **O*NET-SOC → ESCO → ROME → spécialité** (déjà dans le dépôt, voir § 2). Chaque profession ESCO porte exactement un code ISCO-08 (FAQ ESCO, [résumé]), donc tout indice ISCO (OIT) peut entrer par ESCO.

| Source | Ce qu'elle mesure | Unité | Couverture | Licence | Où la trouver | Passage vers les métiers français | Dans le dépôt ? |
|---|---|---|---|---|---|---|---|
| **O*NET 31.0, Work Activities** | 41 activités (importance IM, niveau LV) : *Analyzing Data or Information*, *Thinking Creatively*, *Making Decisions and Solving Problems*, *Documenting/Recording Information*, *Processing Information*, *Controlling Machines and Processes*… | Métier | Idem | CC BY 4.0 [résumé] | Idem | Idem | **Oui** (même archive) [V] ; déjà utilisé pour la transférabilité (note 19, composante 5a) |
| **O*NET task statements et Task Ratings** | Énoncés de tâches (18 838 lignes, dont 14 071 « Core » et 4 349 « Supplemental ») avec importance, fréquence et pertinence | Tâche × métier | Idem | CC BY 4.0 [résumé] | Idem | Idem | **Oui** (`Task Statements.xlsx`, `Task Ratings.xlsx`) [V] |
| **ROME 4.0, contextes de travail** | 194 contextes binaires par fiche, dont « Travail répétitif ou cadence imposée », « Polyactivité », « Travail en mode projet », « Travail en autonomie et en situation isolée », « Possibilité de télétravail » [V, fichier] | Fiche ROME | 1 727 fiches (note 19) | Licence ouverte Etalab (open data France Travail) [résumé] | https://www.francetravail.org/opendata/repertoire-operationnel-des-meti.html | Natif | **Oui**, `rome_csv.zip` (v462, `unix_referentiel_contexte_travail`, `unix_coherence_item`) [V] ; non utilisé |
| **ESCO** (Commission européenne) | Professions et compétences (savoirs, aptitudes), compétences « essentielles » et « optionnelles » par profession | Profession ESCO (niveau 5 et plus de l'ISCO-08) | UE, 28 langues | Réutilisation libre (décision de la Commission de 2011), mention de la source exigée [résumé] | https://esco.ec.europa.eu/en/use-esco/download | Clé de voûte : ESCO ↔ ROME (France Travail), ESCO ↔ O*NET (2022), ESCO → ISCO-08 | **Partiel** : tables de passage (`EURESmapping_occs_FR_2025-12.csv`, `ESCO_ONET_updated.csv`) [V] ; pas la base ESCO complète |
| **Hosseini et Lichtinger (2026), GenAI_Expertise** | Par tâche (`Final_Task_Dataset.xlsx`, 19 265 tâches O*NET) : automatisation notée T0 à T4 par GPT-5.2, `auto_hl_bi` = 1 si T3 ou T4 (plus de 80 %) ; expertise notée 1 à 5 et convertie en mois de formation, **sans et avec assistant IA**. Par métier (`Final_Occupation_Dataset.xlsx`) : `avg_auto_hl_bi`, mois de formation `avg_mmwo_*`, `ps_without`, `ps_with`, `pss`, `expertise_percentile`, `ai_exposure_share` [V, agent de recherche] | Tâche et O*NET-SOC (920 métiers × 25 colonnes) [V] | États-Unis, OEWS mai 2024 | **Aucune licence** sur le dépôt (API GitHub : `license: null`), donc tous droits réservés par défaut ; le README demande seulement de citer [V]. **À régler avant publication de la Boussole** (demander l'autorisation aux auteurs) | https://github.com/s-mahdihosseini/GenAI_Expertise | Même chaîne qu'O*NET | **Métiers : oui**, `data/raw/hosseini-lichtinger-occupations.xlsx`, identique au fichier du dépôt [V] ; seule `avg_auto_hl_bi` est utilisée (`site/build_data.py`, `scripts/build_risque_filieres.py`). La colonne `auto_hl_bi` vaut 0 partout : inutilisable. **Tâches : non** |
| **Anthropic Economic Index** | Part automatisation / augmentation par tâche O*NET (2025) ; « observed exposure » par SOC (mars 2026) ; pénétration par tâche ; robots (sept. 2026) | Tâche, SOC | Usage de Claude | Données CC BY [V-19] | https://huggingface.co/datasets/Anthropic/EconomicIndex | O*NET-SOC → SOC 6 | **Oui**, `data/raw-new/anthropic-economic-index/` (dont `task_penetration.csv`, 17 998 tâches, et `automation_vs_augmentation_by_task.csv`, 3 364 tâches) [V] |
| **Microsoft, « Working with AI »** (Tomlinson et al.) | Score d'applicabilité de l'IA par métier, activités IWA dans les conversations Copilot | SOC, IWA | États-Unis | CC BY 4.0 (`LICENSE.txt`) [V] | https://github.com/microsoft/working-with-ai (`ai_applicability_scores.csv`, `iwa_metrics.csv`, `soc_iwa_weights.csv`, `physical_tasks.csv`…) [V] | SOC | Non |
| **Felten, Raj et Seamans, AIOE** (*SMJ* 42(12), 2021) | Exposition des 52 aptitudes O*NET à 10 applications de l'IA, agrégée par métier ; variantes « language modeling » et « image generation » | SOC 6 chiffres | États-Unis | Pas de licence déclarée sur GitHub (API : aucune) [V] ; citer l'article | https://github.com/AIOE-Data/AIOE (`AIOE_DataAppendix.xlsx`, `Language Modeling AIOE and AIIE.xlsx`) [V] | SOC | Non |
| **Eloundou, Manning, Mishkin et Rock** (*Science*, 2024) | Exposition E0/E1/E2 des tâches et DWA, notée par des annotateurs et par GPT-4 ; `_alpha` = E1, `_beta` = E1 + 0,5 E2, `_gamma` = E1 + E2 (README) [V] | Tâche, métier | États-Unis | MIT [V] | https://github.com/openai/GPTs-are-GPTs (`data/occ_level.csv`, `full_labelset.tsv`, `occupations_onet_work_contexts.csv`…) [V] | O*NET-SOC | Non (sa β entre dans l'« observed exposure » d'Anthropic, note 19) |
| **OIT, WP 140** (Gmyrek et al., 20 mai 2025) | Exposition à l'IA générative de près de 30 000 tâches de l'ISCO-08, gradients 1 à 4 ; 3,3 % de l'emploi mondial dans le gradient le plus élevé ; 34 % de l'emploi exposé dans les pays à haut revenu contre 11 % dans les pays à bas revenu [résumé] | ISCO-08 (scores en annexe du PDF, par code à 4 chiffres, À VÉRIFIER) | Monde | Publication OIT ; **aucun fichier de données** sur la page [V] | https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure ; PDF https://www.ilo.org/sites/default/files/2025-05/WP140_web.pdf | ISCO-08 → ESCO → ROME (direct) | Non |
| **Bergeaud** (HEC, janv. 2024) | GPT-4 note de 0 à 1 la « substituabilité » de 16 937 tâches O*NET 28.1 (873 métiers), p. 4 ; indice agrégé en 222 FAP ; passage SOC → ISCO (BLS) → PCS (Hensvik et al., 2020), p. 6 [V]. Le prompt donne un score élevé aux tâches physiques répétitives (p. 5) [V] | FAP 2009 (222 postes) | France | Note publique ; fichier de scores non trouvé | https://www.hec.edu/sites/default/files/documents/Exposition%20%C3%A0%20l%E2%80%99intelligence%20artificielle%20g%C3%A9n%C3%A9rative%20et%20emploi_A%20Bergeaud.pdf | FAP natif ; utilisé par la Banque de France (Bloc-notes 463) sur le ROME | Non. **Attention** : le README du dépôt parle de « 16 740 compétences France Travail » ; la note de 2024 lue ici porte sur 16 937 **tâches O*NET**. À clarifier |
| **Webb** (2020) | Recoupement des brevets (IA, logiciels, robots) avec les tâches O*NET | Métier (occ1990dd) | États-Unis | Fichier de scores introuvable [V-19] | https://www.michaelwebb.co/webb_ai.pdf | SOC → ISCO | Non |
| **PIAAC, cycle 2** (OCDE) | Compétences des adultes (2023) et usage des compétences au travail (questionnaire de fond : lecture, calcul, TIC, résolution de problèmes, autonomie, apprentissage au travail) | Individu (métier ISCO à 2 ou 4 chiffres selon le fichier) | 31 pays dont la France | Fichiers publics (PUF) téléchargeables depuis déc. 2024 ; fichiers restreints par exécution de code à distance [résumé] | https://www.oecd.org/en/about/programmes/piaac/piaac-data.html | ISCO direct | Non. Variables de tâches dans les PUF : **À VÉRIFIER** |
| **Dares-Insee, Conditions de travail** (2019 ; édition 2024 « Conditions de travail et risques psychosociaux », collecte juillet 2024 à avril 2025) | Travail répétitif, cadences, autonomie (procédures, consignes), contrôle, coopération ; environ 34 500 ménages en 2019 | Individu, PCS (FAP via PCS) | France | Microdonnées : CASD (détaillé) et Adisp/Progedo (version moins détaillée) [résumé] ; tableaux agrégés publics | https://www.insee.fr/fr/information/7625812 ; https://casd.eu/en/source/labour-conditions-employees-section | PCS → FAP (table Dares) → ROME | Non. Résultats 2024 : seulement une dépêche AFP lue (contraintes physiques 61 % des employés peu qualifiés, +7 points depuis 2016) [résumé, à confirmer à la Dares] |
| **Eurofound, EWCS 2024** | Conditions de travail, dont tâches répétitives, autonomie, complexité ; environ 36 600 actifs, 35 pays, terrain févr.-nov. 2024 [résumé] | Individu, ISCO | Europe | UK Data Service (inscription) ; date de mise à disposition annoncée fin 2025 puis mi-février 2026 selon les versions de la page [résumé] | https://www.eurofound.europa.eu/en/surveys-and-data/surveys/european-working-conditions-survey/ewcs-2024 | ISCO | Non. Utile pour vérifier que les items O*NET valent en France |
| **Indeed Hiring Lab** | Indice des offres d'emploi (base 1er févr. 2020 = 100), quotidien, par pays, secteur et région ; France incluse (`FR/aggregate_job_postings_FR.csv`, `job_postings_by_sector_FR.csv`, `regional_fr.csv`) [V] | Secteur Indeed (intitulés normalisés) | Depuis 2020 | CC BY 4.0 [V] | https://github.com/hiring-lab/job_postings_tracker | Secteurs Indeed → familles à la main | Non |
| **France Travail, offres d'emploi** | Offres par code ROME (API « Offres d'emploi » ; statistiques du marché du travail par métier) | Offre, ROME | France | API sur inscription (francetravail.io) ; conditions À VÉRIFIER | https://francetravail.io | ROME natif | Non |
| **Lightcast** (ex-Burning Glass) | Offres en ligne codées en compétences | Offre, SOC/ISCO | Monde | **Payant** | https://lightcast.io | SOC, ISCO | Non |
| **Dares, FAP 2021 ; tensions 2024 ; BMO ; *Métiers 2030*** | Demande de travail en France | FAP | France | Ouvert | Voir note 19, § 4.1 | Natif | **Oui** (`data/raw-new/dares-fap2021/`, `dares-tensions-2024/`, `bmo/`, `metiers-2030/`) [V] |

**Passages encore manquants** (note 19, § 4.2) : SOC → ISCO-08 (table du BLS, https://www.bls.gov/soc/soccrosswalks.htm, refusée au bac à sable) ; PCS 2020 → ISCO-08 (À VÉRIFIER : table Insee ou Hensvik et al., 2020, comme Bergeaud). Ils ne sont nécessaires que pour les sources ISCO (OIT, PIAAC, EWCS) ; ESCO suffit pour l'OIT.

---

## 2. Ce que le dépôt sait déjà faire

- Le script `scripts/build_risque_filieres.py` lit déjà O*NET 31.0 (activités, aptitudes, connaissances) pour la transférabilité : **ajouter des items Work Context ne demande aucun nouveau passage**.

---

## 3. Plan d'intégration

### 3.1 La composante proposée : « codifiabilité de l'information »

**Recommandation : ne pas reprendre telle quelle la mesure classique du travail routinier.** Le prototype (§ 3.4) montre que l'indice « routine cognitive » d'Acemoglu et Autor (2011), refait sur O*NET 31.0, ne corrèle pas avec l'exposition à l'IA générative (Spearman 0,04 avec `avg_auto_hl_bi`, −0,12 avec l'« observed exposure »). Il classe en tête des métiers manuels (croupiers, opérateurs de presse, couvreurs), que l'IA générative ne touche pas. Les métiers de bureau très codifiables (service client, comptabilité, saisie) sont, eux, très exposés. La codifiabilité ne prédit l'exposition à l'IA générative **que pour le travail sur de l'information**.

Composante en deux étages, calculée par métier O*NET-SOC puis passée aux spécialités par la chaîne existante :

| Étage | Items | Signe | Rôle |
|---|---|---|---|
| (a) Codifiabilité (quatre items Work Context, échelle CX) | 4.C.3.b.7 *Importance of Repeating Same Tasks* ; 4.C.3.b.4 *Importance of Being Exact or Accurate* ; 4.C.3.b.8 *Determine Tasks, Priorities and Goals* ; 4.C.3.a.4 *Freedom to Make Decisions* | +, +, −, − | Les trois premiers sont l'indice « routine cognitive » d'Acemoglu et Autor (2011, NBER w16082, annexe p. 93) [V] ; la liberté de décision ajoute le jugement (Garicano, Deming) |
| (b) Part de travail sur l'information | Work Activities (IM) *Processing Information* (4.A.2.a.2) et *Documenting/Recording Information* (4.A.3.b.6), moins Work Context *Spend Time Using Your Hands…* (4.C.2.d.1.g) | +, +, − | Filtre : la codifiabilité ne compte que là où le travail porte sur des symboles |
| Indice | z(a) + z(b), ou (a) × 1[(b) au-dessus de la médiane] | | Score 0-1 par rang centile, comme les autres composantes |

**Variante disponible tout de suite, à la tâche (Hosseini et Lichtinger)** : le fichier de tâches donne pour chaque tâche l'expertise requise sans IA et avec un assistant IA. La baisse d'expertise d'une tâche quand l'IA aide (marge « intensive » des auteurs) mesure ce que l'IA rend explicite : un savoir qui demandait des mois d'apprentissage devient accessible avec l'outil. Agrégée par métier (poids 1 pour les tâches « Core », 0,5 pour les autres, comme les auteurs), elle donne une « codifiabilité révélée par l'IA », à tester contre l'étage (a). Limite : notation par un seul modèle (GPT-5.2), licence à obtenir.

**Variante plus fine (v2), à la tâche** : faire noter par un LLM, pour chacune des 18 838 tâches O*NET, (i) si le résultat est vérifiable par une règle ou un exemple (critère d'Acemoglu, 2024, « tâches faciles à apprendre »), (ii) si la tâche est séparable des autres tâches du métier (faisceau faible ou fort, Garicano). Coût : environ 19 000 appels courts ; à faire comme Hosseini et Lichtinger (deux modèles, désaccords signalés). Avantage : la mesure vise directement ce que l'IA générative change ; limite : notation par un modèle, à valider (§ 3.3).

### 3.2 Combinaison avec la composante « IA qui remplace », sans double compte

- **Constat du prototype** : sur 865 métiers, une fois la capacité de Hosseini et Lichtinger connue, la codifiabilité n'ajoute presque rien pour prédire l'usage observé (coefficient standardisé −0,14 pour (a), −0,03 pour (a)+(b) ; capacité 0,65). Dans les métiers de bureau, (a) corrèle à 0,27 avec la capacité. Ajouter la codifiabilité au même rang que l'exposition **compterait deux fois la même chose**.
- **Proposition** : la codifiabilité n'entre pas comme sixième composante additive. Elle sert de **modulateur de la composante 1** : à exposition égale, un métier codifiable et peu discrétionnaire est plus du côté « automatisation » ; un métier exposé mais discrétionnaire, plus du côté « augmentation ». Formule simple : composante 1 = rang(observed exposure) × (0,75 + 0,5 × rang(codifiabilité)), bornée à 0-1. Le poids total de la technologie (50 %) ne change pas.
- **Garde-fou** : publier la corrélation de rang entre la composante 1 avec et sans modulateur (comme la note 19 le fait pour la v0). Si elle dépasse 0,95, le modulateur ne sert à rien et on l'abandonne.

### 3.3 Validation (avant toute publication)

| Test | Données | Critère |
|---|---|---|
| États-Unis : la codifiabilité prédit-elle la baisse de l'emploi des 22-25 ans depuis fin 2022, **à exposition égale** ? | CPS (IPUMS, libre), emploi par métier et âge, 2019-2022 contre 2024-2026 ; contrôle par `avg_auto_hl_bi` et l'« observed exposure » | Coefficient de la codifiabilité négatif et significatif ; sinon, pas de modulateur |
| France : même question sur les embauches | Les données DSN de la Banque de France (Bloc-notes 463) ne sont pas publiques ; à défaut, InserJeunes et InserSup (emploi à 6, 12 et 30 mois par spécialité, promotions avant et après 2022), offres France Travail par ROME | Les spécialités codifiables et exposées perdent-elles plus en taux d'emploi que les spécialités exposées mais discrétionnaires ? |
| Cohérence française des items O*NET | Dares *Conditions de travail* 2019 (travail répétitif, autonomie par PCS) ou EWCS 2024 | Corrélation de rang positive entre (a) et la part de salariés français déclarant un travail répétitif et peu autonome, dans les métiers de bureau |
| Contre-exemple manuel | Couvreurs, croupiers, opérateurs de presse | Ces métiers ne doivent pas monter dans la composante IA (vérifie que l'étage (b) filtre bien) |

## 4. Le portefeuille, expliqué à un élève de 16 ans et à ses parents

**À l'élève.** Personne ne sait quels métiers l'IA va changer d'ici à tes 30 ans. Les tâches les plus menacées sont celles qu'on peut écrire comme une recette : suivre toujours la même procédure, remplir les mêmes cases, vérifier les mêmes chiffres. Ce qui résiste, c'est ce qui ne s'écrit pas : décider quand la situation est floue, s'occuper de quelqu'un, réparer ce qui ne marche pas, mener une équipe. Choisis une formation qui t'apprend un vrai métier, et qui te laisse une porte ouverte vers un métier voisin ou vers une poursuite d'études si le tien change.

**Aux parents.** Pour l'épargne, on ne met pas tout sur une seule action. Pour l'orientation, c'est pareil. Une bonne formation n'est pas celle qui gagne le plus si tout se passe comme prévu, mais celle qui ne laisse pas votre enfant sans solution si l'avenir prend un autre chemin. Trois appuis : un socle solide (lire, compter, travailler avec les autres), un savoir-faire qui demande du jugement, et la possibilité de rebondir.

---

## 5. Statut de l'exemple KPMG

Voir la revue, § 0 : c'est une **déclaration d'entreprise rapportée par un média**, pas une preuve d'effet sur l'emploi. Elle illustre une capacité annoncée, pas une baisse d'embauches mesurée.
{% endraw %}
