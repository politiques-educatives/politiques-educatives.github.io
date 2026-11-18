#!/usr/bin/env python3
"""Write the data of the live charts (assets/charts/data/*.csv, long format) and _data/charts.yml.

Usage: python3 scripts/charts.py [--fetch]
  --fetch   refresh the InserSup series from the public MESR API (fr-esr-insersup); used by
            .github/workflows/charts.yml once a month. Without it, the last published values below are kept.

The charts are drawn in the browser (Vega-Lite, assets/app.js) from these CSVs; their titles, captions and
sources are in _data/graphiques.yml. Every figure here comes from a GT Éducation note or research file.
Columns: categorie, serie, valeur [, salaire].
"""
import csv, datetime, json, os, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "assets", "charts", "data")
os.makedirs(DATA, exist_ok=True)


def write(name, rows, header=("categorie", "serie", "valeur")):
    with open(os.path.join(DATA, name + ".csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)


# ---------- static series (updated by hand with each new edition of the source)
STATIC = {
    # Inclusion
    "aesh": [["2017", "AESH", 43000], ["2025", "AESH", 139993]],  # Sénat PLF 2026 ; 2017 « environ 43 000 » (Cnesco 2026)
    "mdph": [["2023", "Délai moyen", 4.7], ["T2 2025", "Délai moyen", 4.4], ["2023", "Délai légal", 4], ["T2 2025", "Délai légal", 4]],
    # Écrans, santé mentale, IA à l'école
    "seconde": [["Maths 2de GT", "2019", 19.2], ["Maths 2de GT", "2026", 28.1], ["Maths 2de pro", "2019", 66.2], ["Maths 2de pro", "2026", 75.4],
                ["Français 2de GT", "2019", 18.7], ["Français 2de GT", "2026", 22.1], ["Français 2de pro", "2019", 65.7], ["Français 2de pro", "2026", 69.8]],
    "pisa": [["2000", "France", 15], ["2018", "France", 21], ["2022", "France", 27], ["2025", "France", 33], ["2025", "Moyenne OCDE", 30]],
    "depression": [["Filles", "Lycéens", 25.7], ["Garçons", "Lycéens", 11.7], ["Ensemble", "Lycéens", 19]],
    "psy": [["France (PsyEN)", "Élèves par psychologue", 1500], ["Finlande", "Élèves par psychologue", 780]],
    # IA, jeunes et emploi
    "filtre": [["Enfants d'ouvriers", "En licence", 10.1], ["Enfants d'ouvriers", "En master", 6.3],
               ["Enfants de cadres", "En licence", 31.1], ["Enfants de cadres", "En master", 42.1]],
    "embauches": [["Métiers les plus exposés à l'IA", "Embauches en CDI, 21-29 ans", -28.3], ["Métiers les moins exposés à l'IA", "Embauches en CDI, 21-29 ans", -7.5]],
    # Orientation et voie professionnelle
    "voeux": [["2de générale et technologique", "Premiers vœux satisfaits", 87.0], ["2de professionnelle", "Premiers vœux satisfaits", 61.3], ["CAP", "Premiers vœux satisfaits", 49.9]],
    "boursiers": [["Élèves boursiers", "Décision vers la voie professionnelle", 52.2], ["Autres élèves", "Décision vers la voie professionnelle", 33.3]],
    "licence-bac": [["Bac général", "Licence en 3 ou 4 ans", 46.1], ["Bac technologique", "Licence en 3 ou 4 ans", 14.0], ["Bac professionnel", "Licence en 3 ou 4 ans", 6.5]],
    "emploi6mois": [["Après un bac pro", "En emploi à 6 mois", 43], ["Après un BTS", "En emploi à 6 mois", 59]],
    # Socle : temps et formation des professeurs
    "heures": [["Primaire", "France", 900], ["Primaire", "Moyenne OCDE", 770], ["Primaire", "Angleterre (réel)", 893],
               ["Collège", "France", 720], ["Collège", "Moyenne OCDE", 710], ["Collège", "Angleterre (réel)", 777]],
    "formation": [["Professeurs des écoles", "Jours de formation par an", 2], ["Professeurs du second degré", "Jours de formation par an", 1.5],
                  ["Autres cadres A de l'État", "Jours de formation par an", 9.2]],
}
for k, v in STATIC.items():
    write(k, v)

# ---------- InserSup (refreshed monthly)
LAST = {
    "bars": [["Licence générale", 50, 1750], ["Licence pro", 78, 1990], ["Master", 69, 2370],
             ["Master en alternance", 77, 2580], ["Licence pro en alternance", 82, 2030]],
    "trend": {"Licence générale": {2019: 49.93, 2020: 51.92, 2021: 51.46, 2022: 52.28, 2023: 50.35},
              "Licence pro": {2019: 77.16, 2020: 78.58, 2021: 78.97, 2022: 78.48, 2023: 78.26},
              "Master": {2019: 67.26, 2020: 68.1, 2021: 69.47, 2022: 69.19, 2023: 68.6}},
    "promo": "2023", "promo_salaire": "2021", "version": "2026_S1",
}
API = "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-insersup/records"
TITLES = {("Licence générale", "ensemble"): "Licence générale", ("Licence professionnelle", "ensemble"): "Licence pro",
          ("Master LMD", "ensemble"): "Master", ("Master LMD", "apprentissage"): "Master en alternance",
          ("Licence professionnelle", "apprentissage"): "Licence pro en alternance"}


def num(s):
    try:
        return float(s)
    except (TypeError, ValueError):
        return None


def fetch():
    q = {"select": "promo,type_diplome_long,regime_inscription,nb_sortants_30,tx_sortants_en_emploi_sal_fr_30,salaire_q2_30",
         "where": 'uo_lib="National" and genre="ensemble" and nationalite="ensemble" and obtention_diplome="diplômé" '
                  'and libelle_diplome in ("Toute licence générale","Toute licence professionnelle","Tout master LMD")',
         "limit": "100"}
    with urllib.request.urlopen(API + "?" + urllib.parse.urlencode(q), timeout=60) as r:
        rows = json.load(r)["results"]
    by = {}
    for r in rows:
        p = r["promo"][0] if isinstance(r["promo"], list) else r["promo"]
        if "," in p:
            continue
        by.setdefault((r["type_diplome_long"], r["regime_inscription"]), {})[int(p)] = r
    bars, trend, promos, spromos = [], {}, set(), set()
    for key, lab in TITLES.items():
        d = by.get(key, {})
        ok = [y for y, r in d.items() if num(r["tx_sortants_en_emploi_sal_fr_30"]) is not None and (num(r["nb_sortants_30"]) or 0) >= 20]
        sal = [y for y, r in d.items() if num(r["salaire_q2_30"]) is not None]
        if not ok or not sal:
            raise ValueError("missing series " + lab)
        y, ys = max(ok), max(sal)
        promos.add(y); spromos.add(ys)
        bars.append([lab, round(num(d[y]["tx_sortants_en_emploi_sal_fr_30"])), int(num(d[ys]["salaire_q2_30"]))])
        if key[1] == "ensemble":
            trend[lab] = {yy: num(d[yy]["tx_sortants_en_emploi_sal_fr_30"]) for yy in sorted(ok)}
    return {"bars": bars, "trend": trend, "promo": "/".join(map(str, sorted(promos))),
            "promo_salaire": "/".join(map(str, sorted(spromos))), "version": "API " + datetime.date.today().isoformat()}


ins = LAST
if "--fetch" in sys.argv:
    try:
        ins = fetch()
    except Exception as e:  # keep the last published figures rather than break the site
        print("InserSup fetch failed, keeping last values:", e)

write("insersup", [[b[0], "Emploi salarié à 30 mois", b[1], b[2]] for b in ins["bars"]], ("categorie", "serie", "valeur", "salaire"))
write("insersup-tendance", [[str(y), lab, round(v, 1)] for lab, s in ins["trend"].items() for y, v in sorted(s.items())])

b = {x[0]: x for x in ins["bars"]}
with open(os.path.join(ROOT, "_data", "charts.yml"), "w", encoding="utf-8") as f:
    f.write(f"maj_le: {datetime.date.today().isoformat()}\n")
    f.write(f"insersup_version: \"{ins['version']}\"\ninsersup_promo: \"{ins['promo']}\"\ninsersup_promo_salaire: \"{ins['promo_salaire']}\"\n")
    for k, key in (("lg", "Licence générale"), ("lp", "Licence pro"), ("m", "Master"), ("ma", "Master en alternance"), ("lpa", "Licence pro en alternance")):
        f.write(f"{k}: {b[key][1]}\n{k}_salaire: {b[key][2]}\n")
print("charts data ok", ins["version"])
