const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: "kg"
  },
  warehouse: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  batchNumber: {
    type: String
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  quality: {
    type: String,
    enum: ["Good", "Average", "Poor"],
    default: "Good"
  },
  status: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Damaged"],
    default: "In Stock"
  },
  minStockLevel: {
    type: Number,
    default: 0
  },
  lastRestocked: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Inventory", inventorySchema);
