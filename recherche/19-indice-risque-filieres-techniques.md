---
layout: recherche
title: "19 · Du risque d'exposition au risque tout court : une mesure pour les filières techniques (CAP, bac pro, BTS, BUT)"
slug: 19-indice-risque-filieres-techniques
sujets: []
---
{% raw %}

Conventions : **[V]** = lu sur la source primaire pendant cette session ; **[S]** = source secondaire ; **À VÉRIFIER** = non confirmé. Aucun chiffre inventé.
Script : `scripts/build_risque_filieres.py`. Sorties : `data/derived/risque-filieres-v0/`. Données téléchargées : `data/raw-new/`.

---

## 0. En bref

- **L'exposition ne dit pas le risque.** L'indice utilisé jusqu'ici (Hosseini et Lichtinger, 2026, `avg_auto_hl_bi`) mesure la part des tâches qu'une IA sait faire. Il ne dit ni si l'IA remplace ou aide, ni si les robots arrivent, ni si les employeurs recrutent, ni si l'on peut changer de métier.
- **Proposition : un indice de risque à cinq composantes** : (1) IA qui *remplace* (et pas seulement qui aide), (2) robots, (3) demande de travail, (4) concurrence chinoise, (5) transférabilité des savoir-faire. Chacune sur 0 à 1 (1 = plus de risque), poids de base 30/20/25/10/15, plus quatre jeux de poids « scénarios » pour une lecture « portefeuille » (le rang dans le pire scénario).
- **Une v0 est calculée** pour 468 spécialités (200 CAP, 138 bac pro, 130 BTS), avec les cinq composantes renseignées partout. Elle ne corrèle qu'à 0,37 (rang, Spearman) avec l'exposition seule.
- **Résultats principaux.** Le bureau reste le plus risqué (accueil, commerce, gestion), mais deux familles changent de place : **les industries graphiques et l'industrie mécanique de série montent** (robots, demande en baisse, Chine) ; **les métiers d'études du bâtiment et les services à la personne descendent** (IA peu utilisée en pratique, demande solide). Le bâtiment de gros œuvre monte aussi, mais à cause de la composante robots et d'une demande mesurée sur données américaines : **résultat non fiable tant que les tensions de recrutement françaises n'y sont pas** (section 5).
- **v1 (même jour, section 5 bis)** : la demande intègre les tensions Dares 2024, la BMO 2025-2026 et la table ROME → FAP 2021. Corrélation avec l'exposition 0,45 ; 18 spécialités robustes à faible risque (16,1 % des élèves), 9 robustes à risque élevé (10,0 %). Le bâtiment de gros œuvre repasse sous la médiane ; le couvreur reste parmi les plus sûrs.
- **Ce qui manque encore** : *Métiers 2030* ; le classeur complet des tensions (valeur par métier pour 166 FAP qui n'ont que celle de leur domaine) ; les métiers réellement occupés par les sortants ; le BUT.

---

## 1. Pourquoi changer de mesure

Un indice d'exposition compte des tâches. Il additionne des cas très différents :

| Cas | Exposé ? | Risque pour l'emploi ? | Exemple |
|---|---|---|---|
| L'IA fait la tâche à la place du salarié (automatisation) | Oui | Oui, si la demande ne suit pas | Accueil téléphonique, saisie |
| L'IA aide le salarié à faire plus ou mieux (augmentation) | Oui | Faible, parfois positif | Développeurs dans les années 1980 face à l'ordinateur |
| Un robot fait la tâche physique | Non (indice IA) | Oui, si le coût baisse | Emballage, conduite |
| La production part à l'étranger | Non | Oui | Textile, mécanique de série |
| Le métier disparaît mais les savoir-faire servent ailleurs | — | Faible pour la personne | Mécanicien → maintenance industrielle |

L'idée « portefeuille » : on ne sait pas quel avenir viendra (IA rapide, robots rapides, démondialisation, statu quo). Une bonne formation n'est pas celle qui gagne dans un scénario, mais celle qui ne perd gros dans **aucun**. D'où le rang dans le pire des cinq scénarios, à côté du score de base.

---

## 2. Revue ciblée : les briques d'une mesure de risque

### 2.1 Automatisation contre augmentation

Statut des faits : [V] lu sur la source primaire par l'agent de recherche ou par moi ; [V*] page primaire lue à travers un résumé automatique, à relire avant citation.

| Étude | Où | Résultat | Entrée dans l'indice |
|---|---|---|---|
| Brynjolfsson, Chandar et Chen, « Canaries in the Coal Mine? », version d'**août 2026** (paie ADP jusqu'à juin 2026), https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf | Résumé p. 1 ; fig. 5 p. 18 ; tableau 3 p. 20 ; définitions note 40 p. 51 [V] | Les 22-25 ans des métiers exposés sont **19 % sous la tendance** (et non 13 % comme dans `research/06`, chiffre d'une version antérieure). La baisse se concentre là où l'usage observé de l'IA **automatise** ; rien dans le quintile le plus « complémentaire ». Coefficient de la part d'automatisation pour les 22-25 ans : −0,098 par écart-type (données Anthropic de mars 2025), −0,084 (sept. 2025-avr. 2026) ; il s'efface avec l'âge | Pénaliser l'automatisation, pas l'usage total ; peser davantage pour des formations d'entrée dans la vie active |
| Anthropic Economic Index, https://huggingface.co/datasets/Anthropic/EconomicIndex | README des versions [V] | Parts par tâche O*NET : « directive » et « feedback loop » = automatisation ; « task iteration », « validation », « learning » = augmentation (Handa et al., 2025). Fichiers : `release_2025_03_27/automation_vs_augmentation_by_task.csv` ; version du 26 juin 2026 aux niveaux tâche, DWA, IWA, GWA et SOC | Variante de la composante 1 (v1) |
| Massenkoff et McCrory, « Labor market impacts of AI », Anthropic, 5 mars 2026, https://www.anthropic.com/research/labor-market-impacts | Sections « Measuring exposure », « Initial results », fig. 7 [V*] | « Observed exposure » : tâches faisables (Eloundou β) et réellement faites avec Claude, automatisation pondérée 1, augmentation 0,5, moyenne pondérée par le temps. Pas de hausse du chômage des plus exposés depuis fin 2022 ; entrées dans les métiers les plus exposés des 22-25 ans environ −14 % par rapport à 2022, « à peine » significatif | **Composante 1 de la v0** |
| Tomlinson, Jaffe, Wang, Counts et Suri, « Working with AI », arXiv 2507.07935, v7 (23 oct. 2026) | Éq. (1) p. 5, §4.2 [V] ; données https://github.com/microsoft/working-with-ai (`ai_applicability_scores.csv`, par SOC, CC BY 4.0) [V*] | Score d'applicabilité : activités (IWA) observées dans les conversations Copilot, pondérées par le taux de réussite, la portée et l'importance O*NET ; calculé côté « objectif de l'utilisateur » et côté « action de l'IA ». Corrélation avec Eloundou 0,73 ; avec le salaire 0,13 | Contrôle de robustesse de la composante 1 (action de l'IA ≈ automatisation) |
| Hampole, Papanikolaou, Schmidt et Seegmiller, NBER w33509, rév. sept. 2025, https://www.nber.org/papers/w33509 | p. 4 imprimée (p. 6 du PDF) [V] | +1 écart-type d'exposition moyenne des tâches : −14,5 % de part d'emploi dans l'entreprise en 5 ans ; +1 écart-type de **concentration** de l'exposition sur quelques tâches : +7,5 %. Les 10 % de métiers les plus exposés perdent environ 3,1 % dans l'entreprise, compensés par la croissance des entreprises | Une exposition concentrée sur peu de tâches réduit le risque : argument pour ne pas utiliser l'exposition moyenne seule |
| Eckhardt et Goldschlag, « AI and Jobs: The Final Word (Until the Next One) », EIG, août 2025, https://eig.org/wp-content/uploads/2025/08/EIG-AI-and-Jobs.pdf | p. 3 et p. 9 [V] | Chômage 2022 à début 2025 : +0,30 point dans le quintile le plus exposé, +0,94 point dans le moins exposé ; cinq mesures d'exposition testées | L'exposition brute ne prédit pas le chômage |

### 2.2 Robots et automatisation physique

| Étude | Où | Résultat | Entrée dans l'indice |
|---|---|---|---|
| Legate-Yang et Massenkoff, « What work can robots do? », Anthropic, 30 sept. 2026, https://www.anthropic.com/research/what-work-can-robots-do ; données `robot_exposure/` (CC BY 4.0) | README des données [V] ; page [V*] | 7 594 tâches physiques O*NET notées par Claude Opus 5 selon l'environnement où un robot démontré sait les faire (E1 cellule dédiée, E2 lieu de travail structuré, E3 lieu non structuré) ; indice 0-3 par métier, pondéré par le temps (923 métiers). Les robots sauraient faire 74 % des tâches physiques (34 % des heures) dans certaines conditions, mais ne sont compétitifs en coût que pour **0,3 % des tâches** ; environ 40 ans pour atteindre 10 % au rythme historique de baisse des prix (−3 % par an). Taxis : 2,2, le plus élevé. Étude d'entreprise, non évaluée par les pairs | **Composante 2 de la v0** |
| Webb, « The Impact of Artificial Intelligence on the Labor Market », janv. 2020, https://www.michaelwebb.co/webb_ai.pdf | p. 4 ; note sur les données p. 53 [V] | Exposition aux robots maximale pour les non-diplômés du secondaire, les métiers à bas salaire et les hommes de moins de 30 ans. Du 25e au 75e centile d'exposition aux robots : −9 à −18 % de part d'emploi et −8 à −14 % de salaire, 1980-2010 | Variante de la composante 2 ; **fichier des scores introuvable** sur le site actuel |
| Acemoglu et Restrepo, « Robots and Jobs », *JPE* 128(6), 2020 | Résumé p. 1 ; métiers p. 46 du PDF [V] | Un robot de plus pour 1 000 salariés : −0,2 point de taux d'emploi et −0,42 % de salaire (environ 3,3 emplois par robot) ; pertes concentrées sur les ouvriers de production routiniers (usineurs, monteurs, manutentionnaires) | Justifie la composante 2 pour les spécialités de production |
| Aghion, Antonin, Bunel et Jaravel, « Modern Manufacturing Capital, Labor Demand and Product Market Dynamics: Evidence from France », Insee DT 2023-12, https://www.insee.fr/en/statistiques/7613955 | pp. 3-4 imprimées [V] | En France, l'automatisation **augmente** l'emploi de l'entreprise (élasticité 0,37) et de l'industrie (0,93), y compris pour les ouvriers non qualifiés, sans effet sur les salaires ; le gain d'emploi dans l'industrie n'apparaît que dans les secteurs exposés à la concurrence des importations | Le robot n'est pas forcément un risque en France : raison de ne pas donner plus de 20 % aux robots, et de croiser avec la composante Chine |
| Acemoglu, Lelarge et Restrepo, « Competing with Robots », *AEA P&P* 2020 (NBER w26738) | pp. 3, 5-6, 8 [V] | Entreprises françaises qui adoptent des robots : valeur ajoutée +20 %, part des ouvriers de production −1,6 point ; +10 points d'adoption chez les concurrents : −2,5 % d'emploi ; +20 points d'adoption dans l'industrie : −3,2 % d'emploi industriel | Le risque est pour les entreprises qui n'automatisent pas |
| IFR, *World Robotics 2025* | Communiqué 8 avr. 2026 [V*] ; avant-propos p. 4 [V] | Allemagne 449 robots pour 10 000 salariés de l'industrie, UE 231 ; installations en France −23,8 % en 2024. Densité française 2024 non trouvée dans la source primaire | Contexte seulement |

### 2.3 Demande de travail en France, robuste aux scénarios

| Source | Où | Contenu | Entrée dans l'indice |
|---|---|---|---|
| Dares, « Les tensions sur le marché du travail en 2024 », Dares Résultats, févr. 2026, https://dares.travail-emploi.gouv.fr/publication/les-tensions-sur-le-marche-du-travail-en-2024 | Site bloqué ; méthode lue dans une déclinaison DREETS Nouvelle-Aquitaine (mars 2026, encadré de dernière page, en-tête de tableau p. 5) [V] | Indicateur synthétique à **trois dimensions** : difficultés de recrutement anticipées par les employeurs, offres rapportées aux demandeurs d'emploi, facilité des demandeurs à trouver un emploi ; **sept indicateurs complémentaires** : intensité d'embauches, lien formation-emploi, manque de main-d'œuvre disponible, non-durabilité de l'emploi, conditions de travail contraignantes, inadéquation géographique, non-attractivité salariale. Unité : FAP 2021 (228 postes) | Composante 3, v1 |
| France Travail, BMO 2026 (21 avr. 2026), https://www.francetravail.fr/candidat/decouvrir-le-marche-du-travail/besoins-en-main-doeuvre.html | [V*] | 2,28 millions de projets de recrutement, 43,8 % jugés difficiles (50,1 % en 2025) ; enquête auprès de 416 588 établissements. Parts les plus fortes : conducteurs d'équipements d'usinage 80,6 %, **couvreurs 79,7 %**, médecins 78,8 %, chaudronniers et tôliers 77,7 % | Composante 3, v1 ; fichier local par bassin |
| Dares, nomenclature FAP 2021, API ouverte https://data.dares.travail-emploi.gouv.fr/api/explore/v2.1/catalog/datasets/dares_nomenclature_fap2021/exports/csv | [V] (téléchargée) | 341 lignes (FAP 22, 86, 228, 341), **sans colonne ROME ni PCS**. La table FAP / PCS / ROME est dans `Dares_Nomenclature_FAP2021_descriptif.pdf` sur le site de la Dares (bloqué) | Passage ROME → FAP manquant |
| France Stratégie et Dares, *Les métiers en 2030*, 10 mars 2022, https://www.strategie-plan.gouv.fr/publications/metiers-2030 | [V*] | Environ 800 000 postes à pourvoir par an ; environ 1 million de créations nettes 2019-2030. Classeur `fs-2022-pmq-cahier_de_graphiques-mars_0.xlsx` non téléchargé (contenu par FAP À VÉRIFIER). *Métiers 2035* : aucune publication trouvée | Composante 3, v1 (déséquilibre potentiel) |
| GIFEN, programme MATCH (via France Travail, 4 févr. 2025) | [V*] | 100 000 recrutements d'ici 2033 dans le nucléaire (environ 10 000 ETP par an) ; 84 métiers clés dont 20 en tension (câbleur, chaudronnier, ferrailleur, électricien, coffreur-brancheur) | Demande sectorielle : bonus « besoins nationaux » à discuter, pas dans la v0 |
| Observatoire de la Métallurgie / OPCO 2i, « Prospective des besoins en recrutement à 2030 et 2035 », juin 2024 | p. 269 [V] | 170 000 à 236 000 recrutements par an en 2025-2035 dans la métallurgie, dont environ 40 000 par an pour remplacer les départs en retraite ; famille « Produire-Réaliser » 75 000 à 100 000 par an ; aéronautique, naval et électrique-électronique en croissance dans tous les scénarios | Montre que la demande industrielle française peut contredire la composante Chine et les projections américaines |
| Défense (BITD), France 2030, rénovation | — | Aucun chiffre officiel d'effectifs trouvé pour la BITD ; rénovation : « +190 000 emplois dans le bâtiment d'ici 2030 » (SGPE) [S] seulement | À chercher |
| BLS, Employment Projections 2025-35 (27 août 2026) | [V*] | Tableau 1.12 : ajustements « prudents » pour l'IA, surtout sur les métiers informatiques, médias, finance, vente, administratifs et juridiques ; métiers administratifs −4,0 %. Le BLS publie aussi 4 catégories d'exposition à l'IA (de « Low » à « Very high ») pour **831 métiers**, https://www.bls.gov/emp/ind-occ-matrix/ai-exposure-categories.xlsx, avec l'avertissement « Exposure does not imply job loss » | Composante 3a de la v0 (croissance). Le fichier local a 831 lignes et ces 4 catégories : il croise vraisemblablement les projections et ce fichier BLS (À VÉRIFIER) |

### 2.4 Commerce : la concurrence chinoise


### 2.5 Transférabilité des savoir-faire

| Étude | Où | Résultat | Entrée dans l'indice |
|---|---|---|---|
| Gathmann et Schönberg, « How General Is Human Capital? A Task-Based Approach », *JOLE* 28(1), 2010 (IZA DP 3067) | Définition p. 16 ; déplacements p. 32 (document de travail) [V] | Séparation angulaire entre deux métiers : produit scalaire des vecteurs de tâches divisé par le produit de leurs normes (19 tâches, données allemandes BIBB). Le capital humain spécifique aux tâches explique au moins 40 % de la croissance salariale sur dix ans des diplômés du supérieur, 35 % et 25 % pour les qualifications moyennes et faibles (document de travail ; « jusqu'à 52 % » dans le résumé publié [S]) | **Composante 5a de la v0** (cosinus sur 126 descripteurs O*NET) |
| Schubert, Stansbury et Taska, « Employer Concentration and Outside Options », févr. 2022 | p. 2 et p. 4 [V] | Transitions d'un métier à l'autre tirées de 16 millions de CV ; l'effet de la concentration des employeurs sur les salaires est bien plus fort dans les métiers dont on sort peu (−7,3 % contre −2,6 %). Données publiques selon les auteurs | Variante v1 de 5a : mobilités **observées** par SOC |
| Bechichi, Jamet, Kenedi, Grundke et Squicciarini, « Moving between jobs », OCDE STI Policy Paper 70, 2019 | Résumé [V*] | Paliers de reconversion de 6 mois, 1 an et 3 ans (PIAAC, 31 pays, et O*NET) ; avec un an de formation au plus, presque tous les métiers ont des transitions possibles, mais elles sont plus rares depuis les métiers à fort risque d'automatisation | Seuil de « proximité » en durée de formation (v1) |
| Dawson, Williams et Rizoiu, *PLOS ONE* 16(8) : e0254722, 2021 | Résumé arXiv [V*] | Similarité de compétences tirée des offres d'emploi, asymétrique ; prédit 76 % des transitions | Distance asymétrique (v1) |

### 2.6 Scénarios et robustesse

| Étude | Où | Résultat | Entrée dans l'indice |
|---|---|---|---|
| Althoff et Reichardt, « Task-Specific Technical Change and Comparative Advantage », 10 juin 2026, https://crei.cat/wp-content/uploads/2026/06/TTC.pdf | pp. 3-4, 17-18 ; fig. 3 p. 28 [V] | Trois scénarios (lent, modéré, rapide) avec augmentation, automatisation et simplification des tâches. Scénario modéré : 22,4 % des tâches automatisables, 25,2 % du temps économisé ; rapport interdécile des salaires −24 %, salaire moyen +28 % (−15 % et +0,3 % avec coûts d'adoption) | Logique des scénarios : classer sur le pire cas |
| Autor et Thompson, « Expertise », NBER w33941, 2025 | Résumé p. 2 [V] | Automatiser les tâches **peu expertes** d'un métier augmente les salaires et réduit l'emploi ; automatiser les tâches **expertes** baisse les salaires et augmente l'emploi | Le risque n'augmente pas toujours avec l'exposition ; piste v2 |
| Legate-Yang et Massenkoff (2026) | Page [V*] | La moitié du travail physique compétitive en coût vers 2085 (scénario de base) ou 2050 (rapide) | Calendrier du scénario « robots rapides » |

---

## 3. L'indice proposé

Unité : la spécialité de diplôme (CAP, bac pro, BTS ; BUT en v1). Chaîne commune à toutes les composantes métier :

| # | Composante | Ce qu'elle mesure | Donnée | Unité | Passage | Poids de base | Limites |
|---|---|---|---|---|---|---|---|
| 1 | **IA qui remplace** | Part du temps de travail en tâches qu'un LLM sait faire **et** qui sont déjà faites avec Claude, l'usage automatisé comptant 1 et l'usage d'aide 0,5 | « Observed exposure », Anthropic (Massenkoff et McCrory, 5 mars 2026), `labor_market_impacts/job_exposure.csv` [V] | Part, SOC 6 chiffres (756 métiers) | O*NET-SOC → SOC 6 | 0,30 | Usage d'un seul assistant, de ses utilisateurs (sous-estime les métiers de terrain où personne n'utilise de chatbot) ; change à chaque version |
| 1 bis | IA, capacité (scénario « IA rapide ») | Part des tâches qu'une IA fait à plus de 80 % | Hosseini et Lichtinger (2026), `avg_auto_hl_bi` (local) | Part, O*NET-SOC | aucun | 0 (base), 0,50 (IA rapide) | Capacité, pas usage ni effet |
| 2 | **Robots** | Indice 0 à 3 : tâches physiques qu'un robot démontré sait faire, pondérées par l'environnement (1 usine dédiée, 2 lieu de travail structuré, 3 lieu non structuré) et par le temps | Anthropic, « What work can robots do? » (Legate-Yang et Massenkoff, 30 sept. 2026), `robot_exposure_occupations.csv` [V] | 0-3, O*NET-SOC 2019 (923 métiers) | aucun | 0,20 | Faisabilité technique, pas adoption : robots compétitifs en coût pour 0,3 % des tâches seulement [V] ; notation par un modèle d'IA |
| 3 | **Demande** (inversée) | (a) Croissance projetée de l'emploi 2025-2035 ; (b) taux d'emploi à 12 mois des sortants de la spécialité | (a) BLS Employment Projections 2025-35 (copie locale, provenance à vérifier) ; (b) InserJeunes, cumul 2023-2024, reconstitué par `cb2-voie-pro` | (a) %, SOC 6 ; (b) %, spécialité | (a) O*NET → SOC ; (b) aucun | 0,25 | (a) États-Unis ; (b) disponible pour 184 spécialités sur 468 ; **cible v1 : tensions Dares, BMO, *Métiers 2030* par FAP** |
| 4 | **Chine** | Hausse des importations françaises depuis la Chine 2018-2024 par salarié des divisions NAF où s'exercent les métiers visés, rapportée à la moyenne de l'industrie | Papier China shock 2 (BACI, emploi 2017) ; table officielle ROME → NAF (ROME v4, v462) | Milliers USD par salarié, relatif ; plafonné à 2, ramené à 0-1 | ROME → division NAF | 0,10 | La table ROME → NAF liste des secteurs sans poids d'emploi (ex. électricien relié à l'industrie électrique) ; services = 0 |
| 5 | **Transférabilité** (inversée) | (a) Part de l'emploi (américain) dans des métiers **proches** par le contenu du travail **et** peu exposés (IA + robots sous la médiane) ; (b) part des mobilités officielles ROME vers des métiers peu exposés | (a) O*NET 31.0, importance des 41 activités, 52 aptitudes, 33 connaissances ; similarité cosinus centrée, seuil = 90e centile des paires (0,496), à la manière de Gathmann et Schönberg (2010) ; emplois BLS 2025 ; (b) ROME, rubrique « mobilité » (environ 10 cibles par fiche) | Part d'emploi ; part de fiches | O*NET → SOC ; ROME | 0,15 | (a) Proximité de contenu, pas flux observés ; (b) mobilités déclarées par France Travail, sans poids |

**Mise à l'échelle.** Composantes 1, 1 bis, 2, 3, 5 : rang centile parmi les 468 spécialités (0 = plus faible risque). Composante 4 : valeur directe (la plupart des spécialités sont à 0, un rang leur donnerait un risque fictif). Le taux d'emploi est classé à l'intérieur de son niveau (un CAP n'est pas comparé à un BTS).

**Pourquoi ces poids.** La technologie (IA + robots) fait la moitié du score, parce que c'est la question posée. L'IA pèse plus que les robots parce que son usage est déjà observé, alors que les robots ne sont compétitifs en coût que pour 0,3 % des tâches et qu'il faudrait environ 40 ans pour atteindre 10 % au rythme historique de baisse des prix (Legate-Yang et Massenkoff, 2026) [V]. La demande compte pour un quart : c'est elle qui décide de l'embauche dans les cinq ans. La Chine ne pèse que 10 % car elle ne concerne que les spécialités industrielles. La transférabilité (15 %) n'est pas un risque en soi, c'est l'amortisseur : elle dit si l'on peut rebondir.

**Les cinq scénarios (vue portefeuille).**

| Scénario | IA (usage) | IA (capacité) | Robots | Demande | Chine | Transfert |
|---|---|---|---|---|---|---|
| Base | 0,30 | 0 | 0,20 | 0,25 | 0,10 | 0,15 |
| IA rapide (la capacité devient l'usage) | 0 | 0,50 | 0,10 | 0,20 | 0,05 | 0,15 |
| Robots rapides | 0,15 | 0 | 0,45 | 0,20 | 0,05 | 0,15 |
| Concurrence chinoise | 0,20 | 0 | 0,15 | 0,20 | 0,30 | 0,15 |
| Statu quo technologique | 0,10 | 0 | 0,10 | 0,50 | 0,10 | 0,20 |

Indicateur publié : le score de base, et **le rang dans le pire scénario** (une spécialité robuste est basse dans les cinq).

**Trois mesures métier, trois informations.** Sur 753 métiers américains, corrélations de rang : capacité IA (H-L) et IA observée 0,61 ; robots et IA observée −0,52 ; robots et capacité IA −0,46. L'IA observée vaut 0 pour 54,6 % des métiers (aucun usage repéré), ce qui écrase les écarts entre métiers manuels : c'est une raison de garder la capacité H-L dans le scénario « IA rapide ».

**Indépendance des composantes** (corrélations de rang, 468 spécialités) : IA et robots −0,44 (bureau contre terrain : ils se compensent, c'est voulu) ; demande et transférabilité 0,35 ; robots et transférabilité 0,37 ; Chine presque indépendante de tout (≤ 0,23). Aucune composante n'en double une autre.

---

## 4. Faisabilité : données et passages

### 4.1 Données

| Source | État | Emplacement | Usage v0 |
|---|---|---|---|
| Hosseini et Lichtinger (2026), exposition | Local | `data/raw/hosseini-lichtinger-occupations.xlsx` | Comparaison, scénario IA rapide |
| Anthropic Economic Index, « observed exposure » (mars 2026) | **Téléchargé** (37 Ko) | `data/raw-new/anthropic-economic-index/labor_market_impacts/` | Composante 1 |
| Anthropic, exposition aux robots (sept. 2026) | **Téléchargé** (48 Ko ; fichier des tâches, 100 Mo, non téléchargé) | `data/raw-new/anthropic-economic-index/robot_exposure/` | Composante 2 |
| Anthropic Economic Index, parts automatisation / augmentation par tâche (mars 2025) | **Téléchargé** | `data/raw-new/anthropic-economic-index/release_2025_03_27/` | Non utilisé (l'« observed exposure » les intègre) |
| Anthropic Economic Index, données brutes 2026 (78 à 220 Mo) | Téléchargeable | Hugging Face | Non téléchargé |
| ROME → ESCO (France Travail) ; ESCO → O*NET (2022) ; O*NET 31.0 | Local (lecture seule) | même dossier | Chaîne, composante 5a |
| Nomenclature FAP 2021 (22, 86, 228, 341 postes) | **Téléchargé** (API Dares) | `data/raw-new/dares-fap2021/` | Aucun : pas de colonne ROME ni PCS |
| **Table ROME → FAP 2021** (Dares) | Bloquée au sandbox ; **téléchargée à la main le 19/11** (`data/raw-new/dares-fap2021/Dares_Table_passage_ROME_Qualif_to_FAP2021_pour_programme.csv`), utilisée en v1 | https://dares.travail-emploi.gouv.fr/donnees/la-nomenclature-des-familles-professionnelles-2021 | **Clé de la v1** |
| Tensions Dares-France Travail 2024 | Bloqué au sandbox ; **classeur résumé téléchargé à la main le 19/11** (`data/raw-new/dares-tensions-2024/`), utilisé en v1 ; classeur complet (68 Mo) non téléchargé | https://dares.travail-emploi.gouv.fr/publication/les-tensions-sur-le-marche-du-travail-en-2024 | v1 |
| BMO 2025 et 2026 | **Téléchargés** (francetravail.org, via data.gouv.fr) | `data/raw-new/bmo/` | v1 |
| BMO 2015 à 2024 | Téléchargeables, mais nomenclature FAP antérieure probable avant 2025 (À VÉRIFIER) | jeu « Enquête Besoins en Main d'Oeuvre (BMO) » | v2 : difficulté persistante |
| *Métiers 2030*, cahier xlsx par FAP | Absent en local (le dossier de travail de `tuteur-ia` qui le contenait n'existe plus) ; PDF bloqué par captcha (recherche 11) | — | v1 |
| Eurostat (emploi par ISCO, âge) | Échec TLS depuis le sandbox | — | Pour un repère français de départs en fin de carrière |
| Microsoft « Working with AI », Webb (2020) | À VÉRIFIER (voir 2.1, 2.2) | — | Variantes de robustesse |

### 4.2 Passages déjà dans le dépôt

| Passage | Où | Couverture |
|---|---|---|
| ROME → ESCO → O*NET-SOC | `cb2-voie-pro/scripts/01_chaine_metiers.py`, repris dans le nouveau script | 1 727 fiches ROME reliées à 899 codes O*NET |
| ROME → division NAF | ROME v462, `arborescence_secteur_naf` | 1 727 fiches |
| Spécialité → divisions NACE par mots-clés (53 spécialités industrielles) | `scripts/build_lycees_pro.py` | Repère de contrôle pour la composante 4 |

**Manquent** : ROME → FAP 2021 (une seule table Dares, à télécharger à la main) ; SOC → ISCO-08 (table du BLS refusée, fichier IBS perdu) ; métiers réellement occupés par les sortants (Céreq Génération, ou InserSup/InserJeunes avec PCS à partir de 2026).

---

## 5. Résultats v0

468 spécialités (200 CAP, 138 bac pro, 130 BTS) ; toutes ont les cinq composantes ; le taux d'emploi français n'existe que pour 184 d'entre elles (la demande repose alors sur la seule projection américaine). Tableaux ci-dessous : CAP et bac pro ayant au moins 100 élèves en dernière année (rentrée 2023), soit 122 spécialités et 244 298 élèves.

Lecture des colonnes : « Risque v0 » = score de base (0 à 1) ; « Rang pire scénario » = rang centile le plus mauvais sur les cinq scénarios (1 = le plus risqué) ; « Rang exposition seule » = rang centile de l'ancien indice ; composantes en 0-1, 1 = plus de risque.

### 5.1 Les 10 risques les plus faibles

|Niveau|Spécialité|Élèves (terminale 2023)|Risque v0|Rang pire scénario|Exposition H-L|Rang exposition seule|IA|Robots|Demande|Chine|Transfert|
|---|---|---|---|---|---|---|---|---|---|---|---|
|BAC PRO|Optique lunetterie|572|0.22|0.03|0.06|0.29|0.33|0.24|0.20|0.00|0.12|
|BAC PRO|Technicien en prothèse dentaire|271|0.23|0.15|0.01|0.06|0.08|0.31|0.30|0.00|0.44|
|BAC PRO|Maintenance nautique|425|0.25|0.18|0.09|0.43|0.22|0.18|0.31|0.40|0.17|
|BAC PRO|ASSP option B, en structure|14 380|0.27|0.08|0.03|0.14|0.54|0.14|0.29|0.00|0.06|
|CAP|Couvreur|267|0.28|0.13|0.05|0.21|0.48|0.35|0.03|0.00|0.41|
|BAC PRO|Maintenance des véhicules option C, motocycles|684|0.28|0.09|0.05|0.26|0.50|0.32|0.16|0.00|0.21|
|BAC PRO|Maintenance des véhicules option B, transport routier|575|0.29|0.10|0.05|0.26|0.50|0.32|0.19|0.00|0.21|
|CAP|Maintenance des véhicules option B, transport routier|366|0.29|0.10|0.05|0.26|0.50|0.32|0.19|0.00|0.21|
|CAP|Maintenance des véhicules option C, motocycles|202|0.29|0.10|0.05|0.26|0.50|0.32|0.19|0.00|0.21|
|BAC PRO|ASSP option A, à domicile|2 907|0.29|0.14|0.03|0.14|0.54|0.14|0.38|0.00|0.06|

### 5.2 Les 10 risques les plus forts

|Niveau|Spécialité|Élèves (terminale 2023)|Risque v0|Rang pire scénario|Exposition H-L|Rang exposition seule|IA|Robots|Demande|Chine|Transfert|
|---|---|---|---|---|---|---|---|---|---|---|---|
|BAC PRO|Réalisation de produits imprimés et pluri média, option A productions graphiques|604|0.73|1.00|0.34|0.90|0.86|0.58|0.96|0.07|0.78|
|CAP|Équipier polyvalent du commerce|18 866|0.73|0.99|0.24|0.82|0.99|0.59|0.76|0.00|0.83|
|BAC PRO|Réalisation de produits imprimés et pluri média, option B productions imprimées|349|0.73|0.99|0.33|0.89|0.86|0.58|0.92|0.07|0.78|
|BAC PRO|Artisanat et métiers d'art, option enseigne et signalétique|147|0.72|0.99|0.33|0.89|0.87|0.62|0.88|0.06|0.75|
|BAC PRO|Photographie|381|0.72|1.00|0.46|0.95|0.83|0.60|0.86|0.00|0.91|
|BAC PRO|Artisanat et métiers d'art, option communication visuelle pluri média|1 710|0.70|1.00|0.52|0.97|0.94|0.31|0.93|0.03|0.85|
|BAC PRO|Microtechniques|657|0.68|1.00|0.25|0.83|0.70|0.55|0.84|0.70|0.56|
|CAP|Signalétique et décors graphiques|449|0.68|0.99|0.55|0.97|0.93|0.21|0.93|0.00|0.85|
|BAC PRO|Technicien en réalisation de produits mécaniques, option outillages|157|0.66|0.98|0.19|0.73|0.58|0.60|0.89|0.59|0.54|
|BAC PRO|Métiers de l'accueil|7 411|0.65|0.98|0.69|1.00|0.98|0.06|0.89|0.00|0.85|

### 5.3 Comparaison avec l'exposition seule

- **Corrélation de rang 0,37** (468 spécialités ; 0,43 sur les 122 grosses spécialités de CAP et bac pro). Les deux mesures racontent des histoires différentes.
- **Bureau contre terrain, pondéré par les élèves** (CAP et bac pro) : le bureau passe du rang moyen 0,97 (exposition) à 0,82 (risque) ; le terrain reste au milieu (0,53 puis 0,51), mais son rang dans le pire scénario monte à 0,65 (robots). Le constat « le bureau est plus risqué » tient ; « le terrain est un abri » ne tient pas pour tout le terrain.
- **Robustesse** : 16 des 122 grosses spécialités sont dans le tiers le moins risqué **dans les cinq scénarios** (15,7 % des élèves) : optique, prothèse dentaire, maintenance des véhicules (toutes options), carrosserie, ASSP (deux options), animation enfance et personnes âgées, accompagnant éducatif petite enfance, travaux publics, couvreur, maintenance nautique. 11 sont dans le tiers le plus risqué partout (10,3 % des élèves) : industries graphiques (deux options), photographie, communication visuelle, enseigne et signalétique, produits mécaniques (deux options), microtechniques, maroquinerie, conducteur d'installations de production, équipier polyvalent du commerce.
- **Corrélation du score de base avec chaque scénario** : 0,72 (IA rapide), 0,71 (robots rapides), 0,88 (Chine), 0,86 (statu quo). Le classement dépend surtout de l'hypothèse sur la vitesse de l'IA et des robots, d'où l'intérêt du rang dans le pire scénario.

**Plus grands déplacements** (rang risque moins rang exposition, CAP et bac pro, au moins 100 élèves) :

|Niveau|Spécialité|Exposition H-L|Rang exposition|Risque v0|Rang risque|Écart|Ce qui tire|
|---|---|---|---|---|---|---|---|
|CAP|Ferronnier d'art|0.02|0.08|0.64|0.89|+0.81|robots 0,88 ; IA 0,69 ; demande 0,65|
|BAC PRO|Ouvrage du bâtiment : métallerie|0.03|0.15|0.59|0.81|+0.65|robots 0,84 ; demande 0,74|
|CAP|Chaudronnerie ou soudage, option chaudronnerie|0.04|0.19|0.56|0.76|+0.57|robots 0,82 ; demande 0,74 ; Chine 0,56|
|CAP|Constructeur d'ouvrages en béton armé|0.00|0.03|0.49|0.57|+0.54|robots 0,93|
|BAC PRO|Technicien du bâtiment : gros œuvre|0.01|0.08|0.49|0.58|+0.51|robots 0,95 ; demande 0,67|
|CAP|Maçon|0.01|0.07|0.47|0.50|+0.43|robots 0,93|
|BAC PRO|Technicien géomètre topographe|0.40|0.93|0.29|0.09|−0.84|IA observée faible (0,43) ; robots 0,26 ; demande 0,11|
|BAC PRO|Technicien d'études du bâtiment, option B assistant en architecture|0.32|0.89|0.32|0.13|−0.76|robots 0,06 ; demande 0,24 ; transfert 0,08|
|BAC PRO|Travaux publics|0.14|0.60|0.32|0.12|−0.48|demande 0,06 ; transfert 0,11|
|CAP / BAC PRO|Métiers de la coiffure|0.21|0.75|0.41|0.31|−0.44|demande 0,29|
|BAC PRO|Animation, enfance et personnes âgées|0.15|0.61|0.34|0.18|−0.43|robots 0,07 ; transfert 0,08|

### 5.4 Ce qu'il ne faut pas en conclure

1. **Le gros œuvre qui monte n'est pas crédible en l'état.** La composante robots compte comme « exposée » une tâche qu'un robot sait faire dans une usine dédiée (préfabrication), et la demande vient des projections américaines (maçons : −1 % sur 2025-2035) faute de tensions françaises. En France, 79,7 % des projets de recrutement de couvreurs sont jugés difficiles, et 77,7 % pour les chaudronniers et tôliers (BMO 2026) [V*] ; le nucléaire cherche coffreurs, ferrailleurs et chaudronniers (GIFEN) [V*]. Avec la BMO et les tensions, ces spécialités devraient redescendre. À recalculer avant tout usage.
2. **La faible IA « observée » des métiers d'études** (géomètre : 0,009 contre 0,40 d'exposition H-L) vient de ce que peu de géomètres utilisent Claude, pas de ce que l'IA ne sait pas faire leurs tâches. Le scénario « IA rapide » corrige cela : le bac pro technicien géomètre topographe est au rang 0,09 dans le scénario de base mais 0,74 dans le scénario « IA rapide », donc 0,73 dans le pire scénario. Il n'est **pas** robuste, et la vue portefeuille le dit.
3. **Les métiers visés ne sont pas les métiers occupés.** Beaucoup de sortants de bac pro commerce travaillent ailleurs que dans la vente.
4. **Pas de BUT** : la table de `cb2-voie-pro` n'a pas de lien BUT → ROME ; les familles BTS/BUT de la Boussole en ont un (`familles-bts-but.csv`), à reprendre en v1.

## 5 bis. Résultats v1 : la demande française entre dans l'indice

Ajouté le 19 novembre 2026, après le téléchargement manuel des fichiers de la Dares. La v0 ci-dessus est conservée pour comparaison. Sorties : `data/derived/risque-filieres-v1/` (`specialites-risque-v1.csv`, `top10-*.csv`, `ecarts-exposition-risque.csv`, `comparaison-v0-v1.csv`, `fap228-demande-france.csv`).

### Ce qui change dans la méthode

Seule la composante **demande** change ; les quatre autres composantes, les poids (demande 0,25) et les cinq scénarios sont ceux de la v0, pour que tout écart vienne des données françaises.

| Élément | v0 | v1 |
|---|---|---|
| Passage métier → famille professionnelle | aucun | **Table Dares ROME → FAP 2021** par niveau de qualification (`Dares_Table_passage_ROME_Qualif_to_FAP2021_pour_programme.csv`, 532 fiches ROME v3, 337 FAP) ; les fiches ROME v4 sont rattachées à leur fiche mère (`code_rome_parent`, couverture 1 923 sur 1 923) |
| Qualification des premiers postes | — | CAP : codes 3 et 6 ; bac pro : 4 et 6 ; BTS : 7. Lecture des codes France Travail (1 manœuvre, 2 OS, 3 ouvrier qualifié P1-P2, 4 ouvrier qualifié P3-P4, 5 employé non qualifié, 6 employé qualifié, 7 technicien, 8 agent de maîtrise, 9 cadre, 0 non précisé) : cohérente avec la table (couvreur : 1, 2, 5 → « couvreurs peu qualifiés », 3, 4, 6 → « couvreurs qualifiés »), **libellés à vérifier** dans la documentation |
| Tension Dares-France Travail 2024 | — | Valeur du métier (FAP228) quand le classeur la publie (« Tableau 1 », 30 métiers les plus en tension, et « Tableau A », métiers qui emploient le plus) : **60 FAP sur 226** ; sinon valeur du domaine FAP22 (« Graphique 3 ») |
| Difficulté de recrutement | — | **BMO 2025 et 2026** (France Travail, data.gouv.fr, téléchargés dans `data/raw-new/bmo/`) : part des projets jugés difficiles, moyenne des deux années, 217 métiers BMO (codes FAP 2021). Les cellules masquées (« * ») comptent pour 0 : la part nationale obtenue (49,6 % en 2025, 43,1 % en 2026) est à moins d'un point des parts publiées (50,1 % et 43,8 %) ; sur les seules cellules publiées, on obtiendrait 55,2 % et 50,4 % |
| Intensité d'embauche | — | Projets BMO hors saisonniers (moyenne 2025-2026) rapportés à l'emploi du métier (« Tableau B » du classeur Dares), 209 métiers |
| Composante demande | 1 − moyenne(rang croissance BLS, rang emploi à 12 mois InserJeunes) | 1 − [½ bloc français (moyenne des rangs : tension, part difficile BMO, intensité BMO) + ¼ emploi à 12 mois InserJeunes + ¼ croissance BLS] |
| Couverture | Emploi français pour 184 spécialités sur 468 | **Bloc français pour 468 sur 468** |

Lecture : une tension élevée réduit le risque. C'est un choix : une tension forte peut aussi refléter des conditions de travail dures ou des salaires faibles (deux des sept facteurs de la Dares). Pour un jeune qui cherche un emploi, la tension reste un atout à court terme.

### Résultats

- **Corrélation de rang avec l'exposition seule : 0,45** (468 spécialités ; 0,37 en v0) ; 0,55 sur les 122 grosses spécialités de CAP et bac pro (0,43 en v0). L'écart avec l'exposition reste net, mais il se réduit : une partie de l'écart v0 venait des projections américaines.
- **Corrélation v0 / v1** : 0,92 pour le risque, 0,72 pour la seule composante demande.
- **Robustesse** (122 spécialités de CAP et bac pro avec au moins 100 élèves, 244 298 élèves) : **18 spécialités dans le tiers le moins risqué dans les cinq scénarios (16,1 % des élèves)**, contre 16 et 15,7 % en v0 ; entrent la réparation des carrosseries en CAP et le CAP réparation entretien des embarcations de plaisance. **9 dans le tiers le plus risqué partout (10,0 % des élèves)**, contre 11 et 10,3 % ; sortent les deux options « produits mécaniques » et la maroquinerie, entre le CAP opérateur logistique.
- **Bureau contre terrain** (rang moyen pondéré par les élèves, CAP et bac pro) : bureau 0,85 (0,82 en v0), terrain 0,48 (0,51) ; pire scénario : bureau 0,96, terrain 0,63.

**Les 10 risques les plus faibles (v1)**

|Niveau|Spécialité|Élèves|Risque v1|Rang pire scénario|Exposition H-L|Rang exposition seule|IA|Robots|Demande v1|Chine|Transfert|
|---|---|---|---|---|---|---|---|---|---|---|---|
|BAC PRO|Maintenance nautique|425|0.22|0.14|0.09|0.43|0.22|0.18|0.21|0.40|0.17|
|BAC PRO|Technicien en prothèse dentaire|271|0.26|0.21|0.01|0.06|0.08|0.31|0.45|0.00|0.44|
|BAC PRO|Optique lunetterie|572|0.27|0.09|0.06|0.29|0.33|0.24|0.40|0.00|0.12|
|BAC PRO|ASSP option B, en structure|14 380|0.27|0.03|0.03|0.14|0.54|0.14|0.28|0.00|0.06|
|BAC PRO|Réparation des carrosseries|1 133|0.28|0.23|0.01|0.05|0.08|0.47|0.29|0.28|0.39|
|BAC PRO|ASSP option A, à domicile|2 907|0.28|0.04|0.03|0.14|0.54|0.14|0.33|0.00|0.06|
|BAC PRO|Maintenance des véhicules option C, motocycles|684|0.28|0.07|0.05|0.26|0.50|0.32|0.15|0.00|0.21|
|CAP|Maintenance des véhicules option B, transport routier|366|0.28|0.08|0.05|0.26|0.50|0.32|0.15|0.00|0.21|
|CAP|Maintenance des véhicules option C, motocycles|202|0.28|0.08|0.05|0.26|0.50|0.32|0.15|0.00|0.21|
|BAC PRO|Maintenance des véhicules option B, transport routier|575|0.28|0.09|0.05|0.26|0.50|0.32|0.16|0.00|0.21|

Le CAP couvreur sort du top 10 de justesse (112e sur 122, risque 0,29) mais reste dans le tiers bas des cinq scénarios.

**Les 10 risques les plus forts (v1)**

|Niveau|Spécialité|Élèves|Risque v1|Rang pire scénario|Exposition H-L|Rang exposition seule|IA|Robots|Demande v1|Chine|Transfert|
|---|---|---|---|---|---|---|---|---|---|---|---|
|CAP|Équipier polyvalent du commerce|18 866|0.73|1.00|0.24|0.82|0.99|0.59|0.75|0.00|0.83|
|BAC PRO|Photographie|381|0.71|1.00|0.46|0.95|0.83|0.60|0.83|0.00|0.91|
|BAC PRO|Produits imprimés et pluri média, option A productions graphiques|604|0.70|0.99|0.34|0.90|0.86|0.58|0.81|0.07|0.78|
|BAC PRO|Produits imprimés et pluri média, option B productions imprimées|349|0.70|0.98|0.33|0.89|0.86|0.58|0.80|0.07|0.78|
|BAC PRO|Artisanat et métiers d'art, option enseigne et signalétique|147|0.69|0.97|0.33|0.89|0.86|0.61|0.76|0.06|0.75|
|BAC PRO|Artisanat et métiers d'art, option communication visuelle pluri média|1 710|0.69|1.00|0.52|0.97|0.94|0.31|0.86|0.03|0.85|
|CAP|Ferronnier d'art|105|0.65|0.97|0.01|0.08|0.69|0.88|0.68|0.25|0.47|
|CAP|Signalétique et décors graphiques|449|0.64|0.98|0.55|0.97|0.93|0.21|0.76|0.00|0.85|
|BAC PRO|Métiers du commerce et de la vente, option A|21 567|0.63|0.96|0.50|0.96|0.96|0.26|0.76|0.00|0.70|
|BAC PRO|Métiers de l'accueil|7 411|0.63|0.98|0.69|1.00|0.98|0.06|0.77|0.00|0.85|

**Correction du 19/11 (soir)** : la ligne « CAP conducteur d'engins » (274 élèves) était rattachée par erreur, dans `cb2-voie-pro`, à la fiche ROME H2802 (fabrication de matériaux de construction). `scripts/build_risque_filieres.py` la rattache désormais à F1302 (conducteur d'engins de chantier), comme les autres lignes du même diplôme. Son risque passe de 0,65 à 0,44 (rang dans le pire scénario 0,99 → 0,84) : elle sort du top 10, où le bac pro métiers de l'accueil (0,63) reprend la 10e place. Les chiffres de synthèse ne changent pas (corrélation 0,45 ; 18 spécialités robustes à faible risque, 16,1 % des élèves ; 9 à risque élevé, 10,0 %).

### Le bâtiment, revérifié

|Niveau|Spécialité|Élèves|FAP 2021 (premiers postes)|Tension Dares 2024|Part BMO difficile 2025-26|Demande v0|Demande v1|Rang risque v0|Rang risque v1|Pire scénario v0|Pire scénario v1|
|---|---|---|---|---|---|---|---|---|---|---|---|
|CAP|Électricien|7 522|B2X32 B2X35 G0A40|1.07|66 %|0.32|0.27|0.25|0.21|0.52|0.47|
|CAP|Peintre applicateur de revêtements|2 761|B2X30 B2X31 B2X36|0.96|61 %|0.67|0.47|0.51|0.34|0.72|0.67|
|CAP|Maçon|2 043|B0X32 B1X31 B2X31|0.96|67 %|0.49|0.35|0.50|0.37|0.83|0.78|
|BAC PRO|Technicien en chaudronnerie industrielle|1 768|A3X41 B1X33 D1X30 D1X32 D1X33 G0B40 K0X30|1.03|67 %|0.50|0.41|0.62|0.57|0.70|0.69|
|BAC PRO|Installateur en chauffage, climatisation et énergies renouvelables|1 450|B2X33 E0X30|0.89|60 %|0.48|0.41|0.42|0.31|0.53|0.50|
|CAP|Menuisier fabricant|1 282|B1X33 B2X38 F1X31 U1X80|0.53|56 %|0.86|0.65|0.45|0.25|0.70|0.61|
|BAC PRO|Technicien du bâtiment : gros œuvre|804|B1X31|0.96|71 %|0.67|0.43|0.58|0.37|0.90|0.82|
|CAP|Charpentier bois|760|B1X33 G0A40|1.33|75 %|0.82|0.48|0.68|0.41|0.80|0.69|
|CAP|Chaudronnerie ou soudage, option chaudronnerie|623|B1X33 D1X30|1.33|78 %|0.73|0.38|0.76|0.56|0.89|0.75|
|BAC PRO|Ouvrage du bâtiment : métallerie|441|B1X33 B2X38 D1X30 K0X30|0.99|68 %|0.74|0.53|0.81|0.72|0.90|0.84|
|CAP|Carreleur mosaïste|301|B2X30|0.96|65 %|0.41|0.32|0.40|0.27|0.77|0.75|
|CAP|Couvreur|267|B1X34|1.49|81 %|0.03|0.04|0.06|0.05|0.13|0.11|
|CAP|Constructeur d'ouvrages en béton armé|110|B0X32|0.96|57 %|0.40|0.33|0.57|0.54|0.82|0.82|

(Tension 0,96 = valeur du domaine « Bâtiment, travaux publics » : le métier n'est pas dans les tableaux publiés du classeur.)

Lecture :
1. **Comme attendu, la demande française fait baisser le bâtiment.** La composante demande du gros œuvre passe de 0,67 à 0,43, celle du charpentier de 0,82 à 0,48, celle du CAP chaudronnerie de 0,73 à 0,38. Rangs de risque : maçon 0,50 → 0,37, gros œuvre 0,58 → 0,37, charpentier 0,68 → 0,41. Ces spécialités repassent sous la médiane.
2. **Le couvreur reste le cas le plus sûr du bâtiment** : 81 % de projets difficiles (BMO 2025-2026 ; 79,7 % publié pour 2026), tension 1,49 (valeur du métier, « Tableau 1 »).
4. **La métallerie et le béton armé restent au-dessus de la médiane** (0,72 et 0,54) : robots élevés, demande à peine moyenne (part difficile 57 à 68 %).

### Limites propres à la v1

- **166 FAP sur 226 n'ont que la tension de leur domaine** : la tension ne distingue donc pas maçon et carreleur. Le classeur complet de la Dares (68 Mo, tension et sept facteurs pour chaque FAP228) supprimerait cette approximation. Il n'est **pas indispensable** à la v1, car la BMO apporte déjà le niveau FAP228 (difficulté et intensité), mais il est **recommandé** pour la v2 : il donnerait aussi les deux facteurs « intensité d'embauche » et « manque de main-d'œuvre disponible » à la source, à la place de leurs approximations BMO.
- **La tension mesure 2024, la BMO 2025-2026.** Le scénario « statu quo » donne 50 % à la demande ; la série de tension 2011-2024 par domaine (« Graphique 2 ») permettrait une version « tension persistante » ; non faite.
- **Le choix des qualifications** (3 et 6 pour le CAP, 4 et 6 pour le bac pro, 7 pour le BTS) est une hypothèse ; le sortant de CAP occupe souvent un poste peu qualifié.
- Les métiers restent ceux **visés** par le diplôme, et la ligne retenue pour chaque intitulé reste celle de `cb2-voie-pro`, rapprochements automatiques compris.

## 7. Le « portefeuille », expliqué à un élève de 16 ans

Personne ne sait vraiment ce que l'IA, les robots ou le commerce avec la Chine vont changer d'ici à tes 30 ans. Alors, au lieu de parier sur un seul avenir, on regarde quelles formations restent un bon choix dans tous les avenirs possibles. Ce sont celles où il faut des mains, du contact et du jugement, où les entreprises cherchent du monde, et d'où l'on peut rebondir vers un métier voisin si le sien change. Un bon choix, c'est une formation qui ne te laisse pas sans solution si le monde prend un autre chemin que prévu.

---

## Sources

- Anthropic Economic Index (données) : https://huggingface.co/datasets/Anthropic/EconomicIndex
- Massenkoff et McCrory (2026), Labor market impacts : https://www.anthropic.com/research/labor-market-impacts
- Legate-Yang et Massenkoff (2026), What work can robots do? : https://www.anthropic.com/research/what-work-can-robots-do
- Brynjolfsson, Chandar et Chen (2026) : https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf
- Tomlinson et al. (2025-2026) : https://arxiv.org/abs/2507.07935 ; https://github.com/microsoft/working-with-ai
- Hampole et al. : https://www.nber.org/papers/w33509 · Eckhardt et Goldschlag : https://eig.org/wp-content/uploads/2025/08/EIG-AI-and-Jobs.pdf
- Webb (2020) : https://www.michaelwebb.co/webb_ai.pdf · Acemoglu et Restrepo (2020), *JPE* 128(6) · Acemoglu, Lelarge et Restrepo (2020), NBER w26738
- Aghion, Antonin, Bunel et Jaravel : https://www.insee.fr/en/statistiques/7613955
- Gathmann et Schönberg (2010), *JOLE* 28(1) · Schubert, Stansbury et Taska (2022) · Bechichi et al. (2019), OCDE · Dawson et al. (2021), *PLOS ONE*
- Althoff et Reichardt (2026) : https://crei.cat/wp-content/uploads/2026/06/TTC.pdf · Autor et Thompson, NBER w33941
- Hosseini et Lichtinger (2026) : https://github.com/s-mahdihosseini/GenAI_Expertise
- Dares, FAP 2021 : https://data.dares.travail-emploi.gouv.fr/api/explore/v2.1/catalog/datasets/dares_nomenclature_fap2021/exports/csv ; page de la table FAP/PCS/ROME : https://dares.travail-emploi.gouv.fr/donnees/la-nomenclature-des-familles-professionnelles-2021
- Dares, tensions 2024 : https://dares.travail-emploi.gouv.fr/publication/les-tensions-sur-le-marche-du-travail-en-2024
- Dares, table ROME → FAP 2021 et classeur des tensions 2024 : téléchargés à la main le 19/11/2026 depuis le site de la Dares (`data/raw-new/dares-fap2021/`, `data/raw-new/dares-tensions-2024/`)
- BMO 2025 : https://www.francetravail.org/files/live/sites/peorg/files/documents/Statistiques-et-analyses/Open-data/BMO/Base_open_data_BMO_2025.xlsx ; BMO 2026 : https://www.francetravail.org/files/live/sites/peorg/files/documents/Statistiques-et-analyses/Open-data/BMO/Base-open-data-BMO-2026.xlsx
- France Travail, BMO : https://www.francetravail.fr/candidat/decouvrir-le-marche-du-travail/besoins-en-main-doeuvre.html ; séries 2015-2026 : https://www.data.gouv.fr/datasets/enquete-besoins-en-main-doeuvre-bmo
- ROME v4 (open data) : https://www.francetravail.org/opendata/repertoire-operationnel-des-meti.html?type=article
- *Les métiers en 2030* : https://www.strategie-plan.gouv.fr/publications/metiers-2030
- BLS, Employment Projections et catégories d'exposition à l'IA : https://www.bls.gov/emp/ ; https://www.bls.gov/emp/ind-occ-matrix/ai-exposure-categories.xlsx
{% endraw %}
