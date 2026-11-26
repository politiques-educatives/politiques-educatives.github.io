#!/usr/bin/env python3
"""Publish the GT research files as readable pages under /recherche/ and build the search index.

Source: ../research/ (horizons-education-ia). Only the files listed in FILES are published. Excluded on purpose:
meeting notes (notes/reunions), the digest that names group members, the campaign-programme evaluation, the
press notes on campaign messaging. Lines naming group members or a candidate, and sections written as drafting
advice for a note, are dropped (they are printed so the drop can be checked).
Writes recherche/<slug>.md (Jekyll pages), _data/recherche.yml and assets/recherche-index.json.
Usage: python3 scripts/build_recherche.py
"""
import json, os, re

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(HERE, "..", "research")
FILES = [  # (path under research/, slug, sujets)
    ("01-england-governance-ors.md", "01-england-governance-ors", ["formation"]),
    ("02-groupes-niveau-tutorat.md", "02-groupes-niveau-tutorat", ["formation"]),
    ("03-inspection-evaluation.md", "03-inspection-evaluation", ["formation"]),
    ("04-inclusion.md", "04-inclusion", ["inclusion"]),
    ("05-orientation.md", "05-orientation", ["orientation"]),
    ("06-index-ia-formations.md", "06-index-ia-formations", ["orientation", "emploi"]),
    ("07-outil-ia-public.md", "07-outil-ia-public", ["ecrans"]),
    ("08-formation-enseignants.md", "08-formation-enseignants", ["formation"]),
    ("09-sante-mentale-inclusion/2026-11-17-brief-sante-mentale-handicap-inclusion.md", "09-brief-sante-mentale-handicap-inclusion", ["inclusion", "ecrans"]),
    ("09-sante-mentale-inclusion/2026-11-17-lecture-rapport-cianum-sortir-clandestinite.md", "09-lecture-rapport-cianum-sortir-clandestinite", ["ecrans"]),
    ("10-formation-continue/2026-11-17-brief-formation-continue-enseignants.md", "10-brief-formation-continue-enseignants", ["formation"]),
    ("12-milburn-review/2026-11-18-milburn-review.md", "12-milburn-review", ["emploi"]),
    ("13-masters-surdiplomes/2026-11-18-masters-job-market.md", "13-masters-job-market", ["emploi"]),
    ("13-masters-surdiplomes/2026-11-18-master-as-filter-evidence.md", "13-master-as-filter-evidence", ["emploi"]),
    ("13-masters-surdiplomes/2026-11-18-france-firms-master-filter-and-solutions.md", "13-france-firms-master-filter-and-solutions", ["emploi"]),
    ("14-baisse-niveau-causes/2026-11-18-why-scores-fall.md", "14-why-scores-fall", ["ecrans"]),
    ("16-calendrier-formation-continue/2026-11-19-calendrier-formation-continue.md", "16-calendrier-formation-continue", ["formation"]),
    ("17-verification-idees-orientation/2026-11-19-verification.md", "17-orientation-apprentissage-preuves", ["orientation", "emploi"]),
    ("18-ia-embauches-exposition/2026-11-19-ia-embauches-milburn.md", "18-ia-embauches-exposition", ["emploi"]),
    ("19-mesure-risque-filieres-techniques/2026-11-19-mesure-risque.md", "19-indice-risque-filieres-techniques", []),
    ("21-codifiabilite-portefeuille/2026-11-19-revue-codifiabilite.md", "21-codifiabilite-revue", []),
    ("21-codifiabilite-portefeuille/2026-11-19-donnees-publiques.md", "21-codifiabilite-donnees", []),
    ("22-comparaisons-propositions/2026-11-19-synthese.md", "22-cas-etrangers-propositions", ["formation", "orientation", "emploi", "ecrans"]),
]
NAMES = re.compile(r"gavini|rufenacht|virginie(?!-occidentale)|v[ée]ronique|\bmato\b|landau|lemesle|whatsapp\.com|slack\.com|drive\.google|docs\.google|"
                   r"\b(du|le|la|au|notre|ligne de la) candidate?\b|édouard philippe|edouard philippe|\bphilippe\b|edouardphilippe|mélenchon|\badrien\b|échange privé|note de campagne|scratchpad|/private/tmp|~/|mis de côté", re.I)
SUBS = [(re.compile(r"\s*\((amendé|amendée) par Adrien[^)]*\)", re.I), ""),
        (re.compile(r"\s+d'Adrien\b"), ""),
        (re.compile(r"calcul de session", re.I), "calcul du GT"),
        (re.compile(r",? par moi ou par un agent", re.I), ""),
        # 26/11/2026 : aucun label ni référence de parti sur le site
        (re.compile(r"GT Éducation, Préparer l'avenir", re.I), "GT Éducation"),
        (re.compile(r"Horizons education group", re.I), "GT Éducation"),
        (re.compile(r"\s*\(?Préparer l'avenir\)?", re.I), ""),
        (re.compile(r"livret « Croire en nous »", re.I), "programme")]
DROP_SECTIONS = re.compile(r"proposed insertions|pistes pour la note|insertions? propos|ce que le groupe peut reprendre|lecture pour le gt|reformuler la mesure|chiffres de la note de campagne|passer à la v1|prototype calculé aujourd|deming et le portefeuille", re.I)

index, listing = [], []
for path, slug, sujets in FILES:
    src = open(os.path.join(R, path), encoding="utf-8").read()
    out, skip, level = [], False, 0
    for line in src.splitlines():
        h = re.match(r"^(#+) ", line)
        if h:
            if skip and len(h.group(1)) <= level:
                skip = False
            if DROP_SECTIONS.search(line):
                skip, level = True, len(h.group(1))
                print(f"[{slug}] section dropped: {line.strip()[:80]}")
                continue
        if skip:
            continue
        for rx, rep in SUBS:
            line = rx.sub(rep, line)
        if NAMES.search(line):
            print(f"[{slug}] line dropped: {line.strip()[:100]}")
            continue
        out.append(line)
    body = "\n".join(out).strip() + "\n"
    title = next((l[2:].strip() for l in out if l.startswith("# ")), slug)
    body = re.sub(r"^# .*\n", "", body, count=1)
    fm = f"---\nlayout: recherche\ntitle: {json.dumps(title, ensure_ascii=False)}\nslug: {slug}\nsujets: {json.dumps(sujets)}\n---\n"
    with open(os.path.join(HERE, "recherche", slug + ".md"), "w", encoding="utf-8") as f:
        f.write(fm + "{% raw %}\n" + body + "{% endraw %}\n")
    plain = re.sub(r"[*_`#>|]+", " ", body)
    plain = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", plain)
    index.append({"slug": slug, "titre": title, "sujets": sujets, "texte": re.sub(r"\s+", " ", plain)})
    listing.append({"slug": slug, "titre": title, "sujets": sujets, "mots": len(plain.split())})

with open(os.path.join(HERE, "assets", "recherche-index.json"), "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False)
with open(os.path.join(HERE, "_data", "recherche.yml"), "w", encoding="utf-8") as f:
    f.write("# Généré par scripts/build_recherche.py\n")
    for x in listing:
        f.write(f"- slug: {x['slug']}\n  titre: {json.dumps(x['titre'], ensure_ascii=False)}\n  sujets: {json.dumps(x['sujets'])}\n  mots: {x['mots']}\n")
print(len(listing), "pages")
