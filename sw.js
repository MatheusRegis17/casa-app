// Service worker mínimo: existe para o app ser "instalável" (Android/Chrome).
// Não faz cache offline porque o portal precisa de conexão com o servidor.
const CACHE = "portal-casa-shell-v1";
const SHELL = ["./", "./index.html", "./manifest.json",
               "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Rede primeiro; cai para o cache do shell se estiver offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
