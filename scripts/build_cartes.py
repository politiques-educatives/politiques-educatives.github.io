#!/usr/bin/env python3
"""Write the data of the département maps (type « carte » in _data/graphiques.yml) from official open data.

Usage: python3 scripts/build_cartes.py   (needs pandas and openpyxl; run by hand, not by the monthly workflow)

Inputs (raw, never modified) in ../data/raw-new/ : see SOURCE.txt in each folder.
  handicap-cartes/drees-vqs-2021-departements-proportions.xlsx   DREES, enquête Vie quotidienne et santé 2021
  ecole-cartes/depp-effectifs-ecoles-par-departement-secteur-2009-2025.csv   DEPP, effectifs d'élèves par école (agrégé)
  ecole-cartes/projections-departement-2025-2035-datagouv.csv   DEPP, projections à horizon 2035 (fichiers académiques au format CSV)
Output: assets/charts/data/<id>.csv, columns categorie (code du département), serie (nom), valeur.
The map outline is assets/charts/geo/departements.geojson (métropole, gregoiredavid/france-geojson, simplifié, 3 décimales).
"""
import csv, json, os
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "..", "data", "raw-new")
OUT = os.path.join(ROOT, "assets", "charts", "data")
GEO = os.path.join(ROOT, "assets", "charts", "geo", "departements.geojson")
NAMES = {f["properties"]["code"]: f["properties"]["nom"] for f in json.load(open(GEO, encoding="utf-8"))["features"]}
NAMES.update({"971": "Guadeloupe", "972": "Martinique", "973": "Guyane", "974": "La Réunion", "976": "Mayotte"})
DEPS = set(NAMES)  # 96 départements de métropole + 5 DROM (hors collectivités d'outre-mer)


def write(name, values):
    with open(os.path.join(OUT, name + ".csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(("categorie", "serie", "valeur"))
        for code in sorted(values):
            w.writerow((code, NAMES[code], round(values[code], 1)))
    v = list(values.values())
    print(f"{name}: {len(v)} départements, de {min(v):.1f} à {max(v):.1f}")


# 1. DREES VQS 2021 : part des 25-59 ans avec au moins une limitation fonctionnelle sévère (onglet LIMFONC)
x = pd.read_excel(os.path.join(RAW, "handicap-cartes", "drees-vqs-2021-departements-proportions.xlsx"), sheet_name="LIMFONC", header=None)
lim = {}
for _, r in x.iterrows():
    if isinstance(r[1], str) and "- " in r[1] and r[2] == "Oui" and isinstance(r[4], (int, float)):   # colonnes : département, Oui/Non, 5-24, 25-59, 60+
        lim[r[1].split("-")[0].strip()] = float(r[4])
write("handicap-limitations-dep", {k: v for k, v in lim.items() if k in DEPS})

# 2. DEPP : évolution des effectifs du premier degré (public et privé sous contrat), rentrées 2015 à 2025
e = pd.read_csv(os.path.join(RAW, "ecole-cartes", "depp-effectifs-ecoles-par-departement-secteur-2009-2025.csv"), dtype={"code_departement": str}, encoding="utf-8-sig")
e["an"] = e["rentree_scolaire"].str[:4].astype(int)
t = e[e.an.isin([2015, 2025])].groupby(["code_departement", "an"])["eleves"].sum().unstack()
write("ecole-effectifs-dep", {k: (r[2025] / r[2015] - 1) * 100 for k, r in t.iterrows() if k in DEPS and r[2015] > 0})

# 3. DEPP : évolution projetée des effectifs du premier degré, 2025-2035, scénario intermédiaire
p = pd.read_csv(os.path.join(RAW, "ecole-cartes", "projections-departement-2025-2035-datagouv.csv"), dtype={"code_departement": str})
q = p[p.niveau == "Total premier degré"].groupby("code_departement")[["2025", "2035"]].sum()
print("contrôle national 2025 / 2035 :", int(q["2025"].sum()), int(q["2035"].sum()), "(DEPP : 6 149 400 / 5 216 439)")
write("ecole-projection-dep", {k: (r["2035"] / r["2025"] - 1) * 100 for k, r in q.iterrows() if k in DEPS})
