const CACHE_NAME = 'catalogo-v4';
const urlsToCache = [
  '/',
  '/index.html',
  '/catalogo_servicos.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora requisições para o Supabase (deixa o navegador cuidar da rede normalmente)
  if (url.hostname.includes('supabase.co') || !url.protocol.startsWith('http')) {
    return;
  }

  // Apenas trata requisições GET para o PWA
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return caches.match('/index.html').then(fallback => {
          return fallback || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      });
    })
  );
});
