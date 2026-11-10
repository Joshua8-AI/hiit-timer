// HIIT Timer Service Worker
// Precaches the app shell for offline use, then serves cache-first with a
// background refresh (stale-while-revalidate). The origin sends
// Cache-Control: no-cache, so the background fetch picks up new deploys.

const CACHE_NAME = 'hiit-timer-v2';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './audio.js',
  './theme.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

const SHELL_PATHS = new Set(
  ASSETS.map((asset) => new URL(asset, self.location).pathname)
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Only the app shell is cached. Without this, every distinct URL (e.g. a
  // link with a random query string) would add a permanent cache entry.
  if (!SHELL_PATHS.has(url.pathname)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request, { ignoreSearch: true });
      const refresh = fetch(event.request)
        .then((response) => {
          if (response.ok && !url.search) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached); // offline - fall back to cache

      return cached || refresh;
    })
  );
});
