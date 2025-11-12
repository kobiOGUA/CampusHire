// ===============================
// STUDENT PROFILE SETUP
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
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
const profileSetupForm = document.getElementById("profileSetupForm");
const saveProfileBtn = document.getElementById("saveProfileBtn");
const skipBtn = document.getElementById("skipBtn");
const statusMsg = document.getElementById("statusMsg");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

// Form inputs
const aboutInput = document.getElementById("aboutMe");
const skillsInput = document.getElementById("skills");
const phoneInput = document.getElementById("phone");
const linkedinInput = document.getElementById("linkedin");
const githubInput = document.getElementById("github");
const schoolInput = document.getElementById("school");
const degreeInput = document.getElementById("degree");
const gradYearInput = document.getElementById("gradYear");

let currentUser = null;

// Auth check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  await loadExistingProfile();
  updateProgress();
});

// Load existing profile data if any
async function loadExistingProfile() {
  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    aboutInput.value = data.aboutMe || "";
    skillsInput.value = data.skills || "";
    phoneInput.value = data.phone || "";
    linkedinInput.value = data.linkedin || "";
    githubInput.value = data.github || "";
    schoolInput.value = data.school || "";
    degreeInput.value = data.degree || "";
    gradYearInput.value = data.gradYear || "";
  }
}

// Calculate progress
function calculateProgress() {
  const fields = [
    aboutInput.value.trim(),
    skillsInput.value.trim(),
    phoneInput.value.trim(),
    linkedinInput.value.trim(),
    githubInput.value.trim(),
    schoolInput.value.trim(),
    degreeInput.value.trim(),
    gradYearInput.value.trim(),
  ];
  
  const filled = fields.filter(f => f.length > 0).length;
  const total = fields.length;
  return Math.round((filled / total) * 100);
}

// Update progress bar and icons
function updateProgress() {
  const percent = calculateProgress();
  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent;

  // Update section icons
  updateSectionIcon("about-icon", aboutInput.value.trim());
  updateSectionIcon("skills-icon", skillsInput.value.trim());
  updateSectionIcon("contact-icon", (phoneInput.value + linkedinInput.value + githubInput.value).trim());
  updateSectionIcon("education-icon", (schoolInput.value + degreeInput.value + gradYearInput.value).trim());
}

function updateSectionIcon(iconId, fieldValue) {
  const icon = document.getElementById(iconId);
  if (fieldValue) {
    icon.textContent = "✓";
    icon.style.color = "var(--success)";
  } else {
    icon.textContent = "○";
    icon.style.color = "var(--muted)";
  }
}

// Listen for input changes
[aboutInput, skillsInput, phoneInput, linkedinInput, githubInput, schoolInput, degreeInput, gradYearInput].forEach(input => {
  input.addEventListener("input", updateProgress);
});

// Save profile
profileSetupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  statusMsg.textContent = "Saving...";
  statusMsg.className = "status-msg";

  const data = {
    aboutMe: aboutInput.value.trim(),
    skills: skillsInput.value.trim(),
    phone: phoneInput.value.trim(),
    linkedin: linkedinInput.value.trim(),
    github: githubInput.value.trim(),
    school: schoolInput.value.trim(),
    degree: degreeInput.value.trim(),
    gradYear: gradYearInput.value.trim(),
    profileSetupComplete: true,
    profileSetupCompletedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "users", currentUser.uid), data, { merge: true });
    statusMsg.textContent = "Profile saved successfully!";
    statusMsg.className = "status-msg success";
    
    setTimeout(() => {
      window.location.href = "student_dashboard.html";
    }, 1500);
  } catch (err) {
    statusMsg.textContent = "Error saving profile: " + err.message;
    statusMsg.className = "status-msg error";
  }
});

// Skip for now
skipBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  try {
    await setDoc(doc(db, "users", currentUser.uid), {
      profileSetupComplete: true,
      profileSetupSkippedAt: new Date().toISOString(),
    }, { merge: true });
    
    window.location.href = "student_dashboard.html";
  } catch (err) {
    console.error("Error marking setup as skipped:", err);
  }
});
