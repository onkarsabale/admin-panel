# Quick Testing Guide

## 1️⃣ TEST PRICING API WITH CURL (PowerShell)

### Create Pricing
```powershell
$body = @{
    cropName = "Rice"
    currentPrice = 50
    previousPrice = 45
    minPrice = 40
    maxPrice = 60
    market = "Delhi Market"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/pricing" -Method POST -Body $body -Headers $headers
```

### Get All Pricing
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/pricing" -Method GET
```

### Get Pricing by Crop
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/pricing/crop/Rice" -Method GET
```

### Get Pricing by Market
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/pricing/market/Delhi%20Market" -Method GET
```

---

## 2️⃣ TEST INVENTORY API WITH CURL (PowerShell)

### Create Inventory Item
```powershell
$body = @{
    cropName = "Rice"
    quantity = 1000
    unit = "kg"
    warehouse = "Main Warehouse"
    location = "Shelf A-1"
    batchNumber = "BATCH-001"
    harvestDate = "2026-01-15"
    quality = "Good"
    minStockLevel = 100
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/inventory" -Method POST -Body $body -Headers $headers
```

### Get All Inventory
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/inventory" -Method GET
```

### Get Inventory Stats
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/inventory/stats" -Method GET -Headers $headers
```

### Get Low Stock Items
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/inventory/low-stock" -Method GET -Headers $headers
```

### Get Inventory by Crop
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/inventory/crop/Rice" -Method GET
```

### Reduce Inventory Stock
```powershell
$body = @{
    quantityToReduce = 100
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

# Replace ITEM_ID with actual ID from inventory
Invoke-RestMethod -Uri "http://localhost:5000/api/inventory/ITEM_ID/reduce" -Method POST -Body $body -Headers $headers
```

### Restock Inventory
```powershell
$body = @{
    quantityToAdd = 500
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

# Replace ITEM_ID with actual ID from inventory
Invoke-RestMethod -Uri "http://localhost:5000/api/inventory/ITEM_ID/restock" -Method POST -Body $body -Headers $headers
```

---

## 3️⃣ TEST WITH BROWSER DIRECTLY

### Open these URLs in your browser:

**For Pricing:**
```
http://localhost:5000/api/pricing
http://localhost:5000/api/pricing/crop/Rice
http://localhost:5000/api/pricing/market/Delhi%20Market
```

**For Inventory:**
```
http://localhost:5000/api/inventory
http://localhost:5000/api/inventory/crop/Rice
http://localhost:5000/api/inventory/warehouse/Main%20Warehouse
```

---

## 4️⃣ TEST WITH POSTMAN

### Step 1: Import Collection
1. Open Postman
2. Create new collection "Pricing & Inventory"

### Step 2: Create Requests

**GET All Pricing**
- Method: GET
- URL: `http://localhost:5000/api/pricing`

**POST Create Pricing**
- Method: POST
- URL: `http://localhost:5000/api/pricing`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
```json
{
  "cropName": "Wheat",
  "currentPrice": 25,
  "previousPrice": 22,
  "minPrice": 20,
  "maxPrice": 30,
  "market": "Mumbai Market"
}
```

**GET All Inventory**
- Method: GET
- URL: `http://localhost:5000/api/inventory`

**POST Create Inventory**
- Method: POST
- URL: `http://localhost:5000/api/inventory`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
```json
{
  "cropName": "Wheat",
  "quantity": 2000,
  "unit": "kg",
  "warehouse": "Secondary Warehouse",
  "location": "Shelf B-2",
  "batchNumber": "BATCH-002",
  "quality": "Average",
  "minStockLevel": 150
}
```

---

## 5️⃣ TEST FRONTEND PAGES

### Open pricing.html
```
1. Open: file:///C:/Users/adity/Desktop/onkar_leader/admin-panel/frontend/admin/pricing.html
2. Fill in form:
   - Crop Name: "Tomato"
   - Current Price: "35"
   - Previous Price: "30"
   - Min Price: "25"
   - Max Price: "45"
   - Market: "Bangalore Market"
3. Click "➕ Add Pricing"
4. Check table - new record appears automatically
```

### Open inventry.html
```
1. Open: file:///C:/Users/adity/Desktop/onkar_leader/admin-panel/frontend/admin/inventry.html
2. Fill in form:
   - Crop Name: "Tomato"
   - Quantity: "500"
   - Warehouse: "Bangalore Warehouse"
   - Location: "Shelf C-3"
   - Batch Number: "BATCH-003"
   - Quality: "Good"
   - Min Stock Level: "50"
3. Click "➕ Add Inventory Item"
4. Check table - new record appears automatically
```

---

## 6️⃣ CHECK DATABASE WITH MONGODB

### Connect to MongoDB
```powershell
& "C:\Program Files\MongoDB\Server\8.2\bin\mongosh.exe"
```

### Commands to check data
```javascript
// Switch to database
use jd_solution

// Check pricing collection
db.pricings.find()

// Check inventory collection
db.inventories.find()

// Count records
db.pricings.countDocuments()
db.inventories.countDocuments()

// Find specific pricing
db.pricings.findOne({ cropName: "Rice" })

// Find low stock inventory
db.inventories.find({ status: "Out of Stock" })
```

---

## 7️⃣ COMMON ISSUES & FIXES

### Issue: "Cannot GET /api/pricing"
**Fix:** Make sure backend is running:
```powershell
cd c:\Users\adity\Desktop\onkar_leader\admin-panel\backend
npm start
```

### Issue: "MongoDB connection error"
**Fix:** Make sure MongoDB is running:
```powershell
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

### Issue: "401 Unauthorized"
**Fix:** You need to login first to get a token. Check admin login page.

### Issue: "Database not found"
**Fix:** The database `jd_solution` will be created automatically on first write.

### Issue: CORS errors
**Fix:** CORS is already enabled in app.js. Make sure you're using correct port (5000).

---

## 8️⃣ EXPECTED RESPONSES

### Successful Pricing Create (201)
```json
{
  "message": "Pricing created successfully",
  "pricing": {
    "_id": "507f1f77bcf86cd799439011",
    "cropName": "Rice",
    "currentPrice": 50,
    "previousPrice": 45,
    "minPrice": 40,
    "maxPrice": 60,
    "unit": "per kg",
    "market": "Delhi Market",
    "priceChangePercentage": 11.11,
    "lastUpdated": "2026-01-25T17:30:00.000Z",
    "createdAt": "2026-01-25T17:30:00.000Z"
  }
}
```

### Successful Inventory Create (201)
```json
{
  "message": "Inventory created successfully",
  "inventory": {
    "_id": "507f1f77bcf86cd799439012",
    "cropName": "Rice",
    "quantity": 1000,
    "unit": "kg",
    "warehouse": "Main Warehouse",
    "location": "Shelf A-1",
    "batchNumber": "BATCH-001",
    "harvestDate": "2026-01-15T00:00:00.000Z",
    "quality": "Good",
    "status": "In Stock",
    "minStockLevel": 100,
    "lastRestocked": null,
    "createdAt": "2026-01-25T17:30:00.000Z",
    "updatedAt": "2026-01-25T17:30:00.000Z"
  }
}
```

---

## 9️⃣ PERFORMANCE TIPS

1. **Cache responses** in localStorage for faster loading
2. **Limit API calls** - Load data once on page load
3. **Pagination** - For large datasets, add pagination
4. **Indexes** - MongoDB creates indexes automatically
5. **Connection pooling** - Already handled by Mongoose

---

## 🔟 NEXT STEPS AFTER TESTING

1. ✅ Test all APIs with Postman
2. ✅ Test frontend pages
3. ✅ Create sample data in database
4. ✅ Add more features from FEATURES_CODE_SNIPPETS.js
5. ✅ Implement search and filters
6. ✅ Add charts and analytics
7. ✅ Set up automated backups
8. ✅ Deploy to production

---

**Ready to test!** Start with step 1️⃣ and work your way through! 🚀
