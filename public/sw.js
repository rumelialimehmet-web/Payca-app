// Payça Service Worker - Offline Mode Support
// Version 1.0.0

const CACHE_NAME = 'payca-cache-v1';
const RUNTIME_CACHE = 'payca-runtime-v1';

// Files to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/icon.svg',
    // Add more static assets here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Precaching static assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip Supabase API calls (always use network)
    if (url.hostname.includes('supabase.co')) {
        return;
    }

    // Skip Gemini AI API calls (always use network)
    if (url.hostname.includes('googleapis.com')) {
        return;
    }

    // Strategy: Cache First, Network Fallback
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[Service Worker] Serving from cache:', request.url);
                return cachedResponse;
            }

            // Not in cache, fetch from network
            return fetch(request).then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                // Clone the response (can only be consumed once)
                const responseToCache = response.clone();

                // Cache dynamic content in runtime cache
                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(request, responseToCache);
                });

                return response;
            }).catch((error) => {
                console.log('[Service Worker] Fetch failed, serving offline fallback:', error);

                // Return cached offline page if available
                return caches.match('/index.html');
            });
        })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);

    if (event.tag === 'sync-expenses') {
        event.waitUntil(syncExpenses());
    }
});

// Sync offline expenses when back online
async function syncExpenses() {
    try {
        // Get offline expenses from IndexedDB
        const db = await openDB();
        const offlineExpenses = await getOfflineExpenses(db);

        console.log('[Service Worker] Syncing', offlineExpenses.length, 'offline expenses');

        // Send to Supabase
        for (const expense of offlineExpenses) {
            // This would call your Supabase API
            // await fetch('/api/expenses', { method: 'POST', body: JSON.stringify(expense) });
        }

        // Clear offline queue after successful sync
        await clearOfflineExpenses(db);

        // Notify the app
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    type: 'SYNC_COMPLETE',
                    count: offlineExpenses.length
                });
            });
        });
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
    }
}

// IndexedDB helpers (simplified)
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('payca-offline', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('expenses')) {
                db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

function getOfflineExpenses(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['expenses'], 'readonly');
        const store = transaction.objectStore('expenses');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function clearOfflineExpenses(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Listen for messages from the app
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Received message:', event.data);

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then((cache) => {
                return cache.addAll(event.data.urls);
            })
        );
    }
});

console.log('[Service Worker] Loaded successfully');
