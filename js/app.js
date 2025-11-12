// ===============================
// APP.JS – Main Entry Point
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA5milUoYfNSMhif0JA7dbw26tyfs2fDpQ",
  authDomain: "campushire-d0dd8.firebaseapp.com",
  projectId: "campushire-d0dd8",
  storageBucket: "campushire-d0dd8.appspot.com",
  messagingSenderId: "448246002591",
  appId: "1:448246002591:web:098670b92661a0a3a283aa",
  measurementId: "G-TFJV87Q6QP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("✅ Firebase Initialized Successfully!");

// Redirect to appropriate dashboard if logged in
onAuthStateChanged(auth, async (user) => {
  // NOTE: removed automatic redirects so the landing page stays usable.
  // The UI (index.html) already provides Login / Register buttons —
  // if other scripts need the current user they can read `window.currentUser`.
  if (user) {
    console.log("User logged in:", user.email);
    // Expose a lightweight global for pages that want to react to auth state.
    window.currentUser = user;
  } else {
    window.currentUser = null;
  }
});
