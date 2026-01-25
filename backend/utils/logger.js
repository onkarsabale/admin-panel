const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, message, data = null) => {
  return {
    timestamp: getTimestamp(),
    level,
    message,
    data: data || {}
  };
};

// Log to file
const logToFile = (filename, logData) => {
  const filepath = path.join(logsDir, filename);
  const logEntry = JSON.stringify(logData) + "\n";
  
  fs.appendFileSync(filepath, logEntry, "utf8");
};

// Log API requests
exports.logRequest = (req, res, next) => {
  const logData = formatLog("INFO", "API Request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id || "anonymous"
  });
  
  logToFile("requests.log", logData);
  next();
};

// Log pricing operations
exports.logPricingOperation = (operation, data, userId = null) => {
  const logData = formatLog("INFO", `Pricing ${operation}`, {
    operation,
    cropName: data.cropName,
    price: data.currentPrice,
    market: data.market,
    userId: userId || "system"
  });
  
  logToFile("pricing.log", logData);
  console.log(`[Pricing] ${operation}: ${data.cropName}`);
};

// Log inventory operations
exports.logInventoryOperation = (operation, data, userId = null) => {
  const logData = formatLog("INFO", `Inventory ${operation}`, {
    operation,
    cropName: data.cropName,
    quantity: data.quantity,
    warehouse: data.warehouse,
    userId: userId || "system"
  });
  
  logToFile("inventory.log", logData);
  console.log(`[Inventory] ${operation}: ${data.cropName}`);
};

// Log errors
exports.logError = (message, error, context = {}) => {
  const logData = formatLog("ERROR", message, {
    ...context,
    error: error.message,
    stack: error.stack
  });
  
  logToFile("errors.log", logData);
  console.error(`[ERROR] ${message}:`, error.message);
};

// Log database operations
exports.logDatabase = (operation, collection, result) => {
  const logData = formatLog("INFO", `Database ${operation}`, {
    operation,
    collection,
    recordCount: Array.isArray(result) ? result.length : 1,
    timestamp: getTimestamp()
  });
  
  logToFile("database.log", logData);
};

// Get logs by type
exports.getLogs = (filename, limit = 100) => {
  const filepath = path.join(logsDir, filename);
  
  if (!fs.existsSync(filepath)) {
    return [];
  }
  
  const content = fs.readFileSync(filepath, "utf8");
  const lines = content.trim().split("\n");
  
  return lines.slice(-limit).map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  }).filter(log => log !== null);
};

// Clear old logs (older than days)
exports.clearOldLogs = (filename, days = 7) => {
  const filepath = path.join(logsDir, filename);
  
  if (!fs.existsSync(filepath)) {
    return;
  }
  
  const content = fs.readFileSync(filepath, "utf8");
  const lines = content.trim().split("\n");
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const filteredLines = lines.filter(line => {
    try {
      const log = JSON.parse(line);
      return new Date(log.timestamp) > cutoffDate;
    } catch (e) {
      return true;
    }
  });
  
  fs.writeFileSync(filepath, filteredLines.join("\n") + "\n", "utf8");
};
