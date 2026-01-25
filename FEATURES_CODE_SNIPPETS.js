// EXAMPLE CODE FOR ADDING MORE FEATURES

// ===== 1. SEARCH & FILTER FEATURE =====

// Add to pricing.js
async function searchPricingByMarket(market) {
  try {
    const res = await fetch(`${API_BASE}/pricing/market/${market}`);
    if (!res.ok) return;
    
    allPricing = await res.json();
    displayPricing();
  } catch (error) {
    console.error("Error searching pricing:", error);
  }
}

// Add to inventory.js
async function searchInventoryByCrop(cropName) {
  try {
    const res = await fetch(`${API_BASE}/inventory/crop/${cropName}`);
    if (!res.ok) return;
    
    allInventory = await res.json();
    displayInventory();
  } catch (error) {
    console.error("Error searching inventory:", error);
  }
}

// HTML to add
/*
<div style="margin-bottom: 20px;">
  <input type="text" id="searchInput" placeholder="Search by market..." 
    style="padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 6px;">
  <button onclick="searchPricingByMarket(document.getElementById('searchInput').value)">
    🔍 Search
  </button>
</div>
*/

// ===== 2. LOW STOCK ALERTS =====

// Add to inventory.js
async function checkLowStock() {
  try {
    const res = await fetch(`${API_BASE}/inventory/low-stock`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) return;
    const lowStockItems = await res.json();
    
    if (lowStockItems.length > 0) {
      alert(`⚠️ ${lowStockItems.length} items have low stock!`);
      console.warn("Low stock items:", lowStockItems);
    }
  } catch (error) {
    console.error("Error checking low stock:", error);
  }
}

// Call on page load
document.addEventListener("DOMContentLoaded", () => {
  loadInventory();
  checkLowStock();
});

// ===== 3. EXPORT TO CSV =====

function exportPricingToCSV() {
  let csv = 'Crop Name,Current Price,Previous Price,Min Price,Max Price,Market,Change %\n';
  
  allPricing.forEach(price => {
    csv += `${price.cropName},${price.currentPrice},${price.previousPrice},${price.minPrice},${price.maxPrice},${price.market},${price.priceChangePercentage}\n`;
  });
  
  downloadCSV(csv, 'pricing.csv');
}

function exportInventoryToCSV() {
  let csv = 'Crop Name,Quantity,Warehouse,Location,Batch,Quality,Status\n';
  
  allInventory.forEach(item => {
    csv += `${item.cropName},${item.quantity},${item.warehouse},${item.location},${item.batchNumber},${item.quality},${item.status}\n`;
  });
  
  downloadCSV(csv, 'inventory.csv');
}

function downloadCSV(csv, filename) {
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  link.download = filename;
  link.click();
}

// HTML to add buttons
/*
<button onclick="exportPricingToCSV()" style="background: #3498db;">📥 Export CSV</button>
<button onclick="exportInventoryToCSV()" style="background: #3498db;">📥 Export CSV</button>
*/

// ===== 4. BULK UPDATE PRICES =====

async function bulkUpdatePrices(percentageChange) {
  if (!token) {
    alert("Not authorized");
    return;
  }
  
  for (let price of allPricing) {
    const newPrice = price.currentPrice * (1 + percentageChange / 100);
    
    await fetch(`${API_BASE}/pricing/${price._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPrice: newPrice,
        previousPrice: price.currentPrice,
        minPrice: price.minPrice,
        maxPrice: price.maxPrice,
        market: price.market
      })
    });
  }
  
  alert("All prices updated!");
  loadPricing();
}

// HTML to add
/*
<div style="margin: 20px 0;">
  <label>Bulk Update Price Change %:</label>
  <input type="number" id="percentageChange" placeholder="10" style="padding: 8px; width: 100px;">
  <button onclick="bulkUpdatePrices(parseFloat(document.getElementById('percentageChange').value))">
    📊 Apply to All
  </button>
</div>
*/

// ===== 5. INVENTORY STATISTICS DASHBOARD =====

async function displayInventoryStats() {
  try {
    const res = await fetch(`${API_BASE}/inventory/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) return;
    const stats = await res.json();
    
    document.getElementById("totalItems").innerText = stats.totalItems;
    document.getElementById("outOfStock").innerText = stats.outOfStock;
    document.getElementById("lowStock").innerText = stats.lowStock;
    document.getElementById("totalQuantity").innerText = stats.totalQuantity;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
}

// HTML to add
/*
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; margin: 20px 0;">
  <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
    <h3>Total Items</h3>
    <p id="totalItems" style="font-size: 24px; color: #1dbf9f;">0</p>
  </div>
  <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
    <h3>Out of Stock</h3>
    <p id="outOfStock" style="font-size: 24px; color: #e74c3c;">0</p>
  </div>
  <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
    <h3>Low Stock</h3>
    <p id="lowStock" style="font-size: 24px; color: #f39c12;">0</p>
  </div>
  <div style="background: #ecf0f1; padding: 20px; border-radius: 8px; text-align: center;">
    <h3>Total Quantity (kg)</h3>
    <p id="totalQuantity" style="font-size: 24px; color: #3498db;">0</p>
  </div>
</div>
*/

// ===== 6. PRICE COMPARISON BY MARKET =====

async function comparePricesByMarket() {
  try {
    const res = await fetch(`${API_BASE}/pricing`);
    if (!res.ok) return;
    
    const allPrices = await res.json();
    
    // Group by crop name
    const grouped = {};
    allPrices.forEach(price => {
      if (!grouped[price.cropName]) {
        grouped[price.cropName] = [];
      }
      grouped[price.cropName].push(price);
    });
    
    // Display comparison
    Object.entries(grouped).forEach(([crop, prices]) => {
      console.log(`\n${crop}:`);
      prices.forEach(p => {
        console.log(`  ${p.market}: ₹${p.currentPrice}`);
      });
    });
  } catch (error) {
    console.error("Error comparing prices:", error);
  }
}

// ===== 7. PRICE HISTORY TRACKING =====

async function getPricingByCrop(cropName) {
  try {
    const res = await fetch(`${API_BASE}/pricing/crop/${cropName}`);
    if (!res.ok) return;
    
    const pricingHistory = await res.json();
    console.log(`Price history for ${cropName}:`, pricingHistory);
    
    return pricingHistory;
  } catch (error) {
    console.error("Error fetching price history:", error);
  }
}

// ===== 8. EXPIRY DATE ALERTS (for inventory) =====

function checkExpiryDates() {
  const today = new Date();
  const alertDays = 7;
  
  allInventory.forEach(item => {
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= alertDays && daysUntilExpiry > 0) {
        console.warn(`⚠️ ${item.cropName} expires in ${daysUntilExpiry} days!`);
      } else if (daysUntilExpiry <= 0) {
        console.error(`🚨 ${item.cropName} has expired!`);
      }
    }
  });
}

// ===== 9. REAL-TIME AUTO-REFRESH =====

// Add to inventory.js or pricing.js
function startAutoRefresh(intervalSeconds = 30) {
  setInterval(() => {
    console.log("Auto-refreshing data...");
    loadInventory(); // or loadPricing()
  }, intervalSeconds * 1000);
}

// Call on page load
document.addEventListener("DOMContentLoaded", () => {
  loadInventory();
  startAutoRefresh(30); // Refresh every 30 seconds
});

// ===== 10. PRICE CHANGE NOTIFICATIONS =====

async function trackPriceChanges() {
  const previousPrices = JSON.parse(localStorage.getItem("previousPrices")) || {};
  
  allPricing.forEach(price => {
    const key = price.cropName + "_" + price.market;
    const oldPrice = previousPrices[key];
    
    if (oldPrice && oldPrice !== price.currentPrice) {
      const change = ((price.currentPrice - oldPrice) / oldPrice * 100).toFixed(2);
      console.log(`📈 ${price.cropName} changed by ${change}%`);
    }
    
    previousPrices[key] = price.currentPrice;
  });
  
  localStorage.setItem("previousPrices", JSON.stringify(previousPrices));
}

// Call after loading pricing
document.addEventListener("DOMContentLoaded", () => {
  loadPricing();
  setTimeout(() => trackPriceChanges(), 500);
});
