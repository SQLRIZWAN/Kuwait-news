// Firebase Messaging Service Worker — handles background push notifications
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDLRqQ8WRohNDWz_6UgafI7Kn2f8U0KL3c",
    authDomain: "kwt-news.firebaseapp.com",
    projectId: "kwt-news",
    storageBucket: "kwt-news.firebasestorage.app",
    messagingSenderId: "604704031845",
    appId: "1:604704031845:web:b835af9ab1872ddd1d728c"
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || payload.data?.title || '🗞️ KWT News';
    const body  = payload.notification?.body  || payload.data?.body  || 'New news update';
    const icon  = payload.notification?.icon  || '/icon-192.png';
    const image = payload.data?.imageUrl || undefined;
    const tag   = payload.data?.tag || 'kwtnews-' + Date.now();
    const url   = payload.data?.url || '/';

    self.registration.showNotification(title, {
        body,
        icon,
        badge: '/icon-192.png',
        image,
        tag,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: { url },
        actions: [
            { action: 'open',    title: 'Read More' },
            { action: 'dismiss', title: 'Dismiss'   }
        ]
    });
});

// Notification click — open / focus the site
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'dismiss') return;
    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            for (const client of list) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(url);
                    return;
                }
            }
            if (clients.openWindow) clients.openWindow(url);
        })
    );
});
