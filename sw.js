// KWT News — Combined Service Worker
// Handles: PWA caching (offline) + Firebase push notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ── Cache config ─────────────────────────────────────────────────────────────
const CACHE_NAME = 'kwtnews-v4';
const OFFLINE_URL = '/offline.html';
const PRECACHE = ['/', '/offline.html', '/manifest.json', '/icon-192.png', '/icon-512.png', '/icon.svg', '/app.js'];

// ── Firebase init ─────────────────────────────────────────────────────────────
firebase.initializeApp({
    apiKey: "AIzaSyDLRqQ8WRohNDWz_6UgafI7Kn2f8U0KL3c",
    authDomain: "kwt-news.firebaseapp.com",
    projectId: "kwt-news",
    storageBucket: "kwt-news.firebasestorage.app",
    messagingSenderId: "604704031845",
    appId: "1:604704031845:web:b835af9ab1872ddd1d728c"
});
const messaging = firebase.messaging();

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then((c) => c.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// ── Fetch (required for PWA installability) ───────────────────────────────────
self.addEventListener('fetch', (e) => {
    const { request } = e;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;

    // Navigation → network first, fallback offline page
    if (request.mode === 'navigate') {
        e.respondWith(
            fetch(request)
                .then((res) => {
                    if (res.ok) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then(c => c.put(request, clone));
                    }
                    return res;
                })
                .catch(() => caches.match(OFFLINE_URL))
        );
        return;
    }

    // Static assets + compiled app JS → cache first
    if (['.png','.svg','.ico','.js'].some(ext => url.pathname.endsWith(ext)) || url.pathname === '/manifest.json') {
        e.respondWith(
            caches.match(request).then(
                (cached) => cached || fetch(request).then((res) => {
                    if (res.ok) {
                        const clone = res.clone();
                        caches.open(CACHE_NAME).then(c => c.put(request, clone));
                    }
                    return res;
                })
            )
        );
        return;
    }
    // All other same-origin → network only (live news data)
});

// ── Firebase background push notifications ────────────────────────────────────
messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || '🗞️ KWT News';
    const body  = payload.notification?.body  || payload.data?.body  || 'New update';
    const icon  = payload.data?.imageUrl || '/icon-192.png';
    const tag   = payload.data?.tag || 'kwt-' + Date.now();

    self.registration.showNotification(title, {
        body,
        icon,
        badge: '/icon-192.png',
        tag,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: { url: payload.data?.url || '/' },
        actions: [
            { action: 'open',    title: 'Read More' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    });
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', (e) => {
    e.notification.close();
    if (e.action === 'dismiss') return;
    const url = e.notification.data?.url || '/';
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            for (const c of list) {
                if (c.url.includes(self.location.origin) && 'focus' in c) { c.focus(); return; }
            }
            if (clients.openWindow) clients.openWindow(url);
        })
    );
});
