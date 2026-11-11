const CACHE = 'ovo-beranda-pwa-v7';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-192.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/badge-96.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(res => { if (res && res.ok) { const c = res.clone(); caches.open(CACHE).then(k => k.put('./index.html', c)); } return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(req, copy));
    }
    return res;
  }).catch(() => caches.match('./index.html'))));
});

self.addEventListener('push', event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : '' }; }
  const title = d.title || 'OVO';
  /* Tampilan disamakan dengan notifikasi native OVO: hanya ikon kecil (badge monokrom), judul, dan isi.
     Tanpa ikon besar di kanan (icon) dan tanpa gambar. */
  const opts = {
    body: d.body || '',
    tag: d.tag || undefined,
    badge: './icons/badge-96.png',
    data: { url: './' },
    renotify: !!d.tag
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL('./', self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.startsWith(target) && 'focus' in c) return c.focus(); }
    return self.clients.openWindow(target);
  }));
});
self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(self.registration.pushManager.getSubscription().then(() => self.clients.matchAll().then(l => l.forEach(c => c.postMessage({ type: 'resubscribe' })))));
});
