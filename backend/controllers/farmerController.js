const Farmer = require("../models/Farmer");

// CREATE farmer
exports.createFarmer = async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    if (!name || !phone || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const farmer = await Farmer.create({ name, phone, location });
    res.status(201).json(farmer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET all farmers
exports.getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
