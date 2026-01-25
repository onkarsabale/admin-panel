const API_BASE = "http://localhost:5000/api";
let token = localStorage.getItem("token");
let allPricing = [];

// Load all pricing data from API
async function loadPricing() {
  try {
    const res = await fetch(`${API_BASE}/pricing`);
    
    if (!res.ok) {
      console.error("Failed to load pricing");
      return;
    }
    
    allPricing = await res.json();
    displayPricing();
  } catch (error) {
    console.error("Error loading pricing:", error);
    alert("Error loading pricing data");
  }
}

// Display pricing in table
function displayPricing() {
  const table = document.getElementById("pricingTable") || document.querySelector("tbody");
  
  if (!table) {
    console.warn("Pricing table not found");
    return;
  }
  
  table.innerHTML = "";
  
  allPricing.forEach(price => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${price.cropName}</td>
      <td>₹${price.currentPrice}</td>
      <td>₹${price.previousPrice || "N/A"}</td>
      <td>₹${price.minPrice || "N/A"}</td>
      <td>₹${price.maxPrice || "N/A"}</td>
      <td>${price.market}</td>
      <td>${price.priceChangePercentage?.toFixed(2)}%</td>
      <td>
        <button onclick="editPrice('${price._id}')" class="btn btn-sm btn-warning">Edit</button>
        <button onclick="deletePrice('${price._id}')" class="btn btn-sm btn-danger">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Create new pricing
async function createPricing() {
  const cropName = document.getElementById("cropName")?.value;
  const currentPrice = parseFloat(document.getElementById("currentPrice")?.value);
  const previousPrice = parseFloat(document.getElementById("previousPrice")?.value);
  const minPrice = parseFloat(document.getElementById("minPrice")?.value);
  const maxPrice = parseFloat(document.getElementById("maxPrice")?.value);
  const market = document.getElementById("market")?.value;
  
  if (!cropName || !currentPrice || !market) {
    alert("Please fill all required fields");
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/pricing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        cropName,
        currentPrice,
        previousPrice,
        minPrice,
        maxPrice,
        market
      })
    });
    
    if (!res.ok) {
      const error = await res.json();
      alert("Error: " + error.message);
      return;
    }
    
    alert("Pricing created successfully!");
    document.getElementById("pricingForm")?.reset();
    loadPricing();
  } catch (error) {
    console.error("Error creating pricing:", error);
    alert("Error creating pricing");
  }
}

// Delete pricing
async function deletePrice(id) {
  if (!confirm("Are you sure you want to delete this pricing?")) return;
  
  try {
    const res = await fetch(`${API_BASE}/pricing/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      alert("Error deleting pricing");
      return;
    }
    
    alert("Pricing deleted successfully!");
    loadPricing();
  } catch (error) {
    console.error("Error deleting pricing:", error);
  }
}

// Edit pricing
async function editPrice(id) {
  const price = allPricing.find(p => p._id === id);
  if (!price) return;
  
  const newPrice = prompt("Enter new price:", price.currentPrice);
  if (newPrice === null) return;
  
  try {
    const res = await fetch(`${API_BASE}/pricing/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPrice: parseFloat(newPrice),
        previousPrice: price.currentPrice,
        minPrice: price.minPrice,
        maxPrice: price.maxPrice,
        market: price.market
      })
    });
    
    if (!res.ok) {
      alert("Error updating pricing");
      return;
    }
    
    alert("Pricing updated successfully!");
    loadPricing();
  } catch (error) {
    console.error("Error updating pricing:", error);
  }
}

// Load pricing on page load
document.addEventListener("DOMContentLoaded", loadPricing);


function updateSerialNumbers() {
    let rows = document.querySelectorAll("#priceTable tbody tr");
    rows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;
        row.cells[0].className = "serial";
    });
}

function addProduct() {
    if (!isAuthorized) {
        alert("Access Denied! Unlock first.");
        return;
    }

    let product = prompt("Enter product name:");
    let current = prompt("Enter current price:");
    let suggested = prompt("Enter suggested price:");

    if (!product || !current || !suggested) return;

    if (isNaN(current) || current <= 0 || isNaN(suggested) || suggested <= 0) {
        alert("Price must be a positive number");
        return;
    }

    let tbody = document.querySelector("#priceTable tbody");

    let row = document.createElement("tr");
    row.innerHTML = `
        <td class="serial"></td>
        <td>${product}</td>
        <td>${current}</td>
        <td>
            <button onclick="changePrice(this,-1)">−</button>
            <span class="suggested">${suggested}</span>
            <button onclick="changePrice(this,1)">+</button>
        </td>
    `;

    tbody.appendChild(row);
    updateSerialNumbers();
    priceChanged = true;
    logActivity("Added new product");
}


function deleteProducts() {
    if (!isAuthorized) {
        alert("Access Denied! Unlock first.");
        return;
    }

    let rows = document.querySelectorAll("#priceTable tbody tr");
    let header = document.getElementById("selectHeader");

    if (!deleteMode) {
        header.innerText = "Select";
        rows.forEach(row => {
            row.cells[0].innerHTML = `<input type="checkbox">`;
            row.cells[0].className = "";
        });
        deleteMode = true;
        return;
    }

    let deleted = false;

    rows.forEach(row => {
        let checkbox = row.cells[0].querySelector("input");
        if (checkbox && checkbox.checked) {
            row.remove();
            deleted = true;
        }
    });

    if (!deleted) {
        alert("Select at least one item to delete");
        return;
    }

    header.innerText = "S.No";
    deleteMode = false;
    updateSerialNumbers();
    logActivity("Deleted product");

}
window.addEventListener("pagehide", function () {
    if (priceChanged) {
        alert("✅ Changes saved successfully");
        priceChanged = false;
    }
});
function logActivity(actionText) {
    let tbody = document.querySelector("#activityTable tbody");
    activityCount++;

    let now = new Date().toLocaleString();

    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${activityCount}</td>
        <td>${CURRENT_ADMIN}</td>
        <td>${actionText}</td>
        <td>${now}</td>
    `;

    tbody.appendChild(row);
}


