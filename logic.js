/* GENERATED from script/MCQBench.gs by build.js. Do not edit. */
'use strict';
//== SHARED START
var CFG = { APP_NAME: 'Pulmonology MCQ Bench', SHORT: 'MCQ Bench', SCHEMA_VER: 1, OPTS: ['A', 'B', 'C', 'D', 'E'] };
var ROLE_WORD = { owner: 'Owner', examiner: 'Co-examiner', head: 'Department head', tutor: 'Cohort tutor', writer: 'MCQ writer', participant: 'Participant' };
// Thresholds and rules the owner can change in Settings. The figures are the owner's working rules, not published cut-offs.
var DEFAULTS = { item_min: 30, item_full: 50, distractor_min: 30, distractor_pct: 5, person_min: 10, person_full: 20, progress_min: 3, rank_min: 5,
  weak_pct: 60, strong_pct: 75, grace_min: 10, code_days: 14, research_on: 'N', consent_text: '' };
var SET_NOTES = { item_min: 'Fewest first-attempt responses before an item is judged at all', item_full: 'Responses from which item figures are reported without the word provisional',
  distractor_min: 'Fewest responses before an option is called unused', distractor_pct: 'An option chosen by fewer than this percent is non-functioning',
  person_min: 'Fewest items in a topic before a person is judged on it', person_full: 'Items in a topic from which a person is judged without the word provisional',
  progress_min: 'Fewest tests before progress over time is shown', rank_min: 'Fewest people who sat a paper before rank is shown',
  weak_pct: 'Below this percent a judged topic is called weak', strong_pct: 'From this percent a judged topic is called strong',
  grace_min: 'Minutes after a paper closes during which an offline paper may still arrive unflagged', code_days: 'Days a new cohort join link works',
  research_on: 'Y only after ethics approval: shows the consent screen and allows the research export', consent_text: 'Approved consent wording shown to participants' };
function setNum_(set, k) { var v = set ? set[k] : undefined, n = Number(v); return v !== undefined && v !== null && String(v).trim() !== '' && isFinite(n) ? n : DEFAULTS[k]; }

var POOL_NAMES = { PNA: 'Pneumonia', PLR: 'Pleural disease', LCA: 'Lung carcinoma', AWD: 'Asthma and COPD', ILD: 'Interstitial lung disease', TB: 'Tuberculosis', CGL: 'CHEST guidelines', OSA: 'Obstructive sleep apnoea' };
// Draft teaching-topic groups: [pool or *, words in the item's topic label, group]. First match wins. The owner corrects single items in the app.
var TOPIC_RULES = [
  ['PNA', 'pleural|parapneumonic|effusion', 'Pleural effusion: diagnosis'],
  ['PNA', 'mycoplasma|legionel|legionnaire|atypical|pneumococc|influenza', 'Pneumonia: organisms and tests'],
  ['PNA', 'immunocompromised|pneumocystis|hiv|hospital|ventilator|aspiration|abscess|tb-endemic', 'Pneumonia: hospital and special hosts'],
  ['PNA', '', 'Community-acquired pneumonia'],
  ['PLR', 'pneumothorax|chest drain|air leak', 'Pneumothorax'],
  ['PLR', 'malignan|catheter|shipyard|ovarian|cytology', 'Malignant pleural effusion'],
  ['PLR', '', 'Pleural effusion: diagnosis'],
  ['LCA', 'risk|screening|smoking|waterpipe|asbestos|occupational|nodule|never-smoker', 'Lung cancer: risk, screening and nodules'],
  ['LCA', 'pancoast|vena cava|lambert|hyponat|hypercal|acth|clubbing|paraneoplastic|symptom|metastatic s|cord compression|haemoptysis|delayed|hemidiaphragm|follow-up|palliative', 'Lung cancer: presentation and complications'],
  ['LCA', '', 'Lung cancer: staging and treatment'],
  ['AWD', 'asthma|wheeze|mart|aspirin|anaphylaxis|inhaled corticosteroid', 'Asthma'],
  ['AWD', 'exacerbation|blood gas|hypercapnia', 'COPD: exacerbation and blood gases'],
  ['AWD', '', 'COPD: stable disease'],
  ['ILD', 'hypersensitivity|silic|occupational|metal|exposure|pleural change', 'ILD: hypersensitivity pneumonitis and exposures'],
  ['ILD', 'sard|sclerosis|rheumatoid|myopath|myositis|iim|mda|synthetase|connective|raynaud|cyclophosphamide|rituximab|jak|tnf|abatacept|methotrexate|rapidly progressive', 'ILD: connective tissue disease'],
  ['ILD', 'sarcoid|granulomat|hilar', 'Sarcoidosis and granulomatous disease'],
  ['ILD', 'ipf|fibro|usual interstitial|emphysema', 'IPF and fibrotic ILD'],
  ['ILD', '', 'ILD: work-up, drugs and smoking'],
  ['TB', 'mening|extrapulmonary|miliary|nodal|disseminated|empyema|pleurisy', 'TB: meningitis and extrapulmonary'],
  ['TB', 'hiv|iris|antiretroviral|dolutegravir|resistant|bedaquiline|linezolid|mdr|bpalm', 'TB: HIV and drug resistance'],
  ['TB', 'aspergill|haemoptysis|post-tb|post-tuberculosis|healed|cavity|chronic symptoms', 'TB: sequelae and haemoptysis'],
  ['TB', 'treat|drug|regimen|therapy|adherence|hepatitis|liver|intensive phase|rifapentine|nonsevere', 'TB: treatment'],
  ['TB', '', 'TB: diagnosis and infection'],
  ['CGL', 'bronchiectasis', 'Bronchiectasis'],
  ['CGL', 'neuromuscular', 'Neuromuscular respiratory weakness'],
  ['CGL', 'thrombo(?!cyt|tic)|embol|vena cava|anticoag|deep vein|vte', 'Venous thromboembolism'],
  ['CGL', 'cough|pertussis|bronchitis|influenza|tuberculosis screening', 'Cough'],
  ['CGL', 'icu|transfusion|thrombocytopenia|coagulopathy|critically|breathing trial|extubation|ventilation|microangiopathy', 'ICU: transfusion and ventilation'],
  ['CGL', 'nsclc', 'Lung cancer: staging and treatment'],
  ['CGL', 'ebus|cryobiopsy|airway obstruction', 'Bronchoscopy and airway procedures'],
  ['CGL', 'asthma', 'Asthma'],
  ['CGL', 'osa|sleep apnoea', 'OSA: special groups'],
  ['CGL', '', 'Tobacco treatment and other CHEST guidance'],
  ['OSA', 'ohs|perioperative|pregnancy|driving|cardiovascular|hypoventilation', 'OSA: special groups'],
  ['OSA', 'oral appliance|surgical|hypoglossal|positional|carbonic|maxillo|mandibular|obesity|weight', 'OSA: treatment other than PAP'],
  ['OSA', 'pap|adherence|residual sleepiness', 'OSA: PAP therapy'],
  ['OSA', '', 'OSA: diagnosis']
];
function poolOf_(id) { var m = /^[A-Z]{2,5}-([A-Z]{2,5})-\d{2,3}$/.exec(String(id || '')); return m ? m[1] : ''; }
function topicGroup_(id, topic) {
  var pool = poolOf_(id), t = String(topic || '').toLowerCase();
  for (var i = 0; i < TOPIC_RULES.length; i++) {
    var r = TOPIC_RULES[i];
    if ((r[0] === '*' || r[0] === pool) && (!r[1] || new RegExp('(^|[^a-z])(' + r[1] + ')').test(t))) return r[2];
  }
  return POOL_NAMES[pool] || pool || 'Other';
}
function bloomC_(s) { var m = /C\s*([1-3])/.exec(String(s || '')); return m ? 'C' + m[1] : ''; }
var BLOOM_WORD = { C1: 'C1 Remember', C2: 'C2 Understand', C3: 'C3 Apply, Analyse or Evaluate' };
function levelCode_(s) { s = String(s || '').toLowerCase(); return s.indexOf('under') === 0 || s === 'ug' ? 'UG' : s.indexOf('post') === 0 || s === 'pg' ? 'PG' : ''; }

// Times: the workbook keeps Pakistan time as text (2026-11-17 09:30); phones send milliseconds.
function pad2_(n) { return (n < 10 ? '0' : '') + n; }
function stampPk_(ms) { var d = new Date(ms + 5 * 3600000); return d.getUTCFullYear() + '-' + pad2_(d.getUTCMonth() + 1) + '-' + pad2_(d.getUTCDate()) + ' ' + pad2_(d.getUTCHours()) + ':' + pad2_(d.getUTCMinutes()) + ':' + pad2_(d.getUTCSeconds()); }
function pkMs_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/.exec(String(s || ''));
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)) - 5 * 3600000 : NaN;
}
var MONTHS3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function dateTxt_(s) { var m = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}))?/.exec(String(s || '')); return m ? (+m[3]) + ' ' + MONTHS3[+m[2] - 1] + ' ' + m[1] + (m[4] ? ', ' + m[4] : '') : String(s || ''); }
// A timed paper closes at its closing time; a supervised one, if none is given, 15 minutes after its length has run from the start.
function paperCloseMs_(p) { var c = pkMs_(p.closes); return isFinite(c) ? c : pkMs_(p.opens) + (Number(p.minutes) + 15) * 60000; }

// 95% Wilson interval for a proportion, as percentages.
function wilson_(c, n) {
  if (!n) return { lo: 0, hi: 0 };
  var z = 1.96, p = c / n, d = 1 + z * z / n, mid = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
  return { lo: Math.max(0, Math.round((mid - h) * 100)), hi: Math.min(100, Math.round((mid + h) * 100)) };
}
function pct_(c, n) { return n ? Math.round(c * 100 / n) : 0; }

// One person's standing by topic group, pool and Bloom level, from FIRST attempts only. meta: item_id -> { g, pool, bloom }.
function personFeedback_(resps, meta, set) {
  var min = setNum_(set, 'person_min'), full = setNum_(set, 'person_full'), weakP = setNum_(set, 'weak_pct'), strongP = setNum_(set, 'strong_pct');
  var G = {}, P = {}, B = {}, tot = { n: 0, c: 0 }, seen = {};
  resps.forEach(function (r) {
    if (String(r.first_attempt) !== '1' || r.correct === '' || r.correct === undefined || seen[r.item_id]) return;
    var m = meta[r.item_id]; if (!m) return;
    seen[r.item_id] = 1;
    var ok = String(r.correct) === '1' ? 1 : 0;
    [[G, m.g], [P, POOL_NAMES[m.pool] || m.pool], [B, bloomC_(m.bloom)]].forEach(function (x) {
      if (!x[1]) return; var o = x[0][x[1]] = x[0][x[1]] || { k: x[1], n: 0, c: 0 }; o.n++; o.c += ok;
    });
    tot.n++; tot.c += ok;
  });
  function rows(M) {
    return Object.keys(M).sort().map(function (k) {
      var o = M[k], w = wilson_(o.c, o.n);
      o.pct = pct_(o.c, o.n); o.lo = w.lo; o.hi = w.hi;
      o.state = o.n < min ? 'too few' : o.n < full ? 'provisional' : 'reported';
      o.weak = o.state !== 'too few' && o.pct < weakP; o.strong = o.state !== 'too few' && o.pct >= strongP;
      return o;
    });
  }
  var g = rows(G), b = rows(B);
  return { total: tot, groups: g, pools: rows(P), bloom: b,
    weak: g.filter(function (x) { return x.weak; }).sort(function (a, c) { return a.pct - c.pct; }),
    strong: g.filter(function (x) { return x.strong; }).sort(function (a, c) { return c.pct - a.pct; }),
    bloomGaps: b.filter(function (x) { return x.weak; }) };
}
// Progress over time: plain reporting of the first and latest test, only when there are enough tests.
function progress_(attempts, set) {
  var a = attempts.filter(function (x) { return x.pct !== '' && x.pct !== undefined && Number(x.n_items) >= 5 && x.submitted; }).sort(function (x, y) { return String(x.submitted) < String(y.submitted) ? -1 : 1; });
  if (a.length < setNum_(set, 'progress_min')) return { n: a.length, enough: false };
  return { n: a.length, enough: true, first: Number(a[0].pct), last: Number(a[a.length - 1].pct), list: a.map(function (x) { return Number(x.pct); }) };
}
function ebel_(r) { return r < 0.10 ? 'poor' : r < 0.20 ? 'low' : r < 0.30 ? 'acceptable' : r < 0.40 ? 'good' : 'excellent'; }
// Item analysis. resps: rows with item_id, version, chosen, correct, first_attempt, mode, attempt_id, paper_id. keys: "id|version" -> key letter.
// Timed-exam figures and practice first attempts are kept apart. Discrimination (corrected point-biserial) comes from timed papers only.
function itemStats_(resps, keys, set) {
  var iMin = setNum_(set, 'item_min'), iFull = setNum_(set, 'item_full'), dMin = setNum_(set, 'distractor_min'), dPct = setNum_(set, 'distractor_pct');
  var out = {}, tot = {}, cnt = {};
  resps.forEach(function (r) { if (r.mode === 'timed') { tot[r.attempt_id] = (tot[r.attempt_id] || 0) + (String(r.correct) === '1' ? 1 : 0); cnt[r.attempt_id] = (cnt[r.attempt_id] || 0) + 1; } });
  function blank() { return { n: 0, c: 0, opts: { A: 0, B: 0, C: 0, D: 0, E: 0 }, blank: 0, xs: [], ys: [], top: { A: 0, B: 0, C: 0, D: 0, E: 0 }, topN: 0 }; }
  var byPaper = {};
  resps.forEach(function (r) { if (r.mode === 'timed') (byPaper[r.paper_id] = byPaper[r.paper_id] || {})[r.attempt_id] = tot[r.attempt_id]; });
  var topSet = {};
  Object.keys(byPaper).forEach(function (p) {
    var ids = Object.keys(byPaper[p]).sort(function (a, b) { return byPaper[p][b] - byPaper[p][a]; });
    ids.slice(0, Math.ceil(ids.length / 3)).forEach(function (a) { topSet[a] = 1; });
  });
  resps.forEach(function (r) {
    var exam = r.mode === 'timed';
    if (!exam && String(r.first_attempt) !== '1') return;
    var k = r.item_id + '|' + r.version, o = out[k] = out[k] || { item_id: r.item_id, version: String(r.version), key: keys[k] || '', exam: blank(), practice: blank() };
    var s = exam ? o.exam : o.practice, ok = String(r.correct) === '1' ? 1 : 0;
    s.n++; s.c += ok;
    if (s.opts[r.chosen] !== undefined) s.opts[r.chosen]++; else s.blank++;
    if (exam && cnt[r.attempt_id] > 1) { s.xs.push(ok); s.ys.push((tot[r.attempt_id] - ok) / (cnt[r.attempt_id] - 1)); }
    if (exam && topSet[r.attempt_id]) { s.topN++; if (s.top[r.chosen] !== undefined) s.top[r.chosen]++; }
  });
  Object.keys(out).forEach(function (k) {
    var o = out[k];
    ['exam', 'practice'].forEach(function (w) {
      var s = o[w], wl = wilson_(s.c, s.n);
      s.p = s.n ? Math.round(s.c / s.n * 100) / 100 : null; s.lo = wl.lo; s.hi = wl.hi;
      s.state = s.n < iMin ? 'too few' : s.n < iFull ? 'provisional' : 'reported';
      s.unused = [];
      if (s.n >= dMin) CFG.OPTS.forEach(function (L) { if (L !== o.key && s.opts[L] * 100 / s.n < dPct) s.unused.push(L); });
      s.rpb = null; s.flags = [];
      if (w === 'exam' && s.xs.length >= 2) {
        var n = s.xs.length, mx = 0, my = 0, sxy = 0, sxx = 0, syy = 0, i;
        for (i = 0; i < n; i++) { mx += s.xs[i]; my += s.ys[i]; } mx /= n; my /= n;
        for (i = 0; i < n; i++) { sxy += (s.xs[i] - mx) * (s.ys[i] - my); sxx += (s.xs[i] - mx) * (s.xs[i] - mx); syy += (s.ys[i] - my) * (s.ys[i] - my); }
        if (sxx > 0 && syy > 0) { s.rpb = Math.round(sxy / Math.sqrt(sxx * syy) * 100) / 100; s.cat = ebel_(s.rpb); }
      }
      if (w === 'exam' && s.state !== 'too few') {
        if (s.rpb !== null && s.rpb < 0) s.flags.push('Negative discrimination: stronger candidates did worse on it');
        var kc = s.opts[o.key] || 0, topKey = s.top[o.key] || 0;
        CFG.OPTS.forEach(function (L) {
          if (L === o.key) return;
          if (s.topN >= 5 && s.top[L] > topKey) s.flags.push('The top-scoring third chose ' + L + ' more often than the key');
          if (s.p !== null && s.p < 0.2 && s.opts[L] > kc) s.flags.push('Hard item with one option (' + L + ') chosen more than the key');
        });
      }
      delete s.xs; delete s.ys;
    });
  });
  return out;
}
// A cohort's standing by topic group and Bloom level (first attempts), and its papers.
function cohortSummary_(resps, meta, attempts, set) {
  var G = {}, B = {}, people = {}, n = 0;
  resps.forEach(function (r) {
    if (String(r.first_attempt) !== '1') return;
    var m = meta[r.item_id]; if (!m) return;
    var ok = String(r.correct) === '1' ? 1 : 0; n++; people[r.person_code] = 1;
    [[G, m.g], [B, bloomC_(m.bloom)]].forEach(function (x) { if (!x[1]) return; var o = x[0][x[1]] = x[0][x[1]] || { k: x[1], n: 0, c: 0, who: {} }; o.n++; o.c += ok; o.who[r.person_code] = 1; });
  });
  function rows(M) { return Object.keys(M).map(function (k) { var o = M[k], w = wilson_(o.c, o.n); return { k: k, n: o.n, c: o.c, pct: pct_(o.c, o.n), lo: w.lo, hi: w.hi, people: Object.keys(o.who).length }; }).sort(function (a, b) { return a.pct - b.pct; }); }
  var papers = {};
  attempts.forEach(function (a) { if (a.mode !== 'timed' || a.pct === '') return; var p = papers[a.paper_id] = papers[a.paper_id] || { paper_id: a.paper_id, n: 0, sum: 0, pass: 0, late: 0 }; p.n++; p.sum += Number(a.pct); if (String(a.passed) === 'Y') p.pass++; if (a.late_flag) p.late++; });
  return { people: Object.keys(people).length, responses: n, groups: rows(G), bloom: rows(B),
    papers: Object.keys(papers).map(function (k) { var p = papers[k]; p.mean = Math.round(p.sum / p.n); delete p.sum; return p; }) };
}
// Rank within one paper: 1 is the top score, equal scores share a rank; percentile is the share of sitters who scored lower.
function ranks_(attempts) {
  var out = {}, n = attempts.length;
  attempts.forEach(function (a) {
    var better = 0, lower = 0;
    attempts.forEach(function (b) { if (Number(b.score) > Number(a.score)) better++; if (Number(b.score) < Number(a.score)) lower++; });
    out[a.person_code] = { rank: better + 1, of: n, percentile: n > 1 ? Math.round(lower * 100 / (n - 1)) : 0 };
  });
  return out;
}
// Words two stems share, for the cross-bank overlap warning when a paper is built (the item writer flags pairs at 0.4).
function stemWords_(s) { var o = {}; String(s || '').toLowerCase().replace(/[a-z0-9]{4,}/g, function (w) { o[w] = 1; return w; }); return o; }
function overlap_(a, b) { var ka = Object.keys(a), nb = Object.keys(b).length, both = 0; ka.forEach(function (w) { if (b[w]) both++; }); var u = ka.length + nb - both; return u ? both / u : 0; }

// Invitation messages (same text from the phone and the Sheet menu). Plain ASCII.
function installSteps_(link) {
  return 'On iPhone:\n1. Open this link in Safari: ' + link + '\n2. Tap "Copy invitation".\n3. Tap the Share button, then "Add to Home Screen".\n' +
    '4. Open "MCQ Bench" from your Home Screen and tap "Paste invitation".\n\n' +
    'On Android: open the link in Chrome and follow the screen. Install it from the Chrome menu ("Add to Home screen" or "Install app").\n\n';
}
function inviteText_(name, roleWord, link, line) {
  return 'Assalam o alaikum ' + name + ',\n\nYou are invited to ' + CFG.APP_NAME + ' as ' + roleWord + '.\n\n' + installSteps_(link) +
    'Then choose a PIN of 4 to 6 digits.\n\nIf the app asks for an invitation, copy this line and tap "Paste invitation":\n' + line + '\n\n' +
    'The invitation works for 7 days and only for you. Please do not forward it. If you forget your PIN, ask for a new invitation.';
}
function joinText_(cohort, link, line, until) {
  return 'Assalam o alaikum,\n\nThis is the join link for ' + CFG.APP_NAME + ', group "' + cohort + '".\n\n' + installSteps_(link) +
    'Then type your name and mobile number, choose a PIN, and wait until your request is confirmed.\n\nIf the app asks for an invitation, copy this line and tap "Paste invitation":\n' + line + '\n\n' +
    'The link works until ' + dateTxt_(until) + '. It is for this group only: please do not pass it on.';
}
//== SHARED END
var NEED_SCRIPT = '1.0';
