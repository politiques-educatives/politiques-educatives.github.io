#!/usr/bin/env python3
"""Collect the foreign case found for each GT proposal (research/22-comparaisons-propositions/<id>.json, protocol in
PROTOCOLE.md there) into _data/cas_etrangers.json (shown in each proposal card) and write a readable summary of all
cases, including proposals that have no card yet, to ../research/22-comparaisons-propositions/2026-11-19-synthese.md
(published as a research dossier by build_recherche.py). Usage: python3 scripts/build_cas_etrangers.py"""
import json, os
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(HERE, "..", "research", "22-comparaisons-propositions")
IMP = {"soutient": "Va dans notre sens", "condition": "À une condition", "nuance": "Nuance", "contredit": "Contredit"}
L = json.load(open(os.path.join(R, "liste-propositions.json"), encoding="utf-8"))
out, md = {}, ["# 22 · Ailleurs : un cas étranger pour chaque proposition du GT", "",
               "Pour chaque proposition, le cas étranger le plus proche : une évaluation causale ou le rapport d'une institution publique, "
               "le chiffre clé et ce à quoi il est comparé, ce que cela implique pour la proposition, la source exacte et un niveau de confiance. "
               "« Résumé » signale que seul le résumé de la source a été lu.", ""]
for p in L:
    f = os.path.join(R, p["id"] + ".json")
    if not os.path.exists(f):
        continue
    d = json.load(open(f, encoding="utf-8"))
    s = d.get("source", {})
    keep = {k: d.get(k) for k in ["pays", "politique", "type_preuve", "chiffre", "comparaison", "implication", "explication", "citation", "lu", "confiance", "aucun_exemple"]}
    keep["source"] = {"ref": s.get("ref"), "url": s.get("url"), "page": s.get("page")}
    out[p["id"]] = keep
    md += [f"## {p['titre']}", "",
           f"**{d.get('pays')} : {d.get('politique')}** ({IMP.get(d.get('implication'), d.get('implication'))} ; confiance {d.get('confiance')}"
           + (" ; résumé seulement" if d.get("lu") == "résumé" else "") + ")", "",
           d.get("explication") or d.get("aucun_exemple") or "", "",
           f"- Chiffre : {d.get('chiffre')} ; comparé à : {d.get('comparaison')}",
           f"- Source : {s.get('ref')}, {s.get('page')}, {s.get('url')}",
           f"- Citation : « {d.get('citation')} »", ""]
# Propositions pour les manques « jeunes » du livret (research/26-lacunes-jeunes/<slug>-propositions.json, même protocole)
import glob
for f in sorted(glob.glob(os.path.join(HERE, "..", "research", "26-lacunes-jeunes", "*-propositions.json"))) + [os.path.join(HERE, "..", "research", "29-atelier-gt", "le-floch-imad-propositions.json")]:
    for d in json.load(open(f, encoding="utf-8")):
        c = d.get("cas_etranger") or {}
        if not c or d["id"] in ("lfi-budget-temps",):  # cas étranger non vérifié
            continue
        s = c.get("source", {})
        keep = {k: c.get(k) for k in ["pays", "politique", "type_preuve", "chiffre", "comparaison", "implication", "explication", "citation", "lu", "confiance", "aucun_exemple"]}
        keep["source"] = {"ref": s.get("ref"), "url": s.get("url"), "page": s.get("page")}
        out[d["id"]] = keep
import yaml as _yaml  # garder seulement les fiches encore sur le site
_ids = {x["id"] for x in _yaml.safe_load(open(os.path.join(HERE, "_data", "propositions.yml"), encoding="utf-8"))}
out = {k: v for k, v in out.items() if k in _ids}
json.dump(out, open(os.path.join(HERE, "_data", "cas_etrangers.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
open(os.path.join(R, "2026-11-19-synthese.md"), "w", encoding="utf-8").write("\n".join(md))
print(len(out), "cas")
