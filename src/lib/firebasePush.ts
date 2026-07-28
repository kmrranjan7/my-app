const FIREBASE_APP_SCRIPT = "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js";
const FIREBASE_MESSAGING_SCRIPT = "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js";

type FirebaseMessaging = Readonly<{
  getToken(options: Readonly<{ vapidKey: string; serviceWorkerRegistration: ServiceWorkerRegistration }>): Promise<string>;
  onMessage(callback: (payload: { data?: Record<string, string> }) => void): void;
}>;

type FirebaseNamespace = Readonly<{
  apps: readonly unknown[];
  initializeApp(config: Record<string, string>): unknown;
  messaging(): FirebaseMessaging;
}>;

declare global {
  interface Window {
    firebase?: FirebaseNamespace;
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";
let foregroundListenerRegistered = false;

function loadScript(source: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${source}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = source;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Firebase messaging."));
    document.head.appendChild(script);
  });
}

async function getMessaging(): Promise<FirebaseMessaging> {
  await loadScript(FIREBASE_APP_SCRIPT);
  await loadScript(FIREBASE_MESSAGING_SCRIPT);

  const firebase = window.firebase;
  if (!firebase) {
    throw new Error("Firebase messaging could not be initialized.");
  }

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  return firebase.messaging();
}

function enableForegroundNotifications(messaging: FirebaseMessaging) {
  if (foregroundListenerRegistered) {
    return;
  }

  messaging.onMessage(async (payload) => {
    if (Notification.permission !== "granted") {
      return;
    }

    const title = payload.data?.title || "Sarkari Global Result";
    const body = payload.data?.body || "A new government update is available.";
    const notificationOptions = {
      body,
      icon: "/opengraph.png",
      badge: "/opengraph.png",
      data: { url: payload.data?.url || "/latest-jobs" },
    };

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, notificationOptions);
    } catch {
      // Desktop browsers that do not expose the active worker yet can still
      // show a standard foreground notification.
      new Notification(title, notificationOptions);
    }
  });
  foregroundListenerRegistered = true;
}

export async function initializeForegroundPushNotifications(): Promise<void> {
  if (!window.isSecureContext || !("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  enableForegroundNotifications(await getMessaging());
}

async function getActiveServiceWorker(): Promise<ServiceWorkerRegistration> {
  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
    scope: "/",
    updateViaCache: "none",
  });

  if (!registration.active) {
    const worker = registration.installing ?? registration.waiting;
    if (worker) {
      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          reject(new Error("Notification service worker did not activate. Please refresh and try again."));
        }, 10_000);

        worker.addEventListener("statechange", () => {
          if (worker.state === "activated") {
            window.clearTimeout(timeout);
            resolve();
          }

          if (worker.state === "redundant") {
            window.clearTimeout(timeout);
            reject(new Error("Notification service worker could not be activated."));
          }
        });
      });
    }
  }

  const activeRegistration = registration.active ? registration : await navigator.serviceWorker.ready;
  if (!activeRegistration.active) {
    throw new Error("Notification service worker is not active yet. Please refresh and try again.");
  }

  return activeRegistration;
}

export async function showPushTestNotification(): Promise<void> {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification("Alerts are enabled", {
    body: "You will receive Sarkari Global Result updates on this device.",
    icon: "/opengraph.png",
    badge: "/opengraph.png",
    tag: "sgr-alerts-enabled",
  });
}

export async function registerForPushNotifications(): Promise<string> {
  if (!window.isSecureContext) {
    throw new Error("Browser alerts require HTTPS. Open the secure ngrok URL and try again.");
  }

  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInstalledWebApp = window.matchMedia("(display-mode: standalone)").matches
    || ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);

  if (isAppleMobile && !isInstalledWebApp) {
    throw new Error("On iPhone or iPad, add this site to the Home Screen first, then enable alerts from the installed app.");
  }

  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("This browser does not support web push notifications.");
  }

  if (!vapidKey || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error("Firebase push configuration is incomplete.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const serviceWorkerRegistration = await getActiveServiceWorker();
  const messaging = await getMessaging();
  enableForegroundNotifications(messaging);

  return messaging.getToken({ vapidKey, serviceWorkerRegistration });
}
