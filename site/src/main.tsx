import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

async function cleanupLegacyServiceWorkers() {
  if (!('serviceWorker' in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ('caches' in window) {
    await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
  }
}

void cleanupLegacyServiceWorkers().catch(() => {
  // Cache cleanup is defensive and must never prevent the app from loading.
});

createRoot(document.getElementById('root')!).render(<App />);
