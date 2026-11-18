#!/usr/bin/env python3
"""Copy the text of the IA et jeunes note into _data/note_ia.yml for the « IA et jeunes » hub, wording unchanged.

Source: ../notes/ia-jeunes-emploi/2026-11-16-note-ia-jeunes-emploi-orientation.md (horizons-education-ia).
Kept: title, introduction, « Pourquoi maintenant », « Le constat, en chiffres », « Ce qu'on fait dire au candidat »,
« Les conditions », « Argumentaire » (first paragraph). Left out: the video scripts (choice of the author), the
questions to school heads and the source list (the sources are in the evidence base). The PDF is not published.
Usage: python3 scripts/build_note_ia.py [source.md]
"""
import os, re, sys, yaml

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "notes", "ia-jeunes-emploi", "2026-11-16-note-ia-jeunes-emploi-orientation.md")
text = open(SRC, encoding="utf-8").read()

sections, cur = {}, "_top"
for line in text.splitlines():
    if line.startswith("## "):
        cur = line[3:].strip(); sections[cur] = []
        continue
    sections.setdefault(cur, []).append(line)


def paras(name):
    return [l.strip() for l in sections.get(name, []) if l.strip()]


def bullets(name):
    out = []
    for l in paras(name):
        l = re.sub(r"^(\* |- |\d+\. )", "", l)
        m = re.match(r"\*\*(.+?)\*\*\s*:?\s*(.*)", l)
        out.append({"titre": m.group(1).rstrip(" .:"), "texte": m.group(2)} if m else {"titre": "", "texte": l})
    return out


title = next(k for k in sections if k.startswith("IA et jeunes"))
arg = paras("Argumentaire")
data = {
    "source": os.path.basename(SRC),
    "titre": title,
    "intro": " ".join(paras(title)),
    "pourquoi": " ".join(paras("Pourquoi maintenant")),
    "constat": bullets("Le constat, en chiffres"),
    "messages": [b["texte"] for b in bullets("Ce qu'on fait dire au candidat")],
    "conditions": bullets("Les conditions"),
    "argumentaire": arg[0] if arg else "",
}
assert data["conditions"] and data["messages"] and data["constat"], "note structure changed"
with open(os.path.join(HERE, "_data", "note_ia.yml"), "w", encoding="utf-8") as f:
    f.write("# Généré par scripts/build_note_ia.py depuis la note IA et jeunes ; ne pas modifier à la main.\n")
    yaml.safe_dump(data, f, allow_unicode=True, sort_keys=False, width=1000)
print("note_ia.yml:", len(data["constat"]), "constats,", len(data["messages"]), "messages,", len(data["conditions"]), "conditions")
