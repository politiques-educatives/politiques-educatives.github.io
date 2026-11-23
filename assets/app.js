// Politiques éducatives : Accueil, one page per theme (sections from _data/sections.yml, read in order), International (two sub-tabs), Boussole.
// Routes: #accueil[/rediger], #<theme>[/<section id>|/reste], #international/<carte[/<map theme>[/<country>]]|politiques>, #boussole[/<anchor>], #p-<card id>.
// Old routes (#ia/…, #gouvernance/…, #<theme>/essentiel|recherche|ailleurs[/<section>]) are redirected (LEGACY, OLDSEC).
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
  var SUBS = { international: [["carte", "La carte"], ["politiques", "Politiques d'ailleurs"]] };
  var subsOf = function (topic) { return topic === "international" ? SUBS.international : null; };
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
        "France contrat d'engagement jeune Garantie jeunes missions locales comparaison") +
      (W.MILBURN_CRIT && W.MILBURN_CRIT.paragraphes ? row('<span class="pt">' + esc(W.MILBURN_CRIT.titre) + "</span>",
        W.MILBURN_CRIT.paragraphes.map(function (p) { return "<p>" + md(p) + "</p>"; }).join("") + '<p class="note-src">' + md(W.MILBURN_CRIT.source || "") + "</p>",
        "Milburn critiques Simons Freedman coût État " + W.MILBURN_CRIT.paragraphes.join(" ")) : ""),
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
  // Suivi en direct (scripts/build_suivi.py, actualisé chaque jour par .github/workflows/suivi.yml) : _data/suivi.json
  function spark(serie) {
    if (!serie || serie.length < 2) return "";
    var vs = serie.map(function (x) { return x.v; }), mn = Math.min.apply(null, vs), mx = Math.max.apply(null, vs), w = 200, h = 40;
    var pts = vs.map(function (v, i) { return (i * w / (vs.length - 1)).toFixed(1) + "," + (h - 4 - (mx === mn ? 0 : (v - mn) * (h - 8) / (mx - mn))).toFixed(1); }).join(" ");
    return '<svg viewBox="0 0 ' + w + " " + h + '" width="100%" height="' + h + '" role="img" aria-label="' + esc(serie[0].t + " à " + serie[serie.length - 1].t) + '"><polyline fill="none" stroke="currentColor" stroke-width="2" points="' + pts + '"/></svg>' +
      '<div class="ts">' + esc(serie[0].t) + " → " + esc(serie[serie.length - 1].t) + "</div>";
  }
  function fr1(v) { return v === null || v === undefined ? "n.d." : Number(v).toFixed(1).replace(".", ","); }
  function nb(v) { return Number(v).toLocaleString("fr-FR"); }
  function blocSuivi() {
    var S = W.SUIVI || {}, c = S.chomage, l = S.lift, t = [];
    if (c) t.push('<div class="tile"><div class="big">' + fr1(c.jeunes) + " %<span> au " + esc(c.periode) + "</span></div>" +
      '<div class="tl">Chômage des moins de 25 ans (ensemble : ' + fr1(c.ensemble) + " %), contre " + fr1(c.jeunes_an_avant) + " % un an plus tôt</div>" + spark(c.serie) +
      '<div class="ts"><a href="' + esc(c.url) + '" target="_blank" rel="noopener">Insee</a>, chômage au sens du BIT, données CVS</div></div>');
    if (l) t.push('<div class="tile"><div class="big">' + nb(l.ia_generative) + "<span> offres au " + esc(l.trimestre) + "</span></div>" +
      '<div class="tl">Offres d\'emploi demandant des compétences en IA générative' + (l.ia_generative_an_avant ? ", contre " + nb(l.ia_generative_an_avant) + " un an plus tôt" : "") + " ; " + fr1(l.part_generative) + " % des " + nb(l.ia_toutes) + " offres en IA du trimestre</div>" + spark(l.serie) +
      '<div class="ts"><a href="' + esc(l.url) + '" target="_blank" rel="noopener">LIFT, HEC Paris</a>, base JOCAS de la Dares ; la série s\'arrête en ' + esc(l.fin) + "</div></div>");
    t.push('<div class="tile"><div class="big">−28 %<span> contre −7,5 %</span></div>' +
      '<div class="tl">Embauches en CDI des 21-29 ans, novembre 2022 à mars 2026, dans le cinquième des métiers les plus exposés à l\'IA, contre le cinquième le moins exposé</div>' +
      '<div class="ts">Palladino, Bergeaud, Bertheau, Bunel et Degos (2026), Banque de France et LIFT. Étude, non actualisée ; la cause n\'est pas établie.</div></div>');
    return sec("Suivi en direct : l'IA et l'emploi des jeunes",
      '<div class="tiles">' + t.join("") + "</div>" +
      '<p class="note-src">Chiffres lus dans les séries publiques le ' + esc(S.lu_le ? S.lu_le.split("-").reverse().join("/") : "") + ", actualisés chaque jour. Le chômage couvre tout le marché du travail et n\'isole pas l\'effet de l\'IA ; les offres en IA mesurent la demande de spécialistes, pas l\'effet de l\'IA sur les autres emplois.</p>", "", "s-suivi");
  }
  var BLOCS = { masters: blocMasters, comms: blocComms, note_ia: noteIA, suivi: blocSuivi };


  // ---------------- « Voie pro et technologies de pointe »: blocks of _data/voie_pro.yml, placed by sections.yml (voiepro / voiepro_plus)
  var vpSrc = function () { return '<p class="src">Source : ' + esc(VP.source) + "</p>"; };
  var RISK_COLS = [0, 1, 2, 3, 4, 5];
  var VPB = {
    portefeuille: function () { return blk("Choisir comme on compose un portefeuille", item("p", "", VP.portefeuille, md(VP.portefeuille)) + vpSrc()); },
    indice: function () {
      return blk("L'indice de risque des filières techniques (version 1)",
        '<p class="note-src">Une mesure du GT : le risque d\'une spécialité, pas seulement son exposition à l\'IA. Risque et rangs de 0 à 1 (1 = plus de risque).</p>' +
        "<h4>Les 10 spécialités les moins risquées</h4>" + table(VP.faibles, RISK_COLS, "moins risquées faible risque") + item("p", "", VP.apres_faibles, md(VP.apres_faibles)) +
        "<h4>Les 10 spécialités les plus risquées</h4>" + table(VP.forts, RISK_COLS, "plus risquées risque élevé") + item("p", "", VP.apres_forts, md(VP.apres_forts)) + vpSrc());
    },
    resultats: function () { return blk("Les résultats de la version 1", ul(VP.resultats) + vpSrc()); },
    methode: function () {
      return blk("Méthode de l'indice", item("p", "", VP.demande_v1, md(VP.demande_v1)) + table(VP.composantes, null, "composantes méthode") +
        item("p", "", VP.echelle, md(VP.echelle)) + item("p", "", VP.poids, md(VP.poids)) +
        "<h4>Les cinq scénarios (vue portefeuille)</h4>" + table(VP.scenarios, null, "scénarios portefeuille poids") +
        "<h4>Les 10 extrêmes, composante par composante</h4>" + table(VP.faibles, null, "moins risquées composantes") + table(VP.forts, null, "plus risquées composantes") + vpSrc());
    },
    batiment: function () {
      return blk("Le bâtiment, revérifié", '<ol class="ev">' + VP.batiment.map(function (x) { return item("li", "", x, md(x)); }).join("") + "</ol>" +
        table(VP.batiment_table, null, "bâtiment BMO tension Dares") + item("p", "note-src", VP.batiment_note, esc(VP.batiment_note)) + item("p", "", VP.lecture_tension, md(VP.lecture_tension)) + vpSrc());
    },
    limites: function () { return blk("Limites de l'indice", ul(VP.limites)); },
    chine: function () { return blk("La concurrence chinoise dans la Boussole", item("p", "", VP.chine, md(VP.chine))); },
    donnees: function () { return blk("Les données de l'indice", '<ul class="lib">' + VP.donnees.map(function (d) { return item("li", "", d[0], '<a href="' + esc(d[1]) + '" target="_blank" rel="noopener">' + esc(d[0]) + "</a>"); }).join("") + "</ul>"); },
    carte: function () {
      return item("div", "vp-carte", "carte lycées professionnels bac pro CAP spécialités IA Chine zone d'emploi " + VP.carte,
        '<a class="vp-img" href="#boussole/carte" data-route="boussole/carte"><img src="' + esc(BASE + "/assets/captures/boussole-lycees-pro-ia-chine.jpg") + '" alt="Capture de la carte des lycées professionnels dans la Boussole" width="240" loading="lazy"></a>' +
        "<div><p>" + md(VP.carte) + '</p><p class="src">Sources : ' + esc(VP.carte_source) + '</p><p><a class="btn" href="#boussole/carte" data-route="boussole/carte">Ouvrir la carte des lycées pro</a></p></div>');
    }
  };
  function blk(title, body, cls) { return body ? '<div class="qblk' + (cls ? " " + cls : "") + '"><h3>' + title + "</h3>" + body + "</div>" : ""; }

  // ---------------- sections of each theme (_data/sections.yml)
  var SECT = W.SECTIONS || { themes: [] }, APPORT = SECT.apports || {};
  var factById = {}; (AIL.facts || []).forEach(function (f) { factById[f.id] = f; });
  var cname = function (k) { return (AIL.countries || {})[k] || k; };
  var noteByFile = {}; NOTES.forEach(function (n) { noteByFile[n.fichier] = n; });
  var polByPdf = {}; POL.forEach(function (n) { polByPdf[n.pdf] = n; });
  var genByDir = {}; GEN.forEach(function (n) { if (n.dossier) genByDir[n.dossier] = n; });
  var livByN = {}; LIV.forEach(function (m) { livByN[String(m.n)] = m; });
  var ajById = {}; AJ.forEach(function (a) { if (a.id) ajById[a.id] = a; });
  var TAG2THEME = { formation: "ecole", inegalites: "ecole", inclusion: "handicap", ecrans: "handicap", orientation: "orientation", emploi: "orientation" };
  var themeOfTags = function (tags) { for (var i = 0; i < (tags || []).length; i++) { if (TAG2THEME[tags[i]]) return TAG2THEME[tags[i]]; if (sujById[tags[i]]) return tags[i]; } return null; };
  function getPath(obj, path) { return String(path).split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function resolve(x) {   // one « En bref » element -> markdown text
    if (typeof x === "string") return x;
    if (!x) return "";
    if (x.source) return srcById[x.source] ? srcById[x.source].cle : "";
    if (x.vp) return VP ? getPath(VP, x.vp) || "" : "";
    if (x.note_ia) { var c = getPath(W.NOTE_IA, x.note_ia); return c ? "**" + c.titre + ".** " + c.texte.charAt(0).toUpperCase() + c.texte.slice(1) : ""; }
    if (x.graphique) return gById[x.graphique] ? gById[x.graphique].note : "";
    return "";
  }
  function chiffreHTML(c) {
    if (!c) return "";
    if (c.graphique && gById[c.graphique]) return '<div class="charts one">' + chartBox(gById[c.graphique]) + "</div>";
    if (c.source && srcById[c.source]) { var s = srcById[c.source];
      return item("div", "kfig", s.cle, '<p class="kf">' + md(s.cle) + '</p><p class="src">' + md(s.ref) + (s.lien ? ' <a href="' + esc(s.lien) + '" target="_blank" rel="noopener">Lien</a>' : "") + "</p>"); }
    if (c.vp === "carte" && VP) return VPB.carte();
    if (c.vp && VP) { var t = getPath(VP, c.vp) || ""; return item("div", "kfig", t, '<p class="kf">' + md(t) + "</p>" + vpSrc()); }
    return "";
  }
  // « Ce que font les autres pays », at the bottom of each theme (since 23/11/2026): the comparison map restricted to the
  // theme's tabs (theme-level `ailleurs` in sections.yml), then the foreign studies attached to its sections (ailleurs_sources).
  function ailleursEndHTML(T, n) {
    var A = T.ailleurs || {}, tabs = (A.carte || []).filter(function (k) { return mapTheme[k]; });
    var studies = [];
    (T.sections || []).forEach(function (q) {
      (q.ailleurs_sources || []).forEach(function (a) { var s = srcById[a.id]; if (!s) return;
        studies.push(item("li", "", a.pays + " " + s.cle, "<b>" + esc(a.pays) + "</b> : " + md(s.cle) + ' <span class="sub">(' + md(q.titre) + ")</span>" +
          (s.lien ? ' <a class="sub" href="' + esc(s.lien) + '" target="_blank" rel="noopener">Lien</a>' : ""))); });
    });
    if (!tabs.length && !studies.length) return "";
    var id = "q-" + T.theme + "-ailleurs", h = '<section class="qsec qail-end" id="' + id + '" data-q="ailleurs" data-t="' + esc(norm("Ce que font les autres pays")) + '" aria-labelledby="qh-' + T.theme + '-ailleurs">' +
      '<h2 class="qh" id="qh-' + T.theme + '-ailleurs"><span class="qn">' + n + "</span>Ce que font les autres pays</h2>";
    if (tabs.length) {
      var src = BASE + "/comparaisons/#themes=" + tabs.join(",") + "&theme=" + tabs[0] + (A.pays ? "&pays=" + A.pays : "") + "&embed=1";
      h += '<p class="bintro">' + (A.intro ? md(A.intro) + " " : "") + "Cliquez sur un pays pour voir ce qu'il fait, chiffres et sources à l'appui, et ce que nous proposons pour la France.</p>" +
        '<iframe class="cfr" title="Carte : ce que font les autres pays (' + esc(sujById[T.theme] ? sujById[T.theme].court : T.theme) + ')" loading="lazy" scrolling="no" src="' + esc(src) + '"></iframe>';
    }
    if (studies.length) h += blk("Études étrangères", '<ul class="ail">' + studies.join("") + "</ul>", "qail");
    return h + "</section>";
  }
  function fitFrame(f) {   // same-origin iframe: grow to its content
    function fit() { try { var d = f.contentDocument; if (d && d.body) f.style.height = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight, 400) + "px"; } catch (e) { /* keep CSS height */ } }
    f.addEventListener("load", function () {
      fit();
      try { var d = f.contentDocument; if (W.ResizeObserver && d && d.body) new W.ResizeObserver(fit).observe(d.body);
        d.addEventListener("click", function () { setTimeout(fit, 50); setTimeout(fit, 400); }); } catch (e) { /* ignore */ }
    });
  }
  function dosLine(d) {
    return item("li", "", d.titre + " " + (APPORT[d.slug] || ""), '<a href="' + esc(BASE + "/recherche/" + d.slug + ".html") + '">' + esc(APPORT[d.slug] || d.titre) + '</a> <span class="meta">dossier de recherche · ' + d.mots + " mots</span>");
  }
  function srcLine(s) {   // a source in « Pour aller plus loin »: title, and on one line what it adds (its key figure)
    return srcHTML(s).replace("</summary>", '<span class="sl">' + md(s.cle) + "</span></summary>");
  }
  function plusHTML(q, label) {   // the content of a « Pour aller plus loin » or « Tout le reste »
    var parts = [], n = [];
    var notes = (q.notes || []).map(function (f) { return noteByFile[f] ? noteHTML(noteByFile[f], false) : polByPdf[f] ? polNoteHTML(polByPdf[f]) : ""; })
      .concat((q.notes_generees || []).map(function (d) { return genByDir[d] ? noteHTML(genByDir[d], true) : ""; })).concat((q._notes || []).map(function (x) { return x; })).filter(Boolean);
    if (notes.length) { parts.push(blk("Les notes du GT", '<ul class="lib">' + notes.join("") + "</ul>")); n.push(plural(notes.length, "note")); }
    var dos = ids(q.dossiers, dosBySlug).concat(q._dos || []);
    if (dos.length) { parts.push(blk("Les dossiers de recherche", '<ul class="lib">' + dos.map(dosLine).join("") + "</ul>")); n.push(plural(dos.length, "dossier")); }
    var gr = (q.graphiques_plus || []).concat(q._gr || []).filter(function (i) { return gById[i]; });
    if (gr.length) { parts.push(blk("Autres graphiques", charts(gr))); n.push(plural(gr.length, "graphique")); }
    var srcs = ids(q.sources, srcById).concat(ids((q.ailleurs_sources || []).map(function (a) { return a.id; }), srcById).filter(function (s) { return (q.sources || []).indexOf(s.id) < 0; })).concat(q._src || []);
    if (srcs.length) { parts.push(blk("Les sources", srcs.map(srcLine).join(""), "srcs")); n.push(plural(srcs.length, "source")); }
    (q.blocs || []).forEach(function (b) { if (BLOCS[b]) parts.push(BLOCS[b]()); });
    (q.voiepro_plus || []).forEach(function (k) { if (VP && VPB[k]) parts.push(VPB[k]()); });
    if (q._props && q._props.length) parts.push(blk("Autres propositions", q._props.map(propHTML).join("")));
    if (q._liv && q._liv.length) parts.push(blk("Le programme (livret)", q._liv.map(livHTML).join("")));
    if (!parts.length) return "";
    return '<details class="more"><summary><span class="more-t">' + label + '</span> <span class="mut">' + esc(n.join(" · ")) + "</span></summary>" + parts.join("") + "</details>";
  }
  function sectionHTML(T, q, i) {
    var props = ids(q.propositions, byId), liv = (q.livret || []).map(function (k) { return livByN[String(k)]; }).filter(Boolean), aj = ids(q.ajouts, ajById);
    var h = '<section class="qsec" id="q-' + T + "-" + esc(q.id) + '" data-q="' + esc(q.id) + '" data-t="' + esc(norm(q.titre)) + '" aria-labelledby="qh-' + T + "-" + esc(q.id) + '">' +
      '<h2 class="qh" id="qh-' + T + "-" + esc(q.id) + '"><span class="qn">' + (i + 1) + "</span>" + md(q.titre) + "</h2>";
    var bref = (q.bref || []).map(resolve).filter(Boolean);
    if (bref.length) h += blk("En bref", '<ul class="bref">' + bref.map(function (t) { return item("li", "", t, md(t)); }).join("") + "</ul>", "qbref");
    var ch = chiffreHTML(q.chiffre); if (ch) h += blk("Le chiffre clé", ch, "qfig");
    (q.voiepro || []).forEach(function (k) { if (VP && VPB[k]) h += VPB[k](); });
    if (props.length || liv.length || aj.length)
      h += blk("Ce que nous proposons", props.map(propHTML).join("") +
        (liv.length ? '<h4>Dans le livret du programme « Croire en nous »</h4>' + liv.map(livHTML).join("") : "") +
        (aj.length ? "<h4>Ce que nos travaux ajoutent au livret</h4>" + '<ul class="ajouts">' + aj.map(function (a) { return item("li", "", a.texte, md(a.texte)); }).join("") + "</ul>" : ""), "qprop");
    if ((q.edl || []).length) h += blk("Éléments de langage", '<ul class="edl">' + q.edl.map(function (e) {
      return item("li", "", e.amorce + " " + e.texte, '<b>' + esc(e.amorce) + '.</b> « ' + esc(e.texte) + ' »' + '<span class="note-src"> ' + esc(e.source) + "</span>"); }).join("") +
      '</ul><p class="note-src">À dire tels quels, sans chiffres. Les chiffres qui les appuient sont dans la section.</p>', "qedl");
    h += plusHTML(q, "Pour aller plus loin");
    return h + "</section>";
  }
  // everything attached to a section; whatever is not attached goes to « Tout le reste » of its theme
  var USED = { p: {}, s: {}, g: {}, d: {}, n: {}, l: {}, a: {}, gen: {} };
  SECT.themes.forEach(function (T) {
    (T.sections || []).concat([T.reste || {}]).forEach(function (q) {
      (q.propositions || []).forEach(function (k) { USED.p[k] = 1; }); (q.sources || []).forEach(function (k) { USED.s[k] = 1; });
      (q.ailleurs_sources || []).forEach(function (a) { USED.s[a.id] = 1; });
      if (q.chiffre && q.chiffre.graphique) USED.g[q.chiffre.graphique] = 1; (q.graphiques_plus || []).forEach(function (k) { USED.g[k] = 1; });
      (q.dossiers || []).forEach(function (k) { USED.d[k] = 1; }); (q.notes || []).forEach(function (k) { USED.n[k] = 1; });
      (q.livret || []).forEach(function (k) { USED.l[String(k)] = 1; }); (q.ajouts || []).forEach(function (k) { USED.a[k] = 1; });
      (q.notes_generees || []).forEach(function (k) { USED.gen[k] = 1; });
    });
  });
  ((SECT.transversal || {}).dossiers || []).forEach(function (k) { USED.d[k] = 1; });
  function leftovers(tid) {
    var mine = function (tags) { return themeOfTags(tags) === tid; };
    return {
      _props: PROPS.filter(function (p) { return !USED.p[p.id] && mine(p.sujets); }),
      _src: SRC.filter(function (s) { return !USED.s[s.id] && mine(s.sujets); }),
      _gr: GR.filter(function (g) { return !USED.g[g.id] && mine([g.sujet]); }).map(function (g) { return g.id; }),
      _dos: DOS.filter(function (d) { return !USED.d[d.slug] && (mine(d.sujets) || (!(d.sujets || []).length && tid === "voiepro")); })
        .concat(ids((SECT.transversal || {}).dossiers, dosBySlug)),
      _notes: NOTES.filter(function (n) { return !USED.n[n.fichier] && mine(n.sujets); }).map(function (n) { return noteHTML(n, false); })
        .concat(POL.filter(function (n) { return !USED.n[n.pdf] && mine(n.sujets); }).map(polNoteHTML))
        .concat(GEN.filter(function (n) { return !USED.gen[n.dossier] && mine(n.sujets || [n.sujet]); }).map(function (n) { return noteHTML(n, true); })),
      _liv: LIV.filter(function (m) { return !USED.l[String(m.n)] && mine(m.sujets); })
    };
  }
  var RT = {};   // estimated reading time per theme (minutes)
  function readMinutes(root) {   // words a reader sees without unfolding anything, at 200 words a minute, plus 30 s per chart
    var words = 0, ch = 0;
    (function walk(el) {
      if (el.nodeType === 3) { words += (el.nodeValue.match(/\S+/g) || []).length; return; }
      if (el.nodeType !== 1 || el.hidden || /^(SCRIPT|SVG|svg|TABLE)$/.test(el.tagName)) { if (el.tagName === "TABLE") words += Math.round((el.textContent.match(/\S+/g) || []).length / 3); return; }
      if (el.classList && el.classList.contains("vis")) { ch++; return; }
      if (el.tagName === "DETAILS" && !el.open) { var s = el.querySelector("summary"); if (s) walk(s); return; }
      for (var c = el.firstChild; c; c = c.nextSibling) walk(c);
    })(root);
    return Math.max(1, Math.round(words / 200 + ch * 0.5));
  }
  SECT.themes.forEach(function (T) {
    var S = sujById[T.theme], body = $("#qb-" + T.theme); if (!S || !body) return;
    var secs = T.sections || [];
    var rest = Object.assign({}, T.reste || {}, leftovers(T.theme));
    rest._liv = ((T.reste || {}).livret || []).map(function (k) { return livByN[String(k)]; }).filter(Boolean).concat(rest._liv);
    rest._props = ids((T.reste || {}).propositions, byId).concat(rest._props);
    var restHTML = plusHTML(rest, "Tout le reste du thème");
    var ail = ailleursEndHTML(T, secs.length + 1);
    body.innerHTML = secs.map(function (q, i) { return sectionHTML(T.theme, q, i); }).join("") + ail +
      (restHTML ? '<section class="qsec qrest" id="q-' + T.theme + '-reste" data-q="reste" data-t="">' + restHTML + "</section>" : "");
    $("#toc-" + T.theme).innerHTML = secs.map(function (q) {
      return '<li><a href="#' + T.theme + "/" + esc(q.id) + '" data-route="' + T.theme + "/" + esc(q.id) + '">' + md(q.titre) + '</a><span class="hits"></span></li>'; }).join("") +
      (ail ? '<li><a href="#' + T.theme + '/ailleurs" data-route="' + T.theme + '/ailleurs">Ce que font les autres pays</a><span class="hits"></span></li>' : "");
    $$("iframe.cfr", body).forEach(fitFrame);
    RT[T.theme] = readMinutes(body);
    $("#rt-" + T.theme).textContent = "Lecture : environ " + RT[T.theme] + " min · " + plural(secs.length + (ail ? 1 : 0), "section");
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
      '<p class="strip">Chaque thème se termine par ce que font les autres pays, sur la carte : ' + themes + "</p>";
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
    var themeTiles = SECT.themes.map(function (T) {
      var S = sujById[T.theme]; if (!S) return "";
      var secs = T.sections || [];
      return '<div class="ttile"><h3 class="tt"><a href="#' + S.id + '" data-route="' + S.id + '">' + esc(S.titre) + "</a></h3>" +
        '<p class="mut">' + esc(S.intro.split(". ")[0].replace(/\.$/, "") + ".") + "</p>" +
        '<ol class="tq">' + secs.map(function (q) { return '<li><a href="#' + S.id + "/" + esc(q.id) + '" data-route="' + S.id + "/" + esc(q.id) + '">' + md(q.titre) + "</a></li>"; }).join("") + "</ol>" +
        '<span class="tn">' + (RT[S.id] ? "Lecture : environ " + RT[S.id] + " min" : "") + "</span></div>";
    }).join("") + tile("international/politiques", "International", "Ce que font les autres pays, sur la carte, et des fiches d'une page sur leurs politiques, en commençant par le rapport Milburn.",
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
      '<p class="lead">Les travaux du groupe de travail Éducation de Préparer l\'avenir et les données qui les appuient. Chaque thème se lit section par section : en bref, le chiffre clé, nos propositions ; puis, en bas du thème, ce que font les autres pays, sur une carte.</p></div>' +
      '<p class="lead"><strong>Nouveau dans le groupe ?</strong> <a href="' + esc(BASE + "/guide.html") + '">Mode d\'emploi</a> : lire un thème en dix minutes, vérifier un chiffre. <a href="' + esc(BASE + "/evaluer.html") + '">Tester une proposition avec des personas</a> : choisissez les personas, collez votre note, copiez la consigne.</p>' +
      '<h2 class="h2">Par thème</h2><div class="grid">' + themeTiles + "</div>" +
      '<h2 class="h2">Outils interactifs</h2><div class="grid">' + tools + "</div>" +
      '<h2 class="h2">Dernières notes</h2><ul class="lst">' + last + "</ul>" +
      '<section class="box" id="rediger"><h2>Rédiger une note</h2>' +
      '<p><a class="btn btn-gen" href="' + esc(gh + "/issues/new?template=note.yml&title=" + encodeURIComponent("[note] ")) + '" target="_blank" rel="noopener">Générer un brouillon</a></p>' +
      '<p class="note-src">Recherche sourcée, chiffres vérifiés à la source, note au format du GT (Word et PDF). Brouillon non relu ; génération réservée aux membres autorisés du dépôt.</p>' +
      '<p><a href="' + esc(BASE + "/assets/modele/modele-note.docx") + '">Modèle Word</a> · <a href="' + esc(BASE + "/assets/modele/modele-note.md") + '">Modèle texte</a> : En bref, constat chiffré, analyse, position du programme, propositions, argumentaire, mise en œuvre, références. Une à deux pages ; jamais de chiffre ni de position du candidat inventés.</p>' +
      '<p class="note-src">Dans « Pour aller plus loin », le bouton « Copier » de chaque fiche de source copie son chiffre clé et sa référence. Une erreur ? <a href="' + esc(gh + "/issues/new?template=feedback.yml") + '" target="_blank" rel="noopener">Signaler une correction</a>.</p></section>';
  })();

  // links to cards that are not shown anywhere become plain text
  $$("a.tocard").forEach(function (a) { if (!document.getElementById("p-" + a.getAttribute("data-card"))) { var t = document.createElement("span"); t.innerHTML = a.innerHTML; a.parentNode.replaceChild(t, a); } });

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
    if (g.type === "carte") {   // choropleth des départements de métropole : CSV categorie = code, serie = nom, valeur
      var sc = { scheme: g.echelle || "blues" };
      if (g.inverse) sc.reverse = true;
      if (g.milieu !== undefined) sc.domainMid = g.milieu;
      delete base.data;
      base.height = 380;
      base.projection = { type: "conicConformal", parallels: [44, 49], rotate: [-3, 0] };
      base.data = { url: BASE + "/assets/charts/geo/departements.geojson", format: { type: "json", property: "features" } };
      var col = { field: "valeur", type: "quantitative", title: g.unite, scale: sc, legend: { orient: "bottom", direction: "horizontal", gradientLength: 220 } };
      var ttv = { field: "valeur", title: g.unite, format: ",.1~f" };
      if (g.classes) {   // classes ordonnées (CSV : valeur = rang 1..n, classe = libellé) : une couleur par classe, dans l'ordre de g.classes
        col = { field: "classe", type: "ordinal", title: g.unite, scale: g.couleurs ? { domain: g.classes, range: g.couleurs } : { domain: g.classes, scheme: g.echelle || "blues", reverse: !!g.inverse },
          legend: { orient: "bottom", direction: "horizontal", columns: g.classes.length, symbolType: "square" } };
        ttv = { field: "classe", title: g.unite };
      }
      base.layer = [
        { mark: { type: "geoshape", fill: "#e3e6ec", stroke: "#fff", strokeWidth: 0.5 } },
        { transform: [{ lookup: "properties.code", from: { data: { url: data.url, format: data.format }, key: "categorie", fields: ["serie", "valeur", "classe"] } },
                      { filter: "isValid(datum.valeur)" }],
          mark: { type: "geoshape", stroke: "#fff", strokeWidth: 0.5 },
          encoding: { color: col, tooltip: [{ field: "serie", title: "Département" }, ttv] } }];
      return base;
    }
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
      if (el.getAttribute("data-done") || el.closest("details:not([open])") || el.closest("[hidden]")) return;
      el.setAttribute("data-done", "1");
      var g = gById[el.getAttribute("data-chart")];
      if (typeof W.vegaEmbed !== "function") { el.innerHTML = '<p class="empty">Graphique indisponible (bibliothèque non chargée) : voir les données ci-dessous.</p>'; return; }
      W.vegaEmbed(el, spec(g), { actions: false, renderer: "svg" }).catch(function () { el.innerHTML = '<p class="empty">Graphique indisponible : voir les données.</p>'; });
    });
  }


  // ---------------- navigation
  // routes: "<theme>[/<section id>|/reste]", "international/<carte[/<map theme>[/<country>]]|politiques>", "boussole[/<anchor>]", "accueil[/rediger]"
  var tabs = $$("#tabs .tab");
  var CUR = { topic: null, sub: {} };
  var topOffset = function () { return ((document.querySelector("header.top") || {}).offsetHeight || 0) + (($("#tabs") || {}).offsetHeight || 0); };
  function scrollToEl(el) { if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - topOffset() - 8); }
  function show(topic, sub, extra, extra2) {
    var subs = subsOf(topic);
    if (subs) {
      if (!subs.some(function (s) { return s[0] === sub; })) sub = CUR.sub[topic] || subs[0][0];
      CUR.sub[topic] = sub;
    }
    CUR.topic = topic;
    tabs.forEach(function (t) { var on = t.id === "t-" + topic; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; $("#" + t.getAttribute("aria-controls")).hidden = !on; });
    if (topic === "boussole") { loadBoussole(sub); return; }
    if (sujById[topic]) { drawCharts($("#p-" + topic)); return; }
    if (!subs) return;
    var panel = $("#p-" + topic);
    $$(".subtab", panel).forEach(function (b) { var on = b.getAttribute("data-sub") === sub; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    $$(".subpanel", panel).forEach(function (p) { p.hidden = p.getAttribute("data-sub") !== sub; });
    if (topic === "international" && sub === "carte") loadComparaisons(extra, extra2);
    drawCharts($("#sp-" + topic + "-" + sub));
  }
  function go(route, replace) {
    var parts = route.split("/"), topic = parts[0], sub = parts[1], extra = parts[2];
    if (!$("#t-" + topic)) topic = "accueil";
    show(topic, sub, extra, parts[3]);
    var target = null, h;
    if (sujById[topic]) {
      target = sub ? document.getElementById("q-" + topic + "-" + sub) : null;
      h = "#" + topic + (target ? "/" + sub : "");
      if (target) { var dd = $("details.more", target); if (sub === "reste" && dd) dd.open = true; }
    } else if (topic === "boussole") h = "#boussole" + (sub ? "/" + sub : "");
    else if (subsOf(topic)) h = "#" + topic + "/" + CUR.sub[topic] + (extra ? "/" + extra + (parts[3] ? "/" + parts[3] : "") : "");
    else { h = "#" + topic + (sub ? "/" + sub : ""); if (topic === "accueil" && sub) target = document.getElementById(sub); }
    if (location.hash !== h) history[replace ? "replaceState" : "pushState"](null, "", h);
    if (topic === "boussole" && sub) return;   // the frame scrolls itself to the anchor
    if (target) scrollToEl(target); else window.scrollTo(0, 0);
    drawCharts(target || $("#p-" + topic));
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
  // charts inside a folded block are drawn when it opens
  document.addEventListener("toggle", function (e) { if (e.target.open) drawCharts(e.target); }, true);

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
  var cf = $("#cframe"), cTheme = null, cPays = null;
  function cfit() { try { var d = cf.contentDocument; if (d && d.body) cf.style.height = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight, 700) + "px"; } catch (e) { /* keep CSS height */ } }
  function cpreset() { try { var b = cTheme && cf.contentDocument.getElementById("tab-" + cTheme); if (b && b.getAttribute("aria-selected") !== "true") b.click(); } catch (e) { /* ignore */ } }
  function loadComparaisons(theme, pays) {
    if (!cf) return;
    cTheme = mapTheme[theme] ? theme : null;
    var p = pays && (AIL.countries || {})[pays] ? pays : null;
    if (cf.getAttribute("src") && p && p !== cPays) { cPays = p; cf.setAttribute("src", cf.getAttribute("data-src") + "?p=" + p + "#theme=" + (cTheme || "temps") + "&pays=" + p); return; }
    if (cf.getAttribute("src")) { cpreset(); cfit(); return; }
    cPays = p;
    cf.addEventListener("load", function () {
      cfit(); cpreset();
      try { var d = cf.contentDocument;
        if (W.ResizeObserver && d && d.body) new W.ResizeObserver(cfit).observe(d.body);
        d.addEventListener("click", function () { setTimeout(cfit, 50); setTimeout(cfit, 400); });
      } catch (e) { /* ignore */ }
    });
    cf.setAttribute("src", cf.getAttribute("data-src") + (cTheme || p ? "#theme=" + (cTheme || "temps") + (p ? "&pays=" + p : "") : ""));
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


  // ---------------- search across every tab (and the text of the research files); jumps to the section that holds the first hit
  var Q = "", RIDX = null, loading = false, lastJump = "";
  function loadIndex() {
    if (RIDX || loading || typeof fetch !== "function") return;
    loading = true;
    fetch(BASE + "/assets/recherche-index.json").then(function (r) { return r.json(); }).then(function (j) {
      RIDX = j.map(function (d) { d._n = norm(d.texte); return d; }); apply();
    }).catch(function () { loading = false; });
  }
  function apply() {
    var hits = {}, secHits = {};
    $$(".s-item").forEach(function (el) {
      var ok = !Q || norm(el.getAttribute("data-s") + " " + el.textContent).indexOf(Q) >= 0;
      el.hidden = !ok;
      if (ok) {
        var p = el.closest(".panel"), s = el.closest(".qsec");
        if (p) hits[p.id.slice(2)] = (hits[p.id.slice(2)] || 0) + 1;
        if (s) secHits[s.id] = (secHits[s.id] || 0) + 1;
      }
    });
    // a section whose title matches counts as a hit and shows everything
    $$(".qsec").forEach(function (s) {
      var tm = !!Q && !!s.getAttribute("data-t") && s.getAttribute("data-t").indexOf(Q) >= 0;
      if (tm) { $$(".s-item", s).forEach(function (i) { i.hidden = false; }); secHits[s.id] = Math.max(secHits[s.id] || 0, 1); var p = s.closest(".panel").id.slice(2); hits[p] = (hits[p] || 0) + 1; }
      s.hidden = !!Q && !secHits[s.id];
    });
    $$(".hsec, .qblk").forEach(function (s) { var it = $$(".s-item", s); s.hidden = !!Q && it.length > 0 && it.every(function (i) { return i.hidden; }); });
    // unfold « Pour aller plus loin » / « Tout le reste » when they hold a hit, fold them back afterwards
    $$("details.more").forEach(function (d) {
      var has = !!Q && $$(".s-item", d).some(function (i) { return !i.hidden; });
      if (has && !d.open) { d.open = true; d.setAttribute("data-sopen", "1"); }
      else if (!Q && d.getAttribute("data-sopen")) { d.open = false; d.removeAttribute("data-sopen"); }
    });
    $$(".toc li").forEach(function (li) {
      var a = $("a", li), id = "q-" + a.getAttribute("data-route").replace("/", "-"), n = secHits[id] || 0;
      $(".hits", li).textContent = Q ? " " + n : ""; li.classList.toggle("nohit", !!Q && !n);
    });
    tabs.forEach(function (t) { var k = t.id.slice(2); $(".hits", t).textContent = Q && k !== "accueil" ? " " + (hits[k] || 0) : ""; t.classList.toggle("nohit", !!Q && !hits[k]); });
    $$(".subtab").forEach(function (b) {
      var sp = $("#sp-" + b.closest(".panel").id.slice(2) + "-" + b.getAttribute("data-sub")), n = sp ? $$(".s-item", sp).filter(function (i) { return !i.hidden; }).length : 0;
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
    $("#gcount").textContent = Q ? total + " résultat" + (total > 1 ? "s" : "") + " pour « " + $("#gq").value.trim() + " » (nombre à côté de chaque onglet et de chaque section)" + (nd ? ", et " + nd + " dossier" + (nd > 1 ? "s" : "") + " de recherche ci-dessous." : ".") : "";
    if (Q && total) {   // go where the results are, and to the first section that holds one
      var topic = CUR.topic;
      if (!hits[topic]) topic = tabs.map(function (t) { return t.id.slice(2); }).filter(function (k) { return hits[k]; })[0];
      var subs = subsOf(topic);
      if (subs) {
        var sub = CUR.sub[topic] || subs[0][0], cnt = function (k) { var sp = $("#sp-" + topic + "-" + k); return sp && $$(".s-item", sp).some(function (i) { return !i.hidden; }); };
        if (!cnt(sub)) sub = subs.map(function (s) { return s[0]; }).filter(cnt)[0] || sub;
        show(topic, sub);
      } else if (topic) show(topic);
      var first = sujById[topic] ? $$(".qsec", $("#p-" + topic)).filter(function (s) { return !s.hidden; })[0] : null;
      var key = topic + "|" + (first ? first.id : "");
      if (key !== lastJump) { lastJump = key; if (first) scrollToEl(first); else window.scrollTo(0, 0); }
    } else lastJump = "";
    drawCharts($("#p-" + CUR.topic));
    return total;
  }
  function clearSearch() { if (Q) { Q = ""; $("#gq").value = ""; apply(); } }
  var timer;
  $("#gq").addEventListener("input", function (e) { clearTimeout(timer); timer = setTimeout(function () { Q = norm(e.target.value.trim()); if (Q) loadIndex(); apply(); }, 200); });

  // ---------------- deep links (and the routes of the former site)
  var LEGACY = {
    "ia": "orientation/ia", "ia/synthese": "orientation/ia", "ia/milburn": "international/politiques", "ia/masters": "orientation/bac", "ia/comms": "orientation/reste", "ia/sources": "orientation",
    "handicap/synthese": "handicap", "handicap/handicap": "handicap/handicap", "handicap/sante": "handicap/sante-mentale", "handicap/sources": "handicap",
    "orientation/synthese": "orientation", "orientation/sources": "orientation",
    "gouvernance": "ecole/decider", "gouvernance/synthese": "ecole/decider", "gouvernance/recherche": "ecole/decider", "gouvernance/sources": "ecole/decider",
    "comparaisons": "international/carte",
    "emploi": "orientation/ia", "inclusion": "handicap/handicap", "ecrans": "handicap/ecrans", "formation": "ecole/temps", "preuves": "orientation", "carte": "boussole/carte"
  };
  // the three former sub-tabs of each theme, and the section ids that could follow them
  var OLDSUB = { essentiel: 1, recherche: 1, ailleurs: 1, synthese: 1, sources: 1 };
  var OLDSEC = { "s-note-ia": "orientation/ia", "s-masters": "orientation/bac", "s-masters-et-premier-emploi": "orientation/bac", "s-comms": "orientation/reste",
    "s-handicap": "handicap/handicap", "s-sante-mentale-et-ecrans": "handicap/sante-mentale", "s-indice": "voiepro/filieres", "s-methode": "voiepro/filieres", "s-milburn": "international/politiques" };
  function openCard(id) {
    var d = document.getElementById("p-" + id); if (!d) return;
    clearSearch();
    var p = d.closest(".panel"), sp = d.closest(".subpanel"), q = d.closest(".qsec");
    if (sp) show(sp.getAttribute("data-topic"), sp.getAttribute("data-sub")); else show(p.id.slice(2));
    for (var e = d.parentNode; e && e !== document; e = e.parentNode) if (e.tagName === "DETAILS") e.open = true;
    var h = "#" + p.id.slice(2) + (q ? "/" + q.getAttribute("data-q") : "");
    if (location.hash !== h && location.hash !== "#p-" + id) history.replaceState(null, "", h);
    d.open = true; scrollToEl(d); d.classList.add("flash"); setTimeout(function () { d.classList.remove("flash"); }, 1600);
  }
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (h.indexOf("p-") === 0 && document.getElementById(h)) { openCard(h.slice(2)); return; }
    var p = h.split("/");
    if (LEGACY[h]) h = LEGACY[h];
    else if (LEGACY[p[0] + "/" + p[1]]) h = LEGACY[p[0] + "/" + p[1]];
    else if (LEGACY[p[0]] && !$("#t-" + p[0])) h = LEGACY[p[0]] + (p[1] ? "/" + p.slice(1).join("/") : "");
    p = h.split("/");
    if (sujById[p[0]] && p[1] === "ailleurs") h = p[0] + "/ailleurs";   // old « Ailleurs » sub-tab -> the bottom section (23/11/2026)
    else if (sujById[p[0]] && OLDSUB[p[1]]) h = p[2] && OLDSEC[p[2]] ? OLDSEC[p[2]] : p[0];
    go(h || "accueil", true);
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  apply(); route();
  window.addEventListener("popstate", route);
})();
