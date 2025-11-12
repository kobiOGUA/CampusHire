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
  appId: "1:448246002591:web:098670b92661a0a3a283aa",
  measurementId: "G-TFJV87Q6QP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const jobsList = document.getElementById("jobsList");
const navRecruiterName = document.getElementById("navRecruiterName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  // Load recruiter info
  const recruiterRef = doc(db, "users", user.uid);
  const recruiterSnap = await getDoc(recruiterRef);
  if (recruiterSnap.exists()) {
    navRecruiterName.textContent = recruiterSnap.data().name || "Recruiter";
  }

  await loadRecruiterJobs();
});

async function loadRecruiterJobs() {
  jobsList.innerHTML = "Loading your jobs...";

  try {
    const q = query(collection(db, "jobs"), where("recruiterId", "==", currentUser.uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      jobsList.innerHTML = "<p style='color: var(--muted);'><i>You haven't posted any jobs yet. Go back to the dashboard to post a job.</i></p>";
      return;
    }

    jobsList.innerHTML = "";

    snap.forEach((docSnap) => {
      const job = docSnap.data();
      const jobId = docSnap.id;
      const title = job.title || "Untitled";
      const company = job.company || "Company";
      const description = job.description || "";
      const closed = job.closed || false;

      const div = document.createElement("div");
      div.innerHTML = `
        <div style="border: 1px solid #dfe7ff; padding: 16px; margin: 12px 0; border-radius: 8px; background: #f8fbff;">
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 16px;">
            <div style="flex: 1;">
              <h3 style="margin: 0 0 4px 0; ${closed ? 'color: #999; text-decoration: line-through;' : ''}">${title}</h3>
              <p style="margin: 0 0 4px 0; color: var(--muted); font-size: 0.95rem;">${company}</p>
              <p style="margin: 0 0 12px 0; color: var(--muted); font-size: 0.9rem; line-height: 1.4;">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
              ${closed ? '<span style="color: #c82333; font-size: 0.85rem; font-weight: 600;">CLOSED</span>' : '<span style="color: #1e7e34; font-size: 0.85rem; font-weight: 600;">OPEN</span>'}
            </div>
            <button class="secondary" onclick="window.location.href='recruiter_applicants.html?jobId=${jobId}'" style="white-space: nowrap;">
              View Applicants
            </button>
          </div>
        </div>`;
      jobsList.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading jobs:", err);
    jobsList.innerHTML = "❌ Error loading jobs. Please try again.";
  }
}

// Navbar logout
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
