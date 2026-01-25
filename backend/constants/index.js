module.exports = {
  PRICING: {
    MIN_PRICE: 0,
    MAX_PRICE: 100000,
    DEFAULT_UNIT: "per kg",
    UNITS: ["per kg", "per ton", "per piece", "per liter"]
  },

  INVENTORY: {
    UNITS: ["kg", "ton", "piece", "liter", "bag"],
    QUALITY_LEVELS: ["Good", "Average", "Poor"],
    STATUSES: ["In Stock", "Out of Stock", "Damaged"],
    DEFAULT_QUALITY: "Good",
    DEFAULT_STATUS: "In Stock"
  },

  MESSAGES: {
    PRICING: {
      CREATE_SUCCESS: "Pricing created successfully",
      UPDATE_SUCCESS: "Pricing updated successfully",
      DELETE_SUCCESS: "Pricing deleted successfully",
      NOT_FOUND: "Pricing record not found"
    },
    INVENTORY: {
      CREATE_SUCCESS: "Inventory created successfully",
      UPDATE_SUCCESS: "Inventory updated successfully",
      DELETE_SUCCESS: "Inventory deleted successfully",
      REDUCE_SUCCESS: "Inventory reduced successfully",
      RESTOCK_SUCCESS: "Inventory restocked successfully",
      NOT_FOUND: "Inventory record not found",
      INSUFFICIENT_STOCK: "Insufficient inventory for this operation"
    }
  },

  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100
  }
};
