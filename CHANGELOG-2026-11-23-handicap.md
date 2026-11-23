# 23/11/2026 : deux doubles pages du hors-série du Monde (nov.-déc. 2026)

## Handicap et santé mentale (« Handicap : la bataille de l'égalité », p. 78-79)
- Sources (`_data/sources.yml`) : `lemonde-hs-2026-handicap` (secondaire), `drees-vqs-2021` (vérifié), `drees-pauvrete-handicap` (secondaire), `agefiph-tb-2025` (vérifié), `cerema-arrets-2026` (secondaire, chiffre à vérifier), `sncf-gares-accessibles` (secondaire, total de 3 000 gares à vérifier). DEPP et CNSA : fiches existantes (`depp-ni-25-63`, `cnsa-mdph-delais`).
- Graphiques : `handicap-scolarises` (DEPP, NI 25.63), `handicap-emploi` (Agefiph 2025), `handicap-pauvrete` (DREES via Le Monde), `handicap-accessibilite` (Le Monde, producteur non précisé), carte `handicap-limitations-dep` (DREES, VQS 2021, 25-59 ans : Le Monde montre les 15-64 ans, absents des données ouvertes).
- Cartes non refaites : délai de traitement des MDPH et taux d'accord de la PCH (CNSA). Le baromètre des MDPH n'est publié qu'en carte interactive (data.cnsa.fr/barometremdph), sans fichier ouvert par département (ni sur data-autonomie.cnsa.fr ni sur data.gouv.fr au 23/11/2026).
- Non refait : transports (deux chiffres d'unités différentes, sources non retrouvées) ; AESH (graphique `aesh` existant ; Le Monde donne 53 000 en 2017, le Cnesco environ 43 000).
- Rattachés à la section `handicap/handicap`.

## École et enseignants (« L'école et ses disparités persistantes », p. 30-31)
- Nouveau sujet `inegalites` (thème École et enseignants ; en-tête de `sources.yml`, `TAG2THEME` dans `assets/app.js`).
- Nouvelle section `ecole/demographie` « Moins d'élèves, des inégalités qui persistent ».
- Sources : `lemonde-hs-2026-ecole` (secondaire), `depp-projections-2035` (vérifié), `depp-effectifs-ecoles` (vérifié, calcul GT), `depp-geographie-ecole-2026` (secondaire). PISA 2025 : fiche existante `depp-pisa-2025`.
- Graphiques : `ecole-projections` (DEPP, DT 2026-E08 : les quatre points de 2035 sont 5 431 387, 5 216 439 et 5 001 491 dans le premier degré, scénarios haut, intermédiaire, bas, et 4 875 900 dans le second degré), cartes `ecole-effectifs-dep` (2015-2025) et `ecole-projection-dep` (2025-2035), `ecole-prive-social`, `ecole-ips`, `ecole-brevet`, `ecole-classes`, `ecole-pisa` (maths et écrit, 2003 et 2025).
- Non refaits : répartition des écoles par taille de classe (somme imprimée supérieure à 100 %) ; écart social PISA en sciences (légende ambiguë) ; points des écoles fermées sur la carte 2015-2025.

## Technique
- Nouveau type de graphique `carte` (choroplèthe des départements de métropole, Vega-Lite geoshape) dans `assets/app.js`, documenté en tête de `_data/graphiques.yml` ; contours `assets/charts/geo/departements.geojson` (gregoiredavid/france-geojson, version simplifiée, coordonnées à 3 décimales, 220 Ko). Les DROM sont dans les CSV mais pas sur la carte.
- `scripts/build_cartes.py` écrit les CSV des cartes depuis `../data/raw-new/handicap-cartes/` et `../data/raw-new/ecole-cartes/` (fichiers bruts, voir `SOURCE.txt`). Les projections par département viennent des fichiers académiques de la DEPP mis au format CSV sur data.gouv.fr (la page du ministère refuse les téléchargements automatiques) ; totaux contrôlés : 6 149 447 et 5 216 437 élèves (DEPP : 6 149 400 et 5 216 439).
- `scripts/charts.py` : séries statiques des neuf graphiques en barres et en ligne.
- `_config.yml` : les fichiers `CHANGELOG-*.md` ne sont pas publiés.
