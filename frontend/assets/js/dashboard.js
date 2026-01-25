requireAuth();

const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/admin/test`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    document.getElementById("status").innerText =
      "Backend connected successfully";
  } catch (err) {
    alert("Session expired. Login again.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

loadDashboard();
