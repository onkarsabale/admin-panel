const Inventory = require("../models/Inventory");

// Create new inventory record
exports.createInventory = async (req, res) => {
  try {
    const { cropName, quantity, unit, warehouse, location, batchNumber, harvestDate, expiryDate, quality, minStockLevel } = req.body;

    const inventory = new Inventory({
      cropName,
      quantity,
      unit,
      warehouse,
      location,
      batchNumber,
      harvestDate,
      expiryDate,
      quality,
      minStockLevel,
      status: quantity > 0 ? "In Stock" : "Out of Stock"
    });

    await inventory.save();
    res.status(201).json({ message: "Inventory created successfully", inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all inventory records
exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory by crop name
exports.getInventoryByCrop = async (req, res) => {
  try {
    const { cropName } = req.params;
    const inventory = await Inventory.find({ cropName });

    if (inventory.length === 0) {
      return res.status(404).json({ message: "No inventory found for this crop" });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory by warehouse
exports.getInventoryByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const inventory = await Inventory.find({ warehouse });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get low stock inventory
exports.getLowStockInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({
      $expr: { $lte: ["$quantity", "$minStockLevel"] }
    }).sort({ quantity: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update inventory record
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, quality, status, expiryDate, location } = req.body;

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      {
        quantity,
        quality,
        status: quantity > 0 ? "In Stock" : "Out of Stock",
        expiryDate,
        location,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.json({ message: "Inventory updated successfully", inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reduce inventory quantity (for sales/usage)
exports.reduceInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityToReduce } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    if (inventory.quantity < quantityToReduce) {
      return res.status(400).json({ message: "Insufficient inventory" });
    }

    inventory.quantity -= quantityToReduce;
    inventory.status = inventory.quantity > 0 ? "In Stock" : "Out of Stock";
    inventory.updatedAt = Date.now();
    
    await inventory.save();
    res.json({ message: "Inventory reduced successfully", inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increase inventory quantity (for restocking)
exports.restockInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityToAdd } = req.body;

    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    inventory.quantity += quantityToAdd;
    inventory.status = "In Stock";
    inventory.lastRestocked = Date.now();
    inventory.updatedAt = Date.now();
    
    await inventory.save();
    res.json({ message: "Inventory restocked successfully", inventory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete inventory record
exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByIdAndDelete(id);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    res.json({ message: "Inventory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory statistics
exports.getInventoryStats = async (req, res) => {
  try {
    const totalItems = await Inventory.countDocuments();
    const outOfStock = await Inventory.countDocuments({ status: "Out of Stock" });
    const lowStock = await Inventory.countDocuments({
      $expr: { $lte: ["$quantity", "$minStockLevel"] }
    });
    const totalQuantity = await Inventory.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    res.json({
      totalItems,
      outOfStock,
      lowStock,
      totalQuantity: totalQuantity[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
