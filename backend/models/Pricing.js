const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  previousPrice: {
    type: Number
  },
  minPrice: {
    type: Number
  },
  maxPrice: {
    type: Number
  },
  unit: {
    type: String,
    default: "per kg"
  },
  market: {
    type: String,
    required: true
  },
  priceChangePercentage: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pricing", pricingSchema);
