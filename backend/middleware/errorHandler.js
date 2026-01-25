// Global error handling middleware

exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Mongoose cast error (invalid ID)
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format"
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "Duplicate entry: This record already exists"
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token has expired"
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error"
  });
};

// Not found middleware
exports.notFound = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`
  });
};

// Success response formatter
exports.sendSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data
  });
};

// Error response formatter
exports.sendError = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    status: "error",
    message,
    errors
  });
};
