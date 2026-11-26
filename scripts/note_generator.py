#!/usr/bin/env python3
"""Générateur de notes : recherche sourcée, vérification des chiffres, rédaction au format v12.

Lancé par .github/workflows/note-generator.yml quand le propriétaire du dépôt ouvre une
demande « Générer une note » (issue). Clé : secret GEMINI_API_KEY du dépôt, jamais dans le code.

Étapes (3 appels Gemini au plus, un à la fois) :
1. Recherche (Gemini Flash + Google Search) : 8 à 15 faits chiffrés et sourcés sur le sujet,
   en JSON {fait, chiffre, source, annee, url}.
2. Vérification (sans IA) : chaque page ou PDF cité est téléchargé ; le fait est « vérifié »
   seulement si le chiffre figure tel quel dans le texte de la source. Les autres vont en
   « points à vérifier » et ne sont pas utilisés dans la note.
3. Rédaction (Gemini 4 Carbon) : la note au format des notes du GT (kit pôle idées, module 2),
   dans la syntaxe de build_note.py, à partir des seuls faits vérifiés.
Puis build_note.py + LibreOffice : .docx et .pdf identiques au gabarit v12.

Garde-fous de coût : réflexion plafonnée à 2 000 jetons, sorties plafonnées, coût de l'exécution
estimé et arrêté au-delà de MAX_RUN_USD (1 $ par défaut) ; aucun nouvel essai automatique.

Usage : python3 scripts/note_generator.py --sujet "..." [--angle "..."] [--public "..."] --out notes-generees/<slug>
"""
import argparse, datetime, html, io, json, urllib.parse, os, pathlib, re, subprocess, sys, unicodedata, urllib.request

KEY = os.environ.get("GEMINI_API_KEY", "")
RESEARCH_MODEL = os.environ.get("NOTE_RESEARCH_MODEL", "gemini-3.8-flash")
WRITE_MODEL = os.environ.get("NOTE_WRITE_MODEL", "gemini-4-carbon")
MAX_RUN_USD = float(os.environ.get("MAX_RUN_USD", "1"))
PRICES = {"gemini-4-carbon": (2.0, 10.0), "gemini-3.8-flash": (0.75, 3.75)}  # $/M jetons, avant le 1er déc. 2026
if datetime.date.today() >= datetime.date(2026, 12, 1):
    PRICES["gemini-4-carbon"] = (4.0, 20.0)
SPENT = []

STRUCTURE = """Structure obligatoire (syntaxe ligne à ligne, rien d'autre) :
# <Titre = la proposition elle-même, pas le thème>
_GT Éducation – <mois année> · brouillon généré automatiquement, non relu_
## En bref
- **Le constat.** <une phrase chiffrée>
- **La proposition.** <une phrase>
- **Pourquoi maintenant.** <une phrase>
## Le constat, en chiffres
- **<Accroche>.** <phrase avec chiffre et (Source, année)>   (3 à 5 puces)
## Analyse
- **<Cause ou précédent>.** <...>   (2 à 4 puces ; un précédent étranger concret si les faits en donnent un)
## Position actuelle du programme
<une ou deux phrases : la ou les mesures du livret du programme qui portent sur le sujet, avec « (livret, mesure n°X, p. Y) » ; « à vérifier » si aucune ne s'y rapporte>
## Propositions
- **<Mesure>.** <ce qu'elle change, coût ou « à chiffrer », limite>   (2 à 4 puces)
## Argumentaire
- **En une phrase.** <...>
- **Élément de langage.** <trois phrases>
## Mise en œuvre
- **<Qui>.** <quoi, quand>
### Références
<références séparées par « ; » : Auteur ou organisme (année), titre court>
"""

RULES = """Règles : français, phrases courtes, mots simples ; une à deux pages (3 000 à 6 000 caractères).
N'utiliser QUE les faits vérifiés fournis, avec leur chiffre exact et leur source entre parenthèses.
Ne jamais inventer un chiffre, une citation, une source ni une position du programme
(écrire « à vérifier » ou « à chiffrer »). Pas de tiret long ni de double tiret. Parler de rôles, pas de personnes.
Mots interdits : delve, leverage, multifacette, de surcroît, robuste, transformateur, pivot."""


def call(model, prompt, system=None, search=False, max_out=8000, think=2000):
    body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"maxOutputTokens": max_out, "thinkingConfig": {"thinkingBudget": think}}}
    if system:
        body["systemInstruction"] = {"parts": [{"text": system}]}
    if search:
        body["tools"] = [{"google_search": {}}]
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=json.dumps(body).encode(), method="POST",
        headers={"Content-Type": "application/json", "x-goog-api-key": KEY})
    with urllib.request.urlopen(req, timeout=600) as r:
        d = json.load(r)
    u = d.get("usageMetadata", {})
    pin, pout = PRICES.get(model, (4.0, 20.0))
    cost = (u.get("promptTokenCount", 0) * pin + (u.get("candidatesTokenCount", 0) + u.get("thoughtsTokenCount", 0)) * pout) / 1e6
    SPENT.append((model, round(cost, 4)))
    led = pathlib.Path.home() / ".config/claude-launcher/ledger/gemini-usage.tsv"
    if led.exists():  # local runs only: same usage log as gemini-write
        with open(led, "a") as fh:
            fh.write(f"{datetime.datetime.now().isoformat(timespec='seconds')}\t{model}\tnote-generator\t{u.get('promptTokenCount', 0)}\t"
                     f"{u.get('candidatesTokenCount', 0) + u.get('thoughtsTokenCount', 0)}\t{cost:.4f}\t{os.getcwd()}\tok\t0\n")
    c = d["candidates"][0]
    if c.get("finishReason") not in ("STOP", None):
        sys.exit(f"Arrêt : {model} a terminé avec {c.get('finishReason')} (aucun nouvel essai automatique).")
    text = "".join(p.get("text", "") for p in c["content"]["parts"] if not p.get("thought"))
    grounding = c.get("groundingMetadata", {})
    if sum(x[1] for x in SPENT) > MAX_RUN_USD:
        sys.exit(f"Arrêt : coût de l'exécution {sum(x[1] for x in SPENT):.2f} $ au-delà de {MAX_RUN_USD} $.")
    return text, grounding


try:
    import certifi, ssl
    CTX = ssl.create_default_context(cafile=certifi.where())
except Exception:
    CTX = None


def fetch_text(url):
    req = urllib.request.Request(url, headers={"User-Agent": "politiques-educatives-note-generator"})
    with urllib.request.urlopen(req, timeout=40, context=CTX) as r:
        final, data = r.geturl(), r.read(15_000_000)
        ctype = r.headers.get("Content-Type", "")
    if "pdf" in ctype or final.lower().endswith(".pdf") or data[:4] == b"%PDF":
        p = subprocess.run(["pdftotext", "-layout", "-", "-"], input=data, capture_output=True)
        return p.stdout.decode("utf-8", "replace"), final
    t = data.decode("utf-8", "replace")
    t = re.sub(r"(?s)<(script|style).*?</\1>", " ", t)
    return html.unescape(re.sub(r"<[^>]+>", " ", t)), final


OFFICIAL = ("gouv.fr", "ccomptes.fr", "insee.fr", "senat.fr", "assemblee-nationale.fr", "legifrance.gouv.fr",
            "oecd.org", "europa.eu", "strategie-plan.gouv.fr", "cae-eco.fr", "ipp.eu", "cereq.fr", "francetravail.org",
            "banque-france.fr", "ofce.sciences-po.fr", "nber.org", "cepr.org", "worldbank.org", "unesco.org",
            "ons.gov.uk", "gov.uk", "educationendowmentfoundation.org.uk", "ifs.org.uk", "sciencedirect.com",
            "aeaweb.org", "jstor.org", "hal.science", "cairn.info", "persee.fr", "conseil-etat.fr", "vie-publique.fr")
NUM = re.compile(r"(?<![\w.,])(?:\d{1,3}(?:[\s\u202f\xa0.]\d{3})+|\d+)(?:,\d+|\.\d+)?(?![\d])\s?(?:%|pour\s?cent|points?|M\s?€|Md\s?€|millions?|milliards?|€|euros?)?")


def numbers(text):
    """Substantive figures in a sentence: skips bare years (1990-2039) and small ordinals like n° 30."""
    out = []
    for m in NUM.finditer(text):
        t = m.group(0).strip()
        bare = re.fullmatch(r"\d+", t)
        if bare and (1990 <= int(t) <= 2039 or int(t) < 10):
            continue
        if re.search(r"n°\s?$", text[max(0, m.start() - 4):m.start()]):
            continue
        out.append(t)
    return out


def official(url):
    host = urllib.parse.urlparse(url).netloc.lower()
    return any(host == d or host.endswith("." + d) for d in OFFICIAL)


def figure_pattern(fig):
    """'13,0 %' -> regex matching 13,0 % / 13.0% / 13,0 pour cent ; '981 000' -> 981 000 / 981,000 / 981000."""
    f = str(fig).replace("\u202f", " ").replace("\xa0", " ")
    m = re.search(r"\d[\d\s.,]*\d|\d", f)
    if not m:
        return None
    num = m.group(0).strip()
    groups = re.split(r"[\s.,]", num)
    sep = r"[\s\u202f\xa0.,]?"
    body = sep.join(re.escape(g) for g in groups)
    unit = ""
    if "%" in f:
        unit = r"\s?(?:%|pour\s?cent|per\s?cent|points?)"
    elif re.search(r"M\s?€|millions? d.euros", f):
        unit = r"\s?(?:M\s?€|millions?)"
    elif re.search(r"Md\s?€|milliards?", f):
        unit = r"\s?(?:Md\s?€|milliards?|bn)"
    return re.compile(r"(?<![\d,.])" + body + r"(?![\d])" + unit, re.I)


def search_source(url, pat):
    """Look for the figure in the page; if absent, in up to 3 PDFs linked from the page."""
    text, final = fetch_text(url)
    norm = re.sub(r"\s+", " ", text)
    m = pat.search(norm)
    if m or final.lower().endswith(".pdf"):
        return m, final
    raw = urllib.request.urlopen(urllib.request.Request(final, headers={"User-Agent": "politiques-educatives-note-generator"}), timeout=40, context=CTX).read(3_000_000).decode("utf-8", "replace")
    pdfs = [urllib.parse.urljoin(final, h) for h in re.findall(r'href="([^"]+\.pdf)"', raw, re.I)][:3]
    for u in pdfs:
        try:
            t, fu = fetch_text(u)
            m = pat.search(re.sub(r"\s+", " ", t))
            if m:
                return m, fu
        except Exception:
            pass
    return None, final


def verify(facts):
    out = []
    for f in facts:
        f = dict(f)
        f["statut"], f["detail"] = "à vérifier", ""
        figs = numbers(f.get("fait", "")) or numbers(str(f.get("chiffre", "")))
        f["chiffre"] = " ; ".join(figs)
        if not figs:
            f["detail"] = "pas de chiffre à vérifier"
            out.append(f); continue
        try:
            text, final = fetch_text(f.get("url", ""))
            f["url"] = final
            if not official(final):
                f["detail"] = f"source non officielle ({urllib.parse.urlparse(final).netloc}), non utilisée"
                out.append(f); continue
            missing = []
            for g in figs:
                m, where = search_source(final, figure_pattern(g))
                if m:
                    f["url_verifiee"] = where
                else:
                    missing.append(g)
            if missing:
                f["detail"] = "chiffres absents de la source : " + ", ".join(missing)
            else:
                f["statut"], f["detail"] = "vérifié", "tous les chiffres trouvés dans la source : " + ", ".join(figs)
        except Exception as e:
            f["detail"] = f"source inaccessible ({type(e).__name__} {getattr(e, 'code', '') or getattr(e, 'reason', '')})"
        out.append(f)
    return out


def slug(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:60]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sujet", required=True); ap.add_argument("--angle", default="")
    ap.add_argument("--public", default="équipe programme"); ap.add_argument("--out")
    ap.add_argument("--faits", help="réutiliser le sources.json d'une recherche précédente (pas de nouvel appel de recherche)")
    a = ap.parse_args()
    if not KEY:
        sys.exit("GEMINI_API_KEY absent (secret du dépôt).")
    today = datetime.date.today()
    out = pathlib.Path(a.out or f"notes-generees/{today.isoformat()}-{slug(a.sujet)}")
    out.mkdir(parents=True, exist_ok=True)

    # 1. Recherche sourcée : seuls comptent les passages rattachés par Google Search à une page
    #    réellement consultée (groundingSupports) ; aucune URL écrite par le modèle n'est utilisée.
    q = f"""Fais une recherche sur le web pour une note de politique éducative sur la France : {a.sujet}.
{('Angle : ' + a.angle) if a.angle else ''}
Rassemble 12 à 20 faits chiffrés récents (depuis 2020), en lisant UNIQUEMENT des sources officielles ou académiques :
sites en .gouv.fr (education.gouv.fr, enseignementsup-recherche.gouv.fr, dares, strategie-plan), insee.fr, ccomptes.fr,
senat.fr, assemblee-nationale.fr, oecd.org, europa.eu, ipp.eu, cae-eco.fr, cereq.fr, nber.org, gov.uk. Ignore les blogs,
les sites d'écoles privées, de conseil ou de presse. Évaluations causales et précédents étrangers bienvenus.
Écris une phrase par fait, avec le chiffre exact tel qu'écrit dans la source, l'organisme et l'année."""
    if a.faits:
        prev = json.load(open(a.faits))
        facts = [{k: v for k, v in f.items() if k not in ("statut", "detail", "url_verifiee")} for f in prev["faits"]]
        ground = prev.get("recherche_google", {})
    else:
        raw, ground = call(RESEARCH_MODEL, q, search=True, max_out=6000, think=1024)
        chunks = [ch.get("web", {}) for ch in ground.get("groundingChunks", [])]
        facts = []
        for sup in ground.get("groundingSupports", []):
            seg = sup.get("segment", {}).get("text", "").strip()
            idx = sup.get("groundingChunkIndices", [])
            if not seg or not numbers(seg) or not idx:
                continue
            for i in idx[:2]:
                ch = chunks[i] if i < len(chunks) else {}
                if ch.get("uri"):
                    facts.append({"fait": seg, "chiffre": "", "source": ch.get("title", ""),
                                  "annee": "", "url": ch["uri"]})
        ground = {"requetes": ground.get("webSearchQueries", []), "pages": chunks}
    if not facts:
        sys.exit("Arrêt : la recherche n'a renvoyé aucun passage rattaché à une source consultée.")

    # 2. Vérification à la source
    facts = verify(facts)
    seen, ok = set(), []
    for f in facts:
        if f["statut"] == "vérifié" and f["fait"] not in seen:
            seen.add(f["fait"]); ok.append(f)
    (out / "sources.json").write_text(json.dumps({"sujet": a.sujet, "faits": facts, "recherche_google": ground},
                                                 ensure_ascii=False, indent=1))
    if len(ok) < int(os.environ.get("MIN_VERIFIED", "5")):
        sys.exit(f"Arrêt : seulement {len(ok)} faits vérifiés sur {len(facts)} ; voir sources.json.")

    # 3. Rédaction
    livret = ""
    lp = pathlib.Path(__file__).resolve().parent.parent / "_data" / "livret.yml"
    if lp.exists():
        import yaml
        mes = yaml.safe_load(lp.read_text()) or []
        livret = ("\nProgramme, volume 1 (18/11/2026), mesures éducation "
                  "(seule source admise pour la position actuelle du programme) :\n" +
                  "\n".join(f"- mesure n°{m['n']}, p. {m['page']} : {m['titre']}. {m['resume']}" for m in mes))
    brief = f"""Note pour : {a.public}. Sujet : {a.sujet}. {('Angle : ' + a.angle) if a.angle else ''}
Date : {today.strftime('%m/%Y')}.
Faits vérifiés (les seuls utilisables) :
""" + "\n".join(f"- {f['fait']} [chiffre vérifié : {f['chiffre']}] (source : {f['source']}) {f.get('url_verifiee', f['url'])}" for f in ok) + livret
    system = ("Tu rédiges une note du GT Éducation, sans aucun label ni référence de parti, "
              "au format des notes existantes du groupe.\n" + RULES + "\n\n" + STRUCTURE)
    note, _ = call(WRITE_MODEL, brief, system=system, max_out=12000, think=2000)
    note = note.strip().strip("`")
    note = note.replace(" — ", ", ").replace("—", ", ").replace(" -- ", ", ")
    if not note.startswith("# "):
        sys.exit("Arrêt : la note ne suit pas le format attendu (pas de titre).")
    # chaque chiffre de la note doit venir d'un fait vérifié ; sinon il est marqué dans la note
    allowed = {re.sub(r"[\s\u202f\xa0]", "", g) for f in ok for g in numbers(f["fait"])}
    allowed |= {re.sub(r"[\s\u202f\xa0]", "", g) for g in numbers(livret)}
    flagged = []
    def mark(m):
        t = m.group(0).strip()
        if t not in numbers(t) or re.sub(r"[\s\u202f\xa0]", "", t) in allowed:
            return m.group(0)
        flagged.append(t)
        return m.group(0).rstrip() + " [à vérifier]" + (" " if m.group(0).endswith(" ") else "")
    body = [l if l.startswith(("# ", "_", "### ")) else NUM.sub(mark, l) for l in note.splitlines()]
    note = "\n".join(body)
    md = out / "note.md"
    md.write_text(note + "\n")
    pending = [f for f in facts if f["statut"] != "vérifié" and f["fait"] not in seen]
    (out / "a-verifier.md").write_text("# Points non vérifiés (non utilisés dans la note)\n\n" + "\n".join(
        f"- {f['fait']} [{f['chiffre']}] ({f['source']}, {f['annee']}) {f.get('url','')} : {f['detail']}" for f in pending) + "\n")

    # 4. Mise en forme v12
    here = pathlib.Path(__file__).parent
    subprocess.run([sys.executable, str(here / "build_note.py"), str(md), str(out / "note.docx")], check=True)
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", str(out / "note.docx"), "--outdir", str(out)],
                   check=True, capture_output=True)
    title = note.splitlines()[0][2:].strip()
    meta = {"titre": title, "sujet": a.sujet, "date": today.isoformat(), "dossier": str(out),
            "faits": len(facts), "verifies": len(ok), "chiffres_non_rattaches": flagged, "cout_usd": round(sum(x[1] for x in SPENT), 3),
            "appels": SPENT}
    (out / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    print(json.dumps(meta, ensure_ascii=False))


if __name__ == "__main__":
    main()
