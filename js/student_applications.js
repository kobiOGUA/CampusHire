import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5milUoYfNSMhif0JA7dbw26tyfs2fDpQ",
  authDomain: "campushire-d0dd8.firebaseapp.com",
  projectId: "campushire-d0dd8",
  storageBucket: "campushire-d0dd8.appspot.com",
  messagingSenderId: "448246002591",
  appId: "1:448246002591:web:098670b92661a0a3a283aa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Navbar elements
const navProfilePic = document.getElementById("navProfilePic");
const navStudentName = document.getElementById("navStudentName");
const navLogoutBtn = document.getElementById("navLogoutBtn");
const myApplications = document.getElementById("myApplications");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  
  // Load navbar info
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data();
    navStudentName.textContent = userData.name || user.displayName || "";
    navProfilePic.src = userData.profilePicBase64 || "https://via.placeholder.com/32";
  }
  
  await loadApplications();
});

async function loadApplications() {
  if (!currentUser) return;
  myApplications.innerHTML = "Loading...";

  try {
    const q = query(collection(db, "applications"), where("userId", "==", currentUser.uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      myApplications.innerHTML = "<p style='color: var(--muted);'><i>You haven't applied for any jobs yet.</i></p>";
      return;
    }

    myApplications.innerHTML = "";
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const title = data.title || "Untitled Job";
      const company = data.company || "Unknown Company";
      const appliedDate = data.appliedAt ? new Date(data.appliedAt).toLocaleDateString() : "Unknown date";
      const status = data.status || "Pending";
      const color =
        status === "Shortlisted" ? "#1e7e34" :
        status === "Rejected" ? "#c82333" :
        status === "Contacted" ? "#0b6cff" : "#6b7280";

      const div = document.createElement("div");
      div.innerHTML = `
        <div style="border:1px solid #dfe7ff; padding:16px; margin:10px 0; border-radius:8px; background: #f8fbff;">
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px;">
            <div style="flex: 1;">
              <h3 style="margin: 0 0 4px 0;">${title}</h3>
              <p style="margin: 0 0 8px 0; color: var(--muted); font-size: 0.95rem;">${company}</p>
              <small style="color: var(--muted);">Applied: ${appliedDate}</small>
            </div>
            <div style="text-align: right; white-space: nowrap;">
              <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 4px;">Status</div>
              <div style="background: ${color}; color: white; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.9rem;">
                ${status}
              </div>
            </div>
          </div>
        </div>`;
      myApplications.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading applications:", err);
    myApplications.innerHTML = "❌ Could not load applications. Please try again.";
  }
}

// Navbar logout
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
