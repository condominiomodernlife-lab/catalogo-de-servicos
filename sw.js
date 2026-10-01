const CACHE_NAME = 'catalogo-v3';
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

  // Apenas intercepta requisições GET para a mesma origem (arquivos estáticos locais)
  if (event.request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Atualiza o cache em segundo plano sem bloquear a resposta
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Retorna uma resposta válida de erro 404 em vez de falhar a Promise (evita TypeError)
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
