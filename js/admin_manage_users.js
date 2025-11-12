// ===============================
// ADMIN MANAGE USERS
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
const usersList = document.getElementById("usersList");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const searchBtn = document.getElementById("searchBtn");
const navAdminName = document.getElementById("navAdminName");
const navLogoutBtn = document.getElementById("navLogoutBtn");

let allUsers = [];
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
  
  await loadUsers();
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
// LOAD ALL USERS
// ===============================
async function loadUsers() {
  try {
    usersList.innerHTML = "Loading users...";
    const snapshot = await getDocs(collection(db, "users"));
    allUsers = [];

    snapshot.forEach((docSnap) => {
      allUsers.push({ id: docSnap.id, ...docSnap.data() });
    });

    displayUsers(allUsers);
  } catch (err) {
    console.error("Error loading users:", err);
  usersList.innerHTML = "Error loading users. Please try again.";
  }
}

// ===============================
// DISPLAY USERS
// ===============================
function displayUsers(users) {
  if (users.length === 0) {
    usersList.innerHTML = "<p>No users found.</p>";
    return;
  }

  usersList.innerHTML = "";
  users.forEach((user) => {
    const div = document.createElement("div");
    div.className = "user-card-compact";
    div.style.background = "#f9f9f9";
    div.style.color = "#333";
    div.style.padding = "12px";
    div.style.marginBottom = "10px";
    div.style.borderRadius = "6px";
    div.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
    div.style.borderLeft = `4px solid ${getRoleColor(user.role)}`;
    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";
    div.style.gap = "12px";
    div.style.flexWrap = "wrap";

    let deleteBtn = "";
    if (user.role !== "admin") {
      deleteBtn = `<button style="background:#dc3545; color:white; padding:6px 10px; border:none; border-radius:4px; cursor:pointer; font-size:0.85rem;" onclick="deleteUser('${user.id}')">Delete</button>`;
    }

    const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A";
    
    let companySection = "";
    if (user.role === "recruiter" && user.companyName) {
      companySection = `<span style="font-size:0.85rem; color:#666;">📍 ${user.companyName}</span>`;
    }

    div.innerHTML = `
      <div style="flex: 1; min-width: 200px;">
        <p style="margin: 0; font-weight: 600; color:#0f172a;">${user.name || "Not set"}</p>
        <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #999;">${user.email || "Not set"}</p>
        ${companySection}
      </div>
      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; justify-content:flex-end;">
        <span style="background: ${getRoleColor(user.role)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; white-space: nowrap;">${user.role}</span>
        <span style="font-size: 0.8rem; color: #666; white-space: nowrap;">Joined: ${createdAt}</span>
        ${deleteBtn}
      </div>
    `;

    usersList.appendChild(div);
  });
}

// ===============================
// GET ROLE COLOR
// ===============================
function getRoleColor(role) {
  switch(role) {
    case "student": return "#667eea";
    case "recruiter": return "#764ba2";
    case "admin": return "#28a745";
    default: return "#6c757d";
  }
}

// ===============================
// DELETE USER
// ===============================
window.deleteUser = async (userId) => {
  if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

  try {
    await deleteDoc(doc(db, "users", userId));
  alert("Success: User deleted successfully.");
    await loadUsers();
  } catch (err) {
    console.error(err);
  alert("Error deleting user: " + err.message);
  }
};

// ===============================
// SEARCH & FILTER
// ===============================
searchBtn.addEventListener("click", () => {
  const searchText = searchInput.value.toLowerCase().trim();
  const role = roleFilter.value;

  let filtered = allUsers.filter((user) => {
    const textMatch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText);
    const roleMatch = role ? user.role === role : true;
    return textMatch && roleMatch;
  });

  displayUsers(filtered);
});

// Real-time search
searchInput.addEventListener("keyup", () => {
  searchBtn.click();
});

roleFilter.addEventListener("change", () => {
  searchBtn.click();
});

// ===============================
// NAVBAR LOGOUT
// ===============================
navLogoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
