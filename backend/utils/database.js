// Database utility functions

const Pricing = require("../models/Pricing");
const Inventory = require("../models/Inventory");
const { logDatabase, logError } = require("./logger");

// Get pricing statistics
exports.getPricingStats = async () => {
  try {
    const totalRecords = await Pricing.countDocuments();
    const avgPrice = await Pricing.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$currentPrice" } } }
    ]);
    
    const highestPrice = await Pricing.findOne().sort({ currentPrice: -1 });
    const lowestPrice = await Pricing.findOne().sort({ currentPrice: 1 });
    
    const stats = {
      totalRecords,
      averagePrice: avgPrice[0]?.avgPrice || 0,
      highestPrice: highestPrice?.currentPrice || 0,
      lowestPrice: lowestPrice?.currentPrice || 0,
      lastUpdated: new Date()
    };
    
    logDatabase("GET_STATS", "pricing", stats);
    return stats;
  } catch (error) {
    logError("Error getting pricing stats", error);
    throw error;
  }
};

// Get inventory statistics
exports.getInventoryStats = async () => {
  try {
    const totalItems = await Inventory.countDocuments();
    const totalQuantity = await Inventory.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    
    const outOfStock = await Inventory.countDocuments({ status: "Out of Stock" });
    const lowStock = await Inventory.countDocuments({
      $expr: { $lte: ["$quantity", "$minStockLevel"] }
    });
    
    const stats = {
      totalItems,
      totalQuantity: totalQuantity[0]?.total || 0,
      outOfStock,
      lowStock,
      inStock: totalItems - outOfStock,
      lastUpdated: new Date()
    };
    
    logDatabase("GET_STATS", "inventory", stats);
    return stats;
  } catch (error) {
    logError("Error getting inventory stats", error);
    throw error;
  }
};

// Get pricing by crop across all markets
exports.getPricingComparison = async (cropName) => {
  try {
    const prices = await Pricing.find({ cropName }).sort({ currentPrice: -1 });
    logDatabase("GET_COMPARISON", "pricing", prices);
    return prices;
  } catch (error) {
    logError("Error getting pricing comparison", error);
    throw error;
  }
};

// Get inventory by crop across all warehouses
exports.getInventoryComparison = async (cropName) => {
  try {
    const items = await Inventory.find({ cropName }).sort({ quantity: -1 });
    logDatabase("GET_COMPARISON", "inventory", items);
    return items;
  } catch (error) {
    logError("Error getting inventory comparison", error);
    throw error;
  }
};

// Get price trend for a crop
exports.getPriceTrend = async (cropName, days = 30) => {
  try {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const trend = await Pricing.find({
      cropName,
      createdAt: { $gte: cutoffDate }
    }).sort({ createdAt: 1 });
    
    logDatabase("GET_TREND", "pricing", trend);
    return trend;
  } catch (error) {
    logError("Error getting price trend", error);
    throw error;
  }
};

// Check and alert for critical inventory levels
exports.checkCriticalInventory = async () => {
  try {
    const critical = await Inventory.find({
      $expr: { $lte: ["$quantity", "$minStockLevel"] }
    });
    
    logDatabase("CHECK_CRITICAL", "inventory", critical);
    return critical;
  } catch (error) {
    logError("Error checking critical inventory", error);
    throw error;
  }
};

// Get expiring inventory
exports.getExpiringInventory = async (daysUntilExpiry = 7) => {
  try {
    const futureDate = new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000);
    
    const expiring = await Inventory.find({
      expiryDate: {
        $lte: futureDate,
        $gte: new Date()
      }
    }).sort({ expiryDate: 1 });
    
    logDatabase("GET_EXPIRING", "inventory", expiring);
    return expiring;
  } catch (error) {
    logError("Error getting expiring inventory", error);
    throw error;
  }
};

// Get inventory movement (recent changes)
exports.getInventoryMovement = async (limit = 20) => {
  try {
    const movement = await Inventory.find().sort({ updatedAt: -1 }).limit(limit);
    logDatabase("GET_MOVEMENT", "inventory", movement);
    return movement;
  } catch (error) {
    logError("Error getting inventory movement", error);
    throw error;
  }
};

// Generate pricing report
exports.generatePricingReport = async (market = null) => {
  try {
    const query = market ? { market } : {};
    const data = await Pricing.find(query);
    
    const report = {
      generatedAt: new Date(),
      market: market || "all",
      totalCrops: data.length,
      data: data,
      averagePrice: data.reduce((sum, p) => sum + p.currentPrice, 0) / data.length || 0
    };
    
    logDatabase("GENERATE_REPORT", "pricing", report);
    return report;
  } catch (error) {
    logError("Error generating pricing report", error);
    throw error;
  }
};

// Generate inventory report
exports.generateInventoryReport = async (warehouse = null) => {
  try {
    const query = warehouse ? { warehouse } : {};
    const data = await Inventory.find(query);
    
    const report = {
      generatedAt: new Date(),
      warehouse: warehouse || "all",
      totalItems: data.length,
      totalQuantity: data.reduce((sum, i) => sum + i.quantity, 0),
      data: data,
      stats: {
        inStock: data.filter(i => i.status === "In Stock").length,
        outOfStock: data.filter(i => i.status === "Out of Stock").length,
        damaged: data.filter(i => i.status === "Damaged").length
      }
    };
    
    logDatabase("GENERATE_REPORT", "inventory", report);
    return report;
  } catch (error) {
    logError("Error generating inventory report", error);
    throw error;
  }
};
