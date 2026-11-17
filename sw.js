/* MCQ Bench service worker: caches the app, never the data. The PDF reader is fetched only when a bank is imported. */
var BUILD = '94b61550';
var CACHE = 'mcqb-' + BUILD;
var FILES = ["./","index.html","app.css","app.js","logic.js","exports.js","reader.js","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","icon-maskable-512.png","logo-320.png"];
// A new version takes over as soon as it has downloaded; the page then reloads itself at a safe moment.
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(FILES.map(function (f) { return fetch(f, { cache: 'reload' }).then(function (r) { if (!r.ok) throw new Error(f); return c.put(f, r); }); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('mcqb-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('message', function (e) { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
    return hit || fetch(e.request).catch(function () { return caches.match('index.html'); });
  }));
});
