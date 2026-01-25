const express = require("express");
const router = express.Router();

const {
  createPricing,
  getAllPricing,
  getPricingByCrop,
  getPricingByMarket,
  updatePricing,
  deletePricing
} = require("../controllers/pricingController");

const authMiddleware = require("../middleware/authMiddleware");

// Create pricing record
router.post("/", authMiddleware, createPricing);

// Get all pricing records
router.get("/", getAllPricing);

// Get pricing by market
router.get("/market/:market", getPricingByMarket);

// Get pricing by crop name
router.get("/crop/:cropName", getPricingByCrop);

// Update pricing record
router.put("/:id", authMiddleware, updatePricing);

// Delete pricing record
router.delete("/:id", authMiddleware, deletePricing);

module.exports = router;
