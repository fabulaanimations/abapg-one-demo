const CACHE_NAME = 'abapg-one-mock-v7.1.1';
const CORE = [
  './', './index.html', './manifest.webmanifest',
  './theme.css?v=7.1.1', './app.css?v=7.1.1', './mock-isidata.js?v=7.1.1', './app.js?v=7.1.1',
  './presence-core.js?v=7.1.1', './presence-ui.js?v=7.1.1', './vendor/qrcode.js', './vendor/jsQR.js',
  './assets/logo-completo.png', './assets/app-icon.png', './assets/apple-touch-icon.png',
  './assets/icon-192.png', './assets/icon-512.png', './assets/generic.jpg', './assets/scenografia.jpg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('abapg-one-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if(event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        if(!response.ok) throw new Error('Page unavailable');
        return response;
      } catch {
        return (await caches.open(CACHE_NAME)).match('./index.html');
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if(cached) return cached;
    return fetch(event.request);
  })());
});
