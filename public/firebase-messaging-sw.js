importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

firebase.initializeApp({
  apiKey: "AIzaSyBrbGf5796v6622ydOmVMCti99Ycke9_AI",
  authDomain: "sarkari-global-result-alert.firebaseapp.com",
  projectId: "sarkari-global-result-alert",
  storageBucket: "sarkari-global-result-alert.firebasestorage.app",
  messagingSenderId: "21241215723",
  appId: "1:21241215723:web:ddf2addedf2c27f98ddcae",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};

  return self.registration.showNotification(notification.title || data.title || "Sarkari Global Result", {
    body: notification.body || data.body || "A new government update is available.",
    icon: "/opengraph.png",
    badge: "/opengraph.png",
    data: { url: data.url || "/latest-jobs" },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/latest-jobs"));
});
