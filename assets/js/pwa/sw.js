const cacheName = 'site-cache-20260409T103916Z'; // bumped to force clients to update caches
const resource = ['/index.html','/404.html','/assets/index-BQw8T-ET.css','/assets/index-Bbk1aD94.js'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(resource))); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', event => { event.respondWith(caches.match(event.request).then(r => r || fetch(event.request))); });
