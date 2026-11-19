#!/usr/bin/env python3
"""« Politiques d'ailleurs » (onglet International) : one-page notes on a foreign policy, shown as readable cards.
Reads the Markdown of each note (../notes/international/), writes _data/politiques.yml. The PDF is copied by hand
into assets/notes/ (from ../out/). Text is reused without change; only Markdown markup is turned into fields.
Usage: python3 scripts/build_politiques.py
"""
import os, re, yaml

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTES = [  # (source Markdown under ../notes/, PDF in assets/notes/, date, country, sujets)
    ("international/2026-11-19-note-milburn.md", "EDUCATION-note-rapport-milburn.pdf", "19 novembre 2026", "Royaume-Uni", ["emploi", "orientation"]),
]

out = []
for path, pdf, date, pays, sujets in NOTES:
    src = open(os.path.join(HERE, "..", "notes", path), encoding="utf-8").read()
    titre = re.search(r"^# (.+)$", src, re.M).group(1).strip()
    parts = re.split(r"^## (.+)$", src, flags=re.M)
    head, secs = parts[0], list(zip(parts[1::2], parts[2::2]))
    auteur = next((l.strip() for l in head.splitlines()[1:] if l.strip()), "")
    note = {"titre": titre, "auteur": auteur, "pdf": pdf, "date": date, "pays": pays, "sujets": sujets, "bref": [], "sections": [], "sources": ""}
    for h, body in secs:
        body = body.strip()
        m = re.search(r"^\*\*Sources ?:\*\* ?(.+)$", body, re.M)
        if m:
            note["sources"] = m.group(1).strip(); body = body[:m.start()].strip()
        if h.strip().lower() == "en bref":
            note["bref"] = [re.sub(r"^- ", "", l).strip() for l in body.splitlines() if l.startswith("- ")]
        else:
            note["sections"].append({"titre": h.strip(), "paragraphes": [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]})
    out.append(note)

with open(os.path.join(HERE, "_data", "politiques.yml"), "w", encoding="utf-8") as f:
    f.write("# Généré par scripts/build_politiques.py : fiches « Politiques d'ailleurs » (onglet International). Ne pas modifier à la main.\n")
    yaml.safe_dump(out, f, allow_unicode=True, sort_keys=False, width=1000)
print(len(out), "note(s):", ", ".join(n["titre"][:60] for n in out))
