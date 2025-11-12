// ===============================
// ADMIN REPORTS & ANALYTICS
// ===============================

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
const totalStudents = document.getElementById("totalStudents");
const totalRecruiters = document.getElementById("totalRecruiters");
const totalJobs = document.getElementById("totalJobs");
const totalApplications = document.getElementById("totalApplications");
const activeJobs = document.getElementById("activeJobs");
const closedJobs = document.getElementById("closedJobs");
const avgApplications = document.getElementById("avgApplications");
const pendingApps = document.getElementById("pendingApps");
const shortlistedApps = document.getElementById("shortlistedApps");
const contactedApps = document.getElementById("contactedApps");
const rejectedApps = document.getElementById("rejectedApps");
const topRecruiters = document.getElementById("topRecruiters");
const topJobs = document.getElementById("topJobs");
const navAdminName = document.getElementById("navAdminName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

// Report generator elements
const reportType = document.getElementById("reportType");
const reportFilter = document.getElementById("reportFilter");
const filterCol = document.getElementById("filterCol");
const generateReportBtn = document.getElementById("generateReportBtn");
const reportOutput = document.getElementById("reportOutput");

let currentUser = null;
let allUsers = [];
let allJobs = [];
let allApplications = [];

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
  
  await loadReports();
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
// LOAD ALL REPORTS
// ===============================
async function loadReports() {
  try {
    // Load users
    const usersSnap = await getDocs(collection(db, "users"));
    allUsers = [];
    let students = 0, recruiters = 0;
    const recruiterStats = {};

    usersSnap.forEach((docSnap) => {
      const d = docSnap.data();
      allUsers.push({ id: docSnap.id, ...d });
      if (d.role === "student") students++;
      if (d.role === "recruiter") {
        recruiters++;
        recruiterStats[docSnap.id] = { id: docSnap.id, name: d.name, email: d.email, jobCount: 0 };
      }
    });

    totalStudents.textContent = students;
    totalRecruiters.textContent = recruiters;

    // Load jobs
    const jobsSnap = await getDocs(collection(db, "jobs"));
    allJobs = [];
    let active = 0, closed = 0;
    const jobStats = {};

    jobsSnap.forEach((docSnap) => {
      const d = docSnap.data();
      allJobs.push({ id: docSnap.id, ...d });
      if (d.closed) {
        closed++;
      } else {
        active++;
      }

      jobStats[docSnap.id] = { id: docSnap.id, title: d.title, company: d.company, appCount: 0 };

      // Count jobs per recruiter
      if (recruiterStats[d.recruiterId]) {
        recruiterStats[d.recruiterId].jobCount++;
      }
    });

    totalJobs.textContent = jobsSnap.size;
    activeJobs.textContent = active;
    closedJobs.textContent = closed;

    // Load applications
    const appsSnap = await getDocs(collection(db, "applications"));
    allApplications = [];
    let pending = 0, shortlisted = 0, contacted = 0, rejected = 0;

    appsSnap.forEach((docSnap) => {
      const d = docSnap.data();
      allApplications.push({ id: docSnap.id, ...d });
      const status = d.status || "Pending";

      if (status === "Pending") pending++;
      if (status === "Shortlisted") shortlisted++;
      if (status === "Contacted") contacted++;
      if (status === "Rejected") rejected++;

      // Count applications per job
      if (jobStats[d.jobId]) {
        jobStats[d.jobId].appCount++;
      }
    });

    totalApplications.textContent = appsSnap.size;
    pendingApps.textContent = pending;
    shortlistedApps.textContent = shortlisted;
    contactedApps.textContent = contacted;
    rejectedApps.textContent = rejected;

    // Average applications per job
    const avgApps = jobsSnap.size > 0 ? (appsSnap.size / jobsSnap.size).toFixed(2) : 0;
    avgApplications.textContent = avgApps;

    // Display top recruiters
    displayTopRecruiters(recruiterStats);

    // Display top jobs
    displayTopJobs(jobStats);

    // Setup report generator
    setupReportGenerator(recruiterStats);
  } catch (err) {
    console.error("Error loading reports:", err);
  }
}

// ===============================
// DISPLAY TOP RECRUITERS
// ===============================
function displayTopRecruiters(stats) {
  const sorted = Object.values(stats)
    .sort((a, b) => b.jobCount - a.jobCount)
    .slice(0, 5);

  topRecruiters.innerHTML = "";

  if (sorted.length === 0) {
    topRecruiters.innerHTML = "<p><i>No recruiters yet.</i></p>";
    return;
  }

  sorted.forEach((recruiter, index) => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.background = "#f9f9f9";
    div.style.marginBottom = "8px";
    div.style.borderRadius = "6px";
    div.style.borderLeft = "3px solid #667eea";

    div.innerHTML = `
      <b>${index + 1}. ${recruiter.name}</b><br>
      <small>${recruiter.email}</small><br>
      <b>Jobs Posted:</b> ${recruiter.jobCount}
    `;

    topRecruiters.appendChild(div);
  });
}

// ===============================
// DISPLAY TOP JOBS
// ===============================
function displayTopJobs(stats) {
  const sorted = Object.values(stats)
    .sort((a, b) => b.appCount - a.appCount)
    .slice(0, 5);

  topJobs.innerHTML = "";

  if (sorted.length === 0) {
    topJobs.innerHTML = "<p><i>No jobs yet.</i></p>";
    return;
  }

  sorted.forEach((job, index) => {
    const div = document.createElement("div");
    div.style.padding = "10px";
    div.style.background = "#f9f9f9";
    div.style.marginBottom = "8px";
    div.style.borderRadius = "6px";
    div.style.borderLeft = "3px solid #764ba2";

    div.innerHTML = `
      <b>${index + 1}. ${job.title}</b> at ${job.company}<br>
      <b>Applications:</b> ${job.appCount}
    `;

    topJobs.appendChild(div);
  });
}

// ===============================
// SETUP REPORT GENERATOR
// ===============================
function setupReportGenerator(recruiterStats) {
  reportType.addEventListener("change", async () => {
    const type = reportType.value;
    reportFilter.innerHTML = '<option value="">Loading...</option>';
    
    if (type === "general") {
      filterCol.style.display = "none";
      reportFilter.innerHTML = '<option value="">N/A</option>';
    } else if (type === "recruiter") {
      filterCol.style.display = "block";
      reportFilter.innerHTML = '<option value="">Select recruiter</option>';
      Object.values(recruiterStats).forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = r.name || r.email;
        reportFilter.appendChild(opt);
      });
    } else if (type === "student") {
      filterCol.style.display = "block";
      reportFilter.innerHTML = '<option value="">Select student</option>';
      allUsers.filter(u => u.role === "student").forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = u.name || u.email;
        reportFilter.appendChild(opt);
      });
    } else if (type === "company") {
      filterCol.style.display = "block";
      const companies = [...new Set(allJobs.map(j => j.company))].filter(Boolean);
      reportFilter.innerHTML = '<option value="">Select company</option>';
      companies.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        reportFilter.appendChild(opt);
      });
    }
  });

  generateReportBtn.addEventListener("click", () => {
    const type = reportType.value;
    if (!type) {
      alert("Please select a report type.");
      return;
    }
    if (type !== "general" && !reportFilter.value) {
      alert("Please select a target.");
      return;
    }
    generateReport(type, reportFilter.value);
  });
}

// ===============================
// GENERATE REPORT
// ===============================
function generateReport(type, target) {
  let html = `<div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 12px;">`;

  if (type === "general") {
    html += `
      <h3 style="margin-top: 0;">General Site Analytics Report</h3>
      <p><b>Generated:</b> ${new Date().toLocaleString()}</p>
      <hr style="border: none; height: 1px; background: #ddd; margin: 12px 0;">
      <h4>Overall Statistics</h4>
      <table style="width:100%; border-collapse: collapse;">
        <tr style="background: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><b>Metric</b></td>
          <td style="padding: 8px; border: 1px solid #ddd;"><b>Count</b></td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Total Students</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${totalStudents.textContent}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Total Recruiters</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${totalRecruiters.textContent}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Total Jobs</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${totalJobs.textContent}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Total Applications</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${totalApplications.textContent}</td>
        </tr>
      </table>
      <h4 style="margin-top: 16px;">Job Metrics</h4>
      <p>Active Jobs: ${activeJobs.textContent} | Closed Jobs: ${closedJobs.textContent} | Avg Apps/Job: ${avgApplications.textContent}</p>
      <h4>Application Status</h4>
      <p>Pending: ${pendingApps.textContent} | Shortlisted: ${shortlistedApps.textContent} | Contacted: ${contactedApps.textContent} | Rejected: ${rejectedApps.textContent}</p>
    `;
  } else if (type === "recruiter") {
    const recruiter = allUsers.find(u => u.id === target);
    const recruiterJobs = allJobs.filter(j => j.recruiterId === target);
    const jobApps = recruiterJobs.reduce((sum, job) => sum + (allApplications.filter(a => a.jobId === job.id).length), 0);
    html += `
      <h3 style="margin-top: 0;">Recruiter Report: ${recruiter?.name || "N/A"}</h3>
      <p><b>Email:</b> ${recruiter?.email || "N/A"} | <b>Company:</b> ${recruiter?.companyName || "N/A"}</p>
      <p><b>Generated:</b> ${new Date().toLocaleString()}</p>
      <hr style="border: none; height: 1px; background: #ddd; margin: 12px 0;">
      <p><b>Jobs Posted:</b> ${recruiterJobs.length}</p>
      <p><b>Total Applications Received:</b> ${jobApps}</p>
      <h4>Posted Jobs</h4>
      ${recruiterJobs.length > 0 ? recruiterJobs.map(j => `<p>- ${j.title} (${allApplications.filter(a => a.jobId === j.id).length} applications)</p>`).join('') : '<p>No jobs posted.</p>'}
    `;
  } else if (type === "student") {
    const student = allUsers.find(u => u.id === target);
    const studentApps = allApplications.filter(a => a.studentId === target);
    html += `
      <h3 style="margin-top: 0;">Student Report: ${student?.name || "N/A"}</h3>
      <p><b>Email:</b> ${student?.email || "N/A"} | <b>School:</b> ${student?.school || "N/A"}</p>
      <p><b>Generated:</b> ${new Date().toLocaleString()}</p>
      <hr style="border: none; height: 1px; background: #ddd; margin: 12px 0;">
      <p><b>Total Applications:</b> ${studentApps.length}</p>
      <p><b>Shortlisted:</b> ${studentApps.filter(a => a.status === "Shortlisted").length}</p>
      <p><b>Rejected:</b> ${studentApps.filter(a => a.status === "Rejected").length}</p>
      <h4>Applications</h4>
      ${studentApps.length > 0 ? studentApps.map(app => {
        const job = allJobs.find(j => j.id === app.jobId);
        return `<p>- ${job?.title || "N/A"} (Status: ${app.status || "Pending"})</p>`;
      }).join('') : '<p>No applications.</p>'}
    `;
  } else if (type === "company") {
    const companyJobs = allJobs.filter(j => j.company === target);
    const companyApps = companyJobs.reduce((sum, job) => sum + (allApplications.filter(a => a.jobId === job.id).length), 0);
    html += `
      <h3 style="margin-top: 0;">Company Report: ${target}</h3>
      <p><b>Generated:</b> ${new Date().toLocaleString()}</p>
      <hr style="border: none; height: 1px; background: #ddd; margin: 12px 0;">
      <p><b>Jobs Posted:</b> ${companyJobs.length}</p>
      <p><b>Total Applications:</b> ${companyApps}</p>
      <h4>Posted Jobs</h4>
      ${companyJobs.length > 0 ? companyJobs.map(j => `<p>- ${j.title} (${allApplications.filter(a => a.jobId === j.id).length} applications)</p>`).join('') : '<p>No jobs posted.</p>'}
    `;
  }

  html += `<button onclick="window.print()" style="margin-top: 12px; background: var(--primary); color: white; padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer;" class="no-print">Print Report</button></div>`;
  reportOutput.innerHTML = html;
}

// ===============================
// NAVBAR LOGOUT
// ===============================
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

