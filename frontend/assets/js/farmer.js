requireAuth();

const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function loadFarmers() {
  try {
    const res = await fetch(`${API_BASE}/farmers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const farmers = await res.json();

    const table = document.getElementById("farmersTable");
    table.innerHTML = "";

    farmers.forEach(f => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${f.name}</td>
        <td>${f.phone}</td>
        <td>${f.location}</td>
      `;
      table.appendChild(row);
    });
  } catch (err) {
    alert("Failed to load farmers");
  }
}

loadFarmers();
