// ===============================
// auth.js – Registration & Login with Role Redirect (Admin-Protected)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

// ===============================
// REGISTER
// ===============================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!role) return alert("Please select a role.");
    if (role === "admin") {
      alert("Error: You cannot register as an admin.");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        companyName: "",
        about: "",
        skills: "",
        createdAt: new Date().toISOString()
      });

      alert("Success: Registration successful!");
      window.location.href = "login.html";
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}

// ===============================
// LOGIN
// ===============================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (!userSnap.exists()) {
        alert("Error: Account not found. Please contact admin.");
        return;
      }

      const data = userSnap.data();
      const role = data.role;

      switch (role) {
        case "student":
          window.location.href = "student_dashboard.html";
          break;
        case "recruiter":
          window.location.href = "recruiter_dashboard.html";
          break;
        case "admin":
          window.location.href = "admin_dashboard.html";
          break;
        default:
            alert("Error: Unknown or unauthorized role.");
      }
    } catch (err) {
        alert("Error: " + err.message);
    }
  });
}
