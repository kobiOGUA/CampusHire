// ===============================
// ADMIN MANAGE JOBS
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
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
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 UI Elements
const jobsList = document.getElementById("jobsList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const searchBtn = document.getElementById("searchBtn");
const navAdminName = document.getElementById("navAdminName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

let allJobs = [];
let currentUser = null;

// ===============================
// AUTH CHECK
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Access denied. Please log in as admin.");
    window.location.href = "login.html";
    return;
  }

  const isAdmin = await verifyAdmin(user.uid);
  if (!isAdmin) {
    alert("Error: Unauthorized. Admin access only.");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  
  // Load admin name for navbar
  const adminRef = doc(db, "users", user.uid);
  const adminSnap = await getDoc(adminRef);
  if (adminSnap.exists()) {
    navAdminName.textContent = adminSnap.data().name || "Admin";
  }
  
  await loadJobs();
});

// ===============================
// VERIFY ADMIN
// ===============================
async function verifyAdmin(uid) {
  try {
    const q = query(collection(db, "users"), where("role", "==", "admin"));
    const snapshot = await getDocs(q);
    return snapshot.docs.some((d) => d.id === uid);
  } catch (err) {
    console.error("Admin verify error:", err);
    return false;
  }
}

// ===============================
// LOAD ALL JOBS
// ===============================
async function loadJobs() {
  try {
    jobsList.innerHTML = "Loading jobs...";
    const snapshot = await getDocs(collection(db, "jobs"));
    allJobs = [];

    snapshot.forEach((docSnap) => {
      allJobs.push({ id: docSnap.id, ...docSnap.data() });
    });

    displayJobs(allJobs);
  } catch (err) {
    console.error("Error loading jobs:", err);
    jobsList.innerHTML = "❌ Error loading jobs. Please try again.";
  }
}

// ===============================
// DISPLAY JOBS
// ===============================
async function displayJobs(jobs) {
  if (jobs.length === 0) {
    jobsList.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobsList.innerHTML = "";
  for (const job of jobs) {
    const div = document.createElement("div");
    div.className = "job-card-compact";
    div.style.background = "#f9f9f9";
    div.style.padding = "12px";
    div.style.marginBottom = "10px";
    div.style.borderRadius = "6px";
    div.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
    div.style.borderLeft = `4px solid ${job.closed ? '#dc3545' : '#28a745'}`;
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.gap = "12px";
    div.style.flexWrap = "wrap";
    
    // Get application count
    const appsSnap = await getDocs(
      query(collection(db, "applications"), where("jobId", "==", job.id))
    );
    const appCount = appsSnap.size;

    const statusBadge = job.closed 
      ? '<span style="background: #dc3545; color: white; padding: 3px 7px; border-radius: 3px; font-size: 0.8rem; font-weight: 600;">Closed</span>'
      : '<span style="background: #28a745; color: white; padding: 3px 7px; border-radius: 3px; font-size: 0.8rem; font-weight: 600;">Active</span>';

    const postedDate = job.datePosted ? new Date(job.datePosted).toLocaleDateString() : "N/A";

    div.innerHTML = `
      <div style="flex: 1; min-width: 250px;">
        <p style="margin: 0; font-weight: 600; color: #0f172a;">${job.title}</p>
        <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #666;"><b>${job.company || "Not specified"}</b></p>
        <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #999;">Posted: ${postedDate}</p>
      </div>
      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; justify-content:flex-end;">
        ${statusBadge}
        <span style="font-size: 0.8rem; color: #666; white-space: nowrap;">${appCount} apps</span>
        <button style="background: #dc3545; color:white; padding:6px 10px; border:none; border-radius:4px; cursor:pointer; font-size:0.85rem;" onclick="deleteJob('${job.id}')">Delete</button>
      </div>
    `;

    jobsList.appendChild(div);
  }
}

// ===============================
// DELETE JOB
// ===============================
window.deleteJob = async (jobId) => {
  if (!confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;

  try {
    await deleteDoc(doc(db, "jobs", jobId));
    alert("Success: Job deleted successfully.");
    await loadJobs();
  } catch (err) {
    console.error(err);
    alert("Error deleting job: " + err.message);
  }
};

// ===============================
// SEARCH & FILTER
// ===============================
searchBtn.addEventListener("click", () => {
  const searchText = searchInput.value.toLowerCase().trim();
  const status = statusFilter.value;

  let filtered = allJobs.filter((job) => {
    const textMatch =
      job.title.toLowerCase().includes(searchText) ||
      job.company.toLowerCase().includes(searchText) ||
      job.description.toLowerCase().includes(searchText);
    
    let statusMatch = true;
    if (status === "active") {
      statusMatch = !job.closed;
    } else if (status === "closed") {
      statusMatch = job.closed;
    }
    
    return textMatch && statusMatch;
  });

  displayJobs(filtered);
});

// Real-time search
searchInput.addEventListener("keyup", () => {
  searchBtn.click();
});

statusFilter.addEventListener("change", () => {
  searchBtn.click();
});

// ===============================
// NAVBAR LOGOUT
// ===============================
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
