# Propositions et données du GT Éducation (Préparer l'avenir)

Site de travail : https://politiques-educatives.github.io/ (non indexé). Source dans `horizons-education-ia/site-politiques-educatives/`.

| Fichier | Contenu |
|---|---|
| `_data/propositions.yml` | Propositions (une fiche chacune : explication, preuves, note) |
| `_data/livret.yml`, `_data/livret_ajouts.yml` | Livret du programme (18/11/2026) : mesures éducation et notre évaluation ; ce que nos travaux ajoutent |
| `_data/v12.yml` | Version v12 « Éducation : penser pratique » face aux ajouts du GT (section repliée) |
| `_data/milburn.yml`, `_data/comms.yml`, `_data/calendrier.yml`, `_data/notes.yml` | Onglets Milburn, Comms, Calendrier, Notes |
| `_data/notes_generees.yml` | Notes produites par le générateur (bouton « Générer une note », formulaire `note.yml`) ; lu côté navigateur, absent = liste vide |
| `scripts/charts.py` | Graphiques du Constat (`--fetch` : InserSup depuis l'API publique) |
| `scripts/sync_boussole.sh` | Copie la Boussole (`../site/boussole-pipeline/`, index.html et tous les .js) dans `boussole/` |
| `.github/workflows/charts.yml` | Actualise les graphiques InserSup le 3 de chaque mois |
| `routines/routine-mensuelle.md` | Consigne de la veille mensuelle (pull request le 17) |
| `.github/ISSUE_TEMPLATE/feedback.yml` | Formulaire « Signaler une correction » relié à chaque fiche |

Construire localement : `sh scripts/sync_boussole.sh && python3 scripts/charts.py` puis `jekyll build` (ou GitHub Pages).
Les scripts adaptés au candidat (note comms) ne sont pas publiés ici, par choix.

## Générateur de notes (bouton « Générer une note »)

Le bouton ouvre le formulaire `.github/ISSUE_TEMPLATE/note.yml`. Si la demande vient du propriétaire (`ajoly35`), `.github/workflows/note-generator.yml` lance `scripts/note_generator.py` :
1. recherche Gemini Flash avec Google Search ; seuls les passages rattachés à une page réellement consultée sont gardés ;
2. vérification sans IA : chaque chiffre du passage doit figurer dans la source, et la source doit être officielle ou académique (liste `OFFICIAL`) ; au moins 5 faits vérifiés, sinon arrêt ;
3. rédaction Gemini 4 Carbon au format des notes du GT, à partir des seuls faits vérifiés ; tout chiffre de la note qui ne vient pas d'un fait vérifié est marqué « [à vérifier] » ;
4. `scripts/build_note.py` + gabarit `assets/note/template-v12.docx` (nettoyé : logo, styles et pied de page seulement) → `note.docx` et `note.pdf` dans `notes-generees/<date>-issue-<n>/`, avec `sources.json` et `a-verifier.md`.
Clé : secret `GEMINI_API_KEY` du dépôt. Coût plafonné à 1 $ par note (`MAX_RUN_USD`), environ 0,03 $ en pratique. Aucun nouvel essai automatique. Test local : `GEMINI_API_KEY=... python3 scripts/note_generator.py --sujet "..." --out /tmp/essai`.
