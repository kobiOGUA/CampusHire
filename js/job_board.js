// ===============================
// JOB BOARD (Shows Status, Prevents Reapply, Hides Closed Jobs)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ---- Firebase Config ----
const firebaseConfig = {
  apiKey: "AIzaSyA5milUoYfNSMhif0JA7dbw26tyfs2fDpQ",
  authDomain: "campushire-d0dd8.firebaseapp.com",
  projectId: "campushire-d0dd8",
  storageBucket: "campushire-d0dd8.appspot.com",
  messagingSenderId: "448246002591",
  appId: "1:448246002591:web:098670b92661a0a3a283aa",
  measurementId: "G-TFJV87Q6QP",
};

// ---- Init ----
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---- UI ----
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const companyFilter = document.getElementById("companyFilter");
const sortFilter = document.getElementById("sortFilter");
const searchBtn = document.getElementById("searchBtn");
const navProfilePic = document.getElementById("navProfilePic");
const navStudentName = document.getElementById("navStudentName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

let currentUser = null;
let allJobs = [];
let myApplications = [];

// ===============================
// Auth Check
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  
  // Setup navbar
  const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js");
  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (userSnap.exists()) {
    const userData = userSnap.data();
    navStudentName.textContent = userData.name || user.displayName || "";
  }
  
  await loadApplications();
  await loadJobs();
});

// ===============================
// Load Applications for Current User
// ===============================
async function loadApplications() {
  const q = query(collection(db, "applications"), where("userId", "==", currentUser.uid));
  const snap = await getDocs(q);
  myApplications = snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// ===============================
// Load Jobs + Populate Filters
// ===============================
async function loadJobs() {
  jobList.innerHTML = "Loading jobs...";
  const snapshot = await getDocs(collection(db, "jobs"));
  allJobs = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    // Only include jobs that are NOT closed
    if (!data.closed) {
      allJobs.push({ id: docSnap.id, ...data });
    }
  });

  populateCompanyFilter();
  displayJobs(allJobs);
}

// ===============================
// Populate Company Dropdown
// ===============================
function populateCompanyFilter() {
  const companies = [...new Set(allJobs.map((job) => job.company))];
  companyFilter.innerHTML = `<option value="">All Companies</option>`;
  companies.forEach((company) => {
    const opt = document.createElement("option");
    opt.value = company;
    opt.textContent = company;
    companyFilter.appendChild(opt);
  });
}

// ===============================
// Display Jobs (With Status)
// ===============================
function displayJobs(jobs) {
  if (jobs.length === 0) {
    jobList.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobList.innerHTML = "";
  jobs.forEach((job) => {
    const applied = myApplications.find((a) => a.jobId === job.id);
    let statusText = "";
    let disabled = false;

    if (applied) {
      if (job.closed) {
        statusText = "🚫 Job Closed (You Applied)";
      } else {
        statusText = `✅ Applied (Status: ${applied.status})`;
      }
      disabled = true;
    }

    const div = document.createElement("div");
    div.classList.add("job-item");
    div.innerHTML = `
      <b>${job.title}</b> at ${job.company}<br>
      <small>${job.description}</small><br>
      <small>Posted: ${new Date(job.datePosted).toLocaleDateString()}</small><br>
      ${
        disabled
          ? `<button disabled style="background:#aaa;">${statusText}</button>`
          : `<button onclick="applyJob('${job.id}', '${job.recruiterId}', '${job.title}', '${job.company}')">Apply</button>`
      }
      <hr>
    `;
    jobList.appendChild(div);
  });
}

// ===============================
// Search + Filter Logic
// ===============================
searchBtn.addEventListener("click", () => {
  const queryText = searchInput.value.toLowerCase().trim();
  const company = companyFilter.value;
  const sort = sortFilter.value;

  let filtered = allJobs.filter((job) => {
    const textMatch =
      job.title.toLowerCase().includes(queryText) ||
      job.company.toLowerCase().includes(queryText) ||
      job.description.toLowerCase().includes(queryText);
    const companyMatch = company ? job.company === company : true;
    return textMatch && companyMatch;
  });

  // Sorting
  filtered.sort((a, b) => {
    const dateA = new Date(a.datePosted);
    const dateB = new Date(b.datePosted);
    return sort === "recent" ? dateB - dateA : dateA - dateB;
  });

  displayJobs(filtered);
});

// ===============================
// Apply for Job
// ===============================
window.applyJob = async (jobId, recruiterId, title, company) => {
  if (!currentUser) return alert("Please log in.");

  try {
    await addDoc(collection(db, "applications"), {
      userId: currentUser.uid,
      recruiterId,
      jobId,
      title,
      company,
      status: "Pending",
      appliedAt: new Date().toISOString(),
    });

    alert(`✅ You applied for ${title} at ${company}`);
    await loadApplications();
    displayJobs(allJobs);
  } catch (err) {
    console.error(err);
    alert("❌ Error applying: " + err.message);
  }
};

// ===============================
// Navbar Logout
// ===============================
const { signOut } = await import("https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js");
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
