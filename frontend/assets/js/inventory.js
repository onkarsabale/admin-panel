requireAuth();

const API_BASE = "http://localhost:5000/api";
const token = localStorage.getItem("token");

async function loadInventory() {
  const res = await fetch(`${API_BASE}/inventory`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const items = await res.json();
  const table = document.getElementById("inventoryTable");
  table.innerHTML = "";

  items.forEach(i => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i.name}</td>
      <td>${i.quantity}</td>
      <td>${i.price}</td>
    `;
    table.appendChild(row);
  });
}

loadInventory();
