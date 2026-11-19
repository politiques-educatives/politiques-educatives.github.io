---
layout: recherche
title: "21 · Codifiabilité, faisceaux de tâches et portefeuille de carrières : revue de littérature"
slug: 21-codifiabilite-revue
sujets: []
---
{% raw %}

Revue de travail, 19 novembre 2026, pour la Boussole des formations et l'indice de risque des filières techniques (`research/19-mesure-risque-filieres-techniques/`). Données et plan d'intégration : `2026-11-19-donnees-publiques.md` (même dossier).

---

## 0. Point de départ : l'exemple KPMG, et ce qu'il prouve

**L'exemple KPMG est une déclaration d'entreprise sur un pilote, pas une preuve d'effet sur l'emploi.** Le clip de BFM Business du 19 novembre 2026 n'a pas été retrouvé (site inaccessible à l'outil de recherche). L'information d'origine est un article du *Financial Times* du 18 novembre 2026 (Ellesheva Kissin), lu dans sa reprise par l'*Irish Times* [V, https://www.irishtimes.com/business/2026/11/18/ai-asked-better-questions-than-kpmg-accountants-in-pilot-audit-of-effectiveness/]. KPMG a fait travailler « plus de 100 agents d'IA » sur l'audit d'une entreprise du FTSE 250 non nommée, **en parallèle** de l'audit humain. L'audit par l'IA n'a pas servi à certifier les comptes. Un humain a dû intervenir quand un agent n'a pas su rapprocher un ensemble de règles. Selon la responsable de l'audit au Royaume-Uni, l'IA est allée « tellement plus loin » et a posé de « meilleures questions » dans certains cas. KPMG veut étendre le pilote à 20 grands audits au plus, mais peu de clients ont des données assez « propres ». La formule « aussi bon que les humains dans la plupart des cas » ne figure que dans des reprises secondaires.

**Analyse.** L'exemple illustre bien l'intuition : l'audit suit des normes écrites, des procédures et des contrôles répétés, donc il est « codifiable ». Mais il ne dit rien des embauches. Les preuves sur l'emploi viennent d'ailleurs (sections 2 et 3). Et l'audit est justement l'exemple que Garicano utilise pour un métier dont les tâches restent liées (section 3.2). Il faut donc citer KPMG comme un **signal de capacité**, pas comme un résultat.

---

## 1. Définitions

| Terme | Définition retenue | Source |
|---|---|---|
| **Tâche** | Unité d'activité qui produit un résultat (rédiger un compte rendu, poser une tuile) ; un métier est un ensemble de tâches | Acemoglu et Autor (2011) [voir § 2.1] |
| **Compétence** (*skill*) | Capacité d'un travailleur à accomplir des tâches ; le lien entre compétences et tâches change avec la technologie | Idem |
| **Tâche routinière** | Tâche qui peut être faite par une machine suivant des règles explicites programmées | Autor, Levy et Murnane (2003) [voir § 2.1] |
| **Codifiabilité** | Degré auquel on peut écrire les règles d'une tâche, ou au moins juger son résultat de façon objective. Une tâche routinière est codifiable ; l'IA générative élargit la notion aux tâches qu'on sait juger sur exemples, même sans règle écrite | Ce document, à partir d'Autor (2014) et d'Acemoglu (2024) |
| **Savoir tacite** | Ce qu'on sait faire sans pouvoir l'expliquer : « nous savons plus que nous ne pouvons dire » (Polanyi) | Autor (2014) [voir § 2.1] |
| **Faisceau de tâches** (*bundle*) | Les tâches qu'un même poste réunit. Faisceau **fort** : les séparer coûte cher (coordination, demande imprévisible, résultat difficile à mesurer) ; faisceau **faible** : l'IA peut en prendre une partie et le poste rétrécit | Garicano, Li et Wu (2026) [V, § 3.2] |
| **Exposition** | Part des tâches d'un métier qu'une IA sait faire ou accélérer. Mesure de **capacité**, sans sens de l'effet | Eloundou et al. (2024) ; Hosseini et Lichtinger (2026) |
| **Automatisation** | L'IA fait la tâche à la place du travailleur (usage « directif » dans l'Anthropic Economic Index) | Handa et al. (2025) [R-19] |
| **Augmentation** | L'IA aide le travailleur à faire la tâche (itération, validation, apprentissage) | Idem |
| **Expertise** | Savoir rare qui fait barrière à l'entrée et porte une prime de salaire ; mesurée en mois de formation par Hosseini et Lichtinger | Autor et Thompson (2025) ; Hosseini et Lichtinger (2026) [V, § 4] |

---

## 2. Codifiabilité et routine : ce que l'IA générative change

### 2.1 Le cadre classique : la machine prend ce qui s'écrit

**Pendant quarante ans, une tâche était automatisable si l'on pouvait en écrire les règles.** Autor, Levy et Murnane (2003, *QJE* 118(4) : 1279-1333) définissent une tâche routinière comme une tâche qui « peut être accomplie par des machines suivant des règles explicites programmées », et une tâche non routinière comme une tâche dont les règles ne sont « pas assez bien comprises pour être écrites en code » (p. 1283) [V]. Leur tableau I (p. 1286) croise routinier et non routinier avec analytique et manuel : l'ordinateur remplace la tenue de registres et le calcul ; il complète la formulation d'hypothèses, le diagnostic médical, la **rédaction juridique** et le management ; il touche peu le travail manuel non routinier (ménage, conduite) [V]. Avec ce cadre, le déplacement des tâches explique 60 % de la hausse relative de la demande de diplômés du supérieur entre 1970 et 1998 (résumé, p. 1279) [V]. Acemoglu et Autor (2011, *Handbook of Labor Economics* 4B ; NBER w16082) font des tâches routinières, « ou codifiables », celles qu'on peut « spécifier entièrement comme une suite d'instructions exécutées par une machine », en précisant que « routinier ne veut pas dire banal » (p. 20 du document de travail) [V]. Leur indice O*NET de « routine cognitive » additionne trois items : importance de répéter les mêmes tâches, importance d'être exact ou précis, et travail structuré plutôt que non structuré (annexe, p. 93) [V].

**Analyse.** La codifiabilité, dans ce cadre, est une propriété de la tâche et non du niveau de diplôme : un comptable fait des tâches codifiables et des tâches de jugement. C'est ce qui a vidé le milieu de la distribution des emplois (employés de bureau, ouvriers de production). **Limite** : le cadre suppose que la machine ne fait que ce qu'on lui a écrit.

### 2.2 L'IA générative apprend sur exemples : la frontière se déplace

**Le paradoxe de Polanyi (« nous savons plus que nous ne pouvons dire ») protégeait le savoir tacite ; l'apprentissage automatique le contourne en apprenant sur des exemples.** Autor (2014, NBER w20485) définit le paradoxe ainsi : « notre connaissance tacite du fonctionnement du monde dépasse souvent notre compréhension explicite » (résumé) ; les tâches les plus dures à automatiser demandent « flexibilité, jugement et sens commun » (p. 8) [V]. Il note déjà que l'apprentissage automatique pourrait « inférer comment accomplir des tâches qu'on a eu beaucoup de mal à codifier par des procédures explicites », en étudiant des exemples réussis (p. 34) [V]. Autor (2024, NBER w32140) va plus loin : les capacités de l'IA sont « précisément l'inverse » de celles de l'informatique classique ; elle est « peu fiable sur les faits et les chiffres » mais « remarquablement efficace pour acquérir du savoir tacite » (p. 7) [V].

**Les mesures d'exposition confirment que la ligne « routinier / non routinier » ne prédit plus bien qui est exposé.** Eloundou, Manning, Mishkin et Rock (« GPTs are GPTs », *Science*, 2024 ; version arXiv v5 lue) appellent « exposée » une tâche dont un LLM réduit d'au moins moitié le temps à qualité égale (p. 25) [V]. Avec leur mesure β, 80 % des actifs américains ont au moins 10 % de tâches exposées et 19 % au moins la moitié (p. 1 et 11) [V ; la version *Science* donne d'autres chiffres, voir « Non vérifié »]. Un écart-type de routine **cognitive** n'ajoute que 0,066 à l'exposition β (moyenne 0,33), alors qu'un écart-type de routine **manuelle** la réduit de 0,111 (tableau 9, p. 21) [V]. L'exposition croît avec la préparation : 0,06 pour les métiers sans préparation (*job zone* 1) contre 0,47 pour ceux qui demandent une licence (zone 4) (tableau 6, p. 17) [V]. Webb (2020) trouvait déjà, à partir des brevets, que l'IA vise des tâches de diplômés, avec une exposition maximale vers le 90e centile des salaires, alors que les logiciels visaient le milieu et les robots le bas de la distribution (pp. 3-4) [V]. Felten, Raj et Seamans (2023, arXiv 2303.01157) classent en tête de l'exposition aux modèles de langage les télévendeurs et les enseignants du supérieur en lettres et en langues ; l'exposition croît avec le salaire (pp. 6-8) [V]. Le calcul du GT va dans le même sens : sur 911 métiers O*NET, l'indice de routine cognitive d'Acemoglu et Autor ne corrèle pas avec la part de tâches automatisables de Hosseini et Lichtinger (Spearman 0,04), et l'indice de travail non routinier analytique y corrèle positivement (0,33) (fichier de données, § 3.4).

**La bonne frontière est la vérifiabilité du résultat, pas la routine.** Acemoglu (2024, « The Simple Macroeconomics of AI », NBER w32487) appelle « faciles à apprendre » les tâches qui ont (i) « une mesure de résultat fiable et observable » et (ii) « une relation simple entre l'action et ce résultat » ; les tâches « difficiles » n'ont pas de critère clair de réussite et dépendent du contexte, comme diagnostiquer une toux persistante (pp. 15-16) [V]. Il précise que cette distinction est « différente de la distinction routinier / non routinier » : une partie de la programmation et de l'écriture simple sont non routinières mais faciles (note 14, p. 16) [V]. Selon son classement des verbes, 72,6 % des tâches exposées (pondérées par les salaires) sont faciles : calculer, rédiger, transcrire, classer (pp. 31-33) [V]. Au total, il ne retient que 4,6 % des tâches touchées en dix ans (20 % exposées × 23 % rentables à automatiser, p. 25) et au plus 0,66 % de productivité globale en dix ans (résumé) [V].

**Analyse.** Pour l'IA générative, « codifiable » veut dire désormais : **on sait dire si le résultat est bon**, avec une règle ou avec des exemples. L'audit de conformité, la saisie comptable, la traduction courante ou le code standard le sont ; le conseil, la négociation ou le diagnostic incertain le sont moins. C'est cette définition qu'il faut mesurer, et non la répétitivité, qui désigne surtout du travail manuel que l'IA ne touche pas. **Limite** : la frontière bouge à chaque génération de modèles ; Acemoglu (2024) est aussi l'estimation la plus prudente de la littérature.

### 2.3 Les services professionnels : expériences et données d'entreprise

**Dans les expériences, l'IA générative accélère surtout les tâches dont le résultat se vérifie, et elle aide d'abord les moins expérimentés.**

| Métier | Étude | Contexte | Résultat (avec point de comparaison) | Statut |
|---|---|---|---|---|
| Support client | Brynjolfsson, Li et Raymond (2025, *QJE* 140(2) : 889-942 ; NBER w31161) | 5 179 téléconseillers d'une entreprise de logiciels, déploiement progressif d'un assistant | Problèmes résolus par heure : +14 % en moyenne, +34 % pour les novices et les moins qualifiés, presque rien pour les plus expérimentés ; un agent traité à 2 mois d'ancienneté fait aussi bien qu'un non-traité à plus de 6 mois. L'outil « diffuse les bonnes pratiques des meilleurs » (savoir tacite rendu transmissible) | [V, document de travail] ; version publiée : +15 %, 5 172 agents [résumé] |
| Rédaction professionnelle | Noy et Zhang (2023, *Science* 381(6654) : 187-192) | 453 diplômés, tâches d'écriture de leur métier, expérience en ligne | Temps −40 %, qualité +18 % par rapport au groupe de contrôle | [résumé] |
| Conseil | Dell'Acqua et al. (2023, HBS WP 24-013) | 758 consultants du BCG | Dans la « frontière » de l'IA : +12,2 % de tâches, 25,1 % plus vite, qualité supérieure de plus de 40 % ; +43 % pour les moins bons contre +17 % pour les meilleurs. Hors frontière : 19 points de moins de bonnes réponses | [V, p. 4] |
| Programmation | Peng et al. (2023, arXiv 2302.06590) ; Cui, Demirer et al. (*Management Science*, à paraître) | 95 programmeurs Upwork ; 4 867 développeurs dans trois entreprises | Tâche faite 55,8 % plus vite (71 contre 161 minutes) ; +26,1 % de tâches terminées, gains concentrés chez les juniors | [V] |
| Droit | Choi, Monahan et Schwarcz (2024, *Minnesota Law Review* 109 : 147) | Environ 60 étudiants en droit, GPT-4 | Gains de vitesse importants, gains de qualité « faibles et irréguliers » ; plus grands bénéfices pour les plus faibles | [résumé] |
| Traduction | Frey et Llanos-Paredes (2025, Oxford Martin) | 696 marchés locaux américains, 2010-2023 | +1 point d'usage de la traduction automatique : −0,7 point de croissance de l'emploi de traducteur (environ 28 000 postes non créés) | [résumé] |
| Travail indépendant | Demirci, Hannane et Zhu (2025, *Management Science* 71(10)) ; Hui, Reshef et Zhou (2024, *Organization Science* 35(6)) | Plateformes de freelances | Offres d'écriture et de code automatisables −21 % dans les 8 mois après ChatGPT, par rapport aux tâches manuelles ; baisse d'emploi et de revenus des freelances exposés, y compris les meilleurs | [résumé] |
| Emploi en place, 11 métiers exposés dont comptables | Humlum et Vestergaard (NBER w33777, rév. mars 2026) | Danemark, environ 25 000 salariés, enquêtes appariées aux registres | Effets nuls et précis sur salaires et heures : au-delà de 2 % exclus ; gain de temps déclaré d'environ 3 % ; effet sur la part des débutants inférieur à un tiers de point | [V] |

**L'audit et la comptabilité ont des preuves propres, et elles touchent les juniors.** Fedyk, Hodson, Khimich et Fedyk (2022, *Review of Accounting Studies* 27 : 938-985) suivent plus de 310 000 CV dans les 36 plus grands cabinets d'audit américains, avant l'IA générative. Un écart-type d'investissement en IA va avec 5,0 % de retraitements de comptes en moins et 0,9 % d'honoraires en moins ; l'effectif comptable baisse de 3,6 % après trois ans et de 7,1 % après quatre, **et l'effectif junior de 5,7 % puis 11,8 %, sans effet significatif aux niveaux intermédiaire et senior** (p. 938 et 941) [V]. Deux travaux récents vont dans le même sens, mais n'ont été lus qu'en résumé : Choi et Xie (2025, Stanford GSB) trouvent que les comptables qui adoptent l'IA suivent 55 % de clients de plus par semaine ; Downing (2026, thèse MIT Sloan) trouve qu'après l'IA générative, l'emploi de comptables baisse de 2,7 % et les offres de 13 % par écart-type d'investissement préalable dans l'intégration de données, surtout pour les juniors et par non-remplacement [résumé].

**Analyse.** Les expériences disent la même chose que l'exemple KPMG : plus la tâche est vérifiable, plus l'IA accélère. Mais l'effet sur l'emploi passe par les juniors (Fedyk et al., Hosseini et Lichtinger, Canaries), pas par les salariés en place (Humlum et Vestergaard). Et l'IA rapproche les novices des experts (Brynjolfsson et al.) : le savoir tacite qui faisait la valeur de l'expérience devient en partie transmissible par l'outil. **Limites** : expériences de courte durée, souvent sur des tâches choisies pour être mesurables ; l'étude d'audit la plus solide porte sur l'IA d'avant 2023.

---

## 3. Le métier comme faisceau de tâches

### 3.1 Les hiérarchies de savoir : l'IA prend d'abord les problèmes courants, ceux des débutants

**Dans une organisation, les problèmes courants sont réglés en bas et les exceptions remontent ; une IA bon marché fait d'abord le travail du bas de l'échelle.** C'est le modèle des « hiérarchies de savoir » : chaque travailleur apprend à résoudre les problèmes les plus fréquents et transmet les plus rares à un expert, ce qui fixe le nombre de niveaux et la taille des équipes (Garicano, 2000, *JPE* 108(5) : 874-904 ; Garicano et Rossi-Hansberg, 2006, *QJE* 121(4) : 1383-1435 ; synthèse dans Garicano et Rossi-Hansberg, 2015, *Annual Review of Economics* 7 : 1-30) [références vérifiées ; contenu : résumé]. Ide et Talamàs (2025, *JPE* 133(12) : 3762-3800) ajoutent l'IA à ce cadre. Selon leur résumé, une IA « autonome » profite surtout aux plus savants, une IA « non autonome » (un assistant) profite aux moins savants, et la production est plus élevée avec l'IA autonome [résumé].

Les données d'embauche vont dans ce sens. Hosseini et Lichtinger (version du 25 mai 2026) suivent les CV LinkedIn de 281 111 entreprises américaines entre 2015 et 2025 (Revelio Labs). Une entreprise « adopte » l'IA générative quand elle publie au moins une offre pour intégrer cet outil ; c'est le cas de 10 433 entreprises, 3,71 % des entreprises mais 16 % des postes (pp. 19-22). Six trimestres après début 2023, l'emploi junior (niveaux « Entry » et « Junior » de Revelio) baisse d'environ 9 % chez les adoptants par rapport aux non-adoptants, sans effet sur les seniors (p. 33). Le canal est l'embauche : −4,0 embauches de juniors par trimestre et par entreprise, pour une moyenne de 5,1 avant 2023, soit environ −80 % selon les auteurs, contre −1,1 départ (tableau 5, p. 45) [V]. Les auteurs lient ce résultat à la codifiabilité : l'IA générative automatise plutôt « les tâches routinières et codifiables qui forment l'essentiel du travail des juniors » (p. 62) [V].

**Analyse.** Le cadre explique pourquoi l'ajustement passe par les premières embauches (Canaries : −19 % pour les 22-25 ans exposés aux États-Unis ; Banque de France : −28 % d'embauches en CDI des 21-29 ans dans le quintile le plus exposé, contre −8 % dans le moins exposé [R-18]). **Limite** : les adoptants ne sont pas tirés au hasard, et Deming attribue une grande part de la baisse des embauches de juniors au télétravail, déjà de −5 points sur 2019 au lancement de ChatGPT [R-memo].

### 3.2 Faisceau fort, faisceau faible (Garicano, Li et Wu)

**Un métier résiste quand ses tâches coûtent cher à séparer, même si l'IA sait en faire une partie.** Garicano, Li et Wu (« Weak Bundle, Strong Bundle: How AI Redraws Job Boundaries », CEPR DP21453, mars-mai 2026, https://cepr.org/publications/dp21453) définissent la force d'un faisceau par le coût de coordination qu'entraîne la séparation des tâches : « dans un faisceau fort, casser le métier détruit assez de valeur pour que le métier survive en entier […] ; dans un faisceau faible, le coût de la séparation est faible : l'IA remplace certaines tâches, le rôle humain se rétrécit et la part du travail baisse » [V]. Leur formule : « Lire des radios est une tâche. La radiologie est un métier. » Dans « The task is not the job » (Silicon Continent, 24 avril 2026, https://www.siliconcontinent.com/p/why-desk-jobs-survive-and-amodei), Garicano retient trois traits qui renforcent un faisceau : une demande imprévisible, des effets d'une tâche sur les autres, et un résultat difficile à mesurer (Alchian et Demsetz) [V]. Il oppose justement **les comptables et auditeurs** (faisceau fort, +5 % d'emploi projeté par le BLS jusqu'en 2034) aux **aides-comptables** (faisceau faible, −6 %) [V]. Le livre tiré de ces travaux, *Messy Jobs: The Work That AI Cannot Reach* (Garicano, Li et Wu, juin 2026, https://messyjobs.ai/), classe le travail intellectuel selon son « désordre » : d'un côté une tâche définie, de l'autre « un large faisceau de tâches complexes » difficiles à spécifier à l'avance [V, site]. Le chiffre souvent cité sur la radiologie est de 36 % du temps passé à lire des images, tiré d'une petite étude de 2013 citée de seconde main (Silicon Continent, 2 janv. 2026) [V].

**Analyse.** C'est la limite directe de l'exemple KPMG : l'agent IA fait des contrôles, mais l'auditeur vend une opinion signée, dont il répond, sur des données que le client ne sait pas toujours fournir proprement. L'emploi d'auditeur dépend du coût de séparation, pas seulement de la part de tâches faisables. **Limite** : ce sont des arguments théoriques et des projections du BLS ; la force du faisceau n'a pas encore de mesure publique par métier ni de test causal.

### 3.3 Les preuves qu'un faisceau lié protège

**Les données d'entreprise et la théorie convergent : à exposition moyenne égale, une exposition concentrée sur peu de tâches protège l'emploi.** Hampole, Papanikolaou, Schmidt et Seegmiller (NBER w33509, rév. sept. 2025) trouvent qu'un écart-type d'exposition moyenne des tâches réduit la part d'emploi du métier dans l'entreprise de 14,5 % en cinq ans, alors qu'un écart-type de concentration de l'exposition sur quelques tâches l'augmente de 7,5 %, le salarié se repliant sur ses autres tâches (p. 4) [R-19]. Gans et Goldfarb (« O-Ring Automation », NBER w34639, janv. 2026) montrent en théorie que les indices d'exposition, qui additionnent les risques des tâches, « surestiment les suppressions d'emplois quand les tâches sont complémentaires » [résumé]. Autor et Thompson (« Expertise », NBER w33941, 2025 ; *JEEA* 23(4) : 1203-1271) trouvent, sur 1977-2018, que l'automatisation a **relevé** les salaires et **réduit** l'emploi là où elle a supprimé les tâches peu expertes d'un métier, et **baissé** les salaires et **augmenté** l'emploi là où elle a supprimé les tâches expertes [résumé, période À VÉRIFIER].

**Analyse.** Pour l'orientation, la question utile n'est pas « quelle part de ce métier l'IA sait-elle faire ? », mais « que reste-t-il, et ce reste forme-t-il un métier ? ». Une mesure de risque doit donc récompenser les métiers dont l'exposition est concentrée et dont les tâches restantes demandent du jugement. **Limite** : la seule preuve empirique directe (Hampole et al.) porte sur l'IA d'avant 2023 et sur les offres et CV américains.

---

## 4. Hosseini et Lichtinger : ce que leur mesure permet

**Leur mesure est la seule à noter, tâche par tâche, à la fois ce que l'IA sait faire et l'expertise qu'il faut avec et sans elle ; c'est la meilleure base disponible pour une mesure de codifiabilité.** Seyed Mahdi Hosseini Maasoum est doctorant en économie à Harvard (2024-2030), après deux ans d'assistant de recherche à la LSE (CV, https://raw.githubusercontent.com/s-mahdihosseini/Website/HEAD/Hosseini-CV.pdf) [V]. Ses deux papiers avec Guy Lichtinger :
- « Generative AI as Seniority-Biased Technological Change » : en révision pour le *Journal of Labor Economics* selon son site ; résultats en § 3.1 [V].
- « Generative AI and Occupational Entry Barriers: The Labor Supply Channel of Technological Change » (première version janvier 2026 ; versions du 9 février et du 6 octobre 2026 lues ; ancien titre « Generative AI, Expertise, and Effective Labor Supply ») [V]. Aucune version d'avril 2026 trouvée.

**Construction de la mesure** (version de février, annexes A.4 à A.9, et fichiers du dépôt https://github.com/s-mahdihosseini/GenAI_Expertise) [V] :
1. **Tâches** : 19 265 énoncés de tâches O*NET, 923 métiers. Trois métiers dont toutes les tâches sont automatisables sont retirés (souscripteurs d'assurance, agents de voyage, télévendeurs), d'où 920 métiers.
2. **Automatisation** : GPT-5.2 note chaque tâche selon les capacités des LLM de « décembre 2025 », sur une échelle T0 à T4 : T0, aucune partie utile ; T1, 0 à 50 % ; T2, 50 à 80 % ; T3, 80 à 100 % avec supervision humaine ; T4, 100 % sans supervision courante. `auto_hl_bi` vaut 1 pour T3 ou T4 : 4 107 tâches, soit 21,3 %.
3. **Expertise** : le même modèle note de 1 à 5 l'expertise de chaque tâche, définie comme un savoir qui « fait barrière à l'entrée » et porte une prime de salaire, puis le temps de formation minimal. Correspondance moyenne : 1 = 0,25 mois, 2 = 1, 3 = 4, 4 = 12, 5 = 60 mois (tableau 1, p. 14). Une seconde notation donne l'expertise **avec un assistant IA**. Llama 3.3 70B et Claude Haiku 4.5 servent de contrôle.
4. **Agrégation** : moyenne par métier, poids 1 pour les tâches « Core » et 0,5 pour les tâches « Supplemental ». `avg_auto_hl_bi` est cette moyenne pondérée de `auto_hl_bi` (vérifié sur les 920 métiers).

**Résultats du papier sur les barrières à l'entrée.** Un métier demande en moyenne 9,6 mois de formation (médiane 5,2) avant l'IA (version de février, p. 15). Avec l'IA, la part des tâches de niveau 4 passe de 30,0 % à 8,4 % (p. 16). En moyenne, 11 % de la population active supplémentaire devient qualifiée pour un métier donné (p. 20 ; 11,6 % dans la version d'octobre, p. 22). Retirer seulement les tâches automatisées **relève** l'exigence d'expertise dans 62 % des métiers, car ce sont les tâches les plus faciles qui partent (version d'octobre, p. 21) [V]. C'est le mécanisme d'Autor et Thompson.

**Ce que le dépôt contient.** `Final_Task_Dataset.xlsx` (19 265 tâches : automatisation, expertise sans et avec IA, notes des modèles de contrôle, importance, fréquence, poids, mois de formation) et `Final_Occupation_Dataset.xlsx` (920 métiers, 25 colonnes : `avg_auto_hl_bi`, mois de formation `avg_mmwo_*`, part qualifiée avant et après, `pss`, `expertise_percentile`, `ai_exposure_share`, emploi et salaires OEWS 2024). La colonne `auto_hl_bi` du fichier métier vaut 0 partout et ne doit pas être utilisée. **Le dépôt n'a pas de licence** : tous droits réservés par défaut [V].

**Ce que le projet utilise.** Seulement `avg_auto_hl_bi`, en moyenne non pondérée par famille dans la Boussole (`site/build_data.py`) et en rang centile dans le scénario « IA rapide » de l'indice de risque (`scripts/build_risque_filieres.py`) [V].

**Peut-on en tirer une mesure de codifiabilité ?** Les auteurs n'ont pas de variable « codifiable » ou « tacite » ; le mot « tacite » n'apparaît que dans leurs consignes au modèle [V]. Mais la **baisse d'expertise avec l'IA** est une codifiabilité « révélée » : elle dit quelles tâches demandaient un savoir long à acquérir que l'outil rend accessible. calcul du GT sur leur fichier : 63,2 % des tâches deviennent moins expertes avec l'IA, 1,9 % plus expertes. Par métier, cette baisse corrèle à 0,40 avec `avg_auto_hl_bi` mais à 0,08 seulement avec la codifiabilité classique tirée d'O*NET (Spearman, 911 métiers). Pour les comptables et auditeurs, 91 % des tâches **non automatisées** deviennent plus faciles avec l'IA, contre 37 % pour les avocats [V, calcul du GT]. **Analyse** : pour l'audit, le risque principal n'est peut-être pas la disparition des postes, mais l'arrivée de candidats moins formés et la pression sur les salaires, ce que leur modèle prédit. **Limites** : une seule notation par un seul modèle, des capacités datées de décembre 2025, et le fichier du dépôt correspond à la version de février, pas à celle d'octobre (part qualifiée supplémentaire 0,110 contre 0,116).

---

## 6. Ce qu'on en tire pour la Boussole et l'indice de risque

1. **Ne pas ajouter la « routine » classique.** Mesurée par O*NET, elle désigne surtout du travail manuel répétitif que l'IA générative ne touche pas (couvreurs, opérateurs de presse en tête du classement) ; elle ne prédit pas l'exposition (§ 2.2).
2. **Mesurer la codifiabilité de l'information.** Quatre items Work Context (répétition, exactitude, tâches fixées par d'autres, peu de liberté de décision), comptés seulement pour le travail sur de l'information. Détail, prototype et validation : `2026-11-19-donnees-publiques.md`, § 3.
3. **S'en servir pour séparer automatisation et augmentation, pas comme sixième composante.** À exposition égale, codifiable et peu discrétionnaire = côté automatisation ; exposé mais discrétionnaire = côté augmentation. Le prototype montre que, ajoutée à part, elle recompterait l'exposition dans les métiers de bureau.
4. **Ajouter deux informations de Hosseini et Lichtinger qui manquent à l'indice.** La baisse d'expertise avec l'IA (§ 4), qui annonce plus de concurrence à l'entrée et une pression sur les salaires plutôt que des suppressions ; et, à terme, la concentration de l'exposition sur peu de tâches (Hampole et al.), approximation de la force du faisceau tant qu'il n'existe pas de mesure de Garicano par métier.
5. **Régler la licence** des données de Hosseini et Lichtinger avant toute publication (dépôt sans licence).
6. **Dire honnêtement ce que montre l'exemple KPMG** : une capacité annoncée dans un pilote, pas une baisse d'emplois. Les seules preuves d'effet sur l'emploi en audit portent sur les juniors (Fedyk et al., 2022) ; les auditeurs sont aussi l'exemple type d'un faisceau fort (Garicano, 2026).

---

## Sources

**Lues dans cette session (texte intégral ou extraits indiqués)**
- Acemoglu, D. (2024), « The Simple Macroeconomics of AI », NBER w32487, https://www.nber.org/papers/w32487 ; *Economic Policy*, 2025.
- Acemoglu, D. et Autor, D. (2011), « Skills, Tasks and Technologies », *Handbook of Labor Economics* 4B ; NBER w16082, https://www.nber.org/papers/w16082 (annexe p. 93).
- Autor, D. (2014), « Polanyi's Paradox and the Shape of Employment Growth », NBER w20485, https://www.nber.org/papers/w20485.
- Autor, D. (2024), « Applying AI to Rebuild Middle Class Jobs », NBER w32140, https://www.nber.org/papers/w32140.
- Autor, D., Levy, F. et Murnane, R. (2003), *QJE* 118(4) : 1279-1333, https://economics.mit.edu/sites/default/files/publications/the%20skill%20content%202003.pdf.
- Bergeaud, A. (2024), « Exposition à l'intelligence artificielle générative et emploi », HEC, janvier 2024 (voir le fichier de données).
- Brynjolfsson, E., Li, D. et Raymond, L. (2025), *QJE* 140(2) : 889-942 ; NBER w31161.
- Cui, Z., Demirer, M., Jaffe, S., Musolff, L., Peng, S. et Salz, T., *Management Science*, DOI 10.1287/mnsc.2025.00535.
- Dell'Acqua, F. et al. (2023), HBS WP 24-013, https://mitsloan.mit.edu/sites/default/files/2023-10/SSRN-id4573321.pdf.
- Deming, D. (2019), « In the Salary Race, Engineers Sprint but English Majors Endure », *New York Times*, 20 sept., https://www.nytimes.com/2019/09/20/business/liberal-arts-stem-salaries.html.
- Deming, D. (2025), « Shorting the AI jobs apocalypse », *Forked Lightning*, 2 sept., https://forklightning.substack.com/p/shorting-the-ai-jobs-apocalypse.
- « Value to a Degree », *The Practice*, Harvard Law School, juillet-août 2026, https://clp.law.harvard.edu/article/value-to-a-degree/.
- Eloundou, T., Manning, S., Mishkin, P. et Rock, D. (2024), « GPTs are GPTs », *Science* ; arXiv 2303.10130 v5, https://arxiv.org/abs/2303.10130.
- Fedyk, A., Hodson, J., Khimich, N. et Fedyk, T. (2022), « Is Artificial Intelligence Improving the Audit Process? », *Review of Accounting Studies* 27 : 938-985.
- Felten, E., Raj, M. et Seamans, R. (2023), arXiv 2303.01157, https://arxiv.org/abs/2303.01157 ; (2021), *SMJ* 42(12) : 2195-2217.
- Garicano, L., Li, J. et Wu, Y. (2026), « Weak Bundle, Strong Bundle: How AI Redraws Job Boundaries », CEPR DP21453, https://cepr.org/publications/dp21453 ; *Messy Jobs*, https://messyjobs.ai/.
- Garicano, L. (2026), « A New Year's letter to a young person: Take the messy job », 2 janv., https://www.siliconcontinent.com/p/a-new-years-letter-to-a-young-person ; « The task is not the job », 24 avril, https://www.siliconcontinent.com/p/why-desk-jobs-survive-and-amodei.
- Hosseini, S. M. et Lichtinger, G. (2026), « Generative AI as Seniority-Biased Technological Change », 25 mai 2026, https://raw.githubusercontent.com/s-mahdihosseini/Website/HEAD/GenAI_Senbias_5_25_2026.pdf ; « Generative AI and Occupational Entry Barriers », versions des 9 févr. et 6 oct. 2026 (SSRN 6059674) ; données https://github.com/s-mahdihosseini/GenAI_Expertise ; site https://sites.google.com/view/mahdi-hosseini/research.
- Humlum, A. et Vestergaard, E., NBER w33777, rév. mars 2026 (« Still Waters, Rapid Currents… »).
- Peng, S. et al. (2023), arXiv 2302.06590.
- Webb, M. (2020), https://www.michaelwebb.co/webb_ai.pdf.
- *Irish Times* (reprise du *Financial Times*), 18 nov. 2026, https://www.irishtimes.com/business/2026/11/18/ai-asked-better-questions-than-kpmg-accountants-in-pilot-audit-of-effectiveness/.

**Références vérifiées (revue, volume, pages) sans lecture du texte** : Garicano (2000), *JPE* 108(5) : 874-904 ; Garicano et Rossi-Hansberg (2006), *QJE* 121(4) : 1383-1435 ; (2015), *Annual Review of Economics* 7 : 1-30 ; Ide et Talamàs (2025), *JPE* 133(12) : 3762-3800 ; Gans et Goldfarb, NBER w34639 ; Autor et Thompson, NBER w33941, *JEEA* 23(4) : 1203-1271 ; Deming et Noray (2020), *QJE* 135(4) : 1965-2005.

**Reprises des dossiers internes** : notes 18 et 19 de ce dépôt ; mémo Deming du 8 nov. 2026 (Deming 2017 ; Hanushek et al. 2017 ; Gathmann et Schönberg 2010 ; Hampole et al. 2025).

---

## Non vérifié

- **Clip de BFM Business du 19 nov. 2026** : non retrouvé ; URL du *Financial Times* d'origine non trouvée ; la formule « aussi bon que les humains dans la plupart des cas » n'est que dans des reprises secondaires. Déploiement américain de KPMG Clara (17 nov. 2026, « plus de 125 équipes américaines ») : source générée par IA (unite.ai), sans communiqué de KPMG trouvé.
- **Eloundou et al.** : la version *Science* (384(6702) : 1306-1308, pages non vérifiées) donne d'autres chiffres que la version arXiv (1,8 % des emplois avec plus de la moitié des tâches exposées aux LLM seuls, un peu plus de 46 % avec les logiciels complémentaires, selon un résumé) ; seuls les chiffres arXiv sont cités ici.
- **Brynjolfsson, Li et Raymond** : chiffres de la version publiée (+15 %, 5 172 agents) lus en résumé seulement.
- Noy et Zhang (2023) ; Choi, Monahan et Schwarcz (2024) ; Schwarcz et al. (2026, gains de 38-115 % ou 50-130 % selon la version) ; Frey et Llanos-Paredes (2025) ; Demirci, Hannane et Zhu (2025) ; Hui, Reshef et Zhou (2024) ; Choi et Xie (2025) ; Downing (2026) : **résumés seulement**.
- Ide et Talamàs (2025), Gans et Goldfarb (2026), Autor et Thompson (2025) : résumés seulement ; la période d'Autor et Thompson n'est pas vérifiée.
- Garicano et Rossi-Hansberg (2006, 2015), Garicano (2000) : contenu décrit de mémoire du modèle, références vérifiées.
- Pages du *Handbook* (Acemoglu et Autor, 2011) et volume d'*Economic Policy* (Acemoglu, 2025) non vérifiés.
- Radiologues : 36 % du temps à lire des images, étude de 2013 citée de seconde main par Garicano ; le « tiers » du mémo du 8 novembre est une approximation.
- Hosseini et Lichtinger : pages SSRN inaccessibles (403) ; pas de version d'avril 2026 trouvée ; le fichier du dépôt correspond à la version de février 2026 ; la page de son site n'a été lue qu'à travers un résumé automatique ; nombre de travailleurs incohérent dans le papier (65 ou 66 millions).
- Valeur d'option des études (par exemple Stange, 2012, *AEJ: Applied*) : non revue, référence non vérifiée.
- Dares *Conditions de travail* 2024 : premiers résultats connus seulement par une dépêche AFP.
- Corrélations du prototype : non pondérées par l'emploi, calculées sur des métiers américains ; à refaire pondérées et après passage aux spécialités françaises.
{% endraw %}
