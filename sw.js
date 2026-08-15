/* Service Worker — Monitoramento AEE
   Faz cache do "app shell" (HTML/CSS/JS/ícones) para instalação e carregamento
   instantâneo. As chamadas ao Firebase (Firestore/Storage) NUNCA são
   interceptadas: sempre vão direto para a rede, pois os dados precisam
   estar sempre atualizados. */

const CACHE_NAME = 'monitoramento-aee-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Nunca faz cache/intercepta chamadas ao Firebase ou a APIs do Google —
  // dados de login, conteúdos e arquivos sempre precisam vir da rede.
  const isFirebase =
    url.includes('firestore.googleapis.com') ||
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('googleapis.com') ||
    url.includes('gstatic.com/firebasejs');

  if (isFirebase || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
