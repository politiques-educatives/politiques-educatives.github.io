// Politiques éducatives : Accueil, one tab per theme (same three sub-tabs everywhere), International, Boussole.
// Routes: #accueil[/rediger], #<theme>/<essentiel|recherche|ailleurs>[/<section id>], #international/<carte[/<map theme>]|politiques>,
//         #boussole[/<anchor>], #p-<card id>. Old routes (#ia/…, #gouvernance/…, #comparaisons…) are redirected (LEGACY).
// Every listed item has class "s-item" and its searchable text in data-s; the header search filters them all.
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var md = function (s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*\s][^*]*?)\*(?=[\s).,;:]|$)/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  };
  var norm = function (s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var slug = function (s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };
  var frDate = function (d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || "")); return m ? new Date(+m[1], m[2] - 1, +m[3]).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : String(d || ""); };
  var plural = function (n, w, ws) { return n + " " + (n > 1 ? (ws || w + "s") : w); };
  var W = window, BASE = W.BASE || "";
  var SUJ = W.SUJETS || [], PROPS = W.PROPS || [], SRC = W.SOURCES || [], GR = W.GRAPHS || [], LIV = W.LIVRET || [],
      AJ = W.LIVRET_AJOUTS || [], NOTES = W.NOTES || [], GEN = W.NOTES_GEN || [], DOS = W.DOSSIERS || [],
      POL = W.POLITIQUES || [], AIL = W.AILLEURS || { themes: [], countries: {}, facts: [] }, VP = W.VOIEPRO || null;
  var byId = {}; PROPS.forEach(function (p) { byId[p.id] = p; });
  var CAS = W.CAS || {}, IMPL = { soutient: "Va dans notre sens", condition: "À une condition", nuance: "Nuance", contredit: "Contredit" };
  var srcById = {}; SRC.forEach(function (s) { srcById[s.id] = s; });
  var gById = {}; GR.forEach(function (g) { gById[g.id] = g; });
  var dosBySlug = {}; DOS.forEach(function (d) { dosBySlug[d.slug] = d; });
  var sujById = {}; SUJ.forEach(function (s) { sujById[s.id] = s; });
  var mapTheme = {}; (AIL.themes || []).forEach(function (t) { mapTheme[t.key] = t; });
  var any = function (list, keys) { return (list || []).some(function (k) { return keys.indexOf(k) >= 0; }); };
  var livByCard = {}; LIV.forEach(function (m) { (m.cartes || []).forEach(function (c) { (livByCard[c] = livByCard[c] || []).push(m); }); });
  var SUBS = { theme: [["essentiel", "L'essentiel"], ["recherche", "Recherche et données"], ["ailleurs", "Ailleurs"]], international: [["carte", "La carte"], ["politiques", "Politiques d'ailleurs"]] };
  var subsOf = function (topic) { return sujById[topic] ? SUBS.theme : topic === "international" ? SUBS.international : null; };
  function issueUrl(id, title) {
    return "https://github.com/" + W.REPO + "/issues/new?template=feedback.yml&title=" + encodeURIComponent("[" + id + "] " + title) + "&carte=" + encodeURIComponent(id);
  }
  function item(tag, cls, text, html, attrs) {
    return "<" + tag + ' class="s-item ' + (cls || "") + '" data-s="' + esc(text) + '"' + (attrs || "") + ">" + html + "</" + tag + ">";
  }
  function sec(title, body, intro, id) { return body ? '<section class="hsec"' + (id ? ' data-sec="' + id + '"' : "") + "><h2>" + title + "</h2>" + (intro ? '<p class="note-src">' + intro + "</p>" : "") + body + "</section>" : ""; }
  function row(sum, body, text, attrs) { return item("details", "row", text, "<summary>" + sum + '</summary><div class="pb">' + body + "</div>", attrs); }
  var ids = function (list, dict) { return (list || []).filter(function (i) { return dict[i]; }).map(function (i) { return dict[i]; }); };

  // ---------------- item renderers
  var ELAB = { "convergent": "Convergent", "à compléter": "À compléter", "tension": "Tension", "hors champ": "Hors champ" };
  var seenCard = {};
  function propHTML(p) {
    var idAttr = seenCard[p.id] ? "" : ' id="p-' + esc(p.id) + '"'; seenCard[p.id] = 1;
    var ev = (p.preuves || []).map(function (x) { return "<li>" + md(x) + "</li>"; }).join("");
    var tags = (livByCard[p.id] || []).map(function (m) { return '<span class="badge lv e-' + slug(m.eval) + '" title="Livret du programme, mesure ' + esc(m.n) + " : " + esc(m.eval) + '">Livret n°' + esc(m.n) + "</span>"; }).join("");
    return row('<span class="pt">' + md(p.titre) + '</span><span class="pm"><span class="badge st-' + slug(p.statut) + '">' + esc(p.statut) + "</span>" + tags + "</span>",
      '<p class="from">Issue de : ' + esc(p.issue_de || "") + "</p><p>" + md(p.explication) + "</p>" +
      (ev ? '<h3>Ce que disent les preuves</h3><ul class="ev">' + ev + "</ul>" : "") + casHTML(CAS[p.id]) +
      '<p class="pf">' + (p.note ? '<a href="' + esc(BASE + "/assets/notes/" + p.note) + '">Lire la note (PDF)</a> · ' : "") +
      '<a href="#p-' + esc(p.id) + '" class="perma" data-card="' + esc(p.id) + '">Lien vers cette fiche</a> · <a href="' + esc(issueUrl(p.id, p.titre)) + '" target="_blank" rel="noopener">Signaler une correction</a></p>',
      [p.titre, p.explication, (p.preuves || []).join(" "), p.issue_de, CAS[p.id] ? [CAS[p.id].pays, CAS[p.id].politique, CAS[p.id].explication].join(" ") : ""].join(" "), idAttr);
  }
  function casHTML(c) {
    if (!c) return "";
    if (c.aucun_exemple && !c.pays) return '<div class="cas"><h3>Ailleurs : le cas le plus proche</h3><p>' + md(c.aucun_exemple) + "</p></div>";
    var src = c.source || {};
    return '<div class="cas"><h3>Ailleurs : le cas le plus proche</h3>' +
      '<p class="cas-h"><b>' + esc(c.pays) + "</b> : " + esc(c.politique) + ' <span class="badge im-' + slug(c.implication || "") + '">' + esc(IMPL[c.implication] || c.implication || "") + '</span> <span class="badge cf-' + slug(c.confiance || "") + '">Confiance ' + esc(c.confiance || "") + "</span></p>" +
      "<p>" + md(c.explication || "") + "</p>" +
      '<p class="cas-n"><b>Le chiffre :</b> ' + md(c.chiffre || "") + (c.comparaison ? " ; comparé à : " + md(c.comparaison) : "") + "</p>" +
      (c.citation ? '<p class="cas-q">« ' + esc(c.citation) + " »</p>" : "") +
      '<p class="note-src">Source : ' + (src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.ref || src.url) + "</a>" : esc(src.ref || "")) + (src.page ? ", " + esc(src.page) : "") + (c.lu === "résumé" ? " (seul le résumé a été lu)" : "") + "</p></div>";
  }
  function cardLinks(list) {
    return (list || []).filter(function (c) { return byId[c]; }).map(function (c) {
      return '<a class="tocard" href="#p-' + esc(c) + '" data-card="' + esc(c) + '">' + md(byId[c].titre) + "</a>"; }).join(" · ");
  }
  function livHTML(m) {
    var links = cardLinks(m.cartes);
    return row('<span class="num">n°' + esc(m.n) + '</span><span class="pt">' + md(m.titre) + '</span><span class="badge e-' + slug(m.eval) + '">' + esc(ELAB[m.eval] || m.eval) + "</span>",
      "<p>" + md(m.resume) + ' <span class="sub">(livret, p. ' + esc(m.page) + ")</span></p><p><strong>Notre évaluation :</strong> " + md(m.apport) + "</p>" +
      (links ? '<p class="sub">Voir : ' + links + "</p>" : ""), ["livret", m.n, m.titre, m.resume, m.apport, m.eval].join(" "));
  }
  function srcHTML(s) {
    var secs = (s.sections || []).map(function (x) { return "<li>" + md(x) + "</li>"; }).join("");
    var props = cardLinks(s.propositions);
    return row('<span class="tag">' + esc(s.type) + '</span><span class="pt">' + md(s.titre) + '</span><span class="badge v-' + slug(s.statut) + '">' + esc(s.statut) + "</span>",
      '<p class="ref">' + md(s.ref) + (s.lien ? ' <a href="' + esc(s.lien) + '" target="_blank" rel="noopener">Lien</a>' : "") + "</p><p>" + md(s.resume) + "</p>" +
      (secs ? '<h3>Partie par partie</h3><ul class="ev">' + secs + "</ul>" : "") +
      '<p class="cle"><strong>À citer :</strong> ' + md(s.cle) + ' <button type="button" class="copy" data-copy="' + esc(s.id) + '">Copier</button></p>' +
      '<p class="sub">' + (props ? "Soutient : " + props + " · " : "") + (s.dossier ? '<a href="' + esc(BASE + "/recherche/" + s.dossier + ".html") + '">Dossier de recherche</a> · ' : "") +
      '<a href="' + esc(issueUrl(s.id, s.titre)) + '" target="_blank" rel="noopener">Signaler une correction</a></p>',
      [s.titre, s.ref, s.resume, (s.sections || []).join(" "), s.cle, s.type].join(" "));
  }
  function constatHTML(s) {   // a key finding: the source's figure on one line, the source on demand
    return row('<span class="pt">' + md(s.cle) + "</span>", "<p>" + md(s.resume) + '</p><p class="ref">' + md(s.ref) + (s.lien ? ' <a href="' + esc(s.lien) + '" target="_blank" rel="noopener">Lien</a>' : "") + "</p>", s.cle + " " + s.resume);
  }
  function dosHTML(d) {
    return item("li", "", d.titre, '<a href="' + esc(BASE + "/recherche/" + d.slug + ".html") + '">' + esc(d.titre) + '</a> <span class="meta">dossier de recherche du GT · ' + d.mots + " mots</span>");
  }
  var dosList = function (list) { return list.length ? '<ul class="lib">' + list.map(dosHTML).join("") + "</ul>" : ""; };
  var fileUrl = function (u) { return /^https?:/.test(u) ? u : BASE + (u.charAt(0) === "/" ? u : "/" + u); };
  function noteHTML(n, gen) {
    if (gen && n.dossier) { n.pdf = n.pdf || n.dossier + "/note.pdf"; n.docx = n.docx || n.dossier + "/note.docx"; }
    var href = gen ? (n.pdf ? fileUrl(n.pdf) : "") : BASE + "/assets/notes/" + n.fichier;
    return item("li", "", [n.titre, n.resume].join(" "),
      (href ? '<a href="' + esc(href) + '">' + esc(n.titre) + "</a>" : esc(n.titre)) +  ' <span class="meta">' + esc(frDate(n.date)) + (n.pages ? " · " + esc(n.pages) + " p." : "") +
      (gen && n.docx ? ' · <a href="' + esc(fileUrl(n.docx)) + '">Word</a>' : "") + (gen ? " · brouillon généré, non relu" : " · PDF") + "</span>" +
      (n.resume ? '<div class="sub">' + md(n.resume) + "</div>" : ""));
  }
  function polNoteHTML(n) {   // a one-page note on a foreign policy, listed with the theme's notes
    return item("li", "", [n.titre, (n.bref || []).join(" ")].join(" "),
      '<a href="' + esc(BASE + "/assets/notes/" + n.pdf) + '">' + esc(n.titre) + '</a> <span class="meta">' + esc(n.date) + " · 1 p. · PDF · " +
      '<a href="#international/politiques" data-route="international/politiques">lire dans l\'onglet International</a></span>');
  }
  function chartBox(g) {
    return item("figure", "chart", [g.titre, g.source, g.note, g.unite].join(" "),
      "<figcaption><strong>" + esc(g.titre) + "</strong>" + (g.auto ? ' <span class="auto">actualisé chaque mois</span>' : "") + "</figcaption>" +
      '<div class="vis" data-chart="' + esc(g.id) + '" role="img" aria-label="' + esc(g.titre + ", " + g.unite) + '"></div>' +
      '<p class="src">' + esc(g.unite) + ". " + (g.note ? esc(g.note) + " " : "") + "Source : " + esc(g.source) +
      (g.auto && W.CHARTS_META ? " (promotion " + esc(W.CHARTS_META.insersup_promo) + ", " + esc(W.CHARTS_META.insersup_version) + ")" : "") +
      '. <a href="' + esc(BASE + "/assets/charts/data/" + g.id + ".csv") + '">Données (CSV)</a></p>');
  }
  var charts = function (list) { list = (list || []).filter(function (i) { return gById[i]; }); return list.length ? '<div class="charts">' + list.map(function (i) { return chartBox(gById[i]); }).join("") + "</div>" : ""; };
  function table(t, cols, text) {   // t = {entetes, lignes}; cols = column indexes to show (default: all)
    cols = cols || t.entetes.map(function (_, i) { return i; });
    return item("div", "tbl-wrap", text + " " + t.lignes.map(function (r) { return r.join(" "); }).join(" "),
      '<table class="cmp"><thead><tr>' + cols.map(function (i) { return '<th scope="col">' + esc(t.entetes[i]) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      t.lignes.map(function (r) { return "<tr>" + cols.map(function (i) { return "<td>" + md(r[i]) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>");
  }
  var ul = function (list, cls) { return '<ul class="' + (cls || "ev") + '">' + list.map(function (x) { return item("li", "", x, md(x)); }).join("") + "</ul>"; };

  // ---------------- blocks reused from the former sub-tabs
  function noteIA() {
    var NI = W.NOTE_IA; if (!NI) return "";
    var r = function (c) { return row('<span class="pt">' + md(c.titre) + "</span>", "<p>" + md(c.texte) + "</p>", c.titre + " " + c.texte); };
    return sec("La note IA et jeunes : les recommandations", item("p", "lead", NI.intro, md(NI.intro)) + NI.conditions.map(r).join(""),
        "Texte de la note « " + esc(NI.titre) + " » (GT Éducation, novembre 2026), repris sans changement.", "s-note-ia") +
      sec("Éléments de langage", '<ol class="msgs">' + NI.messages.map(function (m) { return item("li", "", m, md(m)); }).join("") + "</ol>" +
        item("p", "argu", NI.argumentaire, "<strong>Argumentaire.</strong> " + md(NI.argumentaire))) +
      sec("Le constat de la note IA et jeunes", item("p", "", NI.pourquoi, "<strong>Pourquoi maintenant.</strong> " + md(NI.pourquoi)) + NI.constat.map(r).join(""));
  }
  function blocMilburn() {
    var M = W.MILBURN || [];
    return sec("Rapport Milburn : les 17 recommandations et la réponse du gouvernement britannique",
      M.map(function (m) {
        return row('<span class="num">' + m.n + '</span><span class="pt">' + md(m.titre) + '</span><span class="badge m-' + slug(m.statut) + '">' + esc(m.statut) + "</span>",
          (m.chiffre ? "<p><strong>Chiffre :</strong> " + md(m.chiffre) + "</p>" : "") + (m.france ? "<p><strong>En France :</strong> " + md(m.france) + "</p>" : "") + '<p class="note-src">Rapport Milburn, p. ' + esc(m.pages) + "</p>",
          ["Milburn", m.titre, m.chiffre, m.france, m.statut].join(" "));
      }).join("") +
      row('<span class="pt">Ce que la France a déjà, et ce qui lui manque</span>',
        "<p>La France a déjà une garantie avec allocation (le contrat d'engagement jeune), une obligation de formation jusqu'à 18 ans et les missions locales. Il lui manque ce que Milburn propose : un emploi payé garanti en dernier recours ; une mesure du devenir des élèves par établissement et une norme « prêt pour le travail », inspectées ; un suivi des postes de débutants face à l'IA ; des outils de repérage précoce du décrochage.</p>" +
        '<p class="warn">Le Royaume-Uni mesure les 16-24 ans (13,0 %), la France les 15-29 ans (13,3 %, Insee). Sur les 15-24 ans, le Royaume-Uni (13,6 %, OCDE 2025) est au-dessus de la France (10,5 % en 2023).</p>',
        "France contrat d'engagement jeune Garantie jeunes missions locales comparaison"),
      "981 000 jeunes de 16 à 24 ans sans emploi ni formation au Royaume-Uni, soit 13,0 % (ONS, avril-juin 2026). Rapport publié le 17 novembre 2026.", "s-milburn");
  }
  function blocMasters() {
    return sec("Masters", item("p", "lead", "master licence boussole emploi salaire",
      "Le master sert souvent de filtre plus que de compétence : il trie par origine sociale, retarde de deux ans l'entrée dans la vie active, et une licence professionnelle insère mieux. " +
      '<a href="#boussole" data-route="boussole">La Boussole</a> affiche l\'emploi et le salaire de chaque master (étape « Master ou emploi »).'), "", "s-masters");
  }
  function blocComms() {
    var V = W.VIDEOS || [];
    return '<div data-sec="s-comms">' + sec("Comms : cinq vidéos britanniques, une ligne chacune",
      '<ul class="vids">' + V.map(function (v) { return item("li", "", [v.titre, v.lecon].join(" "), '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.titre) + "</a> : " + md(v.lecon)); }).join("") + "</ul>") +
      sec("Comms : ce qui marche",
        item("div", "tbl-wrap", "ce qui marche quotidien chiffre cliché sous-titres", '<table class="cmp"><thead><tr><th>Ressort</th><th>Pour nous</th></tr></thead><tbody>' +
          "<tr><td>Un problème du quotidien, pas un thème</td><td>le choix d'études, le premier CDI, l'attente d'un psy</td></tr>" +
          "<tr><td>Un chiffre comparatif en une phrase</td><td>un master sur dix sous 49 % d'emploi, un sur dix au-dessus de 86 %</td></tr>" +
          "<tr><td>Une voix jeune qui retourne un cliché</td><td>« les jeunes ne veulent plus travailler »</td></tr>" +
          "<tr><td>Sous-titres incrustés, mot à mot</td><td>vidéos vues sans le son</td></tr></tbody></table>")) +
      sec("Comms : un post alarmé sur les évaluations nationales, vérifié",
        '<ul class="vids">' +
        item("li", "", "confirmé seconde maths 2019 dictée CE1", "<strong>Confirmé.</strong> Seconde générale et technologique : 28,1 % dans les groupes faibles en maths, contre 19,2 % en 2019 ; dictée de CE1 en baisse de 2,5 points sur un an (DEPP).") +
        item("li", "", "forcé CM2 6e stable", "<strong>Forcé.</strong> « Les performances diminuent du CE1 au CM2 » : en CM2, le français est stable pour 7 compétences sur 9.") +
        item("li", "", "non vérifiable questions", "<strong>Non vérifiable.</strong> Les exemples de questions : la DEPP ne publie aucun résultat question par question.") + "</ul>",
        '<a href="https://x.com/JLeFlochImad/status/2122979063086137629" target="_blank" rel="noopener">Post X du 18 novembre 2026</a>') + "</div>";
  }
  var BLOCS = { masters: blocMasters, comms: blocComms };

  // ---------------- « Voie pro, IA et concurrence chinoise » (research dossier 19, version 1)
  var vpSrc = function () { return '<p class="src">Source : ' + esc(VP.source) + "</p>"; };
  var RISK_COLS = [0, 1, 2, 3, 4, 5];
  function voieProEssentiel() {
    if (!VP) return "";
    return sec("En bref", ul(VP.bref, "bref"), "", "s-bref") +
      sec("La carte des lycées pro",
        item("div", "vp-carte", "carte lycées professionnels bac pro CAP spécialités IA Chine zone d'emploi " + VP.carte,
          '<a class="vp-img" href="#boussole/carte" data-route="boussole/carte"><img src="' + esc(BASE + "/assets/captures/boussole-lycees-pro-ia-chine.jpg") + '" alt="Capture de la carte des lycées professionnels dans la Boussole" width="240" loading="lazy"></a>' +
          '<div><p>' + md(VP.carte) + '</p><p class="src">Sources : ' + esc(VP.carte_source) + '</p><p><a class="btn" href="#boussole/carte" data-route="boussole/carte">Ouvrir la carte</a></p></div>'),
        "Dans la Boussole des formations : un clic sur un lycée affiche sa fiche.") +
      sec("L'indice de risque des filières techniques (version 1)",
        ul(VP.resultats) +
        "<h3>Les 10 spécialités les moins risquées</h3>" + table(VP.faibles, RISK_COLS, "moins risquées faible risque") + item("p", "", VP.apres_faibles, md(VP.apres_faibles)) +
        "<h3>Les 10 spécialités les plus risquées</h3>" + table(VP.forts, RISK_COLS, "plus risquées risque élevé") + item("p", "", VP.apres_forts, md(VP.apres_forts)) +
        '<p class="note-src">Risque et rangs de 0 à 1 (1 = plus de risque). Le détail des cinq composantes est dans « Recherche et données ».</p>' + vpSrc(),
        "Une mesure du GT : le risque d'une spécialité, pas seulement son exposition à l'IA.", "s-indice");
  }
  function voieProRecherche() {
    if (!VP) return "";
    return sec("Méthode de l'indice", item("p", "", VP.demande_v1, md(VP.demande_v1)) + table(VP.composantes, null, "composantes méthode") +
        item("p", "", VP.echelle, md(VP.echelle)) + item("p", "", VP.poids, md(VP.poids)) +
        "<h3>Les cinq scénarios (vue portefeuille)</h3>" + table(VP.scenarios, null, "scénarios portefeuille poids") +
        "<h3>Les 10 extrêmes, composante par composante</h3>" + table(VP.faibles, null, "moins risquées composantes") + table(VP.forts, null, "plus risquées composantes") + vpSrc(),
        "", "s-methode") +
      sec("Le bâtiment, revérifié", '<ol class="ev">' + VP.batiment.map(function (x) { return item("li", "", x, md(x)); }).join("") + "</ol>" +
        table(VP.batiment_table, null, "bâtiment BMO tension Dares") + item("p", "note-src", VP.batiment_note, esc(VP.batiment_note)) + item("p", "", VP.lecture_tension, md(VP.lecture_tension)) + vpSrc()) +
      sec("Limites", ul(VP.limites)) +
      sec("La concurrence chinoise dans la Boussole", item("p", "", VP.chine, md(VP.chine))) +
      sec("Les données de l'indice", '<ul class="lib">' + VP.donnees.map(function (d) { return item("li", "", d[0], '<a href="' + esc(d[1]) + '" target="_blank" rel="noopener">' + esc(d[0]) + "</a>"); }).join("") + "</ul>");
  }

  // ---------------- « Ailleurs »: facts of the international map, grouped by country
  function ailleurs(keys) {
    var facts = (AIL.facts || []).filter(function (f) { return keys.indexOf(f.theme) >= 0 && f.country !== "FR"; });
    if (!facts.length) return "";
    var by = {}; facts.forEach(function (f) { (by[f.country] = by[f.country] || []).push(f); });
    var name = function (k) { return (AIL.countries || {})[k] || k; };
    return Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length || name(a).localeCompare(name(b), "fr"); }).map(function (k) {
      var list = by[k], body = keys.map(function (t) {
        var fs = list.filter(function (f) { return f.theme === t; }); if (!fs.length) return "";
        return (keys.length > 1 ? "<h3>" + esc(mapTheme[t] ? mapTheme[t].label : t) + "</h3>" : "") + '<ul class="ev">' + fs.map(function (f) {
          return "<li>" + esc(f.fact) + ' <span class="sub">(' + (f.url ? '<a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.source) + "</a>" : esc(f.source)) + ")</span></li>"; }).join("") + "</ul>";
      }).join("");
      return row('<span class="pt">' + esc(name(k)) + '</span><span class="tag">' + plural(list.length, "fait") + "</span>", body,
        name(k) + " " + list.map(function (f) { return f.fact + " " + f.source; }).join(" "));
    }).join("");
  }
  function mapLinks(keys) {
    return keys.filter(function (k) { return mapTheme[k]; }).map(function (k) { return '<a href="#international/carte/' + k + '" data-route="international/carte/' + k + '">' + esc(mapTheme[k].label) + "</a>"; }).join(" · ");
  }

  // ---------------- build the theme sub-panels
  SUJ.forEach(function (S) {
    var K = S.donnees || [], G = S.graphiques || {};
    var props = PROPS.filter(function (p) { return any(p.sujets, S.propositions || []); });
    var liv = LIV.filter(function (m) { return any(m.sujets, K) && m.eval !== "hors champ"; });
    var aj = AJ.filter(function (a) { return any(a.sujets, K); });
    var srcs = SRC.filter(function (s) { return any(s.sujets, K); });
    var notes = NOTES.filter(function (n) { return any(n.sujets, K); });
    var gen = GEN.filter(function (n) { return n.sujet === S.id || any(n.sujets || [n.sujet], K.concat([S.id])); });
    var pol = POL.filter(function (n) { return any(n.sujets, K); });
    var dos = DOS.filter(function (d) { return any(d.sujets, K); }).concat(ids(S.dossiers, dosBySlug).filter(function (d) { return !any(d.sujets, K); }));
    var h;
    // L'essentiel
    h = S.bref ? sec("En bref", '<ul class="bref">' + ids(S.bref, srcById).map(function (s) { return item("li", "", s.cle, md(s.cle)); }).join("") + "</ul>") : "";
    if (S.voie_pro) h += voieProEssentiel();
    if (props.length) h += sec("Nos propositions", props.map(propHTML).join(""), "Une ligne par proposition ; cliquez pour l'explication, les preuves et la note d'origine.");
    if (S.note_ia) h += noteIA();
    if (S.constats) h += sec("Ce que montrent les données", ids(S.constats, srcById).map(constatHTML).join(""), "Les chiffres clés de nos sources ; cliquez pour le détail.");
    h += sec("Les chiffres clés", charts(G.essentiel));
    h += sec("Les notes", (notes.length || gen.length || pol.length) ? '<ul class="lib">' + notes.map(function (n) { return noteHTML(n, false); }).join("") + pol.map(polNoteHTML).join("") + gen.map(function (n) { return noteHTML(n, true); }).join("") + "</ul>" : "");
    h += sec("Le programme et nos travaux",
      liv.map(livHTML).join("") + (aj.length ? '<h3>Ce que nos travaux ajoutent</h3><ul class="ajouts">' + aj.map(function (a) { return item("li", "", a.texte, md(a.texte)); }).join("") + "</ul>" : ""),
      "Livret « Croire en nous », volume 1 (18 novembre 2026) : les mesures du programme et notre évaluation.");
    $("#sp-" + S.id + "-essentiel").innerHTML = h;
    // Recherche et données
    h = (S.blocs || []).map(function (b) { return BLOCS[b] ? BLOCS[b]() : ""; }).join("");
    if (S.voie_pro) h += voieProRecherche();
    h += sec("Les chiffres", charts(G.recherche));
    var used = {};
    (S.groupes || []).forEach(function (g) {
      var list = ids(g.sources, srcById); list.forEach(function (s) { used[s.id] = 1; });
      h += sec("Sources : " + esc(g.titre) + " (" + list.length + ")", list.map(srcHTML).join(""), "", "s-" + slug(g.titre));
    });
    var rest = srcs.filter(function (s) { return !used[s.id]; }).concat(ids(S.sources_recherche, srcById).filter(function (s) { return !any(s.sujets, K); }));
    h += sec((S.groupes ? "Autres sources du thème" : "Les sources du thème") + " (" + rest.length + ")", rest.map(srcHTML).join(""),
      "Chaque fiche : ce qui a été étudié, les chiffres avec leur point de comparaison, les limites, et si le chiffre a été lu dans la source. « Copier » met la citation dans le presse-papiers.", "s-sources");
    h += sec("Les dossiers de recherche", dosList(dos), "", "s-dossiers");
    $("#sp-" + S.id + "-recherche").innerHTML = h;
    // Ailleurs
    var keys = S.carte || [], fa = ailleurs(keys);
    h = fa ? sec("Pays par pays", fa, "Ce que font d'autres pays sur ce thème : les faits vérifiés de la carte internationale, chacun avec sa source. Voir sur la carte : " + mapLinks(keys) + ".")
      : sec("Pays par pays", '<p class="empty s-item" data-s="carte internationale">La carte internationale ne couvre pas encore ce thème : voir les études et le dossier ci-dessous.</p>');
    if (S.politiques) h += sec("Politiques d'ailleurs", pol.map(function (n) {
      return item("div", "box", n.titre + " " + (n.bref || []).join(" "), '<p class="kick">' + esc(n.pays) + " · " + esc(n.date) + '</p><p><strong><a href="#international/politiques" data-route="international/politiques">' + esc(n.titre) + "</a></strong></p>" + ul(n.bref));
    }).join(""), "Fiches d'une page, dans l'onglet International.");
    h += sec("Études menées à l'étranger", ids(S.sources_ailleurs, srcById).map(srcHTML).join(""));
    h += sec("Dossiers de recherche", dosList(ids(S.dossiers_ailleurs, dosBySlug)));
    $("#sp-" + S.id + "-ailleurs").innerHTML = h;
  });

  // ---------------- International: « Politiques d'ailleurs »
  (function () {
    var el = $("#sp-international-politiques"); if (!el) return;
    var fiches = POL.map(function (n) {
      var body = (n.sections || []).map(function (s) { return "<h3>" + esc(s.titre) + "</h3>" + s.paragraphes.map(function (p) { return "<p>" + md(p) + "</p>"; }).join(""); }).join("");
      var text = [n.titre, (n.bref || []).join(" "), (n.sections || []).map(function (s) { return s.titre + " " + s.paragraphes.join(" "); }).join(" ")].join(" ");
      return item("article", "fiche", text,
        '<p class="kick">' + esc(n.pays) + " · " + esc(n.date) + " · note d'une page</p><h3 class=\"fiche-t\">" + esc(n.titre) + '</h3><p class="note-src">' + esc(n.auteur) + "</p>" +
        "<h4>En bref</h4>" + '<ul class="bref">' + (n.bref || []).map(function (b) { return "<li>" + md(b) + "</li>"; }).join("") + "</ul>" +
        '<details class="lire"><summary>Lire la note</summary>' + body + "</details>" +
        (n.sources ? '<p class="src"><strong>Sources :</strong> ' + md(n.sources) + "</p>" : "") +
        '<p><a class="btn btn2" href="' + esc(BASE + "/assets/notes/" + n.pdf) + '">La note en PDF (1 page)</a></p>');
    }).join("");
    var milSrc = ids(["milburn-2026", "kickstart-2024", "garantie-jeunes-2016", "insee-neet-2026"], srcById);
    var themes = SUJ.map(function (S) { return '<a href="#' + S.id + '/ailleurs" data-route="' + S.id + '/ailleurs">' + esc(S.titre) + "</a>"; }).join(" · ");
    el.innerHTML = sec("Politiques d'ailleurs", fiches, "Fiches d'une page sur une politique étrangère : ce qu'elle propose, ce qui a été retenu, et ce que cela dit pour la France.", "s-fiches") +
      blocMilburn() +
      sec("Les sources du rapport Milburn", milSrc.map(srcHTML).join("")) +
      sec("Le dossier de recherche", dosList(ids(["12-milburn-review"], dosBySlug))) +
      '<p class="strip">Ailleurs, thème par thème : ' + themes + "</p>";
  })();

  // ---------------- Accueil
  (function () {
    var el = $("#p-accueil"); if (!el) return;
    var d = W.BUILT ? new Date(W.BUILT * 1000) : new Date();
    var date = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    var tile = function (route, title, text, meta, img) {
      return '<a class="tile' + (img ? " tile-img" : "") + '" href="#' + route + '" data-route="' + route + '">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : "") +
        "<b>" + esc(title) + '</b><span class="mut">' + esc(text) + "</span>" + (meta ? '<span class="tn">' + esc(meta) + "</span>" : "") + "</a>";
    };
    var themeTiles = SUJ.map(function (S) {
      var K = S.donnees || [], G = S.graphiques || {};
      var np = PROPS.filter(function (p) { return any(p.sujets, S.propositions || []); }).length;
      var ns = SRC.filter(function (s) { return any(s.sujets, K); }).length + ids(S.sources_recherche, srcById).length;
      var ng = (G.essentiel || []).length + (G.recherche || []).length;
      var nn = NOTES.filter(function (n) { return any(n.sujets, K); }).length + POL.filter(function (n) { return any(n.sujets, K); }).length;
      var meta = [np ? plural(np, "proposition") : "", S.voie_pro ? "indice de risque" : "", nn ? plural(nn, "note") : "", ns ? plural(ns, "source") : "", ng ? plural(ng, "graphique") : ""].filter(Boolean).join(" · ");
      return tile(S.id + "/essentiel", S.titre, S.intro.split(". ")[0].replace(/\.$/, "") + ".", meta);
    }).join("") + tile("international/politiques", "International", "Ce que font les autres pays, thème par thème, et des fiches d'une page sur leurs politiques, en commençant par le rapport Milburn.",
      plural((AIL.facts || []).filter(function (f) { return f.country !== "FR"; }).length, "fait vérifié", "faits vérifiés") + " hors France · " + plural(POL.length, "fiche"));
    var tools = tile("boussole", "La Boussole des formations", "De la 5e au premier emploi, les débouchés de chaque formation (Affelnet, Parcoursup, Mon Master) et ce que l'IA sait déjà faire des premiers métiers.", "Outil interactif") +
      tile("boussole/carte", "La carte des lycées pro", VP ? VP.carte.split(". ")[0] + ". Un clic sur un lycée affiche sa fiche." : "", "Outil interactif · dans la Boussole", BASE + "/assets/captures/boussole-lycees-pro-ia-chine.jpg") +
      tile("international/carte", "La carte internationale", "Clique sur un pays : temps des professeurs, gouvernance, orientation, secondes chances dans le supérieur et apprentissage, chaque chiffre sourcé.", "Outil interactif");
    var last = POL.map(function (n) { return '<li><a href="#international/politiques" data-route="international/politiques">' + esc(n.titre) + '</a> <span class="mut">' + esc(n.date) + ' · <a href="' + esc(BASE + "/assets/notes/" + n.pdf) + '">PDF</a></span></li>'; }).join("") +
      NOTES.map(function (n) { return '<li><a href="' + esc(BASE + "/assets/notes/" + n.fichier) + '">' + esc(n.titre) + '</a> <span class="mut">' + esc(n.date) + " · PDF</span></li>"; }).join("") +
      GEN.map(function (n) { var pdf = n.pdf || (n.dossier ? n.dossier + "/note.pdf" : ""); return "<li>" + (pdf ? '<a href="' + esc(fileUrl(pdf)) + '">' + esc(n.titre) + "</a>" : esc(n.titre)) + ' <span class="mut">' + esc(frDate(n.date)) + " · brouillon généré, non relu</span></li>"; }).join("");
    var gh = "https://github.com/" + W.REPO;
    el.innerHTML = '<div class="intro"><p class="kick">Mis à jour le ' + esc(date) + "</p>" +
      "<h1>Propositions et données du GT Éducation</h1>" +
      '<p class="lead">Les travaux du groupe de travail Éducation de Préparer l\'avenir et les données qui les appuient.</p></div>' +
      '<h2 class="h2">Par thème</h2><div class="grid">' + themeTiles + "</div>" +
      '<h2 class="h2">Outils interactifs</h2><div class="grid">' + tools + "</div>" +
      '<h2 class="h2">Dernières notes</h2><ul class="lst">' + last + "</ul>" +
      '<section class="box" id="rediger"><h2>Rédiger une note</h2>' +
      '<p><a class="btn btn-gen" href="' + esc(gh + "/issues/new?template=note.yml&title=" + encodeURIComponent("[note] ")) + '" target="_blank" rel="noopener">Générer un brouillon</a></p>' +
      '<p class="note-src">Recherche sourcée, chiffres vérifiés à la source, note au format du GT (Word et PDF). Brouillon non relu ; génération réservée aux membres autorisés du dépôt.</p>' +
      '<p><a href="' + esc(BASE + "/assets/modele/modele-note.docx") + '">Modèle Word</a> · <a href="' + esc(BASE + "/assets/modele/modele-note.md") + '">Modèle texte</a> : En bref, constat chiffré, analyse, position du programme, propositions, argumentaire, mise en œuvre, références. Une à deux pages ; jamais de chiffre ni de position du candidat inventés.</p>' +
      '<p class="note-src">Dans « Recherche et données », le bouton « Copier » de chaque fiche de source copie son chiffre clé et sa référence. Une erreur ? <a href="' + esc(gh + "/issues/new?template=feedback.yml") + '" target="_blank" rel="noopener">Signaler une correction</a>.</p></section>';
  })();

  // links to cards that are not shown anywhere (e.g. the IA note's own proposals) become plain text
  $$("a.tocard").forEach(function (a) { if (!document.getElementById("p-" + a.getAttribute("data-card"))) { var t = document.createElement("span"); t.innerHTML = a.innerHTML; a.parentNode.replaceChild(t, a); } });

  // ---------------- charts (Vega-Lite, drawn when visible)
  var PAL = ["#2a78d6", "#eb6834", "#1baf7a"];
  function spec(g) {
    var data = { url: BASE + "/assets/charts/data/" + g.id + ".csv", format: { type: "csv", parse: { valeur: "number", salaire: "number" } } };
    var tip = [{ field: "categorie", title: " " }, { field: "serie", title: "Série" }, { field: "valeur", title: g.unite, format: ",.1~f" }];
    if (g.id === "insersup") tip.push({ field: "salaire", title: "Salaire net médian (€)", format: ",.0f" });
    var color = { field: "serie", type: "nominal", title: null, scale: { range: PAL }, legend: { orient: "top" } };
    var base = { $schema: "https://vega.github.io/schema/vega-lite/v5.json", data: data, width: "container",
      config: { font: "system-ui, sans-serif", axis: { labelColor: "#4a5468", titleColor: "#4a5468", gridColor: "#e3e6ec", domainColor: "#cfd5df", labelFontSize: 11, titleFontSize: 11 },
        legend: { labelColor: "#4a5468", labelFontSize: 11 }, view: { stroke: null }, locale: { number: { decimal: ",", thousands: " ", grouping: [3] } } } };
    var lbl = { type: "text", fontSize: 11, color: "#1d2433" };
    var txt = { text: { field: "valeur", type: "quantitative", format: ",.1~f" } };
    if (g.type === "ligne") {
      base.height = 240;
      base.encoding = { x: { field: "categorie", type: "ordinal", title: null, axis: { labelAngle: 0 } }, y: { field: "valeur", type: "quantitative", title: g.unite, scale: { zero: false } }, color: color, tooltip: tip };
      base.layer = [{ mark: { type: "line", strokeWidth: 2 } }, { mark: { type: "point", filled: true, size: 70 } }];
      if (g.etiquettes !== false) base.layer.push({ mark: Object.assign({ dy: -10 }, lbl), encoding: txt });
      return base;
    }
    if (g.type === "barres") {
      base.height = 260;
      base.encoding = { x: { field: "categorie", type: "nominal", sort: null, title: null, axis: { labelAngle: 0, labelLimit: 140 } },
        xOffset: { field: "serie", sort: null }, y: { field: "valeur", type: "quantitative", title: g.unite }, color: color, tooltip: tip };
      base.layer = [{ mark: { type: "bar", cornerRadiusTopLeft: 3, cornerRadiusTopRight: 3 } }, { mark: Object.assign({ dy: -7 }, lbl), encoding: txt }];
      return base;
    }
    base.height = { step: 34 };
    base.encoding = { y: { field: "categorie", type: "nominal", sort: null, title: null, axis: { labelLimit: 220 } }, yOffset: { field: "serie", sort: null },
      x: { field: "valeur", type: "quantitative", title: g.unite }, color: color, tooltip: tip };
    base.layer = [{ mark: { type: "bar", cornerRadiusEnd: 3 } }, { mark: Object.assign({ align: "left", dx: 4 }, lbl), encoding: txt }];
    return base;
  }
  W.__chartSpec = function (id) { return spec(gById[id]); };
  function drawCharts(root) {
    $$(".vis[data-chart]", root).forEach(function (el) {
      if (el.getAttribute("data-done")) return;
      el.setAttribute("data-done", "1");
      var g = gById[el.getAttribute("data-chart")];
      if (typeof W.vegaEmbed !== "function") { el.innerHTML = '<p class="empty">Graphique indisponible (bibliothèque non chargée) : voir les données ci-dessous.</p>'; return; }
      W.vegaEmbed(el, spec(g), { actions: false, renderer: "svg" }).catch(function () { el.innerHTML = '<p class="empty">Graphique indisponible : voir les données.</p>'; });
    });
  }

  // ---------------- navigation
  var tabs = $$("#tabs .tab");
  var CUR = { topic: null, sub: {} };
  var topOffset = function () { return ((document.querySelector("header.top") || {}).offsetHeight || 0) + (($("#tabs") || {}).offsetHeight || 0); };
  function scrollToEl(el) { if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - topOffset() - 8); }
  function show(topic, sub, extra) {
    var subs = subsOf(topic);
    if (subs) {
      if (!subs.some(function (s) { return s[0] === sub; })) sub = CUR.sub[topic] || subs[0][0];
      CUR.sub[topic] = sub;
    }
    CUR.topic = topic;
    tabs.forEach(function (t) { var on = t.id === "t-" + topic; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; $("#" + t.getAttribute("aria-controls")).hidden = !on; });
    if (topic === "boussole") { loadBoussole(sub); return; }
    if (!subs) return;
    var panel = $("#p-" + topic);
    $$(".subtab", panel).forEach(function (b) { var on = b.getAttribute("data-sub") === sub; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    $$(".subpanel", panel).forEach(function (p) { p.hidden = p.getAttribute("data-sub") !== sub; });
    if (topic === "international" && sub === "carte") loadComparaisons(extra);
    drawCharts($("#sp-" + topic + "-" + sub));
  }
  // route: "topic[/sub[/extra]]". extra = a section id to scroll to, or the map theme for international/carte; for the Boussole, sub = anchor in the frame
  function go(route, replace) {
    var parts = route.split("/"), topic = parts[0], sub = parts[1], extra = parts[2];
    if (!$("#t-" + topic)) topic = "accueil";
    show(topic, sub, extra);
    var h = "#" + topic + (topic === "boussole" ? (sub ? "/" + sub : "") : subsOf(topic) ? "/" + CUR.sub[topic] + (extra ? "/" + extra : "") : (sub ? "/" + sub : ""));
    if (location.hash !== h) history[replace ? "replaceState" : "pushState"](null, "", h);
    if (topic === "boussole" && sub) return;   // the frame scrolls itself to the anchor
    var target = topic === "accueil" && sub ? document.getElementById(sub) : extra && subsOf(topic) && topic !== "international" ? $('[data-sec="' + extra.replace(/"/g, "") + '"]', $("#sp-" + topic + "-" + CUR.sub[topic])) : null;
    if (target) scrollToEl(target); else window.scrollTo(0, 0);
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { go(t.id.slice(2)); }); });
  $$(".subtab").forEach(function (b) { b.addEventListener("click", function () { go(b.closest(".panel").id.slice(2) + "/" + b.getAttribute("data-sub")); }); });
  // arrow keys move between tabs of the same tab list (WAI-ARIA tabs pattern)
  document.addEventListener("keydown", function (e) {
    var b = e.target.closest && e.target.closest('[role="tab"]'); if (!b || (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End")) return;
    var list = $$('[role="tab"]', b.parentNode), i = list.indexOf(b);
    var j = e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : (i + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length;
    e.preventDefault(); list[j].focus(); list[j].click();
  });
  // sticky header + tab bar: the tab bar sits just under the header
  function stickTop() { var h = document.querySelector("header.top"); document.documentElement.style.setProperty("--toph", (h ? h.offsetHeight : 0) + "px"); }
  stickTop(); window.addEventListener("resize", stickTop);
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-route]");
    if (a) { e.preventDefault(); clearSearch(); go(a.getAttribute("data-route")); return; }
    var c = e.target.closest && e.target.closest("a.tocard, a.perma");
    if (c) { e.preventDefault(); openCard(c.getAttribute("data-card")); }
  });

  // ---------------- Boussole embedded (same origin: the frame takes the height of its content)
  var bf = $("#bframe");
  function fit() {
    try { var d = bf.contentDocument; if (d && d.body) bf.style.height = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight, 600) + "px"; } catch (e) { /* cross-origin: keep CSS height */ }
  }
  function toAnchor(anchor) {
    if (!anchor) return;
    try {
      var t = bf.contentDocument && bf.contentDocument.getElementById(anchor);
      if (t) window.scrollTo(0, bf.getBoundingClientRect().top + window.pageYOffset + t.getBoundingClientRect().top - 10 - topOffset());
    } catch (e) { /* ignore */ }
  }
  var bAnchor = null;
  function loadBoussole(anchor) {
    bAnchor = anchor || null;
    if (!bf.getAttribute("src")) {
      bf.addEventListener("load", function () {
        fit(); toAnchor(bAnchor);
        try {
          var d = bf.contentDocument;
          if (W.ResizeObserver && d && d.body) new W.ResizeObserver(fit).observe(d.body);
          d.addEventListener("click", function () { setTimeout(fit, 50); setTimeout(fit, 400); });
        } catch (e) { /* ignore */ }
      });
      bf.setAttribute("src", bf.getAttribute("data-src"));
    } else { fit(); toAnchor(bAnchor); }
  }

  // ---------------- Comparaisons internationales embedded (same origin: fit the frame to its content; a map theme can be preset)
  var cf = $("#cframe"), cTheme = null;
  function cfit() { try { var d = cf.contentDocument; if (d && d.body) cf.style.height = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight, 700) + "px"; } catch (e) { /* keep CSS height */ } }
  function cpreset() { try { var b = cTheme && cf.contentDocument.getElementById("tab-" + cTheme); if (b && b.getAttribute("aria-selected") !== "true") b.click(); } catch (e) { /* ignore */ } }
  function loadComparaisons(theme) {
    if (!cf) return;
    cTheme = mapTheme[theme] ? theme : null;
    if (cf.getAttribute("src")) { cpreset(); cfit(); return; }
    cf.addEventListener("load", function () {
      cfit(); cpreset();
      try { var d = cf.contentDocument;
        if (W.ResizeObserver && d && d.body) new W.ResizeObserver(cfit).observe(d.body);
        d.addEventListener("click", function () { setTimeout(cfit, 50); setTimeout(cfit, 400); });
      } catch (e) { /* ignore */ }
    });
    cf.setAttribute("src", cf.getAttribute("data-src") + (cTheme ? "#theme=" + cTheme : ""));
  }

  // ---------------- copy buttons
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button.copy"); if (!b) return;
    var s = srcById[b.getAttribute("data-copy")]; if (!s) return;
    var txt = s.cle + "\nRéférence : " + s.ref + (s.lien ? " " + s.lien : "");
    var done = function () { b.textContent = "Copié"; setTimeout(function () { b.textContent = "Copier"; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { window.prompt("Copier :", txt); });
    else window.prompt("Copier :", txt);
  });

  // ---------------- search across every tab and sub-tab (and the text of the research files)
  var Q = "", RIDX = null, loading = false;
  function loadIndex() {
    if (RIDX || loading || typeof fetch !== "function") return;
    loading = true;
    fetch(BASE + "/assets/recherche-index.json").then(function (r) { return r.json(); }).then(function (j) {
      RIDX = j.map(function (d) { d._n = norm(d.texte); return d; }); apply();
    }).catch(function () { loading = false; });
  }
  function apply() {
    var hits = {}, subHits = {};
    $$(".s-item").forEach(function (el) {
      var ok = !Q || norm(el.getAttribute("data-s") + " " + el.textContent).indexOf(Q) >= 0;
      el.hidden = !ok;
      if (ok) {
        var p = el.closest(".panel"), sp = el.closest(".subpanel");
        if (p) hits[p.id.slice(2)] = (hits[p.id.slice(2)] || 0) + 1;
        if (sp) subHits[sp.id] = (subHits[sp.id] || 0) + 1;
      }
    });
    $$(".hsec").forEach(function (s) { var it = $$(".s-item", s); s.hidden = !!Q && it.length > 0 && it.every(function (i) { return i.hidden; }); });
    tabs.forEach(function (t) { var k = t.id.slice(2); $(".hits", t).textContent = Q && k !== "accueil" ? " " + (hits[k] || 0) : ""; t.classList.toggle("nohit", !!Q && !hits[k]); });
    $$(".subtab").forEach(function (b) {
      var id = "sp-" + b.closest(".panel").id.slice(2) + "-" + b.getAttribute("data-sub"), n = subHits[id] || 0;
      $(".hits", b).textContent = Q ? " " + n : ""; b.classList.toggle("nohit", !!Q && !n);
    });
    var total = Object.keys(hits).reduce(function (a, k) { return a + hits[k]; }, 0);
    var nd = 0, dh = $("#dossier-hits");
    if (Q && RIDX) {
      var res = RIDX.filter(function (d) { return d._n.indexOf(Q) >= 0; }); nd = res.length;
      dh.innerHTML = res.length ? '<p class="note-src">Dans le texte des dossiers de recherche :</p><ul class="lib">' + res.map(function (d) {
        var i = d._n.indexOf(Q), a = Math.max(0, i - 80);
        return '<li><a href="' + esc(BASE + "/recherche/" + d.slug + ".html") + '">' + esc(d.titre) + '</a><div class="snip">… ' + esc(d.texte.slice(a, i + Q.length + 110)) + " …</div></li>";
      }).join("") + "</ul>" : "";
    } else dh.innerHTML = "";
    $("#gres").hidden = !Q;
    $("#gcount").textContent = Q ? total + " résultat" + (total > 1 ? "s" : "") + " pour « " + $("#gq").value.trim() + " » (nombre à côté de chaque onglet et sous-onglet)" + (nd ? ", et " + nd + " dossier" + (nd > 1 ? "s" : "") + " de recherche ci-dessous." : ".") : "";
    if (Q && total) {   // stay where results are
      var topic = CUR.topic;
      if (!hits[topic]) topic = tabs.map(function (t) { return t.id.slice(2); }).filter(function (k) { return hits[k]; })[0];
      var subs = subsOf(topic);
      if (subs) {
        var sub = CUR.sub[topic] || subs[0][0];
        if (!subHits["sp-" + topic + "-" + sub]) sub = subs.map(function (s) { return s[0]; }).filter(function (k) { return subHits["sp-" + topic + "-" + k]; })[0] || sub;
        show(topic, sub);
      } else if (topic) show(topic);
    }
    return total;
  }
  function clearSearch() { if (Q) { Q = ""; $("#gq").value = ""; apply(); } }
  var timer;
  $("#gq").addEventListener("input", function (e) { clearTimeout(timer); timer = setTimeout(function () { Q = norm(e.target.value.trim()); if (Q) loadIndex(); apply(); }, 150); });

  // ---------------- deep links (and the routes of the former site)
  var LEGACY = {
    "ia": "orientation/essentiel", "ia/synthese": "orientation/essentiel/s-note-ia", "ia/milburn": "international/politiques",
    "ia/masters": "orientation/recherche/s-masters", "ia/comms": "orientation/recherche/s-comms", "ia/sources": "orientation/recherche/s-sources",
    "handicap/synthese": "handicap/essentiel", "handicap/handicap": "handicap/recherche/s-handicap", "handicap/sante": "handicap/recherche/s-sante-mentale-et-ecrans", "handicap/sources": "handicap/recherche/s-sources",
    "orientation/synthese": "orientation/essentiel", "orientation/sources": "orientation/recherche/s-sources",
    "gouvernance": "ecole/essentiel", "gouvernance/synthese": "ecole/essentiel", "gouvernance/recherche": "ecole/recherche", "gouvernance/sources": "ecole/recherche/s-sources",
    "comparaisons": "international/carte",
    "emploi": "orientation", "inclusion": "handicap", "ecrans": "handicap", "formation": "ecole", "preuves": "orientation/recherche/s-sources", "carte": "boussole/carte"
  };
  function openCard(id) {
    var d = document.getElementById("p-" + id); if (!d) return;
    clearSearch();
    var sp = d.closest(".subpanel");
    go(sp.getAttribute("data-topic") + "/" + sp.getAttribute("data-sub"));
    d.open = true; scrollToEl(d); d.classList.add("flash"); setTimeout(function () { d.classList.remove("flash"); }, 1600);
  }
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (h.indexOf("p-") === 0 && document.getElementById(h)) { openCard(h.slice(2)); return; }
    var p = h.split("/");
    if (LEGACY[h]) h = LEGACY[h];
    else if (LEGACY[p[0] + "/" + p[1]]) h = LEGACY[p[0] + "/" + p[1]];
    else if (LEGACY[p[0]] && !$("#t-" + p[0])) h = LEGACY[p[0]] + (p[1] ? "/" + p.slice(1).join("/") : "");
    go(h || "accueil", true);
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  apply(); route();
  window.addEventListener("popstate", route);
})();
