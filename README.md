# Propositions et données du GT Éducation (Préparer l'avenir)

Site de travail : https://politiques-educatives.github.io/ (non indexé). Source dans `horizons-education-ia/site-politiques-educatives/`.

| Fichier | Contenu |
|---|---|
| `_data/propositions.yml` | Propositions (une fiche chacune : explication, preuves, note) |
| `_data/livret.yml`, `_data/livret_ajouts.yml` | Livret du programme (18/11/2026) : mesures éducation et notre évaluation ; ce que nos travaux ajoutent |
| `_data/milburn.yml`, `_data/comms.yml`, `_data/notes.yml` | Rapport Milburn (International, « Politiques d'ailleurs »), Comms (Orientation et emploi, « Recherche et données »), notes PDF par sujet |
| `_data/politiques.yml` | Fiches d'une page « Politiques d'ailleurs » (onglet International), construites par `scripts/build_politiques.py` depuis `../notes/international/` ; PDF dans `assets/notes/` |
| `_data/ailleurs.json` | Faits de la carte internationale (blocs « Ce que font les autres pays », choisis par id dans `sections.yml`), construits par `scripts/build_ailleurs.py` (lancé par `sync_boussole.sh`) |
| `_data/voie_pro.yml` | Thème Voie pro : indice de risque des filières techniques (v1), construit par `scripts/build_voie_pro.py` depuis `../research/19-…/2026-11-19-mesure-risque.md` |
| `_data/notes_generees.yml` | Notes produites par le générateur (bouton « Générer une note », formulaire `note.yml`) ; lu côté navigateur, absent = liste vide |
| `scripts/charts.py` | Données des graphiques interactifs (CSV ; `--fetch` : InserSup depuis l'API publique) ; titres et sources dans `_data/graphiques.yml` |
| `scripts/build_cartes.py` | Données des cartes par département (type `carte` de `graphiques.yml`) depuis `../data/raw-new/handicap-cartes/` et `../data/raw-new/ecole-cartes/` (DREES, DEPP) ; contours dans `assets/charts/geo/departements.geojson` (métropole, simplifié) |
| `assets/charts/geo/zones-emploi.geojson`, `assets/charts/data/industrie-ze-*.csv` | Cartes de l'industrie par zone d'emploi (type `carte`, option `geo: zones-emploi`), copiées depuis `horizons-veille/site-programmes/data/cartes/` où les écrit `build/cartes_industrie.py` (Insee, Urssaf, ANCT ; idée : Le Monde, hors-série nov.-déc. 2026, p. 110-111) |
| `_data/sujets.yml` | Les quatre thèmes (titre, libellé d'onglet, phrase d'intro). Accueil, International et Boussole sont dans `index.html` ; les anciens liens (#ia/…, #gouvernance/…, #<thème>/essentiel|recherche|ailleurs) sont redirigés dans `assets/app.js` (LEGACY, OLDSEC) |
| `_data/sections.yml` | Les sections de chaque thème, dans l'ordre de lecture (En bref, Le chiffre clé, Ce que nous proposons, Pour aller plus loin) ; depuis le 23/11/2026, « Ce que font les autres pays » est la dernière section de chaque thème : la carte internationale limitée aux onglets du thème (clé `ailleurs` du thème) et les études étrangères, et tout ce qui est rattaché à chacune. À éditer à la main ; vérifier avec `python3 scripts/check_sections.py`. Ce qui n'est rattaché nulle part s'affiche dans « Tout le reste du thème » |
| `_data/sources.yml` | Base de preuves : une fiche par source, résumé détaillé, chiffre à citer, statut de vérification |
| `scripts/build_recherche.py` | Publie les dossiers de recherche sous `/recherche/` (noms et sections de travail retirés) et l'index de recherche |
| `scripts/build_note_ia.py` | Reprend le texte de la note IA et jeunes dans `_data/note_ia.yml` (le PDF n'est pas publié) |
| `assets/modele/` | Modèle de note (.md et .docx, construit par `scripts/build_note.py`) |
| `scripts/sync_boussole.sh` | Copie la Boussole (`../site/boussole-pipeline/`, index.html et tous les .js) dans `boussole/` |
| `.github/workflows/charts.yml` | Actualise les graphiques InserSup le 3 de chaque mois |
| `routines/routine-hebdomadaire.md` | Consigne de la veille hebdomadaire (pull request le lundi) |
| `.github/ISSUE_TEMPLATE/feedback.yml` | Formulaire « Signaler une correction » relié à chaque fiche |

Construire localement : `sh scripts/sync_boussole.sh && python3 scripts/build_politiques.py && python3 scripts/build_voie_pro.py && python3 scripts/charts.py && python3 scripts/build_cartes.py && python3 scripts/build_recherche.py && python3 scripts/build_note_ia.py` puis `jekyll build` (ou GitHub Pages).
Les scripts adaptés au candidat (note comms) ne sont pas publiés ici, par choix.

## Générateur de notes (« Rédiger une note », page d'accueil)

Le bouton ouvre le formulaire `.github/ISSUE_TEMPLATE/note.yml`. Si la demande vient du propriétaire (`ajoly35`), `.github/workflows/note-generator.yml` lance `scripts/note_generator.py` :
1. recherche Gemini Flash avec Google Search ; seuls les passages rattachés à une page réellement consultée sont gardés ;
2. vérification sans IA : chaque chiffre du passage doit figurer dans la source, et la source doit être officielle ou académique (liste `OFFICIAL`) ; au moins 5 faits vérifiés, sinon arrêt ;
3. rédaction Gemini 4 Carbon au format des notes du GT, à partir des seuls faits vérifiés ; tout chiffre de la note qui ne vient pas d'un fait vérifié est marqué « [à vérifier] » ;
4. `scripts/build_note.py` + gabarit `assets/note/template-v12.docx` (nettoyé : logo, styles et pied de page seulement) → `note.docx` et `note.pdf` dans `notes-generees/<date>-issue-<n>/`, avec `sources.json` et `a-verifier.md`.
Clé : secret `GEMINI_API_KEY` du dépôt. Coût plafonné à 1 $ par note (`MAX_RUN_USD`), environ 0,03 $ en pratique. Aucun nouvel essai automatique. Test local : `GEMINI_API_KEY=... python3 scripts/note_generator.py --sujet "..." --out /tmp/essai`.
