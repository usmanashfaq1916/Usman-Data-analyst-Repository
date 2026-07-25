const CACHE_NAME = 'qec-cache-v2';
const STATIC_CACHE = 'qec-static-v2';
const OFFLINE_URL = '/offline';

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/login',
  '/portal/student',
  '/portal/teacher',
  '/portal/parent',
  '/portal/management',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests: network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Next.js static assets: cache-first
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation requests: network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // Everything else: network-first
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }

    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New notification from QEC',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Quaid Educational Complex',
      options
    )
  );
});

// Notification click: navigate to the URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.openWindow(url)
  );
});

// Background sync: retry failed API calls when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-attendance') {
    event.waitUntil(syncAttendance());
  }
  if (event.tag === 'sync-marks') {
    event.waitUntil(syncMarks());
  }
});

async function syncAttendance() {
  const cache = await caches.open('qec-sync-v1');
  const requests = await cache.keys();
  for (const req of requests) {
    if (req.url.includes('/api/attendance')) {
      try {
        const res = await fetch(req);
        if (res.ok) await cache.delete(req);
      } catch { /* will retry */ }
    }
  }
}

async function syncMarks() {
  const cache = await caches.open('qec-sync-v1');
  const requests = await cache.keys();
  for (const req of requests) {
    if (req.url.includes('/api/exams/') && req.url.endsWith('/results')) {
      try {
        const res = await fetch(req);
        if (res.ok) await cache.delete(req);
      } catch { /* will retry */ }
    }
  }
}

// Message channel: allow page to refresh cache
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage('CACHE_CLEARED'));
      });
    });
  }
});
