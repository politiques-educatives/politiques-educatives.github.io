#!/usr/bin/env python3
"""Theme « Voie pro, IA et concurrence chinoise »: the technical-tracks risk index (version 1) for the site.
Source: ../research/19-mesure-risque-filieres-techniques/2026-11-19-mesure-risque.md (section 3 and « 5 bis. Résultats v1 »).
Tables are parsed from the file; texts are copied from it (checked below: each must appear in the source once
Markdown markup is removed). No figure is added. Writes _data/voie_pro.yml.
Usage: python3 scripts/build_voie_pro.py
"""
import os, re, sys, yaml

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(HERE, "..", "research", "19-mesure-risque-filieres-techniques", "2026-11-19-mesure-risque.md")
md = open(SRC, encoding="utf-8").read()

def table_after(marker, n=0):
    """The first Markdown table after the line containing `marker` (n-th occurrence)."""
    i = -1
    for _ in range(n + 1):
        i = md.index(marker, i + 1)
    rows = []
    lines = md[i:].splitlines()
    for line in (lines if lines[0].startswith("|") else lines[1:]):
        if line.startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if not all(re.fullmatch(r"-+", c) for c in cells):
                rows.append(cells)
        elif rows:
            break
    return {"entetes": rows[0], "lignes": rows[1:]}

def fr(t):  # decimal point to comma in the numbers of the tables
    return {"entetes": t["entetes"], "lignes": [[re.sub(r"(?<=\d)\.(?=\d)", ",", c) for c in r] for r in t["lignes"]]}

def strip(s): return re.sub(r"\*\*|`|(?<![\w])\*(?=\S)|(?<=\S)\*(?![\w])", "", s)

TXT = {  # copied from the source file; « exact » ones are checked below
  "bref": [
    "**Choisir comme on compose un portefeuille.** Personne ne sait vraiment ce que l'IA, les robots ou le commerce avec la Chine vont changer d'ici à tes 30 ans. Alors, au lieu de parier sur un seul avenir, on regarde quelles formations restent un bon choix dans tous les avenirs possibles : celles où il faut des mains, du contact et du jugement, où les entreprises cherchent du monde, et d'où l'on peut rebondir vers un métier voisin.",
    "**Être exposé à l'IA ne veut pas dire être remplacé.** Savoir qu'une IA sait faire une partie des tâches d'un métier ne dit pas si elle va remplacer ou aider, ni si les entreprises recrutent, ni si l'on peut changer de métier. Notre indice regarde donc cinq choses : l'IA qui remplace vraiment, les robots, les embauches, la concurrence chinoise et la possibilité de rebondir.",
    "**Ce que cela donne** pour 468 spécialités de CAP, bac pro et BTS : parmi les 122 plus grandes spécialités de CAP et bac pro, 18 restent parmi les moins risquées quel que soit l'avenir (16,1 % des élèves) et 9 parmi les plus risquées (10,0 %). Les métiers de terrain (soins à la personne, réparation, couverture) s'en sortent mieux que les métiers de bureau, de la vente et de l'image.",
  ],
  "resultats": [
    "**Corrélation de rang avec l'exposition seule : 0,45** (468 spécialités ; 0,37 en v0) ; 0,55 sur les 122 grosses spécialités de CAP et bac pro (0,43 en v0). L'écart avec l'exposition reste net, mais il se réduit : une partie de l'écart v0 venait des projections américaines.",
    "**Robustesse** (122 spécialités de CAP et bac pro avec au moins 100 élèves, 244 298 élèves) : **18 spécialités dans le tiers le moins risqué dans les cinq scénarios (16,1 % des élèves)**, contre 16 et 15,7 % en v0 ; entrent la réparation des carrosseries en CAP et le CAP réparation entretien des embarcations de plaisance. **9 dans le tiers le plus risqué partout (10,0 % des élèves)**, contre 11 et 10,3 % ; sortent les deux options « produits mécaniques » et la maroquinerie, entre le CAP opérateur logistique.",
    "**Bureau contre terrain** (rang moyen pondéré par les élèves, CAP et bac pro) : bureau 0,85 (0,82 en v0), terrain 0,48 (0,51) ; pire scénario : bureau 0,96, terrain 0,63.",
  ],
  "apres_faibles": "Le CAP couvreur sort du top 10 de justesse (112e sur 122, risque 0,29) mais reste dans le tiers bas des cinq scénarios.",
  "apres_forts": "Le CAP conducteur d'engins de travaux publics ne figure plus dans cette liste : il était relié par erreur à la fabrication de matériaux de construction ; relié aux engins de chantier, son risque est de 0,44.",
  "batiment": [
    "**Comme attendu, la demande française fait baisser le bâtiment.** La composante demande du gros œuvre passe de 0,67 à 0,43, celle du charpentier de 0,82 à 0,48, celle du CAP chaudronnerie de 0,73 à 0,38. Rangs de risque : maçon 0,50 → 0,37, gros œuvre 0,58 → 0,37, charpentier 0,68 → 0,41. Ces spécialités repassent sous la médiane.",
    "**Le couvreur reste le cas le plus sûr du bâtiment** : 81 % de projets difficiles (BMO 2025-2026 ; 79,7 % publié pour 2026), tension 1,49 (valeur du métier, « Tableau 1 »).",
    "**La métallerie et le béton armé restent au-dessus de la médiane** (0,72 et 0,54) : robots élevés, demande à peine moyenne (part difficile 57 à 68 %).",
  ],
  "batiment_note": "(Tension 0,96 = valeur du domaine « Bâtiment, travaux publics » : le métier n'est pas dans les tableaux publiés du classeur.)",
  "lecture_tension": "Lecture : une tension élevée réduit le risque. C'est un choix : une tension forte peut aussi refléter des conditions de travail dures ou des salaires faibles (deux des sept facteurs de la Dares). Pour un jeune qui cherche un emploi, la tension reste un atout à court terme.",
  "echelle": "**Mise à l'échelle.** Composantes 1, 1 bis, 2, 3, 5 : rang centile parmi les 468 spécialités (0 = plus faible risque). Composante 4 : valeur directe (la plupart des spécialités sont à 0, un rang leur donnerait un risque fictif). Le taux d'emploi est classé à l'intérieur de son niveau (un CAP n'est pas comparé à un BTS).",
  "poids": "**Pourquoi ces poids.** La technologie (IA + robots) fait la moitié du score, parce que c'est la question posée. L'IA pèse plus que les robots parce que son usage est déjà observé, alors que les robots ne sont compétitifs en coût que pour 0,3 % des tâches et qu'il faudrait environ 40 ans pour atteindre 10 % au rythme historique de baisse des prix (Legate-Yang et Massenkoff, 2026). La demande compte pour un quart : c'est elle qui décide de l'embauche dans les cinq ans. La Chine ne pèse que 10 % car elle ne concerne que les spécialités industrielles. La transférabilité (15 %) n'est pas un risque en soi, c'est l'amortisseur : elle dit si l'on peut rebondir.",
  "demande_v1": "Seule la composante **demande** change ; les quatre autres composantes, les poids (demande 0,25) et les cinq scénarios sont ceux de la v0, pour que tout écart vienne des données françaises.",
  "limites": [
    "**166 FAP sur 226 n'ont que la tension de leur domaine** : la tension ne distingue donc pas maçon et carreleur.",
    "**La tension mesure 2024, la BMO 2025-2026.**",
    "**Le choix des qualifications** (3 et 6 pour le CAP, 4 et 6 pour le bac pro, 7 pour le BTS) est une hypothèse ; le sortant de CAP occupe souvent un poste peu qualifié.",
    "**Les métiers visés ne sont pas les métiers occupés.** Beaucoup de sortants de bac pro commerce travaillent ailleurs que dans la vente.",
    "**La faible IA « observée » des métiers d'études** (géomètre : 0,009 contre 0,40 d'exposition H-L) vient de ce que peu de géomètres utilisent Claude, pas de ce que l'IA ne sait pas faire leurs tâches. Le scénario « IA rapide » corrige cela : le bac pro technicien géomètre topographe est au rang 0,09 dans le scénario de base mais 0,74 dans le scénario « IA rapide », donc 0,73 dans le pire scénario. Il n'est **pas** robuste, et la vue portefeuille le dit.",
    "**Ce qui manque encore** : *Métiers 2030* ; le classeur complet des tensions (valeur par métier pour 166 FAP qui n'ont que celle de leur domaine) ; les métiers réellement occupés par les sortants ; le BUT.",
  ],
  "portefeuille": "Personne ne sait vraiment ce que l'IA, les robots ou le commerce avec la Chine vont changer d'ici à tes 30 ans. Alors, au lieu de parier sur un seul avenir, on regarde quelles formations restent un bon choix dans tous les avenirs possibles. Ce sont celles où il faut des mains, du contact et du jugement, où les entreprises cherchent du monde, et d'où l'on peut rebondir vers un métier voisin si le sien change. Un bon choix, c'est une formation qui ne te laisse pas sans solution si le monde prend un autre chemin que prévu.",
}
# lightly shortened (not checked word for word): variable and tool names and [V] markers removed, two « En bref » sentences joined
NOT_EXACT = {("bref", 0), ("bref", 2), ("bref", 1), ("limites", 0), ("limites", 1), ("limites", 5), ("apres_forts", 0), ("poids", 0)}
src_plain = strip(md)
bad = []
for k, v in TXT.items():
    for i, s in enumerate(v if isinstance(v, list) else [v]):
        if (k, i) in NOT_EXACT: continue
        if strip(s) not in src_plain: bad.append(f"{k}[{i}]: {s[:70]}")
if bad: sys.exit("Not found in the source:\n" + "\n".join(bad))

compo = table_after("| # | Composante |")
def clean(c):  # drop verification markers, file names and internal tool names from the method table
    c = re.sub(r" ?\[V\*?\]", "", strip(c))
    c = re.sub(r",? ?[\w/.-]+\.csv", "", c)
    c = re.sub(r",? reconstitué par cb2-voie-pro| \(local\)", "", c)
    return c.strip()
compo = {"entetes": ["Composante", "Ce qu'elle mesure", "Donnée", "Poids de base", "Limites"],
         "lignes": [[clean(r[1]), clean(r[2]), clean(r[3]), r[6], clean(r[7])] for r in compo["lignes"]]}
# version 1: only the demand component changes (section « 5 bis », table « Ce qui change dans la méthode »)
for r in compo["lignes"]:
    if r[0].startswith("Demande"):
        r[1] = "Version 1 : 1 − [½ bloc français (moyenne des rangs : tension, part difficile BMO, intensité BMO) + ¼ emploi à 12 mois InserJeunes + ¼ croissance BLS]"
        r[2] = "Tensions Dares-France Travail 2024 ; BMO 2025 et 2026 (France Travail) ; InserJeunes, cumul 2023-2024 ; BLS Employment Projections 2025-35"
        r[4] = "166 FAP sur 226 n'ont que la tension de leur domaine ; la tension mesure 2024, la BMO 2025-2026"
out = dict(TXT)
# The vocational-lycée map and the China layer of the Boussole: descriptions copied from the project README
# (../README.md, sections « Carte des lycées professionnels » and « Concurrence chinoise »), file names removed.
out["carte"] = ("1 894 lycées de métropole, 13 587 spécialités de bac pro et CAP. Par lycée : spécialités, élèves de terminale (rentrée 2023), "
                "emploi à 6 mois (InserJeunes, cumul 2023-2024), exposition à l'IA de chaque spécialité, concurrence chinoise pour les 53 spécialités "
                "industrielles, et industries de sa zone d'emploi (Urssaf 2024).")
out["carte_source"] = "Annuaire de l'éducation (coordonnées, 18/11/2026) ; InserJeunes ; Hosseini, S. M. et G. Lichtinger (2026), « Generative AI and Occupational Entry Barriers », SSRN 6059674 ; BACI ; Urssaf 2024. Boussole des formations, GT Éducation."
out["chine"] = ("Hausse des importations françaises depuis la Chine 2018-2024 par salarié des industries visées (BACI, emploi 2017), et exposition des "
                "287 zones d'emploi (Autor, Dorn et Hanson, 2013). Mesure d'exposition, pas un effet prouvé : le papier n'identifie pas encore d'effet sur l'emploi.")
out.update({
  "composantes": compo,
  "scenarios": table_after("| Scénario | IA (usage)"),
  "faibles": fr(table_after("**Les 10 risques les plus faibles (v1)**")),
  "forts": fr(table_after("**Les 10 risques les plus forts (v1)**")),
  "batiment_table": fr(table_after("### Le bâtiment, revérifié")),
  "source": "GT Éducation, « Du risque d'exposition au risque tout court : une mesure pour les filières techniques (CAP, bac pro, BTS) », note de méthode, 19 novembre 2026, résultats de la version 1. Document de travail.",
  "donnees": [
    ["Hosseini, S. M. et G. Lichtinger (2026), « Generative AI and Occupational Entry Barriers: The Labor Supply Channel of Technological Change », Harvard University, SSRN 6059674", "https://papers.ssrn.com/abstract=6059674"],
    ["Hosseini et Lichtinger (2026), données GenAI_Expertise (exposition des métiers à l'IA)", "https://github.com/s-mahdihosseini/GenAI_Expertise"],
    ["Massenkoff et McCrory (2026), Labor market impacts (IA observée)", "https://www.anthropic.com/research/labor-market-impacts"],
    ["Legate-Yang et Massenkoff (2026), What work can robots do?", "https://www.anthropic.com/research/what-work-can-robots-do"],
    ["Dares, tensions sur le marché du travail en 2024", "https://dares.travail-emploi.gouv.fr/publication/les-tensions-sur-le-marche-du-travail-en-2024"],
    ["Dares, nomenclature des familles professionnelles 2021 (table ROME → FAP)", "https://dares.travail-emploi.gouv.fr/donnees/la-nomenclature-des-familles-professionnelles-2021"],
    ["France Travail, enquête Besoins en main-d'œuvre (BMO) 2025 et 2026", "https://www.data.gouv.fr/datasets/enquete-besoins-en-main-doeuvre-bmo"],
    ["BLS, Employment Projections 2025-2035", "https://www.bls.gov/emp/"],
    ["InserJeunes (emploi des sortants de voie pro)", "https://data.education.gouv.fr"],
    ["ROME v4, France Travail (open data)", "https://www.francetravail.org/opendata/repertoire-operationnel-des-meti.html?type=article"],
  ],
})
with open(os.path.join(HERE, "_data", "voie_pro.yml"), "w", encoding="utf-8") as f:
    f.write("# Généré par scripts/build_voie_pro.py depuis research/19 (résultats v1). Ne pas modifier à la main.\n")
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
print("ok:", len(out["faibles"]["lignes"]), "faibles,", len(out["forts"]["lignes"]), "forts,", len(out["batiment_table"]["lignes"]), "bâtiment,", len(compo["lignes"]), "composantes")
