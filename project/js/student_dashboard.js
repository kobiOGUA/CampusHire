// ===============================
// STUDENT DASHBOARD – Profile + CV + Application Status
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase Config
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

// Elements
const nameEl = document.getElementById("studentName");
const emailEl = document.getElementById("studentEmail");
const profileImage = document.getElementById("profileImage");
const profileInput = document.getElementById("profileImageInput");
const aboutInput = document.getElementById("aboutMe");
const skillsInput = document.getElementById("skills");
const phoneInput = document.getElementById("phone");
const linkedinInput = document.getElementById("linkedin");
const githubInput = document.getElementById("github");
const addressInput = document.getElementById("address");
const schoolInput = document.getElementById("school");
const degreeInput = document.getElementById("degree");
const gradYearInput = document.getElementById("gradYear");
const gpaInput = document.getElementById("gpa");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const durationInput = document.getElementById("duration");
const workDescriptionInput = document.getElementById("workDescription");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const profileStatus = document.getElementById("profileStatus");
const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");
const cvInput = document.getElementById("cvUpload");
const cvList = document.getElementById("cvList");
const logoutBtn = document.getElementById("logoutBtn");
const myApplications = document.getElementById("myApplications");

let currentUser = null;

// ---------------------------
// AUTH
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  nameEl.textContent = user.displayName || "";
  emailEl.textContent = user.email || "";

  await loadStudentInfo();
  await loadCVs();
  await loadApplications();
});

// ---------------------------
// LOAD STUDENT PROFILE
async function loadStudentInfo() {
  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { name: currentUser.displayName || "", email: currentUser.email, role: "student" });
    return;
  }
  const data = snap.data();

  profileImage.src = data.profilePicBase64 || "https://via.placeholder.com/120";
  aboutInput.value = data.aboutMe || "";
  skillsInput.value = data.skills || "";
  phoneInput.value = data.phone || "";
  linkedinInput.value = data.linkedin || "";
  githubInput.value = data.github || "";
  addressInput.value = data.address || "";
  schoolInput.value = data.school || "";
  degreeInput.value = data.degree || "";
  gradYearInput.value = data.gradYear || "";
  gpaInput.value = data.gpa || "";
  companyInput.value = data.company || "";
  roleInput.value = data.role || "";
  durationInput.value = data.duration || "";
  workDescriptionInput.value = data.workDescription || "";
}

// ---------------------------
// SAVE PROFILE
saveProfileBtn.addEventListener("click", async () => {
  if (!currentUser) return;
  profileStatus.textContent = "Saving...";

  const data = {
    aboutMe: aboutInput.value.trim(),
    skills: skillsInput.value.trim(),
    profilePicBase64: profileImage.src,
    phone: phoneInput.value.trim(),
    linkedin: linkedinInput.value.trim(),
    github: githubInput.value.trim(),
    address: addressInput.value.trim(),
    school: schoolInput.value.trim(),
    degree: degreeInput.value.trim(),
    gradYear: gradYearInput.value.trim(),
    gpa: gpaInput.value.trim(),
    company: companyInput.value.trim(),
    role: roleInput.value.trim(),
    duration: durationInput.value.trim(),
    workDescription: workDescriptionInput.value.trim(),
  };

  await setDoc(doc(db, "users", currentUser.uid), data, { merge: true });
  profileStatus.textContent = "✅ Profile updated successfully!";
});

// ---------------------------
// CV UPLOAD
uploadBtn.addEventListener("click", () => {
  const file = cvInput.files[0];
  if (!file) return (uploadStatus.textContent = "Please select a CV first.");
  uploadStatus.textContent = "Uploading...";

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target.result;
    const sizeKB = Math.ceil((base64.length * 3) / 4 / 1024);
    if (sizeKB > 900) return (uploadStatus.textContent = "❌ CV too large.");

    await addDoc(collection(db, "studentCVs"), {
      userId: currentUser.uid,
      name: file.name,
      base64CV: base64,
      uploadedAt: new Date().toISOString()
    });
    uploadStatus.textContent = "✅ CV uploaded!";
    await loadCVs();
  };
  reader.readAsDataURL(file);
});

// ---------------------------
// LOAD CVS
async function loadCVs() {
  const snap = await getDocs(collection(db, "studentCVs"));
  cvList.innerHTML = "";
  snap.forEach((d) => {
    const data = d.data();
    if (data.userId === currentUser.uid) {
      const div = document.createElement("div");
      div.innerHTML = `📎 <a href="${data.base64CV}" download="${data.name}" target="_blank">${data.name}</a>`;
      cvList.appendChild(div);
    }
  });
}

// ---------------------------
// LOAD APPLICATION STATUSES (fixed)
async function loadApplications() {
  if (!currentUser) return;
  myApplications.innerHTML = "Loading...";

  try {
    const q = query(collection(db, "applications"), where("userId", "==", currentUser.uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      myApplications.innerHTML = "<i>No applications yet.</i>";
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
        status === "Shortlisted" ? "green" :
        status === "Rejected" ? "red" :
        status === "Contacted" ? "blue" : "gray";

      const div = document.createElement("div");
      div.innerHTML = `
        <div style="border:1px solid #ddd;padding:10px;margin:5px;border-radius:6px;">
          <b>${title}</b> at ${company}<br>
          <small>Applied: ${appliedDate}</small><br>
          <b>Status:</b> <span style="color:${color}">${status}</span>
        </div>`;
      myApplications.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading applications:", err);
    myApplications.innerHTML = "❌ Could not load applications. Please try again.";
  }
}

// ---------------------------
// LOGOUT
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
