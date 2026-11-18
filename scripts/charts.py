#!/usr/bin/env python3
"""Build the « Constat » charts (PNG + CSV) and _data/charts.yml.

Usage: python3 scripts/charts.py [--fetch]
  --fetch   refresh the InserSup charts from the public MESR API (fr-esr-insersup); used by
            .github/workflows/charts.yml once a month. Without it, the last published values below are used.

Every figure is copied from a GT Éducation note or research file, with its source in the caption
(_data/charts.yml). Static charts (DEPP, PISA, RERS, LIFT) are updated by hand when a new edition is out.
"""
import csv, datetime, json, os, sys, urllib.parse, urllib.request

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "charts")
DATA = os.path.join(OUT, "data")
os.makedirs(DATA, exist_ok=True)

# reference palette (dataviz skill), validated light mode: blue, orange
C1, C2 = "#2a78d6", "#eb6834"
INK, INK2, MUTED, GRID, SURF = "#1d2433", "#4a5468", "#6b7385", "#e3e6ec", "#ffffff"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10.5, "axes.edgecolor": GRID,
                     "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2,
                     "axes.spines.top": False, "axes.spines.right": False, "axes.spines.left": False,
                     "figure.facecolor": SURF, "axes.facecolor": SURF})


def fr(x, d=1):
    s = f"{x:.{d}f}".replace(".", ",")
    return s[:-2] if d and s.endswith(",0") else s


def save(fig, name, rows, header):
    fig.savefig(os.path.join(OUT, name + ".png"), dpi=160, bbox_inches="tight")
    plt.close(fig)
    with open(os.path.join(DATA, name + ".csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)


def grouped(name, cats, s1, s2, l1, l2, header, ylabel="%"):
    fig, ax = plt.subplots(figsize=(7.2, 3.6))
    x = range(len(cats)); w = 0.36
    for off, vals, col, lab in ((-w / 2 - 0.01, s1, C1, l1), (w / 2 + 0.01, s2, C2, l2)):
        bars = ax.bar([i + off for i in x], vals, w, color=col, label=lab, zorder=2)
        for b, v in zip(bars, vals):
            ax.text(b.get_x() + b.get_width() / 2, v + 1, fr(v), ha="center", va="bottom", fontsize=9, color=INK)
    ax.set_xticks(list(x)); ax.set_xticklabels(cats)
    ax.yaxis.grid(True, color=GRID, zorder=0); ax.set_ylabel(ylabel)
    ax.legend(frameon=False, loc="upper left", ncol=2)
    ax.set_ylim(0, max(s1 + s2) * 1.18)
    save(fig, name, [[c, a, b] for c, a, b in zip(cats, s1, s2)], header)


# ---------- 1. Seconde 2026 vs 2019 (DEPP, test de positionnement de seconde 2026)
grouped("seconde", ["Maths\n2de GT", "Maths\n2de pro", "Français\n2de GT", "Français\n2de pro"],
        [19.2, 66.2, 18.7, 65.7], [28.1, 75.4, 22.1, 69.8], "2019", "2026",
        ["groupe", "part_groupes_faibles_2019_pct", "part_groupes_faibles_2026_pct"],
        ylabel="% dans les groupes faibles")

# ---------- 2. PISA, compréhension de l'écrit, élèves sous le niveau 2 (DEPP, NI 26.40)
yrs, fra = [2000, 2018, 2022, 2025], [15, 21, 27, 33]
fig, ax = plt.subplots(figsize=(7.2, 3.4))
ax.plot(yrs, fra, color=C1, lw=2, marker="o", ms=8, zorder=3, label="France")
for x, y in zip(yrs, fra):
    ax.text(x, y + 1.6, f"{y} %", ha="center", fontsize=9.5, color=INK)
ax.plot([2025], [30], marker="D", ms=8, color=C2, ls="none", zorder=3, label="Moyenne OCDE 2025")
ax.text(2025.4, 30, "OCDE 30 %", va="center", fontsize=9, color=INK2)
ax.set_ylim(0, 40); ax.set_xticks(yrs); ax.yaxis.grid(True, color=GRID, zorder=0)
ax.set_ylabel("% d'élèves de 15 ans sous le niveau 2"); ax.legend(frameon=False, loc="upper left")
save(fig, "pisa", [[y, v, ""] for y, v in zip(yrs, fra)] + [[2025, "", 30]], ["annee", "france_pct", "ocde_pct"])

# ---------- 3. Le filtre social du master (MESR, RERS 2025)
grouped("filtre", ["Enfants d'ouvriers", "Enfants de cadres"], [10, 31], [6, 42], "en licence", "en master",
        ["origine", "part_etudiants_licence_pct", "part_etudiants_master_pct"], ylabel="% des étudiants")

# ---------- 4. Embauches en CDI des 21-29 ans, nov. 2022-mars 2026 (LIFT, 2026)
fig, ax = plt.subplots(figsize=(7.2, 2.2))
labs, vals = ["Métiers les moins exposés à l'IA", "Métiers les plus exposés à l'IA"], [-7.5, -28.3]
bars = ax.barh(labs, vals, color=[C1, C2], height=0.5, zorder=2)
for b, v in zip(bars, vals):
    ax.text(v - 0.6, b.get_y() + b.get_height() / 2, fr(v) + " %", ha="right", va="center", fontsize=9.5, color=INK)
ax.set_xlim(-34, 0); ax.xaxis.grid(True, color=GRID, zorder=0); ax.axvline(0, color=INK2, lw=1)
ax.set_xlabel("Variation des embauches en CDI des 21-29 ans (%)")
save(fig, "embauches", [[l, v] for l, v in zip(labs, vals)], ["groupe", "variation_pct"])

# ---------- 5-6. InserSup : emploi salarié à 30 mois par diplôme (auto)
LAST = {  # last published values (InserSup 2026_S1), used when --fetch is not given or fails
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

fig, ax = plt.subplots(figsize=(7.2, 3.2))
labs = [b[0] for b in ins["bars"]]; vals = [b[1] for b in ins["bars"]]
cols = [C2 if "Licence générale" in l else C1 for l in labs]
bars = ax.barh(labs[::-1], vals[::-1], color=cols[::-1], height=0.55, zorder=2)
for b, v, s in zip(bars, vals[::-1], [x[2] for x in ins["bars"]][::-1]):
    ax.text(v + 1, b.get_y() + b.get_height() / 2, f"{v} %  ·  {s:,} € net".replace(",", " "), va="center", fontsize=9, color=INK)
ax.set_xlim(0, 110); ax.xaxis.grid(True, color=GRID, zorder=0)
ax.set_xlabel("Diplômés en emploi salarié en France 30 mois après le diplôme (%)")
save(fig, "insersup", ins["bars"], ["diplome", "emploi_salarie_30_mois_pct", "salaire_median_net_mensuel_eur"])

fig, ax = plt.subplots(figsize=(7.2, 3.2))
for lab, col, mk in (("Licence pro", C1, "o"), ("Master", "#1d2433", "s"), ("Licence générale", C2, "^")):
    s = ins["trend"][lab]; xs = sorted(s)
    ax.plot(xs, [s[x] for x in xs], color=col, lw=2, marker=mk, ms=7, label=lab, zorder=3)
    ax.text(xs[-1] + 0.15, s[xs[-1]], lab, va="center", fontsize=9, color=INK2)
ax.set_ylim(40, 85); ax.yaxis.grid(True, color=GRID, zorder=0)
ax.set_xticks(sorted(ins["trend"]["Master"])); ax.set_xlabel("Promotion"); ax.set_ylabel("% en emploi salarié à 30 mois")
ax.set_xlim(None, max(ins["trend"]["Master"]) + 1.3); ax.legend(frameon=False, loc="lower center", bbox_to_anchor=(0.5, 1.0), ncol=3)
rows = [[lab, y, v] for lab, s in ins["trend"].items() for y, v in sorted(s.items())]
save(fig, "insersup-tendance", rows, ["diplome", "promotion", "emploi_salarie_30_mois_pct"])

# ---------- _data/charts.yml (dates and InserSup values for captions)
b = {x[0]: x for x in ins["bars"]}
with open(os.path.join(ROOT, "_data", "charts.yml"), "w", encoding="utf-8") as f:
    f.write(f"maj_le: {datetime.date.today().isoformat()}\n")
    f.write(f"insersup_version: \"{ins['version']}\"\ninsersup_promo: \"{ins['promo']}\"\ninsersup_promo_salaire: \"{ins['promo_salaire']}\"\n")
    for k, key in (("lg", "Licence générale"), ("lp", "Licence pro"), ("m", "Master"), ("ma", "Master en alternance"), ("lpa", "Licence pro en alternance")):
        f.write(f"{k}: {b[key][1]}\n{k}_salaire: {b[key][2]}\n")
print("charts ok", ins["version"])
