---
layout: compress
permalink: '/app.js'
---

/* Remove the legacy cache-first worker and its caches. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    if ('caches' in window) {
      await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
    }
  });
}
