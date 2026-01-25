# API Integration & Frontend Guide

## Summary of Changes Made

### 1. **Updated JavaScript Files**

#### `frontend/assets/js/pricing.js`
- ✅ Now connects to `/api/pricing` endpoints
- Functions available:
  - `loadPricing()` - Fetch all pricing data from database
  - `displayPricing()` - Render pricing in table format
  - `createPricing()` - Add new pricing record
  - `editPrice(id)` - Update price for a crop
  - `deletePrice(id)` - Remove pricing record
  - Auto-loads on page load

#### `frontend/assets/js/inventory.js`
- ✅ Now connects to `/api/inventory` endpoints
- Functions available:
  - `loadInventory()` - Fetch all inventory from database
  - `displayInventory()` - Render inventory in table format
  - `createInventoryItem()` - Add new inventory item
  - `reduceInventory(id)` - Reduce stock (for sales)
  - `restockInventory(id)` - Add stock (for refilling)
  - `deleteInventory(id)` - Remove inventory item
  - `getInventoryStats()` - Get inventory statistics
  - Auto-loads on page load

### 2. **Updated HTML Pages**

#### `frontend/admin/pricing.html`
- ✅ Added form to create pricing records
- ✅ Dynamic table that displays data from API
- Form fields:
  - Crop Name (required)
  - Current Price (required)
  - Previous Price
  - Min Price
  - Max Price
  - Market (required)

#### `frontend/admin/inventry.html`
- ✅ Added form to create inventory items
- ✅ Dynamic table that displays data from API
- Form fields:
  - Crop Name (required)
  - Quantity (required)
  - Warehouse (required)
  - Location
  - Batch Number
  - Quality (Good/Average/Poor)
  - Min Stock Level

---

## How to Use

### Testing the APIs

1. **Start MongoDB** (first terminal):
```powershell
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

2. **Start Backend** (second terminal):
```powershell
cd c:\Users\adity\Desktop\onkar_leader\admin-panel\backend
npm start
```

3. **Open Postman** and test endpoints:
```
POST http://localhost:5000/api/pricing
POST http://localhost:5000/api/inventory
GET http://localhost:5000/api/pricing
GET http://localhost:5000/api/inventory
```

### Using Frontend

1. **Open pricing.html** in browser
   - Fill the form with pricing details
   - Click "➕ Add Pricing"
   - Table updates automatically
   - Use Edit/Delete buttons for each record

2. **Open inventry.html** in browser
   - Fill the form with inventory details
   - Click "➕ Add Inventory Item"
   - Table updates automatically
   - Use Reduce/Restock/Delete buttons

---

## Required Data for API Calls

### Pricing API
```json
{
  "cropName": "Rice",
  "currentPrice": 50,
  "previousPrice": 45,
  "minPrice": 40,
  "maxPrice": 60,
  "unit": "per kg",
  "market": "Delhi Market"
}
```

### Inventory API
```json
{
  "cropName": "Rice",
  "quantity": 1000,
  "unit": "kg",
  "warehouse": "Main Warehouse",
  "location": "Shelf A-1",
  "batchNumber": "BATCH-001",
  "harvestDate": "2026-01-15",
  "quality": "Good",
  "minStockLevel": 100
}
```

---

## Frontend Features

### Pricing Features
- Create new crop pricing
- View all pricing records
- Update pricing by crop name
- Delete pricing records
- Auto-calculate price change percentage
- Filter by market or crop

### Inventory Features
- Create new inventory items
- View all inventory with status
- Reduce stock (for sales)
- Restock items
- Track quality status (Good/Average/Poor)
- Monitor stock levels
- Delete inventory records
- View inventory statistics

---

## 3. ADD MORE FEATURES (Future Enhancements)

### Possible Features to Add:

1. **Search & Filter**
```javascript
async function filterPricingByMarket(market) {
  const res = await fetch(`${API_BASE}/pricing/market/${market}`);
  // Display filtered results
}
```

2. **Export to CSV**
```javascript
function exportToCSV(data, filename) {
  const csv = data.map(item => 
    Object.values(item).join(',')
  ).join('\n');
  // Download CSV
}
```

3. **Charts & Analytics**
- Price trend graphs
- Inventory usage charts
- Stock level alerts

4. **Notifications**
- Low stock alerts
- Price change notifications
- Expiry date warnings

5. **Bulk Operations**
- Update multiple prices at once
- Bulk inventory adjustments

6. **Reports**
- Daily/Weekly pricing reports
- Inventory consumption reports
- Revenue analytics

---

## Notes
- Token from login is stored in `localStorage`
- All API calls use Bearer token for authentication
- Prices calculated automatically
- Inventory status updates based on quantity

---

**Setup Complete!** You can now:
✅ Create pricing records
✅ Manage inventory
✅ Track stock levels
✅ View pricing trends
