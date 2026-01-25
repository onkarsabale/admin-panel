// Input validation utilities

exports.validatePricing = (data) => {
  const errors = [];

  if (!data.cropName || data.cropName.trim() === "") {
    errors.push("Crop name is required");
  }

  if (typeof data.currentPrice !== "number" || data.currentPrice <= 0) {
    errors.push("Current price must be a positive number");
  }

  if (data.minPrice && data.maxPrice && data.minPrice > data.maxPrice) {
    errors.push("Min price cannot be greater than max price");
  }

  if (data.currentPrice && data.minPrice && data.currentPrice < data.minPrice) {
    errors.push("Current price cannot be less than min price");
  }

  if (data.currentPrice && data.maxPrice && data.currentPrice > data.maxPrice) {
    errors.push("Current price cannot be greater than max price");
  }

  if (!data.market || data.market.trim() === "") {
    errors.push("Market is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

exports.validateInventory = (data) => {
  const errors = [];

  if (!data.cropName || data.cropName.trim() === "") {
    errors.push("Crop name is required");
  }

  if (typeof data.quantity !== "number" || data.quantity < 0) {
    errors.push("Quantity must be a non-negative number");
  }

  if (!data.warehouse || data.warehouse.trim() === "") {
    errors.push("Warehouse is required");
  }

  if (data.minStockLevel && data.minStockLevel < 0) {
    errors.push("Min stock level cannot be negative");
  }

  const validQualities = ["Good", "Average", "Poor"];
  if (data.quality && !validQualities.includes(data.quality)) {
    errors.push("Quality must be Good, Average, or Poor");
  }

  const validStatuses = ["In Stock", "Out of Stock", "Damaged"];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push("Status must be In Stock, Out of Stock, or Damaged");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

exports.validateQuantityOperation = (currentQuantity, quantity) => {
  const errors = [];

  if (typeof quantity !== "number" || quantity <= 0) {
    errors.push("Quantity must be a positive number");
  }

  if (currentQuantity < quantity) {
    errors.push("Insufficient inventory for this operation");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
