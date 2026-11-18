// Tabs (kept in the URL hash), proposition cards with filters, v12 comparison, Milburn table,
// videos, and a global search across every tab.
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var md = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); };
  var norm = function (s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
  var slug = function (s) { return norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };

  var PROPS = window.PROPS || [], V12 = window.V12 || [], MIL = window.MILBURN || [], VID = window.VIDEOS || [];
  var byId = {}; PROPS.forEach(function (p) { byId[p.id] = p; });
  var G = { q: "" }; // global search
  var LIV = window.LIVRET || [], AJ = window.LIVRET_AJOUTS || [];
  var livByCard = {}; LIV.forEach(function (m) { (m.cartes || []).forEach(function (c) { (livByCard[c] = livByCard[c] || []).push(m); }); });

  // ---------- tabs
  var tabs = $$(".tab");
  function openTab(id) {
    tabs.forEach(function (t) {
      var on = t.id === id; t.setAttribute("aria-selected", String(on));
      var panel = document.getElementById(t.getAttribute("aria-controls")); panel.hidden = !on;
      if (on) { var f = $("iframe[data-src]", panel); if (f && !f.src) f.src = f.getAttribute("data-src"); }
    });
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { openTab(t.id); history.replaceState(null, "", "#" + t.id.slice(2)); }); });

  function chip(label, n, onClick, cls) {
    var b = document.createElement("button"); b.className = "chip" + (cls ? " " + cls : ""); b.type = "button"; b.setAttribute("aria-pressed", "false");
    b.innerHTML = esc(label) + (n != null ? '<span class="n">' + n + "</span>" : "");
    b.addEventListener("click", onClick); return b;
  }
  // a row of radio-like chips; returns nothing, calls render on change
  function chipRow(box, items, state, key, total, render) {
    var btns = [];
    function sync() { btns.forEach(function (x) { x[1].setAttribute("aria-pressed", String(state[key] === x[0])); }); }
    var all = chip("Tous", total, function () { state[key] = null; sync(); render(); }); box.appendChild(all); btns.push([null, all]);
    items.forEach(function (it) {
      var b = chip(it[1], it[2], function () { state[key] = state[key] === it[0] ? null : it[0]; sync(); render(); }, it[3]);
      box.appendChild(b); btns.push([it[0], b]);
    });
    sync();
  }
  function uniq(arr) { var o = []; arr.forEach(function (x) { if (o.indexOf(x) < 0) o.push(x); }); return o; }
  function counted(list, field, vals) { return vals.map(function (v) { return [v, v, list.filter(function (e) { return e[field] === v; }).length]; }); }
  function match(text) { return !G.q || norm(text).indexOf(G.q) >= 0; }

  function issueUrl(id, title) {
    return "https://github.com/" + window.REPO + "/issues/new?template=feedback.yml&title=" +
      encodeURIComponent("[" + id + "] " + title) + "&carte=" + encodeURIComponent(id);
  }

  // ---------- propositions
  var THEMES = uniq(PROPS.map(function (p) { return p.theme; }));
  var STATUTS = uniq(PROPS.map(function (p) { return p.statut; }));
  var ps = { t: null, s: null };
  chipRow($("#f-theme"), counted(PROPS, "theme", THEMES), ps, "t", PROPS.length, renderProps);
  chipRow($("#f-statut"), counted(PROPS, "statut", STATUTS), ps, "s", PROPS.length, renderProps);
  function propText(p) { return [p.theme, p.titre, p.explication, (p.preuves || []).join(" "), (livByCard[p.id] || []).map(function (m) { return "livret " + m.n; }).join(" ")].join(" "); }
  function propCard(p) {
    var ev = (p.preuves || []).map(function (x) { return "<li>" + md(x) + "</li>"; }).join("");
    return '<details class="prop th-' + slug(p.theme) + '" id="p-' + esc(p.id) + '">' +
      '<summary><span class="pt">' + md(p.titre) + '</span><span class="pm"><span class="tag">' + esc(p.theme) + '</span><span class="badge st-' + slug(p.statut) + '">' + esc(p.statut) + "</span>" +
      (livByCard[p.id] || []).map(function (m) { return '<span class="badge lv e-' + slug(m.eval) + '" title="Livret du programme, mesure ' + esc(m.n) + " : " + esc(m.eval) + '">Livret n°' + esc(m.n) + "</span>"; }).join("") + "</span></summary>" +
      '<div class="pb"><p>' + md(p.explication) + "</p>" +
      (ev ? '<h3>Ce que disent les preuves</h3><ul class="ev">' + ev + "</ul>" : "") +
      '<p class="pf">' + (p.note ? '<a href="' + esc(window.NOTES_BASE + p.note) + '">Lire la note (PDF)</a> · ' : "") +
      '<a href="#p-' + esc(p.id) + '" class="perma">Lien vers cette fiche</a> · <a href="' + esc(issueUrl(p.id, p.titre)) + '" target="_blank" rel="noopener">Signaler ou proposer une correction</a>' +
      '<span class="maj">mise à jour ' + esc(p.maj_le) + "</span></p></div></details>";
  }
  function renderProps() {
    var out = PROPS.filter(function (p) {
      return (!ps.t || p.theme === ps.t) && (!ps.s || p.statut === ps.s) && match(propText(p));
    });
    $("#count").textContent = out.length + (out.length > 1 ? " propositions affichées" : " proposition affichée") + " sur " + PROPS.length + " · cliquez pour ouvrir l'explication et les preuves";
    var html = "", cur = null;
    out.forEach(function (p) { if (p.theme !== cur) { cur = p.theme; html += '<h2 class="th">' + esc(cur) + "</h2>"; } html += propCard(p); });
    $("#props").innerHTML = html || '<p class="empty">Aucune proposition ne correspond.</p>';
    return out.length;
  }

  // ---------- v12 comparison
  var SLAB = { "nouveau": "Nouveau", "précise": "Précise", "modifie": "Modifie", "inchangé": "Inchangé" };
  var vs = { s: null, t: null };
  chipRow($("#f-v12"), ["nouveau", "précise", "modifie", "inchangé"].map(function (k) {
    return [k, SLAB[k], V12.filter(function (r) { return r.statut === k; }).length, "c-" + slug(k)]; }), vs, "s", V12.length, renderV12);
  chipRow($("#f-v12theme"), counted(V12, "theme", uniq(V12.map(function (r) { return r.theme; }))), vs, "t", V12.length, renderV12);
  function renderV12() {
    var rows = V12.filter(function (r) { return (!vs.s || r.statut === vs.s) && (!vs.t || r.theme === vs.t) && match([r.theme, r.resume, r.v12, r.ajout].join(" ")); });
    var html = "", cur = null;
    rows.forEach(function (r) {
      if (r.theme !== cur) { cur = r.theme; html += '<h2 class="th">' + esc(cur) + "</h2>"; }
      var p = byId[r.carte];
      html += '<details class="row"><summary><span class="badge s-' + slug(r.statut) + '">' + esc(SLAB[r.statut] || r.statut) + '</span><span class="pt">' + md(r.resume) + "</span></summary>" +
        '<div class="cmp2"><div><h3>Programme actuel (v12)</h3><p>' + md(r.v12) + '</p></div><div><h3>Ajout ou changement du GT</h3><p>' + md(r.ajout) + "</p>" +
        (p ? '<p><a class="tocard" href="#p-' + esc(p.id) + '" data-card="' + esc(p.id) + '">Voir la fiche et les preuves</a></p>' : "") + "</div></div></details>";
    });
    if (G.q && rows.length) { var bx = $("#v12box"); if (bx) bx.open = true; }
    $("#v12count").textContent = rows.length + " ligne" + (rows.length > 1 ? "s" : "") + " sur " + V12.length + " · cliquez pour comparer";
    $("#v12").innerHTML = html || '<p class="empty">Aucune ligne ne correspond.</p>';
    return rows.length;
  }

  // ---------- livret du programme
  var ELAB = { "convergent": "Convergent", "à compléter": "À compléter", "tension": "Tension", "hors champ": "Hors champ" };
  var ls = { e: null };
  chipRow($("#f-livret"), Object.keys(ELAB).map(function (k) { return [k, ELAB[k], LIV.filter(function (m) { return m.eval === k; }).length, "c-" + slug(k)]; }), ls, "e", LIV.length, renderLivret);
  function cardLinks(ids) {
    return (ids || []).filter(function (c) { return byId[c]; }).map(function (c) {
      return '<a class="tocard" href="#p-' + esc(c) + '" data-card="' + esc(c) + '">' + md(byId[c].titre) + "</a>"; }).join(" · ");
  }
  function renderLivret() {
    var rows = LIV.filter(function (m) { return (!ls.e || m.eval === ls.e) && match(["livret", m.n, m.titre, m.resume, m.apport].join(" ")); });
    $("#livret").innerHTML = rows.map(function (m) {
      var links = cardLinks(m.cartes);
      return '<details class="row"><summary><span class="num">n°' + esc(m.n) + '</span><span class="pt">' + md(m.titre) + '</span><span class="badge e-' + slug(m.eval) + '">' + esc(ELAB[m.eval] || m.eval) + "</span></summary>" +
        '<div class="pb"><p>' + md(m.resume) + ' <span class="sub">(livret, p. ' + esc(m.page) + ")</span></p><p><strong>Notre évaluation :</strong> " + md(m.apport) + "</p>" +
        (links ? '<p class="sub">Fiche' + ((m.cartes || []).length > 1 ? "s" : "") + " : " + links + "</p>" : "") + "</div></details>";
    }).join("") || '<p class="empty">Aucune mesure ne correspond.</p>';
    $("#livcount").textContent = rows.length + " mesure" + (rows.length > 1 ? "s" : "") + " sur " + LIV.length + " · cliquez pour voir notre évaluation";
    var aj = AJ.filter(function (a) { return match(a.texte); });
    $("#ajouts").innerHTML = aj.map(function (a) { return "<li>" + md(a.texte) + ' <span class="sub">' + cardLinks(a.cartes) + "</span></li>"; }).join("");
    return rows.length + aj.length;
  }

  // ---------- Milburn
  var MST = uniq(MIL.map(function (m) { return m.statut; }));
  var ms = { s: null };
  chipRow($("#f-milburn"), counted(MIL, "statut", MST), ms, "s", MIL.length, renderMil);
  function renderMil() {
    var rows = MIL.filter(function (m) { return (!ms.s || m.statut === ms.s) && match(["Milburn", m.titre, m.chiffre, m.france].join(" ")); });
    $("#milburn").innerHTML = rows.map(function (m) {
      return '<details class="row"><summary><span class="num">' + m.n + '</span><span class="pt">' + md(m.titre) + '</span><span class="badge m-' + slug(m.statut) + '">' + esc(m.statut) + "</span></summary>" +
        '<div class="pb">' + (m.chiffre ? "<p><strong>Chiffre :</strong> " + md(m.chiffre) + "</p>" : "") +
        (m.france ? "<p><strong>En France :</strong> " + md(m.france) + "</p>" : "") + '<p class="note-src">Rapport Milburn, p. ' + esc(m.pages) + "</p></div></details>";
    }).join("") || '<p class="empty">Aucune recommandation ne correspond.</p>';
    return rows.length;
  }

  // ---------- videos
  function renderVid() {
    var rows = VID.filter(function (v) { return match([v.titre, v.resume, v.lecon].join(" ")); });
    $("#videos").innerHTML = rows.map(function (v) {
      return '<details class="row"><summary><span class="tag">Vidéo</span><span class="pt">' + esc(v.titre) + "</span></summary>" +
        '<div class="pb"><p class="sub">' + esc(v.meta) + ' · <a href="' + esc(v.url) + '" target="_blank" rel="noopener">voir la vidéo</a></p><p>' + md(v.resume) + '</p><p><strong>Ce qui marche :</strong> ' + md(v.lecon) + "</p></div></details>";
    }).join("");
    return rows.length;
  }

  // ---------- calendar
  var CAL = (window.CAL || []).slice().sort(function (a, b) { return String(a.date) < String(b.date) ? -1 : 1; });
  var TLAB = { "france": "France", "royaume-uni": "Royaume-Uni", "gt": "Groupe", "site": "Site" };
  var cs = { t: null };
  var today = new Date().toISOString().slice(0, 10);
  chipRow($("#f-cal"), Object.keys(TLAB).map(function (k) { return [k, TLAB[k], CAL.filter(function (c) { return c.type === k; }).length]; }), cs, "t", CAL.length, renderCal);
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  function fdate(c) { if (c.approx) return c.approx; var d = String(c.date).split("-"); return (+d[2]) + " " + MOIS[+d[1] - 1] + " " + d[0]; }
  function renderCal() {
    var rows = CAL.filter(function (c) { return (!cs.t || c.type === cs.t) && match([c.titre, c.source, fdate(c)].join(" ")); });
    function li(c) {
      var past = !c.recurrent && String(c.date) < today;
      return '<li class="ev-' + (c.recurrent ? "rec" : past ? "past" : "next") + '"><span class="cd">' + esc(fdate(c)) + '</span><span class="tag">' + esc(TLAB[c.type] || c.type) + '</span> ' + md(c.titre) +
        ' <span class="sub">Source : ' + esc(c.source) + (past ? " · passé" : "") + "</span></li>";
    }
    $("#cal").innerHTML = rows.filter(function (c) { return !c.recurrent; }).map(li).join("") || '<li class="empty">Aucune échéance ne correspond.</li>';
    $("#calrec").innerHTML = rows.filter(function (c) { return c.recurrent; }).map(li).join("");
    return rows.length;
  }

  // ---------- generated notes (written by the note generator into _data/notes_generees.yml)
  function renderGen() {
    var L = (window.NOTES_GEN || []).filter(function (n) { return match([n.titre, n.resume].join(" ")); });
    var url = function (u) { return /^https?:/.test(u) ? u : (window.BASE || "") + (u.charAt(0) === "/" ? u : "/" + u); };
    $("#notesgen").innerHTML = L.length ? L.map(function (n) {
      return '<li><details><summary>' + (n.pdf ? '<a href="' + esc(url(n.pdf)) + '">' + esc(n.titre) + "</a>" : esc(n.titre)) +
        ' <span class="meta">' + esc(n.date || "") + (n.pages ? " · " + esc(n.pages) + " p." : "") + (n.docx ? ' · <a href="' + esc(url(n.docx)) + '">Word</a>' : "") +
        (n.issue ? ' · <a href="https://github.com/' + window.REPO + "/issues/" + esc(n.issue) + '">demande n° ' + esc(n.issue) + "</a>" : "") + "</span></summary>" +
        (n.resume ? '<p class="vr">' + md(n.resume) + "</p>" : "") + "</details></li>";
    }).join("") : '<li class="empty">' + ((window.NOTES_GEN || []).length ? "Aucune note générée ne correspond." : "Aucune note générée pour l'instant. Utilisez le bouton « Générer une note ».") + "</li>";
    return L.length;
  }

  // ---------- static items (tiles, figures, boxes, library): hide when they don't match
  function renderStatic(panel) {
    var n = 0;
    $$(".s-item", panel).forEach(function (el) {
      var ok = match((el.getAttribute("data-s") || "") + " " + el.textContent); el.hidden = !ok; if (ok) n++;
    });
    return n;
  }

  function renderAll() {
    var hits = {
      propositions: renderProps(), programme: renderLivret() + renderV12(), milburn: renderMil() + renderStatic($("#p-milburn")),
      comms: renderVid() + renderStatic($("#p-comms")), constat: renderStatic($("#p-constat")), calendrier: renderCal(),
      boussole: renderStatic($("#p-boussole")), notes: renderStatic($("#p-notes")) + renderGen()
    };
    var total = 0;
    tabs.forEach(function (t) {
      var k = t.id.slice(2), h = $(".hits", t);
      h.textContent = G.q ? " " + hits[k] : ""; t.classList.toggle("nohit", !!G.q && !hits[k]); total += hits[k];
    });
    var gc = $("#gcount");
    gc.hidden = !G.q; gc.textContent = G.q ? total + " résultat" + (total > 1 ? "s" : "") + " pour « " + $("#gq").value.trim() + " » ; le nombre par onglet est indiqué à côté de chaque onglet." : "";
    if (G.q) { // jump to the first tab with results if the current one has none
      var cur = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0];
      if (cur && !hits[cur.id.slice(2)]) { var first = tabs.filter(function (t) { return hits[t.id.slice(2)]; })[0]; if (first) openTab(first.id); }
      if (hits.propositions && hits.propositions <= 3) $$("#props details").forEach(function (d) { d.open = true; });
    }
  }
  var timer;
  $("#gq").addEventListener("input", function (e) { clearTimeout(timer); timer = setTimeout(function () { G.q = norm(e.target.value.trim()); renderAll(); }, 120); });

  // ---------- deep links: #propositions, #p-<card id>
  function openCard(id) {
    ps.t = null; ps.s = null; G.q = ""; $("#gq").value = ""; renderAll();
    $$("#f-theme .chip, #f-statut .chip").forEach(function (b, i) { b.setAttribute("aria-pressed", String(b.textContent.indexOf("Tous") === 0)); });
    openTab("t-propositions");
    var d = document.getElementById("p-" + id); if (!d) return;
    d.open = true; d.scrollIntoView({ block: "start" }); d.classList.add("flash"); setTimeout(function () { d.classList.remove("flash"); }, 1600);
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.tocard, a.perma");
    if (!a) return;
    e.preventDefault(); var id = a.getAttribute("data-card") || a.getAttribute("href").slice(3);
    history.replaceState(null, "", "#p-" + id); openCard(id);
  });
  function route() {
    var h = location.hash.slice(1);
    if (h.indexOf("p-") === 0 && byId[h.slice(2)]) openCard(h.slice(2));
    else if (document.getElementById("t-" + h)) openTab("t-" + h);
  }
  renderAll(); route();
  window.addEventListener("hashchange", route);
})();
