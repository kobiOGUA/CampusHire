// ===============================
// ADMIN DASHBOARD (Protected + User/Job Counts)
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc
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

// 🔹 UI
const adminName = document.getElementById("adminName");
const adminEmail = document.getElementById("adminEmail");
const studentCount = document.getElementById("studentCount");
const recruiterCount = document.getElementById("recruiterCount");
const jobCount = document.getElementById("jobCount");
const applicationCount = document.getElementById("applicationCount");
const recentActivity = document.getElementById("recentActivity");
const platformInsights = document.getElementById("platformInsights");
const logoutBtn = document.getElementById("logoutBtn");
const navAdminName = document.getElementById("navAdminName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

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
    alert("Unauthorized. Admin access only.");
    window.location.href = "login.html";
    return;
  }

  adminEmail.textContent = user.email;
  
  // Load admin name for navbar
  const adminRef = doc(db, "users", user.uid);
  const adminSnap = await getDoc(adminRef);
  if (adminSnap.exists()) {
    navAdminName.textContent = adminSnap.data().name || "Admin";
  }
  
  await loadCounts(user.uid);
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
// LOAD DASHBOARD COUNTS
// ===============================
async function loadCounts(adminUid) {
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const jobsSnap = await getDocs(collection(db, "jobs"));
    const appsSnap = await getDocs(collection(db, "applications"));

    let students = 0, recruiters = 0, adminUser = "Admin";
    const recentUsers = [];

    usersSnap.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.role === "student") students++;
      if (d.role === "recruiter") recruiters++;
      if (docSnap.id === adminUid) adminUser = d.name || "Admin";
      
      recentUsers.push({
        name: d.name || "Unknown",
        role: d.role,
        email: d.email,
        createdAt: d.createdAt
      });
    });

    studentCount.textContent = students;
    recruiterCount.textContent = recruiters;
    jobCount.textContent = jobsSnap.size;
    applicationCount.textContent = appsSnap.size;
    adminName.textContent = adminUser;
    navAdminName.textContent = adminUser;

    // Load recent activity
    loadRecentActivity(recentUsers, jobsSnap, appsSnap);
    
    // Load platform insights
    loadPlatformInsights(students, recruiters, jobsSnap.size, appsSnap.size);
  } catch (err) {
    console.error("Error loading counts:", err);
    studentCount.textContent = recruiterCount.textContent = jobCount.textContent = "Error";
  }
}

// ===============================
// RECENT ACTIVITY
// ===============================
function loadRecentActivity(users, jobsSnap, appsSnap) {
  const sorted = users
    .filter(u => u.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (sorted.length === 0) {
    recentActivity.innerHTML = "<p class='small'>No recent activity.</p>";
    return;
  }

  recentActivity.innerHTML = "";
  sorted.forEach(u => {
    const date = new Date(u.createdAt).toLocaleDateString();
    const div = document.createElement("div");
    div.style.padding = "10px 0";
    div.style.borderBottom = "1px solid #eee";
    div.innerHTML = `<p style="margin: 0; font-size: 0.95rem;"><b>${u.name}</b> (${u.role}) joined on <b>${date}</b></p>`;
    recentActivity.appendChild(div);
  });
}

// ===============================
// PLATFORM INSIGHTS
// ===============================
function loadPlatformInsights(students, recruiters, jobCount, appCount) {
  const avgAppsPerJob = jobCount > 0 ? (appCount / jobCount).toFixed(1) : 0;
  
  platformInsights.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
      <div style="padding: 12px; background: #fafafa; border-radius: 6px;">
        <p style="margin: 0; color: #666; font-size: 0.9rem;">Student Engagement</p>
        <p style="margin: 8px 0; font-size: 1.3rem; font-weight: 700; color: #0b6cff;">${students} <span style="font-size: 0.9rem; color: #999;">students</span></p>
      </div>
      <div style="padding: 12px; background: #fafafa; border-radius: 6px;">
        <p style="margin: 0; color: #666; font-size: 0.9rem;">Recruiter Activity</p>
        <p style="margin: 8px 0; font-size: 1.3rem; font-weight: 700; color: #764ba2;">${recruiters} <span style="font-size: 0.9rem; color: #999;">recruiters</span></p>
      </div>
      <div style="padding: 12px; background: #fafafa; border-radius: 6px;">
        <p style="margin: 0; color: #666; font-size: 0.9rem;">Jobs & Opportunities</p>
        <p style="margin: 8px 0; font-size: 1.3rem; font-weight: 700; color: #22c55e;">${jobCount} <span style="font-size: 0.9rem; color: #999;">jobs</span></p>
      </div>
      <div style="padding: 12px; background: #fafafa; border-radius: 6px;">
        <p style="margin: 0; color: #666; font-size: 0.9rem;">Application Average</p>
        <p style="margin: 8px 0; font-size: 1.3rem; font-weight: 700; color: #f59e0b;">${avgAppsPerJob} <span style="font-size: 0.9rem; color: #999;">per job</span></p>
      </div>
    </div>
  `;
}

// ===============================
// LOGOUT
// ===============================
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
