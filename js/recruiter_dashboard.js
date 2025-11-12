console.log("Recruiter Dashboard Connected ✅");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc
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

const recruiterName = document.getElementById("recruiterName");
const recruiterEmail = document.getElementById("recruiterEmail");
const companyNameDisplay = document.getElementById("companyNameDisplay");
const jobTitleInput = document.getElementById("jobTitle");
const companyNameInput = document.getElementById("companyName");
const jobDescriptionInput = document.getElementById("jobDescription");
const postJobBtn = document.getElementById("postJobBtn");
const jobStatus = document.getElementById("jobStatus");
const myJobs = document.getElementById("myJobs");
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
  recruiterEmail.textContent = user.email;
  await loadRecruiterProfile();
  await loadMyJobs();
});

async function loadRecruiterProfile() {
  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const d = snap.data();
    recruiterName.textContent = d.name || "Not set";
    navRecruiterName.textContent = d.name || "Recruiter";
    companyNameDisplay.textContent = d.companyName || "Not set";
  }
}

// =============== POST JOB ==================
postJobBtn.addEventListener("click", async () => {
  const title = jobTitleInput.value.trim();
  const description = jobDescriptionInput.value.trim();
  let company = companyNameInput.value.trim();

  if (!title || !description) {
    jobStatus.textContent = "⚠️ Enter job title and description.";
    return;
  }

  if (!company) {
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    if (snap.exists()) company = snap.data().companyName || "";
  }

  try {
    await addDoc(collection(db, "jobs"), {
      recruiterId: currentUser.uid,
      title,
      company,
      description,
      closed: false,
      datePosted: new Date().toISOString(),
    });

    jobStatus.textContent = "✅ Job posted!";
    jobTitleInput.value = "";
    jobDescriptionInput.value = "";
    companyNameInput.value = "";
    await loadMyJobs();
  } catch (err) {
    console.error(err);
    jobStatus.textContent = "❌ Error posting job.";
  }
});

// =============== LOAD JOBS ==================
async function loadMyJobs() {
  myJobs.innerHTML = "Loading...";
  const q = query(collection(db, "jobs"), where("recruiterId", "==", currentUser.uid));
  const snap = await getDocs(q);

  if (snap.empty) {
    myJobs.innerHTML = "<i>No jobs posted yet.</i>";
    return;
  }

  myJobs.innerHTML = "";
  for (const docSnap of snap.docs) {
    const job = docSnap.data();
    const jobId = docSnap.id;
    const statusLabel = job.closed ? "❌ (Closed)" : "✅ (Active)";

    const appsSnap = await getDocs(query(collection(db, "applications"), where("jobId", "==", jobId)));
    const applicantCount = appsSnap.size;

    const div = document.createElement("div");
    div.className = "job-item";
    div.innerHTML = `
      <h3>${job.title} ${statusLabel}</h3>
      <p><b>Company:</b> ${job.company}</p>
      <p>${job.description}</p>
      <small>Posted: ${new Date(job.datePosted).toLocaleDateString()}</small><br>
      <button class="view-btn" data-job="${jobId}">👀 View ${applicantCount} Applicants</button>
      ${
        !job.closed
          ? `<button class="close-btn" data-job="${jobId}" style="background:#d9534f;">❌ Close Job</button>`
          : ""
      }
      <hr>
    `;
    myJobs.appendChild(div);
  }

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const jobId = btn.dataset.job;
      viewApplicants(jobId);
    });
  });

  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", () => closeJob(btn.dataset.job));
  });
}

// =============== CLOSE JOB ==================
async function closeJob(jobId) {
  if (!confirm("Are you sure you want to close this job posting?")) return;

  try {
    await updateDoc(doc(db, "jobs", jobId), { closed: true });
    alert("✅ Job closed successfully.");
    await loadMyJobs();
  } catch (err) {
    console.error(err);
    alert("❌ Error closing job: " + err.message);
  }
}

// =============== VIEW APPLICANTS ==================
async function viewApplicants(jobId) {
  // Navigate to the dedicated applicants page with the job ID
  window.location.href = `recruiter_applicants.html?jobId=${jobId}`;
}

// =============== LOGOUT ==================
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
