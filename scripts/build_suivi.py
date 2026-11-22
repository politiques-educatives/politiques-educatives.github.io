#!/usr/bin/env python3
"""Suivi en direct « L'IA et l'emploi des jeunes » : lit des séries publiques sans clé et écrit _data/suivi.json,
affiché dans la section Orientation et emploi > L'IA et l'emploi des débutants (bloc « suivi » de assets/app.js).

Sources
  Insee, BDM : taux de chômage BIT, trimestriel, CVS, France hors Mayotte : 001688537 (moins de 25 ans), 001688527 (ensemble)
  LIFT (HEC Paris), tracker « AI diffusion (jobs) », série mensuelle offers_total.csv (base JOCAS de la Dares) :
  offres demandant des compétences en IA générative et en IA de tout type (quatre catégories exclusives).
  On n'utilise pas general_results.csv : ses totaux ne concordent pas avec la série (vérifié le 22/11/2026,
  research/27-fde-forward-deployed-engineers/verification-lift.md).
Une source illisible garde ses chiffres précédents ; rien n'est estimé. Lancé chaque jour par .github/workflows/suivi.yml.
Usage : python3 scripts/build_suivi.py"""
import csv, datetime as dt, io, json, os, re, sys, urllib.request

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, "_data", "suivi.json")
UA = {"User-Agent": "politiques-educatives-suivi/1.0"}
INSEE = "https://bdm.insee.fr/series/sdmx/data/SERIES_BDM/{}?lastNObservations=12"
LIFT = "https://heclift.github.io/website/data/ai-trackers/diffusion-emploi/offers_total.csv"
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
        return r.read().decode("utf-8-sig")


def insee(idbank):
    obs = re.findall(r'TIME_PERIOD="(\d{4})-Q(\d)" OBS_VALUE="([\d.]+)"', get(INSEE.format(idbank)))
    return sorted((int(y), int(q), float(v)) for y, q, v in obs)


def chomage():
    jeunes, tous = insee("001688537"), insee("001688527")
    if not jeunes or not tous or jeunes[-1][:2] != tous[-1][:2]:
        raise ValueError("Insee : séries incomplètes ou décalées")
    y, q, v = jeunes[-1]
    prev = next((x[2] for x in jeunes if x[:2] == (y - 1, q)), None)
    return dict(periode=f"{q}{'er' if q == 1 else 'e'} trimestre {y}", jeunes=v, jeunes_an_avant=prev, ensemble=tous[-1][2],
                serie=[dict(t=f"{a} T{b}", v=c) for a, b, c in jeunes[-9:]],
                source="Insee, taux de chômage au sens du BIT, moins de 25 ans, France hors Mayotte, données CVS",
                url="https://www.insee.fr/fr/statistiques/serie/001688537")


def lift():
    rows = list(csv.DictReader(io.StringIO(get(LIFT))))
    cats = ["ia générative", "ia générale", "cv", "nlp"]
    m = {}
    for r in rows:
        k = (int(float(r["annee"])), int(float(r["mois"])))
        m[k] = (float(r["ia générative"] or 0), sum(float(r[c] or 0) for c in cats))
    if not m:
        raise ValueError("LIFT : série vide")
    end = max(m)
    quarters = {}
    for (y, mo), v in m.items():
        quarters.setdefault((y, (mo - 1) // 3 + 1), []).append(v)
    full = sorted(k for k, v in quarters.items() if len(v) == 3)
    qy, qn = full[-1]
    gen = sum(v[0] for v in quarters[(qy, qn)]); tot = sum(v[1] for v in quarters[(qy, qn)])
    prev = quarters.get((qy - 1, qn))
    return dict(fin=f"{MOIS[end[1] - 1]} {end[0]}", trimestre=f"{qn}{'er' if qn == 1 else 'e'} trimestre {qy}",
                ia_generative=int(gen), ia_toutes=int(tot), part_generative=round(100 * gen / tot, 1) if tot else None,
                ia_generative_an_avant=int(sum(v[0] for v in prev)) if prev and len(prev) == 3 else None,
                serie=[dict(t=f"{y} T{q}", v=int(sum(v[0] for v in quarters[(y, q)]))) for y, q in full[-9:]],
                source="LIFT (HEC Paris), tracker « AI diffusion (jobs) », série mensuelle tirée de la base JOCAS de la Dares",
                url="https://heclift.github.io/website/en/ai-trackers/diffusion-emploi/index.html")


def main():
    old = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
    out = dict(old)
    ok = 0
    for key, fn in (("chomage", chomage), ("lift", lift)):
        try:
            out[key] = fn(); ok += 1
        except Exception as e:  # une source en panne garde ses chiffres précédents
            print(f"{key} : non lu ({e}) ; chiffres précédents gardés", file=sys.stderr)
    if ok:
        out["lu_le"] = dt.date.today().isoformat()
    if not out.get("chomage") and not out.get("lift"):
        sys.exit("aucune donnée")
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(out, ensure_ascii=False)[:600])


if __name__ == "__main__":
    main()
