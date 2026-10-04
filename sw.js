// Service worker for Home dashboard
// Bump CACHE_VERSION on every release to force clients to fetch fresh code.
const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `home-${CACHE_VERSION}`;
const PRECACHE_URLS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('home-') && k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Only handle this app's own files; Firebase, fonts and Google Calendar go straight to the network.
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  event.respondWith(
    fetch(event.request)
      .then((res) => { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(event.request, copy)); return res; })
      .catch(() => caches.match(event.request).then((r) => r || caches.match('./index.html')))
  );
});
