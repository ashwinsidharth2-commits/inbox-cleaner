var CACHE = 'gmail-cleaner-v2';
var SHELL = ['./index.html', './manifest.json', './icon.svg', './icon-maskable.svg'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.indexOf('<googleapis.com>') !== -1 || e.request.url.indexOf('<accounts.google.com>') !== -1) return;
  e.respondWith(caches.match(e.request).then(function(r) { return r || fetch(e.request); }));
});
