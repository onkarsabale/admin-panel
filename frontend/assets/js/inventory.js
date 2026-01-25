const API_BASE = "http://localhost:5000/api";
let token = localStorage.getItem("token");
let allInventory = [];

// Load all inventory data from API
async function loadInventory() {
  try {
    const res = await fetch(`${API_BASE}/inventory`);
    
    if (!res.ok) {
      console.error("Failed to load inventory");
      return;
    }
    
    allInventory = await res.json();
    displayInventory();
  } catch (error) {
    console.error("Error loading inventory:", error);
    alert("Error loading inventory data");
  }
}

// Display inventory in table
function displayInventory() {
  const table = document.getElementById("inventoryTable") || document.querySelector("tbody");
  
  if (!table) {
    console.warn("Inventory table not found");
    return;
  }
  
  table.innerHTML = "";
  
  allInventory.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.cropName}</td>
      <td>${item.quantity} ${item.unit}</td>
      <td>${item.warehouse}</td>
      <td>${item.location || "N/A"}</td>
      <td>${item.batchNumber || "N/A"}</td>
      <td><span class="badge badge-${item.quality === 'Good' ? 'success' : 'warning'}">${item.quality}</span></td>
      <td><span class="badge badge-${item.status === 'In Stock' ? 'success' : 'danger'}">${item.status}</span></td>
      <td>
        <button onclick="reduceInventory('${item._id}')" class="btn btn-sm btn-warning">Reduce</button>
        <button onclick="restockInventory('${item._id}')" class="btn btn-sm btn-info">Restock</button>
        <button onclick="deleteInventory('${item._id}')" class="btn btn-sm btn-danger">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Create new inventory item
async function createInventoryItem() {
  const cropName = document.getElementById("cropName")?.value;
  const quantity = parseFloat(document.getElementById("quantity")?.value);
  const warehouse = document.getElementById("warehouse")?.value;
  const location = document.getElementById("location")?.value;
  const batchNumber = document.getElementById("batchNumber")?.value;
  const quality = document.getElementById("quality")?.value;
  const minStockLevel = parseFloat(document.getElementById("minStockLevel")?.value);
  
  if (!cropName || !quantity || !warehouse) {
    alert("Please fill all required fields");
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/inventory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        cropName,
        quantity,
        unit: "kg",
        warehouse,
        location,
        batchNumber,
        quality,
        minStockLevel: minStockLevel || 0
      })
    });
    
    if (!res.ok) {
      const error = await res.json();
      alert("Error: " + error.message);
      return;
    }
    
    alert("Inventory item created successfully!");
    document.getElementById("inventoryForm")?.reset();
    loadInventory();
  } catch (error) {
    console.error("Error creating inventory:", error);
    alert("Error creating inventory");
  }
}

// Reduce inventory quantity
async function reduceInventory(id) {
  const quantity = prompt("Enter quantity to reduce:");
  if (quantity === null) return;
  
  try {
    const res = await fetch(`${API_BASE}/inventory/${id}/reduce`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantityToReduce: parseFloat(quantity) })
    });
    
    if (!res.ok) {
      const error = await res.json();
      alert("Error: " + error.message);
      return;
    }
    
    alert("Inventory reduced successfully!");
    loadInventory();
  } catch (error) {
    console.error("Error reducing inventory:", error);
  }
}

// Restock inventory
async function restockInventory(id) {
  const quantity = prompt("Enter quantity to add:");
  if (quantity === null) return;
  
  try {
    const res = await fetch(`${API_BASE}/inventory/${id}/restock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantityToAdd: parseFloat(quantity) })
    });
    
    if (!res.ok) {
      const error = await res.json();
      alert("Error: " + error.message);
      return;
    }
    
    alert("Inventory restocked successfully!");
    loadInventory();
  } catch (error) {
    console.error("Error restocking inventory:", error);
  }
}

// Delete inventory item
async function deleteInventory(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;
  
  try {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      alert("Error deleting inventory");
      return;
    }
    
    alert("Inventory item deleted successfully!");
    loadInventory();
  } catch (error) {
    console.error("Error deleting inventory:", error);
  }
}

// Get inventory statistics
async function getInventoryStats() {
  try {
    const res = await fetch(`${API_BASE}/inventory/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      alert("Error loading statistics");
      return;
    }
    
    const stats = await res.json();
    alert(`
      Total Items: ${stats.totalItems}
      Out of Stock: ${stats.outOfStock}
      Low Stock: ${stats.lowStock}
      Total Quantity: ${stats.totalQuantity} kg
    `);
  } catch (error) {
    console.error("Error getting stats:", error);
  }
}

// Load inventory on page load
document.addEventListener("DOMContentLoaded", loadInventory);
