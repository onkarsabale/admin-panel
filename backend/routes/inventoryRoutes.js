const express = require("express");
const router = express.Router();

const {
  createInventory,
  getAllInventory,
  getInventoryByCrop,
  getInventoryByWarehouse,
  getLowStockInventory,
  updateInventory,
  reduceInventory,
  restockInventory,
  deleteInventory,
  getInventoryStats
} = require("../controllers/inventoryController");

const authMiddleware = require("../middleware/authMiddleware");

// Create inventory record
router.post("/", authMiddleware, createInventory);

// Get all inventory records
router.get("/", getAllInventory);

// Get inventory statistics
router.get("/stats", authMiddleware, getInventoryStats);

// Get low stock inventory
router.get("/low-stock", authMiddleware, getLowStockInventory);

// Get inventory by crop
router.get("/crop/:cropName", getInventoryByCrop);

// Get inventory by warehouse
router.get("/warehouse/:warehouse", getInventoryByWarehouse);

// Update inventory record
router.put("/:id", authMiddleware, updateInventory);

// Reduce inventory quantity
router.post("/:id/reduce", authMiddleware, reduceInventory);

// Restock inventory
router.post("/:id/restock", authMiddleware, restockInventory);

// Delete inventory record
router.delete("/:id", authMiddleware, deleteInventory);

module.exports = router;
