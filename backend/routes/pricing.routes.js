const express = require("express");
const router = express.Router();

const pricingController = require("../controllers/pricing.controller");
const authMiddleware = require("../middleware/authMiddleware");

// GET all crops with prices
router.get(
  "/crops",
  authMiddleware,
  pricingController.getCropsWithPrices
);

// UPDATE / SET crop price
router.patch(
  "/crops/:crop",
  authMiddleware,
  pricingController.setCropPrice
);

module.exports = router;
