"""Check _data/sections.yml: every proposal, chart, source, research dossier and note is attached to exactly one section
(or to a theme's « reste »), and every id it names exists. Unattached items are not lost (the site puts them in
« Tout le reste du thème »), but they are listed here so they can be placed.
Usage: python3 scripts/check_sections.py   (exit 1 if a named id does not exist or an item is attached twice)"""
import json, os, sys, yaml
from collections import defaultdict
D = os.path.join(os.path.dirname(__file__), "..", "_data")
y = lambda f: yaml.safe_load(open(os.path.join(D, f), encoding="utf-8"))
S = y("sections.yml")
known = {
    "proposition": {p["id"] for p in y("propositions.yml")},
    "graphique": {g["id"] for g in y("graphiques.yml")},
    "source": {s["id"] for s in y("sources.yml")},
    "dossier": {d["slug"] for d in y("recherche.yml")},
    "note": {n["fichier"] for n in y("notes.yml")["notes"]} | {n["pdf"] for n in y("politiques.yml")},
    "note générée": {n["dossier"] for n in (y("notes_generees.yml") or []) if n.get("dossier")},
    "livret": {str(m["n"]) for m in y("livret.yml")},
    "ajout": {a["id"] for a in y("livret_ajouts.yml")},
}
facts = {f["id"] for f in json.load(open(os.path.join(D, "ailleurs.json"), encoding="utf-8"))["facts"]}
seen, errors = defaultdict(list), []
def add(kind, k, where):
    if k not in known[kind]: errors.append(f"{where} : {kind} inconnu(e) « {k} »")
    seen[(kind, k)].append(where)
for t in S["themes"]:
    for q in t.get("sections", []) + [dict(t.get("reste") or {}, id="reste")]:
        w = f"{t['theme']}/{q['id']}"
        for k in q.get("propositions", []): add("proposition", k, w)
        c = q.get("chiffre") or {}
        if c.get("graphique"): add("graphique", c["graphique"], w)
        if c.get("source") and c["source"] not in known["source"]: errors.append(f"{w} : source inconnue « {c['source']} »")
        for k in q.get("graphiques_plus", []): add("graphique", k, w)
        for k in q.get("sources", []): add("source", k, w)
        for a in q.get("ailleurs_sources", []):
            if a["id"] not in q.get("sources", []): add("source", a["id"], w)
        for k in q.get("dossiers", []): add("dossier", k, w)
        for k in q.get("notes", []): add("note", k, w)
        for k in q.get("notes_generees", []): add("note générée", k, w)
        for k in q.get("livret", []): add("livret", str(k), w)
        for k in q.get("ajouts", []): add("ajout", k, w)
        for k in (q.get("carte") or {}).get("faits", []):
            if k not in facts: errors.append(f"{w} : fait de carte inconnu « {k} »")
        for b in q.get("bref", []):
            if isinstance(b, dict) and b.get("source") and b["source"] not in known["source"]: errors.append(f"{w} : bref, source inconnue « {b['source']} »")
for k in (S.get("transversal") or {}).get("dossiers", []): add("dossier", k, "transversal")
for (kind, k), ws in seen.items():
    if len(ws) > 1: errors.append(f"{kind} « {k} » rattaché(e) {len(ws)} fois : {', '.join(ws)}")
missing = [f"{kind} « {k} »" for kind, ks in known.items() for k in sorted(ks) if (kind, k) not in seen]
print(f"{len(seen)} éléments rattachés.")
if missing: print("Non rattachés (affichés dans « Tout le reste » de leur thème) :\n  " + "\n  ".join(missing))
if errors: print("ERREURS :\n  " + "\n  ".join(errors)); sys.exit(1)
print("OK")
