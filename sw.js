// Rekenen op Niveau © 2026 S. Groefsema · service worker voor offline gebruik.
// De app zelf (index.html) gaat altijd eerst via het netwerk, zodat een nieuwe versie direct doorkomt.
// Alleen zonder internet wordt de laatst bewaarde versie gebruikt. Verzenden naar de server (POST) gaat er nooit doorheen.
const APP = 'ron-app-v1', EXTRA = 'ron-extra-v1';
const KERN = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-180.png'];

self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(APP).then(c => c.addAll(KERN)).catch(() => {})); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== APP && k !== EXTRA).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (url.hostname.endsWith('script.google.com') || url.hostname.endsWith('googleusercontent.com')) return;
  // de app: netwerk eerst, cache als terugval
  if (r.mode === 'navigate' || (url.origin === location.origin)) {
    e.respondWith(fetch(r, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const k = res.clone(); caches.open(APP).then(c => c.put(r.mode === 'navigate' ? './index.html' : r, k)); }
      return res;
    }).catch(() => caches.match(r.mode === 'navigate' ? './index.html' : r).then(x => x || caches.match('./index.html'))));
    return;
  }
  // lettertypen en foto's: uit de cache als ze er zijn, op de achtergrond verversen
  if (/fonts\.(googleapis|gstatic)\.com$|images\.unsplash\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(EXTRA).then(c => c.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
