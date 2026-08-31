import { getAnalytics, isSupported } from "firebase/analytics";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCtzfVK5vM6G_TcWtyQY6UdC6dLVra3b2o",
  authDomain: "lyxia-b752e.firebaseapp.com",
  projectId: "lyxia-b752e",
  storageBucket: "lyxia-b752e.firebasestorage.app",
  messagingSenderId: "911857854961",
  appId: "1:911857854961:web:d13cc08c594e8e1e9f7c50",
  measurementId: "G-TTBDQM33RL",
};

export const firebaseApp = initializeApp(firebaseConfig);

// App Check se activa cuando exista una clave de reCAPTCHA Enterprise.
// Hasta entonces, la función mantiene validación, honeypot y límite por IP.
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_KEY;
if (appCheckSiteKey) {
  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

if (typeof window !== "undefined") {
  void isSupported().then((supported) => {
    if (supported) getAnalytics(firebaseApp);
  });
}

export const firebaseFunctions = getFunctions(firebaseApp, "europe-west1");
