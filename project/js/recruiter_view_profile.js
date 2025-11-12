import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA5milUoYfNSMhif0JA7dbw26tyfs2fDpQ",
  authDomain: "campushire-d0dd8.firebaseapp.com",
  projectId: "campushire-d0dd8",
  storageBucket: "campushire-d0dd8.appspot.com",
  messagingSenderId: "448246002591",
  appId: "1:448246002591:web:098670b92661a0a3a283aa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔗 Get URL parameters
const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");
const jobId = params.get("job");

const container = document.getElementById("profileDetails");
const statusMsg = document.getElementById("statusMsg");

console.log("✅ Recruiter view loaded with:", { studentId, jobId });

// -----------------------------
// 🧭 Load student profile
// -----------------------------
if (!studentId || studentId === "undefined" || studentId === "null") {
  container.textContent = "❌ No student ID provided in URL.";
} else {
  loadProfile();
}

async function loadProfile() {
  try {
    const ref = doc(db, "users", studentId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      container.textContent = "⚠️ Student not found.";
      return;
    }

    const d = snap.data();

    // Get CV if available
    const cvSnap = await getDocs(
      query(collection(db, "studentCVs"), where("userId", "==", studentId))
    );
    let cvLink = "";
    cvSnap.forEach((cv) => (cvLink = cv.data().base64CV || cvLink));

    // Get current application status
    let currentStatus = "Pending";
    if (jobId) {
      const appsSnap = await getDocs(
        query(
          collection(db, "applications"),
          where("jobId", "==", jobId),
          where("userId", "==", studentId)
        )
      );
      if (!appsSnap.empty) {
        const appData = appsSnap.docs[0].data();
        currentStatus = appData.status || "Pending";
      }
    }

    // Render profile
    container.innerHTML = `
      <img src="${d.profilePicBase64 || "https://via.placeholder.com/120"}" width="100" style="border-radius:50%">
      <h3>${d.name || "Unnamed Student"}</h3>
      <p><b>Email:</b> ${d.email || "N/A"}</p>
      <p><b>Phone:</b> ${d.phone || "N/A"}</p>
      <p><b>LinkedIn:</b> ${
        d.linkedin ? `<a href="${d.linkedin}" target="_blank">${d.linkedin}</a>` : "N/A"
      }</p>
      <p><b>GitHub:</b> ${
        d.github ? `<a href="${d.github}" target="_blank">${d.github}</a>` : "N/A"
      }</p>
      <p><b>Address:</b> ${d.address || "N/A"}</p>
      <hr>
      <p><b>Education:</b> ${d.degree || "N/A"} at ${d.school || "N/A"} (${d.gradYear || ""}) GPA: ${
      d.gpa || "N/A"
    }</p>
      <p><b>Experience:</b> ${d.role || "N/A"} at ${d.company || "N/A"} (${d.duration || "N/A"})</p>
      <p>${d.workDescription || ""}</p>
      <p><b>Skills:</b> ${d.skills || "N/A"}</p>
      <p><b>About:</b> ${d.aboutMe || "N/A"}</p>
      <p>${cvLink ? `<a href="${cvLink}" target="_blank">📄 View CV</a>` : "No CV uploaded"}</p>
      <hr>
      ${
        jobId
          ? `
        <label>Status: </label>
        <select id="statusSelect">
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Contacted">Contacted</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button id="updateBtn">Update Status</button>
      `
          : "<p><i>No job selected — status unavailable.</i></p>"
      }
    `;

    // Set dropdown to current status
    const statusSelect = document.getElementById("statusSelect");
    if (statusSelect) statusSelect.value = currentStatus;

    // Update button handler
    const updateBtn = document.getElementById("updateBtn");
    if (updateBtn) {
      updateBtn.addEventListener("click", async () => {
        const newStatus = statusSelect.value;
        const appsSnap = await getDocs(
          query(
            collection(db, "applications"),
            where("jobId", "==", jobId),
            where("userId", "==", studentId)
          )
        );

        if (appsSnap.empty) {
          alert("Application not found.");
          return;
        }

        for (const docSnap of appsSnap.docs) {
          await updateDoc(doc(db, "applications", docSnap.id), { status: newStatus });
        }

        statusMsg.textContent = `✅ Status updated to ${newStatus}`;
      });
    }
  } catch (err) {
    console.error("❌ Error loading profile:", err);
    container.textContent = "Error loading profile.";
  }
}

// -----------------------------
// 🔙 Back to recruiter dashboard
// -----------------------------
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "recruiter_dashboard.html";
});
