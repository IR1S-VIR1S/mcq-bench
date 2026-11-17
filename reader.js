/* MCQ Bench: reads a bank PDF made by the item writer into item records. Works on text positions from pdf.js.
   Written from two real layouts only ("STEM / Key: C" and "Stem / Answer key: A."). A page it cannot read is reported, never guessed. */
'use strict';
var MCQReader = (function () {
  var ID_RE = /^[A-Z]{2,5}-[A-Z]{2,5}-\d{2,3}$/;
  var HEAD = { 'item no': 'item_id', 'subject': 'subject', 'topic': 'topic', 'format': 'format', "bloom's level": 'bloom', 'difficulty': 'difficulty_est',
    'taxonomy rationale': 'bloom_rationale', 'difficulty rationale': 'difficulty_rationale', 'level': 'level', 'intended for': 'intended_for' };
  var SECTIONS = [['stem', /^(STEM|Stem)$/], ['lead', /^(LEAD-IN|Lead-in)$/], ['options', /^(OPTIONS|Options)$/], ['keyblock', /^(Answer key and justification\b.*|Answer key:.*)$/],
    ['just', /^(JUSTIFICATION|Justification)$/], ['refs', /^(REFERENCES \(VANCOUVER\)|References)$/]];
  var FOOT = /^(CONFIDENTIAL: examination material|Confidential examination material\.).*Page \d+$/;
  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  // Text lines of a region: parts on (nearly) the same baseline, left to right.
  function lines(parts) {
    var ps = parts.slice().sort(function (a, b) { return a.y - b.y || a.x - b.x; }), out = [];
    ps.forEach(function (p) {
      var L = out[out.length - 1];
      if (L && Math.abs(L.y - p.y) < 2) { L.parts.push(p); L.h = Math.max(L.h, p.h); } else out.push({ y: p.y, h: p.h, parts: [p] });
    });
    out.forEach(function (L) { L.parts.sort(function (a, b) { return a.x - b.x; }); var t = ''; L.parts.forEach(function (p, i) { var q = L.parts[i - 1]; if (q && p.str && p.x - (q.x + (q.w || 0)) > 0.8) t += ' '; t += p.str; }); L.text = norm(t); L.x = L.parts[0].x; });
    return out.filter(function (L) { return L.text; });
  }
  function header(parts, why) {
    var real = parts.filter(function (p) { return norm(p.str); });
    var ino = real.filter(function (p) { return /^Item No\.?$/.test(norm(p.str)); })[0];
    if (!ino) { why.push('no "Item No" box'); return null; }
    var row0 = real.filter(function (p) { return Math.abs(p.y - ino.y) < 2; }).sort(function (a, b) { return a.x - b.x; });
    var subj = row0.filter(function (p) { return norm(p.str) === 'Subject'; })[0], idp = row0.filter(function (p) { return ID_RE.test(norm(p.str)); })[0];
    var after = subj && row0.filter(function (p) { return p.x > subj.x + 1; })[0];
    if (!subj || !idp || !after) { why.push('first row of the box not understood'); return null; }
    var cols = [ino.x, idp.x, subj.x, after.x];
    var inBox = real.filter(function (p) { return p.y > ino.y - 14; });
    var ys = lines(inBox), rows = [], cur = null;
    ys.forEach(function (L, i) {
      var prev = ys[i - 1];
      if (!cur || L.y - prev.y > 1.7 * Math.max(L.h, 7)) { cur = [[], [], [], []]; rows.push(cur); }
      L.parts.forEach(function (p) { if (!norm(p.str)) return; var c = 0; for (var k = 0; k < 4; k++) if (p.x >= cols[k] - 2) c = k; cur[c].push(p); });
    });
    var out = {};
    rows.forEach(function (r) {
      var cell = r.map(function (ps) { return norm(lines(ps).map(function (L) { return L.text; }).join(' ')); });
      [[0, 1], [2, 3]].forEach(function (pr) {
        var k = HEAD[cell[pr[0]].toLowerCase().replace(/\.$/, '')];
        if (k) out[k] = cell[pr[1]];
      });
    });
    return out;
  }
  function readItemPage(parts, pageNo) {
    var all = lines(parts).filter(function (L) { return !FOOT.test(L.text) && !(L.y > 800 && /Page \d+$/.test(L.text)); });
    var si = -1; all.forEach(function (L, i) { if (si < 0 && SECTIONS[0][1].test(L.text)) si = i; });
    if (si < 0) return null;
    var why = [], yStem = all[si].y;
    var it = header(parts.filter(function (p) { return p.y < yStem - 3; }), why) || {};
    var sec = {}, cur = null;
    all.slice(si).forEach(function (L) {
      var hit = null;
      SECTIONS.forEach(function (s) { if (!hit && s[1].test(L.text) && !sec[s[0]]) hit = s[0]; });
      if (hit) { cur = hit; sec[cur] = []; if (hit === 'keyblock') sec.keyline = L.text; return; }
      if (cur) { sec[cur].push(L.text); if (cur === 'keyblock' && /^Key:/.test(L.text)) sec.keyline = L.text; }
    });
    it.page = pageNo;
    it.stem = norm((sec.stem || []).join(' ')); it.lead = norm((sec.lead || []).join(' '));
    var opts = {}, L0 = null;
    (sec.options || []).forEach(function (t) { var m = /^([A-E])\.\s+(.*)$/.exec(t); if (m && !opts[m[1]]) { L0 = m[1]; opts[L0] = m[2]; } else if (L0) opts[L0] += ' ' + t; });
    ['A', 'B', 'C', 'D', 'E'].forEach(function (k) { it['opt_' + k] = norm(opts[k]); });
    var km = /^Key:\s*([A-E])\b/.exec(sec.keyline || '') || /^Answer key:\s*([A-E])\./.exec(sec.keyline || '');
    it.key = km ? km[1] : '';
    it.justification = norm((sec.just || []).join(' '));
    var refs = [];
    (sec.refs || []).forEach(function (t) { var m = /^(\d{1,2})\.\s+/.exec(t); if (m && +m[1] === refs.length + 1) refs.push(t); else if (refs.length) refs[refs.length - 1] += ' ' + t; });
    it.references = refs.map(norm).join('\n');
    ['item_id', 'topic', 'bloom', 'difficulty_est', 'level', 'stem', 'lead', 'opt_A', 'opt_B', 'opt_C', 'opt_D', 'opt_E', 'key', 'justification', 'references'].forEach(function (k) { if (!it[k]) why.push(k + ' not read'); });
    if (Object.keys(opts).length !== 5) why.push(Object.keys(opts).length + ' options instead of 5');
    if (it.item_id && !ID_RE.test(it.item_id)) why.push('item number not understood');
    delete it.format;
    it.problems = why;
    return it;
  }
  // The answer key table: columns are found from its heading row; each item's cells are the parts nearest its item number.
  function readKeyPage(parts, into, state) {
    var real = parts.filter(function (p) { return norm(p.str); }), ls = lines(real);
    var headY = -1;
    ls.forEach(function (L) {
      var names = L.parts.map(function (p) { return norm(p.str); });
      if (names.indexOf('Key') >= 0 && names.indexOf('Set') >= 0 && names.indexOf('Level') >= 0) {
        headY = L.y;
        state.cols = ['Key', 'Level', 'Bloom', 'Difficulty', 'Set'].map(function (n) { var i = names.indexOf(n); return i >= 0 ? L.parts[i].x : null; });
      }
    });
    var ids = real.filter(function (p) { return ID_RE.test(norm(p.str)) && p.x < 120 && p.y > headY + 2; }).sort(function (a, b) { return a.y - b.y; });
    if (!ids.length || !state.cols || state.cols.some(function (c) { return c === null; })) return 0;
    var cols = state.cols, n = 0;
    ids.forEach(function (idp, i) {
      var top = i ? (ids[i - 1].y + idp.y) / 2 : idp.y - 14, bot = i < ids.length - 1 ? (ids[i + 1].y + idp.y) / 2 : idp.y + 14;
      var cell = ['', '', '', '', ''];
      real.filter(function (p) { return p.y > top && p.y <= bot && p.x >= cols[0] - 3; }).sort(function (a, b) { return a.y - b.y || a.x - b.x; }).forEach(function (p) {
        var c = 0; for (var k = 0; k < 5; k++) if (p.x >= cols[k] - 3) c = k;
        cell[c] = norm(cell[c] + ' ' + p.str);
      });
      var bl = /C\d/.exec(cell[2]), df = /^(Easy|Moderate|Hard)/.exec(cell[3]);
      if (/^[A-E]$/.test(cell[0]) && /^(UG|PG|Undergraduate|Postgraduate)$/.test(cell[1]) && df && /^\d+$/.test(cell[4])) { into[norm(idp.str)] = { key: cell[0], level: cell[1], bloom: bl ? bl[0] : '', difficulty: df[1], set: cell[4] }; n++; }
      else state.unread.push(norm(idp.str));
    });
    return n;
  }
  // pages: array (one per page) of text parts { str, x, y (from the top), h, w }. Returns the items and a check report.
  function parse(pages) {
    var items = [], key = {}, kstate = { cols: null, unread: [] };
    pages.forEach(function (parts, i) {
      var it = readItemPage(parts, i + 1);
      if (it) { items.push(it); return; }
      readKeyPage(parts, key, kstate);
    });
    var seen = {}, dup = [], agree = { key: 0, level: 0, bloom: 0, difficulty: 0 }, disagree = [], noKeyRow = [], bad = [];
    function lv(s) { s = String(s).toLowerCase(); return s.indexOf('under') === 0 || s === 'ug' ? 'UG' : s.indexOf('post') === 0 || s === 'pg' ? 'PG' : s; }
    items.forEach(function (it) {
      if (seen[it.item_id]) dup.push(it.item_id); seen[it.item_id] = 1;
      var k = key[it.item_id];
      if (!k) { noKeyRow.push(it.item_id); it.problems.push('not found in the answer key table'); }
      else {
        var b = (/C\s*\d/.exec(it.bloom || '') || [''])[0].replace(/\s/g, '');
        var checks = { key: it.key === k.key, level: lv(it.level) === lv(k.level), bloom: !k.bloom || b === k.bloom, difficulty: String(it.difficulty_est || '').split(' ')[0] === k.difficulty };
        Object.keys(checks).forEach(function (c) { if (checks[c]) agree[c]++; else { disagree.push({ item_id: it.item_id, what: c }); it.problems.push(c + ' differs from the answer key table'); } });
        it.paper_set = k.set;
      }
      if (it.problems.length) bad.push({ item_id: it.item_id || '(page ' + it.page + ')', page: it.page, why: it.problems.join('; ') });
    });
    if (dup.length) dup.forEach(function (d) { bad.push({ item_id: d, page: '', why: 'item number appears twice' }); });
    var keys = { A: 0, B: 0, C: 0, D: 0, E: 0 }, levels = { UG: 0, PG: 0 };
    items.forEach(function (it) { if (keys[it.key] !== undefined) keys[it.key]++; var l = lv(it.level); if (levels[l] !== undefined) levels[l]++; });
    return { items: items, report: { pages: pages.length, itemPages: items.length, keyRows: Object.keys(key).length, agree: agree, disagree: disagree, noKeyRow: noKeyRow,
      keyRowWithoutPage: Object.keys(key).filter(function (k) { return !seen[k]; }), bad: bad, duplicates: dup, keys: keys, levels: levels } };
  }
  // In the app: file bytes -> pages of parts, using pdf.js (loaded on demand).
  function partsOf(pdfjsLib, data, onPage) {
    return pdfjsLib.getDocument({ data: data, isEvalSupported: false }).promise.then(function (doc) {
      var pages = [], chain = Promise.resolve();
      for (var n = 1; n <= doc.numPages; n++) (function (n) {
        chain = chain.then(function () { return doc.getPage(n); }).then(function (page) {
          var H = page.getViewport({ scale: 1 }).height;
          return page.getTextContent().then(function (tc) {
            pages.push(tc.items.map(function (i) { return { str: i.str, x: i.transform[4], y: H - i.transform[5], h: i.height || 0, w: i.width || 0 }; }));
            if (onPage) onPage(n, doc.numPages);
            page.cleanup();
          });
        });
      })(n);
      return chain.then(function () { return pages; });
    });
  }
  return { parse: parse, partsOf: partsOf };
})();
if (typeof module !== 'undefined') module.exports = MCQReader;
