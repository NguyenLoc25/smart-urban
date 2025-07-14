import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
   apiKey: "AIzaSyBBDrRw2cqSv8yuiQToX3NR-1B_ci_awZo",
  authDomain: "datn-5b6dc.firebaseapp.com",
  databaseURL: "https://datn-5b6dc-default-rtdb.firebaseio.com",
  projectId: "datn-5b6dc",
  storageBucket: "datn-5b6dc.firebasestorage.app",
  messagingSenderId: "1058163518154",
  appId: "1:1058163518154:web:67af917afb710699d4e233",
  measurementId: "G-EFRN2QNWC9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let analytics;

if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch(err => {
    console.error("Failed to load Firebase Analytics:", err);
  });
}

const db = getDatabase(app);

export { db };
