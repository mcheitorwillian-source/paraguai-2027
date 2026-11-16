
const CACHE_NAME = "expedicao-paraguai-v3";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARQUIVOS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys().then(chaves => {
      return Promise.all(
        chaves
          .filter(chave => chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", evento => {
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    caches.match(evento.request).then(resposta => {
      return resposta || fetch(evento.request);
    })
  );
});
