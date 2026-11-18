// Politiques éducatives : one tab per topic (sub-tabs inside) plus the Boussole, embedded in the page.
// Routes: #<topic>, #<topic>/<subtab>, #boussole, #boussole/carte, #p-<card id>.
// Every listed item has class "s-item" and its searchable text in data-s; the header search filters them all.
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var md = function (s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  };
  var norm = function (s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var slug = function (s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };
  var W = window, BASE = W.BASE || "";
  var SUJ = W.SUJETS || [], PROPS = W.PROPS || [], SRC = W.SOURCES || [], GR = W.GRAPHS || [], LIV = W.LIVRET || [],
      AJ = W.LIVRET_AJOUTS || [], NOTES = W.NOTES || [], GEN = W.NOTES_GEN || [], DOS = W.DOSSIERS || [];
  var byId = {}; PROPS.forEach(function (p) { byId[p.id] = p; });
  var srcById = {}; SRC.forEach(function (s) { srcById[s.id] = s; });
  var gById = {}; GR.forEach(function (g) { gById[g.id] = g; });
  var dosBySlug = {}; DOS.forEach(function (d) { dosBySlug[d.slug] = d; });
  var any = function (list, keys) { return (list || []).some(function (k) { return keys.indexOf(k) >= 0; }); };
  var livByCard = {}; LIV.forEach(function (m) { (m.cartes || []).forEach(function (c) { (livByCard[c] = livByCard[c] || []).push(m); }); });
  function issueUrl(id, title) {
    return "https://github.com/" + W.REPO + "/issues/new?template=feedback.yml&title=" + encodeURIComponent("[" + id + "] " + title) + "&carte=" + encodeURIComponent(id);
  }
  function item(tag, cls, text, html, attrs) {
    return "<" + tag + ' class="s-item ' + (cls || "") + '" data-s="' + esc(text) + '"' + (attrs || "") + ">" + html + "</" + tag + ">";
  }
  function sec(title, body, intro) { return body ? '<section class="hsec"><h2>' + title + "</h2>" + (intro ? '<p class="note-src">' + intro + "</p>" : "") + body + "</section>" : ""; }
  function row(sum, body, text, attrs) { return item("details", "row", text, "<summary>" + sum + '</summary><div class="pb">' + body + "</div>", attrs); }

  // ---------------- item renderers
  var ELAB = { "convergent": "Convergent", "à compléter": "À compléter", "tension": "Tension", "hors champ": "Hors champ" };
  var seenCard = {};
  function propHTML(p) {
    var idAttr = seenCard[p.id] ? "" : ' id="p-' + esc(p.id) + '"'; seenCard[p.id] = 1;
    var ev = (p.preuves || []).map(function (x) { return "<li>" + md(x) + "</li>"; }).join("");
    var tags = (livByCard[p.id] || []).map(function (m) { return '<span class="badge lv e-' + slug(m.eval) + '" title="Livret du programme, mesure ' + esc(m.n) + " : " + esc(m.eval) + '">Livret n°' + esc(m.n) + "</span>"; }).join("");
    return row('<span class="pt">' + md(p.titre) + '</span><span class="pm"><span class="badge st-' + slug(p.statut) + '">' + esc(p.statut) + "</span>" + tags + "</span>",
      '<p class="from">Issue de : ' + esc(p.issue_de || "") + "</p><p>" + md(p.explication) + "</p>" +
      (ev ? '<h3>Ce que disent les preuves</h3><ul class="ev">' + ev + "</ul>" : "") +
      '<p class="pf">' + (p.note ? '<a href="' + esc(BASE + "/assets/notes/" + p.note) + '">Lire la note (PDF)</a> · ' : "") +
      '<a href="#p-' + esc(p.id) + '" class="perma" data-card="' + esc(p.id) + '">Lien vers cette fiche</a> · <a href="' + esc(issueUrl(p.id, p.titre)) + '" target="_blank" rel="noopener">Signaler une correction</a></p>',
      [p.titre, p.explication, (p.preuves || []).join(" "), p.issue_de].join(" "), idAttr);
  }
  function cardLinks(ids) {
    return (ids || []).filter(function (c) { return byId[c]; }).map(function (c) {
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
  function noteHTML(n, gen) {
    var url = function (u) { return /^https?:/.test(u) ? u : BASE + (u.charAt(0) === "/" ? u : "/" + u); };
    var href = gen ? (n.pdf ? url(n.pdf) : "") : BASE + "/assets/notes/" + n.fichier;
    return item("li", "", [n.titre, n.resume].join(" "),
      (href ? '<a href="' + esc(href) + '">' + esc(n.titre) + "</a>" : esc(n.titre)) + ' <span class="meta">' + esc(n.date || "") + (n.pages ? " · " + esc(n.pages) + " p." : "") +
      (gen && n.docx ? ' · <a href="' + esc(url(n.docx)) + '">Word</a>' : "") + (gen ? " · brouillon généré, non relu" : " · PDF") + "</span>" +
      (n.resume ? '<div class="sub">' + md(n.resume) + "</div>" : ""));
  }
  function chartBox(g) {
    return item("figure", "chart", [g.titre, g.source, g.note, g.unite].join(" "),
      "<figcaption><strong>" + esc(g.titre) + "</strong>" + (g.auto ? ' <span class="auto">actualisé chaque mois</span>' : "") + "</figcaption>" +
      '<div class="vis" data-chart="' + esc(g.id) + '" role="img" aria-label="' + esc(g.titre + ", " + g.unite) + '"></div>' +
      '<p class="src">' + esc(g.unite) + ". " + (g.note ? esc(g.note) + " " : "") + "Source : " + esc(g.source) +
      (g.auto && W.CHARTS_META ? " (promotion " + esc(W.CHARTS_META.insersup_promo) + ", " + esc(W.CHARTS_META.insersup_version) + ")" : "") +
      '. <a href="' + esc(BASE + "/assets/charts/data/" + g.id + ".csv") + '">Données (CSV)</a></p>');
  }
  var charts = function (ids) { ids = (ids || []).filter(function (i) { return gById[i]; }); return ids.length ? '<div class="charts">' + ids.map(function (i) { return chartBox(gById[i]); }).join("") + "</div>" : ""; };

  // ---------------- topic-specific blocks
  function noteIA() {
    var NI = W.NOTE_IA; if (!NI) return "";
    var r = function (c) { return row('<span class="pt">' + md(c.titre) + "</span>", "<p>" + md(c.texte) + "</p>", c.titre + " " + c.texte); };
    return sec("Les recommandations", item("p", "lead", NI.intro, md(NI.intro)) + NI.conditions.map(r).join(""),
        "Texte de la note « " + esc(NI.titre) + " » (GT Éducation, novembre 2026), repris sans changement.") +
      sec("Éléments de langage", '<ol class="msgs">' + NI.messages.map(function (m) { return item("li", "", m, md(m)); }).join("") + "</ol>" +
        item("p", "argu", NI.argumentaire, "<strong>Argumentaire.</strong> " + md(NI.argumentaire))) +
      sec("Le constat", item("p", "", NI.pourquoi, "<strong>Pourquoi maintenant.</strong> " + md(NI.pourquoi)) + NI.constat.map(r).join(""));
  }
  function blocMilburn() {
    var M = W.MILBURN || [];
    return sec("Les 17 recommandations et la réponse du gouvernement britannique",
      M.map(function (m) {
        return row('<span class="num">' + m.n + '</span><span class="pt">' + md(m.titre) + '</span><span class="badge m-' + slug(m.statut) + '">' + esc(m.statut) + "</span>",
          (m.chiffre ? "<p><strong>Chiffre :</strong> " + md(m.chiffre) + "</p>" : "") + (m.france ? "<p><strong>En France :</strong> " + md(m.france) + "</p>" : "") + '<p class="note-src">Rapport Milburn, p. ' + esc(m.pages) + "</p>",
          ["Milburn", m.titre, m.chiffre, m.france, m.statut].join(" "));
      }).join("") +
      row('<span class="pt">Ce que la France a déjà, et ce qui lui manque</span>',
        "<p>La France a déjà une garantie avec allocation (le contrat d'engagement jeune), une obligation de formation jusqu'à 18 ans et les missions locales. Il lui manque ce que Milburn propose : un emploi payé garanti en dernier recours ; une mesure du devenir des élèves par établissement et une norme « prêt pour le travail », inspectées ; un suivi des postes de débutants face à l'IA ; des outils de repérage précoce du décrochage.</p>" +
        '<p class="warn">Le Royaume-Uni mesure les 16-24 ans (13,0 %), la France les 15-29 ans (13,3 %, Insee). Sur les 15-24 ans, le Royaume-Uni (13,6 %, OCDE 2025) est au-dessus de la France (10,5 % en 2023).</p>',
        "France contrat d'engagement jeune Garantie jeunes missions locales comparaison"),
      "981 000 jeunes de 16 à 24 ans sans emploi ni formation au Royaume-Uni, soit 13,0 % (ONS, avril-juin 2026). Rapport publié le 17 novembre 2026.");
  }
  function blocMasters() {
    return item("p", "lead", "master licence boussole emploi salaire",
      "Le master sert souvent de filtre plus que de compétence : il trie par origine sociale, retarde de deux ans l'entrée dans la vie active, et une licence professionnelle insère mieux. " +
      '<a href="#boussole" data-route="boussole">La Boussole</a> affiche l\'emploi et le salaire de chaque master (étape « Master ou emploi »).');
  }
  function blocComms() {
    var V = W.VIDEOS || [];
    return sec("Cinq vidéos britanniques, une ligne chacune",
      '<ul class="vids">' + V.map(function (v) { return item("li", "", [v.titre, v.lecon].join(" "), '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.titre) + "</a> : " + md(v.lecon)); }).join("") + "</ul>") +
      sec("Ce qui marche",
        item("div", "tbl-wrap", "ce qui marche quotidien chiffre cliché sous-titres", '<table class="cmp"><thead><tr><th>Ressort</th><th>Pour nous</th></tr></thead><tbody>' +
          "<tr><td>Un problème du quotidien, pas un thème</td><td>le choix d'études, le premier CDI, l'attente d'un psy</td></tr>" +
          "<tr><td>Un chiffre comparatif en une phrase</td><td>un master sur dix sous 49 % d'emploi, un sur dix au-dessus de 86 %</td></tr>" +
          "<tr><td>Une voix jeune qui retourne un cliché</td><td>« les jeunes ne veulent plus travailler »</td></tr>" +
          "<tr><td>Sous-titres incrustés, mot à mot</td><td>vidéos vues sans le son</td></tr></tbody></table>")) +
      sec("Un contre-exemple : un post alarmé sur les évaluations nationales, vérifié",
        '<ul class="vids">' +
        item("li", "", "confirmé seconde maths 2019 dictée CE1", "<strong>Confirmé.</strong> Seconde générale et technologique : 28,1 % dans les groupes faibles en maths, contre 19,2 % en 2019 ; dictée de CE1 en baisse de 2,5 points sur un an (DEPP).") +
        item("li", "", "forcé CM2 6e stable", "<strong>Forcé.</strong> « Les performances diminuent du CE1 au CM2 » : en CM2, le français est stable pour 7 compétences sur 9.") +
        item("li", "", "non vérifiable questions", "<strong>Non vérifiable.</strong> Les exemples de questions : la DEPP ne publie aucun résultat question par question.") + "</ul>",
        '<a href="https://x.com/JLeFlochImad/status/2122979063086137629" target="_blank" rel="noopener">Post X du 18 novembre 2026</a>');
  }
  var BLOCS = { milburn: blocMilburn, masters: blocMasters, comms: blocComms };

  // ---------------- build the sub-panels
  SUJ.forEach(function (S) {
    var K = S.donnees || [];
    var props = PROPS.filter(function (p) { return any(p.sujets, K); });
    var liv = LIV.filter(function (m) { return any(m.sujets, K); });
    var aj = AJ.filter(function (a) { return any(a.sujets, K); });
    var srcs = SRC.filter(function (s) { return any(s.sujets, K); });
    var notes = NOTES.filter(function (n) { return any(n.sujets, K); });
    var gen = GEN.filter(function (n) { return n.sujet === S.id || any(n.sujets || [n.sujet], K.concat([S.id])); });
    var dos = DOS.filter(function (d) { return any(d.sujets, K); });
    (S.sous || []).forEach(function (U) {
      var el = $("#sp-" + S.id + "-" + U.id); if (!el) return;
      var h = "";
      if (U.type === "synthese") {
        if (U.note_ia) h += noteIA();
        else if (props.length && !(S.id === "ia")) h += sec("Les propositions du GT", props.map(propHTML).join(""), "Une ligne par proposition ; cliquez pour l'explication, les preuves et la note d'origine.");
        if (U.constats) h += sec("Ce que montrent les données", U.constats.filter(function (i) { return srcById[i]; }).map(function (i) { return constatHTML(srcById[i]); }).join(""), "Les chiffres clés de nos sources ; cliquez pour le détail.");
        h += sec("Le programme : les mesures du livret et notre évaluation",
          liv.map(livHTML).join("") + (aj.length ? '<h3>Ce que nos travaux ajoutent</h3><ul class="ajouts">' + aj.map(function (a) { return item("li", "", a.texte, md(a.texte)); }).join("") + "</ul>" : ""),
          "Livret « Croire en nous », volume 1 (18 novembre 2026).");
        h += sec("Les chiffres", charts(U.graphiques));
        h += sec("Les notes", (notes.length || gen.length) ? '<ul class="lib">' + notes.map(function (n) { return noteHTML(n, false); }).join("") + gen.map(function (n) { return noteHTML(n, true); }).join("") + "</ul>" : "");
      } else if (U.type === "ressource") {
        if (U.bloc && BLOCS[U.bloc]) h += BLOCS[U.bloc]();
        h += sec("Les chiffres", charts(U.graphiques));
        h += sec("Les sources", (U.sources || []).filter(function (i) { return srcById[i]; }).map(function (i) { return srcHTML(srcById[i]); }).join(""));
        h += sec("Les dossiers de recherche", (U.dossiers || []).length ? '<ul class="lib">' + U.dossiers.filter(function (i) { return dosBySlug[i]; }).map(function (i) { return dosHTML(dosBySlug[i]); }).join("") + "</ul>" : "");
      } else if (U.type === "sources") {
        h += sec("Toutes les sources du sujet (" + srcs.length + ")", srcs.map(srcHTML).join(""), "Chaque fiche : ce qui a été étudié, les chiffres avec leur point de comparaison, les limites, et si le chiffre a été lu dans la source. « Copier » met la citation dans le presse-papiers.");
        h += sec("Les dossiers de recherche", dos.length ? '<ul class="lib">' + dos.map(dosHTML).join("") + "</ul>" : "");
      }
      el.innerHTML = h;
    });
  });

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
  function firstSub(topic) { var S = SUJ.filter(function (s) { return s.id === topic; })[0]; return S && S.sous[0].id; }
  function subType(topic, sub) { var S = SUJ.filter(function (s) { return s.id === topic; })[0]; var U = S && S.sous.filter(function (u) { return u.id === sub; })[0]; return U; }
  function show(topic, sub, anchor) {
    if (topic !== "boussole") {
      var U = subType(topic, sub);
      if (U && U.type === "lien") { go(U.cible); return; }
      sub = U ? sub : (CUR.sub[topic] || firstSub(topic));
      CUR.sub[topic] = sub;
    }
    CUR.topic = topic;
    tabs.forEach(function (t) { var on = t.id === "t-" + topic; t.setAttribute("aria-selected", String(on)); $("#" + t.getAttribute("aria-controls")).hidden = !on; });
    if (topic === "boussole") { loadBoussole(anchor); return; }
    var panel = $("#p-" + topic);
    $$(".subtab", panel).forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-sub") === sub)); });
    $$(".subpanel", panel).forEach(function (p) { p.hidden = p.getAttribute("data-sub") !== sub; });
    drawCharts($("#sp-" + topic + "-" + sub));
  }
  function go(route, replace) {
    var parts = route.split("/"); var topic = parts[0], sub = parts[1];
    if (!$("#t-" + topic)) return;
    var U = topic !== "boussole" && sub ? subType(topic, sub) : null;
    if (U && U.type === "lien") { go(U.cible, replace); return; }
    show(topic, sub, topic === "boussole" ? sub : null);
    var h = "#" + (topic === "boussole" ? route : topic + "/" + CUR.sub[topic]);
    if (location.hash !== h) history[replace ? "replaceState" : "pushState"](null, "", h);
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { go(t.id.slice(2)); }); });
  $$(".subtab").forEach(function (b) { b.addEventListener("click", function () { go(b.closest(".panel").id.slice(2) + "/" + b.getAttribute("data-sub")); }); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-route]");
    if (a) { e.preventDefault(); go(a.getAttribute("data-route")); window.scrollTo(0, 0); return; }
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
      if (t) { var y = bf.getBoundingClientRect().top + window.pageYOffset + t.getBoundingClientRect().top - 10; window.scrollTo(0, y); }
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
    tabs.forEach(function (t) { var k = t.id.slice(2); $(".hits", t).textContent = Q ? " " + (hits[k] || 0) : ""; t.classList.toggle("nohit", !!Q && !hits[k]); });
    $$(".subtab").forEach(function (b) {
      var id = "sp-" + b.closest(".panel").id.slice(2) + "-" + b.getAttribute("data-sub"), n = subHits[id] || 0;
      $(".hits", b).textContent = Q && !b.classList.contains("sublink") ? " " + n : ""; b.classList.toggle("nohit", !!Q && !n && !b.classList.contains("sublink"));
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
    $("#gcount").textContent = Q ? total + " résultat" + (total > 1 ? "s" : "") + " pour « " + $("#gq").value.trim() + " » dans les onglets (nombre à côté de chaque onglet et sous-onglet)" + (nd ? ", et " + nd + " dossier" + (nd > 1 ? "s" : "") + " de recherche ci-dessous." : ".") : "";
    if (Q && total) {   // stay where results are
      var topic = CUR.topic;
      if (!hits[topic]) topic = tabs.map(function (t) { return t.id.slice(2); }).filter(function (k) { return hits[k]; })[0];
      if (topic && topic !== "boussole") {
        var sub = CUR.sub[topic] || firstSub(topic);
        if (!subHits["sp-" + topic + "-" + sub]) sub = $$(".subpanel", $("#p-" + topic)).map(function (p) { return p.getAttribute("data-sub"); }).filter(function (k) { return subHits["sp-" + topic + "-" + k]; })[0] || sub;
        show(topic, sub);
      } else if (topic) show(topic);
    }
    return total;
  }
  var timer;
  $("#gq").addEventListener("input", function (e) { clearTimeout(timer); timer = setTimeout(function () { Q = norm(e.target.value.trim()); if (Q) loadIndex(); apply(); }, 150); });

  // ---------------- deep links
  function openCard(id) {
    var d = document.getElementById("p-" + id); if (!d) return;
    Q = ""; $("#gq").value = ""; apply();
    var sp = d.closest(".subpanel");
    go(sp.getAttribute("data-topic") + "/" + sp.getAttribute("data-sub"));
    d.open = true; d.scrollIntoView({ block: "start" }); d.classList.add("flash"); setTimeout(function () { d.classList.remove("flash"); }, 1600);
  }
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (h.indexOf("p-") === 0 && document.getElementById(h)) { openCard(h.slice(2)); return; }
    var legacy = { emploi: "ia", inclusion: "handicap", ecrans: "handicap", formation: "gouvernance", preuves: "ia/sources", carte: "boussole/carte" };
    var first = h.split("/")[0];
    if (legacy[first]) h = legacy[first];
    if (h && $("#t-" + h.split("/")[0])) go(h, true); else go(SUJ[0].id, true);
  }
  apply(); route();
  window.addEventListener("popstate", route);
  window.addEventListener("hashchange", route);
})();
