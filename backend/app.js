const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const app = express();

const farmerRoutes = require("./routes/farmerRoutes");
const pricingRoutes = require("./routes/pricingRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

app.use("/api/farmers", farmerRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/inventory", inventoryRoutes);


app.use(cors());
app.use(express.json());

// routes
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
