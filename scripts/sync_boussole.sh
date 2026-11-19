#!/bin/sh
# Copy the Boussole des formations (source: ../site/boussole-pipeline/ in horizons-education-ia) into boussole/.
# Copies index.html and every *.js in that folder (data.js, masters.js, chinashock.js, ...), so new layers come along.
# Usage: sh scripts/sync_boussole.sh [source_dir]
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd)
SRC=${1:-"$HERE/../site/boussole-pipeline"}
DEST="$HERE/boussole"
[ -f "$SRC/index.html" ] || { echo "no index.html in $SRC" >&2; exit 1; }
mkdir -p "$DEST"
rm -f "$DEST"/*.js "$DEST/index.html"
cp "$SRC/index.html" "$DEST/"
for f in "$SRC"/*.js; do [ -e "$f" ] && cp "$f" "$DEST/"; done
# the old version (v1/) is not hosted here: point its link to the original site
sed -i.bak 's#href="v1/"#href="https://ajoly35.github.io/tuteur-ia/boussole/v1/"#' "$DEST/index.html" && rm -f "$DEST/index.html.bak"
ls "$DEST"
# International comparison map (source: ../site/comparaisons/)
CSRC="$HERE/../site/comparaisons"
if [ -f "$CSRC/index.html" ]; then mkdir -p "$HERE/comparaisons"; cp "$CSRC/index.html" "$CSRC/comparaisons.js" "$HERE/comparaisons/"; ls "$HERE/comparaisons"; fi
# Facts of the map for the « Ailleurs » sub-tabs (_data/ailleurs.json)
python3 "$HERE/scripts/build_ailleurs.py"
