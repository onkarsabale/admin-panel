const Pricing = require("../models/Pricing");

// Create new pricing record
exports.createPricing = async (req, res) => {
  try {
    const { cropName, currentPrice, previousPrice, minPrice, maxPrice, unit, market } = req.body;

    // Calculate price change percentage
    let priceChangePercentage = 0;
    if (previousPrice) {
      priceChangePercentage = ((currentPrice - previousPrice) / previousPrice) * 100;
    }

    const pricing = new Pricing({
      cropName,
      currentPrice,
      previousPrice,
      minPrice,
      maxPrice,
      unit,
      market,
      priceChangePercentage
    });

    await pricing.save();
    res.status(201).json({ message: "Pricing created successfully", pricing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all pricing records
exports.getAllPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find().sort({ lastUpdated: -1 });
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pricing by crop name
exports.getPricingByCrop = async (req, res) => {
  try {
    const { cropName } = req.params;
    const pricing = await Pricing.findOne({ cropName });

    if (!pricing) {
      return res.status(404).json({ message: "Pricing not found" });
    }

    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update pricing record
exports.updatePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPrice, previousPrice, minPrice, maxPrice, market } = req.body;

    // Calculate price change percentage if previous price is provided
    let priceChangePercentage = 0;
    if (previousPrice) {
      priceChangePercentage = ((currentPrice - previousPrice) / previousPrice) * 100;
    }

    const pricing = await Pricing.findByIdAndUpdate(
      id,
      {
        currentPrice,
        previousPrice,
        minPrice,
        maxPrice,
        market,
        priceChangePercentage,
        lastUpdated: Date.now()
      },
      { new: true }
    );

    if (!pricing) {
      return res.status(404).json({ message: "Pricing not found" });
    }

    res.json({ message: "Pricing updated successfully", pricing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete pricing record
exports.deletePricing = async (req, res) => {
  try {
    const { id } = req.params;
    const pricing = await Pricing.findByIdAndDelete(id);

    if (!pricing) {
      return res.status(404).json({ message: "Pricing not found" });
    }

    res.json({ message: "Pricing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pricing by market
exports.getPricingByMarket = async (req, res) => {
  try {
    const { market } = req.params;
    const pricing = await Pricing.find({ market }).sort({ lastUpdated: -1 });
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
