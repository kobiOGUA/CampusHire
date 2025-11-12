import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

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

const jobTitleHeader = document.getElementById("jobTitleHeader");
const applicantList = document.getElementById("applicantList");
const navRecruiterName = document.getElementById("navRecruiterName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

const params = new URLSearchParams(window.location.search);
const jobId = params.get("job") || params.get("jobId");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }
  
  // Update navbar with recruiter name
  const recruiterDoc = await getDoc(doc(db, "users", user.uid));
  if (recruiterDoc.exists()) {
    navRecruiterName.textContent = recruiterDoc.data().name || "Recruiter";
  }
  
  loadApplicants(jobId);
});

async function loadApplicants(jobId) {
  if (!jobId) {
    applicantList.textContent = "No job ID found.";
    return;
  }

  applicantList.textContent = "Loading applicants...";

  const jobDoc = await getDoc(doc(db, "jobs", jobId));
  if (jobDoc.exists()) {
    const job = jobDoc.data();
    jobTitleHeader.textContent = `Applicants for ${job.title} at ${job.company}`;
  }

  const q = query(collection(db, "applications"), where("jobId", "==", jobId));
  const snap = await getDocs(q);

  if (snap.empty) {
    applicantList.textContent = "No applicants yet.";
    return;
  }

  applicantList.innerHTML = "";
  for (const docSnap of snap.docs) {
    const app = docSnap.data();

    const studentRef = doc(db, "users", app.userId);
    const studentSnap = await getDoc(studentRef);
    const student = studentSnap.exists() ? studentSnap.data() : {};

    const div = document.createElement("div");
    div.classList.add("applicant-card");
    div.innerHTML = `
      <img src="${student.profilePicBase64 || "https://via.placeholder.com/80"}"
           width="60" style="border-radius:50%">
      <b>${student.name || "Unnamed Student"}</b><br>
      <small>${student.email || ""}</small><br>
      <button onclick="window.location.href='recruiter_view_profile.html?id=${app.userId}&job=${jobId}'">
        📄 View Full Profile
      </button>
      <hr>
    `;
    applicantList.appendChild(div);
  }
}

// Navbar logout
const { signOut } = await import("https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js");
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
