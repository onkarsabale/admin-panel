fetch("http://localhost:5000/admin/inventory")
  .then(res => res.json())
  .then(items => {
    const tbody = document.getElementById("inventoryTable");
    tbody.innerHTML = "";

    items.forEach(item => {
      const statusClass = item.availableQty > 0 ? "status-available" : "status-out";
      const statusText = item.availableQty > 0 ? "Available" : "Out of Stock";

      tbody.innerHTML += `
        <tr>
          <td>${item.crop}</td>
          <td>${item.category || "-"}</td>
          <td>${item.availableQty} kg</td>
          <td>${item.farmerName || "-"}</td>
          <td class="${statusClass}">${statusText}</td>
        </tr>
      `;
    });
  })
  .catch(err => console.error("Inventory error:", err));
