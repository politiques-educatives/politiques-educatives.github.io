#!/usr/bin/env python3
"""Sub-tab « Ailleurs » of each theme: the verified facts of the international comparison map, without the map geometry.
Reads comparaisons/comparaisons.js (synced by scripts/sync_boussole.sh), writes _data/ailleurs.json
(themes, country names, facts). Nothing is rewritten: same text, same source, same link as on the map.
Usage: python3 scripts/build_ailleurs.py
"""
import json, os

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js = open(os.path.join(HERE, "comparaisons", "comparaisons.js"), encoding="utf-8").read()
D = json.loads(js[js.index("{"): js.rindex("}") + 1])
out = {
    "generated": D["generated"],
    "themes": D["themes"],
    "countries": {k: v["name"] for k, v in D["countries"].items()},
    "facts": [{k: f.get(k, "") for k in ("id", "country", "theme", "fact", "source", "url")} for f in D["facts"]],
}
with open(os.path.join(HERE, "_data", "ailleurs.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
print(len(out["facts"]), "faits,", len(out["themes"]), "thèmes, données du", out["generated"])
