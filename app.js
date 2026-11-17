/* Pulmonology MCQ Bench: offline phone app. Rules and sums come from logic.js (generated from the workbook script). */
'use strict';
var BUILD_ID = '94b61550';
var STORE = 'mcqb.v1';
var BIO = 'mcqb.bio';
var IDLE_MS = 5 * 60 * 1000;
var APP = 'MCQ Bench';
var T = { screen: 'boot', key: null, S: null, syncing: false, form: null, sheet: null, idleAt: Date.now(), fold: {}, slide: false };

// ---------- helpers ----------
function el(tag, attrs) {
  var e = document.createElement(tag), kids = Array.prototype.slice.call(arguments, 2);
  if (attrs) Object.keys(attrs).forEach(function (k) {
    var v = attrs[k];
    if (v === null || v === undefined || v === false) return;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value') e.value = v;
    else if (k === 'checked') e.checked = !!v;
    else e.setAttribute(k, v === true ? '' : v);
  });
  kids.forEach(function add(k) {
    if (k === null || k === undefined || k === false) return;
    if (Array.isArray(k)) return k.forEach(add);
    e.appendChild(typeof k === 'string' || typeof k === 'number' ? document.createTextNode(String(k)) : k);
  });
  return e;
}
var ICONS = {
  home: 'M3 11l9-8 9 8|M5 10v10h14V10',
  ledger: 'M4 4h16v16H4z|M8 8h8|M8 12h8|M8 16h5',
  summary: 'M4 20V10|M10 20V4|M16 20v-7|M22 20H2',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  plus: 'M12 5v14|M5 12h14',
  sync: 'M21 12a9 9 0 1 1-3-6.7L21 8|M21 3v5h-5',
  income: 'M12 5v14|M19 12l-7 7-7-7',
  out: 'M12 19V5|M5 12l7-7 7 7',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M23 21v-2a4 4 0 0 0-3-3.9|M16 3.1a4 4 0 0 1 0 7.8',
  building: 'M4 21V5l8-3v19|M12 8l8 3v10|M8 9v.01|M8 13v.01|M8 17v.01|M16 14v.01|M16 18v.01|M2 21h20',
  fund: 'M12 2v20|M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  cash: 'M2 6h20v12H2z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M6 12h.01|M18 12h.01',
  alert: 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z|M12 9v4|M12 17h.01',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18|M6 6l12 12',
  back: 'M15 18l-6-6 6-6',
  next: 'M9 18l6-6-6-6',
  wallet: 'M3 7a2 2 0 0 1 2-2h13v4|M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z|M16 14h.01',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20|M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z|M9 7h7|M9 11h7',
  down: 'M6 9l6 6 6-6',
  trash: 'M3 6h18|M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6|M10 11v6|M14 11v6|M9 6V4h6v2',
  edit: 'M12 20h9|M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z|M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6|M8 13h8|M8 17h8',
  sheet: 'M3 3h18v18H3z|M3 9h18|M3 15h18|M9 3v18',
  lock: 'M5 11h14v10H5z|M8 11V7a4 4 0 0 1 8 0v4',
  unlockic: 'M5 11h14v10H5z|M8 11V7a4 4 0 0 1 7.5-2',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 6v6l4 2',
  cal: 'M3 4h18v18H3z|M16 2v4|M8 2v4|M3 10h18',
  faceid: 'M7 3H5a2 2 0 0 0-2 2v2|M17 3h2a2 2 0 0 1 2 2v2|M7 21H5a2 2 0 0 1-2-2v-2|M17 21h2a2 2 0 0 0 2-2v-2|M9 9v1|M15 9v1|M12 9v4h-1|M9 16c1.7 1.3 4.3 1.3 6 0',
  update: 'M12 3v12|M7 10l5 5 5-5|M5 21h14',
  copy: 'M9 9h11v11H9z|M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8|M16 6l-4-4-4 4|M12 2v13',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.3-4.3',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  list: 'M8 6h13|M8 12h13|M8 18h13|M3 6h.01|M3 12h.01|M3 18h.01',
  wait: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 8v4|M12 16h.01',
  flag: 'M4 22V4|M4 4h13l-2 4 2 4H4',
  play: 'M6 4l14 8-14 8z',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  grid: 'M3 3h7v7H3z|M14 3h7v7h-7z|M3 14h7v7H3z|M14 14h7v7h-7z',
  msg: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'
};
function svg(name) {
  var ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
  (ICONS[name] || '').split('|').forEach(function (d) { var p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); s.appendChild(p); });
  return s;
}
function btn(cls, icon, label, onclick, id) {
  return el('button', { class: 'btn ' + (cls || ''), id: id, type: 'button', onclick: onclick }, icon ? svg(icon) : null, el('span', { text: label }));
}
function toast(t, tick) {
  var old = document.querySelector('.toast'); if (old) old.remove();
  var d = el('div', { class: 'toast', role: 'status' }, tick ? svg('check') : null, t);
  if (tick) d.firstChild.setAttribute('class', 'ic');
  document.body.appendChild(d);
  setTimeout(function () { d.remove(); }, 2800);
}
function todayPk() {
  var f = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' });
  var p = {}; f.formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
  return p.year + '-' + p.month + '-' + p.day;
}
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  var a = crypto.getRandomValues(new Uint8Array(16));
  return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
}
function fmtDate(s) { return dateTxt_(s); }
function nowMs() { return Date.now() + ((T.S && T.S.skew) || 0); }
function D() { return T.S.data || {}; }
function role() { return T.S ? T.S.role : ''; }
function isP() { return role() === 'participant'; }
function canManage() { return role() === 'owner' || role() === 'examiner'; }
function isOwner() { return role() === 'owner'; }
function setV(k) { return setNum_(D().set, k); }
function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
function mins(ms) { var m = Math.max(0, Math.round(ms / 60000)); return m >= 2880 ? Math.round(m / 1440) + ' days' : m >= 120 ? Math.round(m / 60) + ' hours' : m + ' min'; }
function clock(ms) { var s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + pad2_(m) : m) + ':' + pad2_(s % 60); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function chipEl(cls, icon, text) { return el('span', { class: 'chip ' + cls }, icon ? svg(icon) : null, text); }
function stateChip(st) { return st === 'reported' ? chipEl('ok', 'check', 'Reported') : st === 'provisional' ? chipEl('due', 'wait', 'Provisional') : chipEl('', 'wait', 'Too few to judge'); }

// ---------- encrypted storage ----------
function b64(buf) { var s = '', a = new Uint8Array(buf); for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }
function unb64(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
function deriveKey(pin, salt) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']).then(function (base) {
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 150000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  });
}
function stored() { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } }
function saveState() {
  if (T.preview) return Promise.resolve();
  if (!T.key || !T.S) return Promise.resolve();
  var iv = crypto.getRandomValues(new Uint8Array(12)), st = stored();
  return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, T.key, new TextEncoder().encode(JSON.stringify(T.S))).then(function (ct) {
    localStorage.setItem(STORE, JSON.stringify({ v: 1, salt: st.salt, n: st.n || 0, iv: b64(iv), ct: b64(ct) }));
  });
}
function unlock(pin) {
  var st = stored();
  return deriveKey(pin, unb64(st.salt)).then(function (key) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(st.iv) }, key, unb64(st.ct)).then(function (pt) {
      T.key = key; T.S = JSON.parse(new TextDecoder().decode(pt));
      T.S.uploads = T.S.uploads || []; T.S.outbox = T.S.outbox || [];
    });
  });
}
function lock() {
  T.preview = null;
  T.bioTried = false;
  T.key = null; T.S = null; T.form = null; T.sheet = null; T.thumbs = {};
  T.screen = stored() ? 'unlock' : 'join'; render();
}
function resetPhone() { localStorage.removeItem(STORE); localStorage.removeItem(BIO); lock(); return Promise.resolve(); }

// ---------- server ----------
function api(body) {
  if (T.preview) return Promise.reject({ error: 'Viewing as someone else: nothing is sent.' });
  T.apiCalls = (T.apiCalls || 0) + 1;
  var ctl = new AbortController(), timer = setTimeout(function () { ctl.abort(); }, 60000);
  return fetch(T.S ? T.S.api : T.joinApi, { method: 'POST', body: JSON.stringify(body), redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ctl.signal })
    .then(function (r) { return r.json(); }).finally(function () { clearTimeout(timer); });
}
// One staff action, online: do it, say what went wrong in plain words, then refresh.
function call(op, body, okMsg) {
  if (!navigator.onLine) { toast('No signal. This needs the internet.'); return Promise.resolve(null); }
  T.busy = true;
  return api(Object.assign({ op: op, token: T.S.token }, body || {})).then(function (r) {
    T.busy = false;
    if (!r.ok) { toast(r.error === 'unknown operation' ? 'The workbook script is older than this app.' : r.error || 'Not done.'); return null; }
    if (okMsg) toast(okMsg, true);
    return sync(true).then(function () { return r; });
  }).catch(function (e) { T.busy = false; toast((e && e.error) || 'Could not reach the workbook.'); return null; });
}
function sync(quiet) {
  if (T.preview) { if (!quiet) toast('Viewing as ' + T.preview.who + ': nothing is synced.'); return Promise.resolve(); }
  if (T.syncing) { T.syncAgain = true; return T.syncP || Promise.resolve(); }
  if (!T.S || !T.S.token) return Promise.resolve();
  if (!navigator.onLine) { if (!quiet) toast('No signal. Saved on this phone.'); softRender(); return Promise.resolve(); }
  T.syncing = true; renderTop();
  var S = T.S, items = S.outbox.filter(function (x) { return !x.error; }).map(function (x) { return JSON.parse(JSON.stringify(x)); }), done = {};
  var chain = items.reduce(function (p, it) {
    return p.then(function () {
      var body = it.op === 'attempt' ? { op: 'attempt', token: S.token, a: it.a } : Object.assign({ token: S.token }, it);
      return api(body).then(function (r) {
        var o = S.outbox.filter(function (x) { return x.req_id === it.req_id; })[0];
        if (!o) return;
        if (r.ok) { if (JSON.stringify(o) === JSON.stringify(it)) done[it.req_id] = 1; }
        else if (r.code === 401 || r.code === 409) throw r;
        else o.error = r.error || 'Refused.';
      });
    });
  }, Promise.resolve()).then(function () {
    var have = {}; Object.keys(S.pc || {}).forEach(function (k) { have[k] = S.pc[k].t; });
    return api({ op: 'pull', token: S.token, stamp: S.items ? S.stamp : '', have: have });
  }).then(function (r) {
    if (!r.ok) throw r;
    if (T.S !== S) return;
    var d = r.data;
    S.skew = d.now - Date.now();
    if (d.items) { S.items = d.items; S.stamp = d.stamp; }
    delete d.items;
    S.pc = S.pc || {};
    (d.papers || []).forEach(function (p) {
      if (p.keyed) S.pc[p.paper_id] = { t: 'k', items: p.keyed }; else if (p.questions) S.pc[p.paper_id] = { t: 'q', items: p.questions }; else if (p.blob) S.pc[p.paper_id] = { t: 'b', blob: p.blob };
      delete p.keyed; delete p.questions; delete p.blob;
    });
    S.data = d; S.role = d.role; S.pid = d.pid; S.lastSync = Date.now(); S.syncErr = '';
    S.outbox = S.outbox.filter(function (x) { return !done[x.req_id]; });
    T.stats = null;
    return saveState().then(function () { return autoScript(S); });
  }).catch(function (e) {
    if (T.S !== S) return;
    S.outbox = S.outbox.filter(function (x) { return !done[x.req_id]; });
    S.syncErr = (e && e.error) || 'Could not reach the workbook. Will try again.';
    if (e && e.code === 401) S.syncErr = e.error || 'This phone no longer has access. Ask for a new invitation.';
    return saveState();
  }).finally(function () {
    T.syncing = false; T.syncP = null;
    if (T.S === S) softRender(); else renderTop();
    if (T.syncAgain && T.S === S) { T.syncAgain = false; return sync(true); }
    T.syncAgain = false;
  });
  T.syncP = chain;
  return chain;
}
// The workbook script updates itself when this app is newer than it (owner's phone asks, at most once in 10 minutes).
function verNum(v) { var p = String(v || '').split('.'); return (+p[0] || 0) * 1e6 + (+p[1] || 0) * 1e3 + (+p[2] || 0); }
function autoScript(S) {
  if (typeof NEED_SCRIPT === 'undefined' || !S.data || S.role !== 'owner' || T.preview) return null;
  if (verNum(S.data.version) >= verNum(NEED_SCRIPT)) { if (S.updNote) { S.updNote = ''; return saveState(); } return null; }
  if (S.updTry && S.updTry.need === NEED_SCRIPT && Date.now() - S.updTry.at < 10 * 60 * 1000) return null;
  S.updTry = { need: NEED_SCRIPT, at: Date.now() };
  return api({ op: 'selfupdate', token: S.token }).then(function (r) {
    if (r.ok && r.updated) { S.updNote = ''; T.syncAgain = true; toast('Workbook updated to version ' + r.version + '.', true); }
    else if (!r.ok) S.updNote = r.error || 'The workbook could not update itself. It will try again.';
    else S.updNote = 'The workbook update (version ' + NEED_SCRIPT + ') is on its way. It installs by itself within a few minutes.';
    return saveState();
  }).catch(function () { });
}
function queue(item) {
  var S = T.S;
  // One waiting entry per attempt: a later save replaces the earlier one (the workbook ignores answers it already has).
  if (item.op === 'attempt') S.outbox = S.outbox.filter(function (x) { return !(x.op === 'attempt' && x.a.attempt_id === item.a.attempt_id); });
  S.outbox.push(item);
  return saveState();
}

// ---------- rendering ----------
// Background stays still while a pop-up, panel or photo is open (body pinned in place; works on iPhone too).
var SL = { on: false, y: 0 };
function updateScrollLock() {
  var want = !!(document.getElementById('helppop') || document.querySelector('.sheet-bg') || document.querySelector('.viewer'));
  var b = document.body;
  if (want && !SL.on) {
    SL.on = true; SL.y = window.scrollY;
    b.style.position = 'fixed'; b.style.top = (-SL.y) + 'px'; b.style.left = '0'; b.style.right = '0'; b.style.width = '100%'; b.classList.add('locked');
  } else if (!want && SL.on) {
    SL.on = false;
    b.style.position = ''; b.style.top = ''; b.style.left = ''; b.style.right = ''; b.style.width = ''; b.classList.remove('locked');
    window.scrollTo(0, SL.y);
  }
}
var BARS = {
  participant: [['home', 'home', 'Home'], ['practice', 'target', 'Practice'], ['results', 'summary', 'Results'], ['settings', 'gear', 'Settings']],
  owner: [['home', 'home', 'Home'], ['items', 'ledger', 'Items'], ['papers', 'doc', 'Papers'], ['analysis', 'summary', 'Analysis'], ['settings', 'gear', 'Settings']],
  head: [['home', 'home', 'Home'], ['analysis', 'summary', 'Analysis'], ['settings', 'gear', 'Settings']],
  tutor: [['home', 'home', 'Home'], ['analysis', 'summary', 'Analysis'], ['settings', 'gear', 'Settings']],
  writer: [['home', 'home', 'Home'], ['items', 'ledger', 'Items'], ['analysis', 'summary', 'Analysis'], ['settings', 'gear', 'Settings']]
};
BARS.examiner = BARS.owner;
function barItems() { return D().pending ? [['home', 'home', 'Home'], ['settings', 'gear', 'Settings']] : (BARS[role()] || BARS.participant); }
var FORMY = ['quiz', 'exam', 'examintro', 'paperform', 'import', 'setpin', 'join', 'unlock', 'ask'];
function render() {
  var app = document.getElementById('app');
  var bar = T.S && T.S.data && barItems().some(function (b) { return b[0] === T.screen; });
  app.className = bar ? '' : 'nobar';
  var fn = SCREENS[T.screen] || SCREENS.boot, main = el('main', { class: T.slide ? 'slide' : '' }, T.preview ? previewBanner() : null, fn());
  T.slide = false;
  app.replaceChildren(main);
  document.querySelectorAll('.bar,.fab,.sheet-bg').forEach(function (x) { x.remove(); });
  if (bar) document.body.appendChild(barEl());
  var fab = bar && FAB[T.screen] && FAB[T.screen]();
  if (fab) document.body.appendChild(el('button', { class: 'fab', id: 'fab', type: 'button', onclick: fab[2] }, svg(fab[0]), fab[1]));
  if (T.sheet) document.body.appendChild(T.sheet());
  updateScrollLock();
  if (T.reloadPending) setTimeout(function () { if (T.reloadPending) applyUpdate(); }, 400);
}
var FAB = {
  items: function () { return canManage() && !T.preview ? ['plus', 'Import', function () { T.imp = null; go('import'); }] : null; },
  papers: function () { return canManage() && !T.preview ? ['plus', 'New paper', function () { openPaperForm(null); }] : null; }
};
function softRender() {
  var ae = document.activeElement, typing = ae && ae.matches && ae.matches('#app input, #app textarea, .sheet input, .sheet textarea');
  if (FORMY.indexOf(T.screen) >= 0 || T.sheet || typing) { renderTop(); return; }
  var y = window.scrollY; render(); window.scrollTo(0, y);
}
function renderTop() { var s = document.getElementById('syncpill'); if (s && T.S) s.replaceWith(syncPill()); }
function go(screen) { if (screen !== 'settings') T.setGroup = null; T.screen = screen; T.sheet = null; T.slide = true; render(); window.scrollTo(0, 0); }
function barEl() {
  return el('nav', { class: 'bar' }, barItems().map(function (b) {
    var n = b[0] === 'settings' && T.S.outbox.some(function (o) { return o.error; }) ? el('span', { class: 'dot' }) : null;
    return el('button', { class: T.screen === b[0] ? 'on' : '', type: 'button', id: 'bar-' + b[0], 'aria-label': b[2], onclick: function () { T.setGroup = null; go(b[0]); } }, svg(b[1]), b[2], n);
  }));
}
function syncPill() {
  var S = T.S, n = S.outbox.filter(function (o) { return !o.error; }).length, t;
  if (T.syncing) t = 'Syncing';
  else if (!navigator.onLine) t = n ? 'Offline, ' + n + ' waiting' : 'Offline';
  else if (S.syncErr) t = 'Not synced';
  else if (n) t = n + ' waiting';
  else t = S.lastSync ? new Date(S.lastSync).toTimeString().slice(0, 5) : 'Not synced';
  // While syncing, the arrow turns the way it points (clockwise). Always on, even with reduced motion (owner's rule).
  var ic = svg('sync'); if (T.syncing) ic.setAttribute('class', 'spin');
  return el('button', { class: 'pill' + (T.syncing ? ' busy' : ''), id: 'syncpill', type: 'button', 'aria-label': T.syncing ? 'Syncing' : 'Sync now', onclick: function () { sync(); } }, ic, t);
}
function topBar(title) {
  return el('div', { class: 'top' }, el('div', { class: 'brand' }, el('img', { src: 'icon-192.png', alt: '', class: 'logo' }), el('div', { class: 'title', text: title })), el('div', { class: 'pills' }, syncPill()));
}
function backBar(title, to, id) {
  return el('div', { class: 'top' },
    el('button', { class: 'back', type: 'button', id: id || 'back', onclick: typeof to === 'function' ? to : function () { go(to || 'home'); } }, svg('back'), 'Back'),
    el('div', { class: 'title small', text: title }), el('span'));
}
function chips(list, cur, onPick, id, labelFn) {
  return el('div', { class: 'chips', id: id }, list.map(function (x) {
    return el('button', { class: cur === x ? 'on' : '', type: 'button', 'data-v': x, onclick: function (e) {
      onPick(x); e.currentTarget.parentNode.querySelectorAll('button').forEach(function (b) { b.className = b.getAttribute('data-v') === x ? 'on' : ''; });
    } }, labelFn ? labelFn(x) : x);
  }));
}
function sheetOpen(build) { T.sheet = build; render(); }
function sheetClose() { T.sheet = null; render(); }
function sheetWrap(label, kids) {
  return el('div', { class: 'sheet-bg', onclick: function (e) { if (e.target === e.currentTarget) sheetClose(); } },
    el('div', { class: 'sheet', role: 'dialog', 'aria-label': label }, kids));
}
function field(label, input, help) { return el('div', { class: 'fld' }, el('label', { class: 'f', for: input.id }, label, help ? qm(help) : null), input); }
function inp(id, value, attrs) { return el('input', Object.assign({ id: id, type: 'text', value: value === undefined || value === null ? '' : String(value), autocomplete: 'off' }, attrs || {})); }
function h2(icon, text, help, count, cls) { return el('h2', null, svg(icon), text, help ? qm(help) : null, count !== undefined ? el('span', { class: 'schip ' + (cls || ''), text: String(count) }) : null); }
// A long list is chosen in the app's own panel, never the phone's drop-down.
function pickSheet(title, list, picked, multi, done, labelFn) {
  var sel = {}; [].concat(picked || []).forEach(function (x) { sel[x] = 1; });
  sheetOpen(function () {
    return sheetWrap(title, [el('h2', { text: title }),
      el('div', { class: 'card list' }, list.map(function (x) {
        return el('button', { class: 'row', type: 'button', 'data-v': x, onclick: function (e) {
          if (!multi) { T.sheet = null; done(x); return; }
          if (sel[x]) delete sel[x]; else sel[x] = 1;
          var c = e.currentTarget.querySelector('.tick'); c.className = 'tick' + (sel[x] ? ' on' : '');
        } }, el('div', { class: 'grow', text: labelFn ? labelFn(x) : x }), el('span', { class: 'tick' + (sel[x] ? ' on' : '') }, svg('check')));
      })),
      multi ? btn('primary wide', 'check', 'Done', function () { T.sheet = null; done(list.filter(function (x) { return sel[x]; })); }, 'pickdone') : btn('wide', 'x', 'Close', sheetClose)]);
  });
}
function askSheet(title, text, yesLabel, yes, danger) {
  sheetOpen(function () {
    return sheetWrap(title, [el('h2', { text: title }), el('p', { text: text }),
      el('div', { class: 'actions2' }, btn('', 'x', 'Cancel', sheetClose, 'askno'), btn(danger ? 'danger' : 'primary', 'check', yesLabel, function () { T.sheet = null; render(); yes(); }, 'askyes'))]);
  });
}
function shareFile(blob, name) {
  var file = new File([blob], name, { type: blob.type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file] }).catch(function () { }); return; }
  var url = URL.createObjectURL(blob), a = el('a', { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
}
function shareText(text, id) {
  return el('div', { class: 'actions3', id: id },
    btn('primary', 'msg', 'WhatsApp', function () { window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank'); }, 'sh-wa'),
    btn('', 'share', 'Share', function () { if (navigator.share) navigator.share({ text: text }).catch(function () { }); else toast('Use Copy instead.'); }, 'sh-share'),
    btn('', 'copy', 'Copy', function () { navigator.clipboard.writeText(text).then(function () { toast('Copied.', true); }, function () { toast('Could not copy.'); }); }, 'sh-copy'));
}

var SCREENS = {};
SCREENS.boot = function () { return el('p', { class: 'muted', text: 'Loading' }); };

// ---------- joining ----------
function isIos() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function isStandalone() { return !!navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches); }
// Two kinds of invitation: MCQB1 (one named person, a staff role) and MCQBC1 (a cohort join link for participants).
function parseInvite(v) {
  var m = /(MCQBC?1)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9]+)/.exec(String(v || ''));
  if (!m) return null;
  var url = '';
  try { url = atob(m[2].replace(/-/g, '+').replace(/_/g, '/')); } catch (e) { }
  return /^https?:\/\//.test(url) ? { api: url, code: m[3], line: m[0], cohort: m[1] === 'MCQBC1' } : null;
}
SCREENS.join = function () {
  var hashInv = parseInvite(decodeURIComponent(location.hash || '')), ta, err = el('div', { class: 'err', id: 'joinerr' });
  function connect(inv) {
    inv = inv || parseInvite(ta.value);
    if (!inv) { err.textContent = 'That does not look like an invitation. Copy the whole line that starts with MCQB.'; return; }
    if (/\/dev$/.test(inv.api)) { err.textContent = 'This invitation points to the test address (ending /dev). Ask for a new one.'; return; }
    T.joinApi = inv.api;
    if (inv.cohort) { T.joinInv = inv; try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { } go('ask'); return; }
    err.textContent = 'Connecting';
    api({ op: 'join', code: inv.code }).then(function (r) {
      if (!r.ok) { err.textContent = r.error || 'Could not join.'; return; }
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
      T.pending = { api: inv.api, token: r.token, role: r.role, pid: r.pid }; go('setpin');
    }).catch(function () {
      err.textContent = navigator.onLine ? 'The workbook did not answer. Tell your examiner.' : 'No internet on this phone. Connect and try again.';
    });
  }
  var head = [el('img', { src: 'logo-320.png', alt: 'Pulmonology MCQ Bench', class: 'biglogo' }), el('h1', { text: CFG.APP_NAME })];
  if (hashInv && isIos() && !isStandalone() && !T.joinHere) {
    return el('div', null, head,
      el('p', { text: 'Install the app first, then join from it.' }),
      el('div', { class: 'card' },
        el('div', { class: 'row' }, el('b', { text: '1' }), el('div', { class: 'grow', text: 'Tap Copy invitation below.' })),
        el('div', { class: 'row' }, el('b', { text: '2' }), el('div', { class: 'grow', text: 'Tap the Share button in Safari, then Add to Home Screen.' })),
        el('div', { class: 'row' }, el('b', { text: '3' }), el('div', { class: 'grow', text: 'Open MCQ Bench from the Home Screen and tap Paste invitation.' }))),
      btn('primary wide', 'copy', 'Copy invitation', function () {
        navigator.clipboard.writeText(hashInv.line).then(function () { toast('Copied. Now Share > Add to Home Screen.'); }, function () { toast('Could not copy. Press and hold the line below.'); });
      }, 'copyinv'),
      el('p', { class: 'hint', text: hashInv.line }),
      el('button', { class: 'linkbtn', type: 'button', id: 'joinhere', onclick: function () { T.joinHere = true; render(); } }, 'Use it here in Safari instead'));
  }
  if (hashInv) setTimeout(function () { if (T.screen === 'join' && !T.joinTried) { T.joinTried = true; connect(hashInv); } }, 0);
  return el('div', null, head,
    el('p', { text: 'Join with the invitation or join link sent to you.' }),
    el('label', { class: 'f', for: 'code', text: 'Invitation' }),
    ta = el('textarea', { id: 'code', placeholder: 'MCQB', autocapitalize: 'off', autocomplete: 'off', spellcheck: 'false' }, hashInv ? hashInv.line : ''),
    btn('wide', 'copy', 'Paste invitation', function () {
      if (navigator.clipboard && navigator.clipboard.readText) navigator.clipboard.readText().then(function (t) { ta.value = t.trim(); if (parseInvite(ta.value)) connect(); }).catch(function () { });
    }, 'paste'),
    btn('primary wide', 'check', 'Join', function () { connect(); }, 'connect'), err);
};
// A participant gives a name and mobile number; the request then waits for an examiner.
SCREENS.ask = function () {
  var nm, mb, err = el('div', { class: 'err', id: 'askerr' });
  T.joinReq = T.joinReq || uuid();
  return el('div', null, el('img', { src: 'logo-320.png', alt: '', class: 'biglogo' }), el('h1', { text: 'Ask to join' }),
    el('p', { text: 'Your examiner confirms each request, so use your real name. Your name and number are seen only by your examiners and your group tutor.' }),
    field('Full name', nm = inp('askname', '', { autocapitalize: 'words' })),
    field('Mobile number', mb = inp('askmobile', '', { inputmode: 'tel', placeholder: '03001234567' })),
    btn('primary wide', 'check', 'Send request', function () {
      err.textContent = 'Sending';
      api({ op: 'request', code: T.joinInv.code, name: nm.value, mobile: mb.value, req_id: T.joinReq }).then(function (r) {
        if (!r.ok) { err.textContent = r.error || 'Could not send.'; return; }
        T.pending = { api: T.joinInv.api, token: r.token, role: r.role, pid: r.pid }; T.joinInv = null; go('setpin');
      }).catch(function () { err.textContent = navigator.onLine ? 'The workbook did not answer. Try again in a minute.' : 'No internet on this phone. Connect and try again.'; });
    }, 'asksend'), err,
    el('button', { class: 'linkbtn', type: 'button', onclick: function () { T.joinInv = null; go('join'); } }, 'Back'));
};
SCREENS.setpin = function () {
  var a, b, err = el('div', { class: 'err' });
  function done() {
    if (!/^\d{4,6}$/.test(a.value)) { err.textContent = 'Use 4 to 6 digits.'; return; }
    if (a.value !== b.value) { err.textContent = 'The two PINs do not match.'; return; }
    var salt = crypto.getRandomValues(new Uint8Array(16));
    deriveKey(a.value, salt).then(function (key) {
      localStorage.setItem(STORE, JSON.stringify({ v: 1, salt: b64(salt), n: a.value.length, iv: '', ct: '' }));
      T.key = key;
      T.S = { api: T.pending.api, token: T.pending.token, role: T.pending.role, pid: T.pending.pid, data: null, items: null, stamp: '', pc: {}, outbox: [], uploads: [], lastSync: 0, syncErr: '' };
      T.pending = null;
      return saveState();
    }).then(function () { T.screen = 'loading'; render(); return sync(true); }).then(function () { go(T.S && T.S.data ? 'home' : 'loading'); });
  }
  return el('div', null, el('h1', { text: 'Choose a PIN' }),
    el('p', { text: 'The PIN locks the app on this phone. It is never sent anywhere. If you forget it, you will need a new invitation.' }),
    el('label', { class: 'f', for: 'pin1', text: 'PIN (4 to 6 digits)' }),
    a = el('input', { id: 'pin1', class: 'pin', type: 'password', inputmode: 'numeric', autocomplete: 'off', maxlength: '6' }),
    el('label', { class: 'f', for: 'pin2', text: 'Type it again' }),
    b = el('input', { id: 'pin2', class: 'pin', type: 'password', inputmode: 'numeric', autocomplete: 'off', maxlength: '6' }),
    btn('primary wide', 'check', 'Save PIN', done, 'savepin'), err);
};
SCREENS.loading = function () {
  var S = T.S;
  return el('div', null, el('img', { src: 'logo-320.png', alt: '', class: 'biglogo' }), el('h1', { text: CFG.APP_NAME }),
    el('p', { text: S && S.syncErr ? S.syncErr : 'Downloading' }),
    S && S.syncErr ? btn('primary wide', 'sync', 'Try again', function () { sync().then(function () { if (T.S.data) go('home'); }); }) : null);
};
SCREENS.unlock = function () {
  var pin = '', st = stored() || {}, n = +st.n || 0, err = el('div', { class: 'err', id: 'pinerr', role: 'alert' });
  var dots = el('div', { class: 'dots', id: 'dots', 'aria-label': 'PIN' });
  function drawDots() {
    var k = Math.max(n || 4, pin.length);
    dots.replaceChildren.apply(dots, Array.apply(null, Array(k)).map(function (_, i) { return el('span', { class: i < pin.length ? 'on' : '' }); }));
  }
  function opened() { T.fails = 0; T.idleAt = Date.now(); go(T.S.exam ? 'exam' : T.S.data ? 'home' : 'loading'); sync(true); }
  function tryIt() {
    if (T.waitUntil && Date.now() < T.waitUntil) { err.textContent = 'Wait a few seconds and try again.'; pin = ''; drawDots(); return; }
    var p = pin;
    unlock(p).then(opened).catch(function () {
      T.fails = (T.fails || 0) + 1; pin = ''; drawDots();
      if (T.fails >= 5) T.waitUntil = Date.now() + 30000;
      err.textContent = 'Wrong PIN.';
      dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake');
    });
  }
  function press(k) {
    T.unlockPresses = (T.unlockPresses || 0) + 1; err.textContent = '';
    if (k === 'del') pin = pin.slice(0, -1); else if (pin.length < 6) pin += k;
    drawDots();
    if (n && pin.length === n) tryIt();
  }
  function face(auto) {
    if (!bioReady() || T.bioBusy) return;
    if (auto === true && (pin || T.unlockPresses !== startPresses)) return;
    var typed = T.unlockPresses = T.unlockPresses || 0;
    bioUnlock().then(function () { if (T.screen === 'unlock') opened(); }).catch(function (e) {
      if (T.screen !== 'unlock' || T.unlockPresses !== typed) return;
      err.textContent = e && e.message === 'cancel' ? 'Tap the biometric key or type your PIN.' : 'Biometric did not work. Type your PIN.';
    });
  }
  drawDots();
  var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', bioReady() ? 'face' : (n ? '' : 'ok'), '0', 'del'];
  var pad = el('div', { class: 'keypad', id: 'keypad' }, keys.map(function (k) {
    if (!k) return el('span');
    if (k === 'face') return el('button', { class: 'key fn', type: 'button', id: 'bioUnlock', 'aria-label': 'Unlock with fingerprint or face', onclick: face }, svg('faceid'));
    if (k === 'del') return el('button', { class: 'key fn', type: 'button', 'aria-label': 'Delete', 'data-k': 'del', onclick: function () { press('del'); } }, svg('back'));
    if (k === 'ok') return el('button', { class: 'key fn', type: 'button', id: 'unlockbtn', 'aria-label': 'Unlock', onclick: tryIt }, svg('check'));
    return el('button', { class: 'key', type: 'button', 'data-k': k, onclick: function () { press(k); } }, k);
  }));
  function onKey(e) {
    if (T.screen !== 'unlock') { document.removeEventListener('keydown', onKey); return; }
    if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Enter') tryIt();
  }
  document.removeEventListener('keydown', T.unlockKeys || function () { });
  T.unlockKeys = onKey; document.addEventListener('keydown', onKey);
  var startPresses = T.unlockPresses = T.unlockPresses || 0;
  if (bioReady() && !T.bioTried) { T.bioTried = true; setTimeout(function () { face(true); }, 350); }
  return el('div', { class: 'unlock' },
    el('img', { src: 'logo-320.png', alt: '', class: 'biglogo' }), el('h1', { text: 'MCQ Bench' }),
    el('p', { class: 'muted', text: bioReady() ? 'Fingerprint, face or your PIN' : 'Enter your PIN' }),
    dots, err, pad,
    el('button', { class: 'linkbtn', type: 'button', id: 'forgot', onclick: function () {
      if (confirm('Forgot your PIN? Nothing on this phone can be opened without it. This removes the app data from this phone; ask for a new invitation or join link to set it up again. Entries not yet sent will be lost.')) resetPhone();
    } }, 'Forgot PIN'));
};


// ---------- a participant's own data ----------
function itemMap() {
  var S = T.S;
  if (T.imFor !== S.items || T.imPc !== S.lastSync) {
    T.im = {}; T.imFor = S.items; T.imPc = S.lastSync;
    Object.keys(S.pc || {}).forEach(function (k) { if (S.pc[k].t === 'k') S.pc[k].items.forEach(function (i) { T.im[i.item_id] = i; }); });
    (S.items || []).forEach(function (i) { T.im[i.item_id] = i; });
  }
  return T.im;
}
function metaMap() { var m = {}, im = itemMap(), dm = D().meta || {}; Object.keys(dm).forEach(function (k) { m[k] = dm[k]; }); Object.keys(im).forEach(function (k) { if (im[k].g) m[k] = { g: im[k].g, pool: im[k].pool, bloom: im[k].bloom }; }); return m; }
// Answers the workbook holds plus answers still waiting on this phone (marked here from the practice key).
function myResponses() {
  var d = D(), out = (d.responses || []).slice(), have = {}, seen = {}, im = itemMap();
  out.forEach(function (r) { have[r.attempt_id + '|' + r.item_id] = 1; seen[r.item_id] = 1; });
  T.S.outbox.forEach(function (o) {
    if (o.op !== 'attempt' || o.a.paper_timed) return;
    o.a.responses.forEach(function (r) {
      if (have[o.a.attempt_id + '|' + r.item_id] || !r.chosen) return;
      var it = im[r.item_id];
      out.push({ attempt_id: o.a.attempt_id, paper_id: o.a.paper_id || '', mode: 'practice', item_id: r.item_id, version: r.version, chosen: r.chosen, correct: it && it.key ? (it.key === r.chosen ? '1' : '0') : '', first_attempt: seen[r.item_id] ? '0' : '1', at: stampPk_(r.at), local: true });
      seen[r.item_id] = 1;
    });
  });
  return out;
}
function myFeedback() { return personFeedback_(myResponses(), metaMap(), D().set); }
function paperList() { return (D().papers || []).filter(function (p) { return p.mode === 'timed'; }); }
function myAttempt(paperId) { return (D().attempts || []).filter(function (a) { return a.paper_id === paperId; })[0]; }
function waitingExam(paperId) { return T.S.outbox.some(function (o) { return o.op === 'attempt' && o.a.paper_id === paperId && o.a.paper_timed; }); }
function paperState(p) { var n = nowMs(); return n > p.close_ms + setV('grace_min') * 60000 ? 'closed' : n > p.close_ms ? 'over' : n >= p.open_ms ? 'open' : 'soon'; }

// ---------- home ----------
function stripChips(list) {
  var on = list.filter(function (x) { return x.n; });
  if (!on.length) return null;
  return el('div', { class: 'strip', id: 'strip' }, on.map(function (x) {
    return el('button', { class: 'schip t' + x.tier, type: 'button', 'data-k': x.k, onclick: function () { var t = document.getElementById(x.k); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, svg(x.icon), x.label, el('b', { text: String(x.n) }));
  }));
}
SCREENS.home = function () {
  var d = D();
  if (d.pending) return el('div', null, topBar(APP), el('div', { class: 'card', id: 'pendingcard' }, el('div', { class: 'row' }, el('span', { class: 'rowic' }, svg('wait')), el('div', { class: 'grow' }, el('b', { text: 'Waiting to be confirmed' }),
    el('div', { class: 'sm', text: 'Your request has been sent. An examiner confirms each person. Pull down or tap the sync button later; nothing more is needed from you.' })))), btn('wide', 'sync', 'Check now', function () { sync(); }, 'checknow'));
  return isP() ? homeParticipant() : homeStaff();
};
function examCard(p) {
  var st = paperState(p), att = myAttempt(p.paper_id), wait = waitingExam(p.paper_id), run = T.S.exam && T.S.exam.paper_id === p.paper_id;
  var when = st === 'soon' ? 'Opens ' + fmtDate(stampPk_(p.open_ms).slice(0, 16)) + ' (in ' + mins(p.open_ms - nowMs()) + ')' : st === 'open' ? 'Open now. Closes in ' + mins(p.close_ms - nowMs()) : 'Closed';
  if (att || wait) when = att ? 'Sent. Keys and explanations open ' + fmtDate(stampPk_(p.close_ms + setV('grace_min') * 60000).slice(0, 16)) : 'Saved on this phone. Connect to the internet to send it.';
  var tier = att ? '' : wait ? 't2' : st === 'open' ? 't1' : st === 'soon' && p.open_ms - nowMs() < 24 * 3600000 ? 't2' : '';
  var action = null;
  if (att || wait) action = chipEl(att ? 'ok' : 'due', att ? 'check' : 'wait', att ? 'Submitted' : 'Waiting to send');
  else if (run) action = btn('primary small', 'play', 'Continue', function () { go('exam'); }, 'examgo-' + p.paper_id);
  else if (st === 'open') action = btn('primary small', 'play', 'Start', function () { T.introId = p.paper_id; go('examintro'); }, 'examgo-' + p.paper_id);
  return el('div', { class: 'card exam ' + tier, 'data-paper': p.paper_id },
    el('div', { class: 'row' }, el('span', { class: 'rowic' }, svg('clock')), el('div', { class: 'grow' }, el('b', { text: p.title }),
      el('div', { class: 'sm', text: plural(p.n, 'item') + ', ' + p.minutes + ' min' + (p.setting === 'supervised' ? ', supervised' : ', in your own time') + (p.pass_mark !== '' ? ', pass mark ' + p.pass_mark + '%' : '') }),
      el('div', { class: 'sm when', text: when })), action));
}
function homeParticipant() {
  var d = D(), f = myFeedback(), papers = paperList();
  var upcoming = papers.filter(function (p) { return paperState(p) !== 'closed' && (paperState(p) !== 'over' || myAttempt(p.paper_id) || waitingExam(p.paper_id)); }).sort(function (a, b) { return (myAttempt(a.paper_id) ? 1 : 0) - (myAttempt(b.paper_id) ? 1 : 0) || a.open_ms - b.open_ms; });
  var todo = upcoming.filter(function (p) { return !myAttempt(p.paper_id) && !waitingExam(p.paper_id); }), unsent = upcoming.filter(function (p) { return waitingExam(p.paper_id); }).length;
  var review = papers.filter(function (p) { return paperState(p) === 'closed' && myAttempt(p.paper_id); });
  var research = String(d.set.research_on) === 'Y' && !d.consent && !T.S.outbox.some(function (o) { return o.op === 'consent'; });
  var weak = f.weak.slice(0, 3), fb = (d.fb || []).slice().sort(function (a, b) { return a.written_at < b.written_at ? 1 : -1; })[0];
  var openNow = upcoming.filter(function (p) { return paperState(p) === 'open' && !myAttempt(p.paper_id) && !waitingExam(p.paper_id); }).length;
  return el('div', null, topBar(APP),
    stripChips([{ k: 'sec-exam', tier: 1, icon: 'clock', label: 'Open now', n: openNow }, { k: 'sec-exam', tier: 2, icon: 'sync', label: 'Paper to send', n: unsent }, { k: 'sec-exam', tier: todo.length && todo[0].open_ms - nowMs() < 24 * 3600000 ? 2 : 3, icon: 'clock', label: 'Papers', n: openNow ? 0 : todo.length }, { k: 'sec-weak', tier: 2, icon: 'target', label: 'Weak topics', n: weak.length }, { k: 'sec-fb', tier: 3, icon: 'msg', label: 'Feedback', n: fb ? 1 : 0 }]),
    research ? el('div', { class: 'card', id: 'consentcard' }, el('b', { text: 'Use of your results for research' }), el('p', { class: 'pre', text: d.set.consent_text }),
      el('p', { class: 'muted', text: 'Your choice does not change your access, your tests or your marks.' }),
      el('div', { class: 'actions2' }, btn('', 'x', 'I do not agree', function () { queue({ req_id: uuid(), op: 'consent', agree: false }).then(function () { render(); sync(true); }); }, 'consentno'),
        btn('primary', 'check', 'I agree', function () { queue({ req_id: uuid(), op: 'consent', agree: true }).then(function () { render(); sync(true); }); }, 'consentyes'))) : null,
    el('div', { id: 'sec-exam' }, h2('clock', 'Next timed paper', 'Timed paper'),
      upcoming.length ? upcoming.slice(0, 3).map(examCard) : el('p', { class: 'muted', text: 'No timed paper is set for your group.' })),
    el('div', { id: 'sec-weak' }, h2('target', 'Practise your weakest topics', 'Weak topic'),
      weak.length ? el('div', { class: 'card list' }, weak.map(function (g) {
        return el('div', { class: 'row', 'data-weak': g.k }, el('div', { class: 'grow' }, el('b', { text: g.k }), el('div', { class: 'sm', text: g.c + ' of ' + g.n + ' correct (' + g.pct + '%)' + (g.state === 'provisional' ? ', provisional' : '') })),
          btn('primary small', 'play', 'Practise', function () { startPractice(pickItems({ groups: [g.k], n: 10, unseen: true })); }));
      })) : el('p', { class: 'muted', id: 'noweak', text: f.total.n ? 'No topic is judged weak yet. A topic is judged once you have answered ' + setV('person_min') + ' of its items (you have answered ' + plural(f.total.n, 'item') + ' in all).' : 'Answer some practice items first: a topic is judged once you have answered ' + setV('person_min') + ' of its items.' }),
      btn('wide', 'target', 'Start practice', function () { go('practice'); }, 'homepractice')),
    review.length ? el('div', { id: 'sec-review' }, h2('eye', 'Answers now open'), el('div', { class: 'card list' }, review.map(function (p) {
      return el('button', { class: 'row', type: 'button', onclick: function () { openReview(myAttempt(p.paper_id).attempt_id); } }, el('div', { class: 'grow' }, el('b', { text: p.title }), el('div', { class: 'sm', text: 'Keys and explanations can now be read.' })), svg('next'));
    }))) : null,
    el('div', { id: 'sec-fb' }, h2('msg', 'Latest feedback', 'Written feedback'),
      fb ? el('button', { class: 'card', type: 'button', id: 'fbcard', onclick: function () { T.resTab = 'fb'; go('results'); } }, el('div', { class: 'sm', text: fmtDate(fb.written_at) + ', from ' + plural(Number(fb.n_responses) || 0, 'answer') }), el('p', { class: 'pre', text: fb.text.length > 280 ? fb.text.slice(0, 280) + '...' : fb.text }))
        : el('p', { class: 'muted', text: 'No written feedback yet. Your scores by topic are under Results.' })));
}

// ---------- practice ----------
function pickItems(o) {
  var pool = (T.S.items || []).slice(), seen = {};
  myResponses().forEach(function (r) { seen[r.item_id] = 1; });
  if (o.groups && o.groups.length) pool = pool.filter(function (i) { return o.groups.indexOf(i.g) >= 0; });
  if (o.bloom) pool = pool.filter(function (i) { return bloomC_(i.bloom) === o.bloom; });
  pool = shuffle(pool);
  if (o.unseen) pool.sort(function (a, b) { return (seen[a.item_id] ? 1 : 0) - (seen[b.item_id] ? 1 : 0); });
  return pool.slice(0, o.n || 10).map(function (i) { return i.item_id; });
}
function startPractice(ids, paperId) {
  if (!ids.length) { toast('No practice items match. Widen your choice.'); return; }
  T.S.prac = { id: uuid(), paper_id: paperId || '', started: nowMs(), ids: ids, i: 0, ans: {} };
  T.qShown = Date.now();
  saveState().then(function () { go('quiz'); });
}
SCREENS.practice = function () {
  var P = T.pform = T.pform || { n: 10, groups: [], bloom: '', unseen: true }, f = myFeedback();
  var groups = []; (T.S.items || []).forEach(function (i) { if (groups.indexOf(i.g) < 0) groups.push(i.g); }); groups.sort();
  var sets = (D().papers || []).filter(function (p) { return p.mode === 'set'; }), im = itemMap();
  var count = (T.S.items || []).filter(function (i) { return (!P.groups.length || P.groups.indexOf(i.g) >= 0) && (!P.bloom || bloomC_(i.bloom) === P.bloom); }).length;
  return el('div', null, topBar('Practice'),
    T.S.prac && T.S.prac.i < T.S.prac.ids.length ? el('div', { class: 'note', id: 'pracresume' }, 'A practice test is unfinished (' + Object.keys(T.S.prac.ans).length + ' of ' + T.S.prac.ids.length + ' answered). ', el('button', { class: 'linkbtn', type: 'button', onclick: function () { go('quiz'); } }, 'Continue it')) : null,
    h2('target', 'Build a practice test', 'Practice'),
    el('div', { class: 'card' },
      el('label', { class: 'f', text: 'Number of items' }), chips([10, 20, 30, 50], P.n, function (x) { P.n = x; }, 'pn'),
      el('label', { class: 'f' }, 'Topic groups', qm('Topic group')),
      el('button', { class: 'btn wide', type: 'button', id: 'pgroups', onclick: function () { pickSheet('Topic groups', groups, P.groups, true, function (g) { P.groups = g; render(); }); } }, svg('list'), el('span', { text: P.groups.length ? plural(P.groups.length, 'group') + ' chosen' : 'All topic groups' })),
      f.weak.length ? el('button', { class: 'linkbtn', type: 'button', id: 'pweak', onclick: function () { P.groups = f.weak.map(function (g) { return g.k; }); render(); } }, 'Choose my weak topics') : null,
      el('label', { class: 'f' }, 'Bloom level', qm('Bloom level')), chips(['', 'C1', 'C2', 'C3'], P.bloom, function (x) { P.bloom = x; var c = document.getElementById('pcount'); if (c) render(); }, 'pbloom', function (x) { return x ? BLOOM_WORD[x] : 'All' }),
      el('label', { class: 'switch' }, el('input', { type: 'checkbox', id: 'punseen', checked: P.unseen, onchange: function (e) { P.unseen = e.target.checked; } }), el('span', { text: 'Items I have not met first' })),
      el('p', { class: 'muted', id: 'pcount', text: plural(count, 'item') + ' match in your pool of ' + (T.S.items || []).length + '.' }),
      btn('primary wide', 'play', 'Start', function () { startPractice(pickItems(P)); }, 'pstart')),
    sets.length ? [h2('doc', 'Practice papers set for you'), el('div', { class: 'card list', id: 'setpapers' }, sets.map(function (p) {
      var ids = p.ids.filter(function (x) { return im[x]; });
      return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: p.title }), el('div', { class: 'sm', text: plural(ids.length, 'item') + ', untimed' })), btn('primary small', 'play', 'Start', function () { startPractice(ids, p.paper_id); }));
    }))] : null);
};
function optionList(it, chosen, onPick, reveal) {
  return el('div', { class: 'opts', id: 'opts' }, CFG.OPTS.map(function (L, k) {
    var cls = 'opt';
    if (reveal) cls += L === it.key ? ' right' : L === chosen ? ' wrong' : ' dim'; else if (L === chosen) cls += ' on';
    return el('button', { class: cls, type: 'button', 'data-o': L, disabled: reveal || !onPick, onclick: onPick ? function () { onPick(L); } : null }, el('b', { text: L }), el('span', { text: it.opts[k] }),
      reveal && L === it.key ? svg('check') : reveal && L === chosen ? svg('x') : null);
  }));
}
function explain(it) {
  return el('div', { class: 'card explain', id: 'explain' }, el('b', { text: 'Why ' + it.key + ' is the answer' }), el('p', { text: it.just }),
    el('div', { class: 'sm', text: it.g + ' | ' + (BLOOM_WORD[bloomC_(it.bloom)] || it.bloom) }),
    el('details', null, el('summary', { text: 'References' }), el('p', { class: 'pre sm', text: it.refs })));
}
function flagBtn(it) {
  var mine = (D().challenges || []).some(function (c) { return c.item_id === it.item_id; }) || T.S.outbox.some(function (o) { return o.op === 'challenge' && o.item_id === it.item_id; });
  if (mine) return el('p', { class: 'muted', text: 'You have flagged this item.' });
  return el('button', { class: 'linkbtn', type: 'button', id: 'flagitem', onclick: function () {
    var ta;
    sheetOpen(function () {
      return sheetWrap('Flag this item', [el('h2', null, 'Flag this item', qm('Flag')), el('p', { class: 'muted', text: 'Say why you think the item or its key is wrong. It goes to your examiner and to the item’s writer, without your name to the writer.' }),
        ta = el('textarea', { id: 'flagwhy', rows: '4', placeholder: 'For example: option B is also correct because...' }),
        el('div', { class: 'actions2' }, btn('', 'x', 'Cancel', sheetClose), btn('primary', 'flag', 'Send', function () {
          if (ta.value.trim().length < 10) { toast('Write a sentence saying why.'); return false; }
          queue({ req_id: uuid(), op: 'challenge', item_id: it.item_id, reason: ta.value.trim() }).then(function () { T.sheet = null; render(); toast('Flag saved.', true); sync(true); });
        }, 'flagsend'))]);
    });
  } }, 'Flag this item as wrong');
}
function saveSeconds() { var s = Math.round((Date.now() - (T.qShown || Date.now())) / 1000); T.qShown = Date.now(); return Math.min(3600, Math.max(0, s)); }
function pracOutbox(P) {
  return queue({ req_id: 'att-' + P.id, op: 'attempt', a: { attempt_id: P.id, paper_id: P.paper_id, started: P.started, submitted: P.i >= P.ids.length ? nowMs() : 0,
    responses: P.ids.filter(function (x) { return P.ans[x]; }).map(function (x, k) { var a = P.ans[x]; return { item_id: x, version: a.v, chosen: a.c, seconds: a.s, at: a.at, position: P.ids.indexOf(x) + 1 }; }) } });
}
SCREENS.quiz = function () {
  var P = T.S.prac, im = itemMap();
  if (!P) return el('div', null, backBar('Practice', 'practice'), el('p', { class: 'muted', text: 'No practice test is open.' }));
  if (P.i >= P.ids.length) {
    var right = P.ids.filter(function (x) { return P.ans[x] && im[x] && P.ans[x].c === im[x].key; }).length, n = Object.keys(P.ans).length;
    return el('div', { id: 'quizdone' }, backBar('Practice finished', 'practice'),
      el('div', { class: 'card hero' }, el('div', { class: 'big', id: 'quizscore', text: right + ' of ' + n }), el('div', { class: 'sm', text: 'correct in this practice test (' + pct_(right, n) + '%)' })),
      el('p', { class: 'muted', text: 'One short test says little. Your standing by topic, with the number of items it rests on, is under Results.' }),
      el('div', { class: 'card list' }, P.ids.filter(function (x) { return P.ans[x] && im[x]; }).map(function (x, k) {
        var ok = P.ans[x].c === im[x].key;
        return el('div', { class: 'row' }, el('span', { class: 'rowic ' + (ok ? 'good' : 'bad') }, svg(ok ? 'check' : 'x')), el('div', { class: 'grow' }, el('div', { text: im[x].topic }), el('div', { class: 'sm', text: im[x].g })));
      })),
      el('div', { class: 'actions2' }, btn('', 'summary', 'Results', function () { T.S.prac = null; saveState(); go('results'); }, 'quizresults'), btn('primary', 'target', 'More practice', function () { T.S.prac = null; saveState(); go('practice'); }, 'quizmore')));
  }
  var id = P.ids[P.i], it = im[id], a = P.ans[id];
  if (!it) { P.i++; return SCREENS.quiz(); }
  function pick(L) {
    P.ans[id] = { c: L, v: it.version, s: saveSeconds(), at: nowMs() };
    pracOutbox(P).then(function () { var y = window.scrollY; render(); window.scrollTo(0, y); var e = document.getElementById('explain'); if (e && e.scrollIntoView) e.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); if (Object.keys(P.ans).length % 5 === 0) sync(true); });
  }
  return el('div', { id: 'quiz' }, backBar('Item ' + (P.i + 1) + ' of ' + P.ids.length, function () { go('practice'); }),
    el('div', { class: 'progress' }, (function () { var b = el('span'); b.style.width = Math.round(P.i * 100 / P.ids.length) + '%'; return b; })()),
    el('p', { class: 'stem', id: 'stem', text: it.stem }), el('p', { class: 'lead', text: it.lead }),
    optionList(it, a && a.c, a ? null : pick, !!a),
    a ? [explain(it), flagBtn(it), btn('primary wide', 'next', P.i + 1 >= P.ids.length ? 'Finish' : 'Next item', function () {
      P.i++; T.qShown = Date.now();
      (P.i >= P.ids.length ? pracOutbox(P).then(function () { sync(true); }) : saveState()).then(function () { render(); window.scrollTo(0, 0); });
    }, 'quiznext')] : null);
};

// ---------- timed papers ----------
function paperKey(code, salt) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveKey']).then(function (base) {
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 200000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  });
}
function lockPaper(code, items) {
  var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  return paperKey(code, salt).then(function (k) { return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, new TextEncoder().encode(JSON.stringify(items))); })
    .then(function (ct) { return JSON.stringify({ s: b64(salt), iv: b64(iv), ct: b64(ct) }); });
}
function unlockPaper(code, blob) {
  var o = JSON.parse(blob);
  return paperKey(code, unb64(o.s)).then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.iv) }, k, unb64(o.ct)); }).then(function (pt) { return JSON.parse(new TextDecoder().decode(pt)); });
}
SCREENS.examintro = function () {
  var p = paperList().filter(function (x) { return x.paper_id === T.introId; })[0], S = T.S, code, err = el('div', { class: 'err', id: 'introerr' });
  if (!p) return el('div', null, backBar('Timed paper', 'home'), el('p', { class: 'muted', text: 'That paper is not available.' }));
  var pc = (S.pc || {})[p.paper_id], sup = p.setting === 'supervised', left = Math.min(Number(p.minutes) * 60000, p.close_ms - nowMs());
  function begin(items) {
    S.exam = { paper_id: p.paper_id, attempt_id: uuid(), started: nowMs(), ends: nowMs() + left, items: shuffle(items), i: 0, ans: {}, secs: {}, mark: {}, interruptions: 0 };
    T.qShown = Date.now();
    saveState().then(function () { go('exam'); });
  }
  function start() {
    if (paperState(p) !== 'open') { err.textContent = 'This paper is not open now.'; return; }
    if (!pc) { err.textContent = navigator.onLine ? 'Downloading the paper. Try again in a moment.' : 'The paper is not on this phone yet. Connect to the internet once, then start.'; sync(true); return; }
    if (pc.t === 'q') return begin(pc.items);
    if (!/^\d{6}$/.test(code.value)) { err.textContent = 'Type the six-digit start code read out by the invigilator.'; return; }
    err.textContent = 'Opening';
    unlockPaper(code.value, pc.blob).then(begin, function () { err.textContent = 'That start code is not right.'; });
  }
  return el('div', null, backBar('Timed paper', 'home'), el('h1', { text: p.title }),
    el('div', { class: 'card' },
      el('div', { class: 'kv' }, el('span', { text: 'Items' }), el('b', { text: String(p.n) })),
      el('div', { class: 'kv' }, el('span', { text: 'Time you will have' }), el('b', { id: 'introtime', text: mins(left) })),
      p.pass_mark !== '' ? el('div', { class: 'kv' }, el('span', { text: 'Pass mark' }), el('b', { text: p.pass_mark + '%' })) : null,
      el('div', { class: 'kv' }, el('span', { text: 'Closes' }), el('b', { text: fmtDate(stampPk_(p.close_ms).slice(0, 16)) }))),
    el('div', { class: 'card' }, el('ul', { class: 'rules' },
      el('li', { text: 'One attempt. Once you start, the clock keeps running, also when the app is closed or the phone is locked.' }),
      el('li', { text: 'The paper works without internet. Your answers are sent when the phone is next online: connect soon after you finish.' }),
      el('li', { text: 'No negative marking. An unanswered item scores nothing.' }),
      el('li', { text: 'Leaving the app during the paper is recorded for your examiner.' }),
      el('li', { text: 'Your score comes after your answers are sent. Keys and explanations open for everyone when the paper has closed.' }))),
    sup && pc && pc.t === 'b' ? field('Start code', code = inp('startcode', '', { inputmode: 'numeric', maxlength: '6', class: 'pin' }), 'Start code') : null,
    btn('primary wide', 'play', 'Start the paper now', start, 'examstart'), err);
};
function examSubmit() {
  var X = T.S.exam; if (!X) return Promise.resolve();
  X.secs[X.items[X.i].item_id] = (X.secs[X.items[X.i].item_id] || 0) + saveSeconds();
  var a = { attempt_id: X.attempt_id, paper_id: X.paper_id, paper_timed: true, started: X.started, submitted: Math.min(nowMs(), X.ends + 5000), interruptions: X.interruptions,
    responses: X.items.map(function (it, k) { return { item_id: it.item_id, version: it.version, chosen: X.ans[it.item_id] || '', seconds: X.secs[it.item_id] || 0, position: k + 1 }; }) };
  T.S.exam = null; T.S.lastExam = { paper_id: a.paper_id, answered: Object.keys(X.ans).length, n: X.items.length };
  return queue({ req_id: 'att-' + a.attempt_id, op: 'attempt', a: a }).then(function () { go('examdone'); return sync(true); });
}
function examTick() {
  var X = T.S && T.S.exam, t = document.getElementById('examtimer');
  if (!X) return;
  var left = X.ends - nowMs();
  if (left <= 0) { if (!T.submitting) { T.submitting = true; T.sheet = null; examSubmit().then(function () { T.submitting = false; toast('Time is up. Your paper was submitted.'); }); } return; }
  if (t) { t.textContent = clock(left); t.className = 'timer' + (left < 5 * 60000 ? ' low' : ''); }
}
setInterval(examTick, 1000);
SCREENS.exam = function () {
  var X = T.S.exam;
  if (!X) return el('div', null, backBar('Timed paper', 'home'), el('p', { class: 'muted', text: 'No paper is running.' }));
  var it = X.items[X.i], n = X.items.length, done = Object.keys(X.ans).length;
  function move(to) { X.secs[it.item_id] = (X.secs[it.item_id] || 0) + saveSeconds(); X.i = Math.max(0, Math.min(n - 1, to)); saveState(); render(); window.scrollTo(0, 0); }
  function gridSheet() {
    sheetOpen(function () {
      return sheetWrap('All items', [el('h2', { text: 'All items' }), el('p', { class: 'muted', text: done + ' of ' + n + ' answered. Orange: marked to look at again.' }),
        el('div', { class: 'qgrid', id: 'qgrid' }, X.items.map(function (q, k) { return el('button', { class: (X.ans[q.item_id] ? 'done' : '') + (X.mark[q.item_id] ? ' mark' : '') + (k === X.i ? ' cur' : ''), type: 'button', onclick: function () { T.sheet = null; move(k); } }, String(k + 1)); })),
        btn('wide', 'x', 'Close', sheetClose)]);
    });
  }
  return el('div', { id: 'exam' },
    el('div', { class: 'top examtop' }, el('div', { class: 'title small', text: 'Item ' + (X.i + 1) + ' of ' + n }), el('span', { class: 'timer', id: 'examtimer', text: clock(X.ends - nowMs()) })),
    el('p', { class: 'stem', id: 'stem', text: it.stem }), el('p', { class: 'lead', text: it.lead }),
    optionList(it, X.ans[it.item_id], function (L) { if (X.ans[it.item_id] === L) delete X.ans[it.item_id]; else X.ans[it.item_id] = L; saveState(); var y = window.scrollY; render(); window.scrollTo(0, y); }, false),
    el('label', { class: 'switch' }, el('input', { type: 'checkbox', id: 'exammark', checked: !!X.mark[it.item_id], onchange: function (e) { if (e.target.checked) X.mark[it.item_id] = 1; else delete X.mark[it.item_id]; saveState(); } }), el('span', { text: 'Look at this one again' })),
    el('div', { class: 'actions3' }, btn('', 'back', 'Back', function () { move(X.i - 1); }, 'examprev'), btn('', 'grid', done + '/' + n, gridSheet, 'examgrid'), btn(X.i === n - 1 ? '' : 'primary', 'next', 'Next', function () { move(X.i + 1); }, 'examnext')),
    btn(X.i === n - 1 || done === n ? 'primary wide' : 'wide', 'check', 'Submit the paper', function () {
      askSheet('Submit the paper?', (n - done ? plural(n - done, 'item') + ' not answered. ' : 'All items answered. ') + 'You cannot change your answers after this.', 'Submit', examSubmit);
    }, 'examsubmit'));
};
SCREENS.examdone = function () {
  var L = T.S.lastExam || {}, wait = waitingExam(L.paper_id);
  return el('div', { id: 'examdone' }, el('h1', { text: 'Paper submitted' }),
    el('div', { class: 'card' }, el('p', { text: 'You answered ' + (L.answered || 0) + ' of ' + (L.n || 0) + ' items.' }),
      wait ? el('p', { id: 'examwait', class: 'warn', text: 'Your answers are saved on this phone and are waiting to be sent. Connect to the internet now: a paper that arrives late is marked late for your examiner.' })
        : el('p', { id: 'examsent', text: 'Your answers have reached the workbook. Your score is under Results.' })),
    wait ? btn('wide', 'sync', 'Send now', function () { sync().then(render); }, 'examsend') : null,
    btn('primary wide', 'home', 'Home', function () { go(wait ? 'home' : 'results'); }, 'examhome'));
};

// ---------- results ----------
function fbTable(rows, id, head) {
  return el('div', { class: 'card', id: id }, rows.length ? el('table', { class: 't fb' }, el('thead', null, el('tr', null, el('th', { text: head || 'Topic group' }), el('th', { class: 'num', text: 'Correct' }), el('th', { class: 'num' }, 'Range', qm('95% range')), el('th', null))),
    el('tbody', null, rows.map(function (g) {
      return el('tr', { 'data-k': g.k, class: g.weak ? 'weak' : g.strong ? 'strong' : '' }, el('td', null, g.k, el('div', { class: 'sm', text: g.state === 'too few' ? 'Too few items to judge' : g.state === 'provisional' ? 'Provisional' : '' })),
        el('td', { class: 'num', text: g.c + '/' + g.n }), el('td', { class: 'num', text: g.state === 'too few' ? '' : g.lo + ' to ' + g.hi + '%' }),
        el('td', null, g.weak ? chipEl('due', 'alert', 'Weak') : g.strong ? chipEl('ok', 'check', 'Strong') : null));
    }))) : el('p', { class: 'muted', text: 'Nothing answered yet.' }));
}
SCREENS.results = function () {
  var d = D(), tab = T.resTab || 'topics', f = myFeedback(), atts = (d.attempts || []).slice().sort(function (a, b) { return a.started < b.started ? 1 : -1; }), pr = progress_(d.attempts || [], d.set);
  var tabs = el('div', { class: 'seg', id: 'restabs' }, [['topics', 'By topic'], ['tests', 'Tests'], ['fb', 'Feedback']].map(function (t) { return el('button', { class: tab === t[0] ? 'on' : '', type: 'button', 'data-t': t[0], onclick: function () { T.resTab = t[0]; render(); } }, t[1]); }));
  var body;
  if (tab === 'topics') body = [
    el('div', { class: 'card hero' }, el('div', { class: 'big', id: 'restotal', text: f.total.n ? pct_(f.total.c, f.total.n) + '%' : '0' }), el('div', { class: 'sm', text: f.total.n ? f.total.c + ' of ' + plural(f.total.n, 'item') + ' correct at first attempt' : 'No items answered yet' })),
    el('p', { class: 'muted' }, 'Counted from your first attempt at each item', qm('First attempt'), '. A topic is judged from ' + setV('person_min') + ' items and reported without "provisional" from ' + setV('person_full') + '.'),
    h2('target', 'What to study next', 'Weak topic'),
    f.weak.length ? el('div', { class: 'card list', id: 'studynext' }, f.weak.map(function (g) { return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: g.k }), el('div', { class: 'sm', text: g.pct + '% from ' + plural(g.n, 'item') })), btn('primary small', 'play', 'Practise', function () { startPractice(pickItems({ groups: [g.k], n: 10, unseen: true })); })); }))
      : el('p', { class: 'muted', id: 'nostudy', text: 'No judged topic is below ' + setV('weak_pct') + '%.' }),
    h2('list', 'By topic group', 'Topic group'), fbTable(f.groups, 'fbgroups'),
    h2('book', 'By Bloom level', 'Bloom level'), fbTable(f.bloom.map(function (b) { return Object.assign({}, b, { k: BLOOM_WORD[b.k] || b.k }); }), 'fbbloom', 'Level'),
    h2('summary', 'Progress over time', 'Progress'),
    pr.enough ? el('div', { class: 'card', id: 'progress' }, el('p', { text: 'First test ' + pr.first + '%, latest ' + pr.last + '%, over ' + pr.n + ' tests of 5 items or more.' }), el('div', { class: 'spark' }, pr.list.map(function (v) { var b = el('span', { title: v + '%' }); b.style.height = Math.max(4, v * 0.6) + 'px'; return b; })))
      : el('p', { class: 'muted', id: 'noprogress', text: 'Shown after ' + setV('progress_min') + ' tests (you have ' + pr.n + ').' })];
  else if (tab === 'tests') body = [atts.length ? el('div', { class: 'card list', id: 'attlist' }, atts.map(function (a) {
    var p = (d.papers || []).filter(function (x) { return x.paper_id === a.paper_id; })[0], timed = a.mode === 'timed';
    return el('button', { class: 'row', type: 'button', 'data-att': a.attempt_id, onclick: function () { openReview(a.attempt_id); } },
      el('span', { class: 'rowic' }, svg(timed ? 'clock' : 'target')),
      el('div', { class: 'grow' }, el('b', { text: p ? p.title : 'Practice' }), el('div', { class: 'sm', text: fmtDate(a.started.slice(0, 16)) + (timed && p && p.rank ? ' | rank ' + p.rank.rank + ' of ' + p.rank.of : '') })),
      el('div', { class: 'right' }, el('b', { text: a.score + '/' + a.n_items }), a.passed ? chipEl(a.passed === 'Y' ? 'ok' : 'due', a.passed === 'Y' ? 'check' : 'x', a.passed === 'Y' ? 'Pass' : 'Fail') : null));
  })) : el('p', { class: 'muted', text: 'No test yet.' })];
  else body = [
    (d.fb || []).length ? (d.fb || []).slice().sort(function (a, b) { return a.written_at < b.written_at ? 1 : -1; }).map(function (x) {
      return el('div', { class: 'card fbtext' }, el('div', { class: 'sm', text: fmtDate(x.written_at) + ' | from ' + plural(Number(x.n_responses) || 0, 'answer') + (x.scope && x.scope !== 'all' ? ' | ' + x.scope : '') }), el('p', { class: 'pre', text: x.text }));
    }) : el('p', { class: 'muted', id: 'nofb', text: 'No written feedback yet. It appears here when your examiner has it prepared.' }),
    (d.challenges || []).length ? [h2('flag', 'Items you flagged', 'Flag'), el('div', { class: 'card list', id: 'myflags' }, d.challenges.map(function (c) {
      return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: c.item_id }), el('div', { class: 'sm', text: c.reason }), c.reply ? el('div', { class: 'sm reply', text: 'Reply: ' + c.reply }) : null),
        chipEl(c.status === 'upheld' ? 'ok' : c.status === 'rejected' ? '' : 'due', c.status === 'open' ? 'wait' : 'check', c.status === 'upheld' ? 'Upheld' : c.status === 'rejected' ? 'Not upheld' : 'Open'));
    }))] : null];
  return el('div', null, topBar('Results'), tabs, body);
};
function openReview(attId) { T.revId = attId; go('review'); }
SCREENS.review = function () {
  var d = D(), a = (d.attempts || []).filter(function (x) { return x.attempt_id === T.revId; })[0], im = itemMap();
  if (!a) return el('div', null, backBar('Test', 'results'), el('p', { class: 'muted', text: 'Not found.' }));
  var p = (d.papers || []).filter(function (x) { return x.paper_id === a.paper_id; })[0], rs = (d.responses || []).filter(function (r) { return r.attempt_id === a.attempt_id; });
  var hidden = a.mode === 'timed' && rs.some(function (r) { return r.correct === ''; }), ef = d.examFb && d.examFb[a.paper_id];
  return el('div', { id: 'review' }, backBar(p ? p.title : 'Practice', function () { T.resTab = 'tests'; go('results'); }),
    el('div', { class: 'card hero' }, el('div', { class: 'big', id: 'revscore', text: a.score + ' of ' + a.n_items }), el('div', { class: 'sm', text: a.pct + '%' + (a.passed ? (a.passed === 'Y' ? ', passed' : ', below the pass mark of ' + (p ? p.pass_mark : '') + '%') : '') })),
    a.mode === 'timed' && p ? el('div', { class: 'card', id: 'rankcard' }, p.rank ? el('p', null, 'Rank ' + p.rank.rank + ' of ' + p.rank.of, qm('Rank'), '. You scored above ' + p.rank.percentile + '% of the others who sat it', qm('Percentile'), '.')
      : el('p', { class: 'muted', text: 'Rank is shown once ' + setV('rank_min') + ' people have sat the paper (' + (p.sat || 1) + ' so far).' }),
      a.late_flag ? el('p', { class: 'warn', text: 'Noted for your examiner: ' + a.late_flag + '.' }) : null) : null,
    hidden ? [el('div', { class: 'note', id: 'revhidden', text: 'Keys and explanations open when the paper has closed for everyone' + (p ? ' (' + fmtDate(stampPk_(p.close_ms).slice(0, 16)) + ')' : '') + '. Until then your result is shown by topic only.' }),
      ef ? [h2('list', 'This paper by topic group', 'Topic group'), fbTable(ef.groups.map(function (g) { return Object.assign({}, g, { state: 'reported', weak: false, strong: false }); }), 'examfb'), el('p', { class: 'muted', text: 'One paper has few items per topic, so no topic is judged weak or strong from it alone.' })] : null]
      : el('div', { id: 'revitems' }, rs.map(function (r, k) {
        var it = im[r.item_id];
        if (!it || !it.key) return el('div', { class: 'card' }, el('b', { text: r.item_id }), el('div', { class: 'sm', text: 'You chose ' + (r.chosen || 'nothing') + (r.correct !== '' ? (r.correct === '1' ? ', correct' : ', not correct') : '') + '. This item is no longer in your pool.' }));
        return el('details', { class: 'card rev', 'data-item': r.item_id }, el('summary', null, el('span', { class: 'rowic ' + (r.correct === '1' ? 'good' : 'bad') }, svg(r.correct === '1' ? 'check' : 'x')), el('span', { class: 'grow', text: (k + 1) + '. ' + it.topic })),
          el('p', { class: 'stem', text: it.stem }), el('p', { class: 'lead', text: it.lead }), optionList(it, r.chosen, null, true), explain(it), flagBtn(it));
      })));
};

function people() { return D().people || []; }
function nameOf(pid) { var p = people().filter(function (x) { return x.person_code === pid; })[0]; return p && p.name ? p.name : pid; }
function cohortName(id) { var c = (D().cohorts || []).filter(function (x) { return x.cohort_id === id; })[0]; return c ? c.name : id; }
function allItems() { return T.S.items || []; }
function staffItem(id) { return allItems().filter(function (i) { return i.item_id === id; })[0]; }
function statusChip(s) { return chipEl(s === 'Live' ? 'ok' : s === 'Draft' ? 'due' : '', s === 'Live' ? 'check' : s === 'Reserved' ? 'lock' : s === 'Draft' ? 'wait' : 'x', s); }
function loadStats(force) {
  if (T.statsLoading || (T.stats && !force) || T.preview) return;
  if (!navigator.onLine) { T.statsErr = 'No signal. Connect to see the analysis.'; return; }
  T.statsLoading = true; T.statsErr = '';
  setTimeout(function () {
    api({ op: 'stats', token: T.S.token }).then(function (r) {
      T.statsLoading = false;
      if (r.ok) { T.stats = r; T.statMap = {}; (r.items || []).forEach(function (s) { T.statMap[s.item_id] = s; }); } else T.statsErr = r.error || 'Could not load.';
      if (['analysis', 'item', 'home'].indexOf(T.screen) >= 0) softRender();
    }).catch(function () { T.statsLoading = false; T.statsErr = 'Could not reach the workbook.'; softRender(); });
  }, 0);
}

// ---------- home (staff) ----------
function foldList(id, icon, title, tier, rows, help, empty) {
  var open = T.fold[id] === undefined ? tier === 1 && rows.length > 0 : T.fold[id];
  return el('div', { id: id, class: 'hlist' + (rows.length ? '' : ' none') },
    el('button', { class: 'foldhead t' + (rows.length ? tier : 9), type: 'button', onclick: function () { T.fold[id] = !open; render(); } }, svg(icon), el('span', { class: 'grow' }, title, help ? qm(help) : null), el('span', { class: 'schip t' + (rows.length ? tier : 9), text: String(rows.length) }), svg(open ? 'down' : 'next')),
    open ? (rows.length ? el('div', { class: 'card list' }, rows.slice(0, T.fold[id + 'all'] ? 500 : 4), rows.length > 4 && !T.fold[id + 'all'] ? el('button', { class: 'linkbtn', type: 'button', onclick: function () { T.fold[id + 'all'] = true; render(); } }, 'See all ' + rows.length) : null) : el('p', { class: 'muted', text: empty || 'Nothing here.' })) : null);
}
function homeStaff() {
  var d = D(), r = role(), S = T.S, lists = [], chipsL = [];
  function add(id, icon, title, tier, rows, help, empty, label) { lists.push([rows.length ? tier : 9, foldList(id, icon, title, tier, rows, help, empty)]); chipsL.push({ k: id, tier: tier, icon: icon, label: label || title, n: rows.length }); }
  if (canManage()) {
    var pend = people().filter(function (p) { return p.status === 'pending'; });
    add('h-req', 'users', 'Join requests', 1, pend.map(function (p) {
      return el('div', { class: 'row', 'data-pid': p.person_code }, el('div', { class: 'grow' }, el('b', { text: p.name }), el('div', { class: 'sm', text: cohortName(p.cohort_id) + ' | ' + (p.mobile || '') + ' | ' + fmtDate(p.requested_at) })),
        el('div', { class: 'col' }, btn('primary small', 'check', 'Confirm', function () { call('confirm', { pid: p.person_code, yes: true }, p.name + ' confirmed.'); }), btn('small', 'x', 'Decline', function () { askSheet('Decline ' + p.name + '?', 'Their phone will be told the request was not accepted.', 'Decline', function () { call('confirm', { pid: p.person_code, yes: false }, 'Declined.'); }, true); })));
    }), 'Join request', 'No one is waiting.', 'Requests');
    var late = (d.attempts || []).filter(function (a) { return a.late_flag; });
    var openCh = (d.challenges || []).filter(function (c) { return c.status === 'open'; });
    add('h-flags', 'flag', 'Items flagged by participants', 2, openCh.map(function (c) {
      return el('button', { class: 'row', type: 'button', 'data-ch': c.ch_id, onclick: function () { T.itemId = c.item_id; T.itemBack = 'home'; go('item'); } }, el('div', { class: 'grow' }, el('b', { text: c.item_id }), el('div', { class: 'sm', text: c.reason }), el('div', { class: 'sm', text: 'From ' + nameOf(c.person_code) + ', ' + fmtDate(c.at) })), svg('next'));
    }), 'Flag', 'No open flags.', 'Flags');
    var drafts = allItems().filter(function (i) { return i.status === 'Draft'; });
    add('h-draft', 'wait', 'Items waiting for approval', 2, drafts.length ? [el('button', { class: 'row', type: 'button', id: 'godrafts', onclick: function () { T.itf = { status: 'Draft', pool: '', q: '' }; go('items'); } }, el('div', { class: 'grow' }, el('b', { text: plural(drafts.length, 'draft item') }), el('div', { class: 'sm', text: 'Only Live items reach participants.' })), svg('next'))] : [], 'Draft', 'No drafts.', 'Drafts');
    var toRel = (d.papers || []).filter(function (p) { return p.mode === 'timed' && p.status === 'published' && nowMs() > paperCloseMs_(p) + setV('grace_min') * 60000; });
    add('h-rel', 'unlockic', 'Closed papers with items still reserved', 2, toRel.map(function (p) { return el('button', { class: 'row', type: 'button', onclick: function () { T.paperId = p.paper_id; go('paper'); } }, el('div', { class: 'grow' }, el('b', { text: p.title }), el('div', { class: 'sm', text: 'Release its items to practice when you are ready.' })), svg('next')); }), 'Reserved', 'None.', 'To release');
    add('h-late', 'alert', 'Papers with a note (late, over time, clock)', 2, late.map(function (a) { return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: nameOf(a.person_code) }), el('div', { class: 'sm', text: a.paper_id + ': ' + a.late_flag })), null); }), 'Late flag', 'None.', 'Notes');
  }
  if (r !== 'writer') {
    var soon = (d.papers || []).filter(function (p) { return p.mode === 'timed' && p.status === 'published' && nowMs() <= paperCloseMs_(p); });
    add('h-papers', 'clock', 'Timed papers coming up or open', 3, soon.map(function (p) {
      var n = (d.attempts || []).filter(function (a) { return a.paper_id === p.paper_id; }).length;
      return el('button', { class: 'row', type: 'button', onclick: canManage() ? function () { T.paperId = p.paper_id; go('paper'); } : null }, el('div', { class: 'grow' }, el('b', { text: p.title }), el('div', { class: 'sm', text: cohortName(p.cohort_id) + ' | opens ' + fmtDate(p.opens) + ' | ' + n + ' sat' })), canManage() ? svg('next') : null);
    }), 'Timed paper', 'None set.', 'Papers');
    var recent = (d.attempts || []).slice().sort(function (a, b) { return a.received < b.received ? 1 : -1; }).slice(0, 30);
    add('h-recent', 'list', 'Latest tests', 3, recent.map(function (a) { return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: nameOf(a.person_code) }), el('div', { class: 'sm', text: (a.mode === 'timed' ? a.paper_id : 'Practice') + ' | ' + fmtDate(a.received.slice(0, 16)) })), el('b', { text: a.score + '/' + a.n_items })); }), null, 'No tests yet.', 'Tests');
  }
  if (r === 'writer') {
    var mine = allItems(), ch = (d.challenges || []).filter(function (c) { return c.status === 'open'; });
    add('h-flags', 'flag', 'Your items flagged by participants', 2, ch.map(function (c) { return el('button', { class: 'row', type: 'button', onclick: function () { T.itemId = c.item_id; T.itemBack = 'home'; go('item'); } }, el('div', { class: 'grow' }, el('b', { text: c.item_id }), el('div', { class: 'sm', text: c.reason })), svg('next')); }), 'Flag', 'No open flags.', 'Flags');
    add('h-mine', 'ledger', 'Your items', 3, ['Draft', 'Live', 'Reserved', 'Retired'].map(function (s) { var n = mine.filter(function (i) { return i.status === s; }).length; return n ? el('div', { class: 'row' }, el('div', { class: 'grow', text: s }), el('b', { text: String(n) })) : null; }).filter(Boolean), null, 'No items are linked to you yet.', 'Items');
  }
  lists.sort(function (a, b) { return a[0] - b[0]; });
  return el('div', null, topBar(APP),
    isOwner() && S.updNote ? el('div', { class: 'note', id: 'updnote', text: S.updNote }) : null,
    el('p', { class: 'muted', text: 'Signed in as ' + (d.name || '') + ', ' + ROLE_WORD[r] + '.' }),
    stripChips(chipsL), lists.map(function (x) { return x[1]; }));
}

// ---------- items ----------
function filteredItems() {
  var f = T.itf = T.itf || { status: '', pool: '', q: '' }, q = f.q.trim().toLowerCase();
  return allItems().filter(function (i) { return (!f.status || i.status === f.status) && (!f.pool || i.pool === f.pool) && (!q || (i.item_id + ' ' + i.topic + ' ' + i.g + ' ' + i.stem).toLowerCase().indexOf(q) >= 0); });
}
function itemRows() {
  var list = filteredItems();
  return el('div', { id: 'itemlist' }, el('p', { class: 'muted', id: 'itemcount', text: plural(list.length, 'item') + ' shown.' }),
    canManage() && (T.itf.status === 'Draft') && list.length ? btn('primary wide', 'check', 'Approve all ' + list.length + ' shown', function () {
      askSheet('Approve ' + plural(list.length, 'item') + '?', 'They become Live: participants whose group has this level and pool will meet them in practice.', 'Approve', function () { call('itemSet', { ids: list.map(function (i) { return i.item_id; }), status: 'Live' }, 'Approved.'); });
    }, 'approveall') : null,
    el('div', { class: 'card list' }, list.slice(0, T.itemMax || 60).map(function (i) {
      return el('button', { class: 'row', type: 'button', 'data-item': i.item_id, onclick: function () { T.itemId = i.item_id; T.itemBack = 'items'; go('item'); } },
        el('div', { class: 'grow' }, el('b', { text: i.item_id }), el('div', { class: 'sm', text: i.topic }), el('div', { class: 'sm', text: i.g + ' | ' + levelCode_(i.level) + ' | ' + bloomC_(i.bloom) })), statusChip(i.status));
    })),
    list.length > (T.itemMax || 60) ? btn('wide', 'down', 'Show more', function () { T.itemMax = (T.itemMax || 60) + 120; render(); }) : null);
}
SCREENS.items = function () {
  var f = T.itf = T.itf || { status: '', pool: '', q: '' }, pools = [];
  allItems().forEach(function (i) { if (pools.indexOf(i.pool) < 0) pools.push(i.pool); }); pools.sort();
  return el('div', null, topBar('Items'),
    el('input', { id: 'itemq', type: 'search', placeholder: 'Item number, topic or words in the stem', value: f.q, oninput: function (e) { f.q = e.target.value; document.getElementById('itemlist').replaceWith(itemRows()); } }),
    el('label', { class: 'f' }, 'Status', qm('Draft')), chips(['', 'Draft', 'Live', 'Reserved', 'Retired'], f.status, function (x) { f.status = x; T.itemMax = 60; document.getElementById('itemlist').replaceWith(itemRows()); }, 'fstatus', function (x) { return x || 'All'; }),
    pools.length > 1 ? [el('label', { class: 'f' }, 'Pool', qm('Pool')), chips([''].concat(pools), f.pool, function (x) { f.pool = x; T.itemMax = 60; document.getElementById('itemlist').replaceWith(itemRows()); }, 'fpool', function (x) { return x ? (POOL_NAMES[x] || x) : 'All'; })] : null,
    itemRows());
};
function statBlock(title, s, key) {
  if (!s || !s.n) return el('div', { class: 'card' }, el('b', { text: title }), el('p', { class: 'muted', text: 'No answers yet.' }));
  return el('div', { class: 'card statblock' }, el('div', { class: 'row' }, el('b', { text: title }), stateChip(s.state)),
    el('div', { class: 'kv' }, el('span', null, 'Answers', qm('First attempt')), el('b', { text: String(s.n) })),
    el('div', { class: 'kv' }, el('span', null, 'Difficulty index', qm('Difficulty index')), el('b', { text: s.state === 'too few' ? 'Not judged' : s.p.toFixed(2) + ' (' + s.lo + ' to ' + s.hi + '%)' })),
    title.indexOf('Timed') === 0 ? el('div', { class: 'kv' }, el('span', null, 'Discrimination', qm('Discrimination')), el('b', { text: s.state === 'too few' || s.rpb === null ? 'Not judged' : s.rpb.toFixed(2) + ' (' + s.cat + ')' })) : null,
    el('div', { class: 'optbars' }, CFG.OPTS.map(function (L) {
      var w = el('span', { class: 'bar' + (L === key ? ' key' : '') }); w.style.width = Math.round(s.opts[L] * 100 / s.n) + '%';
      return el('div', { class: 'optbar' }, el('b', { text: L }), el('div', { class: 'track' }, w), el('span', { class: 'num', text: s.opts[L] + (s.unused.indexOf(L) >= 0 ? ' unused' : '') }));
    })),
    s.blank ? el('div', { class: 'sm', text: s.blank + ' left blank' }) : null,
    s.unused.length ? el('p', { class: 'sm' }, 'Options chosen by under ' + setV('distractor_pct') + '%: ' + s.unused.join(', '), qm('Non-functioning option')) : null,
    s.flags.map(function (f) { return el('div', { class: 'warn sm flagline', text: f }); }),
    s.state === 'too few' ? el('p', { class: 'sm muted', text: 'Fewer than ' + setV('item_min') + ' answers: too few to judge this item.' }) : s.state === 'provisional' ? el('p', { class: 'sm muted', text: 'Fewer than ' + setV('item_full') + ' answers: figures can still move a good deal.' }) : null);
}
SCREENS.item = function () {
  var it = staffItem(T.itemId), d = D();
  if (!it) return el('div', null, backBar('Item', T.itemBack || 'items'), el('p', { class: 'muted', text: 'That item is not on this phone.' }));
  if (role() !== 'tutor') loadStats(false);
  var st = T.statMap && T.statMap[it.item_id], ch = (d.challenges || []).filter(function (c) { return c.item_id === it.item_id; }), fb = (d.fbItem || []).filter(function (f) { return f.item_id === it.item_id; });
  var groups = []; allItems().forEach(function (i) { if (groups.indexOf(i.g) < 0) groups.push(i.g); }); groups.sort();
  var writers = people().filter(function (p) { return p.role === 'writer' || p.role === 'owner' || p.role === 'examiner'; });
  return el('div', { id: 'itempage' }, backBar(it.item_id, T.itemBack || 'items'),
    el('div', { class: 'row' }, statusChip(it.status), el('span', { class: 'sm', text: 'Version ' + it.version + ' | ' + it.level + ' | ' + it.bloom + ' | ' + it.difficulty_est }), qm('Estimated difficulty')),
    el('p', { class: 'sm', text: it.topic }),
    el('div', { class: 'row' }, el('span', { class: 'sm grow' }, 'Topic group: ', el('b', { id: 'itemgroup', text: it.g }), it.group_confirmed_by ? '' : ' (draft)', qm('Topic group')),
      canManage() ? btn('small', 'edit', 'Change', function () {
        pickSheet('Topic group for ' + it.item_id, groups.concat(['Type a new group']), [it.g], false, function (g) {
          if (g !== 'Type a new group') { call('itemSet', { ids: [it.item_id], topic_group: g }, 'Topic group saved.'); return; }
          var box; sheetOpen(function () { return sheetWrap('New topic group', [el('h2', { text: 'New topic group' }), box = inp('newgroup', ''), el('div', { class: 'actions2' }, btn('', 'x', 'Cancel', sheetClose), btn('primary', 'check', 'Save', function () { var v = box.value.trim(); if (v.length < 3) { toast('Give it a name.'); return; } T.sheet = null; call('itemSet', { ids: [it.item_id], topic_group: v }, 'Topic group saved.'); }, 'newgroupsave'))]); });
        });
      }, 'groupedit') : null),
    el('p', { class: 'stem', text: it.stem }), el('p', { class: 'lead', text: it.lead }), optionList(it, '', null, true), explain(it),
    el('div', { class: 'sm muted', text: 'From ' + it.bank_file + ', page ' + it.page + ' | paper set ' + (it.paper_set || 'none') + ' | writer ' + (it.writer ? nameOf(it.writer) : 'not set') }),
    canManage() ? el('div', { class: 'actions3', id: 'itemactions' },
      it.status === 'Draft' ? btn('primary', 'check', 'Approve', function () { call('itemSet', { ids: [it.item_id], status: 'Live' }, 'Now Live.'); }, 'itemapprove') : null,
      it.status === 'Live' || it.status === 'Draft' ? btn('', 'x', 'Retire', function () { askSheet('Retire ' + it.item_id + '?', 'It leaves every pool. Its answers so far are kept.', 'Retire', function () { call('itemSet', { ids: [it.item_id], status: 'Retired' }, 'Retired.'); }, true); }, 'itemretire') : null,
      it.status === 'Retired' ? btn('', 'check', 'Make Live again', function () { call('itemSet', { ids: [it.item_id], status: 'Live' }, 'Now Live.'); }) : null,
      isOwner() ? btn('', 'users', 'Writer', function () { pickSheet('Writer of ' + it.item_id, writers.map(function (w) { return w.person_code; }), [it.writer], false, function (w) { call('itemSet', { ids: [it.item_id], writer: w }, 'Writer saved.'); }, nameOf); }, 'itemwriter') : null) : null,
    role() !== 'tutor' ? [h2('summary', 'Item analysis', 'Item analysis'),
      T.statsErr ? el('p', { class: 'err', text: T.statsErr }) : !T.stats ? el('p', { class: 'muted', text: 'Loading the analysis' }) :
        st ? [statBlock('Timed papers', st.exam, st.key), statBlock('Practice, first attempts', st.practice, st.key), el('p', { class: 'sm muted', text: 'Practice is untimed and may be done with books open, so its figures are the less reliable of the two.' })]
          : el('p', { class: 'muted', id: 'nostats', text: 'No answers recorded for this version yet.' })] : null,
    fb.length ? [h2('msg', 'Written feedback on this item', 'Written feedback'), fb.map(function (f) { return el('div', { class: 'card fbtext' }, el('div', { class: 'sm', text: fmtDate(f.written_at) + ' | ' + f.n_exam + ' timed, ' + f.n_practice + ' practice answers' }), el('p', { class: 'pre', text: f.text })); })] : null,
    ch.length ? [h2('flag', 'Flags from participants', 'Flag'), el('div', { class: 'card list', id: 'itemflags' }, ch.map(function (c) {
      return el('div', { class: 'row', 'data-ch': c.ch_id }, el('div', { class: 'grow' }, el('div', { text: c.reason }), el('div', { class: 'sm', text: (c.person_code ? nameOf(c.person_code) + ', ' : '') + fmtDate(c.at) + ' | ' + (c.status === 'open' ? 'open' : c.status === 'upheld' ? 'upheld' : 'not upheld') }), c.reply ? el('div', { class: 'sm reply', text: 'Reply: ' + c.reply }) : null),
        canManage() && c.status === 'open' ? btn('small', 'msg', 'Answer', function () {
          var ta; sheetOpen(function () { return sheetWrap('Answer the flag', [el('h2', { text: 'Answer the flag' }), el('p', { class: 'muted', text: c.reason }), ta = el('textarea', { id: 'chreply', rows: '3', placeholder: 'Reply shown to the participant' }),
            el('div', { class: 'actions2' }, btn('', 'x', 'Not upheld', function () { T.sheet = null; call('chReply', { ch_id: c.ch_id, status: 'rejected', reply: ta.value }, 'Saved.'); }, 'chno'), btn('primary', 'check', 'Upheld', function () { T.sheet = null; call('chReply', { ch_id: c.ch_id, status: 'upheld', reply: ta.value }, 'Saved.'); }, 'chyes'))]); });
        }) : null);
    }))] : null);
};

// ---------- import a bank PDF ----------
function loadScript(src) { return new Promise(function (ok, no) { if (document.querySelector('script[data-src="' + src + '"]')) return ok(); var s = el('script', { src: src, 'data-src': src }); s.onload = ok; s.onerror = function () { s.remove(); no(new Error('load')); }; document.head.appendChild(s); }); }
function readBank(file) {
  var I = T.imp = { name: file.name, stage: 'Opening the PDF reader' }; render();
  return loadScript('pdf.min.js').then(function () {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';
    return file.arrayBuffer();
  }).then(function (buf) {
    return MCQReader.partsOf(window.pdfjsLib, new Uint8Array(buf), function (n, of) { if (n % 20 === 0 || n === of) { I.stage = 'Reading page ' + n + ' of ' + of; var s = document.getElementById('impstage'); if (s) s.textContent = I.stage; } });
  }).then(function (pages) {
    var out = MCQReader.parse(pages), have = {};
    allItems().forEach(function (i) { have[i.item_id] = i; });
    I.items = out.items; I.report = out.report; I.stage = '';
    I.known = out.items.filter(function (i) { return have[i.item_id]; }).length;
    render();
  }).catch(function (e) { T.imp = { name: file.name, error: 'This file could not be read as a bank PDF (' + ((e && e.message) || 'unknown') + ').' }; render(); });
}
function sendBank() {
  var I = T.imp, good = I.items.filter(function (i) { return !i.problems.length; }), tot = { added: 0, updated: 0, same: 0, bad: [] }, at = 0;
  I.sending = true; render();
  function next() {
    if (at >= good.length) { I.sending = false; I.done = tot; return sync(true).then(render); }
    var batch = good.slice(at, at + 40).map(function (i) { var o = Object.assign({}, i); delete o.problems; return o; });
    I.stage = 'Sending ' + Math.min(at + 40, good.length) + ' of ' + good.length; var s = document.getElementById('impstage'); if (s) s.textContent = I.stage;
    return api({ op: 'importItems', token: T.S.token, items: batch, writer: I.writer, bank_file: I.name }).then(function (r) {
      if (!r.ok) { I.sending = false; I.error = r.error || 'The workbook refused the import.'; render(); return; }
      tot.added += r.added; tot.updated += r.updated; tot.same += r.same; tot.bad = tot.bad.concat(r.bad); at += 40; return next();
    }).catch(function () { I.sending = false; I.error = 'The connection dropped after ' + at + ' items. Import the same file again: items already in are skipped.'; render(); });
  }
  return next();
}
SCREENS.import = function () {
  var I = T.imp, writers = people().filter(function (p) { return p.role === 'writer' || p.role === 'owner' || p.role === 'examiner'; });
  var top = backBar('Import a bank PDF', 'items');
  if (!I) return el('div', null, top, el('p', { text: 'Choose a bank PDF made by the item writer (one item per page, with the answer key table at the end). Nothing is added until you have seen the check report.' }),
    el('p', { class: 'muted' }, 'Items arrive as Draft', qm('Draft'), ' and reach nobody until approved.'),
    el('input', { type: 'file', id: 'bankfile', accept: 'application/pdf,.pdf', onchange: function (e) { if (e.target.files[0]) readBank(e.target.files[0]); } }));
  if (I.error && !I.items) return el('div', null, top, el('p', { class: 'err', id: 'imperr', text: I.error }), btn('wide', 'back', 'Choose another file', function () { T.imp = null; render(); }));
  if (!I.items) return el('div', null, top, el('p', { id: 'impstage', text: I.stage }));
  var R = I.report, good = I.items.filter(function (i) { return !i.problems.length; }).length;
  if (I.done) return el('div', { id: 'impdone' }, top, el('div', { class: 'card' }, el('b', { text: 'Import finished' }),
    el('div', { class: 'kv' }, el('span', { text: 'New items (Draft)' }), el('b', { id: 'impadded', text: String(I.done.added) })),
    el('div', { class: 'kv' }, el('span', { text: 'New versions of items already in' }), el('b', { text: String(I.done.updated) })),
    el('div', { class: 'kv' }, el('span', { text: 'Already in, unchanged' }), el('b', { text: String(I.done.same) })),
    el('div', { class: 'kv' }, el('span', { text: 'Refused by the workbook' }), el('b', { text: String(I.done.bad.length) })),
    I.done.bad.map(function (b) { return el('div', { class: 'sm warn', text: b.item_id + ': ' + b.why }); })),
    btn('primary wide', 'check', 'See the drafts', function () { T.itf = { status: 'Draft', pool: '', q: '' }; T.imp = null; go('items'); }, 'impdrafts'));
  var a = R.agree, allAgree = R.keyRows && ['key', 'level', 'bloom', 'difficulty'].every(function (k) { return a[k] === R.itemPages; });
  return el('div', { id: 'impreport' }, top, el('p', { class: 'sm', text: I.name }),
    el('div', { class: 'card' }, el('b', { text: 'Check report' }),
      el('div', { class: 'kv' }, el('span', { text: 'Pages in the file' }), el('b', { text: String(R.pages) })),
      el('div', { class: 'kv' }, el('span', { text: 'Item pages read' }), el('b', { id: 'impitems', text: String(R.itemPages) })),
      el('div', { class: 'kv' }, el('span', { text: 'Items with every field read' }), el('b', { id: 'impgood', text: String(good) })),
      el('div', { class: 'kv' }, el('span', { text: 'Rows in the answer key table' }), el('b', { text: String(R.keyRows) })),
      el('div', { class: 'kv' }, el('span', { text: 'Key, level, Bloom and difficulty agree with that table' }), el('b', { id: 'impagree', class: allAgree ? '' : 'warn', text: allAgree ? 'All ' + R.itemPages : 'key ' + a.key + ', level ' + a.level + ', Bloom ' + a.bloom + ', difficulty ' + a.difficulty })),
      el('div', { class: 'kv' }, el('span', { text: 'Undergraduate / postgraduate' }), el('b', { text: R.levels.UG + ' / ' + R.levels.PG })),
      el('div', { class: 'kv' }, el('span', { text: 'Key positions A to E' }), el('b', { text: CFG.OPTS.map(function (L) { return R.keys[L]; }).join(', ') })),
      el('div', { class: 'kv' }, el('span', { text: 'Item numbers already in the pool' }), el('b', { text: String(I.known) })),
      el('p', { class: 'sm muted', text: 'Compare the counts with the cover page of the PDF before importing.' })),
    R.bad.length ? el('div', { class: 'card', id: 'impbad' }, el('b', { class: 'warn', text: plural(R.bad.length, 'item') + ' will NOT be imported' }), R.bad.slice(0, 40).map(function (b) { return el('div', { class: 'sm', text: b.item_id + (b.page ? ' (page ' + b.page + ')' : '') + ': ' + b.why }); })) : null,
    R.keyRowWithoutPage.length ? el('p', { class: 'warn sm', text: 'In the answer key table but with no item page: ' + R.keyRowWithoutPage.slice(0, 10).join(', ') }) : null,
    el('label', { class: 'f' }, 'Writer of these items', qm('Writer')),
    el('button', { class: 'btn wide', type: 'button', id: 'impwriter', onclick: function () { pickSheet('Writer of these items', writers.map(function (w) { return w.person_code; }), [I.writer], false, function (w) { I.writer = w; render(); }, nameOf); } }, svg('users'), el('span', { text: I.writer ? nameOf(I.writer) : 'Choose the writer' })),
    I.error ? el('p', { class: 'err', text: I.error }) : null,
    I.sending ? el('p', { id: 'impstage', text: I.stage || 'Sending' }) : btn('primary wide', 'update', 'Import ' + plural(good, 'item') + ' as Draft', function () { if (!I.writer) { toast('Choose the writer first.'); return; } if (!good) { toast('No item can be imported.'); return; } I.error = ''; sendBank(); }, 'impgo'));
};

// ---------- papers ----------
function paperStatusText(p) {
  if (p.status === 'draft') return 'Draft';
  if (p.mode !== 'timed') return 'Practice paper, published';
  var n = nowMs(), c = paperCloseMs_(p);
  return p.status === 'released' ? 'Closed, items released' : n > c ? 'Closed' : n >= pkMs_(p.opens) ? 'Open now' : 'Opens ' + fmtDate(p.opens);
}
SCREENS.papers = function () {
  var d = D(), list = (d.papers || []).slice().sort(function (a, b) { return a.created_at < b.created_at ? 1 : -1; });
  return el('div', null, topBar('Papers'),
    !(d.cohorts || []).length ? el('div', { class: 'note', text: 'Make a group first: Settings > Groups.' }) : null,
    list.length ? el('div', { class: 'card list', id: 'paperlist' }, list.map(function (p) {
      return el('button', { class: 'row', type: 'button', 'data-paper': p.paper_id, onclick: function () { if (p.status === 'draft') openPaperForm(p); else { T.paperId = p.paper_id; go('paper'); } } },
        el('span', { class: 'rowic' }, svg(p.mode === 'timed' ? 'clock' : 'target')),
        el('div', { class: 'grow' }, el('b', { text: p.title }), el('div', { class: 'sm', text: cohortName(p.cohort_id) + ' | ' + plural(p.items.split(',').length, 'item') + (p.mode === 'timed' ? ' | ' + p.minutes + ' min' : '') }), el('div', { class: 'sm', text: paperStatusText(p) })), svg('next'));
    })) : el('p', { class: 'muted', text: 'No paper yet. Use New paper.' }));
};
function openPaperForm(p) {
  var c0 = (D().cohorts || [])[0];
  T.pf = p ? { paper_id: p.paper_id, cohort_id: p.cohort_id, title: p.title, mode: p.mode, setting: p.setting || 'own', minutes: p.minutes, pass_mark: p.pass_mark, opens: p.opens, closes: p.closes, items: p.items.split(',').filter(Boolean), add: { n: 20, groups: [], bloom: '', set: '' } }
    : { paper_id: '', cohort_id: c0 ? c0.cohort_id : '', title: '', mode: 'timed', setting: 'own', minutes: '', pass_mark: '', opens: '', closes: '', items: [], add: { n: 20, groups: [], bloom: '', set: '' } };
  go('paperform');
}
function cohortPool(cid) {
  var c = (D().cohorts || []).filter(function (x) { return x.cohort_id === cid; })[0]; if (!c) return [];
  var pools = String(c.pools || '').split(',').filter(Boolean);
  return allItems().filter(function (i) { return i.status === 'Live' && levelCode_(i.level) === c.level && (!pools.length || pools.indexOf(i.pool) >= 0); });
}
// Warnings while a paper is built: paper sets mixed, and stems from different bank files that share many words.
function paperWarnings(ids) {
  var its = ids.map(staffItem).filter(Boolean), out = [], sets = {}, pairs = [];
  its.forEach(function (i) { var k = i.bank_file + ' set ' + (i.paper_set || '?'); sets[k] = (sets[k] || 0) + 1; });
  var byFile = {}; its.forEach(function (i) { (byFile[i.bank_file] = byFile[i.bank_file] || {})[i.paper_set || '?'] = 1; });
  Object.keys(byFile).forEach(function (f) { var s = Object.keys(byFile[f]); if (s.length > 1) out.push('Items from paper sets ' + s.sort().join(', ') + ' of ' + f + ' are mixed. The writer keeps items that give each other away in different sets; check the audit before mixing sets.'); });
  if (its.length <= 150) {
    var w = its.map(function (i) { return stemWords_(i.stem); });
    for (var a = 0; a < its.length; a++) for (var b = a + 1; b < its.length; b++) if (its[a].bank_file !== its[b].bank_file && overlap_(w[a], w[b]) >= 0.4) pairs.push(its[a].item_id + ' and ' + its[b].item_id);
    if (pairs.length) out.push('Stems from different banks that share many words (possible near-duplicates): ' + pairs.slice(0, 6).join('; ') + (pairs.length > 6 ? ' and ' + (pairs.length - 6) + ' more' : '') + '.');
  }
  return out;
}
SCREENS.paperform = function () {
  var F = T.pf, d = D(), cohorts = d.cohorts || [], pool = cohortPool(F.cohort_id), inPool = {}, err = el('div', { class: 'err', id: 'pferr' });
  pool.forEach(function (i) { inPool[i.item_id] = i; });
  F.items = F.items.filter(function (x) { return inPool[x]; });
  var groups = [], sets = []; pool.forEach(function (i) { if (groups.indexOf(i.g) < 0) groups.push(i.g); if (i.paper_set && sets.indexOf(i.paper_set) < 0) sets.push(i.paper_set); }); groups.sort(); sets.sort();
  var A = F.add, cand = pool.filter(function (i) { return F.items.indexOf(i.item_id) < 0 && (!A.groups.length || A.groups.indexOf(i.g) >= 0) && (!A.bloom || bloomC_(i.bloom) === A.bloom) && (!A.set || i.paper_set === A.set); });
  function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
  function grab() { F.title = val('pftitle'); if (F.mode === 'timed') { F.minutes = val('pfmin'); F.pass_mark = val('pfpass'); F.opens = val('pfopens').replace('T', ' '); F.closes = val('pfcloses').replace('T', ' '); } }
  function redraw() { grab(); var y = window.scrollY; render(); window.scrollTo(0, y); }
  function send(publish) {
    grab();
    var body = { paper_id: F.paper_id, cohort_id: F.cohort_id, title: F.title, mode: F.mode, setting: F.setting, minutes: F.minutes, pass_mark: F.pass_mark, opens: F.opens, closes: F.setting === 'supervised' ? '' : F.closes, items: F.items };
    var pre = Promise.resolve();
    if (publish) {
      body.status = 'published';
      if (F.mode === 'timed' && F.setting === 'supervised') {
        body.start_code = String(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);
        pre = lockPaper(body.start_code, shuffle(F.items).map(function (x) { var i = inPool[x]; return { item_id: i.item_id, version: i.version, stem: i.stem, lead: i.lead, opts: i.opts }; })).then(function (blob) { body.blob = blob; });
      }
    }
    err.textContent = 'Saving';
    pre.then(function () { return call('paper', body); }).then(function (r) {
      if (!r) { err.textContent = ''; return; }
      if (publish && r.exposed && r.exposed.length) T.exposed = { paper_id: r.paper_id, list: r.exposed }; else T.exposed = null;
      if (publish) { T.paperId = r.paper_id; T.pf = null; go('paper'); toast('Published.', true); } else { F.paper_id = r.paper_id; toast('Draft saved.', true); err.textContent = ''; }
    });
  }
  var warns = paperWarnings(F.items);
  return el('div', { id: 'paperform' }, backBar(F.paper_id ? 'Draft paper' : 'New paper', 'papers'),
    !cohorts.length ? el('div', { class: 'note', text: 'Make a group first: Settings > Groups.' }) : null,
    el('label', { class: 'f' }, 'Group', qm('Group')), chips(cohorts.map(function (c) { return c.cohort_id; }), F.cohort_id, function (x) { grab(); F.cohort_id = x; render(); }, 'pfcohort', cohortName),
    field('Title', inp('pftitle', F.title, { placeholder: 'For example: Block test 1' })),
    el('label', { class: 'f' }, 'Kind', qm('Timed paper')), chips(['timed', 'set'], F.mode, function (x) { grab(); F.mode = x; render(); }, 'pfmode', function (x) { return x === 'timed' ? 'Timed paper' : 'Practice paper'; }),
    F.mode === 'timed' ? [
      el('label', { class: 'f' }, 'Where it is sat', qm('Supervised paper')), chips(['own', 'supervised'], F.setting, function (x) { grab(); F.setting = x; render(); }, 'pfsetting', function (x) { return x === 'own' ? 'Own time, within a window' : 'Supervised, fixed start'; }),
      F.setting === 'own' ? el('p', { class: 'sm warn', text: 'No app can stop outside help or a changed phone clock in a paper sat alone. Late and over-time papers are flagged, not prevented. Treat own-time papers as low stakes.' }) : el('p', { class: 'sm muted', text: 'The paper reaches phones locked. It opens with a six-digit start code that is made when you publish and that you read out in the hall. It closes 15 minutes after its length has run from the start time.' }),
      el('div', { class: 'two' }, field('Length (minutes)', inp('pfmin', F.minutes, { inputmode: 'numeric', placeholder: String(F.items.length || '') })), field('Pass mark (%), optional', inp('pfpass', F.pass_mark, { inputmode: 'numeric' }))),
      field(F.setting === 'own' ? 'Window opens (Pakistan time)' : 'Starts at (Pakistan time)', inp('pfopens', F.opens.replace(' ', 'T'), { type: 'datetime-local' })),
      F.setting === 'own' ? field('Window closes', inp('pfcloses', F.closes.replace(' ', 'T'), { type: 'datetime-local' })) : inp('pfcloses', '', { type: 'hidden' })] : null,
    h2('ledger', 'Items in the paper', F.mode === 'timed' ? 'Reserved' : null, F.items.length),
    F.items.length ? el('div', { class: 'card list', id: 'pfitems' }, F.items.slice(0, T.pfAll ? 400 : 8).map(function (x) { var i = inPool[x]; return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: x }), el('div', { class: 'sm', text: i.g + ' | ' + bloomC_(i.bloom) + ' | set ' + (i.paper_set || '?') })), el('button', { class: 'btn small', type: 'button', 'aria-label': 'Remove ' + x, onclick: function () { F.items = F.items.filter(function (y) { return y !== x; }); redraw(); } }, svg('x'))); }),
      F.items.length > 8 && !T.pfAll ? el('button', { class: 'linkbtn', type: 'button', onclick: function () { T.pfAll = true; redraw(); } }, 'See all ' + F.items.length) : null) : el('p', { class: 'muted', text: 'None yet.' }),
    warns.map(function (w) { return el('div', { class: 'note warnnote', text: w }); }),
    el('div', { class: 'card', id: 'pfadd' }, el('b', { text: 'Add items from the Live pool of this group' }),
      el('button', { class: 'btn wide', type: 'button', id: 'pfgroups', onclick: function () { grab(); pickSheet('Topic groups', groups, A.groups, true, function (g) { A.groups = g; render(); }); } }, svg('list'), el('span', { text: A.groups.length ? plural(A.groups.length, 'topic group') : 'All topic groups' })),
      el('label', { class: 'f', text: 'Bloom level' }), chips(['', 'C1', 'C2', 'C3'], A.bloom, function (x) { A.bloom = x; redraw(); }, 'pfbloom', function (x) { return x || 'All'; }),
      sets.length ? [el('label', { class: 'f' }, 'Paper set', qm('Paper set')), chips([''].concat(sets), A.set, function (x) { A.set = x; redraw(); }, 'pfset', function (x) { return x ? 'Set ' + x : 'All'; })] : null,
      el('p', { class: 'muted', id: 'pfcand', text: plural(cand.length, 'item') + ' match and are not in the paper yet.' }),
      el('div', { class: 'two' }, field('How many', inp('pfn', A.n, { inputmode: 'numeric' })), btn('primary', 'plus', 'Add at random', function () { A.n = Math.max(1, Math.min(300, Number(val('pfn')) || 0)); F.items = F.items.concat(shuffle(cand).slice(0, A.n).map(function (i) { return i.item_id; })); redraw(); }, 'pfrandom')),
      btn('wide', 'list', 'Choose by hand', function () { grab(); pickSheet('Choose items', cand.slice(0, 300).map(function (i) { return i.item_id; }), [], true, function (ids) { F.items = F.items.concat(ids); render(); }, function (x) { return x + ': ' + inPool[x].topic; }); }, 'pfhand')),
    err,
    el('div', { class: 'actions2' }, btn('', 'check', 'Save draft', function () { send(false); }, 'pfsave'),
      btn('primary', 'update', 'Publish', function () { grab(); askSheet('Publish this paper?', F.mode === 'timed' ? 'Its ' + plural(F.items.length, 'item') + ' will be reserved (hidden from practice) and the paper cannot be changed afterwards.' : 'The group will see it under Practice. It cannot be changed afterwards.', 'Publish', function () { send(true); }); }, 'pfpublish')));
};
SCREENS.paper = function () {
  var d = D(), p = (d.papers || []).filter(function (x) { return x.paper_id === T.paperId; })[0];
  if (!p) return el('div', null, backBar('Paper', 'papers'), el('p', { class: 'muted', text: 'Not found.' }));
  var atts = (d.attempts || []).filter(function (a) { return a.paper_id === p.paper_id; }).sort(function (a, b) { return Number(b.score) - Number(a.score); }), rk = ranks_(atts);
  var closed = p.mode === 'timed' && nowMs() > paperCloseMs_(p) + setV('grace_min') * 60000, group = people().filter(function (x) { return x.cohort_id === p.cohort_id && x.status === 'active'; }).length;
  var ex = T.exposed && T.exposed.paper_id === p.paper_id ? T.exposed.list : null;
  return el('div', { id: 'paperpage' }, backBar(p.title, 'papers'),
    el('div', { class: 'card' },
      el('div', { class: 'kv' }, el('span', { text: 'Group' }), el('b', { text: cohortName(p.cohort_id) })),
      el('div', { class: 'kv' }, el('span', { text: 'Status' }), el('b', { id: 'paperstatus', text: paperStatusText(p) })),
      el('div', { class: 'kv' }, el('span', { text: 'Items' }), el('b', { text: String(p.items.split(',').length) })),
      p.mode === 'timed' ? [el('div', { class: 'kv' }, el('span', { text: 'Length' }), el('b', { text: p.minutes + ' min' })),
        el('div', { class: 'kv' }, el('span', { text: p.setting === 'supervised' ? 'Starts' : 'Window' }), el('b', { text: fmtDate(p.opens) + (p.closes ? ' to ' + fmtDate(p.closes) : '') })),
        el('div', { class: 'kv' }, el('span', { text: 'Closes for everyone' }), el('b', { text: fmtDate(stampPk_(paperCloseMs_(p)).slice(0, 16)) })),
        p.pass_mark !== '' ? el('div', { class: 'kv' }, el('span', { text: 'Pass mark' }), el('b', { text: p.pass_mark + '%' })) : null,
        el('div', { class: 'kv' }, el('span', { text: 'Sat it' }), el('b', { id: 'papersat', text: atts.length + ' of ' + group }))] : null),
    p.start_code ? el('div', { class: 'card hero', id: 'startcode' }, el('div', { class: 'sm' }, 'Start code to read out in the hall', qm('Start code')), el('div', { class: 'big code', text: p.start_code.slice(0, 3) + ' ' + p.start_code.slice(3) }), el('div', { class: 'sm', text: 'Keep it to yourself until the start.' })) : null,
    ex ? el('div', { class: 'note warnnote', id: 'exposed', text: 'Already met in practice by people of this group, so their statistics from this paper mean less: ' + ex.map(function (x) { return x.item_id + ' (' + x.people + ')'; }).join(', ') + '.' }) : null,
    p.mode === 'timed' && p.status === 'published' && canManage() ? (closed ? btn('primary wide', 'unlockic', 'Release its items to practice', function () { call('release', { paper_id: p.paper_id }, 'Items released.'); }, 'paperrelease') : el('p', { class: 'muted', text: 'Its items stay reserved. They can be released to practice after the paper has closed.' })) : null,
    p.mode === 'timed' ? [h2('summary', 'Results', 'Rank', atts.length), atts.length ? el('div', { class: 'card', id: 'paperresults' }, el('table', { class: 't' }, el('thead', null, el('tr', null, el('th', { text: '#' }), el('th', { text: 'Person' }), el('th', { class: 'num', text: 'Score' }), el('th', { class: 'num', text: '%' }), el('th', null))),
      el('tbody', null, atts.map(function (a) { return el('tr', null, el('td', { text: String(rk[a.person_code].rank) }), el('td', null, nameOf(a.person_code), a.late_flag ? el('div', { class: 'sm warn', text: a.late_flag }) : null, Number(a.interruptions) ? el('div', { class: 'sm', text: 'Left the app ' + a.interruptions + ' time' + (Number(a.interruptions) === 1 ? '' : 's') }) : null), el('td', { class: 'num', text: a.score + '/' + a.n_items }), el('td', { class: 'num', text: a.pct }), el('td', null, a.passed ? chipEl(a.passed === 'Y' ? 'ok' : 'due', null, a.passed === 'Y' ? 'Pass' : 'Fail') : null)); })))) : el('p', { class: 'muted', text: 'Nobody has sat it yet.' })] : null);
};

// ---------- analysis ----------
SCREENS.analysis = function () {
  var d = D(), r = role(), tab = T.anTab || (r === 'writer' ? 'items' : 'groups');
  loadStats(false);
  var tabsL = r === 'writer' ? [['items', 'Items']] : r === 'tutor' ? [['groups', 'Group'], ['people', 'People']] : [['groups', 'Group'], ['people', 'People'], ['items', 'Items']];
  var head = [topBar('Analysis'), tabsL.length > 1 ? el('div', { class: 'seg', id: 'antabs' }, tabsL.map(function (t) { return el('button', { class: tab === t[0] ? 'on' : '', type: 'button', 'data-t': t[0], onclick: function () { T.anTab = t[0]; render(); } }, t[1]); })) : null];
  if (T.statsErr) return el('div', null, head, el('p', { class: 'err', id: 'staterr', text: T.statsErr }), btn('wide', 'sync', 'Try again', function () { loadStats(true); render(); }));
  if (!T.stats) return el('div', null, head, el('p', { class: 'muted', text: 'Working out the analysis' }));
  var cohorts = d.cohorts || [], cid = T.anCohort && cohorts.some(function (c) { return c.cohort_id === T.anCohort; }) ? T.anCohort : (cohorts[0] || {}).cohort_id;
  var pickC = cohorts.length > 1 ? chips(cohorts.map(function (c) { return c.cohort_id; }), cid, function (x) { T.anCohort = x; render(); }, 'ancohort', cohortName) : cohorts.length ? el('p', { class: 'sm', text: cohortName(cid) }) : null;
  if (tab === 'groups') {
    var s = (T.stats.cohorts || {})[cid], fbc = (d.fbCohort || []).filter(function (f) { return f.cohort_id === cid; }).sort(function (a, b) { return a.written_at < b.written_at ? 1 : -1; });
    return el('div', null, head, pickC,
      !s ? el('p', { class: 'muted', text: 'No group yet.' }) : [
        el('div', { class: 'card hero' }, el('div', { class: 'big', id: 'anpeople', text: String(s.people) }), el('div', { class: 'sm', text: 'people have answered, ' + plural(s.responses, 'first-attempt answer') })),
        h2('target', 'Weakest topic groups first', 'Topic group'),
        s.groups.length ? el('div', { class: 'card', id: 'angroups' }, el('table', { class: 't fb' }, el('thead', null, el('tr', null, el('th', { text: 'Topic group' }), el('th', { class: 'num', text: 'Correct' }), el('th', { class: 'num' }, 'Range', qm('95% range')), el('th', { class: 'num', text: 'People' }))),
          el('tbody', null, s.groups.map(function (g) { return el('tr', { class: g.n >= 30 && g.pct < setV('weak_pct') ? 'weak' : '' }, el('td', null, g.k, g.n < 30 ? el('div', { class: 'sm', text: 'Few answers: read with care' }) : null), el('td', { class: 'num', text: g.pct + '% of ' + g.n }), el('td', { class: 'num', text: g.lo + ' to ' + g.hi + '%' }), el('td', { class: 'num', text: String(g.people) })); })))) : el('p', { class: 'muted', text: 'No answers yet.' }),
        h2('book', 'By Bloom level', 'Bloom level'),
        el('div', { class: 'card' }, s.bloom.map(function (b) { return el('div', { class: 'kv' }, el('span', { text: BLOOM_WORD[b.k] || b.k }), el('b', { text: b.pct + '% of ' + b.n })); })),
        h2('clock', 'Timed papers', 'Timed paper'),
        s.papers.length ? el('div', { class: 'card list' }, s.papers.map(function (p) { var pp = (d.papers || []).filter(function (x) { return x.paper_id === p.paper_id; })[0]; return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: pp ? pp.title : p.paper_id }), el('div', { class: 'sm', text: p.n + ' sat | mean ' + p.mean + '%' + (pp && pp.pass_mark !== '' ? ' | ' + p.pass + ' passed' : '') + (p.late ? ' | ' + p.late + ' with a note' : '') })), null); })) : el('p', { class: 'muted', text: 'None sat yet.' }),
        fbc.length ? [h2('msg', 'Written feedback on the group', 'Written feedback'), fbc.map(function (f) { return el('div', { class: 'card fbtext' }, el('div', { class: 'sm', text: fmtDate(f.written_at) + ' | ' + f.n_people + ' people, ' + f.n_responses + ' answers' }), el('p', { class: 'pre', text: f.text })); })] : null,
        r === 'head' || r === 'tutor' || canManage() ? btn('wide', 'doc', 'Summary as PDF', function () { summaryPdf(cid, s); }, 'anpdf') : null]);
  }
  if (tab === 'people') {
    var ps = people().filter(function (p) { return p.cohort_id === cid && p.role === 'participant' && p.status === 'active'; });
    return el('div', null, head, pickC, el('p', { class: 'muted', text: r === 'head' ? 'People are shown by code only.' : 'Tap a person for their tests and written feedback.' }),
      el('div', { class: 'card list', id: 'anpeoplelist' }, ps.map(function (p) {
        var at = (d.attempts || []).filter(function (a) { return a.person_code === p.person_code; }), tm = at.filter(function (a) { return a.mode === 'timed'; });
        var n = at.reduce(function (s2, a) { return s2 + Number(a.n_items); }, 0), c = at.reduce(function (s2, a) { return s2 + Number(a.score); }, 0);
        return el('button', { class: 'row', type: 'button', 'data-pid': p.person_code, onclick: function () { T.personId = p.person_code; go('person'); } }, el('div', { class: 'grow' }, el('b', { text: p.name || p.person_code }), el('div', { class: 'sm', text: plural(at.length, 'test') + ', ' + plural(tm.length, 'timed paper') })), el('b', { text: n ? pct_(c, n) + '%' : '' }), svg('next'));
      })));
  }
  var list = (T.stats.items || []).slice().sort(function (a, b) { return (b.exam.flags.length - a.exam.flags.length) || (b.exam.n + b.practice.n) - (a.exam.n + a.practice.n); });
  var flagged = list.filter(function (s2) { return s2.exam.flags.length; }).length;
  return el('div', null, head, el('p', { class: 'muted', id: 'ansum', text: plural(list.length, 'item') + ' with answers, ' + flagged + ' flagged to look at. A flag asks for a look; it never removes an item.' }),
    el('div', { class: 'card', id: 'anitems' }, list.length ? el('table', { class: 't' }, el('thead', null, el('tr', null, el('th', { text: 'Item' }), el('th', { class: 'num' }, 'Timed', qm('Difficulty index')), el('th', { class: 'num' }, 'Disc.', qm('Discrimination')), el('th', { class: 'num', text: 'Practice' }))),
      el('tbody', null, list.slice(0, 200).map(function (s2) {
        function cell(x) { return x.n ? (x.state === 'too few' ? x.n + ' ans.' : x.p.toFixed(2) + ' (' + x.n + ')') : ''; }
        return el('tr', { class: s2.exam.flags.length ? 'weak' : '', 'data-item': s2.item_id, onclick: function () { T.itemId = s2.item_id; T.itemBack = 'analysis'; go('item'); } }, el('td', null, s2.item_id, s2.exam.flags.length ? el('div', { class: 'sm warn', text: plural(s2.exam.flags.length, 'flag') }) : null), el('td', { class: 'num', text: cell(s2.exam) }), el('td', { class: 'num', text: s2.exam.state !== 'too few' && s2.exam.rpb !== null ? s2.exam.rpb.toFixed(2) : '' }), el('td', { class: 'num', text: cell(s2.practice) }));
      }))) : el('p', { class: 'muted', text: 'No answers yet.' })));
};
SCREENS.person = function () {
  var d = D(), pid = T.personId, at = (d.attempts || []).filter(function (a) { return a.person_code === pid; }).sort(function (a, b) { return a.started < b.started ? 1 : -1; }), fb = (d.fbPerson || []).filter(function (f) { return f.person_code === pid; });
  var pr = progress_(at, d.set);
  return el('div', { id: 'personpage' }, backBar(nameOf(pid), function () { T.anTab = 'people'; go('analysis'); }),
    el('p', { class: 'sm muted', text: pid }),
    h2('summary', 'Progress over time', 'Progress'), pr.enough ? el('p', { text: 'First test ' + pr.first + '%, latest ' + pr.last + '%, over ' + pr.n + ' tests.' }) : el('p', { class: 'muted', text: 'Shown after ' + setV('progress_min') + ' tests (' + pr.n + ' so far).' }),
    h2('list', 'Tests', null, at.length), at.length ? el('div', { class: 'card list' }, at.map(function (a) { var p = (d.papers || []).filter(function (x) { return x.paper_id === a.paper_id; })[0]; return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: p ? p.title : 'Practice' }), el('div', { class: 'sm', text: fmtDate(a.started.slice(0, 16)) + (a.late_flag ? ' | ' + a.late_flag : '') })), el('b', { text: a.score + '/' + a.n_items })); })) : el('p', { class: 'muted', text: 'None yet.' }),
    role() !== 'head' ? [h2('msg', 'Written feedback', 'Written feedback'), fb.length ? fb.map(function (f) { return el('div', { class: 'card fbtext' }, el('div', { class: 'sm', text: fmtDate(f.written_at) + ' | from ' + f.n_responses + ' answers' }), el('p', { class: 'pre', text: f.text })); }) : el('p', { class: 'muted', text: 'None yet.' })] : null);
};
function summaryPdf(cid, s) {
  var bytes = pdfDoc(CFG.APP_NAME, 'Group summary: ' + cohortName(cid), function (p) {
    p.section('Group'); p.kv('People who have answered', s.people); p.kv('First-attempt answers', s.responses);
    p.section('Topic groups, weakest first (percent correct, answers, 95% range)');
    s.groups.forEach(function (g) { p.kv(g.k, g.pct + '% of ' + g.n + ' (' + g.lo + ' to ' + g.hi + '%)'); });
    p.section('Bloom level'); s.bloom.forEach(function (b) { p.kv(BLOOM_WORD[b.k] || b.k, b.pct + '% of ' + b.n); });
    p.section('Timed papers'); s.papers.forEach(function (x) { var pp = (D().papers || []).filter(function (y) { return y.paper_id === x.paper_id; })[0]; p.kv(pp ? pp.title : x.paper_id, x.n + ' sat, mean ' + x.mean + '%'); });
    p.line('Figures rest on the number of answers shown beside each. A topic with few answers should be read with care.');
    p.line('No person is named in this summary.');
  });
  shareFile(new Blob([bytes], { type: 'application/pdf' }), 'MCQ-Bench-summary-' + cid + '.pdf');
}
function exportXlsx(research) {
  toast('Preparing the file.');
  api({ op: 'exportAll', token: T.S.token, research: research }).then(function (r) {
    if (!r.ok) { toast(r.error || 'Could not export.'); return; }
    var sheets = Object.keys(r.tables).map(function (t) {
      var head = r.heads[t].filter(function (h) { return r.tables[t].length ? r.tables[t][0][h] !== undefined : true; });
      var rows = [head.map(function (h) { return { v: h, t: 'h' }; })].concat(r.tables[t].map(function (row) { return head.map(function (h) { var v = String(row[h] === undefined ? '' : row[h]); return /^-?\d+(\.\d+)?$/.test(v) && v.length < 12 && ['score', 'pct', 'n_items', 'seconds', 'position', 'attempt_no', 'first_attempt', 'correct', 'interruptions', 'minutes', 'version'].indexOf(h) >= 0 ? { v: v, t: 'n' } : { v: v.slice(0, 32000), t: 's' }; }); }));
      return { name: t, xml: sheetXml(rows) };
    });
    if (T.stats && T.stats.items && !research) sheets.push({ name: 'ITEM_ANALYSIS', xml: sheetXml([['item_id', 'version', 'key', 'timed_n', 'timed_difficulty', 'timed_lo', 'timed_hi', 'timed_state', 'discrimination', 'practice_n', 'practice_difficulty', 'practice_state', 'flags'].map(function (h) { return { v: h, t: 'h' }; })].concat(T.stats.items.map(function (s) {
      return [{ v: s.item_id, t: 's' }, { v: s.version, t: 'n' }, { v: s.key, t: 's' }, { v: s.exam.n, t: 'n' }, { v: s.exam.p === null ? '' : s.exam.p, t: 'n' }, { v: s.exam.lo, t: 'n' }, { v: s.exam.hi, t: 'n' }, { v: s.exam.state, t: 's' }, { v: s.exam.rpb === null ? '' : s.exam.rpb, t: 'n' }, { v: s.practice.n, t: 'n' }, { v: s.practice.p === null ? '' : s.practice.p, t: 'n' }, { v: s.practice.state, t: 's' }, { v: s.exam.flags.join('; '), t: 's' }]; }))) });
    shareFile(new Blob([xlsxBook(sheets)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), research ? 'MCQ-Bench-research.xlsx' : 'MCQ-Bench-export.xlsx');
  }).catch(function () { toast('Could not reach the workbook.'); });
}

// ---------- "?" quick help: a small pop-up with the glossary meaning of a term, in bullets ----------
function qm(terms) {
  terms = [].concat(terms);
  return el('span', { class: 'qm', role: 'button', tabindex: '0', 'aria-label': 'What is ' + terms[0] + '?', 'data-help': terms[0],
    onclick: function (e) { e.stopPropagation(); e.preventDefault(); openHelp(terms); },
    onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); openHelp(terms); } } }, '?');
}
function helpBullets(d) {
  var parts = /^1\. /.test(d) ? d.split(/\s(?=\d\. )/).map(function (x) { return x.replace(/^\d\.\s*/, ''); }) : d.split(/(?<=[.!?])\s+(?=[A-Z0-9"])/);
  return parts.map(function (x) { return x.trim(); }).filter(Boolean);
}
function openHelp(terms) {
  var all = glossaryTerms(), found = terms.map(function (t) {
    var tl = t.toLowerCase();
    return all.filter(function (x) { return x.t.toLowerCase() === tl; })[0] || all.filter(function (x) { return x.t.toLowerCase().indexOf(tl) === 0; })[0];
  }).filter(Boolean);
  if (!found.length) return;
  var old = document.getElementById('helppop'); if (old) old.remove();
  var close = function () { var h = document.getElementById('helppop'); if (h) h.remove(); updateScrollLock(); };
  var pop = el('div', { class: 'help-bg', id: 'helppop', onclick: function (e) { if (e.target === e.currentTarget) close(); } },
    el('div', { class: 'help', role: 'dialog', 'aria-label': found[0].t },
      found.map(function (x) {
        return el('div', { class: 'helpterm' }, el('b', { text: x.t }), el('ul', null, helpBullets(x.d).map(function (b) { return el('li', { text: b }); })));
      }),
      el('div', { class: 'actions2' },
        btn('', 'book', 'Open glossary', function () { close(); T.gq = found[0].t; T.sheet = null; T.form = null; T.setGroup = 'glossary'; go('settings'); }, 'helpgloss'),
        btn('primary', 'x', 'Close', close, 'helpclose'))));
  document.body.appendChild(pop);
  updateScrollLock();
}

// ---------- Glossary: every term the app uses ----------
function glossaryTerms() {
  var s = D().set || {}, n = function (k) { return setNum_(s, k); };
  var G = [
    ['Tests', 'Practice', 'Untimed. You choose the topics and the number of items. After each answer you see the key, the explanation and the references. You may meet an item again; only your first attempt counts in the statistics.'],
    ['Tests', 'Timed paper', 'A paper set by an examiner with a fixed length. One attempt. The clock keeps running once you start. Your score comes when your answers reach the workbook; keys and explanations open for everyone when the paper has closed.'],
    ['Tests', 'Supervised paper', 'A timed paper sat together in a hall. It reaches the phones locked and opens with the start code read out by the invigilator. It closes 15 minutes after its length has run from the start time.'],
    ['Tests', 'Start code', 'Six digits made when a supervised paper is published. Shown only to the owner and co-examiners. It unlocks the paper on each phone and works without internet.'],
    ['Tests', 'Late flag', 'A note for the examiner on a timed paper: it arrived after the paper closed (more than ' + n('grace_min') + ' minutes late), took longer than allowed, or the phone clock did not match. The paper is still marked; the examiner decides what to do.'],
    ['Tests', 'Rank', 'Your place among those who sat the same timed paper; 1 is the highest score and equal scores share a place. Shown only when at least ' + n('rank_min') + ' people have sat it, so that nobody’s score can be worked out.'],
    ['Tests', 'Percentile', 'The share of the other people who sat the paper and scored lower than you.'],
    ['Feedback', 'Topic group', 'A teaching topic that gathers related items, for example Asthma or Pneumothorax. Items carry very specific topic labels, so feedback is given by topic group. Groups marked draft were proposed automatically and await the owner’s check.'],
    ['Feedback', 'Bloom level', 'The thinking an item asks for, as the item writer labelled it. C1 Remember. C2 Understand. C3 Apply, Analyse or Evaluate.'],
    ['Feedback', 'First attempt', 'Your first answer to an item. Feedback and item statistics count first attempts only, because a repeated item is easier.'],
    ['Feedback', 'Weak topic', 'A topic group in which you have answered at least ' + n('person_min') + ' items and got fewer than ' + n('weak_pct') + '% right at first attempt. Below ' + n('person_min') + ' items a topic is not judged at all. From ' + n('person_min') + ' to ' + (n('person_full') - 1) + ' items it is called provisional. These cut-offs are the owner’s working rules.'],
    ['Feedback', '95% range', 'The range in which your true level in a topic probably lies, given how few or many items it rests on (a 95% Wilson interval). A wide range means: too few items to say much.'],
    ['Feedback', 'Progress', 'Your first and latest test scores, shown once you have done ' + n('progress_min') + ' tests of five items or more.'],
    ['Feedback', 'Written feedback', 'Feedback written by Claude from the recorded answers when the owner runs the feedback skill. It states how many answers each point rests on. The owner can withdraw a whole run.'],
    ['Feedback', 'Flag', 'A participant’s note that an item or its key looks wrong, with a reason. Possible once the key is visible. It goes to the examiners and to the item’s writer; the writer does not see who sent it.'],
    ['Items', 'Draft', 'An imported item that nobody but the examiners and its writer can see. The owner or a co-examiner approves it to make it Live.'],
    ['Items', 'Live', 'An approved item. Participants whose group has its level and pool meet it in practice, and it can be put in a paper.'],
    ['Items', 'Reserved', 'An item in a published timed paper. It is hidden from practice until an examiner releases it after the paper has closed, so that nobody meets it beforehand.'],
    ['Items', 'Retired', 'An item taken out of every pool. Its answers so far are kept.'],
    ['Items', 'Pool', 'The part of the bank an item belongs to, taken from its number (PUL-TB-07 is in the TB pool). A group is given whole pools.'],
    ['Items', 'Paper set', 'The item writer puts items that give away each other’s answers into different sets. A paper built from one set avoids such pairs.'],
    ['Items', 'Estimated difficulty', 'The writer’s own estimate (Easy, Moderate, Hard) before anyone has answered the item. The difficulty index measured from answers replaces it in time.'],
    ['Items', 'Writer', 'The person an item is linked to at import. A writer signs in to see the analysis of their own items only, never who answered.'],
    ['Item analysis', 'Item analysis', 'What the answers say about an item: how many got it right, whether stronger candidates did better on it, and which options nobody chose. Timed papers and practice are reported apart. Below ' + n('item_min') + ' answers an item is not judged; from ' + n('item_min') + ' to ' + (n('item_full') - 1) + ' the figures are provisional. With small groups the figures move a great deal from one sitting to the next, so they point to items worth a look and never decide by themselves.'],
    ['Item analysis', 'Difficulty index', 'The proportion who answered correctly, from 0 to 1. A higher figure means an easier item. Shown with its 95% range.'],
    ['Item analysis', 'Discrimination', 'Whether people who did well on the rest of the paper also got this item right (corrected point-biserial correlation, timed papers only). Below 0.10 poor, 0.10 to 0.19 low, 0.20 to 0.29 acceptable, 0.30 to 0.39 good, 0.40 and above excellent. A negative figure means stronger candidates did worse on it.'],
    ['Item analysis', 'Non-functioning option', 'A wrong option chosen by fewer than ' + n('distractor_pct') + '% of people, so it does no work. Reported once an item has ' + n('distractor_min') + ' answers.'],
    ['People', 'Group', 'A cohort of participants, for example a final-year class. Each group has a level (undergraduate or postgraduate) and the pools it may use, and sees only its own papers and results.'],
    ['People', 'Join link', 'The link sent to a whole group. A person who opens it gives their name and mobile number and then waits. It gives no access by itself.'],
    ['People', 'Join request', 'A person who has used a join link and is waiting. The owner or a co-examiner confirms or declines each one.'],
    ['People', 'Invitation', 'A personal link for one member of staff (co-examiner, department head, group tutor or item writer). It works for 7 days, and once more within 24 hours of first use so that the installed copy can be set up.'],
    ['People', 'Activity', 'What the others have done in the app in the last 180 days: opening the app each day, joining, papers submitted, items flagged, and changes by co-examiners. The owner’s own actions are left out. People appear by code in the record.'],
    ['People', 'View as', 'The owner sees exactly what another person’s phone would receive. Nothing is saved or sent while viewing.']
  ];
  return G.map(function (x) { return { g: x[0], t: x[1], d: x[2] }; });
}
function glossaryList(D, q) {
  var terms = glossaryTerms(D), qq = String(q || '').trim().toLowerCase();
  if (qq) terms = terms.filter(function (x) { return (x.t + ' ' + x.d).toLowerCase().indexOf(qq) >= 0; });
  var groups = [];
  terms.forEach(function (x) { var g = groups.filter(function (y) { return y.g === x.g; })[0]; if (!g) groups.push(g = { g: x.g, items: [] }); g.items.push(x); });
  return el('div', { id: 'glosslist' }, terms.length ? groups.map(function (g) {
    return [el('h2', { text: g.g }), el('div', { class: 'card gloss' }, g.items.map(function (x) {
      return el('div', { class: 'term' }, el('b', { text: x.t }), el('div', { text: x.d }));
    }))];
  }) : el('p', { class: 'muted', text: 'No term matches.' }));
}


// ---------- View as: the owner sees what another person's phone receives; nothing saved or sent ----------
function previewBanner() {
  return el('div', { class: 'previewbar', id: 'previewbar' }, svg('eye'),
    el('div', { class: 'grow' }, el('b', { text: 'Viewing as ' + T.preview.who }), el('div', { text: 'Nothing is saved or sent.' })),
    el('button', { class: 'btn small', type: 'button', id: 'previewexit', onclick: exitPreview }, 'Back to my view'));
}
function enterPreview(p) {
  if (T.preview || !isOwner()) return;
  if (!navigator.onLine) { toast('No signal. View as needs the internet.'); return; }
  api({ op: 'viewas', token: T.S.token, pid: p.person_code }).then(function (r) {
    if (!r.ok) { toast(r.error || 'Could not load.'); return; }
    var real = T.S, d = r.data, S2 = { api: real.api, token: 'preview', role: d.role, pid: d.pid, items: d.items || [], stamp: '', pc: {}, outbox: [], uploads: [], lastSync: real.lastSync, syncErr: '', skew: real.skew };
    (d.papers || []).forEach(function (x) { if (x.keyed) S2.pc[x.paper_id] = { t: 'k', items: x.keyed }; else if (x.questions) S2.pc[x.paper_id] = { t: 'q', items: x.questions }; else if (x.blob) S2.pc[x.paper_id] = { t: 'b', blob: x.blob }; delete x.keyed; delete x.questions; delete x.blob; });
    delete d.items; S2.data = d;
    T.preview = { realS: real, who: (p.name || p.person_code) + ' (' + ROLE_WORD[d.role] + ')', stats: T.stats };
    T.S = S2; T.stats = null; T.sheet = null; go('home');
  }).catch(function () { toast('Could not reach the workbook.'); });
}
function exitPreview() {
  if (!T.preview) return;
  var p = T.preview; T.preview = null;
  T.S = p.realS; T.stats = p.stats; T.sheet = null; T.setGroup = 'preview';
  go('settings'); toast('Back to your own view.', true);
}

// ---------- settings ----------
var SET_GROUPS = [
  { k: 'cohorts', icon: 'users', who: ['owner', 'examiner'] }, { k: 'people', icon: 'users', who: ['owner', 'examiner'] }, { k: 'rules', icon: 'gear', who: ['owner'] },
  { k: 'runs', icon: 'msg', who: ['owner', 'examiner'] }, { k: 'export', icon: 'sheet', who: ['owner'] }, { k: 'research', icon: 'doc', who: ['owner'] },
  { k: 'activity', icon: 'clock', who: ['owner'] }, { k: 'preview', icon: 'eye', who: ['owner'] }, { k: 'install', icon: 'update', who: null }, { k: 'glossary', icon: 'book', who: null }
];
function setGroupInfo(k) {
  var d = D();
  if (k === 'cohorts') return { title: 'Groups and join links', short: 'Groups', tag: plural((d.cohorts || []).length, 'group'), sub: 'Each group has a level, its pools and a join link to send by WhatsApp.' };
  if (k === 'people') { var pend = people().filter(function (p) { return p.status === 'pending'; }).length; return { title: 'People and invitations', short: 'People', tag: pend ? pend + ' waiting' : plural(people().length, 'person'), sub: 'Invite staff, see who has joined, remove a person.', bad: false }; }
  if (k === 'rules') return { title: 'Thresholds and rules', short: 'Rules', tag: 'Item min ' + setV('item_min'), sub: 'How many answers are needed before an item or a person is judged, and the cut-offs for weak and strong. Your own working rules.' };
  if (k === 'runs') return { title: 'Written feedback runs', short: 'Feedback', tag: plural((d.runs || []).length, 'run'), sub: 'Each time the feedback skill is run it writes one run. A run can be withdrawn from every phone in one step.' };
  if (k === 'export') return { title: 'Export to Excel', short: 'Export', tag: 'Excel', sub: 'Items, tests, every answer, feedback and the item analysis in one Excel file.' };
  if (k === 'research') return { title: 'Research use and consent', short: 'Research', tag: String((d.set || {}).research_on) === 'Y' ? 'On' : 'Off', sub: 'Stays off until the ethics committee has approved. When on, participants are asked for consent and a research file without names can be made.' };
  if (k === 'activity') return { title: 'Activity of the others', short: 'Activity', tag: 'Log', sub: 'What the others have done in the app in the last 180 days, newest first. Your own actions are left out.' };
  if (k === 'preview') return { title: 'View as (debug mode)', short: 'View as', tag: 'Debug', sub: 'See exactly what another person’s phone receives. Nothing is saved or sent.' };
  if (k === 'install') return { title: 'Install the app', short: 'Install', tag: isStandalone() ? 'Installed' : 'Steps', sub: 'Put MCQ Bench on the Home Screen so it opens like an app and works offline.' };
  return { title: 'Glossary', short: 'Glossary', tag: glossaryTerms().length + ' terms', sub: 'What each word in the app means.' };
}
SCREENS.settings = function () {
  var S = T.S, r = role(), d = D();
  if (T.setGroup) {
    var info = setGroupInfo(T.setGroup);
    return el('div', null,
      el('div', { class: 'top' }, el('button', { class: 'back', type: 'button', id: 'setback', onclick: function () { T.setGroup = null; T.slide = true; render(); window.scrollTo(0, 0); } }, svg('back'), 'Settings'), el('div', { class: 'title small', text: info.title }), el('span')),
      el('p', { class: 'muted', id: 'grpsub', text: info.sub }), SET_PAGES[T.setGroup]());
  }
  var refused = S.outbox.filter(function (o) { return o.error; });
  return el('div', null, topBar('Settings'),
    refused.length ? el('div', { class: 'card', id: 'refused' }, el('b', { text: 'Not accepted by the workbook' }), refused.map(function (o) {
      return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('div', { text: o.op === 'attempt' ? (o.a.paper_timed ? 'Timed paper' : 'Practice answers') : o.op === 'challenge' ? 'Flag on ' + o.item_id : 'Consent' }), el('div', { class: 'sm', text: o.error })),
        el('div', { class: 'col' }, btn('small', 'sync', 'Try again', function () { o.error = ''; saveState().then(function () { sync(); }); }), btn('danger small', 'trash', 'Remove', function () { askSheet('Remove it?', 'It will not be sent.', 'Remove', function () { S.outbox = S.outbox.filter(function (x) { return x !== o; }); saveState().then(render); }, true); })));
    })) : null,
    isOwner() && S.updNote ? el('div', { class: 'note', text: S.updNote }) : null,
    el('div', { class: 'tiles three', id: 'setgroups' }, SET_GROUPS.filter(function (g) { return (!g.who || g.who.indexOf(r) >= 0) && !(d.pending && g.who) && !(T.preview && g.k === 'preview'); }).map(function (g) {
      var info = setGroupInfo(g.k);
      return el('button', { class: 'tile', type: 'button', id: 'grp-' + g.k, title: info.sub, onclick: function () { T.setGroup = g.k; T.pplFor = null; T.actFor = null; T.share = null; T.slide = true; render(); window.scrollTo(0, 0); } }, svg(g.icon), el('b', { text: info.short }), el('span', { text: info.tag || '' }));
    })),
    el('h2', null, svg('faceid'), 'This phone'), SET_PAGES.phone());
};
function loadList(key, op, pick) {
  if (T[key + 'Loading'] || T[key + 'For'] === T.S.token || T.preview) return;
  T[key + 'Loading'] = true; T[key + 'Err'] = '';
  setTimeout(function () {
    api({ op: op, token: T.S.token }).then(function (r) { T[key + 'Loading'] = false; T[key + 'For'] = T.S.token; if (r.ok) T[key] = r[pick]; else T[key + 'Err'] = r.error; if (T.screen === 'settings') softRender(); })
      .catch(function () { T[key + 'Loading'] = false; T[key + 'Err'] = 'No signal. Connect to see this.'; if (T.screen === 'settings') softRender(); });
  }, 0);
}
function cohortForm(c) {
  var F = c ? { cohort_id: c.cohort_id, name: c.name, level: c.level, pools: String(c.pools || '').split(',').filter(Boolean), tutor: c.tutor || '' } : { cohort_id: '', name: '', level: 'UG', pools: [], tutor: '' };
  var pools = []; allItems().forEach(function (i) { if (pools.indexOf(i.pool) < 0) pools.push(i.pool); }); pools.sort();
  var tutors = people().filter(function (p) { return p.role === 'tutor'; });
  function draw() {
    return sheetWrap(c ? 'Change group' : 'New group', [el('h2', { text: c ? 'Change group' : 'New group' }),
      field('Name', inp('cname', F.name, { placeholder: 'For example: Final year MBBS 2026', oninput: function (e) { F.name = e.target.value; } })),
      el('label', { class: 'f', text: 'Level of items this group meets' }), chips(['UG', 'PG'], F.level, function (x) { F.level = x; }, 'clevel', function (x) { return x === 'UG' ? 'Undergraduate' : 'Postgraduate'; }),
      el('label', { class: 'f' }, 'Pools', qm('Pool')),
      el('button', { class: 'btn wide', type: 'button', id: 'cpools', onclick: function () { pickSheet('Pools for this group', pools, F.pools, true, function (x) { F.pools = x; T.sheet = draw; render(); }, function (x) { return POOL_NAMES[x] || x; }); } }, svg('list'), el('span', { text: F.pools.length ? F.pools.map(function (x) { return POOL_NAMES[x] || x; }).join(', ') : 'All pools of that level' })),
      tutors.length ? [el('label', { class: 'f', text: 'Tutor (optional)' }), chips([''].concat(tutors.map(function (t) { return t.person_code; })), F.tutor, function (x) { F.tutor = x; }, 'ctutor', function (x) { return x ? nameOf(x) : 'None'; })] : null,
      el('div', { class: 'actions2' }, btn('', 'x', 'Cancel', sheetClose), btn('primary', 'check', 'Save', function () {
        T.sheet = null; call('cohort', { cohort_id: F.cohort_id, name: F.name, level: F.level, pools: F.pools.join(','), tutor: F.tutor, examiners: c ? c.examiners : '' }, 'Group saved.').then(function (r) { if (r && r.text) { T.share = { title: 'Join link for ' + F.name, text: r.text, until: r.code_expires }; render(); } });
      }, 'csave'))]);
  }
  sheetOpen(draw);
}
var SET_PAGES = {
  cohorts: function () {
    var cs = D().cohorts || [];
    return el('div', null,
      T.share ? el('div', { class: 'card', id: 'sharecard' }, el('b', { text: T.share.title }), T.share.until ? el('div', { class: 'sm', text: 'Works until ' + fmtDate(T.share.until) + '. Each person still needs your confirmation.' }) : null, el('p', { class: 'pre sm invtext', text: T.share.text }), shareText(T.share.text, 'shareacts'), btn('wide', 'x', 'Done', function () { T.share = null; render(); }, 'sharedone')) : null,
      btn('primary wide', 'plus', 'New group', function () { cohortForm(null); }, 'cnew'),
      el('div', { class: 'card list', id: 'cohortlist' }, cs.map(function (c) {
        var n = people().filter(function (p) { return p.cohort_id === c.cohort_id && p.status === 'active'; }).length, exp = c.code_expires && c.code_expires < stampPk_(nowMs()).slice(0, 10);
        function link(renew) { call('cohort', { cohort_id: c.cohort_id, name: c.name, level: c.level, pools: c.pools, tutor: c.tutor, examiners: c.examiners, renew: renew, code_open: 'Y' }).then(function (r) { if (r && r.text) { T.share = { title: 'Join link for ' + c.name, text: r.text, until: r.code_expires }; render(); window.scrollTo(0, 0); } else if (r && r.note) toast(r.note); }); }
        return el('div', { class: 'row', 'data-cohort': c.cohort_id }, el('div', { class: 'grow' }, el('b', { text: c.name }), el('div', { class: 'sm', text: (c.level === 'UG' ? 'Undergraduate' : 'Postgraduate') + ' | ' + (c.pools || 'all pools') + ' | ' + plural(n, 'member') }),
          el('div', { class: 'sm' + (exp || c.code_open !== 'Y' ? ' warn' : ''), text: c.code_open !== 'Y' ? 'Join link closed' : exp ? 'Join link expired ' + fmtDate(c.code_expires) : 'Join link works until ' + fmtDate(c.code_expires) })),
          el('div', { class: 'col' }, btn('primary small', 'share', exp || c.code_open !== 'Y' ? 'New link' : 'Join link', function () { link(exp || c.code_open !== 'Y'); }), btn('small', 'edit', 'Change', function () { cohortForm(c); }),
            c.code_open === 'Y' && !exp ? btn('small', 'lock', 'Close link', function () { call('cohort', { cohort_id: c.cohort_id, name: c.name, level: c.level, pools: c.pools, tutor: c.tutor, examiners: c.examiners, code_open: 'N' }, 'Join link closed.'); }) : null));
      })));
  },
  people: function () {
    loadList('ppl', 'people', 'people');
    var list = T.ppl || [], nm, rl = T.invRole || 'tutor', roles = isOwner() ? ['examiner', 'tutor', 'writer', 'head'] : ['tutor'];
    return el('div', null,
      T.share ? el('div', { class: 'card', id: 'sharecard' }, el('b', { text: T.share.title }), el('p', { class: 'pre sm invtext', text: T.share.text }), shareText(T.share.text, 'shareacts'), btn('wide', 'x', 'Done', function () { T.share = null; T.pplFor = null; render(); }, 'sharedone')) : null,
      el('div', { class: 'card', id: 'invitecard' }, el('b', null, 'Invite a member of staff', qm('Invitation')),
        field('Name', nm = inp('invname', '')), el('label', { class: 'f', text: 'Role' }), chips(roles, rl, function (x) { T.invRole = x; }, 'invrole', function (x) { return ROLE_WORD[x]; }),
        btn('primary wide', 'share', 'Make the invitation', function () { call('invite', { name: nm.value, role: T.invRole || 'tutor' }).then(function (r) { if (r) { T.share = { title: 'Invitation for ' + r.name, text: r.text }; T.pplFor = null; render(); window.scrollTo(0, 0); } }); }, 'invgo'),
        el('p', { class: 'sm muted', text: 'Participants do not get invitations: send their group’s join link from Groups.' })),
      T.pplErr ? el('p', { class: 'err', text: T.pplErr }) : null,
      el('div', { class: 'card list', id: 'peoplelist' }, list.filter(function (p) { return p.role !== 'participant'; }).concat(list.filter(function (p) { return p.role === 'participant'; })).map(function (p) {
        return el('div', { class: 'row', 'data-pid': p.person_code }, el('div', { class: 'grow' }, el('b', { text: p.name }), el('div', { class: 'sm', text: ROLE_WORD[p.role] + (p.cohort_id ? ', ' + cohortName(p.cohort_id) : '') + ' | ' + p.person_code }), el('div', { class: 'sm', text: p.status === 'pending' ? 'Waiting for confirmation' : p.joined ? 'Last synced ' + fmtDate(p.seen) : 'Not joined yet' })),
          el('div', { class: 'col' }, p.role !== 'participant' && p.role !== 'owner' && (isOwner() || p.role === 'tutor') ? btn('small', 'share', 'Invite again', function () { call('invite', { pid: p.person_code, role: p.role }).then(function (r) { if (r) { T.share = { title: 'Invitation for ' + r.name, text: r.text }; render(); window.scrollTo(0, 0); } }); }) : null,
            isOwner() && p.role !== 'owner' ? btn('danger small', 'trash', 'Remove', function () { askSheet('Remove ' + p.name + '?', 'Their phone is cut off at once. Their answers so far are kept.', 'Remove', function () { call('remove', { pid: p.person_code }, 'Removed.').then(function () { T.pplFor = null; render(); }); }, true); }) : null));
      })));
  },
  rules: function () {
    var s = D().set || {}, keys = ['item_min', 'item_full', 'distractor_min', 'distractor_pct', 'person_min', 'person_full', 'weak_pct', 'strong_pct', 'progress_min', 'rank_min', 'grace_min', 'code_days'];
    return el('div', null, el('div', { class: 'card list', id: 'ruleslist' }, keys.map(function (k) {
      var box = inp('rule-' + k, s[k], { inputmode: 'numeric', class: 'qamt' });
      return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('div', { text: SET_NOTES[k] }), el('div', { class: 'sm', text: 'Starts at ' + DEFAULTS[k] })), box, btn('small', 'check', 'Save', function () { call('setting', { key: k, value: box.value }, 'Saved.'); }));
    })), el('p', { class: 'sm muted', text: 'Published guidance on item analysis is written for large groups. With groups this size, treat every item figure as a pointer to look, not a verdict.' }));
  },
  runs: function () {
    var runs = (D().runs || []).slice().reverse();
    return el('div', null, runs.length ? el('div', { class: 'card list', id: 'runlist' }, runs.map(function (r) {
      return el('div', { class: 'row' }, el('div', { class: 'grow' }, el('b', { text: r.run_id }), el('div', { class: 'sm', text: fmtDate(r.started) + ' | ' + r.rows_written + ' texts | checks ' + (r.checks_passed === 'Y' ? 'passed' : r.checks_passed || 'not recorded') }), r.withdrawn === 'Y' ? el('div', { class: 'sm warn', text: 'Withdrawn: hidden on every phone' }) : null),
        r.withdrawn === 'Y' ? btn('small', 'eye', 'Show again', function () { call('withdraw', { run_id: r.run_id, on: false }, 'Shown again.'); }) : btn('danger small', 'x', 'Withdraw', function () { askSheet('Withdraw ' + r.run_id + '?', 'Its feedback disappears from every phone at their next sync. You can show it again.', 'Withdraw', function () { call('withdraw', { run_id: r.run_id }, 'Withdrawn.'); }, true); }));
    })) : el('p', { class: 'muted', text: 'No run yet. Written feedback appears after the feedback skill has been run in Claude.' }));
  },
  export: function () { return el('div', null, btn('primary wide', 'sheet', 'Make the Excel file', function () { loadStats(false); exportXlsx(false); }, 'exportgo'), el('p', { class: 'sm muted', text: 'Holds person codes, not names. Names and mobile numbers stay in the PEOPLE tab of the workbook.' })); },
  research: function () {
    var s = D().set || {}, on = String(s.research_on) === 'Y', ta;
    return el('div', null, el('div', { class: 'note warnnote', text: 'Switch this on only after the ethics committee has approved the study and its consent wording. Until then no one is asked and no research file can be made.' }),
      el('label', { class: 'f', for: 'consenttext', text: 'Approved consent wording' }), ta = el('textarea', { id: 'consenttext', rows: '6' }, s.consent_text || ''),
      btn('wide', 'check', 'Save the wording', function () { call('setting', { key: 'consent_text', value: ta.value }, 'Saved.'); }, 'consentsave'),
      el('div', { class: 'row' }, el('b', { class: 'grow', text: 'Research use is ' + (on ? 'ON' : 'off') }), btn(on ? 'danger small' : 'small', on ? 'x' : 'check', on ? 'Switch off' : 'Switch on', function () { askSheet(on ? 'Switch research use off?' : 'Switch research use on?', on ? 'Participants are no longer asked and the research file cannot be made.' : 'Every participant will be asked for consent with the wording above. Do this only with ethics approval in hand.', on ? 'Switch off' : 'Switch on', function () { call('setting', { key: 'research_on', value: on ? 'N' : 'Y' }, 'Saved.'); }, !on); }, 'researchswitch')),
      on ? btn('primary wide', 'sheet', 'Research file (no names, consenting people only)', function () { exportXlsx(true); }, 'researchgo') : null);
  },
  activity: function () {
    loadList('act', 'activity', 'rows');
    var rows = T.act || [], day = '', list = [];
    rows.forEach(function (r) {
      var dd = r.time.slice(0, 10);
      if (dd !== day) { day = dd; list.push(el('div', { class: 'dayhead', text: dd === stampPk_(nowMs()).slice(0, 10) ? 'Today' : fmtDate(dd) })); }
      list.push(el('div', { class: 'row actrow' }, el('div', { class: 'grow' }, el('div', null, el('b', { text: nameOf(r.who) }), ' ' + r.action + (r.id && r.id !== r.who ? ' ' + r.id : '')), r.new && r.field ? el('div', { class: 'sm', text: r.field + ': ' + r.new }) : null), el('span', { class: 'acttime', text: r.time.slice(11, 16) })));
    });
    return el('div', null, btn('wide', 'sync', 'Refresh', function () { T.actFor = null; render(); }, 'actrefresh'), T.actErr ? el('p', { class: 'err', text: T.actErr }) : null,
      rows.length ? el('div', { class: 'card list', id: 'actlist' }, list) : el('p', { class: 'muted', text: T.actLoading ? 'Loading' : 'Nothing yet.' }),
      el('p', { class: 'sm muted', text: 'The full record is the AUDIT tab of the workbook. "Opened the app" is recorded once a day for each phone.' }));
  },
  preview: function () {
    loadList('ppl', 'people', 'people');
    var list = (T.ppl || []).filter(function (p) { return p.role !== 'owner' && p.status === 'active'; });
    return el('div', null, el('div', { class: 'card list', id: 'previewlist' }, list.map(function (p) { return el('button', { class: 'row', type: 'button', 'data-pid': p.person_code, onclick: function () { enterPreview(p); } }, el('div', { class: 'grow' }, el('b', { text: p.name }), el('div', { class: 'sm', text: ROLE_WORD[p.role] + (p.cohort_id ? ', ' + cohortName(p.cohort_id) : '') })), svg('eye')); })),
      list.length ? null : el('p', { class: 'muted', text: T.pplLoading ? 'Loading' : 'Nobody else has joined yet.' }));
  },
  install: function () {
    return el('div', null, isStandalone() ? el('div', { class: 'note', text: 'You are using the installed app.' }) : null,
      T.installEvt ? btn('primary wide', 'update', 'Install now', function () { T.installEvt.prompt(); T.installEvt = null; }, 'installnow') : null,
      el('div', { class: 'card' }, el('b', { text: 'iPhone' }), el('p', { text: 'Open this page in Safari. Tap the Share button, then Add to Home Screen. Open MCQ Bench from the Home Screen: it starts empty, so paste your invitation or join link there again (it works a second time for 24 hours).' })),
      el('div', { class: 'card' }, el('b', { text: 'Android' }), el('p', { text: 'Open this page in Chrome. Tap the three dots, then Install app or Add to Home screen. If only "Create shortcut" is offered, the page is open inside another app: choose Open in Chrome first.' })));
  },
  glossary: function () {
    var q = el('input', { id: 'glossq', type: 'search', placeholder: 'Search the glossary', value: T.gq || '', oninput: function (e) { T.gq = e.target.value; document.getElementById('glosslist').replaceWith(glossaryList(null, T.gq)); } });
    return el('div', null, q, glossaryList(null, T.gq));
  },
  phone: function () {
    var S = T.S, d = D();
    if (T.preview) return el('div', { class: 'card' }, el('div', { class: 'kv' }, el('span', { text: 'Signed in as' }), el('b', { text: T.preview.who })));
    return el('div', { id: 'thisphone' }, bioCard(),
      el('div', { class: 'card' },
        el('div', { class: 'kv' }, el('span', { text: 'Signed in as' }), el('b', { id: 'signedas', text: (d.name || '') + ', ' + ROLE_WORD[role()] })),
        d.cohort ? el('div', { class: 'kv' }, el('span', { text: 'Group' }), el('b', { text: d.cohort.name })) : null,
        el('div', { class: 'kv' }, el('span', { text: 'Your code' }), el('b', { text: S.pid || '' })),
        el('div', { class: 'kv' }, el('span', { text: 'App version' }), el('b', { id: 'appver', text: BUILD_ID })),
        el('div', { class: 'kv' }, el('span', { text: 'Workbook script version' }), el('b', { text: d.version || '' }))),
      btn('wide', 'update', 'Update app', updateApp, 'updateapp'),
      btn('danger wide', 'trash', 'Reset this phone', function () {
        var n = S.outbox.length, box;
        sheetOpen(function () { return sheetWrap('Reset this phone', [el('h2', { text: 'Reset this phone' }), el('p', { text: 'This removes the app’s data from this phone. You will need a new invitation or join link.' + (n ? ' ' + plural(n, 'entry') + ' not yet sent will be lost.' : '') }), field('Type RESET to confirm', box = inp('resetbox', '', { autocapitalize: 'characters' })),
          el('div', { class: 'actions2' }, btn('', 'x', 'Cancel', sheetClose), btn('danger', 'trash', 'Reset', function () { if (box.value.trim() !== 'RESET') { toast('Type RESET.'); return; } T.sheet = null; resetPhone(); }, 'resetgo'))]); });
      }, 'resetphone'));
  }
};
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); T.installEvt = e; });

// ---------- Biometric: the PIN is kept wrapped by a key only Biometric can release (WebAuthn PRF) ----------
function bioReady() { return !!localStorage.getItem(BIO) && !!window.PublicKeyCredential; }
function prfSalt() { return new TextEncoder().encode('MCQ Bench unlock key, version 1'); }
function prfAesKey(out) {
  return crypto.subtle.importKey('raw', out, 'HKDF', false, ['deriveKey']).then(function (k) {
    return crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(16), info: new TextEncoder().encode('pin-wrap') }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  });
}
function bioGet(id) {
  return navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), rpId: location.hostname,
    allowCredentials: [{ type: 'public-key', id: unb64(id) }], userVerification: 'required', timeout: 60000, extensions: { prf: { eval: { first: prfSalt() } } } } }).then(function (a) {
    var r = a && a.getClientExtensionResults().prf;
    if (!r || !r.results || !r.results.first) throw new Error('noprf');
    return r.results.first;
  });
}
function bioEnable(pin) {
  if (T.bioBusy) return Promise.reject(new Error('busy'));
  T.bioBusy = true;
  return navigator.credentials.create({ publicKey: { rp: { name: 'MCQ Bench', id: location.hostname },
    user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'MCQ Bench', displayName: 'MCQ Bench' },
    challenge: crypto.getRandomValues(new Uint8Array(32)), timeout: 60000, pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', residentKey: 'preferred', userVerification: 'required' },
    extensions: { prf: { eval: { first: prfSalt() } } } } }).then(function (cred) {
    var ext = cred.getClientExtensionResults().prf || {}, id = b64(cred.rawId);
    if (ext.enabled === false) throw new Error('noprf');
    var first = ext.results && ext.results.first;
    return (first ? Promise.resolve(first) : bioGet(id)).then(prfAesKey).then(function (key) {
      var iv = crypto.getRandomValues(new Uint8Array(12));
      return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(pin)).then(function (ct) {
        localStorage.setItem(BIO, JSON.stringify({ id: id, iv: b64(iv), ct: b64(ct) }));
      });
    });
  }).finally(function () { T.bioBusy = false; });
}
function bioUnlock() {
  if (T.bioBusy) return Promise.reject(new Error('busy'));
  T.bioBusy = true;
  var b = JSON.parse(localStorage.getItem(BIO));
  return bioGet(b.id).then(prfAesKey).then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(b.iv) }, key, unb64(b.ct)); })
    .then(function (pt) { return unlock(new TextDecoder().decode(pt)); })
    .catch(function (e) { if (e && e.name === 'NotAllowedError') throw new Error('cancel'); throw e; })
    .finally(function () { T.bioBusy = false; });
}
function bioCard() {
  if (!window.PublicKeyCredential) return null;
  var on = bioReady(), pin;
  return el('div', { class: 'card', id: 'biocard' },
    el('div', { class: 'row' }, el('b', { text: 'Unlock with fingerprint or face' }), el('span', { class: 'chip ' + (on ? 'ok' : 'wait'), text: on ? 'On' : 'Off' })),
    on ? btn('wide', 'x', 'Turn off biometric unlock', function () { localStorage.removeItem(BIO); render(); toast('Biometric unlock turned off.'); }, 'biooff')
      : el('div', null, el('label', { class: 'f', for: 'biopin', text: 'Type your PIN to turn it on' }),
        pin = el('input', { id: 'biopin', class: 'pin', type: 'password', inputmode: 'numeric', maxlength: '6', autocomplete: 'off' }),
        btn('primary wide', 'faceid', 'Turn on biometric unlock', function () {
          var v = pin.value, st = stored();
          deriveKey(v, unb64(st.salt)).then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(st.iv) }, k, unb64(st.ct)); })
            .then(function () { return bioEnable(v); }).then(function () { render(); toast('Biometric unlock is on. Your PIN still works too.', true); })
            .catch(function (e) { toast(e && e.message === 'noprf' ? 'This phone cannot do Biometric unlock for web apps. Keep using the PIN.' : e && e.name === 'OperationError' ? 'Wrong PIN.' : 'Biometric was not set up.'); });
        }, 'bioon')),
    el('p', { class: 'hint', text: 'Needs a recent phone with a screen lock (iPhone: iOS 18 or newer). The PIN always works as a backup.' }));
}
// ---------- updates: checked on opening, on coming back and every 5 minutes; applied by a reload at a safe moment ----------
var HAND = 'mcqb.handover';
function swOk() { return 'serviceWorker' in navigator && (location.protocol === 'https:' || (location.hostname === 'localhost' && /[?&]sw=1/.test(location.search))); }
function checkUpdate() {
  if (!swOk() || !navigator.onLine) return Promise.resolve(null);
  return navigator.serviceWorker.getRegistration().then(function (reg) {
    if (!reg) return null;
    if (reg.waiting) reg.waiting.postMessage('skip');
    return reg.update().then(function () { if (reg.waiting) reg.waiting.postMessage('skip'); return reg; });
  }).catch(function () { return null; });
}
// Safe = nothing half typed, no panel open, no PIN or Biometric in progress, no sync running.
function safeToReload() {
  if (T.preview) return false;
  var ae = document.activeElement;
  if (T.syncing || T.bioBusy || T.sheet) return false;
  if (FORMY.concat(['loading', 'examdone']).indexOf(T.screen) >= 0) return false;
  if (ae && ae.matches && ae.matches('input, textarea, select')) return false;
  if (document.querySelector('.viewer')) return false;
  return true;
}
function applyUpdate() {
  T.reloadPending = true;
  if (!safeToReload()) return;
  T.reloadPending = false;
  var go2 = function () { location.reload(); };
  if (!T.key || !T.S) return go2();
  // Keep him unlocked across the reload: the key is passed in this tab's session storage for 30 seconds and erased on use.
  saveState().then(function () { return crypto.subtle.exportKey('raw', T.key); }).then(function (raw) {
    sessionStorage.setItem(HAND, JSON.stringify({ k: b64(raw), exp: Date.now() + 30000, from: BUILD_ID, screen: T.screen, setGroup: T.setGroup || null }));
  }).catch(function () { }).then(go2, go2);
}
function resumeAfterUpdate() {
  var h = null;
  try { h = JSON.parse(sessionStorage.getItem(HAND) || 'null'); } catch (e) { }
  sessionStorage.removeItem(HAND);
  if (!h || !h.k || h.exp < Date.now() || !stored()) return Promise.resolve(false);
  var st = stored();
  return crypto.subtle.importKey('raw', unb64(h.k), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']).then(function (key) {
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(st.iv) }, key, unb64(st.ct)).then(function (pt) {
      T.key = key; T.S = JSON.parse(new TextDecoder().decode(pt)); T.S.uploads = T.S.uploads || []; T.S.outbox = T.S.outbox || [];
      T.idleAt = Date.now(); T.setGroup = h.setGroup || null;
      T.screen = T.S.data && ['home', 'practice', 'results', 'items', 'papers', 'analysis', 'settings'].indexOf(h.screen) >= 0 ? h.screen : T.S.data ? 'home' : 'loading';
      render();
      if (h.from !== BUILD_ID) toast('Updated to version ' + BUILD_ID + '.', true);
      sync(true);
      return true;
    });
  }).catch(function () { return false; });
}
function updateApp() {
  if (!swOk()) return toast('Updates need the Home Screen app.');
  toast('Checking for a new version.');
  checkUpdate().then(function (reg) {
    if (!reg) { toast('Could not check for updates.'); return; }
    if (!reg.installing && !reg.waiting) {
      fetch('sw.js', { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (t) {
        if (t.indexOf(BUILD_ID) >= 0) toast('Already the newest version (' + BUILD_ID + ').');
        else toast('Downloading the new version. The app will refresh by itself.');
      }).catch(function () { });
    } else toast('Downloading the new version. The app will refresh by itself.');
  });
}


// ---------- start ----------
function touch() { T.idleAt = Date.now(); }
['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, touch, true); });
// The phone does not lock by itself while a timed paper is on screen.
setInterval(function () { if (T.S && T.S.exam && T.screen === 'exam') { T.idleAt = Date.now(); return; } if (T.key && Date.now() - T.idleAt > IDLE_MS) lock(); }, 15000);
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') { if (T.S && T.S.exam) { T.S.exam.interruptions++; T.S.exam.secs[T.S.exam.items[T.S.exam.i].item_id] = (T.S.exam.secs[T.S.exam.items[T.S.exam.i].item_id] || 0) + saveSeconds(); saveState(); } return; }
  T.qShown = Date.now();
  if (T.key && Date.now() - T.idleAt > IDLE_MS && !(T.S && T.S.exam)) lock(); else if (T.S) { examTick(); sync(true); }
});
window.addEventListener('online', function () { if (T.S) sync(true); });
window.addEventListener('offline', function () { if (T.S) renderTop(); });
if (swOk()) {
  var hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function () { checkUpdate(); }).catch(function () { });
  navigator.serviceWorker.addEventListener('controllerchange', function () { if (hadController) applyUpdate(); hadController = true; });
  setInterval(checkUpdate, 5 * 60 * 1000);
  setInterval(function () { if (T.reloadPending) applyUpdate(); }, 2000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') checkUpdate(); });
  document.addEventListener('focusout', function () { if (T.reloadPending) setTimeout(function () { if (T.reloadPending) applyUpdate(); }, 300); });
}
function boot() {
  var st = stored();
  if (st && !st.ct) { localStorage.removeItem(STORE); st = null; }
  T.screen = st ? 'unlock' : 'join';
  resumeAfterUpdate().then(function (done) { if (!done) render(); });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
