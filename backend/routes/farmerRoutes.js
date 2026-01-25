const express = require("express");
const router = express.Router();

const {
  createFarmer,
  getFarmers
} = require("../controllers/farmerController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createFarmer);
router.get("/", authMiddleware, getFarmers);

module.exports = router;
