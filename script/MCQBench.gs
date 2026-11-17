/**
 * Pulmonology MCQ Bench, workbook script.
 * Installed and updated by Loader.gs (menu "MCQ Bench" > "Install update").
 * Stores items, cohorts, papers, attempts and responses; checks who may do what; scores every answer itself;
 * sends each phone only what its role may see. Pure ASCII only (the update code is a SHA-256 of this file).
 */
var VERSION = '1.0';
var RELEASE_NOTE = '1.0: first version. Items read from bank PDFs (Draft until approved), cohorts with join links, practice and timed papers, ' +
  'scoring on the workbook side, item analysis, challenges, feedback tabs for the feedback skill, activity log, updates that install themselves.';

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

// ===================== GOOGLE SERVICES (sheet side only) =====================

var MENU_ITEMS = [
  { label: 'Set up or repair', fn: 'setup' },
  { label: 'Set up my phone (owner)', fn: 'inviteOwner' },
  { label: 'Who has access', fn: 'whoHasAccess' },
  { label: 'Change web app address', fn: 'changeWebAppUrl' },
  { label: 'Check the audit trail', fn: 'checkAudit' }
];
var PAGES_URL = 'https://ir1s-vir1s.github.io/mcq-bench/';
var TABS = {
  ITEMS: ['item_id', 'version', 'pool', 'bank_file', 'page', 'writer', 'subject', 'topic', 'topic_group', 'group_confirmed_by', 'bloom', 'bloom_rationale', 'difficulty_est', 'difficulty_rationale',
    'level', 'intended_for', 'stem', 'lead', 'opt_A', 'opt_B', 'opt_C', 'opt_D', 'opt_E', 'key', 'justification', 'references', 'paper_set', 'status', 'approved_by', 'approved_at', 'imported_at', 'text_sha'],
  COHORTS: ['cohort_id', 'name', 'level', 'pools', 'tutor', 'examiners', 'join_code', 'code_expires', 'code_open', 'created_by', 'created_at'],
  PEOPLE: ['person_code', 'name', 'mobile', 'cohort_id', 'role', 'status', 'requested_at', 'confirmed_by', 'confirmed_at', 'consent', 'req_id'],
  PAPERS: ['paper_id', 'title', 'cohort_id', 'mode', 'items', 'minutes', 'pass_mark', 'setting', 'opens', 'closes', 'start_code', 'status', 'created_by', 'created_at', 'released_at'],
  PAPER_BLOBS: ['paper_id', 'n', 'chunk'],
  ATTEMPTS: ['attempt_id', 'person_code', 'cohort_id', 'paper_id', 'mode', 'started', 'submitted', 'received', 'interruptions', 'late_flag', 'n_items', 'score', 'pct', 'passed'],
  RESPONSES: ['attempt_id', 'person_code', 'cohort_id', 'paper_id', 'mode', 'item_id', 'version', 'position', 'chosen', 'correct', 'seconds', 'attempt_no', 'first_attempt', 'at'],
  CHALLENGES: ['ch_id', 'item_id', 'version', 'person_code', 'reason', 'status', 'reply', 'at', 'replied_by', 'req_id'],
  FB_PERSON: ['person_code', 'run_id', 'scope', 'text', 'n_responses', 'written_at'],
  FB_COHORT: ['cohort_id', 'run_id', 'text', 'n_people', 'n_responses', 'written_at'],
  FB_ITEM: ['item_id', 'version', 'run_id', 'text', 'n_exam', 'n_practice', 'written_at'],
  FB_RUNS: ['run_id', 'started', 'by', 'rows_written', 'checks_passed', 'withdrawn'],
  SETTINGS: ['key', 'value', 'note'],
  AUDIT: ['time', 'who', 'role', 'action', 'tab', 'id', 'field', 'old', 'new', 'reason', 'hash'],
  LOG: ['time', 'event', 'detail']
};
var EXEC_RE = /^https:\/\/script\.google\.com\/(a\/macros\/[^\/]+|macros)\/s\/[A-Za-z0-9_-]+\/exec$/;
var REJOIN_MS = 24 * 3600 * 1000;
var STAFF = ['owner', 'examiner', 'head', 'tutor', 'writer'];

function head_(name) { return TABS[name]; }
function now_() { return (typeof __NOW__ !== 'undefined' && __NOW__) ? __NOW__ : Date.now(); }
function nowStamp_() { return stampPk_(now_()); }
function today_() { return nowStamp_().slice(0, 10); }
function sha_(s) {
  var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8);
  return b.map(function (x) { var h = ((x + 256) % 256).toString(16); return h.length < 2 ? '0' + h : h; }).join('');
}
function rand_(n) { return (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').slice(0, n); }
// Opens a tab, creating it and back-filling missing header cells (new columns only ever go at the end). Every cell is kept as text.
function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name), head = head_(name);
  if (!sh) sh = ss.insertSheet(name);
  var lc = sh.getLastColumn(), have = lc ? sh.getRange(1, 1, 1, lc).getValues()[0] : [];
  if (!head.every(function (h, i) { return have[i] === h; })) {
    head.forEach(function (h, i) {
      if (have[i] !== undefined && have[i] !== '' && have[i] !== h) throw new Error('Tab ' + name + ', column ' + (i + 1) + ' should be "' + h + '" but is "' + have[i] + '". Fix the header, then try again.');
    });
    sh.getRange(1, 1, sh.getMaxRows(), head.length).setNumberFormat('@');
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}
function readRows_(name) {
  var sh = sheet_(name), head = head_(name), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, head.length).getValues().map(function (r, i) {
    var o = { _row: i + 2 };
    head.forEach(function (h, j) { var v = r[j]; o[h] = v === null || v === undefined ? '' : String(v); });
    return o;
  }).filter(function (o) { return head.some(function (h) { return o[h] !== ''; }); });
}
function rowVals_(head, o) { return head.map(function (h) { return o[h] === undefined || o[h] === null ? '' : String(o[h]); }); }
function append_(name, objs) {
  if (!objs.length) return;
  var sh = sheet_(name), head = head_(name), at = sh.getLastRow() + 1;
  var rg = sh.getRange(at, 1, objs.length, head.length);
  rg.setNumberFormat('@');
  rg.setValues(objs.map(function (o) { return rowVals_(head, o); }));
}
function writeRow_(name, rowNum, obj) { var head = head_(name); sheet_(name).getRange(rowNum, 1, 1, head.length).setValues([rowVals_(head, obj)]); }
// Many rows changed in a few columns: each column is read once, patched and written once.
function patchCols_(name, patches) {
  var rows = Object.keys(patches); if (!rows.length) return;
  var sh = sheet_(name), head = head_(name), n = sh.getLastRow() - 1, cols = {};
  rows.forEach(function (r) { Object.keys(patches[r]).forEach(function (c) { cols[c] = 1; }); });
  Object.keys(cols).forEach(function (c) {
    var ci = head.indexOf(c) + 1, rg = sh.getRange(2, ci, n, 1), v = rg.getValues();
    rows.forEach(function (r) { if (patches[r][c] !== undefined) v[+r - 2][0] = String(patches[r][c]); });
    rg.setValues(v);
  });
}
function log_(event, detail) { try { append_('LOG', [{ time: nowStamp_(), event: event, detail: detail || '' }]); } catch (e) { } }
function nextCode_(rows, col, prefix, width) {
  var max = rows.reduce(function (m, r) { var s = String(r[col]); if (s.indexOf(prefix) !== 0) return m; var n = +s.slice(prefix.length); return n > m ? n : m; }, 0);
  return prefix + ('00000' + (max + 1)).slice(-width);
}

// ---------- audit trail: one row per changed field, each row chained to the one before by a hash ----------
function auditHash_(prev, r) {
  return sha_([prev, r.time, r.who, r.role, r.action, r.tab, r.id, r.field, r.old, r.new, r.reason].join('\u0001')).slice(0, 16);
}
function audit_(rows) {
  if (!rows.length) return;
  var sh = sheet_('AUDIT'), last = sh.getLastRow(), prev = last > 1 ? String(sh.getRange(last, 11).getValue()) : '';
  var t = nowStamp_();
  rows.forEach(function (r) {
    r.time = r.time || t;
    ['who', 'role', 'action', 'tab', 'id', 'field', 'old', 'new', 'reason'].forEach(function (k) { r[k] = r[k] === undefined || r[k] === null ? '' : String(r[k]); });
    r.hash = auditHash_(prev, r); prev = r.hash;
  });
  append_('AUDIT', rows);
}
function checkAuditRows_() {
  var rows = readRows_('AUDIT'), prev = '';
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i], o = {};
    ['time', 'who', 'role', 'action', 'tab', 'id', 'field', 'old', 'new', 'reason'].forEach(function (k) { o[k] = String(r[k]); });
    if (auditHash_(prev, o) !== String(r.hash)) return { ok: false, row: r._row, count: rows.length };
    prev = String(r.hash);
  }
  return { ok: true, count: rows.length };
}
function settings_() {
  var o = {};
  readRows_('SETTINGS').forEach(function (r) { o[r.key] = r.value; });
  return o;
}
function bumpStamp_() { PropertiesService.getScriptProperties().setProperty('ITEMS_STAMP', String(now_()) + rand_(4)); }
function itemStamp_() { return PropertiesService.getScriptProperties().getProperty('ITEMS_STAMP') || '0'; }

// ---------- menu actions ----------
function setupCore_() {
  Object.keys(TABS).forEach(function (t) { sheet_(t); });
  var ss = SpreadsheetApp.getActiveSpreadsheet(), s1 = ss.getSheetByName('Sheet1');
  if (s1 && s1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s1);
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('PI_EMAIL')) { var me = ''; try { me = Session.getEffectiveUser().getEmail(); } catch (e) { } p.setProperty('PI_EMAIL', me); }
  var have = readRows_('SETTINGS').map(function (r) { return r.key; }), add = [];
  Object.keys(DEFAULTS).forEach(function (k) { if (have.indexOf(k) < 0) add.push({ key: k, value: DEFAULTS[k], note: SET_NOTES[k] || '' }); });
  append_('SETTINGS', add);
  if (!readRows_('PEOPLE').some(function (r) { return r.role === 'owner'; })) {
    append_('PEOPLE', [{ person_code: 'MCQB-S-01', name: 'Owner', role: 'owner', status: 'active', requested_at: nowStamp_(), confirmed_by: 'setup', confirmed_at: nowStamp_() }]);
  }
  p.setProperty('SCHEMA_VER', String(CFG.SCHEMA_VER));
  log_('setup', 'version ' + VERSION);
}
function setup() {
  setupCore_();
  var p = PropertiesService.getScriptProperties();
  var firstTime = !p.getProperty('WEBAPP_URL') && !tokens_().length;
  SpreadsheetApp.getUi().alert(firstTime
    ? CFG.APP_NAME + ' ' + VERSION + ' is ready.\n\nNext: Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone), then "Set up my phone (owner)".'
    : CFG.APP_NAME + ' ' + VERSION + ' is installed.\n\nNothing else to do: no new deployment is needed and phones keep working. They pick up the change at their next sync.');
}
function webAppUrl_(ui, ask) {
  var p = PropertiesService.getScriptProperties(), saved = p.getProperty('WEBAPP_URL');
  if (saved && !ask) return saved;
  var auto = '';
  try { auto = ScriptApp.getService().getUrl() || ''; } catch (e) { }
  if (!ask && EXEC_RE.test(auto)) { p.setProperty('WEBAPP_URL', auto); return auto; }
  var r = ui.prompt('Web app address',
    'In Apps Script: Deploy > Manage deployments. Copy the Web app URL (it ends in /exec) and paste it here.\n' +
    'If there is no deployment yet: Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone.', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return '';
  var v = String(r.getResponseText() || '').trim();
  if (!EXEC_RE.test(v)) { ui.alert('That is not the web app address. It starts with https://script.google.com/macros/s/ and ends with /exec. Nothing was changed.'); return ''; }
  p.setProperty('WEBAPP_URL', v);
  log_('web app address set', '');
  return v;
}
function changeWebAppUrl() {
  var ui = SpreadsheetApp.getUi();
  if (webAppUrl_(ui, true)) ui.alert('Saved. Phones keep working only if the address did not change; otherwise invite them again.');
}
function webAppUrlNoUi_() {
  var p = PropertiesService.getScriptProperties(), saved = p.getProperty('WEBAPP_URL');
  if (saved) return saved;
  var auto = ''; try { auto = ScriptApp.getService().getUrl() || ''; } catch (e) { }
  if (EXEC_RE.test(auto)) { p.setProperty('WEBAPP_URL', auto); return auto; }
  return '';
}
function me_() { try { return Session.getEffectiveUser().getEmail() || 'owner'; } catch (e) { return 'owner'; } }
function isOwner_() {
  var pi = PropertiesService.getScriptProperties().getProperty('PI_EMAIL') || '';
  return !pi || me_() === pi;
}
function lineFor_(prefix, url, code) { return prefix + '.' + Utilities.base64EncodeWebSafe(url).replace(/=+$/, '') + '.' + code; }
// A personal invitation for a staff role. The person row exists already; the code is swapped for a device token at joining.
function makeInvite_(person, url) {
  var code = rand_(14).toUpperCase();
  PropertiesService.getScriptProperties().setProperty('APPJOIN_' + sha_(code), JSON.stringify({ exp: now_() + 7 * 864e5, pid: person.person_code, role: person.role, first: 0, tok: '' }));
  var line = lineFor_('MCQB1', url, code), link = PAGES_URL + '#join=' + line;
  return { line: line, link: link, text: inviteText_(person.name, ROLE_WORD[person.role], link, line) };
}
function inviteOwner() {
  var ui = SpreadsheetApp.getUi();
  if (!isOwner_()) { ui.alert('Only the owner of this workbook can do this.'); return; }
  var url = webAppUrl_(ui, false); if (!url) return;
  var owner = readRows_('PEOPLE').filter(function (r) { return r.role === 'owner'; })[0];
  if (!owner) { ui.alert('Run "Set up or repair" first.'); return; }
  var r = ui.prompt('Your name', 'Shown to you in the app and on invitations you send (now: ' + owner.name + '). Leave empty to keep it.', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  var nm = String(r.getResponseText() || '').trim().slice(0, 60);
  if (nm) { owner.name = nm; writeRow_('PEOPLE', owner._row, owner); }
  var inv = makeInvite_(owner, url);
  log_('invitation made', owner.person_code + ' (owner)');
  audit_([{ who: owner.person_code, role: 'owner', action: 'invite', tab: 'ACCESS', id: owner.person_code, field: 'role', new: 'owner' }]);
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  ui.showModalDialog(HtmlService.createHtmlOutput('<div style="font-family:Arial;font-size:14px"><p>1. Send this link to your own phone (WhatsApp to yourself). On iPhone open it in <b>Safari</b>; on Android in <b>Chrome</b>.</p>' +
    '<textarea readonly style="width:100%;height:70px" onclick="this.select()">' + esc(inv.link) + '</textarea>' +
    '<p>2. If the app asks for an invitation, copy this line and tap "Paste invitation":</p><textarea readonly style="width:100%;height:60px" onclick="this.select()">' + esc(inv.line) + '</textarea>' +
    '<p>Valid for 7 days. After first use it works again for 24 hours (for the Home Screen copy), then never.</p></div>').setWidth(480).setHeight(380), 'Set up my phone');
}
function tokens_() {
  var all = PropertiesService.getScriptProperties().getProperties(), out = [];
  Object.keys(all).forEach(function (k) {
    if (k.indexOf('APP_') === 0) { try { var v = JSON.parse(all[k]); v.key = k; out.push(v); } catch (e) { } }
  });
  return out;
}
function whoHasAccess() {
  var P = {}; readRows_('PEOPLE').forEach(function (r) { P[r.person_code] = r; });
  var t = tokens_();
  SpreadsheetApp.getUi().alert(t.length ? t.map(function (x) { var p = P[x.pid] || {}; return (p.name || x.pid) + ' (' + (ROLE_WORD[x.role] || x.role) + '), joined ' + x.at + (x.seen ? ', last synced ' + x.seen : ''); }).slice(0, 60).join('\n') : 'No phones yet.');
}
function checkAudit() {
  var r = checkAuditRows_();
  SpreadsheetApp.getUi().alert(r.ok ? 'Audit trail is intact (' + r.count + ' rows).' : 'The audit trail was changed by hand at row ' + r.row + ' of the AUDIT tab (or a row before it was removed).');
}

// ---------- web app ----------
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function doGet(e) { return ContentService.createTextOutput(CFG.APP_NAME + ' ' + VERSION + ' is running.'); }
function doPost(e) {
  var out;
  try { out = api_(JSON.parse(e.postData.contents)); }
  catch (err) { out = { ok: false, code: 400, error: 'Bad request: ' + String(err && err.message || err) }; }
  return json_(out);
}

// ---------- web app ----------
var OPS = { importItems: ['owner', 'examiner'], itemSet: ['owner', 'examiner'], cohort: ['owner', 'examiner'], paper: ['owner', 'examiner'], confirm: ['owner', 'examiner'],
  release: ['owner', 'examiner'], invite: ['owner', 'examiner'], people: ['owner', 'examiner', 'tutor'], remove: ['owner'], stats: STAFF, activity: ['owner'], viewas: ['owner'],
  setting: ['owner'], withdraw: ['owner', 'examiner'], chReply: ['owner', 'examiner'], selfupdate: ['owner'], exportAll: ['owner'], blob: ['owner', 'examiner'] };
function api_(b) {
  var props = PropertiesService.getScriptProperties();
  if (String(props.getProperty('SCHEMA_VER')) !== String(CFG.SCHEMA_VER)) return { ok: false, code: 409, error: 'The workbook is being updated. Open the Sheet and run "Set up or repair".' };
  if (b.op === 'join') return join_(b);
  if (b.op === 'request') return request_(b);
  var raw = b.token ? props.getProperty('APP_' + sha_(b.token)) : null;
  if (!raw) return { ok: false, code: 401, error: 'This phone has no access. Ask for a new invitation.' };
  var who = JSON.parse(raw);
  var person = readRows_('PEOPLE').filter(function (r) { return r.person_code === who.pid; })[0];
  if (!person || person.status === 'removed' || person.status === 'declined') return { ok: false, code: 401, error: person && person.status === 'declined' ? 'Your request to join was not accepted. Ask your examiner.' : 'This phone no longer has access.' };
  who.role = person.role;
  if (b.op === 'hello') return { ok: true, role: who.role, pid: who.pid, version: VERSION };
  if (b.op === 'pull') return { ok: true, data: pull_(who, person, b, false, b.token) };
  if (who.role === 'participant') {
    if (person.status !== 'active') return { ok: false, code: 403, error: 'Your request is waiting to be confirmed.' };
    if (b.op === 'attempt') return locked_(function () { return attempt_(b.a || {}, who, person); });
    if (b.op === 'challenge') return locked_(function () { return challenge_(b, who, person); });
    if (b.op === 'consent') return locked_(function () { return consent_(b, who, person); });
    return { ok: false, code: 403, error: 'This phone cannot do that.' };
  }
  if (!OPS[b.op]) return { ok: false, code: 400, error: 'unknown operation' };
  if (OPS[b.op].indexOf(who.role) < 0) return { ok: false, code: 403, error: 'Your role (' + ROLE_WORD[who.role] + ') cannot do that.' };
  if (b.op === 'stats') return stats_(who, person);
  if (b.op === 'activity') return { ok: true, rows: activity_(who) };
  if (b.op === 'people') return { ok: true, people: people_(who, person) };
  if (b.op === 'selfupdate') return selfUpdate_(who.pid);
  if (b.op === 'exportAll') return exportAll_(b, who);
  if (b.op === 'blob') return { ok: true, blob: blobOf_(String(b.paper_id)) };
  if (b.op === 'viewas') {
    var t = readRows_('PEOPLE').filter(function (r) { return r.person_code === String(b.pid); })[0];
    if (!t) return { ok: false, error: 'No such person.' };
    return { ok: true, data: pull_({ pid: t.person_code, role: t.role }, t, {}, true) };
  }
  return locked_(function () {
    if (b.op === 'importItems') return importItems_(b, who);
    if (b.op === 'itemSet') return itemSet_(b, who);
    if (b.op === 'cohort') return cohort_(b, who);
    if (b.op === 'paper') return paper_(b, who);
    if (b.op === 'release') return release_(b, who);
    if (b.op === 'confirm') return confirm_(b, who);
    if (b.op === 'invite') return invite_(b, who);
    if (b.op === 'remove') return remove_(b, who);
    if (b.op === 'setting') return setting_(b, who);
    if (b.op === 'withdraw') return withdraw_(b, who);
    if (b.op === 'chReply') return chReply_(b, who);
    return { ok: false, code: 400, error: 'unknown operation' };
  });
}
function locked_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function issueToken_(pid, role) {
  var token = rand_(40), tsha = sha_(token);
  PropertiesService.getScriptProperties().setProperty('APP_' + tsha, JSON.stringify({ pid: pid, role: role, at: nowStamp_() }));
  return { token: token, sha: tsha };
}
function join_(b) {
  var code = String(b.code || '').trim().toUpperCase(), props = PropertiesService.getScriptProperties();
  var key = 'APPJOIN_' + sha_(code), raw = props.getProperty(key);
  if (!code || !raw) return { ok: false, code: 403, error: 'That invitation is not valid. Ask for a new one.' };
  var inv = JSON.parse(raw), now = now_();
  if (inv.exp < now && !inv.first) { props.deleteProperty(key); return { ok: false, code: 403, error: 'That invitation has expired. Ask for a new one.' }; }
  if (inv.first && now - inv.first > REJOIN_MS) { props.deleteProperty(key); return { ok: false, code: 403, error: 'That invitation was already used. Ask for a new one.' }; }
  var again = !!inv.first;
  if (inv.tok) props.deleteProperty('APP_' + inv.tok);
  var t = issueToken_(inv.pid, inv.role);
  inv.first = inv.first || now; inv.tok = t.sha;
  props.setProperty(key, JSON.stringify(inv));
  locked_(function () {
    var p = readRows_('PEOPLE').filter(function (r) { return r.person_code === inv.pid; })[0];
    if (p && p.status === 'invited') { p.status = 'active'; p.confirmed_at = nowStamp_(); writeRow_('PEOPLE', p._row, p); }
    audit_([{ who: inv.pid, role: inv.role, action: again ? 'joined again' : 'joined', tab: 'ACCESS', id: inv.pid }]);
  });
  return { ok: true, token: t.token, role: inv.role, pid: inv.pid };
}
// A participant asks to join a cohort with its join link. The phone gets a token at once, but nothing is sent to it until the request is confirmed.
function request_(b) {
  var code = String(b.code || '').trim().toUpperCase(), name = String(b.name || '').trim().replace(/\s+/g, ' ').slice(0, 60), mobile = String(b.mobile || '').replace(/[^\d+]/g, '').slice(0, 16), req = String(b.req_id || '').slice(0, 60);
  if (name.length < 3) return { ok: false, error: 'Type your full name.' };
  if (!/^(\+?92|0)?3\d{9}$/.test(mobile)) return { ok: false, error: 'Type your mobile number like 03001234567.' };
  if (!req) return { ok: false, error: 'Missing request id.' };
  return locked_(function () {
    var c = readRows_('COHORTS').filter(function (r) { return code && r.join_code === code; })[0];
    if (!c || c.code_open !== 'Y') return { ok: false, code: 403, error: 'That join link is not valid any more. Ask for a new one.' };
    if (c.code_expires && c.code_expires < today_()) return { ok: false, code: 403, error: 'That join link has expired. Ask for a new one.' };
    var people = readRows_('PEOPLE'), dup = people.filter(function (r) { return r.req_id === req; })[0];
    if (dup) { var t0 = issueToken_(dup.person_code, 'participant'); return { ok: true, token: t0.token, role: 'participant', pid: dup.person_code, cohort: c.name }; }
    if (people.filter(function (r) { return r.cohort_id === c.cohort_id && r.status === 'pending'; }).length >= 200) return { ok: false, error: 'Too many requests are waiting for this group. Tell your examiner.' };
    var pid = nextCode_(people, 'person_code', 'MCQB-P-', 3);
    append_('PEOPLE', [{ person_code: pid, name: name, mobile: mobile, cohort_id: c.cohort_id, role: 'participant', status: 'pending', requested_at: nowStamp_(), req_id: req }]);
    var t = issueToken_(pid, 'participant');
    audit_([{ who: pid, role: 'participant', action: 'asked to join', tab: 'COHORTS', id: c.cohort_id }]);
    return { ok: true, token: t.token, role: 'participant', pid: pid, cohort: c.name };
  });
}

// ---------- what each phone receives ----------
function seesCohort_(who, c) {
  if (who.role === 'owner' || who.role === 'head') return true;
  if (who.role === 'examiner') { var ex = String(c.examiners || '').split(/[,\s]+/).filter(Boolean); return !ex.length || ex.indexOf(who.pid) >= 0; }
  if (who.role === 'tutor') return c.tutor === who.pid;
  return false;
}
function itemOut_(r, withKey) {
  var o = { item_id: r.item_id, version: r.version, stem: r.stem, lead: r.lead, opts: [r.opt_A, r.opt_B, r.opt_C, r.opt_D, r.opt_E] };
  if (withKey) { o.pool = r.pool; o.topic = r.topic; o.g = r.topic_group; o.bloom = r.bloom; o.level = r.level; o.key = r.key; o.just = r.justification; o.refs = r.references; }
  return o;
}
function itemFull_(r) {
  var o = itemOut_(r, true);
  ['bank_file', 'page', 'writer', 'subject', 'group_confirmed_by', 'bloom_rationale', 'difficulty_est', 'difficulty_rationale', 'intended_for', 'paper_set', 'status', 'approved_by', 'approved_at'].forEach(function (k) { o[k] = r[k]; });
  return o;
}
function current_(items) { return items.filter(function (r) { return r.status !== 'Superseded'; }); }
function inPool_(r, c) {
  var pools = String(c.pools || '').split(/[,\s]+/).filter(Boolean);
  return levelCode_(r.level) === c.level && (!pools.length || pools.indexOf(r.pool) >= 0);
}
function runsOff_() { var o = {}; readRows_('FB_RUNS').forEach(function (r) { if (r.withdrawn === 'Y') o[r.run_id] = 1; }); return o; }
function fbRows_(tab, off) { return readRows_(tab).filter(function (r) { return !off[r.run_id]; }).map(function (r) { delete r._row; return r; }); }
function pull_(who, person, b, asView, token) {
  var set = settings_(), now = now_(), stamp = itemStamp_();
  var D = { version: VERSION, now: now, role: who.role, pid: who.pid, name: person.name, stamp: stamp, set: {} };
  Object.keys(DEFAULTS).forEach(function (k) { D.set[k] = set[k] === undefined ? String(DEFAULTS[k]) : set[k]; });
  if (!asView && token) {
    var p = PropertiesService.getScriptProperties(), k = 'APP_' + sha_(token), raw = p.getProperty(k);
    if (raw) { var v = JSON.parse(raw), d = today_(); if (v.seen !== d) { v.seen = d; p.setProperty(k, JSON.stringify(v)); if (who.role !== 'owner') quietAudit_([{ who: who.pid, role: who.role, action: 'opened the app', tab: 'ACCESS', id: who.pid }]); } }
  }
  var sameItems = b && b.stamp === stamp;
  var cohorts = readRows_('COHORTS');
  if (who.role === 'participant') return pullParticipant_(D, who, person, b || {}, set, now, sameItems, cohorts);
  var items = current_(readRows_('ITEMS')), off = runsOff_();
  if (who.role === 'writer') {
    var mine = items.filter(function (r) { return r.writer === who.pid; }), ids = {};
    mine.forEach(function (r) { ids[r.item_id] = 1; });
    D.items = sameItems ? null : mine.map(itemFull_);
    D.challenges = readRows_('CHALLENGES').filter(function (c) { return ids[c.item_id]; }).map(function (c) { return { ch_id: c.ch_id, item_id: c.item_id, version: c.version, reason: c.reason, status: c.status, reply: c.reply, at: c.at }; });
    D.fbItem = fbRows_('FB_ITEM', off).filter(function (r) { return ids[r.item_id]; });
    return D;
  }
  var vis = cohorts.filter(function (c) { return seesCohort_(who, c); }), visIds = {};
  vis.forEach(function (c) { visIds[c.cohort_id] = 1; });
  var staffFull = who.role === 'owner' || who.role === 'examiner', named = staffFull || who.role === 'tutor';
  D.cohorts = vis.map(function (c) { var o = { cohort_id: c.cohort_id, name: c.name, level: c.level, pools: c.pools, tutor: c.tutor, examiners: c.examiners }; if (staffFull) { o.code_expires = c.code_expires; o.code_open = c.code_open; o.has_code = c.join_code ? 'Y' : ''; } return o; });
  var people = readRows_('PEOPLE');
  D.people = people.filter(function (r) { return r.status !== 'removed' && (r.role === 'participant' ? visIds[r.cohort_id] : staffFull); }).map(function (r) {
    var o = { person_code: r.person_code, cohort_id: r.cohort_id, role: r.role, status: r.status };
    if (named) o.name = r.name;
    if (staffFull) { o.mobile = r.mobile; o.requested_at = r.requested_at; }
    return o;
  });
  D.attempts = readRows_('ATTEMPTS').filter(function (a) { return visIds[a.cohort_id]; }).map(function (a) { delete a._row; return a; });
  D.fbCohort = fbRows_('FB_COHORT', off).filter(function (r) { return visIds[r.cohort_id]; });
  if (named) D.fbPerson = fbRows_('FB_PERSON', off).filter(function (r) { var p = people.filter(function (x) { return x.person_code === r.person_code; })[0]; return p && visIds[p.cohort_id]; });
  D.papers = readRows_('PAPERS').filter(function (p) { return visIds[p.cohort_id]; }).map(function (p) { delete p._row; if (!staffFull) delete p.start_code; return p; });
  if (who.role === 'tutor') return D;
  D.items = sameItems ? null : items.map(itemFull_);
  D.fbItem = fbRows_('FB_ITEM', off);
  D.challenges = readRows_('CHALLENGES').map(function (c) { delete c._row; delete c.req_id; if (!staffFull) delete c.person_code; return c; });
  if (staffFull) D.runs = readRows_('FB_RUNS').map(function (r) { delete r._row; return r; });
  return D;
}
function pullParticipant_(D, who, person, b, set, now, sameItems, cohorts) {
  if (person.status !== 'active') { D.pending = true; return D; }
  var c = cohorts.filter(function (x) { return x.cohort_id === person.cohort_id; })[0];
  if (!c) { D.pending = true; return D; }
  D.cohort = { cohort_id: c.cohort_id, name: c.name, level: c.level };
  D.consent = person.consent || '';
  var all = readRows_('ITEMS'), items = current_(all), have = b.have || {}, grace = setNum_(set, 'grace_min') * 60000;
  D.items = sameItems ? null : items.filter(function (r) { return r.status === 'Live' && inPool_(r, c); }).map(function (r) { return itemOut_(r, true); });
  var myAtt = readRows_('ATTEMPTS').filter(function (a) { return a.person_code === who.pid; });
  var allAtt = null, closedIds = {};
  D.papers = readRows_('PAPERS').filter(function (p) { return p.cohort_id === c.cohort_id && (p.status === 'published' || p.status === 'released'); }).map(function (p) {
    var o = { paper_id: p.paper_id, title: p.title, mode: p.mode, minutes: p.minutes, pass_mark: p.pass_mark, setting: p.setting, opens: p.opens, closes: p.closes, ids: p.items.split(',') };
    if (p.mode !== 'timed') return o;
    var closeMs = paperCloseMs_(p), openMs = pkMs_(p.opens), mine = myAtt.filter(function (a) { return a.paper_id === p.paper_id; })[0];
    o.close_ms = closeMs; o.open_ms = openMs; o.n = o.ids.length; delete o.ids;
    o.state = now > closeMs + grace ? 'closed' : now >= openMs ? 'open' : 'soon';
    var byKey = {}; all.forEach(function (r) { byKey[r.item_id] = byKey[r.item_id] && +byKey[r.item_id].version > +r.version ? byKey[r.item_id] : r; });
    var rows = p.items.split(',').map(function (id) { return byKey[id]; }).filter(Boolean);
    if (o.state === 'closed') { closedIds[p.paper_id] = 1; if (have[p.paper_id] !== 'k') o.keyed = rows.map(function (r) { return itemOut_(r, true); }); }
    else if (!mine) {
      if (p.setting === 'supervised') { if (have[p.paper_id] !== 'b') o.blob = blobOf_(p.paper_id); }
      else if (o.state === 'open' && have[p.paper_id] !== 'q') o.questions = rows.map(function (r) { return itemOut_(r, false); });
    }
    if (mine) {
      if (!allAtt) allAtt = readRows_('ATTEMPTS');
      var sat = allAtt.filter(function (a) { return a.paper_id === p.paper_id; });
      if (sat.length >= setNum_(set, 'rank_min')) o.rank = ranks_(sat)[who.pid];
      o.sat = sat.length;
    }
    return o;
  });
  D.attempts = myAtt.map(function (a) { delete a._row; return a; });
  // Own answers: practice in full; a timed paper's right and wrong marks only once it has closed for everyone.
  D.responses = readRows_('RESPONSES').filter(function (r) { return r.person_code === who.pid; }).map(function (r) {
    var o = { attempt_id: r.attempt_id, paper_id: r.paper_id, mode: r.mode, item_id: r.item_id, version: r.version, chosen: r.chosen, first_attempt: r.first_attempt, at: r.at };
    o.correct = r.mode === 'timed' && !closedIds[r.paper_id] ? '' : r.correct;
    return o;
  });
  // Topic group and Bloom level of every item this person has answered, also items that have since left the pool (reserved, retired, reworded),
  // so that earlier answers keep counting in their feedback. No stem or key is included.
  var inPoolNow = {}; (D.items || []).forEach(function (i) { inPoolNow[i.item_id] = 1; });
  D.meta = {};
  D.responses.forEach(function (r) { if (D.meta[r.item_id] || (D.items && inPoolNow[r.item_id])) return; var it = items.filter(function (x) { return x.item_id === r.item_id; })[0]; if (it) D.meta[r.item_id] = { g: it.topic_group, pool: it.pool, bloom: it.bloom }; });
  // Until a timed paper closes its feedback is given by topic group only, worked out here so no key leaves the workbook.
  var hidden = readRows_('RESPONSES').filter(function (r) { return r.person_code === who.pid && r.mode === 'timed' && !closedIds[r.paper_id]; });
  if (hidden.length) {
    var meta = {}; items.forEach(function (r) { meta[r.item_id] = { g: r.topic_group, pool: r.pool, bloom: r.bloom }; });
    D.examFb = {};
    hidden.forEach(function (r) { (D.examFb[r.paper_id] = D.examFb[r.paper_id] || []).push(r); });
    Object.keys(D.examFb).forEach(function (pid) { var f = personFeedback_(D.examFb[pid].map(function (r) { return { item_id: r.item_id, correct: r.correct, first_attempt: '1' }; }), meta, { person_min: 1, person_full: 1 }); D.examFb[pid] = { groups: f.groups, bloom: f.bloom }; });
  }
  var off = runsOff_();
  D.fb = fbRows_('FB_PERSON', off).filter(function (r) { return r.person_code === who.pid; });
  D.challenges = readRows_('CHALLENGES').filter(function (x) { return x.person_code === who.pid; }).map(function (x) { return { ch_id: x.ch_id, item_id: x.item_id, reason: x.reason, status: x.status, reply: x.reply, at: x.at }; });
  return D;
}
function blobOf_(paperId) {
  return readRows_('PAPER_BLOBS').filter(function (r) { return r.paper_id === paperId; }).sort(function (a, b) { return +a.n - +b.n; }).map(function (r) { return r.chunk; }).join('');
}

// ---------- answers: the workbook marks them itself ----------
function attempt_(a, who, person) {
  var id = String(a.attempt_id || '').slice(0, 60), list = Array.isArray(a.responses) ? a.responses.slice(0, 400) : [];
  if (!id) return { ok: false, error: 'Missing attempt id.' };
  var now = now_(), set = settings_(), paper = null, mode = 'practice';
  if (a.paper_id) {
    paper = readRows_('PAPERS').filter(function (p) { return p.paper_id === String(a.paper_id); })[0];
    if (!paper || paper.cohort_id !== person.cohort_id || (paper.status !== 'published' && paper.status !== 'released')) return { ok: false, error: 'That paper is not open to you.' };
    mode = paper.mode === 'timed' ? 'timed' : 'set';
  }
  var atts = readRows_('ATTEMPTS'), cur = atts.filter(function (x) { return x.attempt_id === id; })[0];
  if (cur && cur.person_code !== who.pid) return { ok: false, error: 'That attempt belongs to someone else.' };
  if (mode === 'timed') {
    if (cur) return { ok: true, dup: true, attempt_id: id };
    if (atts.some(function (x) { return x.paper_id === paper.paper_id && x.person_code === who.pid; })) return { ok: false, error: 'You have already sat this paper. One attempt is allowed.' };
  }
  var cohort = readRows_('COHORTS').filter(function (c) { return c.cohort_id === person.cohort_id; })[0];
  var all = readRows_('ITEMS'), byKey = {};
  all.forEach(function (r) { byKey[r.item_id + '|' + r.version] = r; });
  var allowed = null;
  if (paper) { allowed = {}; paper.items.split(',').forEach(function (x) { allowed[x] = 1; }); }
  var resp = readRows_('RESPONSES'), mineBefore = {}, haveKey = {};
  resp.forEach(function (r) { if (r.person_code !== who.pid) return; mineBefore[r.item_id] = (mineBefore[r.item_id] || 0) + 1; if (r.attempt_id === id) haveKey[r.item_id] = 1; });
  var add = [], bad = 0;
  list.forEach(function (r, i) {
    var it = byKey[String(r.item_id) + '|' + String(r.version)];
    if (!it || haveKey[it.item_id]) return;
    if (allowed ? !allowed[it.item_id] : !(cohort && inPool_(it, cohort) && (it.status === 'Live' || it.status === 'Superseded'))) { bad++; return; }
    var ch = CFG.OPTS.indexOf(String(r.chosen)) >= 0 ? String(r.chosen) : '';
    if (!ch && mode !== 'timed') return;
    haveKey[it.item_id] = 1;
    var no = (mineBefore[it.item_id] || 0) + 1; mineBefore[it.item_id] = no;
    add.push({ attempt_id: id, person_code: who.pid, cohort_id: person.cohort_id, paper_id: paper ? paper.paper_id : '', mode: mode, item_id: it.item_id, version: it.version, position: r.position === undefined ? i + 1 : Number(r.position) || i + 1,
      chosen: ch, correct: ch && ch === it.key ? 1 : 0, seconds: Math.max(0, Math.min(36000, Math.round(Number(r.seconds) || 0))), attempt_no: no, first_attempt: no === 1 ? 1 : 0, at: stampPk_(Number(r.at) || now) });
  });
  if (mode === 'timed') {
    // Every item of the paper gets a row, answered or not.
    paper.items.split(',').forEach(function (x, i) {
      if (haveKey[x]) return;
      var it = current_(all).filter(function (r) { return r.item_id === x; })[0]; if (!it) return;
      var no = (mineBefore[x] || 0) + 1;
      add.push({ attempt_id: id, person_code: who.pid, cohort_id: person.cohort_id, paper_id: paper.paper_id, mode: mode, item_id: x, version: it.version, position: i + 1, chosen: '', correct: 0, seconds: 0, attempt_no: no, first_attempt: no === 1 ? 1 : 0, at: stampPk_(now) });
    });
  }
  append_('RESPONSES', add);
  var mineNow = resp.filter(function (r) { return r.attempt_id === id; }).concat(add), score = mineNow.filter(function (r) { return String(r.correct) === '1'; }).length;
  var n = mode === 'timed' ? paper.items.split(',').length : mineNow.length, flags = [];
  var started = Number(a.started) || now, submitted = a.submitted ? Number(a.submitted) : 0;
  if (mode === 'timed') {
    var closeMs = paperCloseMs_(paper), openMs = pkMs_(paper.opens), grace = setNum_(set, 'grace_min') * 60000;
    if (now > closeMs + grace) flags.push('arrived ' + Math.round((now - closeMs) / 60000) + ' min after the paper closed');
    if (started < openMs - 60000) flags.push('started before the paper opened (phone clock)');
    if (submitted && submitted - started > (Number(paper.minutes) + 1) * 60000) flags.push('took longer than the time allowed (phone clock)');
    if (submitted > now + 5 * 60000) flags.push('phone clock ahead of the workbook');
    submitted = submitted || now;
  }
  var row = { attempt_id: id, person_code: who.pid, cohort_id: person.cohort_id, paper_id: paper ? paper.paper_id : '', mode: mode, started: stampPk_(started), submitted: submitted ? stampPk_(submitted) : '', received: stampPk_(now),
    interruptions: Math.max(0, Math.round(Number(a.interruptions) || 0)), late_flag: flags.join('; '), n_items: n, score: score, pct: pct_(score, n),
    passed: mode === 'timed' && paper.pass_mark !== '' ? (pct_(score, n) >= Number(paper.pass_mark) ? 'Y' : 'N') : '' };
  if (cur) writeRow_('ATTEMPTS', cur._row, row); else append_('ATTEMPTS', [row]);
  if (mode === 'timed') audit_([{ who: who.pid, role: 'participant', action: 'submitted a timed paper', tab: 'PAPERS', id: paper.paper_id, field: 'late_flag', new: row.late_flag }]);
  return { ok: true, attempt_id: id, saved: add.length, refused: bad };
}
function challenge_(b, who, person) {
  var reason = String(b.reason || '').trim().slice(0, 600), req = String(b.req_id || '');
  if (reason.length < 10) return { ok: false, error: 'Say in a sentence why the item looks wrong.' };
  var rows = readRows_('CHALLENGES'), dup = rows.filter(function (r) { return r.req_id === req; })[0];
  if (dup) return { ok: true, dup: true, ch_id: dup.ch_id };
  // Only for an item this person has answered and whose key they may already see.
  var seen = readRows_('RESPONSES').filter(function (r) { return r.person_code === who.pid && r.item_id === String(b.item_id); });
  if (!seen.length) return { ok: false, error: 'You can flag only an item you have answered.' };
  var timedOpen = seen.every(function (r) { return r.mode === 'timed'; }) && readRows_('PAPERS').some(function (p) { return p.paper_id === seen[0].paper_id && now_() <= paperCloseMs_(p) + setNum_(settings_(), 'grace_min') * 60000; });
  if (timedOpen) return { ok: false, error: 'Items of a timed paper can be flagged after the paper has closed.' };
  var id = nextCode_(rows, 'ch_id', 'Q', 4);
  append_('CHALLENGES', [{ ch_id: id, item_id: String(b.item_id), version: seen[seen.length - 1].version, person_code: who.pid, reason: reason, status: 'open', at: nowStamp_(), req_id: req }]);
  audit_([{ who: who.pid, role: 'participant', action: 'flagged an item', tab: 'ITEMS', id: String(b.item_id) }]);
  return { ok: true, ch_id: id };
}
function consent_(b, who, person) {
  if (String(settings_().research_on) !== 'Y') return { ok: false, error: 'Research consent is not switched on.' };
  var v = b.agree === true ? 'Y ' + today_() : 'N ' + today_();
  person.consent = v; writeRow_('PEOPLE', person._row, person);
  audit_([{ who: who.pid, role: 'participant', action: 'research consent', tab: 'PEOPLE', id: who.pid, field: 'consent', new: v.charAt(0) }]);
  return { ok: true, consent: v };
}

// ---------- items ----------
var ITEM_REQ = ['item_id', 'topic', 'bloom', 'difficulty_est', 'level', 'stem', 'lead', 'opt_A', 'opt_B', 'opt_C', 'opt_D', 'opt_E', 'key', 'justification', 'references'];
var ITEM_TEXT = ['subject', 'topic', 'bloom', 'bloom_rationale', 'difficulty_est', 'difficulty_rationale', 'level', 'intended_for', 'stem', 'lead', 'opt_A', 'opt_B', 'opt_C', 'opt_D', 'opt_E', 'key', 'justification', 'references'];
function importItems_(b, who) {
  var list = Array.isArray(b.items) ? b.items.slice(0, 60) : [], writer = String(b.writer || '').slice(0, 20), file = String(b.bank_file || '').slice(0, 120);
  var people = readRows_('PEOPLE');
  if (writer && !people.some(function (p) { return p.person_code === writer && (p.role === 'writer' || p.role === 'owner' || p.role === 'examiner'); })) return { ok: false, error: 'Choose the writer from the list.' };
  var rows = readRows_('ITEMS'), cur = {}, res = { ok: true, added: 0, updated: 0, same: 0, bad: [] }, add = [], patch = {}, stamp = nowStamp_();
  current_(rows).forEach(function (r) { cur[r.item_id] = r; });
  list.forEach(function (it) {
    it = it || {};
    var id = String(it.item_id || '').trim(), why = '';
    if (!poolOf_(id)) why = 'item number not understood';
    ITEM_REQ.forEach(function (k) { if (!why && String(it[k] === undefined ? '' : it[k]).trim() === '') why = k + ' is empty'; });
    if (!why && CFG.OPTS.indexOf(String(it.key)) < 0) why = 'key is not A to E';
    if (!why && !levelCode_(it.level)) why = 'level is not Undergraduate or Postgraduate';
    if (!why && !bloomC_(it.bloom)) why = 'Bloom level not understood';
    if (!why && ITEM_TEXT.some(function (k) { return String(it[k] || '').length > 12000; })) why = 'a field is too long';
    if (!why) { var o5 = CFG.OPTS.map(function (L) { return String(it['opt_' + L]).trim().toLowerCase(); }); if (o5.some(function (x, i) { return o5.indexOf(x) !== i; })) why = 'two options are the same'; }
    if (why) { res.bad.push({ item_id: id, why: why }); return; }
    var row = { item_id: id, pool: poolOf_(id), bank_file: file, page: String(it.page || ''), writer: writer, paper_set: String(it.paper_set || ''), imported_at: stamp, status: 'Draft' };
    ITEM_TEXT.forEach(function (k) { row[k] = String(it[k] === undefined ? '' : it[k]).trim(); });
    row.text_sha = sha_(ITEM_TEXT.map(function (k) { return row[k]; }).join('\u0001')).slice(0, 16);
    var old = cur[id];
    if (old && old.text_sha === row.text_sha) { res.same++; return; }
    row.version = old ? Number(old.version) + 1 : 1;
    row.topic_group = old && old.group_confirmed_by ? old.topic_group : topicGroup_(id, row.topic);
    row.group_confirmed_by = old ? old.group_confirmed_by : '';
    if (old) { patch[old._row] = { status: 'Superseded' }; res.updated++; } else res.added++;
    cur[id] = row; add.push(row);
  });
  patchCols_('ITEMS', patch);
  append_('ITEMS', add);
  if (add.length) { bumpStamp_(); audit_([{ who: who.pid, role: who.role, action: 'imported items', tab: 'ITEMS', id: file, field: 'count', new: add.length, reason: 'writer ' + writer }]); }
  return res;
}
var ITEM_MOVES = { Draft: ['Live', 'Retired'], Live: ['Retired'], Retired: ['Live'] };
function itemSet_(b, who) {
  var ids = {}, n = 0, patch = {}, skipped = 0, stamp = nowStamp_();
  (Array.isArray(b.ids) ? b.ids : []).forEach(function (x) { ids[String(x)] = 1; });
  var people = b.writer !== undefined ? readRows_('PEOPLE') : null;
  if (b.writer && !people.some(function (p) { return p.person_code === String(b.writer); })) return { ok: false, error: 'Choose the writer from the list.' };
  var grp = b.topic_group === undefined ? null : String(b.topic_group).trim().slice(0, 80);
  if (grp !== null && grp.length < 3) return { ok: false, error: 'Give the topic group a name.' };
  current_(readRows_('ITEMS')).forEach(function (r) {
    if (!ids[r.item_id]) return;
    var p = {};
    if (b.status) { if ((ITEM_MOVES[r.status] || []).indexOf(String(b.status)) < 0) { skipped++; return; } p.status = String(b.status); if (b.status === 'Live') { p.approved_by = who.pid; p.approved_at = stamp; } }
    if (grp !== null) { p.topic_group = grp; p.group_confirmed_by = who.pid; }
    if (b.confirm_group) p.group_confirmed_by = who.pid;
    if (b.writer !== undefined) p.writer = String(b.writer);
    patch[r._row] = p; n++;
  });
  patchCols_('ITEMS', patch);
  if (n) { bumpStamp_(); audit_([{ who: who.pid, role: who.role, action: b.status ? 'items set to ' + b.status : grp !== null ? 'topic group set' : 'items changed', tab: 'ITEMS', id: n === 1 ? Object.keys(ids)[0] : n + ' items', field: b.status ? 'status' : 'topic_group', new: b.status || grp || '' }]); }
  return { ok: true, changed: n, skipped: skipped };
}

// ---------- cohorts and people ----------
function joinCode_() { var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '', h = sha_(rand_(32)); for (var i = 0; i < 8; i++) s += a.charAt(parseInt(h.substr(i * 2, 2), 16) % a.length); return s; }
function cohort_(b, who) {
  var rows = readRows_('COHORTS'), c = b.cohort_id ? rows.filter(function (r) { return r.cohort_id === String(b.cohort_id); })[0] : null;
  if (b.cohort_id && !c) return { ok: false, error: 'No such group.' };
  if (c && !seesCohort_(who, c)) return { ok: false, code: 403, error: 'That group is not assigned to you.' };
  var name = String(b.name || '').trim().slice(0, 60), level = levelCode_(b.level);
  if (name.length < 3) return { ok: false, error: 'Give the group a name.' };
  if (!level) return { ok: false, error: 'Choose undergraduate or postgraduate.' };
  if (rows.some(function (r) { return r.name.toLowerCase() === name.toLowerCase() && (!c || r.cohort_id !== c.cohort_id); })) return { ok: false, error: 'A group with that name exists.' };
  var set = settings_(), row = c || { cohort_id: nextCode_(rows, 'cohort_id', 'C', 2), created_by: who.pid, created_at: nowStamp_(), code_open: 'Y' };
  row.name = name; row.level = level;
  row.pools = String(b.pools || '').split(/[,\s]+/).filter(function (x) { return /^[A-Z]{2,5}$/.test(x); }).join(',');
  row.tutor = String(b.tutor || ''); row.examiners = String(b.examiners || '').split(/[,\s]+/).filter(Boolean).join(',');
  if (b.code_open === 'Y' || b.code_open === 'N') row.code_open = b.code_open;
  if (!row.join_code || b.renew) { row.join_code = joinCode_(); row.code_expires = stampPk_(now_() + setNum_(set, 'code_days') * 864e5).slice(0, 10); row.code_open = 'Y'; }
  if (c) writeRow_('COHORTS', c._row, row); else append_('COHORTS', [row]);
  bumpStamp_();
  audit_([{ who: who.pid, role: who.role, action: c ? (b.renew ? 'join link renewed' : 'group changed') : 'group created', tab: 'COHORTS', id: row.cohort_id, field: 'name', new: name }]);
  var out = { ok: true, cohort_id: row.cohort_id, code_expires: row.code_expires, code_open: row.code_open };
  var url = webAppUrlNoUi_();
  if (url && row.code_open === 'Y') { out.line = lineFor_('MCQBC1', url, row.join_code); out.link = PAGES_URL + '#join=' + out.line; out.text = joinText_(name, out.link, out.line, row.code_expires); }
  else if (!url) out.note = 'The web app address is not saved yet. In the Sheet use "Change web app address" once.';
  return out;
}
function confirm_(b, who) {
  var p = readRows_('PEOPLE').filter(function (r) { return r.person_code === String(b.pid); })[0];
  if (!p || p.role !== 'participant') return { ok: false, error: 'No such request.' };
  var c = readRows_('COHORTS').filter(function (r) { return r.cohort_id === p.cohort_id; })[0];
  if (!c || !seesCohort_(who, c)) return { ok: false, code: 403, error: 'That group is not assigned to you.' };
  if (p.status !== 'pending' && !(p.status === 'declined' && b.yes)) return { ok: true, dup: true, status: p.status };
  p.status = b.yes ? 'active' : 'declined'; p.confirmed_by = who.pid; p.confirmed_at = nowStamp_();
  writeRow_('PEOPLE', p._row, p);
  audit_([{ who: who.pid, role: who.role, action: b.yes ? 'confirmed a join request' : 'declined a join request', tab: 'PEOPLE', id: p.person_code }]);
  return { ok: true, status: p.status };
}
function invite_(b, who) {
  var role = String(b.role || ''), name = String(b.name || '').trim().slice(0, 60);
  if (['examiner', 'head', 'tutor', 'writer'].indexOf(role) < 0) return { ok: false, error: 'Choose a role.' };
  if (who.role !== 'owner' && role !== 'tutor') return { ok: false, code: 403, error: 'Only the owner invites that role.' };
  var url = webAppUrlNoUi_();
  if (!url) return { ok: false, error: 'The web app address is not saved yet. In the Sheet use "Change web app address" once.' };
  var people = readRows_('PEOPLE'), p = b.pid ? people.filter(function (r) { return r.person_code === String(b.pid) && r.role !== 'participant' && r.role !== 'owner'; })[0] : null;
  if (b.pid && !p) return { ok: false, error: 'No such person.' };
  if (!p) {
    if (name.length < 3) return { ok: false, error: 'Type the name.' };
    p = { person_code: nextCode_(people, 'person_code', 'MCQB-S-', 2), name: name, role: role, status: 'invited', requested_at: nowStamp_(), confirmed_by: who.pid };
    append_('PEOPLE', [p]);
  }
  var inv = makeInvite_(p, url);
  audit_([{ who: who.pid, role: who.role, action: 'invite', tab: 'ACCESS', id: p.person_code, field: 'role', new: p.role }]);
  return { ok: true, pid: p.person_code, name: p.name, link: inv.link, line: inv.line, text: inv.text };
}
function remove_(b, who) {
  var p = readRows_('PEOPLE').filter(function (r) { return r.person_code === String(b.pid); })[0];
  if (!p || p.role === 'owner') return { ok: false, error: 'That person cannot be removed.' };
  p.status = 'removed'; writeRow_('PEOPLE', p._row, p);
  var props = PropertiesService.getScriptProperties(), n = 0;
  tokens_().forEach(function (t) { if (t.pid === p.person_code) { props.deleteProperty(t.key); n++; } });
  audit_([{ who: who.pid, role: who.role, action: 'remove access', tab: 'ACCESS', id: p.person_code, field: 'phones', old: n, new: 0 }]);
  return { ok: true, phones: n };
}
function people_(who, person) {
  var seen = {}; tokens_().forEach(function (t) { if (!seen[t.pid] || (t.seen || '') > seen[t.pid]) seen[t.pid] = t.seen || t.at.slice(0, 10); });
  var cohorts = readRows_('COHORTS'), vis = {};
  cohorts.forEach(function (c) { if (seesCohort_(who, c)) vis[c.cohort_id] = 1; });
  return readRows_('PEOPLE').filter(function (r) { return r.status !== 'removed' && (r.role === 'participant' ? vis[r.cohort_id] : who.role !== 'tutor'); }).map(function (r) {
    return { person_code: r.person_code, name: r.name, role: r.role, cohort_id: r.cohort_id, status: r.status, joined: seen[r.person_code] ? 'Y' : '', seen: seen[r.person_code] || '' };
  });
}

// ---------- papers ----------
function paper_(b, who) {
  var rows = readRows_('PAPERS'), cur = b.paper_id ? rows.filter(function (r) { return r.paper_id === String(b.paper_id); })[0] : null;
  if (b.paper_id && !cur) return { ok: false, error: 'No such paper.' };
  var cohorts = readRows_('COHORTS'), c = cohorts.filter(function (r) { return r.cohort_id === String(cur ? cur.cohort_id : b.cohort_id); })[0];
  if (!c || !seesCohort_(who, c)) return { ok: false, code: 403, error: 'Choose a group that is assigned to you.' };
  if (cur && cur.status !== 'draft') {
    if (b.status === 'closed' && cur.status === 'published') { cur.status = 'closed'; writeRow_('PAPERS', cur._row, cur); return { ok: true, paper_id: cur.paper_id, status: cur.status }; }
    return { ok: false, error: 'A published paper cannot be changed. Make a new one.' };
  }
  var row = cur || { paper_id: nextCode_(rows, 'paper_id', 'X', 3), cohort_id: c.cohort_id, created_by: who.pid, created_at: nowStamp_(), status: 'draft' };
  row.title = String(b.title || '').trim().slice(0, 80);
  row.mode = b.mode === 'timed' ? 'timed' : 'set';
  row.setting = row.mode === 'timed' ? (b.setting === 'supervised' ? 'supervised' : 'own') : '';
  row.minutes = row.mode === 'timed' ? String(Math.round(Number(b.minutes) || 0)) : '';
  row.pass_mark = row.mode === 'timed' && String(b.pass_mark === undefined ? '' : b.pass_mark).trim() !== '' ? String(Math.round(Number(b.pass_mark))) : '';
  row.opens = String(b.opens || '').slice(0, 16); row.closes = String(b.closes || '').slice(0, 16);
  row.start_code = row.setting === 'supervised' ? String(b.start_code || '') : '';
  var ids = (Array.isArray(b.items) ? b.items : []).map(String), uniq = ids.filter(function (x, i) { return ids.indexOf(x) === i; });
  var items = current_(readRows_('ITEMS')), byId = {};
  items.forEach(function (r) { byId[r.item_id] = r; });
  if (row.title.length < 3) return { ok: false, error: 'Give the paper a title.' };
  if (!uniq.length || uniq.length > 300) return { ok: false, error: 'Choose between 1 and 300 items.' };
  var wrong = uniq.filter(function (x) { var r = byId[x]; return !r || r.status !== 'Live' || !inPool_(r, c); });
  if (wrong.length) return { ok: false, error: 'Not live in the pool of this group: ' + wrong.slice(0, 5).join(', ') + (wrong.length > 5 ? ' and ' + (wrong.length - 5) + ' more' : '') };
  row.items = uniq.join(',');
  var publish = b.status === 'published';
  if (row.mode === 'timed') {
    if (!(Number(row.minutes) >= 1 && Number(row.minutes) <= 600)) return { ok: false, error: 'Give the length in minutes.' };
    if (row.pass_mark !== '' && !(Number(row.pass_mark) >= 0 && Number(row.pass_mark) <= 100)) return { ok: false, error: 'The pass mark is a percentage from 0 to 100.' };
    if (publish) {
      if (!isFinite(pkMs_(row.opens))) return { ok: false, error: 'Give the date and time the paper opens.' };
      if (row.setting === 'own' && !(pkMs_(row.closes) > pkMs_(row.opens))) return { ok: false, error: 'Give a closing time after the opening time.' };
      if (row.setting === 'own' && pkMs_(row.closes) - pkMs_(row.opens) < Number(row.minutes) * 60000) return { ok: false, error: 'The window is shorter than the paper.' };
      if (row.setting === 'supervised') { row.closes = ''; if (!/^\d{6}$/.test(row.start_code)) return { ok: false, error: 'The start code is six digits.' }; if (!b.blob || String(b.blob).length < 50) return { ok: false, error: 'The locked copy of the paper is missing. Try again from the phone.' }; }
      if (paperCloseMs_(row) < now_()) return { ok: false, error: 'That time has already passed.' };
    }
  }
  var out = { ok: true, paper_id: row.paper_id };
  if (publish) {
    row.status = 'published';
    if (row.mode === 'timed') {
      // Reserved: hidden from practice until released after the paper.
      var patch = {}; uniq.forEach(function (x) { patch[byId[x]._row] = { status: 'Reserved' }; });
      patchCols_('ITEMS', patch);
      if (row.setting === 'supervised') {
        var sh = sheet_('PAPER_BLOBS'), old = readRows_('PAPER_BLOBS').filter(function (r) { return r.paper_id === row.paper_id; });
        old.sort(function (a, z) { return z._row - a._row; }).forEach(function (r) { sh.deleteRow(r._row); });
        var s = String(b.blob), chunks = [];
        for (var i = 0; i * 40000 < s.length; i++) chunks.push({ paper_id: row.paper_id, n: i, chunk: s.slice(i * 40000, (i + 1) * 40000) });
        append_('PAPER_BLOBS', chunks);
      }
      // Exposure: how many of this group already met each item in practice.
      var seen = {}; readRows_('RESPONSES').forEach(function (r) { if (r.cohort_id === c.cohort_id && uniq.indexOf(r.item_id) >= 0) (seen[r.item_id] = seen[r.item_id] || {})[r.person_code] = 1; });
      out.exposed = Object.keys(seen).map(function (k) { return { item_id: k, people: Object.keys(seen[k]).length }; });
    }
    bumpStamp_();
  }
  if (cur) writeRow_('PAPERS', cur._row, row); else append_('PAPERS', [row]);
  audit_([{ who: who.pid, role: who.role, action: publish ? 'paper published' : cur ? 'paper changed' : 'paper drafted', tab: 'PAPERS', id: row.paper_id, field: 'items', new: uniq.length }]);
  out.status = row.status;
  return out;
}
// After a timed paper has closed its items go back to Live, so they appear in practice.
function release_(b, who) {
  var p = readRows_('PAPERS').filter(function (r) { return r.paper_id === String(b.paper_id); })[0];
  if (!p || p.mode !== 'timed') return { ok: false, error: 'No such timed paper.' };
  var c = readRows_('COHORTS').filter(function (r) { return r.cohort_id === p.cohort_id; })[0];
  if (!c || !seesCohort_(who, c)) return { ok: false, code: 403, error: 'That group is not assigned to you.' };
  if (p.status === 'released') return { ok: true, dup: true };
  if (now_() <= paperCloseMs_(p) + setNum_(settings_(), 'grace_min') * 60000) return { ok: false, error: 'The paper has not closed yet.' };
  var ids = p.items.split(','), others = {};
  readRows_('PAPERS').forEach(function (q) { if (q.paper_id !== p.paper_id && q.mode === 'timed' && q.status === 'published') q.items.split(',').forEach(function (x) { others[x] = 1; }); });
  var patch = {}, n = 0;
  current_(readRows_('ITEMS')).forEach(function (r) { if (ids.indexOf(r.item_id) >= 0 && r.status === 'Reserved' && !others[r.item_id]) { patch[r._row] = { status: 'Live' }; n++; } });
  patchCols_('ITEMS', patch);
  p.status = 'released'; p.released_at = nowStamp_(); writeRow_('PAPERS', p._row, p);
  bumpStamp_();
  audit_([{ who: who.pid, role: who.role, action: 'paper items released to practice', tab: 'PAPERS', id: p.paper_id, field: 'items', new: n }]);
  return { ok: true, released: n };
}
function chReply_(b, who) {
  var r = readRows_('CHALLENGES').filter(function (x) { return x.ch_id === String(b.ch_id); })[0];
  if (!r) return { ok: false, error: 'No such flag.' };
  if (['upheld', 'rejected', 'open'].indexOf(String(b.status)) < 0) return { ok: false, error: 'Choose upheld or not upheld.' };
  r.status = String(b.status); r.reply = String(b.reply || '').trim().slice(0, 600); r.replied_by = who.pid;
  writeRow_('CHALLENGES', r._row, r);
  audit_([{ who: who.pid, role: who.role, action: 'answered a flag', tab: 'CHALLENGES', id: r.ch_id, field: 'status', new: r.status }]);
  return { ok: true };
}
function setting_(b, who) {
  var k = String(b.key || ''), v = String(b.value === undefined ? '' : b.value).trim().slice(0, 4000);
  if (DEFAULTS[k] === undefined) return { ok: false, error: 'Unknown setting.' };
  if (typeof DEFAULTS[k] === 'number' && !(isFinite(Number(v)) && v !== '' && Number(v) >= 0 && Number(v) <= 1000)) return { ok: false, error: 'Type a number.' };
  if (k === 'research_on') { if (v !== 'Y' && v !== 'N') return { ok: false, error: 'Y or N.' }; if (v === 'Y' && !String(settings_().consent_text || '').trim()) return { ok: false, error: 'Enter the approved consent wording first.' }; }
  var rows = readRows_('SETTINGS'), r = rows.filter(function (x) { return x.key === k; })[0], old = r ? r.value : '';
  if (r) { r.value = v; writeRow_('SETTINGS', r._row, r); } else append_('SETTINGS', [{ key: k, value: v, note: SET_NOTES[k] || '' }]);
  audit_([{ who: who.pid, role: who.role, action: 'setting changed', tab: 'SETTINGS', id: k, field: 'value', old: k === 'consent_text' ? '(text)' : old, new: k === 'consent_text' ? '(text)' : v }]);
  return { ok: true };
}
function withdraw_(b, who) {
  var r = readRows_('FB_RUNS').filter(function (x) { return x.run_id === String(b.run_id); })[0];
  if (!r) return { ok: false, error: 'No such feedback run.' };
  r.withdrawn = b.on === false ? '' : 'Y'; writeRow_('FB_RUNS', r._row, r);
  audit_([{ who: who.pid, role: who.role, action: r.withdrawn ? 'feedback run withdrawn' : 'feedback run shown again', tab: 'FB_RUNS', id: r.run_id }]);
  return { ok: true, withdrawn: r.withdrawn };
}

// ---------- item analysis and group summaries (worked out here so writers and heads never receive single answers) ----------
function stats_(who, person) {
  var set = settings_(), items = readRows_('ITEMS'), cur = current_(items), keys = {}, meta = {}, resp = readRows_('RESPONSES');
  items.forEach(function (r) { keys[r.item_id + '|' + r.version] = r.key; });
  cur.forEach(function (r) { meta[r.item_id] = { g: r.topic_group, pool: r.pool, bloom: r.bloom }; });
  var out = { ok: true };
  if (who.role !== 'tutor') {
    var st = itemStats_(resp, keys, set), nCh = {};
    readRows_('CHALLENGES').forEach(function (c) { if (c.status !== 'rejected') nCh[c.item_id + '|' + c.version] = (nCh[c.item_id + '|' + c.version] || 0) + 1; });
    var mine = null;
    if (who.role === 'writer') { mine = {}; items.forEach(function (r) { if (r.writer === who.pid) mine[r.item_id] = 1; }); }
    out.items = Object.keys(st).filter(function (k) { return !mine || mine[st[k].item_id]; }).map(function (k) {
      var o = st[k]; o.challenges = nCh[k] || 0;
      if (o.challenges >= 2) o.exam.flags.push(o.challenges + ' participants flagged this item');
      return o;
    });
  }
  if (who.role !== 'writer') {
    var atts = readRows_('ATTEMPTS'); out.cohorts = {};
    readRows_('COHORTS').forEach(function (c) {
      if (!seesCohort_(who, c)) return;
      out.cohorts[c.cohort_id] = cohortSummary_(resp.filter(function (r) { return r.cohort_id === c.cohort_id; }), meta, atts.filter(function (a) { return a.cohort_id === c.cohort_id; }), set);
    });
  }
  return out;
}
function quietAudit_(rows) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try { audit_(rows); } catch (e) { } finally { lock.releaseLock(); }
}
// What the others did, newest first, for the last 180 days (owner only). People appear by code; the phone adds the names it already holds.
function activity_(who) {
  var out = [], rows = readRows_('AUDIT'), since = stampPk_(now_() - 180 * 864e5);
  for (var i = rows.length - 1; i >= 0 && out.length < 400; i--) {
    var r = rows[i];
    if (r.who === who.pid || r.role === 'owner' || r.time < since) continue;
    var o = {};
    ['time', 'who', 'role', 'action', 'tab', 'id', 'field', 'old', 'new', 'reason'].forEach(function (k) { var v = r[k]; o[k] = v.length > 160 ? v.slice(0, 157) + '...' : v; });
    out.push(o);
  }
  return out;
}
// Everything for the owner's Excel file. The research copy carries random codes in place of person codes and only people who agreed.
function exportAll_(b, who) {
  var research = !!b.research, set = settings_();
  if (research && String(set.research_on) !== 'Y') return { ok: false, error: 'The research export is switched off until ethics approval.' };
  var people = readRows_('PEOPLE'), map = null;
  if (research) { map = {}; people.forEach(function (p) { if (p.role === 'participant' && /^Y/.test(p.consent)) map[p.person_code] = 'R' + sha_(p.person_code + (PropertiesService.getScriptProperties().getProperty('PI_EMAIL') || '') + 'research').slice(0, 8).toUpperCase(); }); }
  function rows(tab, drop) {
    return readRows_(tab).filter(function (r) { return !map || r.person_code === undefined || map[r.person_code]; }).map(function (r) {
      delete r._row; (drop || []).forEach(function (k) { delete r[k]; });
      if (map && r.person_code !== undefined) r.person_code = map[r.person_code];
      return r;
    });
  }
  var T = { ITEMS: current_(readRows_('ITEMS')).map(function (r) { delete r._row; delete r.text_sha; return r; }), ATTEMPTS: rows('ATTEMPTS'), RESPONSES: rows('RESPONSES'), COHORTS: rows('COHORTS', ['join_code', 'tutor', 'examiners', 'created_by']), PAPERS: rows('PAPERS', ['start_code', 'created_by']) };
  if (!research) { T.FB_PERSON = rows('FB_PERSON'); T.FB_COHORT = rows('FB_COHORT'); T.FB_ITEM = rows('FB_ITEM'); T.CHALLENGES = rows('CHALLENGES', ['req_id']); }
  audit_([{ who: who.pid, role: who.role, action: research ? 'research export' : 'export', tab: 'APP', id: 'xlsx' }]);
  return { ok: true, heads: TABS, tables: T, research: research };
}

// ---------- updates that install themselves (asked for by the owner's phone; no visit to the Sheet) ----------
var SELF_URL = 'https://raw.githubusercontent.com/IR1S-VIR1S/mcq-bench/main/script/MCQBench.gs';
function verNum_(v) { var p = String(v || '').split('.'); return (+p[0] || 0) * 1e6 + (+p[1] || 0) * 1e3 + (+p[2] || 0); }
function selfCode_(p, prefix) { var n = +p.getProperty(prefix + 'N') || 0, s = ''; for (var i = 0; i < n; i++) s += p.getProperty(prefix + i) || ''; return s; }
function selfWrite_(p, prefix, code) {
  var old = +p.getProperty(prefix + 'N') || 0, n = Math.ceil(code.length / 7000), all = {};
  for (var i = 0; i < n; i++) all[prefix + i] = code.slice(i * 7000, (i + 1) * 7000);
  all[prefix + 'N'] = String(n);
  p.setProperties(all);
  for (var j = n; j < old; j++) p.deleteProperty(prefix + j);
}
function selfUpdate_(by) {
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('CODE_N')) return { ok: false, error: 'This workbook was not installed with the Loader, so it cannot update itself.' };
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { ok: false, error: 'The workbook is busy. It will try again.' };
  try {
    var r;
    try { r = UrlFetchApp.fetch(SELF_URL + '?t=' + Date.now(), { muteHttpExceptions: true, followRedirects: true }); }
    catch (e) { return { ok: false, error: 'Could not reach GitHub. Nothing was changed.' }; }
    if (r.getResponseCode() !== 200) return { ok: false, error: 'Could not download the update (GitHub said ' + r.getResponseCode() + '). Nothing was changed.' };
    var code = r.getContentText(), x;
    try {
      x = (new Function(code + '\n;return exports_();'))();
      ['setup', 'setupQuiet', 'doPost', 'doGet', 'MENU_ITEMS', 'VERSION'].forEach(function (k) { if (!x || x[k] === undefined) throw new Error('missing ' + k); });
    } catch (e2) { return { ok: false, error: 'The published update is broken (' + e2.message + '). Nothing was changed.' }; }
    if (verNum_(x.VERSION) <= verNum_(VERSION)) return { ok: true, updated: false, version: VERSION };
    var cur = selfCode_(p, 'CODE_'), curSha = p.getProperty('CODE_SHA') || '', curMenu = p.getProperty('MENU_JSON') || '[]';
    selfWrite_(p, 'CODE_', code);
    p.setProperty('CODE_SHA', sha_(code).slice(0, 8));
    p.setProperty('MENU_JSON', JSON.stringify(x.MENU_ITEMS.map(function (m) { return m.label; })));
    try { x.setupQuiet(); }
    catch (e3) {
      selfWrite_(p, 'CODE_', cur); p.setProperty('CODE_SHA', curSha); p.setProperty('MENU_JSON', curMenu);
      log_('self update failed, put back', VERSION + ' kept: ' + String(e3 && e3.message || e3));
      return { ok: false, error: 'The update could not be set up, so version ' + VERSION + ' was kept.' };
    }
    selfWrite_(p, 'PREV_', cur); p.setProperty('PREV_SHA', curSha);
    log_('updated itself', VERSION + ' to ' + x.VERSION + (by ? ', asked by ' + by : ''));
    return { ok: true, updated: true, from: VERSION, version: x.VERSION };
  } finally { lock.releaseLock(); }
}

function exports_() {
  return {
    VERSION: VERSION, RELEASE_NOTE: RELEASE_NOTE, MENU_ITEMS: MENU_ITEMS,
    setup: setup, setupQuiet: setupCore_, inviteOwner: inviteOwner, whoHasAccess: whoHasAccess,
    changeWebAppUrl: changeWebAppUrl, checkAudit: checkAudit, doPost: doPost, doGet: doGet
  };
}
